// import { SummaryResponse } from '../models/Summary';

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
// };
import { SummaryResponse } from '../models/Summary';

// @ts-ignore
let pdfjsLib: any;
if (typeof window !== "undefined") {
  // @ts-ignore
  pdfjsLib = require("pdfjs-dist/build/pdf");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
}

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

export const generateSummary = async (
  file: File,
  keypoint: number = 5
): Promise<SummaryResponse> => {
  console.log("[generateSummary] called", file, keypoint);

  let text = "";
  try {
    if (file.type === "application/pdf") {
      text = await extractTextFromPDF(file);
      console.log("[generateSummary] PDF text:", text);
    } else {
      text = await file.text();
      console.log("[generateSummary] File text:", text);
    }
  } catch (err) {
    console.error("[generateSummary] Lỗi khi đọc file:", err);
    throw new Error("Không đọc được file");
  }

  if (!text || text.trim().length === 0) {
    console.error("[generateSummary] File is empty or unreadable");
    throw new Error("File is empty or unreadable");
  }

  const maxChars = 12000;
  const truncated =
    text.length > maxChars
      ? text.slice(0, maxChars) + "\n\n...(truncated)..."
      : text;

const prompt = `
Phân tích văn bản CV sau và sinh ra tối đa ${keypoint} KEY POINTS (ý chính) về:
- Các kỹ năng nổi bật nhất của ứng viên (ví dụ: ngôn ngữ lập trình, framework, công nghệ, soft skills).
- Các công nghệ đã sử dụng trong các dự án thực tế.
- Những thành tích, vai trò, hoặc điểm mạnh cần chú ý nhất của ứng viên.
- Trình bày ngắn gọn, rõ ràng, mỗi ý là một câu hoặc một đoạn ngắn, có thể đánh số thứ tự.
Chỉ trả về JSON đúng format sau, không kèm bất kỳ text nào khác:
{
  "summary": [
    "Kỹ năng: ...",
    "Công nghệ sử dụng: ...",
    "Thành tích nổi bật: ...",
    "Vai trò/điểm mạnh: ..."
  ]
}
VĂN BẢN:
${truncated}
`;

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[generateSummary] Gemini API key is not configured");
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
      maxOutputTokens: 1024,
      topK: 40,
      topP: 0.95,
    },
  };

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    console.log("[generateSummary] Đang gọi Gemini API:", url);

    const res = await fetchWithRetry(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("[generateSummary] Gemini response:", data);
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
      console.error("[generateSummary] Lỗi khi lấy contentText:", err);
      contentText = JSON.stringify(data);
    }

    // Extract JSON from model output
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
      const idx = text.indexOf('"summary"');
      if (idx !== -1) {
        const start = text.lastIndexOf("{", idx);
        const end = text.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
          return text.substring(start, end + 1);
        }
      }
      return null;
    };

    const jsonStr = extractJsonFromText(contentText || "");
    if (!jsonStr) {
      console.error(
        "[generateSummary] Unable to extract JSON from model output:",
        contentText
      );
      throw new Error("No JSON found in model response");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error(
        "[generateSummary] JSON parse error:",
        parseErr,
        "content:",
        jsonStr
      );
      throw new Error("Invalid JSON returned from model");
    }

    if (
      !parsed ||
      !Array.isArray(parsed.summary) ||
      parsed.summary.length === 0
    ) {
      console.error(
        "[generateSummary] Parsed JSON does not contain summary:",
        parsed
      );
      throw new Error("Model returned invalid summary format");
    }

    parsed.summary = parsed.summary.map((s: any) => String(s).trim());

    return parsed as SummaryResponse;
  } catch (err: any) {
    console.error("[generateSummary] error:", err);
    throw new Error(err?.message ?? "Failed to generate summary");
  }
};