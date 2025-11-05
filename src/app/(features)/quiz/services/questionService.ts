// import { QuestionResponse } from "../models/Question";

// export const generateQuestions = async (
//   file: File,
//   questionCount: number = 10
// ): Promise<QuestionResponse> => {
//   try {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("QuestionCount", questionCount.toString());

//     const response = await fetch(
//       "https://ai-api.sobu.io/api/Document/generate-multichoice-questions",
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to generate questions");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error generating questions:", error);
//     throw new Error("Failed to generate questions");
//   }

// };
// utils/pdfUtils.ts
// @ts-ignore
let pdfjsLib: any;
if (typeof window !== "undefined") {
  // @ts-ignore
  pdfjsLib = require("pdfjs-dist/build/pdf");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
}
//pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

import { QuestionResponse } from "../models/Question";
import type { QuizQuestion, QuizLevel } from "@/data/quiz-questions";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const fetchWithRetry = async (
  input: RequestInfo,
  init: RequestInit,
  retries = 4,
  baseDelayMs = 500
): Promise<Response> => {
  let lastErr: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(input, init);
      if (res.ok) return res;
      if (res.status >= 500 && res.status < 600 && attempt < retries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await sleep(delay + Math.floor(Math.random() * 200));
        continue;
      }
      const txt = await res.text().catch(() => "");
      console.error(`[fetchWithRetry] API Error: ${res.status} - ${txt}`);
      throw new Error(`API Error: ${res.status} - ${txt}`);
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await sleep(delay + Math.floor(Math.random() * 200));
        continue;
      }
      console.error("[fetchWithRetry] Network error or fetch threw:", lastErr);
      throw lastErr;
    }
  }
  throw lastErr;
};

const extractJsonFromText = (text: string): string | null => {
  if (!text) return null;
  const trimmed = text.trim();
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    return trimmed;
  }
  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fenced && fenced[1]) return fenced[1].trim();
  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch && braceMatch[0]) return braceMatch[0];
  const idx = text.indexOf('"questions"');
  if (idx !== -1) {
    const start = text.lastIndexOf("{", idx);
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      return text.substring(start, end + 1);
    }
  }
  return null;
};

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    console.log("[extractTextFromPDF] Bắt đầu đọc file PDF:", file);

    const arrayBuffer = await file.arrayBuffer();
    console.log("[extractTextFromPDF] Đã đọc arrayBuffer:", arrayBuffer);
console.log("[extractTextFromPDF] Chuẩn bị gọi getDocument");
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    console.log("[extractTextFromPDF] Đã load PDF, số trang:", pdf.numPages);

    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        console.log(`[extractTextFromPDF] Đang đọc trang ${pageNum}`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        console.log(`[extractTextFromPDF] textContent trang ${pageNum}:`, textContent);

        const pageText = textContent.items
          .map((item: any) => ("str" in item ? item.str : ""))
          .join(" ");

        fullText += pageText + "\n";
      } catch (pageErr) {
        console.error(`[extractTextFromPDF] Lỗi khi đọc trang ${pageNum}:`, pageErr);
      }
    }

    console.log("[extractTextFromPDF] Kết quả fullText:", fullText);

    return fullText.trim();
  } catch (err) {
    console.error("[extractTextFromPDF] Lỗi tổng thể khi đọc PDF:", err);
    throw new Error("Không thể trích xuất nội dung từ file PDF");
  }
};

