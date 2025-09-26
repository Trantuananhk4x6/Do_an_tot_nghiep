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
//       model: google("gemini-1.5-pro-latest") as any,
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

    // Kiểm tra API key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    console.log("API key exists:", !!apiKey);
    console.log("API key first 10 chars:", apiKey?.substring(0, 10));

    console.log("Starting AI generation...");

    const result = await generateText({
      model: google("gemini-1.5-flash") as any,
      prompt: `You are an AI Assistant who is an expert about Interview.
        Start Context: You are interviewing for a software engineering role at a top tech company base on my CV ${resumeContent}, ${position} and ${jobDescription} End Context.
        Question: Generate 5 Interview questions and answers based on the context in JSON Format.
        
        Expected format:
        [
          {"question": "Question 1", "answer": "Answer 1"},
          {"question": "Question 2", "answer": "Answer 2"},
          {"question": "Question 3", "answer": "Answer 3"},
          {"question": "Question 4", "answer": "Answer 4"},
          {"question": "Question 5", "answer": "Answer 5"}
        ]`
    });

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

    console.log("Creating interview set...");

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

    for (const qa of parsedResult) {
      if (qa.question && qa.answer) {
        await db
          .insert(QuestionAnswer)
          .values({
            question: qa.question,
            answer: qa.answer,
            interviewSetId: interviewSet[0].id,
          })
          .returning();
      }
    }
    
    console.log("All questions inserted successfully");
    
    return new Response(
      JSON.stringify({
        message: "Questions and answers inserted successfully",
        interviewSetId: interviewSet[0].id
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