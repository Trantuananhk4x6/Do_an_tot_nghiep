# Support CV Feature

## 🎯 Tổng quan

Tính năng **Support CV** giúp người dùng tạo và tối ưu hóa CV chuyên nghiệp với sự hỗ trợ của AI.

## ✨ Tính năng chính

1. **📋 Template Selection** - Chọn mẫu CV phù hợp
   - Minimal: Clean và đơn giản
   - Modern: Thiết kế đương đại với màu sắc
   - ATS-Friendly: ⭐ Tối ưu cho hệ thống tự động
   - Creative: Sáng tạo cho ngành thiết kế
   - Professional: Chuyên nghiệp cho doanh nghiệp

2. **📤 CV Upload** - Upload CV cũ
   - Kéo thả PDF file
   - AI tự động đọc và trích xuất thông tin
   - Phân tích cấu trúc CV

3. **🤖 AI Analysis** - Phân tích thông minh
   - Trích xuất: Tên, email, kinh nghiệm, kỹ năng, học vấn
   - Phân tích theo STAR model
   - Gợi ý cải thiện với action verbs và metrics

4. **✏️ Real-time Editor** - Chỉnh sửa trực tiếp
   - Personal Info
   - Work Experience với STAR suggestions
   - Education
   - Skills
   - Projects
   - Certifications

5. **👁️ Live Preview** - Xem trước real-time
   - Preview CV theo template đã chọn
   - Thay đổi hiển thị ngay lập tức

6. **💾 Export** - Xuất file
   - PDF format
   - DOCX format (coming soon)
   - Giữ nguyên template đã chọn

## 🚀 Cách sử dụng

### 1. Khởi động

```bash
npm install
npm run dev
```

### 2. Truy cập
Vào sidebar → Click "Support CV" (icon 📝)

### 3. Quy trình

**STEP 1: Chọn Template**
- Xem 5 templates có sẵn
- Click "Select Template"

**STEP 2: Upload CV**
- **Option A**: Kéo thả PDF file vào
- **Option B**: Click "Choose PDF File"
- **Option C**: Click "Start from Blank Template"

**STEP 3: AI Processing** (10-30 giây)
- AI đọc PDF
- Trích xuất thông tin
- Generate STAR suggestions

**STEP 4: Edit CV**
- Chỉnh sửa từng section
- Xem AI suggestions bên phải
- Apply suggestions với 1 click

**STEP 5: Preview**
- Click "Preview CV"
- Kiểm tra CV với template đã chọn

**STEP 6: Export**
- Click "Export"
- Chọn PDF hoặc DOCX
- Download file

## 🎨 Templates

### ATS-Friendly (Recommended)
- ✅ Tối ưu cho hệ thống tự động (ATS)
- ✅ Standard fonts, no graphics
- ✅ Machine-readable
- 🎯 Best for: Tech companies, startups

### Professional
- ✅ Formal, conservative style
- ✅ Corporate-friendly
- 🎯 Best for: Finance, consulting, corporate

### Modern
- ✅ Color accents, visual hierarchy
- ✅ Contemporary design
- 🎯 Best for: Most industries

### Minimal
- ✅ Clean, simple layout
- ✅ Focus on content
- 🎯 Best for: General use

### Creative
- ✅ Bold, unique design
- ✅ Colorful and eye-catching
- 🎯 Best for: Design, marketing, media

## 🤖 AI Features

### 1. Auto-Extract
AI tự động trích xuất:
- Personal info (name, email, phone, location)
- Work experience (company, position, dates, achievements)
- Education (school, degree, field, GPA)
- Skills (categorized by type and level)
- Projects, certifications, languages

### 2. STAR Method Suggestions
AI tối ưu achievements theo STAR:
- **S**ituation: Context của vấn đề
- **T**ask: Nhiệm vụ cần giải quyết
- **A**ction: Hành động cụ thể đã làm
- **R**esult: Kết quả đo lường được

