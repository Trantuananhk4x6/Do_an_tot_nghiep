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
  console.log("Received messages count:", messages.length);
  console.log("Received audio:", audio ? "yes" : "no");

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
        console.log("Transcribing audio with Deepgram (prerecorded)...");
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
          model: "nova-2",
          language: "en",
          punctuate: true,
          smart_format: true,
        });

        if (error) {
          console.error("Deepgram returned error:", error);
          messages.push({ role: "user", content: "Transcript: [transcription error]" });
        } else {
          const rawTranscript =
            result?.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() || "";
          console.log("Deepgram raw transcript length:", rawTranscript.length);
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
                model: google("gemini-1.5-flash"),
                apiKey: apiKey as any,
                prompt: refinePrompt,
                // no heavy generation needed
                max_tokens: 300,
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
              console.log("Refined transcript length:", refined.length);
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

  // Prepare and call the model. Keep tools (getInformation) available but rely on pre-transcription so model sees user audio.
  try {
    const result = streamText({
      model: google("gemini-1.5-flash"),
      apiKey: GOOGLE_API_KEY || undefined as any,
      messages ,
      system: `You are a helpful interview assistant. 
Use tools on every request when appropriate.  
Be sure to check the knowledge base before answering.  
If unsure, use the getInformation tool. Respond concisely as the interviewee.`,
      tools: {
        getInformation: tool({
          description: `Get information from the user's knowledge base to answer questions.`,
          parameters: z.object({
            question: z.string().describe("The user's question"),
          }),
          execute: async ({ question }) => {
            try {
              const email = user.primaryEmailAddress?.emailAddress;
              if (!email) return "User email not found";
              const res = await findRelevantContent(question, email);
              return JSON.stringify(res);
            } catch (err) {
              console.error("getInformation exec error:", err);
              return "Error retrieving information";
            }
          },
        }),
        transcribeAudio: tool({
          description: `(optional) Transcribe base64 audio using Deepgram.`,
          parameters: z.object({
            audioBase64: z.string().describe("Base64 encoded audio"),
          }),
          execute: async ({ audioBase64 }) => {
            try {
              if (!DEEPGRAM_KEY) return "Deepgram key not configured";
              const base64 = audioBase64.replace(/^data:audio\/[a-zA-Z-+.]+;base64,/, "");
              const buffer = Buffer.from(base64, "base64");
              const { result, error } = await deepgram.listen.prerecorded.transcribeFile(buffer, {
                model: "nova-2",
                language: "en",
                punctuate: true,
                smart_format: true,
              });
              if (error) {
                console.error("Deepgram tool error:", error);
                return "Error transcribing audio";
              }
              const t = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
              try {
                const r = await generateText({
                  model: google("gemini-1.5-flash"),
                  apiKey: GOOGLE_API_KEY || undefined ,
                  prompt: `Refine this transcript (punctuation & question marks only):\n\n${t}`,
                  max_tokens: 300,
                });
                if (!r) return t;
                if (typeof r === "string") return r;
                return (r as any).text || t;
              } catch {
                return t;
              }
            } catch (err) {
              console.error("transcribeAudio tool exception:", err);
              return "Error transcribing audio";
            }
          },
        }),
      },
    });

    console.log("Stream result ready");
    return result.toDataStreamResponse();
  } catch (err) {
    console.error("streamText error:", err);
    return new Response(JSON.stringify({ error: "Model request failed" }), { status: 500 });
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
//       model: google("gemini-1.5-flash"), // Thay đổi từ "gemini-1.5-pro-latest" thành "gemini-1.5-flash"
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