export const generateQuestions = async (
  file: File,
  questionCount: number = 10,
  language: string = "vi"
): Promise<QuestionResponse> => {
  console.log("[generateQuestions] called", file, questionCount, language);

  let text = "";
  try {
    if (file.type === "application/pdf") {
      text = await extractTextFromPDF(file);
      console.log("[generateQuestions] PDF text:", text);
    } else {
      text = await file.text();
      console.log("[generateQuestions] File text:", text);
    }
  } catch (err) {
    console.error("[generateQuestions] Lỗi khi đọc file:", err);
    throw new Error("Không đọc được file");
  }

  if (!text || text.trim().length === 0) {
    console.error("[generateQuestions] File is empty or unreadable");
    throw new Error("File is empty or unreadable");
  }

  const maxChars = 12000;
  const truncated =
    text.length > maxChars
      ? text.slice(0, maxChars) + "\n\n...(truncated)..."
      : text;

  // Language-specific instructions
  const languageInstructions: Record<string, string> = {
    vi: "Tạo đúng 5 câu hỏi trắc nghiệm kỹ thuật bằng TIẾNG VIỆT dựa trên nội dung CV. Tất cả nội dung (câu hỏi, lựa chọn, giải thích) phải bằng tiếng Việt.",
    en: "Generate exactly 5 technical multiple-choice questions in ENGLISH based on the CV content. All content (questions, options, explanations) must be in English.",
    ja: "CVの内容に基づいて、正確に5つの技術的な多肢選択問題を日本語で作成してください。すべてのコンテンツ（質問、選択肢、説明）は日本語である必要があります。",
    zh: "根据简历内容，用中文生成正好5个技术选择题。所有内容（问题、选项、解释）必须是中文。",
    ko: "이력서 내용을 바탕으로 한국어로 정확히 5개의 기술 객관식 문제를 생성하세요. 모든 콘텐츠(질문, 선택지, 설명)는 한국어여야 합니다."
  };

  const languageInstruction = languageInstructions[language] || languageInstructions["vi"];

const prompt = `
${languageInstruction}

Tập trung vào các kỹ năng, công nghệ, framework, tool, ngôn ngữ lập trình hoặc các khía cạnh kỹ thuật xuất hiện trong CV. Không đề cập đến tên cá nhân, tên project cụ thể, hoặc thông tin cá nhân hóa; thay vào đó, hỏi về định nghĩa, ứng dụng, hoặc đặc điểm của các kỹ năng/công nghệ đó trong ngữ cảnh chung từ CV.

Yêu cầu:
- Mỗi câu hỏi phải có đúng 4 lựa chọn trả lời: A, B, C, D (với chỉ 1 đáp án đúng).
- Lựa chọn phải được đánh nhãn rõ ràng như "A. Mô tả lựa chọn A", "B. Mô tả lựa chọn B", v.v., và được thiết kế để đánh lừa nhẹ nhưng hợp lý.
- Độ khó: Trung bình, kiểm tra hiểu biết sâu hơn định nghĩa cơ bản.
- Đa dạng hóa: Phân bổ câu hỏi đều cho các phần khác nhau của CV (ví dụ: frontend, backend, database, tools, projects kỹ thuật).
- Giải thích: Ngắn gọn (1-2 câu), giải thích tại sao đáp án đúng, và trích dẫn vị trí cụ thể trong CV (như "Theo phần 'Skills' trong CV" hoặc "Dựa trên kinh nghiệm với [công nghệ] ở phần [section]").

Chỉ trả về JSON hợp lệ theo đúng format bên dưới, KHÔNG bọc trong \`\`\`json, không thêm bất kỳ text, ký tự, tiêu đề, chú thích, hoặc nội dung nào khác. Đảm bảo JSON có cấu trúc chính xác: mảng "questions" với đúng 5 phần tử, mỗi phần tử có đầy đủ trường, dấu phẩy đúng chỗ, không thiếu/thừa dấu ngoặc.

{
  "questions": [
    {
      "id": 1,
      "text": "Câu hỏi trắc nghiệm về kỹ năng/công nghệ trong CV...",
      "options": [
        "A. Lựa chọn A",
        "B. Lựa chọn B",
        "C. Lựa chọn C",
        "D. Lựa chọn D"
      ],
      "correctAnswer": 0,
      "explanation": "Giải thích ngắn gọn cho đáp án đúng, trích dẫn vị trí trong CV nếu áp dụng."
    }
  ]
}

CV:
${truncated}
`;
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[generateQuestions] Gemini API key is not configured");
    throw new Error("Gemini API key is not configured");
  }

  const body = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 4096,
      topK: 40,
      topP: 0.95,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_NONE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_NONE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_NONE"
      }
    ]
  };

  try {
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;


    console.log("[generateQuestions] Đang gọi Gemini API:", url);

    const res = await fetchWithRetry(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log("[generateQuestions] Gemini response:", JSON.stringify(data, null, 2));
    if (!data) throw new Error("Empty response from API");

    // Check for API errors
    if (data.error) {
      console.error("[generateQuestions] API Error:", data.error);
      throw new Error(`Gemini API Error: ${data.error.message || 'Unknown error'}`);
    }

    // Extract content text from response
    let contentText: string | null = null;
    
    if (Array.isArray(data.candidates) && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      
      // Check if content was blocked
      if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'RECITATION') {
        console.error("[generateQuestions] Content blocked:", candidate.finishReason);
        throw new Error(`Content blocked by API: ${candidate.finishReason}`);
      }
      
      // Extract text from parts
      if (candidate.content?.parts && Array.isArray(candidate.content.parts)) {
        contentText = candidate.content.parts
          .map((part: any) => part.text || '')
          .join('')
          .trim();
      }
    }

    if (!contentText) {
      console.error("[generateQuestions] No text content found in Gemini response:", JSON.stringify(data, null, 2));
      
      // Check for specific error cases
      if (data.candidates?.[0]?.finishReason) {
        const reason = data.candidates[0].finishReason;
        throw new Error(`Gemini API blocked content. Reason: ${reason}. Please try again with different content or check API quota.`);
      }
      
      throw new Error("Model did not return any text content. Please check API key and quota.");
    }
    
    console.log("[generateQuestions] Extracted contentText (first 500 chars):", contentText.substring(0, 500));

    const jsonStr = extractJsonFromText(contentText || "");
    if (!jsonStr) {
      console.error(
        "[generateQuestions] Unable to extract JSON from model output:",
        contentText
      );
      throw new Error("No JSON found in model response");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error(
        "[generateQuestions] JSON parse error:",
        parseErr,
        "content:",
        jsonStr
      );
      throw new Error("Invalid JSON returned from model");
    }

    if (
      !parsed ||
      !Array.isArray(parsed.questions) ||
      parsed.questions.length === 0
    ) {
      console.error(
        "[generateQuestions] Parsed JSON does not contain questions:",
        parsed
      );
      throw new Error("Model returned invalid questions format");
    }

    parsed.questions = parsed.questions.map((q: any, i: number) => {
      const id = typeof q.id === "number" ? q.id : i + 1;
      const textQ = typeof q.text === "string" ? q.text.trim() : "";
      const options = Array.isArray(q.options)
        ? q.options.map((o: any) => String(o))
        : [];
      const correctAnswer =
        typeof q.correctAnswer === "number" ? q.correctAnswer : 0;
      const explanation =
        typeof q.explanation === "string" ? q.explanation : "";

      if (!textQ || options.length !== 4) {
        console.error(
          `[generateQuestions] Question ${id} has invalid format`,
          q
        );
        throw new Error(`Question ${id} has invalid format`);
      }
      if (correctAnswer < 0 || correctAnswer > options.length - 1) {
        console.error(
          `[generateQuestions] Question ${id} has invalid correctAnswer`,
          q
        );
        throw new Error(`Question ${id} has invalid correctAnswer`);
      }

      return { id, text: textQ, options, correctAnswer, explanation };
    });

    return parsed as QuestionResponse;
  } catch (err: any) {
    console.error("[generateQuestions] error:", err);
    throw new Error(err?.message ?? "Failed to generate questions");
  }
};

