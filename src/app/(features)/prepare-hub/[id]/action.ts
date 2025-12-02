"use server";
import { eq } from "drizzle-orm";
import { db } from "../../../../../db";
import {
  InterviewSet,
  InterviewSetEmbeddings,
  QuestionAnswer,
  Resume,
} from "../../../../../db/schema";
import { generateEmbeddings } from "@/lib/embedding";
import { currentUser } from "@clerk/nextjs/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const createEmbeddingsForInterviewSet = async (
  interviewSetId: number
) => {
  try {
    const user = await currentUser();
    //Step 1: Check if interviewSetId exists in InterviewBeddings
    const interviewSetEmbeddings = await db
      .select({
        interviewSetId: InterviewSetEmbeddings.interviewSetId,
      })
      .from(InterviewSetEmbeddings)
      .where(eq(InterviewSetEmbeddings.interviewSetId, interviewSetId));

    if (interviewSetEmbeddings.length > 0) {
      //Step 2: Delete existing embeddings if they are exist
      await db
        .delete(InterviewSetEmbeddings)
        .where(eq(InterviewSetEmbeddings.interviewSetId, interviewSetId));
    }

    //Step 3: Select all question and answers based on interviewSetId
    const questionAnswers = await db
      .select({
        question: QuestionAnswer.question,
        answer: QuestionAnswer.answer,
      })
      .from(QuestionAnswer)
      .where(eq(QuestionAnswer.interviewSetId, interviewSetId));

    //Step 4: Concatenate the content of questions and answers
    const concatenatedContent = questionAnswers
      .map((qa) => `${qa.question} ${qa.answer}`)
      .join(" ");

    //Step 5: Generate embeddings
    const embeddings = await generateEmbeddings(concatenatedContent);

    //Step 6: Store embeddings in database
    await db.insert(InterviewSetEmbeddings).values(
      embeddings.map((embedding) => ({
        interviewSetId: interviewSetId,
        userEmail: user.primaryEmailAddress?.emailAddress,
        ...embedding,
      }))
    );
    return "Resource successfully created.";
  } catch (err) {
    console.log(err);
    return "Error, please try again.";
  }
};

export const regenerateAnswer = async (
  qaId: number,
  question: string,
  answer: string,
  interviewSetId: number
) => {
  try {
    // Fetch the interview set
    const interviewSet = await db.query.InterviewSet.findFirst({
      where: eq(InterviewSet.id, interviewSetId),
    });

    if (!interviewSet) {
      return new Response("Interview set not found", { status: 404 });
    }

    const resume = await db.query.Resume.findFirst({
      where: eq(Resume.id, interviewSet.resumeId),
    });
    if (!resume) {
      return new Response("Resume not found", { status: 404 });
    }
    const jobDescription = interviewSet.jobDescription;

    // Generate new answer
    const result = await generateText({
      model: google("gemini-2.5-flash") as any,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an AI Assistant who is an expert about Interview.
              Start Context: You are interviewing for a software engineering role at a top tech company based on my CV ${resume.jsonResume}, job description ${jobDescription} and ${answer} . End Context.
              Question: Generate an answer for the following question: ${question}`.replace(
                /\*/g,
                ""
              ),
            },
          ],
        },
      ],
    });
    //Update the question answer with the new answer
    await db
      .update(QuestionAnswer)
      .set({
        answer: result.text,
      })
      .where(eq(QuestionAnswer.id, qaId));

    return result.text;
  } catch (err) {
    console.log(err);
    return "Error, please try again.";
  }
};

export const generateQuestionAnswer = async (interviewSetId: number) => {
  try {
    // Fetch the interview set
    const interviewSet = await db.query.InterviewSet.findFirst({
      where: eq(InterviewSet.id, interviewSetId),
    });

    if (!interviewSet) {
      throw new Error("Interview set not found");
    }

    // Fetch resume
    const resume = await db.query.Resume.findFirst({
      where: eq(Resume.id, interviewSet.resumeId),
    });
    
    if (!resume) {
      throw new Error("Resume not found");
    }

    // Fetch existing questions to avoid duplicates
    const existingQAs = await db
      .select({
        question: QuestionAnswer.question,
      })
      .from(QuestionAnswer)
      .where(eq(QuestionAnswer.interviewSetId, interviewSetId));

    const existingQuestions = existingQAs.map(qa => qa.question).join("\n");
    
    // Truncate resume if too long
    const truncatedResume = resume.jsonResume?.substring(0, 3000) || resume.jsonResume;

    // Generate new question and answer using AI
    const result = await generateText({
      model: google("gemini-1.5-flash-8b") as any,
      prompt: `You are an expert technical interviewer. Generate 1 NEW interview question with a detailed answer.

CANDIDATE INFORMATION:
- Resume/CV: ${truncatedResume}
- Target Position: ${interviewSet.position}
- Target Company: ${interviewSet.companyName}
- Job Description: ${interviewSet.jobDescription}

EXISTING QUESTIONS (DO NOT DUPLICATE):
${existingQuestions}

REQUIREMENTS:
1. Generate 1 NEW question that is different from existing questions
2. Question MUST be relevant to candidate's actual experience from CV
3. Question MUST be tailored to "${interviewSet.position}" role at "${interviewSet.companyName}"
4. Include either technical depth, behavioral insight, or company fit
5. Provide a detailed answer that references the CV

Generate EXACTLY 1 question and answer in this JSON format (no markdown, no code blocks):
{
  "question": "A specific question based on CV, position, and company",
  "answer": "Detailed answer with specific examples from resume and STAR method if behavioral"
}`,
      maxTokens: 1000,
    });

    // Parse the result
    let cleanedText = result.text.trim();
    if (cleanedText.includes("```json")) {
      cleanedText = cleanedText.replace(/```json\s*/g, "").replace(/```\s*/g, "");
    }
    if (cleanedText.includes("```")) {
      cleanedText = cleanedText.replace(/```/g, "");
    }

    const parsedResult = JSON.parse(cleanedText);

    // Validate result
    if (!parsedResult.question || !parsedResult.answer) {
      throw new Error("Invalid AI response format");
    }

    // Insert the new question-answer into database
    const newQA = await db
      .insert(QuestionAnswer)
      .values({
        question: parsedResult.question,
        answer: parsedResult.answer,
        interviewSetId: interviewSetId,
      })
      .returning();

    return newQA[0];
  } catch (err) {
    console.error("Error generating question-answer:", err);
    throw new Error("Failed to generate question. Please try again.");
  }
};
