// import { SummaryResponse } from '../models/Summary';

import { SummaryResponse } from "../models/Summary";

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

  // Step 3: Language-specific instructions
  const languageInstructions: Record<string, string> = {
    vi: `Phân tích văn bản CV sau và sinh ra tối đa ${keypoint} KEY POINTS (ý chính) BẰNG TIẾNG VIỆT về:
- Các kỹ năng nổi bật nhất của ứng viên (ví dụ: ngôn ngữ lập trình, framework, công nghệ, soft skills).
- Các công nghệ đã sử dụng trong các dự án thực tế.
- Những thành tích, vai trò, hoặc điểm mạnh cần chú ý nhất của ứng viên.

Đồng thời, hãy chỉ ra tối đa 3 NHƯỢC ĐIỂM hoặc điểm còn thiếu sót trong CV này (nếu có), và gợi ý cách cải thiện cụ thể cho từng nhược điểm.

Chỉ trả về JSON đúng format sau, không kèm bất kỳ text nào khác, không bọc trong dấu \`\`\`json:`,
    
    en: `Analyze the CV text below and generate up to ${keypoint} KEY POINTS IN ENGLISH about:
- The candidate's most prominent skills (e.g., programming languages, frameworks, technologies, soft skills).
- Technologies used in actual projects.
- Notable achievements, roles, or strengths of the candidate.

Additionally, identify up to 3 WEAKNESSES or shortcomings in this CV (if any), and suggest specific improvements for each weakness.

Only return JSON in the exact format below, without any other text or \`\`\`json wrapper:`,

    ja: `以下のCV文書を分析し、最大${keypoint}個のキーポイントを日本語で生成してください：
- 候補者の最も顕著なスキル（例：プログラミング言語、フレームワーク、テクノロジー、ソフトスキル）。
- 実際のプロジェクトで使用された技術。
- 注目すべき成果、役割、または候補者の強み。

さらに、このCVの最大3つの弱点または不足点（ある場合）を指摘し、各弱点に対する具体的な改善策を提案してください。

\`\`\`jsonラッパーなしで、以下の正確な形式でのみJSONを返してください：`,

    zh: `分析以下简历文本，用中文生成最多${keypoint}个关键点：
- 候选人最突出的技能（例如：编程语言、框架、技术、软技能）。
- 实际项目中使用的技术。
- 值得注意的成就、角色或候选人的优势。

此外，指出此简历中最多3个弱点或不足之处（如果有），并为每个弱点提供具体的改进建议。

仅返回以下确切格式的JSON，不要包含任何其他文本或\`\`\`json包装：`,

    ko: `아래 CV 텍스트를 분석하고 한국어로 최대 ${keypoint}개의 핵심 포인트를 생성하세요：
- 후보자의 가장 두드러진 기술 (예: 프로그래밍 언어, 프레임워크, 기술, 소프트 스킬).
- 실제 프로젝트에서 사용된 기술.
- 주목할 만한 성과, 역할 또는 후보자의 강점.

또한, 이 CV에서 최대 3개의 약점 또는 부족한 점(있는 경우)을 지적하고 각 약점에 대한 구체적인 개선 제안을 제공하세요.

\`\`\`json 래퍼 없이 아래의 정확한 형식으로만 JSON을 반환하세요：`
  };

  const languageInstruction = languageInstructions[language] || languageInstructions["vi"];

  // JSON format examples for each language
  const formatExamples: Record<string, string> = {
    vi: `{
  "summary": [
    "Kỹ năng: Thành thạo Java, JavaScript, Python, C#",
    "Công nghệ sử dụng: ReactJS, NodeJS, Spring Boot, MongoDB",
    "Thành tích nổi bật: Vô địch Hackathon, phát triển hệ thống quản lý",
    "Vai trò/điểm mạnh: Full-Stack Developer, có kinh nghiệm thiết kế database"
  ],
  "weaknesses": [
    {
      "issue": "Chưa nêu rõ số năm kinh nghiệm",
      "suggestion": "Thêm thông tin về số năm kinh nghiệm làm việc với từng công nghệ"
    }
  ]
}`,
    en: `{
  "summary": [
    "Skills: Proficient in Java, JavaScript, Python, C#",
    "Technologies: ReactJS, NodeJS, Spring Boot, MongoDB",
    "Achievements: Champion at Hackathon, developed management system",
    "Role/Strengths: Full-Stack Developer, experienced in database design"
  ],
  "weaknesses": [
    {
      "issue": "Years of experience not clearly stated",
      "suggestion": "Add information about years of experience with each technology"
    }
  ]
}`,
    ja: `{
  "summary": [
    "スキル: Java、JavaScript、Python、C#に精通",
    "技術: ReactJS、NodeJS、Spring Boot、MongoDB",
    "実績: ハッカソン優勝、管理システム開発",
    "役割/強み: フルスタック開発者、データベース設計の経験"
  ],
  "weaknesses": [
    {
      "issue": "経験年数が明確に記載されていない",
      "suggestion": "各技術の経験年数に関する情報を追加する"
    }
  ]
}`,
    zh: `{
  "summary": [
    "技能: 精通Java、JavaScript、Python、C#",
    "技术: ReactJS、NodeJS、Spring Boot、MongoDB",
    "成就: 黑客马拉松冠军，开发管理系统",
    "角色/优势: 全栈开发者，有数据库设计经验"
  ],
  "weaknesses": [
    {
      "issue": "未明确说明工作年限",
      "suggestion": "添加每项技术的工作年限信息"
    }
  ]
}`,
    ko: `{
  "summary": [
    "기술: Java, JavaScript, Python, C#에 능숙",
    "기술 스택: ReactJS, NodeJS, Spring Boot, MongoDB",
    "성과: 해커톤 우승, 관리 시스템 개발",
    "역할/강점: 풀스택 개발자, 데이터베이스 설계 경험"
  ],
  "weaknesses": [
    {
      "issue": "경력 연수가 명확하게 명시되지 않음",
      "suggestion": "각 기술에 대한 경력 연수 정보 추가"
    }
  ]
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
      maxOutputTokens: 2048,
      topK: 40,
      topP: 0.95,
      candidateCount: 1,
    },
  };

  // Step 6: Call Gemini API with retry
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
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
    const jsonStr = extractJsonFromText(contentText);
    if (!jsonStr) {
      console.error("[generateSummary] Không tìm thấy JSON trong response");
      throw new Error("API không trả về JSON hợp lệ");
    }

    console.log("[generateSummary] Extracted JSON string:", jsonStr);

    // Step 9: Parse JSON
    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error("[generateSummary] Lỗi parse JSON:", parseErr);
      console.error("[generateSummary] JSON string:", jsonStr);
      throw new Error("Không thể parse JSON từ API response");
    }

    // Step 10: Validate and clean response
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

    // Build a single-string summary and compute basic stats
    const summaryText = cleanedSummary.join("\n");
    const wordCount = summaryText.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // estimate minutes at 200 wpm

return {
  summary: summaryText,
  keyPoints: cleanedSummary,
  wordCount,
  readingTime,
  weaknesses: weaknesses.length > 0 ? weaknesses : undefined
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