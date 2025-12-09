# TÀI LIỆU CHI TIẾT CÁC TÍNH NĂNG AI-INTERVIEW

## 📋 TỔNG QUAN HỆ THỐNG

### Công nghệ sử dụng
- **Framework**: Next.js 14 (App Router)
- **AI Model**: Google Gemini (gemini-2.5-flash, gemini-2.5-flash)
- **Voice**: Web Speech API (Speech Recognition & Text-to-Speech)
- **Avatar**: D-ID Talking Head API
- **Video**: WebRTC Camera Streaming
- **PDF Processing**: PDF.js (client-side)
- **Database**: Drizzle ORM + PostgreSQL

---

# 🎯 FEATURE 1: MOCK INTERVIEW

## 1.1 Mục đích
Tạo môi trường phỏng vấn ảo với AI, giúp ứng viên luyện tập kỹ năng phỏng vấn và nhận đánh giá chi tiết.

## 1.2 Cấu trúc thư mục

```
src/app/(features)/mock-interview/
├── page.tsx                           # Trang chính điều phối
├── components/
│   ├── mockInterviewModal.tsx         # Modal cấu hình phỏng vấn
│   ├── DIDTalkingHead.tsx             # Avatar AI nói chuyện (D-ID)
│   ├── WebcamStream.tsx               # Stream camera ứng viên
│   ├── interviewInput.tsx             # Nhập câu trả lời (text/voice)
│   ├── interviewTranscript.tsx        # Lịch sử hội thoại
│   ├── AssessmentResult.tsx           # Hiển thị kết quả đánh giá
│   ├── SkillsRadarChart.tsx           # Biểu đồ radar kỹ năng
│   └── ... (13 files)
├── utils/
│   ├── assessmentPrompt.ts            # ⭐ PROMPT đánh giá phỏng vấn
│   ├── questionGenerator.ts           # Sinh câu hỏi phỏng vấn
│   ├── avatarManager.ts               # Quản lý D-ID Avatar
│   ├── speechUtils.ts                 # Xử lý voice input/output
│   └── textToSpeech.ts                # Chuyển text thành giọng nói
├── types/
│   └── assessment.ts                  # TypeScript interfaces
├── hooks/
│   └── useSpeechRecognition.ts        # Hook xử lý voice input
└── data/
    └── interviewers.ts                # Dữ liệu các loại interviewer
```

## 1.3 Flow hoạt động chi tiết

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MOCK INTERVIEW FLOW                         │
└─────────────────────────────────────────────────────────────────────┘

[1] SETUP PHASE
    ├── page.tsx: Load trang, hiển thị modal setup
    ├── mockInterviewModal.tsx: Chọn cấu hình
    │   ├── Loại interviewer (HR, Tech Lead, Manager...)
    │   ├── Ngôn ngữ (VI, EN, JA, ZH, KO)
    │   ├── Upload CV (PDF) - optional
    │   └── Số lượng câu hỏi
    └── Output: InterviewSession object

[2] INTERVIEW PHASE
    ├── DIDTalkingHead.tsx: Avatar AI xuất hiện
    │   └── D-ID API → Video stream AI avatar
    ├── questionGenerator.ts: Sinh câu hỏi phỏng vấn
    │   └── Google Gemini AI → Câu hỏi dựa trên CV & vị trí
    ├── textToSpeech.ts: AI đọc câu hỏi
    │   └── Web Speech API → Âm thanh
    ├── WebcamStream.tsx: Hiển thị camera ứng viên
    ├── useSpeechRecognition.ts: Nhận voice input
    │   └── Web Speech API → Text
    └── interviewTranscript.tsx: Lưu lịch sử hội thoại

[3] ASSESSMENT PHASE
    ├── assessmentPrompt.ts: Build prompt đánh giá
    │   └── Format: transcript + expected answers + criteria
    ├── API call: /api/assess-interview
    │   └── Google Gemini AI → JSON assessment
    ├── AssessmentResult.tsx: Hiển thị kết quả
    └── SkillsRadarChart.tsx: Biểu đồ skills
