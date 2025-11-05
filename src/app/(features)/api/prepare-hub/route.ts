// import { generateText } from "ai";
// import { google } from "@ai-sdk/google";
// import { db } from "../../../../../db";
// import { InterviewSet, QuestionAnswer, Resume } from "../../../../../db/schema";
// import { currentUser } from "@clerk/nextjs/server";
// import { eq } from "drizzle-orm";

// export async function GET() {
//   const user = await currentUser();
//   const interviewSets = await db
//     .select()
//     .from(InterviewSet)
//     .where(eq(InterviewSet.userEmail, user.primaryEmailAddress?.emailAddress));
//   if (!interviewSets) {
//     return new Response("No interview sets found");
//   }
//   return new Response(JSON.stringify(interviewSets));
// }

// export async function POST(req: Request) {
//   try {
//     const user = await currentUser();
//     const formData = await req.formData();
//     const resumeId = formData.get("resumeId") as string;
//     const companyName = formData.get("companyName") as string;
//     const jobDescription = formData.get("jobDescription") as string;
//     const position = formData.get("position") as string;

//     const resumeReponse = await db
//       .select({ jsonResume: Resume.jsonResume, name: Resume.name })
//       .from(Resume)
//       .where(eq(Resume.id, parseInt(resumeId)));
//     const resumeContent = resumeReponse[0].jsonResume;

//     const result = await generateText({
//       model: google("gemini-2.5-pro-latest") as any,
//       messages: [
//         {
//           role: "user",
//           content: [
//             {
//               type: "text",
//               text: `You are an AI Assistant who is an expert about Interview.
//           Start Context: You are interviewing for a software engineering role at a top tech company base on my CV ${resumeContent}, ${position} and ${jobDescription} End Context.
//           Question: Generate 5 Interview questions and anwsers based on the context in Json Format.`,
//             },
//           ],
//         },
//       ],
//     });
//     let parsedResult;
//     try {
//       parsedResult = JSON.parse(
//         result.text.replace("```json", "").replace("```", "")
//       );
//     } catch (e) {
//       console.log("AI result parse error:", result.text, e);
//       return new Response("AI result is not valid JSON", { status: 400 });
//     }

//     const interviewSet = await db
//       .insert(InterviewSet)
//       .values({
//         userEmail: user.primaryEmailAddress?.emailAddress,
//         jobDescription: jobDescription,
//         position: position,
//         companyName: companyName,
//         resumeName: resumeReponse[0].name,
//         resumeId: parseInt(resumeId),
//       })
//       .returning();

//     for (const qa of parsedResult) {
//       await db
//         .insert(QuestionAnswer)
//         .values({
//           question: qa.question,
//           answer: qa.answer,
//           interviewSetId: interviewSet[0].id,
//         })
//         .returning();
//     }
//     return new Response(
//       JSON.stringify({
//         message: "Questions and answers inserted successfully",
//       }),
//       { status: 201 }
//     );
//   } catch (error) {
//     console.log(error);

//     return new Response("Error processing PDF", { status: 500 });
//   }
// }

// export async function DELETE(req: Request) {
//   const url = new URL(req.url);
//   const interviewSetId = url.searchParams.get("Id");
//   try {
//     const result = await db
//       .delete(InterviewSet)
//       .where(eq(InterviewSet.id, parseInt(interviewSetId as string)));

//     if (result.rowCount < 1) {
//       return new Response("Not Interview Set", { status: 404 });
//     }

