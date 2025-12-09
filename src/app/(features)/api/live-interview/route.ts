// ...existing code...
import { generateText, streamText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { findRelevantContent } from "@/lib/embedding";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@deepgram/sdk";

export const maxDuration = 30;

const DEEPGRAM_KEY = process.env.NEXT_DEEPGRAM_API_KEY;
if (!DEEPGRAM_KEY) {
  console.warn("NEXT_DEEPGRAM_API_KEY not set — Deepgram transcription will fail if used.");
}
const deepgram = createClient(DEEPGRAM_KEY || "");

const GOOGLE_API_KEY = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_GENERATIVE_API_KEY || "";

const BodySchema = z.object({
  messages: z
    .array(z.object({ role: z.string(), content: z.string() }))
    .optional()
    .default([]),
  audio: z.string().optional(),
});

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // parse + validate input
  let body: z.infer<typeof BodySchema>;
  try {
    const json = await req.json();
    body = BodySchema.parse(json);
  } catch (err) {
    console.error("Invalid request body:", err);
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  let { messages, audio } = body;
  console.log("[Live Interview] Received messages count:", messages.length);
  console.log("[Live Interview] Last message:", messages[messages.length - 1]);
  console.log("[Live Interview] Received audio:", audio ? "yes" : "no");

  // If audio provided, transcribe server-side and append transcript to messages so model always sees it.
  if (audio) {
    try {
      // Accept data URLs or plain base64
      const base64 = audio.replace(/^data:audio\/[a-zA-Z-+.]+;base64,/, "");
      // Limit size (simple safety)
      const maxBytes = 10 * 1024 * 1024; // 10 MB
      const audioBuffer = Buffer.from(base64, "base64");
      if (audioBuffer.length > maxBytes) {
        console.warn("Audio too large:", audioBuffer.length);
        messages.push({ role: "user", content: "Transcript: [audio too large to transcribe]" });
      } else if (!DEEPGRAM_KEY) {
        messages.push({ role: "user", content: "Transcript: [transcription unavailable: server not configured]" });
      } else {
        console.log("[Live Interview] Transcribing audio with Deepgram (prerecorded)...");
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
          model: "nova-2",
          language: "en-US",
          punctuate: true,
          smart_format: true,
          diarize: false,
          utterances: false,
          numerals: true,
        });

        if (error) {
          console.error("Deepgram returned error:", error);
          messages.push({ role: "user", content: "Transcript: [transcription error]" });
        } else {
          const rawTranscript =
            result?.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() || "";
          console.log("[Live Interview] Deepgram raw transcript:", rawTranscript);
          console.log("[Live Interview] Deepgram confidence:", result?.results?.channels?.[0]?.alternatives?.[0]?.confidence);
  const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_GENERATIVE_API_KEY || undefined;  
          // If we got something, ask Gemini to refine punctuation and add question marks
          if (rawTranscript) {
            try {
              const refinePrompt = [
                `You are a lightweight transcription-refiner.`,
                `Input: ${rawTranscript}`,
                `Output: Return the input with correct punctuation, capitalization, and add question marks for questions where appropriate.`,
                `Do not add or remove semantic content, only fix punctuation/casing/question marks.`,
              ].join("\n\n");

              // safe call to generateText + safe handling of return type
                            const refineResult = await generateText({
                              model: google("gemini-2.5-flash-lite", { apiKey: apiKey as any } as any),
                              prompt: refinePrompt,
                              // no heavy generation needed
                              maxTokens: 300,
                            });

              // handle different shapes: string or object with .text
              let refined = "";
              if (!refineResult) {
                refined = rawTranscript;
              } else if (typeof refineResult === "string") {
                refined = refineResult;
              } else {
                // @ts-ignore - SDK can return different shapes, guard safely
                refined = (refineResult as any).text || rawTranscript;
              }

              refined = (refined || rawTranscript).trim();
              console.log("[Live Interview] Refined transcript:", refined);
              messages.push({ role: "user", content: `Transcript: ${refined}` });
            } catch (refineErr) {
              console.error("Refine error:", refineErr);
              // fallback to raw transcript
              messages.push({ role: "user", content: `Transcript: ${rawTranscript}` });
            }
          } else {
            messages.push({ role: "user", content: "Transcript: [no speech detected]" });
          }
        }
      }
    } catch (transErr) {
      console.error("Pre-transcription exception:", transErr);
      messages.push({ role: "user", content: "Transcript: [transcription failed]" });
    }
  }

  // Prepare and call the model - optimized for speed
  try {
    console.log("[Live Interview] Calling AI model with", messages.length, "messages");
    console.log("[Live Interview] Last message:", messages[messages.length - 1]?.content);
    
    const result = streamText({
      model: google("gemini-2.5-flash-lite"),
      messages: messages as any,
      system: `You are a helpful AI interview assistant. Answer interview questions quickly and professionally.

KEY INSTRUCTIONS:
- Respond naturally and conversationally as a job candidate
- Keep answers concise but informative (2-4 sentences for most questions)
- Use the getInformation tool ONLY when you need specific details from the user's background
- If the question is general knowledge or about common topics, answer directly without using tools
- Be professional, friendly, and show enthusiasm

EXAMPLES:
- "Tell me about Flask" → Answer directly about Flask framework
- "What's your experience with Python?" → Use getInformation tool to check user's background
- "How do you handle pressure?" → Answer with general best practices`,
      tools: {
        getInformation: tool({
          description: `Get specific information from the user's resume/background. Use this ONLY for questions about personal experience, skills, or background.`,
          parameters: z.object({
            question: z.string().describe("The specific question about user's background"),
          }),
          execute: async ({ question }) => {
            try {
              console.log("[Live Interview] Getting user info for:", question);
              const email = user.primaryEmailAddress?.emailAddress;
              if (!email) return "User email not found";
              const res = await findRelevantContent(question, email);
              console.log("[Live Interview] Retrieved info:", JSON.stringify(res).substring(0, 200));
              return JSON.stringify(res);
            } catch (err) {
              console.error("getInformation exec error:", err);
              return "No specific information available";
            }
          },
        }),
      },
      maxSteps: 2, // Limit tool calls to speed up response
    });

    console.log("[Live Interview] Stream result ready, returning response");
    return result.toDataStreamResponse();

  } catch (err) {
    console.error("[Live Interview] streamText error:", err);
    console.error("[Live Interview] Error details:", JSON.stringify(err, null, 2));
    return new Response(JSON.stringify({ error: "Model request failed", details: err instanceof Error ? err.message : "Unknown error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// import { streamText, tool } from "ai";
// import { google } from "@ai-sdk/google";
// import { z } from "zod";
// import { findRelevantContent } from "@/lib/embedding";
// import { currentUser } from "@clerk/nextjs/server";

// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const user = await currentUser();
  
//   if (!user) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   const { messages } = await req.json();
  
//   try {
//     const result = streamText({
//       model: google("gemini-2.5-flash-lite"), // Thay đổi từ "gemini-2.5-pro-latest" thành "gemini-2.5-flash-lite"
//       messages,
//       system: `You are a helpful interview assistant. 
//         Use tools on every request.
//         Be sure to getInformation from your knowledge base before answering any questions.
//         If you are unsure, use the getInformation tool and you can use common sense to reason based on the information you do have.
//         Respond as Interviewee`,
//       tools: {
//         getInformation: tool({
//           description: `get information from your knowledge base to answer questions.`,
//           parameters: z.object({
//             question: z.string().describe("the users question"),
//           }),
//           execute: async ({ question }) => {
//             try {
//               const email = user.primaryEmailAddress?.emailAddress;
//               if (!email) {
//                 return "User email not found";
//               }
//               const result = await findRelevantContent(question, email);
//               return JSON.stringify(result);
//             } catch (error) {
//               console.error("Tool execution error:", error);
//               return "Error retrieving information";
//             }
//           },
//         }),
//       },
//     });
    
//     return result.toDataStreamResponse();
//   } catch (error) {
//     console.error("API Error:", error);
//     return new Response(
//       JSON.stringify({ error: "Error when connect with server" }), 
//       { 
//         status: 500,
//         headers: { 'Content-Type': 'application/json' }
//       }
//     );
//   }
// }