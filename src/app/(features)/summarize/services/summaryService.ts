// import { SummaryResponse } from '../models/Summary';

import { SummaryResponse, SkillAnalysis, CareerRecommendation, ActionItem, CVCompleteness, ExperienceHighlight } from "../models/Summary";

// export const generateSummary = async (file: File, keypoint: number = 5): Promise<SummaryResponse> => {
//   try {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('QuestionCount', keypoint.toString());

//     const response = await fetch('https://ai-api.sobu.io/api/Document/summarize', {
//       method: 'POST',
//       body: formData
//     });

//     if (!response.ok) {
//       throw new Error('Failed to generate summary');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error generating summary:', error);
//     throw new Error('Failed to generate summary');
//   }
// };import { SummaryResponse } from '../models/Summary';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const fetchWithRetry = async (
  input: RequestInfo,
  init: RequestInit,
  retries = 6,
  baseDelayMs = 1000
): Promise<Response> => {
  let lastErr: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(input, init);
      if (res.ok) return res;
      
      // Handle 429 (Rate Limit) with exponential backoff
      if (res.status === 429) {
        const txt = await res.text().catch(() => "");
        console.warn(`[fetchWithRetry] Rate limit hit. Attempt ${attempt + 1}/${retries + 1}`);
        
        if (attempt < retries) {
          // Longer delay for rate limits
          const delay = baseDelayMs * Math.pow(2, attempt) * 2; // Double the delay for rate limits
          console.log(`[fetchWithRetry] Waiting ${delay}ms before retry...`);
          await sleep(delay + Math.floor(Math.random() * 1000));
          continue;
        }
        
        throw new Error(`Rate limit exceeded. Please wait a moment and try again.`);
      }
      
      // Handle 503 (Service Unavailable) and other 5xx errors with retry
      if (res.status >= 500 && res.status < 600) {
        const txt = await res.text().catch(() => "");
        console.warn(`[fetchWithRetry] Attempt ${attempt + 1}/${retries + 1} failed with ${res.status}`);
        
        if (attempt < retries) {
          const delay = baseDelayMs * Math.pow(2, attempt);
          console.log(`[fetchWithRetry] Retrying after ${delay}ms...`);
          await sleep(delay + Math.floor(Math.random() * 500));
          continue;
        }
        
        console.error(`[fetchWithRetry] API Error after all retries: ${res.status} - ${txt}`);
        throw new Error(`API Error ${res.status}: ${res.status === 503 ? 'Service temporarily unavailable. Please try again in a moment.' : txt}`);
      }
      
      // For other errors (4xx), don't retry
      const txt = await res.text().catch(() => "");
      console.error(`[fetchWithRetry] API Error: ${res.status} - ${txt}`);
      throw new Error(`API Error: ${res.status} - ${txt}`);
    } catch (err) {
      lastErr = err;
      if (attempt < retries && (err as any).message?.includes('fetch')) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        console.log(`[fetchWithRetry] Network error, retrying after ${delay}ms...`);
        await sleep(delay + Math.floor(Math.random() * 500));
        continue;
      }
      console.error("[fetchWithRetry] Network error or fetch threw:", lastErr);
      throw lastErr;
    }
  }
  throw lastErr;
};

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    console.log("[extractTextFromPDF] Bắt đầu đọc file PDF:", file.name);

    // Dynamically import PDF utilities (client-side only)
    const { extractTextFromPDF: extractPDF } = await import('@/lib/pdf-utils.client');
    const text = await extractPDF(file);

    console.log("[extractTextFromPDF] Đã trích xuất được:", text.length, "ký tự");
    return text;
  } catch (err) {
    console.error("[extractTextFromPDF] Lỗi khi đọc PDF:", err);
    throw new Error("Không thể trích xuất nội dung từ file PDF");
  }
};

