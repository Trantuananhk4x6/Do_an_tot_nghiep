import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "../../../../../../db";
import { InterviewSet, QuestionAnswer, Resume } from "../../../../../../db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

/**
 * Interviewer-specific question generation
 * Different interviewers ask different types of questions
 */

interface InterviewerProfile {
  id: string;
  name: string;
  title: string;
  expertise: string;
  yearsOfExperience: number;
  interviewStyle: string;
  focusAreas: string[];
  questionTypes: string[];
  personality: string;
}

// | **Vị trí**                   | **Loại câu hỏi**                      | **Số lượng** | **Tỷ lệ** |
// | ---------------------------- | ------------------------------------- | ------------ | --------- |
// | **HR Manager**               | Hành vi (STAR)                        | 5            | 50%       |
// |                              | Phù hợp văn hoá                       | 2            | 20%       |
// |                              | Kỹ năng mềm                           | 2            | 20%       |
// |                              | Động lực nghề nghiệp                  | 1            | 10%       |

// | **Technical Lead**           | Chuyên môn chuyên sâu                 | 4            | 40%       |
// |                              | Thiết kế hệ thống                     | 2            | 20%       |
// |                              | Chất lượng code / Best Practices      | 2            | 20%       |
// |                              | Giải quyết vấn đề                     | 1            | 10%       |
// |                              | Hướng dẫn / Lãnh đạo kỹ thuật         | 1            | 10%       |

// | **Engineering Manager**      | Lãnh đạo & Quản lý con người          | 3            | 30%       |
// |                              | Chiến lược & Lập kế hoạch             | 2            | 20%       |
// |                              | Hợp tác liên phòng ban                | 2            | 20%       |
// |                              | Giám sát kỹ thuật                     | 2            | 20%       |
// |                              | Giải quyết xung đột                   | 1            | 10%       |
// | **Product Manager**          | Tư duy sản phẩm                       | 3            | 30%       |
// |                              | Ưu tiên hóa                           | 2            | 20%       |
// |                              | Quản lý stakeholders                  | 2            | 20%       |
// |                              | Quyết định dựa trên dữ liệu           | 2            | 20%       |
// |                              | Hợp tác kỹ thuật                      | 1            | 10%       |

// | **Data Scientist**           | Thống kê                              | 3            | 30%       |
// |                              | Machine Learning                      | 2            | 20%       |
// |                              | SQL / Pipeline dữ liệu                | 2            | 20%       |
// |                              | A/B Testing                           | 2            | 20%       |
// |                              | Trình bày dữ liệu (Data Storytelling) | 1            | 10%       |

// | **DevOps / SRE**             | CI/CD                                 | 3            | 30%       |
// |                              | Hạ tầng đám mây                       | 2            | 20%       |
// |                              | Khắc phục sự cố                       | 2            | 20%       |
// |                              | Bảo mật                               | 2            | 20%       |
// |                              | Hợp tác                               | 1            | 10%       |
// | **UX Designer**              | Nghiên cứu người dùng                 | 3            | 30%       |
// |                              | Quy trình thiết kế                    | 2            | 20%       |
// |                              | Lên mẫu / Prototyping                 | 2            | 20%       |
// |                              | Hợp tác                               | 2            | 20%       |
// |                              | Review portfolio                      | 1            | 10%       |

// | **Default (Kỹ thuật chung)** | Kỹ thuật                              | 4            | 40%       |
// |                              | Giải quyết vấn đề                     | 3            | 30%       |
// |                              | Hành vi                               | 2            | 20%       |
// |                              | Động lực                              | 1            | 10%       |

/**
 * Get interviewer-specific prompt based on their role
 */