//     return new Response(JSON.stringify("Successfully deleted interview set"));
//   } catch (error) {
//     console.log(error);
//     return new Response("Error processing request", { status: 500 });
//   }
// }
////////////////////
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "../../../../../db";
import { InterviewSet, QuestionAnswer, Resume } from "../../../../../db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return new Response("User not authenticated", { status: 401 });
    }
    
    const interviewSets = await db
      .select()
      .from(InterviewSet)
      .where(eq(InterviewSet.userEmail, user.primaryEmailAddress.emailAddress));
      
    if (!interviewSets || interviewSets.length === 0) {
      return new Response("No interview sets found", { status: 404 });
    }
    
    return new Response(JSON.stringify(interviewSets), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("GET error:", error);
    return new Response("Error fetching interview sets", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      console.log("User not authenticated");
      return new Response("User not authenticated", { status: 401 });
    }
    
    console.log("User email:", user.primaryEmailAddress.emailAddress);
    
    const formData = await req.formData();
    const resumeId = formData.get("resumeId") as string;
    const companyName = formData.get("companyName") as string;
    const jobDescription = formData.get("jobDescription") as string;
    const position = formData.get("position") as string;

    console.log("Form data:", { resumeId, companyName, jobDescription, position });

    if (!resumeId || !companyName || !jobDescription || !position) {
      return new Response("Missing required fields", { status: 400 });
    }

    const resumeReponse = await db
      .select({ jsonResume: Resume.jsonResume, name: Resume.name })
      .from(Resume)
      .where(eq(Resume.id, parseInt(resumeId)));

    if (!resumeReponse || resumeReponse.length === 0) {
      return new Response("Resume not found", { status: 404 });
    }

    const resumeContent = resumeReponse[0].jsonResume;
    console.log("Resume content found, length:", resumeContent?.length);

    // Giới hạn độ dài resume để tránh quá tải API
    const truncatedResume = resumeContent?.substring(0, 3000) || resumeContent;

    // Kiểm tra API key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    console.log("API key exists:", !!apiKey);
    
    if (!apiKey) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY not found in environment variables");
      return new Response("AI service configuration error. Please contact administrator.", { status: 500 });
    }

    console.log("Starting AI generation...");

    let result;
    let retries = 2; // Giảm số lần retry
    
    // Retry logic for overloaded model
    while (retries > 0) {
      try {
        result = await generateText({
          model: google("gemini-1.5-flash-8b") as any, // Sử dụng model nhẹ hơn
          prompt: `You are an expert technical interviewer. Generate 10 interview questions with detailed answers based on the candidate's resume, target position, and company.

CANDIDATE INFORMATION:
- Resume/CV: ${truncatedResume}
- Target Position: ${position}
- Target Company: ${companyName}
- Job Description: ${jobDescription}

REQUIREMENTS:
1. Questions MUST be relevant to the candidate's actual experience from their CV
2. Questions MUST be tailored to the "${position}" role at "${companyName}"
3. Include technical skills mentioned in the resume
4. Include behavioral questions about past projects/experience
5. Include company-specific questions about "${companyName}"
6. Mix of: Technical (40%), Behavioral (30%), Company/Culture fit (20%), Situational (10%)

Generate EXACTLY 10 interview questions with detailed answers in this JSON format (no markdown, no code blocks):
[
  {"question": "Technical question based on CV skills", "answer": "Detailed answer referencing resume experience"},
  {"question": "Behavioral question about past project", "answer": "Answer with STAR method"},
  {"question": "Company-specific question about ${companyName}", "answer": "Answer showing research about company"},
  {"question": "Technical depth question for ${position}", "answer": "Detailed technical answer"},
  {"question": "Problem-solving scenario for ${position}", "answer": "Step-by-step solution approach"},
  {"question": "Experience question from CV", "answer": "Answer highlighting relevant experience"},
  {"question": "Technical tool/framework from resume", "answer": "In-depth explanation"},
  {"question": "Team collaboration question", "answer": "Answer with specific example"},
  {"question": "Why ${companyName} and ${position}?", "answer": "Personalized answer"},
  {"question": "Future goals in ${position} role", "answer": "Career development answer"}
]`,
          maxTokens: 4000, // Tăng token limit cho 10 câu hỏi
        });
        break; // Success, exit retry loop
      } catch (aiError: any) {
        retries--;
        console.error(`AI generation attempt failed (${2 - retries}/2):`, aiError.message);
        console.error("Error details:", aiError);
        
        if (retries === 0) {
          // Last attempt failed - Fallback to hardcoded questions
          console.log("Using fallback questions due to AI service unavailability");
          result = {
            text: JSON.stringify([
              {
                question: `Can you walk me through your experience that makes you a good fit for the ${position} role at ${companyName}?`,
                answer: `Based on the resume, highlight specific projects and skills that align with the ${position} position at ${companyName}. Focus on measurable achievements and relevant technologies.`
              },
              {
                question: `What do you know about ${companyName} and why do you want to work here specifically as a ${position}?`,
                answer: `Research ${companyName}'s products, culture, and values. Connect how your career goals align with the company's mission and how you can contribute as a ${position}.`
              },
              {
                question: "What are your strongest technical skills and how have you applied them in real projects?",
                answer: "Discuss specific technologies from your resume with concrete examples of how you used them to solve problems or deliver value."
              },
              {
                question: "Tell me about the most challenging technical problem you've solved.",
                answer: "Use STAR method: Situation, Task, Action, Result. Focus on problem-solving approach and technical decisions made."
              },
              {
                question: `What technical skills or tools mentioned in the ${position} job description are you most excited to work with?`,
                answer: "Show enthusiasm for specific technologies in the job description and explain how your current skills will help you excel with them."
              },
              {
                question: "Describe a time when you had to work with a difficult team member or stakeholder.",
                answer: "Focus on communication skills, empathy, and conflict resolution. Emphasize positive outcome."
              },
              {
                question: "How do you stay updated with new technologies and industry trends?",
                answer: "Mention specific resources: blogs, courses, conferences, open-source contributions, side projects."
              },
              {
                question: `If you joined ${companyName} as a ${position}, what would you focus on in your first 30/60/90 days?`,
                answer: "Show initiative: 30 days - learn codebase/team; 60 days - contribute to projects; 90 days - propose improvements."
              },
              {
                question: "Can you explain a complex technical concept from your resume in simple terms?",
                answer: "Choose a key technology or project from CV and explain it clearly, showing communication skills."
              },
              {
                question: `Where do you see yourself growing in the ${position} role, and what are your long-term career goals?`,
                answer: "Align career aspirations with potential growth paths at ${companyName}. Show ambition balanced with commitment."
              }
            ])
          };
          break;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    console.log("AI result received:", result.text.substring(0, 200));

    let parsedResult;
    try {
      // Xử lý response từ AI
      let cleanedText = result.text;
      if (cleanedText.includes("```json")) {
        cleanedText = cleanedText.replace(/```json\s*/g, "").replace(/```\s*/g, "");
      }
      if (cleanedText.includes("```")) {
        cleanedText = cleanedText.replace(/```/g, "");
      }
      
      parsedResult = JSON.parse(cleanedText);
      console.log("Parsed result:", parsedResult);
    } catch (e) {
      console.log("AI result parse error:", e);
      console.log("Raw AI result:", result.text);
      return new Response(`AI result parsing failed: ${e.message}`, { status: 400 });
    }

    // Validate parsed result
    if (!Array.isArray(parsedResult)) {
      console.log("Result is not an array:", parsedResult);
      return new Response("AI result is not in expected format", { status: 400 });
    }

    // Validate we have at least 10 questions
    if (parsedResult.length < 10) {
      console.log(`Warning: Only received ${parsedResult.length} questions, expected 10`);
      // Không fail, vẫn chấp nhận nếu có ít nhất 5 câu
      if (parsedResult.length < 5) {
        return new Response("Not enough questions generated. Please try again.", { status: 400 });
      }
    }

    // Validate each question has required fields
    const validQuestions = parsedResult.filter(qa => qa.question && qa.answer);
    if (validQuestions.length < 5) {
      console.log("Not enough valid questions with both question and answer fields");
      return new Response("Invalid question format. Please try again.", { status: 400 });
    }

    console.log(`Creating interview set with ${validQuestions.length} questions...`);

    const interviewSet = await db
      .insert(InterviewSet)
      .values({
        userEmail: user.primaryEmailAddress?.emailAddress,
        jobDescription: jobDescription,
        position: position,
        companyName: companyName,
        resumeName: resumeReponse[0].name,
        resumeId: parseInt(resumeId),
      })
      .returning();

    console.log("Interview set created:", interviewSet[0]);

    // Insert only valid questions
    let insertedCount = 0;
    for (const qa of validQuestions) {
      await db
        .insert(QuestionAnswer)
        .values({
          question: qa.question,
          answer: qa.answer,
          interviewSetId: interviewSet[0].id,
        })
        .returning();
      insertedCount++;
    }
    
    console.log(`Successfully inserted ${insertedCount} questions`);
    
    return new Response(
      JSON.stringify({
        message: "Questions and answers inserted successfully",
        interviewSetId: interviewSet[0].id,
        questionsCount: insertedCount,
        details: {
          company: companyName,
          position: position,
          resumeName: resumeReponse[0].name
        }
      }),
      { 
        status: 201,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Detailed error:", error);
    console.error("Error stack:", error.stack);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const interviewSetId = url.searchParams.get("Id");
    
    if (!interviewSetId) {
      return new Response("Missing interview set ID", { status: 400 });
    }
    
    const result = await db
      .delete(InterviewSet)
      .where(eq(InterviewSet.id, parseInt(interviewSetId)));

    if (result.rowCount < 1) {
      return new Response("Interview set not found", { status: 404 });
    }

    return new Response(JSON.stringify("Successfully deleted interview set"), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.log(error);
    return new Response("Error processing request", { status: 500 });
  }
}