```

## 1.4 PROMPT ĐÁNH GIÁ (assessmentPrompt.ts)

### Tiêu chí chấm điểm (0-100 mỗi tiêu chí):

| Tiêu chí | Trọng số | Mô tả |
|----------|----------|-------|
| **Technical Skills** | 25% | Kiến thức kỹ thuật, thuật ngữ, best practices |
| **Problem-Solving** | 25% | Phương pháp giải quyết vấn đề, phân tích |
| **Communication** | 20% | Rõ ràng, cấu trúc, súc tích |
| **Experience** | 15% | Ví dụ thực tế, metrics cụ thể |
| **Professionalism** | 15% | Thái độ chuyên nghiệp, teamwork |

### Quy tắc chấm điểm:
```
⚠️ NO ANSWER = 0 POINTS
⚠️ WRONG ANSWER = Low Score (0-30)
⚠️ PARTIALLY CORRECT = Medium Score (40-65)
⚠️ CORRECT ANSWER = High Score (70-100)
⚠️ EXCELLENT ANSWER = Full Score (90-100)
```

### Điều chỉnh theo loại Interviewer:

**HR Interviewer:**
- Professionalism: 25% (thay vì 15%)
- Communication: 25% (thay vì 20%)
- Technical Skills: 15% (thay vì 25%)

**Technical Lead:**
- Technical Skills: 35% (thay vì 25%)
- Experience: 20% (thay vì 15%)

**Engineering Manager:**
- Professionalism: 25%
- Communication: 25%

### Output JSON Structure:
```json
{
  "scores": {
    "technicalSkills": { "score": 85, "justification": "..." },
    "problemSolving": { "score": 78, "justification": "..." },
    "communication": { "score": 82, "justification": "..." },
    "experience": { "score": 75, "justification": "..." },
    "professionalism": { "score": 88, "justification": "..." }
  },
  "overallScore": 81.6,
  "readinessLevel": "Strong Hire | Hire | Maybe | No Hire",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "improvementAreas": [{ "area": "...", "suggestion": "...", "priority": "High|Medium|Low" }],
  "skillsRadar": [{ "name": "...", "score": 85, "maxScore": 100 }]
}
```

---

# 🎯 FEATURE 2: QUIZ

## 2.1 Mục đích
Tạo câu hỏi trắc nghiệm AI dựa trên CV và skills của ứng viên để đánh giá kiến thức chuyên môn.

## 2.2 Cấu trúc thư mục

```
src/app/(features)/quiz/
├── page.tsx                           # Trang chính (5-step flow)
├── components/
│   ├── CVUploadStep.tsx               # Step 1: Upload CV
│   ├── FieldSelectionStep.tsx         # Step 2: Chọn lĩnh vực
│   ├── LevelSelectionStep.tsx         # Step 3: Chọn level
│   ├── QuestionCountStep.tsx          # Step 4: Số câu hỏi
│   ├── QuizSessionStep.tsx            # Step 5: Làm quiz
│   ├── QuestionCard.tsx               # Hiển thị câu hỏi
│   ├── EnhancedFeedbackStep.tsx       # Kết quả chi tiết
│   └── ... (13 files)
├── services/
│   └── questionService.ts             # ⭐ AI sinh câu hỏi
├── models/
│   └── Question.ts                    # Interface câu hỏi
└── types/
    └── quiz.types.ts                  # TypeScript types
```

## 2.3 Flow hoạt động chi tiết

```
┌─────────────────────────────────────────────────────────────────────┐
│                            QUIZ FLOW                                 │
└─────────────────────────────────────────────────────────────────────┘

[STEP 1] CV Upload
    ├── CVUploadStep.tsx: Kéo thả PDF
    ├── questionService.ts → extractTextFromPDF()
    │   └── PDF.js: Trích xuất text từ PDF
    └── Output: CV text content

[STEP 2] Field Selection
    ├── FieldSelectionStep.tsx: Hiển thị lĩnh vực
    ├── Tự động detect từ CV hoặc user chọn
    └── Output: Selected field (Frontend, Backend, etc.)

[STEP 3] Level Selection
    ├── LevelSelectionStep.tsx: Chọn độ khó
    └── Output: low | mid | high

