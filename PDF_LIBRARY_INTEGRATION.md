# 📄 Tích hợp Thư viện PDF để Giữ Nguyên Design CV

## 🎯 Vấn đề hiện tại
Khi export CV, hệ thống mất đi design gốc của file PDF upload, chỉ giữ lại text content.

## 🔧 Các Giải pháp Tích hợp

### 1. 🔹 PDF-LIB (100% FREE, Recommended cho bắt đầu)

**Ưu điểm:**
- ✅ **Hoàn toàn miễn phí**, open-source (MIT License)
- ✅ Không cần license phí
- ✅ Hỗ trợ Next.js/React tốt
- ✅ Có thể modify existing PDF (giữ nguyên layout)
- ✅ Nhẹ, không phụ thuộc native dependencies

**Nhược điểm:**
- ⚠️ API level thấp hơn (cần code nhiều hơn)
- ⚠️ Không có UI editor sẵn
- ⚠️ Khó xử lý PDF phức tạp (nhiều layer, font đặc biệt)

**Cài đặt:**
```bash
npm install pdf-lib
```

**Code mẫu - Load và modify PDF:**
```typescript
// src/app/(features)/support-cv/services/pdfLibEditor.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function modifyExistingPDF(
  pdfBuffer: ArrayBuffer, 
  updates: {
    name?: string;
    email?: string;
    phone?: string;
    // ... other fields
  }
): Promise<Uint8Array> {
  // Load existing PDF
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  
  // Get first page
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  
  // Embed font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Modify text (tìm và replace text fields)
  // Note: pdf-lib không có text search built-in, 
  // cần biết trước tọa độ text field
  
  if (updates.name) {
    firstPage.drawText(updates.name, {
      x: 50,  // Cần tìm tọa độ chính xác
      y: 750,
      size: 14,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
  }
  
  // Save modified PDF
  const modifiedPdfBytes = await pdfDoc.save();
  return modifiedPdfBytes;
}

// Usage in component
export async function editAndExportCV(originalPdfFile: File, cvData: CVData) {
  // Read file
  const arrayBuffer = await originalPdfFile.arrayBuffer();
  
  // Modify
  const modifiedPdf = await modifyExistingPDF(arrayBuffer, {
    name: cvData.personalInfo.fullName,
    email: cvData.personalInfo.email,
    // ... other updates
  });
  
  // Download
  const blob = new Blob([modifiedPdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'modified-cv.pdf';
  link.click();
}
```

**Hạn chế:**
- Khó tìm vị trí text chính xác trong PDF phức tạp
- Cần manually map từng field với coordinates

---

### 2. 🔹 PDFTron SDK (Commercial, Most Powerful)

**Ưu điểm:**
- ✅ **Full-featured PDF editor** trong browser
- ✅ WYSIWYG UI giống Adobe Acrobat
- ✅ Text search & replace tự động
- ✅ Form field detection
- ✅ Giữ 100% design gốc
- ✅ Hỗ trợ annotations, signatures, watermarks

**Nhược điểm:**
- ❌ **License phí** (pricing theo scale)
- ❌ Có free trial nhưng limited
- ❌ Bundle size lớn

**Cài đặt:**
```bash
npm install @pdftron/webviewer
```

**Code mẫu:**
```typescript
// src/app/(features)/support-cv/services/pdftronEditor.ts
import WebViewer from '@pdftron/webviewer';

export async function initPDFTronEditor(
  containerRef: HTMLDivElement,
  pdfUrl: string,
  cvData: CVData
) {
  const instance = await WebViewer(
    {
      path: '/webviewer/lib', // Copy từ node_modules
      initialDoc: pdfUrl,
      licenseKey: process.env.NEXT_PUBLIC_PDFTRON_LICENSE, // Need license
    },
    containerRef
  );

  const { documentViewer, annotationManager, Annotations } = instance.Core;

  documentViewer.addEventListener('documentLoaded', async () => {
    // Search & replace text
    const searchResults = await documentViewer.textSearchInit('OLD_NAME', {
      wholeWord: false,
      caseSensitive: false,
    });

    if (searchResults.length > 0) {
      // Replace với text mới
      const quad = searchResults[0].quads[0];
      // Add annotation để overlay text mới
      const annotation = new Annotations.FreeTextAnnotation({
        PageNumber: searchResults[0].pageNum,
        Rect: quad,
        Contents: cvData.personalInfo.fullName,
      });
      annotationManager.addAnnotation(annotation);
    }

    // Export PDF
    const doc = documentViewer.getDocument();
    const xfdfString = await annotationManager.exportAnnotations();
    const data = await doc.getFileData({ xfdfString });
    const blob = new Blob([data], { type: 'application/pdf' });
    // Download blob...
  });
}
```

**Pricing:**
- Free trial: 50 documents/month
- Paid: Starting ~$500/month (enterprise)

🔗 https://www.pdftron.com/pricing/

---

### 3. 🔹 PSPDFKit (Commercial, Similar to PDFTron)

**Ưu điểm:**
- ✅ Tương tự PDFTron
- ✅ Hỗ trợ Next.js/React tốt
- ✅ Real-time collaboration
- ✅ Form editing, annotations

**Nhược điểm:**
- ❌ License phí
- ❌ Pricing tương đương PDFTron

**Cài đặt:**
```bash
npm install pspdfkit
```