// Hàm extract JSON từ response của Gemini (có thể có markdown wrapper)
const extractJsonFromText = (text: string): string | null => {
  if (!text || text.trim().length === 0) return null;
  
  const trimmed = text.trim();
  
  // Case 1: Pure JSON
  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
    return trimmed;
  }
  
  // Case 2: JSON wrapped in ```json ... ```
  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch && fencedMatch[1]) {
    return fencedMatch[1].trim();
  }
  
  // Case 3: Find JSON object in text
  const jsonMatch = text.match(/\{[\s\S]*"summary"[\s\S]*\}/);
  if (jsonMatch && jsonMatch[0]) {
    return jsonMatch[0].trim();
  }
  
  // Case 4: Try to find any JSON object
  const anyJsonMatch = text.match(/\{[\s\S]*\}/);
  if (anyJsonMatch && anyJsonMatch[0]) {
    return anyJsonMatch[0].trim();
  }
  
  return null;
};

// Hàm sửa JSON bị truncate
const repairTruncatedJson = (jsonStr: string): string => {
  try {
    // Try parsing first - if it works, return as is
    JSON.parse(jsonStr);
    return jsonStr;
  } catch (e) {
    // JSON is likely truncated, try to repair it
    let repaired = jsonStr;
    
    // Count open/close brackets and braces
    const openBraces = (repaired.match(/\{/g) || []).length;
    const closeBraces = (repaired.match(/\}/g) || []).length;
    const openBrackets = (repaired.match(/\[/g) || []).length;
    const closeBrackets = (repaired.match(/\]/g) || []).length;
    
    // Remove any trailing incomplete strings or values
    // Find the last complete property
    const lastCompletePropertyMatch = repaired.match(/[\s\S]*(?:"[^"]*"\s*:\s*(?:"[^"]*"|true|false|null|\d+(?:\.\d+)?|\]|\}))/);
    if (lastCompletePropertyMatch) {
      repaired = lastCompletePropertyMatch[0];
    }
    
    // Remove trailing comma if present
    repaired = repaired.replace(/,\s*$/, '');
    
    // Add missing closing brackets/braces
    const missingBrackets = openBrackets - (repaired.match(/\]/g) || []).length;
    const missingBraces = openBraces - (repaired.match(/\}/g) || []).length;
    
    for (let i = 0; i < missingBrackets; i++) {
      repaired += ']';
    }
    for (let i = 0; i < missingBraces; i++) {
      repaired += '}';
    }
    
    // Validate the repair worked
    try {
      JSON.parse(repaired);
      console.log("[repairTruncatedJson] Successfully repaired JSON");
      return repaired;
    } catch (e2) {
      console.warn("[repairTruncatedJson] Repair failed, returning original");
      return jsonStr;
    }
  }
};

// Hàm clean và validate summary array
const cleanSummaryArray = (arr: any[]): string[] => {
  if (!Array.isArray(arr)) return [];
  
  return arr
    .filter(item => item != null && String(item).trim().length > 0)
    .map(item => String(item).trim())
    .filter(s => s.length > 0);
};

