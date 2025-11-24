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
    const language = (formData.get("language") as string) || "en"; // Default to English

    console.log("Form data:", { resumeId, companyName, jobDescription, position, language });

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

    // Language mapping for AI prompt
    const languageMap: Record<string, string> = {
      vi: "Vietnamese",
      en: "English",
      ja: "Japanese",
      zh: "Chinese",
      ko: "Korean",
    };
    const outputLanguage = languageMap[language] || "English";

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
          model: google("gemini-2.0-flash") as any, // Sử dụng model nhẹ hơn
          prompt: `You are an expert technical interviewer. Generate 10 interview questions with detailed answers based on the candidate's resume, target position, and company.

IMPORTANT: Generate ALL questions and answers in ${outputLanguage} language.

CANDIDATE INFORMATION:
- Resume/CV: ${truncatedResume}
- Target Position: ${position}
- Target Company: ${companyName}
- Job Description: ${jobDescription}

REQUIREMENTS FOR QUESTIONS:
1. Questions MUST be relevant to the candidate's actual experience from their CV
2. Questions MUST be tailored to the "${position}" role at "${companyName}"
3. Include technical skills mentioned in the resume
4. Include behavioral questions about past projects/experience
5. Include company-specific questions about "${companyName}"
6. Mix of: Technical (40%), Behavioral (30%), Company/Culture fit (20%), Situational (10%)
7. ALL content (questions AND answers) MUST be written in ${outputLanguage}

CRITICAL REQUIREMENTS FOR ANSWERS:
1. Answers MUST be based on ACTUAL information from the candidate's CV
2. Use this format: "General guidance + specific example with details in parentheses (...)"
3. Extract REAL project names, technologies, achievements from the CV
4. Fill in blanks (...) with ACTUAL data from resume
5. Make answers practical and ready-to-use by including CV details

ANSWER FORMAT EXAMPLES:
- Bad: "Explain your experience with the technology"
- Good: "I have [X years] of experience with [technology]. For example, in my [project name from CV] project at [company from CV], I used [technology] to [specific achievement from CV]. This resulted in [measurable outcome from CV]."

- Bad: "Describe a challenging project"
- Good: "One of my most challenging projects was [actual project name from CV] where I [specific challenge from CV]. I approached this by [solution approach], using [technologies from CV]. The result was [actual achievement/metric from CV]."

Generate EXACTLY 10 interview questions with detailed, CV-based answers in this JSON format (no markdown, no code blocks):
[
  {"question": "Technical question based on CV skills", "answer": "Provide guidance, then concrete example: 'Based on my CV, I have experience with [actual skill]. For instance, at [actual company/project], I [actual achievement with metrics]...'"},
  {"question": "Behavioral question about past project", "answer": "Use STAR method with REAL details: 'Situation: At [actual company], [real situation]. Task: I needed to [actual task]. Action: I [real actions taken]. Result: [actual measurable outcomes from CV]'"},
  {"question": "Company-specific question about ${companyName}", "answer": "Connect CV experience to company: 'My experience in [actual role/project from CV] aligns with ${companyName} because [specific connection]. For example, when I [actual achievement], it demonstrates [relevant skill for company]'"},
  {"question": "Technical depth question for ${position}", "answer": "Deep technical answer with CV proof: 'I'm proficient in [actual technology from CV]. In my [actual project], I implemented [specific technical solution] which [actual result]. The technical approach involved [details from CV]...'"},
  {"question": "Problem-solving scenario for ${position}", "answer": "Real problem-solving example: 'In my [actual project/role from CV], I faced [real challenge]. I solved it by [actual approach with technologies from CV]. The outcome was [real metrics/achievements]'"},
  {"question": "Experience question from CV", "answer": "Direct CV reference: 'During my time at [actual company], I worked on [actual projects]. Specifically, I [concrete responsibilities and achievements with numbers/metrics from CV]'"},
  {"question": "Technical tool/framework from resume", "answer": "In-depth with real usage: 'I've used [actual tool from CV] extensively in [actual project]. For example, I [specific implementation details]. This helped achieve [actual results with metrics]'"},
  {"question": "Team collaboration question", "answer": "Real team example: 'At [actual company/project], I collaborated with [team structure from CV]. For instance, when [real situation], I [actual collaborative actions]. This resulted in [real team outcome]'"},
  {"question": "Why ${companyName} and ${position}?", "answer": "Connect CV to opportunity: 'My background in [actual experiences from CV] makes me ideal for this role. At [actual company], I [actual relevant achievements]. I'm excited about ${companyName} because [research-based reason] and I can contribute [specific skills from CV]'"},
  {"question": "Future goals in ${position} role", "answer": "Goals based on CV trajectory: 'Building on my experience with [actual skills/projects from CV], I aim to [realistic growth goal]. My work at [actual company] on [actual project] has prepared me to [future contribution at company]'"}
]

Remember: Every answer must include ACTUAL data from the resume in parentheses or specific details, not generic advice!`,
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
          
          // Generate fallback questions based on language
          const fallbackQuestions = language === "vi" ? [
            {
              question: `Bạn có thể chia sẻ về kinh nghiệm của mình khiến bạn trở thành ứng viên phù hợp cho vị trí ${position} tại ${companyName}?`,
              answer: `Dựa trên CV của tôi, tôi có [X năm] kinh nghiệm với [công nghệ/kỹ năng từ CV]. Ví dụ, trong dự án [tên dự án thực tế từ CV] tại [công ty từ CV], tôi đã sử dụng [công nghệ cụ thể] để [thành tựu cụ thể]. Điều này dẫn đến [kết quả đo lường được từ CV như: tăng hiệu suất 30%, giảm thời gian xử lý 50%]. Kinh nghiệm này phù hợp với yêu cầu của vị trí ${position} vì [lý do cụ thể].`
            },
            {
              question: `Bạn biết gì về ${companyName} và tại sao bạn muốn làm việc ở đây với vai trò ${position}?`,
              answer: `Tôi đã nghiên cứu về ${companyName} và ấn tượng với [sản phẩm/giá trị cụ thể của công ty]. Kinh nghiệm của tôi tại [công ty thực tế từ CV] nơi tôi [thành tựu cụ thể], khiến tôi tin rằng tôi có thể đóng góp [giá trị cụ thể] cho ${companyName}. Đặc biệt, khi tôi làm việc với [công nghệ/dự án từ CV], tôi đã [kết quả đạt được], điều này phù hợp với [mục tiêu/sản phẩm của công ty].`
            },
            {
              question: "Kỹ năng kỹ thuật mạnh nhất của bạn là gì và bạn đã áp dụng chúng như thế nào trong các dự án thực tế?",
              answer: "Kỹ năng kỹ thuật mạnh nhất của tôi là [kỹ năng cụ thể từ CV]. Trong dự án [tên dự án thực tế], tôi đã áp dụng [công nghệ/framework cụ thể] để [giải quyết vấn đề gì]. Cụ thể, tôi đã [hành động kỹ thuật chi tiết: thiết kế kiến trúc, tối ưu hóa database, xây dựng API], kết quả là [số liệu cụ thể: xử lý được X requests/giây, giảm load time từ Y xuống Z giây]."
            },
            {
              question: "Kể về vấn đề kỹ thuật khó khăn nhất mà bạn đã giải quyết.",
              answer: "Vấn đề khó khăn nhất tôi từng gặp là [mô tả vấn đề cụ thể từ dự án thực tế trong CV]. Tình huống: Tại [công ty/dự án từ CV], [bối cảnh cụ thể]. Nhiệm vụ: Tôi cần [mục tiêu cụ thể]. Hành động: Tôi đã [các bước giải quyết chi tiết: phân tích, thiết kế giải pháp, implement với công nghệ X, Y, Z]. Kết quả: [thành tựu đo lường được: giảm lỗi 90%, tăng performance 3x, tiết kiệm X giờ/tuần]."
            },
            {
              question: `Kỹ năng kỹ thuật hoặc công cụ nào được đề cập trong mô tả công việc ${position} khiến bạn hào hứng nhất?`,
              answer: `Tôi đặc biệt hào hứng với [công nghệ từ job description]. Tôi đã có kinh nghiệm với công nghệ này trong [dự án cụ thể từ CV] nơi tôi [cách sử dụng cụ thể]. Ví dụ, khi phát triển [tính năng/module cụ thể], tôi đã [implementation details] và đạt được [kết quả cụ thể]. Tôi tin rằng kinh nghiệm này kết hợp với [kỹ năng liên quan từ CV] sẽ giúp tôi đóng góp hiệu quả ngay từ đầu.`
            },
            {
              question: "Mô tả một lần bạn phải làm việc với một thành viên nhóm hoặc bên liên quan khó tính.",
              answer: "Trong dự án [tên dự án thực tế từ CV] tại [công ty], tôi đã làm việc với [vai trò người đó] có [mô tả tình huống khó khăn cụ thể]. Tôi đã giải quyết bằng cách [hành động cụ thể: tổ chức meeting 1-1, lắng nghe quan điểm, tìm điểm chung, đề xuất giải pháp compromise]. Kết quả là [outcome tích cực: hoàn thành đúng deadline, cải thiện team collaboration, dự án thành công với kết quả X]."
            },
            {
              question: "Bạn cập nhật công nghệ mới và xu hướng ngành như thế nào?",
              answer: "Tôi thường xuyên học hỏi qua [nguồn cụ thể: theo dõi blog X, Y, tham gia khóa học Z trên platform A]. Gần đây, tôi đã [hoạt động học tập cụ thể: hoàn thành khóa học X, đóng góp cho open-source project Y, xây dựng side project Z]. Ví dụ, trong dự án cá nhân [tên project], tôi đã thử nghiệm [công nghệ mới] và [kết quả/insights thu được]. Tôi cũng [hoạt động khác: tham gia meetup, đọc documentation, practice trên LeetCode]."
            },
            {
              question: `Nếu bạn gia nhập ${companyName} với vai trò ${position}, bạn sẽ tập trung vào điều gì trong 30/60/90 ngày đầu tiên?`,
              answer: `30 ngày đầu: Tôi sẽ tập trung làm quen với codebase, hiểu architecture và quy trình làm việc của team. Dựa trên kinh nghiệm tại [công ty trước từ CV], tôi biết tầm quan trọng của việc [onboarding practice cụ thể]. 60 ngày: Bắt đầu đóng góp vào [loại tasks cụ thể], tương tự như khi tôi [kinh nghiệm liên quan từ CV]. 90 ngày: Đề xuất [cải tiến cụ thể dựa trên expertise], như cách tôi đã [thành tựu tương tự từ CV trước đó].`
            },
            {
              question: "Bạn có thể giải thích một khái niệm kỹ thuật phức tạp từ CV của mình bằng ngôn ngữ đơn giản?",
              answer: "Một khái niệm kỹ thuật tôi thường làm việc là [khái niệm từ CV: microservices, machine learning pipeline, distributed system, etc.]. Nói đơn giản, đây là [giải thích dễ hiểu với ví dụ thực tế]. Trong dự án [tên dự án từ CV], tôi đã implement [mô tả implementation đơn giản], giống như [so sánh với điều thường ngày]. Điều này giúp [benefit cụ thể với số liệu]."
            },
            {
              question: `Bạn thấy mình phát triển như thế nào trong vai trò ${position}, và mục tiêu nghề nghiệp dài hạn của bạn là gì?`,
              answer: `Dựa trên trajectory của tôi từ [vai trò/level trước] đến [vai trò/level hiện tại trong CV], tôi muốn phát triển theo hướng [mục tiêu cụ thể: technical leadership, solution architecture, etc.]. Trong 1-2 năm tới, tôi muốn [short-term goal cụ thể]. Dài hạn, tôi hướng tới [long-term aspiration]. Kinh nghiệm tại [công ty/dự án từ CV] đã chuẩn bị cho tôi [kỹ năng/mindset cụ thể] cần thiết cho con đường này.`
            }
          ] : [
            {
              question: `Can you walk me through your experience that makes you a good fit for the ${position} role at ${companyName}?`,
              answer: `Based on my CV, I have [X years] of experience with [specific technology/skill from CV]. For example, in my [actual project name from CV] at [actual company from CV], I used [specific technology] to [specific achievement]. This resulted in [measurable outcome from CV, e.g., 30% performance improvement, 50% reduction in processing time]. This experience aligns well with the ${position} requirements because [specific reason].`
            },
            {
              question: `What do you know about ${companyName} and why do you want to work here specifically as a ${position}?`,
              answer: `I've researched ${companyName} and am impressed by [specific product/value of the company]. My experience at [actual company from CV] where I [specific achievement], makes me believe I can contribute [specific value] to ${companyName}. Specifically, when I worked with [technology/project from CV], I achieved [results obtained], which aligns with [company's goals/products].`
            },
            {
              question: "What are your strongest technical skills and how have you applied them in real projects?",
              answer: "My strongest technical skill is [specific skill from CV]. In the [actual project name] project, I applied [specific technology/framework] to [solve what problem]. Specifically, I [detailed technical action: designed architecture, optimized database, built API], resulting in [specific metrics: handled X requests/second, reduced load time from Y to Z seconds]."
            },
            {
              question: "Tell me about the most challenging technical problem you've solved.",
              answer: "The most challenging problem I faced was [describe specific problem from actual project in CV]. Situation: At [company/project from CV], [specific context]. Task: I needed to [specific objective]. Action: I [detailed solution steps: analyzed, designed solution, implemented with technologies X, Y, Z]. Result: [measurable achievement: reduced errors by 90%, increased performance 3x, saved X hours/week]."
            },
            {
              question: `What technical skills or tools mentioned in the ${position} job description are you most excited to work with?`,
              answer: `I'm particularly excited about [technology from job description]. I have experience with this technology in [specific project from CV] where I [specific usage]. For example, when developing [specific feature/module], I [implementation details] and achieved [specific results]. I believe this experience combined with [related skills from CV] will help me contribute effectively from day one.`
            },
            {
              question: "Describe a time when you had to work with a difficult team member or stakeholder.",
              answer: "In the [actual project name from CV] at [company], I worked with [person's role] who had [describe specific difficult situation]. I resolved this by [specific actions: organized 1-1 meetings, listened to their perspective, found common ground, proposed compromise solution]. The result was [positive outcome: completed on deadline, improved team collaboration, project succeeded with result X]."
            },
            {
              question: "How do you stay updated with new technologies and industry trends?",
              answer: "I regularly learn through [specific sources: follow blogs X, Y, take courses Z on platform A]. Recently, I [specific learning activity: completed course X, contributed to open-source project Y, built side project Z]. For example, in my personal project [project name], I experimented with [new technology] and [results/insights gained]. I also [other activities: attend meetups, read documentation, practice on LeetCode]."
            },
            {
              question: `If you joined ${companyName} as a ${position}, what would you focus on in your first 30/60/90 days?`,
              answer: `First 30 days: I'll focus on familiarizing myself with the codebase, understanding the architecture and team workflow. Based on my experience at [previous company from CV], I know the importance of [specific onboarding practice]. 60 days: Start contributing to [specific types of tasks], similar to when I [related experience from CV]. 90 days: Propose [specific improvements based on expertise], like how I [similar achievement from previous CV].`
            },
            {
              question: "Can you explain a complex technical concept from your resume in simple terms?",
              answer: "A technical concept I frequently work with is [concept from CV: microservices, machine learning pipeline, distributed system, etc.]. Simply put, this is [easy-to-understand explanation with real-world example]. In the [project name from CV], I implemented [simple implementation description], which is like [everyday comparison]. This helped [specific benefit with metrics]."
            },
            {
              question: `Where do you see yourself growing in the ${position} role, and what are your long-term career goals?`,
              answer: `Based on my trajectory from [previous role/level] to [current role/level in CV], I want to grow towards [specific goal: technical leadership, solution architecture, etc.]. In the next 1-2 years, I want to [specific short-term goal]. Long term, I aspire to [long-term aspiration]. My experience at [company/project from CV] has prepared me with [specific skills/mindset] needed for this path.`
            }
          ];
          
          result = {
            text: JSON.stringify(fallbackQuestions)
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
        language: language || "en", // Save the selected language
      } as any)
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