Ví dụ:
- ❌ Before: "Worked on improving system performance"
- ✅ After: "Reduced API response time by 45% (from 800ms to 440ms) by implementing Redis caching and optimizing database queries, improving user experience for 50K+ daily active users"

### 3. Action Verbs
AI suggest action verbs mạnh:
- Achieved, Developed, Led, Implemented
- Increased, Reduced, Optimized, Streamlined
- Launched, Delivered, Built, Designed

### 4. Quantifiable Metrics
AI gợi ý thêm số liệu:
- Percentages (increased by 23%)
- Numbers (500+ users, $1M revenue)
- Time saved (reduced from 2 hours to 15 minutes)
- Scale (serving 100K+ requests/day)

## 📁 Cấu trúc Code

```
support-cv/
├── page.tsx                    # Main page with wizard flow
├── types/
│   └── cv.types.ts            # TypeScript interfaces
├── services/
│   ├── pdfExtractor.ts        # Extract text from PDF
│   ├── aiCVAnalyzer.ts        # AI analysis & STAR suggestions
│   └── cvExporter.ts          # Export to PDF/DOCX
├── components/
│   ├── TemplateSelector.tsx   # Template selection
│   ├── CVUploader.tsx         # Upload/drop zone
│   ├── CVEditor.tsx           # Main editor layout
│   ├── CVPreview.tsx          # Preview component
│   ├── ExportPanel.tsx        # Export options
│   └── editor/
│       ├── PersonalInfoSection.tsx
│       ├── ExperienceSection.tsx
│       ├── EducationSection.tsx
│       ├── SkillsSection.tsx
│       └── AISuggestionsPanel.tsx
└── templates/                  # CV template images
```

## 🔧 Technical Stack

- **Framework**: Next.js 15 + TypeScript
- **AI**: Google Gemini API (gemini-2.0-flash-exp)
- **PDF**: pdfjs-dist (reading), jsPDF (export)
- **Styling**: Tailwind CSS
- **State**: React useState
- **Export**: jsPDF, docx (future)

## 📝 Environment Variables

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

## 🐛 Troubleshooting

### TypeScript errors
If you see "Cannot find module" errors:
1. Restart TypeScript server: Cmd+Shift+P → "TypeScript: Restart TS Server"
2. Or restart VS Code

### PDF extraction fails
- Make sure PDF is text-based (not scanned image)
- Check if pdf.worker.min.js exists in /public
- Verify pdfjs-dist is installed

### AI analysis slow
- Normal processing time: 10-30 seconds
- Check Gemini API quota
- Verify NEXT_PUBLIC_GEMINI_API_KEY is set

### Export not working
- Verify jspdf is installed: `npm list jspdf`
- Check browser console for errors
- Try different browser (Chrome recommended)

## 📚 API Reference

### pdfExtractor.ts
```typescript
extractTextFromPDF(file: File): Promise<PDFExtractResult>
```

### aiCVAnalyzer.ts
```typescript
analyzeCVWithAI(extractedText: string): Promise<AIAnalysisResult>
```

### cvExporter.ts
```typescript
exportCV(cvData: CVData, template: CVTemplate, format: ExportFormat): Promise<Blob>
downloadBlob(blob: Blob, filename: string): void
```

## 🎯 Future Enhancements

- [ ] DOCX export with full formatting
- [ ] More templates (Sidebar, Two-column, etc.)
- [ ] Multi-language CV support
- [ ] CV scoring and analysis report
- [ ] Job description matching
- [ ] Cover letter generator
- [ ] LinkedIn profile import
- [ ] Version history and comparison
- [ ] Collaboration features
- [ ] Cloud storage integration

## 🤝 Contributing

1. Tạo feature branch
2. Thêm tests
3. Update README nếu cần
4. Submit PR

## 📄 License

MIT License - Feel free to use for your projects!
