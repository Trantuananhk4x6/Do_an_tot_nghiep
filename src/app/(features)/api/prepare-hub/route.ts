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
          
          // Helper: generate fallback questions based on language
          const getFallbackQuestions = (lang: string, pos: string, comp: string) => {
            const vi = [
              {
                question: `Bạn có thể chia sẻ về kinh nghiệm của mình khiến bạn trở thành ứng viên phù hợp cho vị trí ${pos} tại ${comp}?`,
                answer: `Dựa trên CV của tôi, tôi có [X năm] kinh nghiệm với [công nghệ/kỹ năng từ CV]. Ví dụ, trong dự án [tên dự án thực tế từ CV] tại [công ty từ CV], tôi đã sử dụng [công nghệ cụ thể] để [thành tựu cụ thể]. Kết quả là [kết quả đo lường từ CV].`
              },
              {
                question: `Bạn biết gì về ${comp} và tại sao bạn muốn làm việc ở đây với vai trò ${pos}?`,
                answer: `Tôi đã nghiên cứu về ${comp} và ấn tượng với [sản phẩm/giá trị cụ thể]. Kinh nghiệm tại [công ty/ dự án từ CV] cho thấy tôi có thể đóng góp [giá trị cụ thể].`
              },
              { question: "Kỹ năng kỹ thuật mạnh nhất của bạn là gì và bạn đã áp dụng chúng như thế nào trong các dự án?", answer: "Kỹ năng chính của tôi là [kỹ năng từ CV]. Trong dự án [tên dự án], tôi đã [hành động kỹ thuật], đạt [kết quả cụ thể]." },
              { question: "Kể về vấn đề kỹ thuật khó khăn nhất mà bạn đã giải quyết.", answer: "Vấn đề: [mô tả từ CV]. Hành động: [các bước bạn làm]. Kết quả: [thành tựu/ số liệu từ CV]." },
              { question: `Công cụ/kỹ năng nào trong mô tả ${pos} khiến bạn hào hứng nhất?`, answer: `Tôi hào hứng với [công nghệ từ JD]. Tôi đã dùng nó trong [dự án từ CV] để [kết quả cụ thể].` },
              { question: "Mô tả lần bạn làm việc với thành viên khó tính.", answer: "Tình huống: [từ CV]. Hành động: [gồm giao tiếp, compromise]. Kết quả: [kết quả tích cực]." },
              { question: "Bạn cập nhật công nghệ mới như thế nào?", answer: "Qua [nguồn: blog, khóa học, OSS]. Gần đây tôi [hoạt động cụ thể từ CV]." },
              { question: `Trong 30/60/90 ngày nếu vào ${comp} với vai trò ${pos}, bạn sẽ làm gì?`, answer: `30 ngày: làm quen codebase (ví dụ: [ví dụ từ CV]). 60 ngày: bắt đầu đóng góp. 90 ngày: đề xuất [cải tiến].` },
              { question: "Giải thích khái niệm kỹ thuật phức tạp từ CV bằng lời đơn giản.", answer: "Khái niệm: [khái niệm]. Giải thích: [mô tả đơn giản]. Ví dụ từ dự án: [dự án và kết quả]." },
              { question: `Bạn muốn phát triển như thế nào trong vai trò ${pos}?`, answer: `Mục tiêu: [short-term và long-term], dựa trên kinh nghiệm ở [công ty/dự án từ CV].` }
            ];

            const en = [
              { question: `Can you walk me through your experience that makes you a good fit for the ${pos} role at ${comp}?`, answer: `Based on my CV, I have [X years] of experience with [skill]. For example, in [project from CV] at [company from CV], I used [technology] to [achievement].` },
              { question: `What do you know about ${comp} and why do you want to work here as a ${pos}?`, answer: `I've researched ${comp} and am impressed by [product/value]. My experience at [company from CV] where I [achievement] makes me confident I can add value.` },
              { question: "What are your strongest technical skills and how have you applied them?", answer: "My strongest skill is [skill from CV]. In [project], I implemented [technical actions] and achieved [metrics]." },
              { question: "Tell me about the most challenging technical problem you've solved.", answer: "Challenge: [from CV]. Action: [steps taken]. Result: [measurable outcome]." },
              { question: `Which technical skills or tools from the ${pos} job description excite you most?`, answer: `I'm excited about [tool]. I used it in [project from CV] to [result].` },
              { question: "Describe a time you worked with a difficult teammate or stakeholder.", answer: "Situation: [from CV]. Action: [communication, compromise]. Outcome: [positive result]." },
              { question: "How do you stay updated with new tech and industry trends?", answer: "I follow [blogs, courses, OSS]. Recently I [activity from CV]." },
              { question: `If you joined ${comp} as a ${pos}, what would you focus on in the first 30/60/90 days?`, answer: `30 days: onboard and understand codebase (example: [from CV]). 60 days: contribute to [tasks]. 90 days: propose improvements similar to [past achievement].` },
              { question: "Explain a complex technical concept from your resume in simple terms.", answer: "Concept: [from CV]. Simple explanation: [analogy]. Example from project: [project and outcome]." },
              { question: `Where do you see yourself growing in the ${pos} role and what are your career goals?`, answer: `Short-term: [goal]. Long-term: [aspiration]. My experience at [company/project from CV] prepared me for this path.` }
            ];

            const ko = [
              { question: `${pos} 역할에 적합한 경험을 설명해 주시겠어요? ${comp}에서의 이유도 포함해주세요.`, answer: `제 이력서에 따르면 저는 [X년]의 경험이 있으며, 예를 들어 [프로젝트 이름]에서 [기술]을 사용해 [성과]를 달성했습니다.` },
              { question: `${comp}에 대해 무엇을 알고 있으며 왜 ${pos}로 일하고 싶나요?`, answer: `${comp}의 [제품/가치]에 인상 받았습니다. 이전 [회사/프로젝트]에서의 경험이 여기서 기여할 수 있다고 생각합니다.` },
              { question: "가장 강한 기술 스킬은 무엇이며 실제 프로젝트에서 어떻게 적용했나요?", answer: "저의 핵심 기술은 [기술]. [프로젝트]에서 저는 [구현 내용]을 수행해 [측정 가능한 결과]를 얻었습니다." },
              { question: "가장 도전적이었던 기술 문제에 대해 말해 주세요.", answer: "문제: [이력서 기반 문제]. 조치: [해결 단계]. 결과: [수치/성과]." },
              { question: `${pos} 직무 설명에 나온 도구/기술 중 가장 흥미로운 것은 무엇인가요?`, answer: `저는 [기술]에 관심이 있습니다. [프로젝트]에서 사용하여 [성과]를 얻었습니다.` },
              { question: "어려운 팀원 또는 이해관계자와 일했던 경험을 설명해 주세요.", answer: "상황: [프로젝트]. 행동: [소통/협상]. 결과: [긍정적 결과]." },
              { question: "신기술과 업계 트렌드를 어떻게 따라가나요?", answer: "블로그, 강의, 오픈소스 등을 통해 학습합니다. 최근에는 [구체 활동]을 했습니다." },
              { question: `만약 ${comp}에 ${pos}로 합류하면 첫 30/60/90일 동안 무엇에 집중하겠습니까?`, answer: `30일: 코드베이스 파악 (예: [CV에서의 예]). 60일: 기여 시작. 90일: 개선 제안.` },
              { question: "이력서의 복잡한 기술 개념을 간단히 설명해 주세요.", answer: "개념: [개념]. 쉬운 설명: [비유와 예시]. 프로젝트 예: [프로젝트와 결과]." },
              { question: `이 ${pos} 역할에서 어떻게 성장하고 싶은가요?`, answer: `단기 목표: [구체 목표]. 장기 목표: [장기 포부]. [이전 회사/프로젝트] 경험이 이를 준비시켰습니다.` }
            ];

            const zh = [
              { question: `请介绍使您适合在 ${comp} 担任 ${pos} 的经验。`, answer: `根据我的简历，我有[X年]经验，例如在[项目名]（公司：[公司名]）使用了[技术]并取得了[成果]。` },
              { question: `您对 ${comp} 有什么了解？为什么想在这里担任 ${pos}？`, answer: `我对${comp}的[产品/价值]印象深刻，我在[公司/项目]的经验可以带来[具体贡献]。` },
              { question: "您最强的技术技能是什么？在实际项目中如何应用？", answer: "我的核心技能是[技能]。在[项目]中，我执行了[技术措施]，达成了[具体指标]。" },
              { question: "谈谈您解决过的最具挑战性的技术问题。", answer: "问题： [来自简历的描述]。行动： [解决步骤]。结果： [可衡量的成果]。" },
              { question: `职位描述中提到的哪些工具/技能让您最感兴趣？`, answer: `我对[技术]很感兴趣。在[项目]中使用它并实现了[结果]。` },
              { question: "描述一次您与难相处的团队成员或利益相关者合作的经历。", answer: "情境： [项目背景]。行动： [沟通/妥协措施]。结果： [积极结果]。" },
              { question: "您如何保持对新技术和行业趋势的更新？", answer: "通过阅读博客、参加课程、参与开源等。我最近做了[具体活动]。" },
              { question: `如果您以 ${pos} 的身份加入 ${comp}，您在前30/60/90天会关注什么？`, answer: `30天：熟悉代码库。60天：开始贡献。90天：提出改进建议，参照我在[项目]的经验。` },
              { question: "请用简单语言解释您简历中的一个复杂技术概念。", answer: "概念：[概念]。简单解释：[通俗比喻]。在[项目]中的应用：[实施与结果]。" },
              { question: `在 ${pos} 职位中，您希望如何发展？长期职业目标是什么？`, answer: `短期目标：[目标]。长期目标：[愿景]。我在[公司/项目]的经验已为此奠定基础。` }
            ];

            const ja = [
              { question: `${comp}で${pos}として適任だと考える経験を教えてください。`, answer: `履歴書によると、私は[X年]の経験があり、例えば[プロジェクト名]で[技術]を用いて[成果]を達成しました。` },
              { question: `${comp}について何を知っていますか？なぜ${pos}として働きたいのですか？`, answer: `${comp}の[製品/価値]に感銘を受けました。[会社/プロジェクト]での経験により貢献できると考えています。` },
              { question: "最も得意な技術スキルは何ですか？実プロジェクトでどのように適用しましたか？", answer: "主なスキルは[スキル]です。[プロジェクト]で[実装内容]を行い、[指標]を達成しました。" },
              { question: "これまでで最も挑戦的だった技術課題について教えてください。", answer: "課題：[履歴書の内容]。対応：[解決手順]。結果：[数値的成果]。" },
              { question: `${pos}の職務記述で挙げられているツール/スキルの中で特に興味があるものは？`, answer: `私は[技術]に興味があります。[プロジェクト]で使用し、[成果]を得ました。` },
              { question: "難しいチームメンバーやステークホルダーと協働した経験を教えてください。", answer: "状況：[プロジェクト]。行動：[対話、妥協]。結果：[良い成果]。" },
              { question: "新しい技術や業界トレンドをどのようにキャッチアップしていますか？", answer: "ブログ、コース、OSS貢献などで学習します。最近は[具体的活動]を行いました。" },
              { question: `もし${comp}で${pos}として入社したら、30/60/90日で何に注力しますか？`, answer: `30日：コードベースの理解。60日：貢献開始。90日：改善提案（過去の[プロジェクト]経験を参考に）。` },
              { question: "履歴書の複雑な技術概念をわかりやすく説明してください。", answer: "概念：[概念]。簡単な説明：[比喩と例]。プロジェクト例：[実装と結果]。" },
              { question: `${pos}としてどのように成長したいですか？長期のキャリア目標は？`, answer: `短期目標：[目標]。長期目標：[望むキャリア像]。[会社/プロジェクト]での経験が準備になっています。` }
            ];

            switch (lang) {
              case "vi": return vi;
              case "ko": return ko;
              case "zh": return zh;
              case "ja": return ja;
              default: return en;
            }
          }
          const fallbackQuestions = getFallbackQuestions(language, position, companyName);
          
          
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