[STEP 4] Question Count
    ├── QuestionCountStep.tsx: Chọn số câu (5-30)
    └── Output: questionCount

[STEP 5] Quiz Session
    ├── questionService.ts → generateQuestions()
    │   └── Google Gemini API (gemini-2.5-flash)
    ├── QuizSessionStep.tsx: Hiển thị quiz
    ├── QuestionCard.tsx: Từng câu hỏi
    └── User chọn đáp án

[STEP 6] Results
    └── EnhancedFeedbackStep.tsx: Kết quả + giải thích
```

## 2.4 PROMPT SINH CÂU HỎI (questionService.ts)

### Function: generateQuestions()

**Input:**
- file: PDF file (CV)
- questionCount: 5-30
- language: "vi" | "en" | "ja" | "zh" | "ko"

**Prompt Template:**
```
${languageInstruction} // Multi-language support

Tập trung vào các kỹ năng, công nghệ, framework, tool, ngôn ngữ lập trình 
hoặc các khía cạnh kỹ thuật xuất hiện trong CV.

Yêu cầu:
- Mỗi câu hỏi có đúng 4 lựa chọn: A, B, C, D (chỉ 1 đáp án đúng)
- Độ khó: Trung bình, kiểm tra hiểu biết sâu hơn định nghĩa cơ bản
- Đa dạng hóa: frontend, backend, database, tools, projects
- Giải thích: Trích dẫn vị trí cụ thể trong CV

CV:
${truncated} // Max 12000 characters
```

### Function: generateQuestionsWithAI()

**Dùng khi:** Skills trong CV không match với question categories có sẵn

**Prompt Template:**
```
${languageInstruction}

Difficulty level: ${level.toUpperCase()} - ${levelInstruction}

Requirements:
- Each question must have exactly 4 options
- Only 1 correct answer per question
- Include brief explanation
- Distribute questions evenly across skills: ${skills.join(', ')}
- Make questions realistic and relevant to real-world scenarios
```

### Level Instructions:
| Level | VI | EN |
|-------|----|----|
| low | Khái niệm cơ bản và nền tảng | Basic concepts and fundamentals |
| mid | Chủ đề trung cấp, patterns, best practices | Intermediate topics, patterns, best practices |
| high | Chủ đề nâng cao, edge cases, kiến thức chuyên gia | Advanced topics, edge cases, expert-level |

### Output JSON:
```json
{
  "questions": [
    {
      "id": 1,
      "text": "Câu hỏi về kỹ năng trong CV...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": 0,
      "explanation": "Giải thích, trích dẫn vị trí trong CV"
    }
  ]
}
```

---

# 🎯 FEATURE 3: SUPPORT CV

## 3.1 Mục đích
Tối ưu hóa CV với AI: phân tích, đánh giá ATS score, và tự động cải thiện nội dung theo phương pháp STAR.

## 3.2 Cấu trúc thư mục

```
src/app/(features)/support-cv/
├── page.tsx                           # Trang chính (5-step flow)
├── components/
│   ├── CVUploader.tsx                 # Step 1: Upload CV
│   ├── CVReviewPanel.tsx              # Step 2: Review & Score
│   ├── CVAutoEditComparison.tsx       # Step 3: So sánh before/after
│   ├── CVEditor.tsx                   # Step 4: Chỉnh sửa thủ công
│   ├── CVPreview.tsx                  # Step 5: Xem trước
│   ├── ExportPanel.tsx                # Export PDF/DOCX
│   └── ... (nhiều components)
├── services/ai/
│   ├── gemini.client.ts               # ⭐ Gemini API wrapper
│   ├── editor.service.ts              # ⭐ AI auto-edit service
│   ├── rate-limiter.service.ts        # Chống rate limit
│   └── ...
├── contexts/
│   └── CVEditorContext.tsx            # State management
├── lib/
│   ├── result.ts                      # Result type pattern
│   └── errors.ts                      # Error handling
└── types/
    └── cv.types.ts                    # CV data structures