function getInterviewerPrompt(interviewer: InterviewerProfile): string {
  const title = interviewer.title?.toLowerCase() || "";
  const focusAreas = interviewer.focusAreas || [];
  const questionTypes = interviewer.questionTypes || [];
  
  // HR Manager / Behavioral Assessment
  if (title.includes("hr") || interviewer.expertise === "behavioral-assessment") {
    return `
You are ${interviewer.name}, an experienced ${interviewer.title} with ${interviewer.yearsOfExperience} years of experience.
Your interview style is: ${interviewer.interviewStyle}
Your personality: ${interviewer.personality}

 YOUR FOCUS AREAS (PRIORITIZE THESE):
${focusAreas.map(area => `- ${area}`).join('\n')}

 QUESTION TYPES YOU PREFER:
${questionTypes.map(type => `- ${type}`).join('\n')}

AS AN HR PROFESSIONAL, YOU MUST:
1. Focus 70% on BEHAVIORAL questions using STAR method
2. Assess soft skills: communication, teamwork, adaptability, conflict resolution
3. Evaluate cultural fit and company values alignment
4. Ask about career motivation and growth mindset
5. Only 20% technical (to understand basic fit), 10% situational

QUESTION DISTRIBUTION:
- 5 Behavioral questions (past experiences, teamwork, conflicts, failures, successes)
- 2 Cultural fit questions (why this company, values alignment)
- 2 Soft skills questions (communication, leadership, adaptability)  
- 1 Career motivation question
`;
  }

  // Technical Lead / Senior Engineer
  if (title.includes("technical lead") || title.includes("tech lead") || 
      (title.includes("senior") && title.includes("engineer"))) {
    return `
You are ${interviewer.name}, a ${interviewer.title} with ${interviewer.yearsOfExperience} years of experience.
Your interview style is: ${interviewer.interviewStyle}
Your personality: ${interviewer.personality}

 YOUR FOCUS AREAS (PRIORITIZE THESE):
${focusAreas.map(area => `- ${area}`).join('\n')}

 QUESTION TYPES YOU PREFER:
${questionTypes.map(type => `- ${type}`).join('\n')}

AS A TECHNICAL LEAD, YOU MUST:
1. Focus 60% on DEEP TECHNICAL questions (system design, architecture, code quality)
2. Ask about code review practices and best practices
3. Test problem-solving with real technical scenarios
4. Assess mentoring and knowledge sharing abilities
5. 25% technical decision-making, 15% collaboration

QUESTION DISTRIBUTION:
- 4 Technical deep-dive questions (architecture, design patterns, scalability)
- 2 System design / architecture questions
- 2 Code quality and best practices questions
- 1 Problem-solving scenario
- 1 Mentoring/knowledge sharing question
`;
  }

  // Engineering Manager
  if (title.includes("manager") && (title.includes("engineering") || title.includes("software"))) {
    return `
You are ${interviewer.name}, an ${interviewer.title} with ${interviewer.yearsOfExperience} years of experience.
Your interview style is: ${interviewer.interviewStyle}
Your personality: ${interviewer.personality}

 YOUR FOCUS AREAS (PRIORITIZE THESE):
${focusAreas.map(area => `- ${area}`).join('\n')}

 QUESTION TYPES YOU PREFER:
${questionTypes.map(type => `- ${type}`).join('\n')}

AS AN ENGINEERING MANAGER, YOU MUST:
1. Focus 40% on LEADERSHIP and people management
2. Assess project planning and execution abilities
3. Test cross-functional collaboration skills
4. Evaluate strategic thinking and prioritization
5. 30% technical (enough to lead), 30% behavioral

QUESTION DISTRIBUTION:
- 3 Leadership and team management questions
- 2 Strategic planning / prioritization questions
- 2 Cross-functional collaboration questions
- 2 Technical oversight questions (code review, architecture decisions)
- 1 Conflict resolution / difficult situation question
`;
  }

  // Product Manager
  if (title.includes("product")) {
    return `
You are ${interviewer.name}, a ${interviewer.title} with ${interviewer.yearsOfExperience} years of experience.
Your interview style is: ${interviewer.interviewStyle}
Your personality: ${interviewer.personality}

 YOUR FOCUS AREAS (PRIORITIZE THESE):
${focusAreas.map(area => `- ${area}`).join('\n')}

 QUESTION TYPES YOU PREFER:
${questionTypes.map(type => `- ${type}`).join('\n')}

AS A PRODUCT MANAGER, YOU MUST:
1. Focus 50% on PRODUCT SENSE and user empathy
2. Assess prioritization and roadmap thinking
3. Test stakeholder management skills
4. Evaluate data-driven decision making
5. 30% collaboration, 20% technical understanding

QUESTION DISTRIBUTION:
- 3 Product sense and user empathy questions
- 2 Prioritization and trade-off questions
- 2 Stakeholder management questions
- 2 Data-driven decision making questions
- 1 Technical collaboration question (working with engineers)
`;
  }

  // Data Scientist
  if (title.includes("data") && (title.includes("scientist") || title.includes("analyst"))) {
    return `
You are ${interviewer.name}, a ${interviewer.title} with ${interviewer.yearsOfExperience} years of experience.
Your interview style is: ${interviewer.interviewStyle}
Your personality: ${interviewer.personality}

 YOUR FOCUS AREAS (PRIORITIZE THESE):
${focusAreas.map(area => `- ${area}`).join('\n')}

 QUESTION TYPES YOU PREFER:
${questionTypes.map(type => `- ${type}`).join('\n')}

AS A DATA SCIENTIST, YOU MUST:
1. Focus 50% on ANALYTICAL and statistical questions
2. Assess machine learning knowledge
3. Test experimental design (A/B testing)
4. Evaluate data storytelling abilities
5. 30% programming, 20% communication

QUESTION DISTRIBUTION:
- 3 Statistical analysis / methodology questions
- 2 Machine learning questions
- 2 Data pipeline and SQL questions
- 2 Experimental design questions
- 1 Data storytelling / communication question
`;
  }

  // DevOps Engineer
  if (title.includes("devops") || title.includes("sre") || title.includes("infrastructure")) {
    return `
You are ${interviewer.name}, a ${interviewer.title} with ${interviewer.yearsOfExperience} years of experience.
Your interview style is: ${interviewer.interviewStyle}
Your personality: ${interviewer.personality}

YOUR FOCUS AREAS (PRIORITIZE THESE):
${focusAreas.map(area => `- ${area}`).join('\n')}

QUESTION TYPES YOU PREFER:
${questionTypes.map(type => `- ${type}`).join('\n')}

AS A DEVOPS/SRE, YOU MUST:
1. Focus 60% on INFRASTRUCTURE and automation
2. Assess CI/CD knowledge
3. Test troubleshooting and incident response
4. Evaluate security awareness
5. 25% system reliability, 15% collaboration

QUESTION DISTRIBUTION:
- 3 CI/CD and automation questions
- 2 Cloud infrastructure questions
- 2 Troubleshooting / incident response scenarios
- 2 Security and monitoring questions
- 1 Collaboration with dev teams question
`;
  }

  // UX Designer
  if (title.includes("ux") || title.includes("design")) {
    return `
You are ${interviewer.name}, a ${interviewer.title} with ${interviewer.yearsOfExperience} years of experience.
Your interview style is: ${interviewer.interviewStyle}
Your personality: ${interviewer.personality}

 YOUR FOCUS AREAS (PRIORITIZE THESE):
${focusAreas.map(area => `- ${area}`).join('\n')}

 QUESTION TYPES YOU PREFER:
${questionTypes.map(type => `- ${type}`).join('\n')}

AS A UX DESIGNER, YOU MUST:
1. Focus 50% on USER RESEARCH and empathy
2. Assess design process and methodology
3. Test prototyping and usability skills
4. Evaluate design collaboration
5. 30% visual design, 20% stakeholder communication

QUESTION DISTRIBUTION:
- 3 User research and empathy questions
- 2 Design process questions
- 2 Prototyping / usability questions
- 2 Design collaboration questions
- 1 Portfolio / past work discussion
`;
  }

  // Default - Technical focus (for generic roles)
  return `
You are ${interviewer.name}, a ${interviewer.title} with ${interviewer.yearsOfExperience} years of experience.
Your interview style is: ${interviewer.interviewStyle}
Your personality: ${interviewer.personality}

 YOUR FOCUS AREAS:
${focusAreas.map(area => `- ${area}`).join('\n')}

 QUESTION TYPES:
${questionTypes.map(type => `- ${type}`).join('\n')}

STANDARD QUESTION DISTRIBUTION:
- 4 Technical skills questions
- 3 Problem-solving questions
- 2 Behavioral questions
- 1 Career/motivation question
`;
}

