# 📊 NỘI DUNG SLIDE - HỆ THỐNG AI INTERVIEW

---

## 📑 MỤC LỤC
1. [Mock Interview](#1-mock-interview---phỏng-vấn-thử-với-ai)
2. [Quiz - Đánh giá kỹ năng](#2-quiz---đánh-giá-kỹ-năng)
3. [Support CV](#3-support-cv---hỗ-trợ-tối-ưu-cv)
4. [Summarize - Phân tích CV](#4-summarize---phân-tích-cv-chuyên-sâu)
5. [Find Job - Tìm việc](#5-find-job---tìm-việc-làm)

---

# 1. MOCK INTERVIEW - Phỏng Vấn Thử Với AI

## 🎯 MỤC ĐÍCH
- Giúp ứng viên **luyện tập phỏng vấn thực tế** với AI trước khi phỏng vấn thật
- Cung cấp môi trường phỏng vấn **chân thực** với camera, voice, và AI interviewer
- **Đánh giá toàn diện** năng lực ứng viên qua nhiều tiêu chí
- Cung cấp **phản hồi chi tiết** và hướng dẫn cải thiện

## 💡 GIẢI PHÁP

### Công nghệ sử dụng:
- **Google Gemini AI** (gemini-2.5-flash) - Đánh giá và tạo câu hỏi
- **Web Speech API** - Nhận diện giọng nói (hỗ trợ đa ngôn ngữ: VI, EN, JA, ZH, KO)
- **D-ID Talking Head** - Avatar AI động nói chuyện
- **WebRTC** - Streaming camera người dùng
- **Text-to-Speech** - AI phát âm câu hỏi

### Quy trình:
1. Chọn Interview Set (bộ câu hỏi theo vị trí)
2. Chọn AI Interviewer (HR, Tech Lead, Manager...)
3. AI đặt câu hỏi → Ứng viên trả lời qua mic
4. Kết thúc → AI đánh giá và tạo báo cáo chi tiết

---

## 📋 TIÊU CHÍ ĐÁNH GIÁ

### 5 Tiêu chí chính (Tổng 100 điểm):

| Tiêu chí | Trọng số | Mô tả |
|----------|----------|-------|
| **Technical Skills** | 25% | Kiến thức kỹ thuật, framework, best practices |
| **Problem-Solving** | 25% | Tư duy phân tích, đưa ra giải pháp |
| **Communication** | 20% | Giao tiếp rõ ràng, mạch lạc |
| **Experience** | 15% | Kinh nghiệm thực tế, ví dụ cụ thể |
| **Professionalism** | 15% | Thái độ chuyên nghiệp, teamwork |

### Thang điểm chi tiết:

```
90-100: Expert     - Vượt mong đợi, hiểu sâu, ví dụ xuất sắc
75-89:  Advanced   - Phần lớn câu trả lời chính xác, kiến thức tốt
60-74:  Intermediate - Một số câu trả lời đúng, còn thiếu sót
40-59:  Beginner   - Nhiều câu trả lời sai, thiếu khái niệm quan trọng
0-39:   Weak       - Hầu hết sai hoặc không trả lời
```

### Mức độ sẵn sàng (Readiness Level):
- **85-100**: "Strong Hire" - Nên tuyển
- **70-84**: "Hire" - Tuyển được
- **55-69**: "Maybe" - Cần cân nhắc
- **40-54**: "Weak Maybe" - Khó tuyển
- **0-39**: "No Hire" - Không nên tuyển

---

## 🤖 PROMPT ĐÁNH GIÁ (Tóm tắt)

```
ROLE: Expert technical interviewer conducting comprehensive assessment

SCORING RULES:
1. NO ANSWER = 0 POINTS (< 20 ký tự = không trả lời)
2. SO SÁNH câu trả lời thực tế vs câu trả lời mong đợi
3. WRONG ANSWER = 0-30 điểm
4. PARTIALLY CORRECT = 40-65 điểm
5. CORRECT ANSWER = 70-100 điểm

INTERVIEWER-SPECIFIC CRITERIA:
- HR Interviewer: Tập trung STAR method, soft skills, cultural fit
- Technical Lead: Tập trung system design, code quality, technical decisions
- Engineering Manager: Tập trung leadership, project planning, team management
- Data Scientist: Tập trung statistical analysis, ML knowledge, data pipeline

OUTPUT: JSON với scores, strengths, weaknesses, detailedFeedback, 
        improvementAreas, recommendedActions, skillsRadar
```

### Đặc điểm theo loại Interviewer:

| Interviewer Type | Trọng tâm đánh giá | Điều chỉnh trọng số |
|------------------|-------------------|---------------------|
| **HR** | Behavioral (STAR), Soft skills, Cultural fit | Professionalism: 25%, Communication: 25%, Technical: 15% |
| **Tech Lead** | System design, Code quality, Trade-offs | Technical: 35%, Problem-Solving: 25%, Experience: 20% |
| **Engineering Manager** | Leadership, Project planning, Cross-functional | Professionalism: 25%, Communication: 25%, Technical: 15% |
| **Data Scientist** | Statistical analysis, ML, Data pipeline | Technical: 30%, Problem-Solving: 30%, Communication: 20% |

---

# 2. QUIZ - Đánh Giá Kỹ Năng

## 🎯 MỤC ĐÍCH
- **Đánh giá năng lực kỹ thuật** của ứng viên qua bài quiz
- Tạo câu hỏi **tùy chỉnh theo CV** và lĩnh vực làm việc
- Xác định **điểm mạnh/yếu** trong các kỹ năng
- Cung cấp **lộ trình học tập** phù hợp

## 💡 GIẢI PHÁP

### Công nghệ sử dụng:
- **Google Gemini AI** - Tạo câu hỏi thông minh theo ngữ cảnh
- **CV Analysis** - Phân tích CV để tạo câu hỏi phù hợp

### Quy trình 5 bước:
1. **Upload CV** (tùy chọn) - Để tạo câu hỏi phù hợp
2. **Chọn lĩnh vực** (Frontend, Backend, DevOps, Data Science...)
3. **Chọn cấp bậc** (Intern → Expert)
4. **Chọn độ khó** (Easy, Medium, Hard, Expert)
5. **Làm quiz** → Xem kết quả chi tiết

---

## 📋 TIÊU CHÍ TẠO CÂU HỎI

### Độ khó theo cấp bậc:

| Cấp bậc | Độ khó | Focus |
|---------|--------|-------|
| **Intern/Fresher** | Low | Khái niệm cơ bản, fundamentals |
| **Junior** | Low-Mid | Khái niệm + ứng dụng cơ bản |
| **Mid** | Mid | Patterns, best practices |
| **Senior/Expert** | High | Advanced topics, edge cases, expert knowledge |

### Loại câu hỏi:
- Trắc nghiệm 4 lựa chọn (1 đáp án đúng)
- Có giải thích chi tiết cho đáp án
- Trích dẫn vị trí trong CV (nếu có)
- Đa dạng hóa theo các phần khác nhau của CV

---

## 🤖 PROMPT TẠO CÂU HỎI (Tóm tắt)

```
TASK: Tạo câu hỏi trắc nghiệm kỹ thuật dựa trên CV/skills

REQUIREMENTS:
1. Mỗi câu hỏi có đúng 4 lựa chọn (A, B, C, D)
2. Chỉ 1 đáp án đúng
3. Lựa chọn sai phải hợp lý để "đánh lừa nhẹ"
4. Độ khó trung bình - kiểm tra hiểu biết sâu hơn định nghĩa
5. Phân bổ đều các kỹ năng
6. Giải thích ngắn gọn (1-2 câu), trích dẫn CV

FOCUS:
- Kỹ năng, công nghệ, framework trong CV
- Định nghĩa, ứng dụng thực tế
- KHÔNG hỏi về thông tin cá nhân

OUTPUT FORMAT:
{
  "questions": [
    {
      "id": 1,
      "text": "Câu hỏi...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": 0,
      "explanation": "Giải thích..."
    }
  ]
}
```

### Hỗ trợ đa ngôn ngữ:
- Tiếng Việt (vi)
- Tiếng Anh (en)
- Tiếng Nhật (ja)
- Tiếng Trung (zh)
- Tiếng Hàn (ko)

---

## 📊 FEEDBACK SAU QUIZ

### Các thông tin được cung cấp:
1. **Overall Score** - Điểm tổng thể (%)
2. **Skill Performance** - Điểm từng kỹ năng
3. **Recommendations** - Gợi ý cải thiện (High/Medium/Low priority)
4. **Study Plan** - Kế hoạch học tập theo tuần
5. **Career Insights** - Thông tin thị trường việc làm

---

# 3. SUPPORT CV - Hỗ Trợ Tối Ưu CV

## 🎯 MỤC ĐÍCH
- **Phân tích và đánh giá** chất lượng CV
- **Tự động tối ưu** CV với AI (STAR method)
- Đảm bảo CV **ATS-friendly** (vượt qua hệ thống lọc tự động)
- Cung cấp **template chuyên nghiệp**

## 💡 GIẢI PHÁP

### Công nghệ sử dụng:
- **Google Gemini AI** - Phân tích và tối ưu nội dung
- **PDF Generation** - Xuất CV định dạng chuyên nghiệp

### Quy trình 5 bước:
1. **Upload CV** - Tải lên CV hiện tại
2. **Review** - AI phân tích và đánh giá
3. **Edit** - Chỉnh sửa (Auto-edit hoặc Manual)
4. **Preview** - Xem trước kết quả
5. **Export** - Xuất file PDF

---

## 📋 TIÊU CHÍ ĐÁNH GIÁ CV

### 4 Điểm số chính:

| Tiêu chí | Mô tả |
|----------|-------|
| **Overall Score** | Điểm tổng thể của CV (0-100) |
| **ATS Score** | Khả năng vượt qua hệ thống lọc tự động |
| **Impact Score** | Mức độ ấn tượng của thành tích |
| **Clarity Score** | Độ rõ ràng, dễ đọc |

### Các yếu tố được đánh giá:
- ✅ Strengths - Điểm mạnh
- ⚠️ Weaknesses - Điểm yếu
- 💡 Suggestions - Gợi ý cải thiện

---

## 🌟 PHƯƠNG PHÁP STAR

### STAR Method là gì?
- **S**ituation - Tình huống/Bối cảnh
- **T**ask - Nhiệm vụ được giao
- **A**ction - Hành động thực hiện
- **R**esult - Kết quả đạt được (có số liệu)

### Ví dụ chuyển đổi:

| TRƯỚC (Yếu) | SAU (STAR) |
|-------------|------------|
| "Tham gia các khóa đào tạo chuyên môn" | "Hoàn thành chương trình đào tạo PHP & WordPress chuyên sâu, deliver 3 tính năng production trong 8 tuần" |
| "Thiết kế và triển khai các module" | "Thiết kế và triển khai 5 module quan trọng sử dụng PHP & jQuery, giảm 40% thời gian đồng bộ dữ liệu" |
| "Làm việc với database" | "Tối ưu 15+ truy vấn SQL phức tạp, cải thiện 60% hiệu suất hệ thống" |

---

## 🤖 PROMPT TỐI ƯU CV (Tóm tắt)

```
ROLE: Expert CV editor

TASK: Review và suggest improvements cho CV hiện có

STRICT RULES:
✅ Fix Grammar & Spelling - Sửa lỗi chính tả, ngữ pháp
✅ Rewrite Weak Statements - Chuyển đổi câu yếu thành STAR format
✅ Add Metrics - Thêm số liệu cụ thể (%, số lượng, thời gian)
✅ Optimize Length - Rút gọn hoặc mở rộng phù hợp
✅ ATS Optimization - Thêm keywords ngành nghề
✅ Missing Fields - Gợi ý điền LinkedIn/GitHub

❌ DO NOT Fabricate - KHÔNG bịa thông tin công ty, dự án
❌ DO NOT Add Experience Years - KHÔNG tự ý thêm số năm kinh nghiệm
❌ DO NOT Create New Sections - Chỉ cải thiện nội dung có sẵn

IMPROVEMENT TYPES:
- modify: Sửa lỗi, viết lại, thêm metrics
- add: Điền thông tin còn thiếu

OUTPUT: JSON với suggestions array chứa:
- section, field, type, original, improved, reason, impact
```

### Các loại cải thiện:

| Type | Impact | Mô tả |
|------|--------|-------|
| **Thêm Metrics** | High | "improved performance" → "improved performance by 30%" |
| **Action Verbs** | High | "responsible for" → "Led", "helped with" → "Contributed to" |
| **Rút gọn** | Medium | Loại bỏ từ thừa, giữ nội dung quan trọng |
| **Mở rộng** | Medium | Thêm chi tiết cho các mô tả quá ngắn |
| **ATS Keywords** | Medium | Thêm từ khóa ngành tự nhiên vào nội dung |

---

# 4. SUMMARIZE - Phân Tích CV Chuyên Sâu

## 🎯 MỤC ĐÍCH
- **Phân tích toàn diện** CV của ứng viên
- Đánh giá **kỹ năng chi tiết** theo từng category
- Gợi ý **nghề nghiệp phù hợp** với kỹ năng
- Cung cấp **action items** để cải thiện

## 💡 GIẢI PHÁP

### Công nghệ sử dụng:
- **Google Gemini AI** - Phân tích nội dung CV
- **PDF/DOCX Parser** - Đọc nội dung file

### Hỗ trợ định dạng:
- PDF, DOCX, TXT
- MP3, WAV, OGG (audio transcription)

---

## 📋 TIÊU CHÍ PHÂN TÍCH

### 1. Skills Analysis (Phân tích kỹ năng)

| Category | Ví dụ | Đánh giá |
|----------|-------|----------|
| **Technical** | React, Node.js, Python | Rating 1-5, Level |
| **Soft Skills** | Communication, Leadership | Rating 1-5, Level |
| **Language** | English, Japanese | Rating 1-5, Level |
| **Tools** | Git, Docker, Figma | Rating 1-5, Level |

### 2. Career Recommendations (Gợi ý nghề nghiệp)

Mỗi gợi ý bao gồm:
- **Title** - Tên vị trí phù hợp
- **Match Score** - % phù hợp (0-100%)
- **Description** - Mô tả công việc
- **Salary Range** - Khoảng lương
- **Required Skills** - Kỹ năng cần có

### 3. Action Items (Việc cần làm)

| Priority | Mô tả |
|----------|-------|
| **High** | Cần làm ngay để cải thiện CV |
| **Medium** | Nên làm để tăng cơ hội |
| **Low** | Có thể cải thiện thêm |

### 4. CV Completeness (Độ hoàn thiện)

Đánh giá từng section:
- Personal Info, Summary, Experience
- Education, Skills, Projects, Languages

Status: Complete ✅ | Partial ⚠️ | Missing ❌

---

## 📊 OUTPUT STRUCTURE

```json
{
  "overallRating": 7.5,        // Điểm tổng (0-10)
  "cvCompleteness": {
    "overallScore": 75,        // % hoàn thiện
    "sections": [...]          // Chi tiết từng section
  },
  "professionalSummary": "...", // Tóm tắt chuyên nghiệp
  "skillsAnalysis": [...],     // Phân tích kỹ năng
  "careerRecommendations": [...], // Gợi ý nghề nghiệp
  "actionItems": [...],        // Việc cần làm
  "experienceHighlights": [...], // Điểm nhấn kinh nghiệm
  "weaknesses": [...]          // Điểm yếu & gợi ý
}
```

---

# 5. FIND JOB - Tìm Việc Làm

## 🎯 MỤC ĐÍCH
- **Phân tích CV** để xác định lĩnh vực và level phù hợp
- **Gợi ý vị trí công việc** dựa trên kỹ năng
- Cung cấp **thông tin thị trường** (xu hướng, mức lương)
- **Tạo link tìm việc** trên các nền tảng tuyển dụng

## 💡 GIẢI PHÁP

### Quy trình 5 bước:
1. **Upload CV** - Phân tích tự động
2. **Chọn lĩnh vực** - Được gợi ý từ CV
3. **Chọn Level** - Được gợi ý từ số năm kinh nghiệm
4. **Thiết lập preferences** - Địa điểm, loại hình công việc
5. **Xem kết quả** - Link tìm việc + Market insights

---

## 📋 TIÊU CHÍ PHÂN TÍCH CV

### 1. Xác định lĩnh vực (Field Detection)

Dựa trên **keywords + skills** trong CV:

| Lĩnh vực | Keywords | Skills |
|----------|----------|--------|
| **Frontend Developer** | frontend, ui developer | React, Vue, Angular, CSS |
| **Backend Developer** | backend, api developer | Node.js, Python, Java, PHP |
| **Full Stack Developer** | fullstack | MERN, MEAN, LAMP |
| **DevOps Engineer** | devops, sre | Docker, K8s, Jenkins, AWS |
| **Data Scientist** | data scientist, ml engineer | Python, TensorFlow, ML |
| **Mobile Developer** | mobile, app developer | React Native, Flutter, Swift |

### 2. Xác định Level

| Level | Điều kiện |
|-------|-----------|
| **Intern** | Sinh viên, đang học |
| **Fresher** | 0-1 năm kinh nghiệm |
| **Junior** | 1-3 năm kinh nghiệm |
| **Middle** | 3-5 năm kinh nghiệm |
| **Senior** | 5-8 năm kinh nghiệm |
| **Manager** | 7-12 năm + leadership keywords |
| **Director** | 10+ năm + CEO/CTO/VP keywords |

### 3. Skill Level Inference

Xác định mức độ thành thạo từ context CV:

| Level | Patterns |
|-------|----------|
| **Expert** | "expert in", "thành thạo", "advanced" |
| **Advanced** | "proficient", "strong", "khá tốt" |
| **Intermediate** | Mention 3+ lần trong CV |
| **Beginner** | "basic", "learning", "cơ bản" |

---

## 📊 MARKET INSIGHTS

Thông tin thị trường cho từng lĩnh vực:

| Thông tin | Mô tả |
|-----------|-------|
| **Demand Level** | Mức độ nhu cầu (High/Medium/Low) |
| **Salary Range** | Khoảng lương theo level |
| **Hot Skills** | Kỹ năng đang được săn đón |
| **Growth Trend** | Xu hướng phát triển ngành |

### Ví dụ - Frontend Developer:

```
Demand: High
Salary (VN): 
  - Fresher: 8-15 triệu
  - Junior: 15-25 triệu
  - Senior: 35-60 triệu
Hot Skills: TypeScript, React, Next.js, Testing
Growth: +15% YoY
```

---

## 🔗 JOB PLATFORMS

Tự động tạo link tìm việc trên:
- **Vietnam**: ITviec, TopDev, VietnamWorks, LinkedIn
- **Global**: Indeed, Glassdoor, LinkedIn, AngelList

Link được format với:
- Keyword (Field + Level)
- Location (từ CV hoặc user chọn)
- Experience level

---

# 📎 TỔNG HỢP

## So sánh 5 tính năng:

| Tính năng | Mục đích chính | AI Model | Input | Output |
|-----------|---------------|----------|-------|--------|
| **Mock Interview** | Luyện phỏng vấn | Gemini 2.0 Flash | Voice + Camera | Assessment Report |
| **Quiz** | Đánh giá kỹ năng | Gemini 2.5 Flash | CV + Lựa chọn | Quiz Score + Feedback |
| **Support CV** | Tối ưu CV | Gemini (Rate Limited) | PDF/DOCX | Enhanced CV |
| **Summarize** | Phân tích CV | Gemini | PDF/DOCX/Audio | Analysis Report |
| **Find Job** | Tìm việc | Local Analysis | CV | Job Links + Market Info |

## Công nghệ chung:
- **Frontend**: Next.js 14, React, TailwindCSS, Framer Motion
- **AI**: Google Gemini API (2.5-flash, 2.5-flash)
- **Voice**: Web Speech API, Text-to-Speech
- **Video**: D-ID Talking Head, WebRTC
- **Languages**: VI, EN, JA, ZH, KO

---

*Tài liệu được tạo tự động từ source code của dự án AI Interview*
