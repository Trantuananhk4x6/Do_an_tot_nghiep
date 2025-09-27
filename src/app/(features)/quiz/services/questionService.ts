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
  questionCount: number = 10
): Promise<QuestionResponse> => {
  console.log("[generateQuestions] called", file, questionCount);

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

  const prompt = `
Tạo ${questionCount} câu hỏi trắc nghiệm CHUYÊN MÔN (technical) từ văn bản sau (được trích xuất từ file PDF mà người dùng gửi).
YÊU CẦU CHUNG:
- Câu hỏi phải hoàn toàn dựa trên nội dung trong văn bản (không suy đoán thêm).
- Các câu hỏi ưu tiên: khái niệm kỹ thuật, định nghĩa, công thức, thuật toán, ý tưởng thiết kế, chi tiết implement, ví dụ mã, phân tích kết quả, câu hỏi tính toán/ứng dụng.
- Mỗi câu có 4 lựa chọn (A,B,C,D) và chỉ 1 đáp án đúng.
- Cho giải thích ngắn (1-2 câu) cho đáp án đúng, trích dẫn (nếu có) vị trí/ trang trong văn bản nếu có thể.
- Tránh câu hỏi quá tầm chung; ưu tiên cụ thể, có thể kiểm chứng trong văn bản.
- Trả về CHÍNH XÁC chỉ JSON theo format sau, KHÔNG kèm bất kỳ text hoặc chú thích nào khác:

{
  "questions": [
    {
      "id": 1,
      "text": "câu hỏi kỹ thuật...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "giải thích ngắn, trích dẫn vị trí nếu có..."
    }
  ]
}
VĂN BẢN:
${truncated}
`;

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
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
      temperature: 0.2,
      maxOutputTokens: 2048,
      topK: 40,
      topP: 0.95,
    },
  };

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    console.log("[generateQuestions] Đang gọi Gemini API:", url);

    const res = await fetchWithRetry(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("[generateQuestions] Gemini response:", data);
    if (!data) throw new Error("Empty response from API");

    let contentText: string | null = null;
    try {
      if (
        Array.isArray(data.candidates) &&
        data.candidates[0]?.content?.parts?.[0]?.text
      ) {
        contentText = data.candidates[0].content.parts[0].text;
      } else if (typeof data.result === "string") {
        contentText = data.result;
      } else if (typeof data === "string") {
        contentText = data;
      } else {
        contentText = JSON.stringify(data);
      }
    } catch (err) {
      console.error("[generateQuestions] Lỗi khi lấy contentText:", err);
      contentText = JSON.stringify(data);
    }

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