/**
 * Helper function to save questions to database
 * This ensures AI-generated questions are stored for assessment reference
 */
async function saveQuestionsToDatabase(questions: any[], interviewSetId: number): Promise<any[]> {
  try {
    
    
    // Insert new questions
    const insertedQuestions = await db.insert(QuestionAnswer).values(
      questions.map((q: any) => ({
        question: q.question,
        answer: q.answer,
        interviewSetId: interviewSetId,
      }))
    ).returning();
    
    
    
    // Return questions with database IDs
    return questions.map((q: any, idx: number) => ({
      ...q,
      dbId: insertedQuestions[idx]?.id,
    }));
  } catch (dbError: any) {
    console.error("⚠️ Failed to save questions to database:", dbError.message);
    // Return original questions if save fails
    return questions;
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { interviewSetId, interviewer } = body;

    if (!interviewSetId || !interviewer) {
      return NextResponse.json({ 
        error: "Missing required fields: interviewSetId and interviewer" 
      }, { status: 400 });
    }

    
    

    // Fetch the interview set
    const interviewSet = await db.query.InterviewSet.findFirst({
      where: eq(InterviewSet.id, parseInt(interviewSetId)),
    });

    if (!interviewSet) {
      return NextResponse.json({ error: "Interview set not found" }, { status: 404 });
    }

    // Get language from interview set
    const language = interviewSet.language || "en";
    const languageMap: Record<string, string> = {
      vi: "Vietnamese",
      en: "English",
      ja: "Japanese",
      zh: "Chinese",
      ko: "Korean",
    };
    const outputLanguage = languageMap[language] || "English";

    // Fetch resume
    const resume = await db.query.Resume.findFirst({
      where: eq(Resume.id, interviewSet.resumeId),
    });
    
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Truncate resume if too long
    const truncatedResume = resume.jsonResume?.substring(0, 3000) || resume.jsonResume;

    // Get interviewer-specific prompt
    const interviewerPrompt = getInterviewerPrompt(interviewer as InterviewerProfile);

    // Check API key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY not found");
      return NextResponse.json({ error: "AI service configuration error" }, { status: 500 });
    }

    

    let result;
    let retries = 2;
    
    while (retries > 0) {
      try {
        result = await generateText({
          model: google("gemini-2.5-flash") as any,
          prompt: `${interviewerPrompt}

===================
INTERVIEW CONTEXT
===================

CANDIDATE'S RESUME:
${truncatedResume}

JOB DETAILS:
- Position: ${interviewSet.position}
- Company: ${interviewSet.companyName}
- Job Description: ${interviewSet.jobDescription}

===================
YOUR TASK
===================

IMPORTANT: Generate ALL questions and answers in ${outputLanguage} language.

You are ${interviewer.name} (${interviewer.title}). Generate 10 interview questions that reflect YOUR expertise and interview style.

CRITICAL REQUIREMENTS:
1. Questions MUST match your interviewer profile (HR asks behavioral, Tech Lead asks technical, etc.)
2. Questions MUST be relevant to the candidate's CV and the target position
3. Use your unique perspective and expertise to craft questions
4. Include your personality in how questions are phrased
5. Answers should be detailed and based on CV information where possible

ANSWER FORMAT:
- Provide expected answers that would impress YOU as the interviewer
- Include what you're looking for in an ideal answer
- Reference specific skills/experiences from the CV when applicable

Generate EXACTLY 10 questions in this JSON format (no markdown, no code blocks):
[
  {
    "question": "Your interview question reflecting your expertise and style",
    "answer": "Expected answer that would impress you, including specific CV references where applicable",
    "category": "technical|behavioral|cultural-fit|problem-solving|experience",
    "importance": "critical|high|medium"
  }
]

Remember: You are ${interviewer.name}, ${interviewer.title}. Ask questions like YOU would in a real interview!`,
          maxTokens: 4000,
          temperature: 0.8,
        });
        break;
      }
      //

      catch (aiError: any) {
        retries--;
        console.error(`AI generation attempt failed (${2 - retries}/2):`, aiError.message);
        
        if (retries === 0) {
          // Fallback questions based on interviewer type
          
          const fallbackQuestions = generateFallbackQuestions(interviewer, interviewSet.position, interviewSet.companyName, language);
          
          // Save fallback questions to database too
          const savedFallback = await saveQuestionsToDatabase(fallbackQuestions, parseInt(interviewSetId));
          return NextResponse.json(savedFallback, { status: 200 });
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Parse result
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
      // Use fallback if parse fails
      const fallbackQuestions = generateFallbackQuestions(interviewer, interviewSet.position, interviewSet.companyName, language);
      
      // Save fallback questions to database too
      const savedFallback = await saveQuestionsToDatabase(fallbackQuestions, parseInt(interviewSetId));
      return NextResponse.json(savedFallback, { status: 200 });
    }

    // Validate and format questions
    if (!Array.isArray(parsedResult)) {
      parsedResult = [parsedResult];
    }

    const validQuestions = parsedResult
      .filter((q: any) => q.question && q.answer)
      .map((q: any, idx: number) => ({
        id: idx + 1,
        question: q.question,
        answer: q.answer,
        category: q.category || "general",
        importance: q.importance || "medium",
        interviewerId: interviewer.id,
        interviewerName: interviewer.name,
        interviewerTitle: interviewer.title
      }));

    

    // Save AI-generated questions to database for future reference and assessment
    const savedQuestions = await saveQuestionsToDatabase(validQuestions, parseInt(interviewSetId));
    return NextResponse.json(savedQuestions, { status: 200 });

  } catch (error: any) {
    console.error("Error generating interviewer questions:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to generate questions" 
    }, { status: 500 });
  }
}

