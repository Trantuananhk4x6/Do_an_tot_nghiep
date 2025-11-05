import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "../../../../../../db";
import { InterviewSet, QuestionAnswer, Resume } from "../../../../../../db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      console.log("User not authenticated");
      return new Response("User not authenticated", { status: 401 });
    }

    const body = await req.json();
    const { interviewSetId } = body;

    if (!interviewSetId) {
      return new Response("Missing interviewSetId", { status: 400 });
    }

    console.log("Generating question for interview set:", interviewSetId);

    // Fetch the interview set
    const interviewSet = await db.query.InterviewSet.findFirst({
      where: eq(InterviewSet.id, parseInt(interviewSetId)),
    });

    if (!interviewSet) {
      return new Response("Interview set not found", { status: 404 });
    }

    // Fetch resume
    const resume = await db.query.Resume.findFirst({
      where: eq(Resume.id, interviewSet.resumeId),
    });
    
    if (!resume) {
      return new Response("Resume not found", { status: 404 });
    }

    // Fetch existing questions to avoid duplicates
    const existingQAs = await db
      .select({
        question: QuestionAnswer.question,
      })
      .from(QuestionAnswer)
      .where(eq(QuestionAnswer.interviewSetId, parseInt(interviewSetId)));

    const existingQuestions = existingQAs.map(qa => qa.question).join("\n- ");
    
    // Truncate resume if too long
    const truncatedResume = resume.jsonResume?.substring(0, 3000) || resume.jsonResume;

    // Check API key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY not found");
      return new Response("AI service configuration error", { status: 500 });
    }

    console.log("Starting AI generation for new question...");
    console.log("Existing questions count:", existingQAs.length);
    console.log("Existing questions:", existingQuestions);

    // Random question type để tạo diversity
    const questionTypes = [
      "Technical Deep-Dive: Ask about a specific technology, framework, or tool from the CV",
      "Behavioral STAR: Ask about a past experience, challenge, or teamwork situation",
      "Problem-Solving: Present a technical scenario and ask how they would solve it",
      "System Design: Ask about architecture or design decisions from their projects",
      "Company Culture Fit: Ask why they're interested in this specific company and role",
      "Project Experience: Ask detailed questions about a specific project from CV",
      "Code Quality: Ask about testing, code review, or best practices they follow",
      "Leadership/Mentoring: Ask about team collaboration or mentoring experience"
    ];
    
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    console.log("Selected question type:", randomType);

    let result;
    let retries = 2;
    
    // Retry logic for overloaded model
    while (retries > 0) {
      try {
        result = await generateText({
          model: google("gemini-1.5-flash-8b") as any,
          prompt: `You are an expert technical interviewer conducting an interview for ${interviewSet.position} at ${interviewSet.companyName}.

CANDIDATE'S RESUME (analyze this carefully):
${truncatedResume}

JOB DETAILS:
- Position: ${interviewSet.position}
- Company: ${interviewSet.companyName}
- Job Description: ${interviewSet.jobDescription}

EXISTING QUESTIONS (YOU MUST AVOID THESE - DO NOT CREATE SIMILAR QUESTIONS):
${existingQuestions || "None yet - this is the first question"}

TASK: Generate 1 NEW question following this type: "${randomType}"

CRITICAL REQUIREMENTS:
1. ❌ MUST NOT be similar to existing questions above
2. ✅ MUST be based on SPECIFIC details from the resume (technologies, projects, companies)
3. ✅ MUST be relevant to "${interviewSet.position}" at "${interviewSet.companyName}"
4. ✅ MUST follow the question type: "${randomType}"
5. ✅ Make it conversational and natural, not generic

EXAMPLES OF GOOD QUESTIONS:
- "I see you worked with [specific tech from CV]. Can you explain how you used it in [specific project]?"
- "You mentioned [specific achievement]. What was the biggest technical challenge you faced?"
- "In your role at [company from CV], how did you handle [specific situation]?"

Generate EXACTLY 1 unique question and detailed answer in JSON format (no markdown, no code blocks):
{
  "question": "Specific question referencing CV details, ${interviewSet.position}, ${interviewSet.companyName}",
  "answer": "Detailed answer with CV examples, STAR method if behavioral, technical depth if technical"
}

Important: Add timestamp ${Date.now()} to ensure uniqueness.`,
          maxTokens: 1200,
          temperature: 0.9, // Increase creativity
        });
        break; // Success, exit retry loop
      } catch (aiError: any) {
        retries--;
        console.error(`AI generation attempt failed (${2 - retries}/2):`, aiError.message);
        
        if (retries === 0) {
          // Fallback questions - random selection for diversity
          const fallbackQuestions = [
            {
              question: `What specific experience from your resume makes you confident you can excel in the ${interviewSet.position} role at ${interviewSet.companyName}?`,
              answer: `Highlight 2-3 key projects or experiences from your CV that directly align with the ${interviewSet.position} responsibilities. Use concrete examples with technologies used, problems solved, and measurable results achieved.`
            },
            {
              question: `Can you walk me through the most technically challenging project you've worked on and how it relates to ${interviewSet.companyName}'s work?`,
              answer: `Use STAR method: Situation - project context and goals, Task - your specific role and challenges, Action - technical decisions and implementation steps, Result - outcomes, metrics, and lessons learned. Connect this to ${interviewSet.companyName}'s tech stack or products.`
            },
            {
              question: `What interests you most about the ${interviewSet.position} position at ${interviewSet.companyName}, and how does your background prepare you for it?`,
              answer: `Research ${interviewSet.companyName}'s products, culture, and tech stack. Connect specific skills and experiences from your resume to the role requirements. Show genuine enthusiasm and explain how this aligns with your career goals.`
            },
            {
              question: `Describe a situation where you had to learn a new technology quickly. How did you approach it, and how would this help you at ${interviewSet.companyName}?`,
              answer: `Share a specific example from your experience. Explain your learning process (documentation, tutorials, hands-on practice, mentorship). Discuss the outcome and how you applied this skill. Relate it to the fast-paced nature of ${interviewSet.position} role.`
            },
            {
              question: `Tell me about a time when you had to make a difficult technical decision. What was your thought process?`,
              answer: `Describe the context and options you considered. Explain trade-offs (performance vs maintainability, cost vs scalability, etc.). Share the decision you made, why you made it, and the results. Show analytical thinking and decision-making skills.`
            }
          ];
          
          const randomFallback = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
          console.log("Using fallback question due to AI failure");
          
          return new Response(
            JSON.stringify(randomFallback),
            { 
              status: 200,
              headers: { "Content-Type": "application/json" }
            }
          );
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log("AI result received:", result.text.substring(0, 200));

    // Parse the result
    let cleanedText = result.text.trim();
    if (cleanedText.includes("```json")) {
      cleanedText = cleanedText.replace(/```json\s*/g, "").replace(/```\s*/g, "");
    }
    if (cleanedText.includes("```")) {
      cleanedText = cleanedText.replace(/```/g, "");
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Parse error:", e);
      console.log("Raw AI result:", result.text);
      
      // Try to extract question and answer from text if JSON parse fails
      const questionMatch = result.text.match(/"question":\s*"([^"]+)"/);
      const answerMatch = result.text.match(/"answer":\s*"([^"]+)"/);
      
      if (questionMatch && answerMatch) {
        parsedResult = {
          question: questionMatch[1],
          answer: answerMatch[1]
        };
        console.log("Extracted from regex:", parsedResult);
      } else {
        // Final fallback with random variation
        const parseErrorFallbacks = [
          {
            question: `How have your past experiences prepared you for the technical challenges of a ${interviewSet.position} at ${interviewSet.companyName}?`,
            answer: `Discuss specific technical projects from your resume that demonstrate problem-solving skills, relevant technologies, and ability to deliver results. Connect these experiences to the requirements of the ${interviewSet.position} role.`
          },
          {
            question: `What's the most innovative solution you've implemented, and how could similar thinking benefit ${interviewSet.companyName}?`,
            answer: `Share a specific example of creative problem-solving from your experience. Explain the problem, your innovative approach, implementation, and results. Show how this mindset would add value to ${interviewSet.companyName}.`
          }
        ];
        
        const randomFallback = parseErrorFallbacks[Math.floor(Math.random() * parseErrorFallbacks.length)];
        console.log("Using parse error fallback");
        
        return new Response(
          JSON.stringify(randomFallback),
          { 
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }

    // Validate result
    if (!parsedResult.question || !parsedResult.answer) {
      console.error("Invalid AI response format:", parsedResult);
      
      // Random fallback for invalid format
      const invalidFormatFallbacks = [
        {
          question: `What makes you interested in ${interviewSet.companyName}, and how does your background align with the ${interviewSet.position} role?`,
          answer: `Research ${interviewSet.companyName}'s mission, products, and culture. Connect your skills and experiences from your resume to their needs. Show you understand both the role and the company, and explain why you're a good fit.`
        },
        {
          question: `Describe your approach to staying current with technology trends relevant to the ${interviewSet.position} field.`,
          answer: `Discuss your learning habits: technical blogs, courses, conferences, open-source contributions, side projects. Give specific examples from your resume where you applied new knowledge. Show continuous learning mindset important for ${interviewSet.companyName}.`
        }
      ];
      
      const randomFallback = invalidFormatFallbacks[Math.floor(Math.random() * invalidFormatFallbacks.length)];
      console.log("Using invalid format fallback");
      
      return new Response(
        JSON.stringify(randomFallback),
        { 
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    console.log("Successfully generated new question");

    // Return the generated question and answer (NOT saved to DB yet)
    return new Response(
      JSON.stringify({
        question: parsedResult.question,
        answer: parsedResult.answer
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Detailed error:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