```

## 3.3 Flow hoạt động chi tiết

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SUPPORT CV FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

[STEP 1] Upload
    ├── CVUploader.tsx: Upload PDF
    ├── PDF.js → Extract text
    └── Parse CV structure → CVData object

[STEP 2] Review & Score
    ├── CVReviewPanel.tsx: Hiển thị đánh giá
    ├── Gemini AI → Phân tích CV
    └── Output:
        ├── overallScore: 0-100
        ├── atsScore: 0-100 (ATS compatibility)
        ├── impactScore: 0-100 (Impact statements)
        ├── clarityScore: 0-100 (Clarity)
        ├── strengths: []
        └── weaknesses: []

[STEP 3] Auto Edit
    ├── editor.service.ts → autoEdit()
    │   └── Gemini AI sinh suggestions
    ├── CVAutoEditComparison.tsx: So sánh
    │   ├── Bên trái: Original
    │   └── Bên phải: Improved (highlight changes)
    ├── User chọn changes muốn apply
    └── Output: editedCV với selected changes

[STEP 4] Manual Edit
    ├── CVEditor.tsx: WYSIWYG editor
    └── User chỉnh sửa thủ công

[STEP 5] Export
    ├── CVPreview.tsx: Xem trước PDF
    └── ExportPanel.tsx: Download PDF/DOCX
```

## 3.4 PROMPT AUTO-EDIT (editor.service.ts)

### buildEditPrompt() - Tạo prompt cải thiện CV:

**Input:**
- cvData: CVData object (parsed CV)
- review: CVReview (AI review results)

**Prompt Template:**
```
You are an expert CV editor. Your task: Review the existing CV content 
and suggest ONLY realistic improvements based on what's already there.

**CV DATA:**
Name: ${fullName} | Title: ${title}
Summary: ${summary || '[EMPTY]'}
LinkedIn: ${linkedin || '[MISSING]'}
Experiences: ${experiences.length} entries
Skills: ${skills.length} skills

**REVIEW SCORES:** 
Overall: ${overallScore}/100 | ATS: ${atsScore}/100 | Impact: ${impactScore}/100

**IDENTIFIED WEAKNESSES:** 
${weaknesses.slice(0, 3).join('\n')}

**YOUR TASK:** Generate 8-15 targeted improvements as JSON array.

**STRICT RULES:**
✅ Fix Grammar & Spelling
✅ Rewrite Weak Statements → Professional CV language với action verbs
✅ Add Metrics (e.g., "improved performance by 30%")
✅ Optimize Length
✅ ATS Optimization - Add relevant industry keywords
✅ Missing Fields - Suggest placeholders
❌ DO NOT Fabricate companies, projects, achievements
❌ DO NOT Add Experience Years
❌ DO NOT Create New Sections
```

### Improvement Types:
| Type | Mô tả | Ví dụ |
|------|-------|-------|
| **modify** | Fix grammar, rewrite, add metrics | "Participated..." → "Completed intensive training, delivering 3 features..." |
| **add** | Fill missing fields | LinkedIn: "" → "[Your LinkedIn URL]" |
| **rewrite** | Full rewrite weak statement | Vague → STAR method |

### Weak → Strong Verb Mapping:
```typescript
{
  'responsible for': 'Led',
  'helped with': 'Contributed to',
  'worked on': 'Developed',
  'in charge of': 'Managed',
  'handled': 'Coordinated'
}
```

### Output JSON:
```json
{
  "suggestions": [
    {
      "section": "experiences",
      "itemId": "0",
      "itemLabel": "Backend Engineer at AdsAgency",
      "field": "achievements",
      "type": "modify",
      "original": "Participated in training courses",
      "improved": "Completed intensive PHP training, delivering 3 production features within 8 weeks",
      "reason": "Transformed vague statement into specific achievement with timeline",
      "impact": "high"
    }
  ]
}
```

---

# 🎯 FEATURE 4: SUMMARIZE

## 4.1 Mục đích
Phân tích CV toàn diện và đưa ra đánh giá chi tiết về skills, career recommendations, và action items.

## 4.2 Cấu trúc thư mục