export const generateSummary = async (
  file: File,
  keypoint: number = 5,
  language: string = "vi"
): Promise<SummaryResponse> => {
  console.log("[generateSummary] Bắt đầu xử lý file:", file.name, "keypoints:", keypoint, "language:", language);

  // Step 1: Extract text from file
  let text = "";
  try {
    if (file.type === "application/pdf") {
      text = await extractTextFromPDF(file);
    } else {
      text = await file.text();
    }
  } catch (err) {
    console.error("[generateSummary] Lỗi khi đọc file:", err);
    throw new Error("Không đọc được nội dung file");
  }

  if (!text || text.trim().length === 0) {
    throw new Error("File không có nội dung hoặc không đọc được");
  }

  // Step 2: Truncate if needed
  const maxChars = 12000;
  const truncated = text.length > maxChars 
    ? text.slice(0, maxChars) + "\n\n...(đã cắt bớt)..."
    : text;

  // Step 3: Language-specific instructions - ENHANCED VERSION
  const languageInstructions: Record<string, string> = {
    vi: `Bạn là chuyên gia phân tích CV/Resume hàng đầu. Phân tích CV sau một cách CHI TIẾT và CHUYÊN SÂU:

## YÊU CẦU PHÂN TÍCH:

1. **SKILLS ANALYSIS** (Phân tích kỹ năng chi tiết):
   - Liệt kê TẤT CẢ kỹ năng phát hiện được
   - Phân loại: technical (kỹ thuật), soft (mềm), language (ngôn ngữ), tool (công cụ)
   - Đánh giá mức độ: beginner (1), intermediate (2), advanced (3), expert (4-5)
   - Rating từ 1-5 dựa trên context trong CV

2. **CAREER RECOMMENDATIONS** (Gợi ý nghề nghiệp phù hợp):
   - Đề xuất 3-5 vị trí công việc phù hợp nhất
   - Điểm phù hợp (matchScore) từ 0-100
   - Liệt kê kỹ năng cần có cho mỗi vị trí

3. **ACTION ITEMS** (Hành động cải thiện):
   - Liệt kê 3-5 việc cần làm để cải thiện CV
   - Độ ưu tiên: high, medium, low
   - Phân loại: skills, experience, education, format, content
   - Mô tả tác động cụ thể

4. **CV COMPLETENESS** (Đánh giá độ hoàn thiện):
   - Điểm tổng thể từ 0-100
   - Đánh giá từng phần: contact, summary, experience, education, skills, projects
   - Trạng thái: complete, partial, missing

5. **EXPERIENCE HIGHLIGHTS** (Điểm nổi bật kinh nghiệm):
   - Vai trò, công ty, thời gian
   - Thành tựu quan trọng
   - Công nghệ sử dụng

6. **OVERALL RATING** (Điểm tổng thể): 1-10

7. **PROFESSIONAL SUMMARY** (Tóm tắt chuyên nghiệp): 2-3 câu mô tả profile

8. **KEY POINTS** (Các điểm chính): Tối đa ${keypoint} điểm

9. **WEAKNESSES** (Nhược điểm & Gợi ý cải thiện): Tối đa 3 điểm

Trả về JSON theo format sau, KHÔNG bọc trong \`\`\`json:`,

    en: `You are a top-tier CV/Resume analysis expert. Analyze the following CV in DETAIL and DEPTH:

## ANALYSIS REQUIREMENTS:

1. **SKILLS ANALYSIS** (Detailed skill analysis):
   - List ALL detected skills
   - Categorize: technical, soft, language, tool
   - Assess level: beginner (1), intermediate (2), advanced (3), expert (4-5)
   - Rating 1-5 based on CV context

2. **CAREER RECOMMENDATIONS** (Suitable job suggestions):
   - Suggest 3-5 most suitable positions
   - Match score (matchScore) from 0-100
   - List required skills for each position

3. **ACTION ITEMS** (Improvement actions):
   - List 3-5 things to improve the CV
   - Priority: high, medium, low
   - Category: skills, experience, education, format, content
   - Describe specific impact

4. **CV COMPLETENESS** (Completion assessment):
   - Overall score from 0-100
   - Evaluate each section: contact, summary, experience, education, skills, projects
   - Status: complete, partial, missing

5. **EXPERIENCE HIGHLIGHTS**:
   - Role, company, duration
   - Key achievements
   - Technologies used

6. **OVERALL RATING**: 1-10

7. **PROFESSIONAL SUMMARY**: 2-3 sentences describing profile

8. **KEY POINTS**: Up to ${keypoint} points

9. **WEAKNESSES**: Up to 3 points with suggestions

Return JSON in the following format, NOT wrapped in \`\`\`json:`,

    ja: `あなたはトップレベルのCV/履歴書分析の専門家です。以下のCVを詳細に分析してください。

すべての分析は日本語で行い、JSON形式で返してください。\`\`\`jsonでラップしないでください。`,

    zh: `您是顶级CV/简历分析专家。请详细深入地分析以下简历。

所有分析请用中文完成，返回JSON格式，不要用\`\`\`json包装。`,

    ko: `당신은 최고 수준의 CV/이력서 분석 전문가입니다. 다음 CV를 상세하게 분석하세요.

모든 분석은 한국어로 작성하고, JSON 형식으로 반환하세요. \`\`\`json으로 감싸지 마세요.`
  };

  const languageInstruction = languageInstructions[language] || languageInstructions["vi"];

  // JSON format examples - ENHANCED VERSION
  const formatExamples: Record<string, string> = {
    vi: `{
  "summary": [
    "Backend Developer với 3+ năm kinh nghiệm Java/Spring",
    "Có kinh nghiệm xây dựng hệ thống microservices",
    "Thành thạo React, TypeScript cho frontend"
  ],
  "skillsAnalysis": [
    {"name": "Java", "category": "technical", "level": "advanced", "rating": 4, "yearsOfExperience": "3 năm"},
    {"name": "Spring Boot", "category": "technical", "level": "advanced", "rating": 4},
    {"name": "React", "category": "technical", "level": "intermediate", "rating": 3},
    {"name": "Communication", "category": "soft", "level": "advanced", "rating": 4},
    {"name": "English", "category": "language", "level": "intermediate", "rating": 3}
  ],
  "careerRecommendations": [
    {
      "title": "Senior Backend Developer",
      "matchScore": 85,
      "description": "Phù hợp với kinh nghiệm Java/Spring và microservices",
      "requiredSkills": ["Java", "Spring Boot", "Microservices", "SQL"],
      "salaryRange": "25-40 triệu VND"
    },
    {
      "title": "Full-Stack Developer",
      "matchScore": 75,
      "description": "Có thể phát triển với kỹ năng React hiện có",
      "requiredSkills": ["Java", "React", "TypeScript", "REST API"],
      "salaryRange": "20-35 triệu VND"
    }
  ],
  "actionItems": [
    {
      "title": "Bổ sung chứng chỉ Cloud",
      "description": "Lấy chứng chỉ AWS hoặc Azure để tăng cơ hội",
      "priority": "high",
      "category": "skills",
      "impact": "Tăng 30% cơ hội được tuyển cho vị trí Senior"
    },
    {
      "title": "Thêm số liệu cụ thể",
      "description": "Thêm metrics cho các thành tựu (VD: giảm 40% thời gian xử lý)",
      "priority": "high",
      "category": "content",
      "impact": "CV thuyết phục hơn với nhà tuyển dụng"
    }
  ],
  "cvCompleteness": {
    "overallScore": 72,
    "sections": [
      {"name": "Contact Info", "score": 100, "status": "complete"},
      {"name": "Professional Summary", "score": 60, "status": "partial", "suggestions": ["Thêm USP cá nhân"]},
      {"name": "Experience", "score": 80, "status": "complete"},
      {"name": "Education", "score": 100, "status": "complete"},
      {"name": "Skills", "score": 70, "status": "partial", "suggestions": ["Thêm soft skills"]},
      {"name": "Projects", "score": 50, "status": "partial", "suggestions": ["Thêm link demo/GitHub"]}
    ]
  },
  "experienceHighlights": [
    {
      "role": "Backend Developer",
      "company": "TechCorp",
      "duration": "2021 - Hiện tại",
      "achievements": ["Phát triển hệ thống xử lý 1M requests/ngày", "Giảm 40% thời gian response"],
      "technologies": ["Java", "Spring Boot", "PostgreSQL", "Redis"]
    }
  ],
  "overallRating": 7,
  "professionalSummary": "Backend Developer với 3+ năm kinh nghiệm chuyên sâu về Java và Spring Boot. Có khả năng thiết kế và xây dựng hệ thống microservices quy mô lớn, đam mê tối ưu hiệu suất.",
  "weaknesses": [
    {
      "issue": "Thiếu chứng chỉ chuyên môn",
      "suggestion": "Bổ sung AWS Certified hoặc Oracle Java Certification"
    },
    {
      "issue": "Chưa có số liệu cụ thể cho thành tựu",
      "suggestion": "Thêm metrics định lượng cho mỗi achievement"
    }
  ]
}`,
    en: `{
  "summary": [
    "Backend Developer with 3+ years Java/Spring experience",
    "Experienced in building microservices systems",
    "Proficient in React, TypeScript for frontend"
  ],
  "skillsAnalysis": [
    {"name": "Java", "category": "technical", "level": "advanced", "rating": 4, "yearsOfExperience": "3 years"},
    {"name": "Spring Boot", "category": "technical", "level": "advanced", "rating": 4},
    {"name": "Communication", "category": "soft", "level": "advanced", "rating": 4}
  ],
  "careerRecommendations": [
    {
      "title": "Senior Backend Developer",
      "matchScore": 85,
      "description": "Matches Java/Spring and microservices experience",
      "requiredSkills": ["Java", "Spring Boot", "Microservices"],
      "salaryRange": "$80K-$120K"
    }
  ],
  "actionItems": [
    {
      "title": "Add Cloud Certifications",
      "description": "Get AWS or Azure certification",
      "priority": "high",
      "category": "skills",
      "impact": "30% higher chance for Senior positions"
    }
  ],
  "cvCompleteness": {
    "overallScore": 72,
    "sections": [
      {"name": "Contact Info", "score": 100, "status": "complete"},
      {"name": "Experience", "score": 80, "status": "complete"}
    ]
  },
  "experienceHighlights": [
    {
      "role": "Backend Developer",
      "company": "TechCorp",
      "duration": "2021 - Present",
      "achievements": ["Built system handling 1M requests/day"],
      "technologies": ["Java", "Spring Boot", "PostgreSQL"]
    }
  ],
  "overallRating": 7,
  "professionalSummary": "Backend Developer with 3+ years of deep expertise in Java and Spring Boot.",
  "weaknesses": [
    {
      "issue": "Missing certifications",
      "suggestion": "Add AWS Certified or Oracle Java Certification"
    }
  ]
}`,
    ja: `{
  "summary": ["Java/Spring経験3年以上のバックエンド開発者"],
  "skillsAnalysis": [{"name": "Java", "category": "technical", "level": "advanced", "rating": 4}],
  "careerRecommendations": [{"title": "シニアバックエンド開発者", "matchScore": 85, "description": "経験にマッチ", "requiredSkills": ["Java"]}],
  "actionItems": [{"title": "クラウド資格取得", "description": "AWS資格を取得", "priority": "high", "category": "skills", "impact": "採用確率向上"}],
  "cvCompleteness": {"overallScore": 72, "sections": [{"name": "連絡先", "score": 100, "status": "complete"}]},
  "overallRating": 7,
  "professionalSummary": "3年以上のJava経験を持つバックエンド開発者",
  "weaknesses": [{"issue": "資格なし", "suggestion": "AWS資格取得を推奨"}]
}`,
    zh: `{
  "summary": ["拥有3年以上Java/Spring经验的后端开发者"],
  "skillsAnalysis": [{"name": "Java", "category": "technical", "level": "advanced", "rating": 4}],
  "careerRecommendations": [{"title": "高级后端开发", "matchScore": 85, "description": "匹配经验", "requiredSkills": ["Java"]}],
  "actionItems": [{"title": "获取云证书", "description": "获取AWS认证", "priority": "high", "category": "skills", "impact": "提高录用率"}],
  "cvCompleteness": {"overallScore": 72, "sections": [{"name": "联系方式", "score": 100, "status": "complete"}]},
  "overallRating": 7,
  "professionalSummary": "拥有3年以上Java深度经验的后端开发者",
  "weaknesses": [{"issue": "缺少证书", "suggestion": "建议获取AWS认证"}]
}`,
    ko: `{
  "summary": ["3년 이상의 Java/Spring 경험을 가진 백엔드 개발자"],
  "skillsAnalysis": [{"name": "Java", "category": "technical", "level": "advanced", "rating": 4}],
  "careerRecommendations": [{"title": "시니어 백엔드 개발자", "matchScore": 85, "description": "경험과 일치", "requiredSkills": ["Java"]}],
  "actionItems": [{"title": "클라우드 자격증 취득", "description": "AWS 자격증 취득", "priority": "high", "category": "skills", "impact": "채용 확률 향상"}],
  "cvCompleteness": {"overallScore": 72, "sections": [{"name": "연락처", "score": 100, "status": "complete"}]},
  "overallRating": 7,
  "professionalSummary": "3년 이상의 Java 심층 경험을 가진 백엔드 개발자",
  "weaknesses": [{"issue": "자격증 없음", "suggestion": "AWS 자격증 취득 권장"}]
}`
  };

  const formatExample = formatExamples[language] || formatExamples["vi"];

  // Step 4: Build prompt
const prompt = `
${languageInstruction}

${formatExample}

VĂN BẢN:
${truncated}
`;

  // Step 4: Check API key
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Chưa cấu hình Gemini API key");
  }

  // Step 5: Prepare request body
  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 4096,
      topK: 40,
      topP: 0.95,
      candidateCount: 1,
    },
  };

  // Step 6: Call Gemini API with retry
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    console.log("[generateSummary] Gọi Gemini API...");

    const response = await fetchWithRetry(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log("[generateSummary] Gemini response:", JSON.stringify(data, null, 2));

    // Step 7: Extract text from response
    let contentText: string | null = null;
    
    if (data.candidates && Array.isArray(data.candidates) && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts && Array.isArray(candidate.content.parts)) {
        const firstPart = candidate.content.parts[0];
        if (firstPart && typeof firstPart.text === 'string') {
          contentText = firstPart.text;
        }
      }
    }

    if (!contentText) {
      console.error("[generateSummary] Không tìm thấy text trong response:", data);
      throw new Error("API không trả về nội dung hợp lệ");
    }

    console.log("[generateSummary] Raw content text:", contentText);

    // Step 8: Extract JSON from content
    let jsonStr = extractJsonFromText(contentText);
    if (!jsonStr) {
      console.error("[generateSummary] Không tìm thấy JSON trong response");
      throw new Error("API không trả về JSON hợp lệ");
    }

    console.log("[generateSummary] Extracted JSON string length:", jsonStr.length);

    // Step 9: Try to repair truncated JSON if needed
    jsonStr = repairTruncatedJson(jsonStr);

    // Step 10: Parse JSON
    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error("[generateSummary] Lỗi parse JSON:", parseErr);
      console.error("[generateSummary] JSON string:", jsonStr.substring(0, 500) + "...");
      throw new Error("Không thể parse JSON từ API response. Vui lòng thử lại.");
    }

    // Step 11: Validate and clean response
    if (!parsed || typeof parsed !== 'object') {
      throw new Error("JSON response không đúng định dạng object");
    }

    if (!parsed.summary || !Array.isArray(parsed.summary)) {
      console.error("[generateSummary] Response thiếu summary array:", parsed);
      throw new Error("API response thiếu trường 'summary'");
    }

    const cleanedSummary = cleanSummaryArray(parsed.summary);
    
    if (cleanedSummary.length === 0) {
      throw new Error("API không tạo được key points");
    }

    console.log("[generateSummary] Thành công! Số key points:", cleanedSummary.length);

    // Step 11: Extract and validate weaknesses
    const weaknesses = Array.isArray(parsed.weaknesses) 
      ? parsed.weaknesses
          .filter((w: any) => w && typeof w === 'object' && w.issue && w.suggestion)
          .map((w: any) => ({
            issue: String(w.issue).trim(),
            suggestion: String(w.suggestion).trim()
          }))
      : [];

    console.log("[generateSummary] Số weaknesses:", weaknesses.length);

    // Step 12: Extract enhanced fields
    const skillsAnalysis: SkillAnalysis[] = Array.isArray(parsed.skillsAnalysis)
      ? parsed.skillsAnalysis
          .filter((s: any) => s && typeof s === 'object' && s.name)
          .map((s: any) => ({
            name: String(s.name).trim(),
            category: ['technical', 'soft', 'language', 'tool'].includes(s.category) ? s.category : 'technical',
            level: ['beginner', 'intermediate', 'advanced', 'expert'].includes(s.level) ? s.level : 'intermediate',
            rating: typeof s.rating === 'number' ? Math.min(5, Math.max(1, s.rating)) : 3,
            yearsOfExperience: s.yearsOfExperience ? String(s.yearsOfExperience) : undefined
          }))
      : [];

    const careerRecommendations: CareerRecommendation[] = Array.isArray(parsed.careerRecommendations)
      ? parsed.careerRecommendations
          .filter((c: any) => c && typeof c === 'object' && c.title)
          .map((c: any) => ({
            title: String(c.title).trim(),
            matchScore: typeof c.matchScore === 'number' ? Math.min(100, Math.max(0, c.matchScore)) : 50,
            description: c.description ? String(c.description).trim() : '',
            requiredSkills: Array.isArray(c.requiredSkills) ? c.requiredSkills.map((s: any) => String(s).trim()) : [],
            salaryRange: c.salaryRange ? String(c.salaryRange) : undefined
          }))
      : [];

    const actionItems: ActionItem[] = Array.isArray(parsed.actionItems)
      ? parsed.actionItems
          .filter((a: any) => a && typeof a === 'object' && a.title)
          .map((a: any) => ({
            title: String(a.title).trim(),
            description: a.description ? String(a.description).trim() : '',
            priority: ['high', 'medium', 'low'].includes(a.priority) ? a.priority : 'medium',
            category: ['skills', 'experience', 'education', 'format', 'content'].includes(a.category) ? a.category : 'content',
            impact: a.impact ? String(a.impact).trim() : ''
          }))
      : [];

    const cvCompleteness: CVCompleteness | undefined = parsed.cvCompleteness && typeof parsed.cvCompleteness === 'object'
      ? {
          overallScore: typeof parsed.cvCompleteness.overallScore === 'number' 
            ? Math.min(100, Math.max(0, parsed.cvCompleteness.overallScore)) 
            : 50,
          sections: Array.isArray(parsed.cvCompleteness.sections)
            ? parsed.cvCompleteness.sections.map((s: any) => ({
                name: String(s.name || 'Unknown').trim(),
                score: typeof s.score === 'number' ? Math.min(100, Math.max(0, s.score)) : 50,
                status: ['complete', 'partial', 'missing'].includes(s.status) ? s.status : 'partial',
                suggestions: Array.isArray(s.suggestions) ? s.suggestions.map((sg: any) => String(sg).trim()) : undefined
              }))
            : []
        }
      : undefined;

    const experienceHighlights: ExperienceHighlight[] = Array.isArray(parsed.experienceHighlights)
      ? parsed.experienceHighlights
          .filter((e: any) => e && typeof e === 'object' && e.role)
          .map((e: any) => ({
            role: String(e.role).trim(),
            company: e.company ? String(e.company).trim() : undefined,
            duration: e.duration ? String(e.duration).trim() : undefined,
            achievements: Array.isArray(e.achievements) ? e.achievements.map((a: any) => String(a).trim()) : [],
            technologies: Array.isArray(e.technologies) ? e.technologies.map((t: any) => String(t).trim()) : []
          }))
      : [];

    const overallRating = typeof parsed.overallRating === 'number' 
      ? Math.min(10, Math.max(1, parsed.overallRating)) 
      : undefined;

    const professionalSummary = parsed.professionalSummary 
      ? String(parsed.professionalSummary).trim() 
      : undefined;

    console.log("[generateSummary] Enhanced data extracted:", {
      skillsCount: skillsAnalysis.length,
      careersCount: careerRecommendations.length,
      actionsCount: actionItems.length,
      hasCompleteness: !!cvCompleteness,
      experienceCount: experienceHighlights.length
    });

    // Build a single-string summary and compute basic stats
    const summaryText = cleanedSummary.join("\n");
    const wordCount = summaryText.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // estimate minutes at 200 wpm

    return {
      summary: summaryText,
      keyPoints: cleanedSummary,
      wordCount,
      readingTime,
      weaknesses: weaknesses.length > 0 ? weaknesses : undefined,
      skillsAnalysis: skillsAnalysis.length > 0 ? skillsAnalysis : undefined,
      careerRecommendations: careerRecommendations.length > 0 ? careerRecommendations : undefined,
      actionItems: actionItems.length > 0 ? actionItems : undefined,
      cvCompleteness,
      experienceHighlights: experienceHighlights.length > 0 ? experienceHighlights : undefined,
      overallRating,
      professionalSummary
    } satisfies SummaryResponse;

  } catch (err: any) {
    console.error("[generateSummary] Lỗi:", err);
    
    // Provide more specific error messages
    if (err.message?.includes("503") || err.message?.includes("Service temporarily unavailable")) {
      throw new Error("Gemini API đang quá tải. Vui lòng đợi 1-2 phút và thử lại.");
    }
    if (err.message?.includes("API Error: 429")) {
      throw new Error("Vượt quá giới hạn API. Vui lòng thử lại sau vài phút.");
    }
    if (err.message?.includes("API Error: 401")) {
      throw new Error("API key không hợp lệ. Vui lòng kiểm tra cấu hình.");
    }
    if (err.message?.includes("API Error: 400")) {
      throw new Error("Request không hợp lệ. Vui lòng thử lại với file khác.");
    }
    if (err.message?.includes("fetch")) {
      throw new Error("Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.");
    }
    
    throw new Error(err?.message || "Không thể tạo summary. Vui lòng thử lại.");
  }
};