/**
 * Generate fallback questions based on interviewer type
 */
function generateFallbackQuestions(
  interviewer: InterviewerProfile, 
  position: string, 
  company: string,
  language: string
): any[] {
  const title = interviewer.title?.toLowerCase() || "";
  
  // HR/Behavioral focused fallbacks
  if (title.includes("hr") || interviewer.expertise === "behavioral-assessment") {
    return language === "vi" ? [
      { id: 1, question: "Hãy kể về một lần bạn phải giải quyết xung đột với đồng nghiệp. Bạn đã xử lý như thế nào?", answer: "Sử dụng phương pháp STAR: Mô tả tình huống cụ thể, vai trò của bạn, hành động bạn thực hiện và kết quả tích cực.", category: "behavioral", importance: "critical" },
      { id: 2, question: "Điều gì thúc đẩy bạn trong công việc hàng ngày?", answer: "Chia sẻ về passion, mục tiêu cá nhân và cách chúng liên kết với công việc.", category: "cultural-fit", importance: "high" },
      { id: 3, question: "Bạn xử lý áp lực và deadline như thế nào?", answer: "Mô tả kỹ năng quản lý thời gian, ưu tiên công việc và giữ bình tĩnh.", category: "behavioral", importance: "high" },
      { id: 4, question: `Tại sao bạn quan tâm đến ${company}?`, answer: `Nghiên cứu về ${company} và liên kết với giá trị cá nhân.`, category: "cultural-fit", importance: "critical" },
      { id: 5, question: "Kể về thành công lớn nhất trong sự nghiệp của bạn.", answer: "Chia sẻ thành tựu cụ thể với số liệu và tác động.", category: "experience", importance: "high" },
    ] : [
      { id: 1, question: "Tell me about a time you had to resolve a conflict with a colleague. How did you handle it?", answer: "Use STAR method: Describe the specific situation, your role, actions taken, and positive outcome.", category: "behavioral", importance: "critical" },
      { id: 2, question: "What motivates you in your daily work?", answer: "Share your passion, personal goals, and how they align with your work.", category: "cultural-fit", importance: "high" },
      { id: 3, question: "How do you handle pressure and tight deadlines?", answer: "Describe time management skills, prioritization, and staying calm.", category: "behavioral", importance: "high" },
      { id: 4, question: `Why are you interested in ${company}?`, answer: `Research about ${company} and connect with personal values.`, category: "cultural-fit", importance: "critical" },
      { id: 5, question: "Tell me about your greatest career achievement.", answer: "Share specific accomplishment with metrics and impact.", category: "experience", importance: "high" },
    ];
  }

  // Technical Lead focused fallbacks
  if (title.includes("technical lead") || title.includes("tech lead") || title.includes("senior")) {
    return language === "vi" ? [
      { id: 1, question: "Giải thích kiến trúc hệ thống phức tạp nhất bạn đã thiết kế.", answer: "Mô tả architecture, components, trade-offs và quyết định kỹ thuật.", category: "technical", importance: "critical" },
      { id: 2, question: "Bạn đảm bảo code quality trong team như thế nào?", answer: "Nói về code review, testing, CI/CD, best practices.", category: "technical", importance: "critical" },
      { id: 3, question: "Kể về bug khó khắc phục nhất và cách bạn debug.", answer: "Mô tả quy trình debug, tools sử dụng, bài học rút ra.", category: "problem-solving", importance: "high" },
      { id: 4, question: "Làm thế nào để scale hệ thống xử lý 1 triệu requests/phút?", answer: "Thảo luận về load balancing, caching, database optimization, horizontal scaling.", category: "technical", importance: "critical" },
      { id: 5, question: "Bạn mentor junior developer như thế nào?", answer: "Chia sẻ về code review, pair programming, knowledge sharing sessions.", category: "behavioral", importance: "medium" },
    ] : [
      { id: 1, question: "Explain the most complex system architecture you've designed.", answer: "Describe architecture, components, trade-offs, and technical decisions.", category: "technical", importance: "critical" },
      { id: 2, question: "How do you ensure code quality in your team?", answer: "Talk about code review, testing, CI/CD, best practices.", category: "technical", importance: "critical" },
      { id: 3, question: "Tell me about the hardest bug to fix and how you debugged it.", answer: "Describe debugging process, tools used, lessons learned.", category: "problem-solving", importance: "high" },
      { id: 4, question: "How would you scale a system to handle 1 million requests per minute?", answer: "Discuss load balancing, caching, database optimization, horizontal scaling.", category: "technical", importance: "critical" },
      { id: 5, question: "How do you mentor junior developers?", answer: "Share about code review, pair programming, knowledge sharing sessions.", category: "behavioral", importance: "medium" },
    ];
  }

  // Product Manager focused fallbacks
  if (title.includes("product")) {
    return language === "vi" ? [
      { id: 1, question: "Làm thế nào để bạn xác định tính năng nào cần ưu tiên phát triển?", answer: "Nói về user research, data analysis, business value, effort estimation.", category: "problem-solving", importance: "critical" },
      { id: 2, question: "Kể về sản phẩm bạn yêu thích và cách cải thiện nó.", answer: "Phân tích UX, pain points, đề xuất improvements với rationale.", category: "technical", importance: "high" },
      { id: 3, question: "Bạn xử lý yêu cầu mâu thuẫn từ stakeholders như thế nào?", answer: "Mô tả kỹ năng negotiation, prioritization framework, communication.", category: "behavioral", importance: "critical" },
    ] : [
      { id: 1, question: "How do you decide which features to prioritize?", answer: "Talk about user research, data analysis, business value, effort estimation.", category: "problem-solving", importance: "critical" },
      { id: 2, question: "Tell me about a product you love and how you would improve it.", answer: "Analyze UX, pain points, propose improvements with rationale.", category: "technical", importance: "high" },
      { id: 3, question: "How do you handle conflicting requirements from stakeholders?", answer: "Describe negotiation skills, prioritization framework, communication.", category: "behavioral", importance: "critical" },
    ];
  }

  // Default generic fallbacks
  return language === "vi" ? [
    { id: 1, question: `Điều gì khiến bạn phù hợp với vị trí ${position} tại ${company}?`, answer: "Kết nối kinh nghiệm với yêu cầu công việc.", category: "experience", importance: "critical" },
    { id: 2, question: "Kể về dự án bạn tự hào nhất.", answer: "Mô tả chi tiết với kết quả đo lường được.", category: "experience", importance: "high" },
    { id: 3, question: "Điểm mạnh và điểm yếu của bạn là gì?", answer: "Trả lời thành thật với ví dụ cụ thể.", category: "behavioral", importance: "high" },
    { id: 4, question: "Bạn nhìn thấy mình ở đâu trong 5 năm tới?", answer: "Chia sẻ mục tiêu career path liên quan đến vị trí.", category: "cultural-fit", importance: "medium" },
    { id: 5, question: "Bạn có câu hỏi gì cho chúng tôi?", answer: "Hỏi về team, culture, growth opportunities.", category: "cultural-fit", importance: "medium" },
  ] : [
    { id: 1, question: `What makes you a good fit for the ${position} role at ${company}?`, answer: "Connect experience with job requirements.", category: "experience", importance: "critical" },
    { id: 2, question: "Tell me about a project you're most proud of.", answer: "Describe in detail with measurable outcomes.", category: "experience", importance: "high" },
    { id: 3, question: "What are your strengths and weaknesses?", answer: "Answer honestly with specific examples.", category: "behavioral", importance: "high" },
    { id: 4, question: "Where do you see yourself in 5 years?", answer: "Share career path goals relevant to the position.", category: "cultural-fit", importance: "medium" },
    { id: 5, question: "Do you have any questions for us?", answer: "Ask about team, culture, growth opportunities.", category: "cultural-fit", importance: "medium" },
  ];
}