```
src/app/(features)/summarize/
├── page.tsx                           # Trang chính
├── components/
│   ├── SummaryUploader.tsx            # Upload CV
│   ├── SummaryDisplay.tsx             # Hiển thị kết quả
│   ├── SkillsAnalysis.tsx             # Phân tích skills
│   └── CareerRecommendations.tsx      # Đề xuất career
├── services/
│   └── summaryService.ts              # ⭐ AI phân tích CV
└── models/
    └── summary.types.ts               # TypeScript types
```

## 4.3 Flow hoạt động

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SUMMARIZE FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

[1] Upload
    └── SummaryUploader.tsx: Upload PDF

[2] Analysis
    ├── summaryService.ts → generateSummary()
    │   ├── extractTextFromPDF(file)
    │   └── Gemini AI → Comprehensive analysis
    └── Parse JSON response

[3] Display
    ├── SummaryDisplay.tsx: Overview
    ├── SkillsAnalysis.tsx: Skills breakdown
    └── CareerRecommendations.tsx: Career advice
```

## 4.4 PROMPT PHÂN TÍCH (summaryService.ts)

### generateSummary() Prompt:

**Multi-language Support:**
```typescript
const languageInstructions = {
  vi: "Phân tích CV và trả lời bằng TIẾNG VIỆT...",
  en: "Analyze the CV and respond in ENGLISH...",
  ja: "履歴書を分析し、日本語で回答してください...",
  zh: "分析简历并用中文回答...",
  ko: "이력서를 분석하고 한국어로 답변하세요..."
};
```

**Prompt Template:**
```
${languageInstruction}

Bạn là chuyên gia phân tích CV với 20+ năm kinh nghiệm tư vấn nghề nghiệp.
Phân tích CV sau và đưa ra đánh giá toàn diện:

=== REQUIRED OUTPUT FORMAT ===
{
  "summary": {
    "title": "Professional Title",
    "yearsOfExperience": 5,
    "currentLevel": "Mid-Senior Level",
    "industryFocus": "Software Development",
    "overallAssessment": "Đánh giá tổng quan..."
  },
  "skillsAnalysis": {
    "technicalSkills": [
      { "name": "React", "level": "Expert", "yearsUsed": 4 }
    ],
    "softSkills": ["Leadership", "Communication"],
    "skillGaps": ["Cloud Architecture", "System Design"],
    "recommendations": ["Nên học thêm AWS..."]
  },
  "careerRecommendations": {
    "shortTerm": ["Actions for next 6 months..."],
    "longTerm": ["3-5 year career goals..."],
    "potentialRoles": ["Senior Engineer", "Tech Lead"],
    "salaryRange": {
      "min": 30000000,
      "max": 50000000,
      "currency": "VND"
    }
  },
  "actionItems": [
    {
      "priority": "High",
      "action": "Add quantifiable achievements to work experience",
      "reason": "Current bullets lack metrics",
      "deadline": "2 weeks"
    }
  ],
  "cvCompleteness": {
    "score": 75,
    "missingElements": ["LinkedIn URL", "Portfolio link"],
    "strongElements": ["Clear work history", "Relevant skills"]
  }
}
```

### Output Sections:

| Section | Mô tả |
|---------|-------|
| **summary** | Thông tin tổng quan: title, years of exp, level |
| **skillsAnalysis** | Technical/Soft skills, gaps, recommendations |
| **careerRecommendations** | Short/Long term goals, potential roles, salary |
| **actionItems** | Việc cần làm với priority và deadline |
| **cvCompleteness** | Điểm hoàn thiện, missing/strong elements |

---

# 🎯 FEATURE 5: FIND JOB

## 5.1 Mục đích
Phân tích CV để đề xuất công việc phù hợp với thông tin thị trường (salary, demand, hot skills).

## 5.2 Cấu trúc thư mục

```
src/app/(features)/find-job/
├── page.tsx                           # Trang chính (5-step flow)
├── components/
│   ├── CVUploadStep.tsx               # Step 1: Upload CV
│   ├── FieldSelectionStep.tsx         # Step 2: Chọn lĩnh vực
│   ├── LevelSelectionStep.tsx         # Step 3: Chọn level
│   ├── PreferencesStep.tsx            # Step 4: Preferences (location, salary)
│   ├── JobSearchResults.tsx           # Step 5: Kết quả
│   ├── JobCard.tsx                    # Card hiển thị job
│   ├── MarketInsightsPanel.tsx        # Thông tin thị trường
│   └── ... (9 files)
├── services/
│   ├── cvAnalyzer.ts                  # ⭐ Phân tích CV
│   ├── marketInsights.ts              # ⭐ Dữ liệu thị trường VN
│   ├── locationService.ts             # Detect vị trí
│   └── jobSearchService.ts            # Search jobs API
├── contexts/
│   └── JobSearchContext.tsx           # State management
└── types/
    └── job.types.ts                   # TypeScript types