**Code mẫu:**
```typescript
import PSPDFKit from 'pspdfkit';

export async function initPSPDFKit(
  containerRef: HTMLElement,
  pdfUrl: string
) {
  const instance = await PSPDFKit.load({
    container: containerRef,
    document: pdfUrl,
    licenseKey: process.env.NEXT_PUBLIC_PSPDFKIT_LICENSE,
  });

  // Search and replace text
  const searchResults = await instance.search('OLD_TEXT');
  // Modify found text...
  
  // Export
  const arrayBuffer = await instance.exportPDF();
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
  // Download...
}
```

🔗 https://pspdfkit.com/pricing/web/

---

### 4. 🔹 Apache PDFBox (Java Backend, FREE)

Nếu có backend Java, có thể dùng PDFBox (open-source):

```java
// Java backend service
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.text.PDFTextStripper;

public class CVEditor {
    public byte[] modifyCV(byte[] originalPdf, Map<String, String> updates) {
        PDDocument doc = PDDocument.load(originalPdf);
        // Modify using PDFBox APIs
        // ...
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        doc.save(output);
        return output.toByteArray();
    }
}
```

---

## 🎯 Khuyến nghị cho Dự án

### Option A: **PDF-LIB (Recommended để bắt đầu)**

**Khi nào dùng:**
- ✅ Budget limited
- ✅ CV có layout đơn giản
- ✅ Chỉ cần edit basic fields (name, email, phone, etc.)

**Implementation Plan:**
1. Detect text fields trong PDF bằng coordinate mapping
2. Overlay text mới lên vị trí cũ
3. Keep original PDF as background layer

**Estimate:** 3-5 ngày dev time

---

### Option B: **PDFTron/PSPDFKit (Best quality, needs budget)**

**Khi nào dùng:**
- ✅ Cần perfect quality
- ✅ CV phức tạp với nhiều design elements
- ✅ Có budget cho license
- ✅ Muốn có UI editor cho user

**Estimate:** 1-2 tuần integration + license cost

---

### Option C: **Hybrid Approach (Practical)**

**Strategy:**
1. **Upload:** Parse PDF content bằng PDF.js (như hiện tại)
2. **Edit:** Cho user edit trong React form (như hiện tại)
3. **Export:** 
   - Option 1: Generate new PDF từ template HTML → PDF (jsPDF + html2canvas)
   - Option 2: Use PDF-LIB để overlay changes lên original PDF
   - Option 3: Store original PDF, chỉ highlight changes (annotation layer)

**Ưu điểm:**
- ✅ Free
- ✅ Flexible
- ✅ User có choice: new design hoặc keep original

---

## 📦 Implementation Code Examples

### Example 1: Keep Original PDF + Annotation Layer

```typescript
// src/app/(features)/support-cv/services/pdfAnnotator.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function addAnnotationsToOriginalPDF(
  originalPdfBytes: Uint8Array,
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
    page: number;
    rect: { x: number; y: number; width: number; height: number };
  }[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const change of changes) {
    const page = pdfDoc.getPage(change.page);
    
    // Draw white rectangle to cover old text
    page.drawRectangle({
      x: change.rect.x,
      y: change.rect.y,
      width: change.rect.width,
      height: change.rect.height,
      color: rgb(1, 1, 1), // White
    });
    
    // Draw new text
    page.drawText(change.newValue, {
      x: change.rect.x,
      y: change.rect.y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
  }

  return await pdfDoc.save();
}
```

### Example 2: Dual Export Option for User

```typescript
// Component code
export function ExportOptions({ originalPdf, cvData }: Props) {
  const [exportType, setExportType] = useState<'original' | 'template'>('template');

  const handleExport = async () => {
    if (exportType === 'original') {
      // Keep original design
      const modified = await modifyOriginalPDF(originalPdf, cvData);
      downloadPDF(modified, 'cv-edited.pdf');
    } else {
      // New template design
      const newPdf = await generateFromTemplate(cvData);
      downloadPDF(newPdf, 'cv-new-template.pdf');
    }
  };

  return (
    <div>
      <h3>Export Options</h3>
      <label>
        <input
          type="radio"
          checked={exportType === 'original'}
          onChange={() => setExportType('original')}
        />
        Keep original design (with edits)
      </label>
      <label>
        <input
          type="radio"
          checked={exportType === 'template'}
          onChange={() => setExportType('template')}
        />
        Use new template design
      </label>
      <button onClick={handleExport}>Export PDF</button>
    </div>
  );
}
```

---

## 🚀 Next Steps

### Immediate (Fix Rate Limit Issue):
1. ✅ Reduced retry attempts (done)
2. ✅ Throw early on rate limit (done)
3. ✅ Use fallback parser when rate limited (done)

### Short-term (Improve PDF Handling):
1. Implement PDF-LIB basic integration
2. Add coordinate detection for common CV fields
3. Provide dual export: original + template

### Long-term (If Budget Available):
1. Evaluate PDFTron/PSPDFKit trial
2. Implement full WYSIWYG PDF editor
3. Add real-time collaboration

---

## 📚 Resources

- PDF-LIB: https://pdf-lib.js.org/
- PDFTron: https://www.pdftron.com/documentation/web/
- PSPDFKit: https://pspdfkit.com/guides/web/
- Apache PDFBox: https://pdfbox.apache.org/

---

**Recommendation cho project của bạn:** 

Bắt đầu với **PDF-LIB** (free) và implement dual export option. Nếu user feedback tốt và có budget, có thể upgrade lên PDFTron/PSPDFKit sau.
