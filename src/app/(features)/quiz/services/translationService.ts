import { QuizQuestion } from "@/data/quiz-questions";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retries = 3,
  baseDelayMs = 1000
): Promise<Response> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) return response;
      
      if ((response.status === 503 || response.status === 429) && attempt < retries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await sleep(delay);
        continue;
      }
      
      const errorText = await response.text().catch(() => '');
      throw new Error(`API Error ${response.status}: ${errorText}`);
      
    } catch (error: any) {
      lastError = error;
      
      if (attempt < retries && (error.name === 'TypeError' || error.message.includes('fetch'))) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await sleep(delay);
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
};

/**
 * Translate quiz questions to target language using Gemini API
 */
export async function translateQuestions(
  questions: QuizQuestion[],
  targetLanguage: string
): Promise<QuizQuestion[]> {
  
  // If target is English, return as-is (database is already in English)
  if (targetLanguage === 'en') {
    return questions;
  }

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn('Gemini API key not found, returning original questions');
    return questions;
  }

  const languageNames: Record<string, string> = {
    'vi': 'Vietnamese (Tiếng Việt)',
    'en': 'English',
    'ja': 'Japanese (日本語)',
    'zh': 'Chinese (中文)',
    'ko': 'Korean (한국어)'
  };

  const targetLangName = languageNames[targetLanguage] || targetLanguage;

  try {
    console.log(`[Translation Service] Translating ${questions.length} questions to ${targetLangName}...`);

    // Batch translate for efficiency (translate multiple questions at once)
    const batchSize = 5;
    const translatedQuestions: QuizQuestion[] = [];

    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      
      const prompt = `Translate these quiz questions to ${targetLangName}. Keep the same structure and accuracy.

CRITICAL RULES:
1. Translate question, all options, and explanation
2. Keep correctAnswer index UNCHANGED (it's a number 0-3)
3. Maintain technical accuracy
4. Use natural ${targetLangName} language
5. Keep programming terms in English when appropriate (e.g., "useState", "async/await")

Questions to translate:
${JSON.stringify(batch.map(q => ({
  question: q.question,
  options: q.options,
  explanation: q.explanation
})), null, 2)}

Return ONLY valid JSON array (no markdown, no code blocks):
[
  {
    "question": "translated question",
    "options": ["option A translated", "option B translated", "option C translated", "option D translated"],
    "explanation": "translated explanation"
  }
]`;

      const response = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1, // Low temperature for consistent translation
              maxOutputTokens: 4096,
            },
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
            ]
          }),
        }
      );

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponse) {
        console.warn('[Translation Service] No response from AI, using original questions');
        translatedQuestions.push(...batch);
        continue;
      }

      // Parse JSON response
      let jsonStr = aiResponse.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\s*/i, '').replace(/```\s*$/, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\s*/i, '').replace(/```\s*$/, '');
      }

      const translations = JSON.parse(jsonStr);

      // Merge translations with original questions
      batch.forEach((originalQ, index) => {
        const translated = translations[index];
        if (translated) {
          translatedQuestions.push({
            ...originalQ,
            question: translated.question,
            options: translated.options,
            explanation: translated.explanation
          });
        } else {
          translatedQuestions.push(originalQ);
        }
      });

      console.log(`[Translation Service] Translated batch ${i / batchSize + 1}/${Math.ceil(questions.length / batchSize)}`);
    }

    console.log(`[Translation Service] ✓ Successfully translated ${translatedQuestions.length} questions to ${targetLangName}`);
    return translatedQuestions;

  } catch (error) {
    console.error('[Translation Service] Translation failed:', error);
    console.warn('[Translation Service] Returning original English questions');
    return questions;
  }
}