```

## 5.3 Flow hoạt động chi tiết

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FIND JOB FLOW                                │
└─────────────────────────────────────────────────────────────────────┘

[STEP 1] Upload CV
    ├── CVUploadStep.tsx: Upload PDF
    ├── cvAnalyzer.ts → analyzeCVForJobSearch()
    └── Output: CVAnalysisForJob object

[STEP 2] Field Selection
    ├── FieldSelectionStep.tsx
    ├── Auto-detect từ CV hoặc user chọn
    └── 20+ IT fields supported

[STEP 3] Level Selection
    ├── LevelSelectionStep.tsx
    ├── Auto-infer từ years of experience
    └── Levels: intern → fresher → junior → middle → senior → manager → director

[STEP 4] Preferences
    ├── PreferencesStep.tsx
    ├── Location (auto-detect hoặc chọn)
    ├── Salary expectation
    └── Remote/On-site preference

[STEP 5] Results
    ├── jobSearchService.ts: Search jobs từ APIs
    ├── JobSearchResults.tsx: Hiển thị jobs
    ├── JobCard.tsx: Chi tiết từng job
    └── MarketInsightsPanel.tsx: Market info
```

## 5.4 PHÂN TÍCH CV (cvAnalyzer.ts)

### analyzeCVForJobSearch() - Phát hiện lĩnh vực từ CV:

**IT Fields Database (20+ lĩnh vực):**
```typescript
const IT_FIELDS = {
  'Frontend Developer': {
    keywords: ['frontend', 'front-end', 'ui developer', 'web developer'],
    skills: ['react', 'vue', 'angular', 'nextjs', 'html', 'css', 'tailwind'],
    weight: 1.0
  },
  'Backend Developer': {
    keywords: ['backend', 'back-end', 'server-side', 'api developer'],
    skills: ['nodejs', 'express', 'python', 'django', 'java', 'spring', 'php'],
    weight: 1.0
  },
  'Full Stack Developer': {
    keywords: ['fullstack', 'full-stack', 'full stack'],
    skills: ['mern', 'mean', 'lamp', 'jamstack'],
    weight: 1.2  // Higher weight khi có cả frontend + backend
  },
  // ... 17+ fields khác
};
```

### Level Inference Logic:
```typescript
// Từ years of experience → Job Level
if (yearsOfExperience >= 10) → 'senior' | 'manager' | 'director'
if (yearsOfExperience >= 7) → 'senior' | 'manager'
if (yearsOfExperience >= 5) → 'senior'
if (yearsOfExperience >= 3) → 'middle'
if (yearsOfExperience >= 1) → 'junior'
if (text.includes('student')) → 'intern'
else → 'fresher'
```

### Skill Level Inference:
```typescript
function inferSkillLevel(text, skill) {
  // Check explicit mentions
  if (/expert.*${skill}/i.test(text)) return 'expert';
  if (/proficient.*${skill}/i.test(text)) return 'advanced';
  if (/basic.*${skill}/i.test(text)) return 'beginner';
  
  // Count frequency → More mentions = higher level
  const count = text.match(skillRegex)?.length || 0;
  if (count >= 5) return 'advanced';
  if (count >= 3) return 'intermediate';
  return 'intermediate'; // default
}
```

## 5.5 THÔNG TIN THỊ TRƯỜNG (marketInsights.ts)

### Dữ liệu thị trường VN cho từng lĩnh vực:

