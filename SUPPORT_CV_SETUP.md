# Setup Guide for Support CV Feature

## ✅ Packages Already Installed

Good news! All required packages are already in package.json:
- ✅ jspdf@3.0.3
- ✅ pdfjs-dist@3.11.174
- ✅ @google/generative-ai@0.24.1

## 🚀 Quick Start

### 1. Restart TypeScript Server
Press `Ctrl+Shift+P` (Windows) and select:
```
TypeScript: Restart TS Server
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. Access Support CV
- Go to http://localhost:3000
- Click "Support CV" in sidebar (📝 icon)

## 🎯 Test the Feature

### Test 1: Template Selection
1. Open http://localhost:3000/support-cv
2. Should see 5 template cards
3. Click any "Select Template" button
4. Should move to upload step

### Test 2: Upload CV
1. Drag & drop a PDF file (or click "Choose PDF File")
2. Should show "Processing Your CV" with animation
3. Wait 10-30 seconds for AI analysis
4. Should move to editor with extracted data

### Test 3: Start from Scratch
1. Click "Start from Blank Template"
2. Should open empty editor
3. Fill in personal info, experience, etc.

### Test 4: Edit CV
1. Navigate through sections: Personal, Experience, Education, Skills
2. Edit any field
3. Changes should be saved automatically

### Test 5: Preview
1. Click "Preview CV" button
2. Should show formatted CV with selected template
3. Click "Back to Edit" to continue editing

### Test 6: Export
1. Click "Export" button
2. Choose PDF format
3. Click "Download PDF"
4. Should download CV file

## 🐛 If You See Errors

### Error: "Cannot find module './components/...'"
**Solution**: Restart TypeScript server
```
Ctrl+Shift+P → TypeScript: Restart TS Server
```

### Error: "Module not found: Can't resolve 'jspdf'"
**Solution**: Install packages
```bash
npm install
```

### Error: PDF extraction fails
**Cause**: PDF is scanned image, not text
**Solution**: Use text-based PDF or try OCR

### Error: "Gemini API error"
**Cause**: Missing or invalid API key
**Solution**: Check .env.local file
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

## 📝 File Structure Created

```
src/app/(features)/support-cv/
├── page.tsx                           ✅ Created
├── README.md                          ✅ Created
├── api/
│   └── route.ts                       ✅ Created
├── types/
│   └── cv.types.ts                    ✅ Created
├── services/
│   ├── pdfExtractor.ts                ✅ Created
│   ├── aiCVAnalyzer.ts                ✅ Created
│   └── cvExporter.ts                  ✅ Created
├── components/
│   ├── TemplateSelector.tsx           ✅ Created
│   ├── CVUploader.tsx                 ✅ Created
│   ├── CVEditor.tsx                   ✅ Created
│   ├── CVPreview.tsx                  ✅ Created
│   ├── ExportPanel.tsx                ✅ Created
│   └── editor/
│       ├── PersonalInfoSection.tsx    ✅ Created
│       ├── ExperienceSection.tsx      ✅ Created
│       ├── EducationSection.tsx       ✅ Created
│       ├── SkillsSection.tsx          ✅ Created
│       └── AISuggestionsPanel.tsx     ✅ Created
```

## ✨ Features Implemented

- [x] Template selection (5 templates)
- [x] PDF upload with drag & drop
- [x] AI-powered CV extraction
- [x] STAR method suggestions
- [x] Real-time editor
- [x] Live preview
- [x] PDF export
- [x] Professional UI/UX
- [x] Progress wizard
- [x] Error handling

## 🎨 UI/UX Highlights

- Modern gradient design matching existing app
- Smooth animations and transitions
- Responsive layout
- Progress steps indicator
- Loading states with animations
- Error messages with helpful tips
- Drag & drop with visual feedback
- AI suggestions panel
- Real-time preview

## 📊 Technical Details

**PDF Reading**: Uses pdfjs-dist to extract text from PDF pages

**AI Analysis**: 
- Gemini 2.0 Flash for fast processing
- Temperature 0.3 for consistent extraction
- Temperature 0.4 for creative suggestions

**Export**: 
- jsPDF for PDF generation
- Template-based rendering
- Professional formatting

## 🔄 Next Steps

After testing, you can enhance:
1. Add more templates
2. Improve DOCX export
3. Add cover letter generator
4. Implement CV scoring
5. Add job matching feature
6. Cloud storage integration

## 💡 Tips

- Use ATS-Friendly template for tech jobs
- Include metrics in achievements (%, $, time)
- Use action verbs (Achieved, Developed, Led)
- Keep CV to 1-2 pages
- Proofread before exporting

---

**Need Help?** Check the main README.md in support-cv folder for full documentation!