/**
 * Generate quiz questions with AI based on skills from resume
 * This is used when the skills in resume don't match available question categories
 */
export const generateQuestionsWithAI = async (
  skills: string[],
  level: QuizLevel,
  count: number = 20,
  language: string = "vi"
): Promise<QuizQuestion[]> => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured");
  }

  // Language-specific instructions
  const languageInstructions: Record<string, string> = {
    vi: `Tạo đúng ${count} câu hỏi trắc nghiệm bằng TIẾNG VIỆT cho các kỹ năng: ${skills.join(', ')}. Tất cả nội dung (câu hỏi, lựa chọn, giải thích) phải bằng tiếng Việt.`,
    en: `Generate exactly ${count} multiple-choice quiz questions in ENGLISH for the following skills: ${skills.join(', ')}. All content (questions, options, explanations) must be in English.`,
    ja: `次のスキルに関する${count}個の多肢選択クイズ問題を日本語で作成してください: ${skills.join(', ')}。すべてのコンテンツ（質問、選択肢、説明）は日本語である必要があります。`,
    zh: `为以下技能用中文生成正好${count}个多项选择题: ${skills.join(', ')}。所有内容（问题、选项、解释）必须是中文。`,
    ko: `다음 기술에 대해 한국어로 정확히 ${count}개의 객관식 퀴즈 문제를 생성하세요: ${skills.join(', ')}。모든 콘텐츠(질문, 선택지, 설명)는 한국어여야 합니다。`
  };

  const languageInstruction = languageInstructions[language] || languageInstructions["vi"];
  
  // Level-specific instructions in the selected language
  const levelInstructions: Record<string, Record<QuizLevel, string>> = {
    vi: {
      low: 'Tập trung vào khái niệm cơ bản và nền tảng',
      mid: 'Tập trung vào các chủ đề trung cấp, patterns và best practices',
      high: 'Tập trung vào chủ đề nâng cao, edge cases và kiến thức chuyên gia'
    },
    en: {
      low: 'Focus on basic concepts and fundamentals',
      mid: 'Focus on intermediate topics, patterns, and best practices',
      high: 'Focus on advanced topics, edge cases, and expert-level knowledge'
    },
    ja: {
      low: '基本的な概念と基礎に焦点を当てる',
      mid: '中級トピック、パターン、ベストプラクティスに焦点を当てる',
      high: '高度なトピック、エッジケース、専門知識に焦点を当てる'
    },
    zh: {
      low: '专注于基本概念和基础知识',
      mid: '专注于中级主题、模式和最佳实践',
      high: '专注于高级主题、边缘情况和专家知识'
    },
    ko: {
      low: '기본 개념과 기초에 집중',
      mid: '중급 주제, 패턴 및 모범 사례에 집중',
      high: '고급 주제, 엣지 케이스 및 전문 지식에 집중'
    }
  };

  const levelInstruction = levelInstructions[language]?.[level] || levelInstructions['en'][level];

  const prompt = `${languageInstruction}

Difficulty level: ${level.toUpperCase()} - ${levelInstruction}

Requirements:
- Each question must have exactly 4 options
- Only 1 correct answer per question
- Include a brief explanation for why the answer is correct
- Questions should test practical knowledge, not just memorization
- Distribute questions evenly across the provided skills: ${skills.join(', ')}
- Make questions realistic and relevant to real-world scenarios

IMPORTANT: All content (questions, options, explanations) MUST be in the language specified above.

Return ONLY valid JSON in this exact format (no markdown code blocks, no extra text):
{
  "questions": [
    {
      "id": "skill-level-1",
      "category": "${skills[0]}",
      "level": "${level}",
      "question": "Question text here?",
      "options": [
        "Option A text",
        "Option B text",
        "Option C text",
        "Option D text"
      ],
      "correctAnswer": 0,
      "explanation": "Brief explanation why this answer is correct",
      "tags": ["${skills[0]}", "tag2"]
    }
  ]
}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 6144,
      topK: 40,
      topP: 0.95,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_NONE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_NONE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_NONE"
      }
    ]
  };

  try {
    // Use gemini-2.0-flash-exp (experimental but working) or fall back to gemini-pro
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
    
    console.log(`[generateQuestionsWithAI] Generating ${count} questions in ${language} for skills:`, skills);
    
    const res = await fetchWithRetry(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log('[generateQuestionsWithAI] Raw API response:', JSON.stringify(data, null, 2).substring(0, 1000));
    
    if (data.error) {
      console.error('[generateQuestionsWithAI] API Error:', data.error);
      throw new Error(`Gemini API Error: ${data.error.message || 'Unknown error'}`);
    }

    // Check for blocked content
    if (data.candidates?.[0]?.finishReason && data.candidates[0].finishReason !== 'STOP') {
      console.warn('[generateQuestionsWithAI] Content blocked:', data.candidates[0].finishReason);
    }

    // Extract content text
    let contentText: string | null = null;
    if (Array.isArray(data.candidates) && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content?.parts && Array.isArray(candidate.content.parts)) {
        contentText = candidate.content.parts
          .map((part: any) => part.text || '')
          .join('')
          .trim();
      }
    }

    if (!contentText) {
      console.error('[generateQuestionsWithAI] No content text. Full response:', JSON.stringify(data, null, 2));
      throw new Error("No content returned from Gemini API. Check API key and quota.");
    }
    
    console.log('[generateQuestionsWithAI] Content text received:', contentText.substring(0, 500));

    // Extract JSON from response
    const jsonStr = extractJsonFromText(contentText);
    if (!jsonStr) {
      throw new Error("No JSON found in model response");
    }

    const parsed = JSON.parse(jsonStr);
    
    if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error("Model returned invalid questions format");
    }

    // Validate and format questions
    return parsed.questions.map((q: any, i: number): QuizQuestion => {
      return {
        id: q.id || `ai-generated-${i}`,
        category: q.category || skills[0] as any,
        level: q.level || level,
        question: q.question || q.text || '',
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        explanation: q.explanation || '',
        tags: Array.isArray(q.tags) ? q.tags : skills
      };
    });
  } catch (err: any) {
    console.error("[generateQuestionsWithAI] error:", err);
    throw new Error(err?.message ?? "Failed to generate questions with AI");
  }
};