```typescript
const FIELD_MARKET_DATA = {
  'Frontend Developer': {
    demandLevel: 'very-high',
    trendDirection: 'rising',
    averageSalary: { min: 15000000, max: 45000000, currency: 'VND' },
    topCompanies: ['FPT Software', 'VNG', 'Tiki', 'Shopee', 'VinGroup', 'Grab'],
    hotSkills: ['React', 'TypeScript', 'Next.js', 'Vue 3', 'Tailwind CSS'],
    jobOpenings: '2,500+',
    competitionLevel: 'medium',
    tips: [
      'React và TypeScript là bắt buộc cho hầu hết các vị trí',
      'Có portfolio với dự án thực tế sẽ tăng cơ hội',
      'Kiến thức về responsive design và performance optimization rất được đánh giá cao'
    ]
  },
  'AI/ML Engineer': {
    demandLevel: 'very-high',
    trendDirection: 'rising',
    averageSalary: { min: 30000000, max: 100000000, currency: 'VND' },
    topCompanies: ['VinAI', 'FPT.AI', 'Zalo AI', 'VNG', 'Grab', 'Shopee'],
    hotSkills: ['PyTorch', 'TensorFlow', 'LLM', 'Computer Vision', 'NLP', 'MLOps'],
    jobOpenings: '400+',
    competitionLevel: 'high',
    tips: [
      'AI/ML là field có mức lương cao nhất hiện tại',
      'Kinh nghiệm với LLM và Generative AI rất hot',
      'Research papers hoặc contributions sẽ rất nổi bật'
    ]
  },
  // ... 13+ fields khác
};
```

### Salary by Level Multipliers:
```typescript
const LEVEL_SALARY_MULTIPLIERS = {
  intern:   { min: 0.3, max: 0.5 },   // 30-50% of base
  fresher:  { min: 0.5, max: 0.7 },   // 50-70%
  junior:   { min: 0.7, max: 1.0 },   // 70-100%
  middle:   { min: 1.0, max: 1.4 },   // 100-140%
  senior:   { min: 1.4, max: 2.0 },   // 140-200%
  manager:  { min: 1.8, max: 2.8 },   // 180-280%
  director: { min: 2.5, max: 4.0 }    // 250-400%
};
```

### Output: CVAnalysisForJob
```typescript
interface CVAnalysisForJob {
  skills: string[];                    // Detected skills
  yearsOfExperience: number;          // Inferred years
  currentLevel: JobLevel;             // intern → director
  suggestedLevel: JobLevel[];         // Possible levels
  mainField: string;                  // Detected field
  location: string;                   // Detected location
  fieldMatchScore: number;            // 0-100%
  skillsWithLevels: SkillMatch[];     // Skills with proficiency
  suggestedKeywords: string[];        // For job search
  marketInsights: FieldMarketInsights;// Market data
  salaryExpectation: SalaryRange;     // Expected salary
  strongPoints: string[];             // CV strengths
  improvementAreas: string[];         // Areas to improve
}
```

---

# 📊 TỔNG KẾT

## So sánh 5 Features:

| Feature | AI Model | Main Input | Main Output |
|---------|----------|------------|-------------|
| **Mock Interview** | Gemini 2.0 Flash | CV + Voice | Assessment scores + Feedback |
| **Quiz** | Gemini 2.5 Flash | CV + Skills | Quiz questions + Explanations |
| **Support CV** | Gemini 2.0 Flash | CV PDF | Optimized CV + ATS score |
| **Summarize** | Gemini 2.0 Flash | CV PDF | Career analysis + Action items |
| **Find Job** | Local + Market Data | CV PDF | Job matches + Market insights |

## Công nghệ chung:

- **PDF Processing**: pdf.js (client-side extraction)
- **AI API**: Google Gemini API với retry logic + rate limiting
- **Multi-language**: VI, EN, JA, ZH, KO
- **State Management**: React Context
- **Type Safety**: TypeScript + Zod validation

## Best Practices áp dụng:

1. **Rate Limiting**: 20s delay giữa API calls
2. **Retry Logic**: Exponential backoff (4 retries)
3. **JSON Parsing**: Clean markdown code blocks, extract JSON
4. **Error Handling**: Result<T, Error> pattern
5. **Prompt Engineering**: Structured prompts với examples

---

*Tài liệu được tạo tự động từ source code bởi GitHub Copilot*
