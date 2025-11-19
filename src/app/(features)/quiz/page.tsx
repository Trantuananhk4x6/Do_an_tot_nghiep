"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Upload,
  Sparkles,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  Play
} from "lucide-react";
import FileUpload from "./components/fileUpload";
import { 
  getRandomQuestions, 
  validateAnswer,
  type QuizQuestion,
  type QuizLevel
} from "@/data/quiz-questions";
import { generateQuestionsWithAI } from "./services/questionService";
import { 
  extractTextFromFile, 
  analyzeSkills, 
  generatePersonalizedQuestions,
  type SkillAnalysis 
} from "./services/resumeAnalysisService";
import NeuralNetworkBg from "@/components/ui/neural-network-bg";
import { 
  generateComprehensiveFeedback,
  type QuizFeedback,
  type QuizResult as FeedbackQuizResult
} from "./services/feedbackService";
import Ripple from "@/components/ui/ripple";
import { LanguageSelector, Language } from "@/components/ui/language-selector";
import { getCategoryJobTitle } from "@/lib/categoryToJobTitle";
import { translateQuestions } from "./services/translationService";

interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  timeSpent: number;
}

interface QuizResult {
  questionId: string;
  question: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
  options: string[];
  category?: string;
  difficulty?: 'low' | 'mid' | 'high';
}

type QuizMode = 'select' | 'quiz' | 'result';

const EnhancedQuizPage = () => {
  // State Management
  const [mode, setMode] = useState<QuizMode>('select');
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel>('mid');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [skillAnalysis, setSkillAnalysis] = useState<SkillAnalysis | null>(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [comprehensiveFeedback, setComprehensiveFeedback] = useState<QuizFeedback | null>(null);
  const [language, setLanguage] = useState<Language>("vi");

  // Translations
  const translations = {
    vi: {
      title: "Hệ thống Quiz nâng cao",
      subtitle: "Kiểm tra kiến thức của bạn với hơn 1000+ câu hỏi • Phân bổ độ khó thông minh • Hỗ trợ AI",
      uploadResume: "Tải lên CV của bạn (Bắt buộc)",
      uploadResumeDesc: "Tải lên CV để nhận câu hỏi được cá nhân hóa dựa trên kỹ năng và kinh nghiệm của bạn",
      analyzing: "Đang phân tích...",
      dragDrop: "Kéo & thả CV của bạn",
      formatSupport: "Định dạng PDF, DOCX, hoặc TXT",
      cvAnalysis: "Kết quả phân tích CV",
      primaryFocus: "Lĩnh vực chính",
      secondarySkills: "Kỹ năng phụ",
      experienceLevel: "Cấp độ kinh nghiệm",
      detectedSkills: "Kỹ năng được phát hiện",
      analysisConfidence: "Độ tin cậy phân tích",
      highConfidence: "Độ tin cậy cao - Câu hỏi sẽ được cá nhân hóa cao",
      mediumConfidence: "Độ tin cậy trung bình - Câu hỏi sẽ được cá nhân hóa vừa phải",
      lowConfidence: "Độ tin cậy thấp - Câu hỏi tổng quát sẽ được sử dụng",
      selectDifficulty: "Chọn mức độ khó ưa thích",
      difficultyDetected: "Dựa trên phân tích CV, chúng tôi phát hiện cấp độ {level}. Bạn có thể điều chỉnh nếu cần.",
      uploadFirst: "Vui lòng tải lên CV trước để phát hiện độ khó tự động.",
      low: "Dễ",
      mid: "Trung bình",
      high: "Khó",
      lowDesc: "Các khái niệm cơ bản & nền tảng",
      midDesc: "Các chủ đề trung cấp & mô hình",
      highDesc: "Cấp độ nâng cao & chuyên gia",
      quizInfo: "Thông tin Quiz",
      personalizedReady: "Quiz cá nhân hóa đã sẵn sàng",
      focusOn: "Câu hỏi sẽ tập trung vào",
      standardMode: "Chế độ Quiz tiêu chuẩn",
      uploadForPersonalized: "Vui lòng tải lên CV để nhận câu hỏi cá nhân hóa. Câu hỏi JavaScript mặc định sẽ được sử dụng.",
      totalQuestions: "Tổng số câu hỏi",
      easyQuestions: "Câu hỏi dễ",
      mediumQuestions: "Câu hỏi trung bình",
      hardQuestions: "Câu hỏi khó",
      startQuiz: "Bắt đầu Quiz",
      loadingQuestions: "Đang tải câu hỏi...",
      tip: "Mẹo",
      tipText: "Tải lên CV ở trên để nhận câu hỏi được thiết kế riêng cho kỹ năng và cấp độ kinh nghiệm cụ thể của bạn!",
      question: "Câu hỏi",
      of: "của",
      chooseAnswer: "Chọn một câu trả lời để tiếp tục",
      lastQuestion: "Câu hỏi cuối cùng - Chọn một câu trả lời để kết thúc",
      finishQuiz: "Hoàn thành Quiz",
      excellent: "Xuất sắc",
      good: "Giỏi",
      average: "Khá",
      needsImprovement: "Cần cố gắng",
      correct: "Đúng",
      wrong: "Sai",
      detailedResults: "Kết quả chi tiết",
      explanation: "Giải thích:",
      performanceAnalysis: "Phân tích hiệu suất",
      outstandingPerf: "Hiệu suất xuất sắc! Bạn đã sẵn sàng cho vai trò cấp cao.",
      goodPerf: "Làm tốt lắm! Bạn có kỹ năng vững chắc với chỗ cần cải thiện.",
      averagePerf: "Bạn đã nắm được những điều cơ bản. Tập trung vào các lĩnh vực yếu.",
      needsImprovementPerf: "Đừng lo lắng! Với việc học tập tập trung, bạn sẽ cải thiện nhanh chóng.",
      recommendations: "Khuyến nghị cá nhân hóa",
      recommendedResources: "Tài nguyên được đề xuất:",
      studyPlan: "Kế hoạch học tập cá nhân hóa",
      timeframe: "Khung thời gian:",
      hoursPerDay: "giờ/ngày",
      topicsToCover: "Các chủ đề cần học:",
      goals: "Mục tiêu:",
      careerInsights: "Thông tin nghề nghiệp",
      highImpact: "tác động cao",
      mediumImpact: "tác động trung bình",
      lowImpact: "tác động thấp",
      actionable: "Có thể thực hiện",
      takeAnotherQuiz: "Làm Quiz khác",
      senior: "cấp cao",
      midLevel: "trung cấp",
      junior: "sơ cấp"
    },
    en: {
      title: "Enhanced Quiz System",
      subtitle: "Test your knowledge with 1000+ questions • Smart level distribution • AI-powered",
      uploadResume: "Upload Your Resume (Required)",
      uploadResumeDesc: "Upload your resume to get personalized questions based on your skills and experience",
      analyzing: "Analyzing...",
      dragDrop: "Drag & drop your resume",
      formatSupport: "PDF, DOCX, or TXT format",
      cvAnalysis: "CV Analysis Results",
      primaryFocus: "Primary Focus Area",
      secondarySkills: "Secondary Skills",
      experienceLevel: "Experience Level",
      detectedSkills: "Detected Skills",
      analysisConfidence: "Analysis Confidence",
      highConfidence: "High confidence - Questions will be highly personalized",
      mediumConfidence: "Medium confidence - Questions will be moderately personalized",
      lowConfidence: "Low confidence - General questions will be used",
      selectDifficulty: "Select Difficulty Preference",
      difficultyDetected: "Based on your CV analysis, we detected {level} level. You can adjust if needed.",
      uploadFirst: "Please upload your CV first for automatic difficulty detection.",
      low: "Easy",
      mid: "Medium",
      high: "Hard",
      lowDesc: "Basic concepts & fundamentals",
      midDesc: "Intermediate topics & patterns",
      highDesc: "Advanced & expert level",
      quizInfo: "Quiz Information",
      personalizedReady: "Personalized Quiz Ready",
      focusOn: "Questions will focus on",
      standardMode: "Standard Quiz Mode",
      uploadForPersonalized: "Please upload your CV to get personalized questions. Default JavaScript questions will be used.",
      totalQuestions: "Total Questions",
      easyQuestions: "Easy Questions",
      mediumQuestions: "Medium Questions",
      hardQuestions: "Hard Questions",
      startQuiz: "Start Quiz",
      loadingQuestions: "Loading Questions...",
      tip: "Tip",
      tipText: "Upload your resume above to get questions tailored to your specific skills and experience level!",
      question: "Question",
      of: "of",
      chooseAnswer: "Choose an answer to continue",
      lastQuestion: "Last question - Choose an answer to finish",
      finishQuiz: "Finish Quiz",
      excellent: "Excellent",
      good: "Good",
      average: "Average",
      needsImprovement: "Needs Improvement",
      correct: "Correct",
      wrong: "Wrong",
      detailedResults: "Detailed Results",
      explanation: "Explanation:",
      performanceAnalysis: "Performance Analysis",
      outstandingPerf: "Outstanding performance! You're ready for senior roles.",
      goodPerf: "Good job! You have solid skills with room for improvement.",
      averagePerf: "You have the basics down. Focus on strengthening weak areas.",
      needsImprovementPerf: "Don't worry! With focused study, you'll improve quickly.",
      recommendations: "Personalized Recommendations",
      recommendedResources: "Recommended Resources:",
      studyPlan: "Personalized Study Plan",
      timeframe: "Timeframe:",
      hoursPerDay: "h/day",
      topicsToCover: "Topics to Cover:",
      goals: "Goals:",
      careerInsights: "Career Insights",
      highImpact: "high impact",
      mediumImpact: "medium impact",
      lowImpact: "low impact",
      actionable: "Actionable",
      takeAnotherQuiz: "Take Another Quiz",
      senior: "senior",
      midLevel: "mid",
      junior: "junior"
    },
    ja: {
      title: "強化クイズシステム",
      subtitle: "1000以上の質問で知識をテスト • スマートなレベル配分 • AI搭載",
      uploadResume: "履歴書をアップロード（必須）",
      uploadResumeDesc: "スキルと経験に基づいてパーソナライズされた質問を取得するには、履歴書をアップロードしてください",
      analyzing: "分析中...",
      dragDrop: "履歴書をドラッグ＆ドロップ",
      formatSupport: "PDF、DOCX、またはTXT形式",
      cvAnalysis: "CV分析結果",
      primaryFocus: "主要な専門分野",
      secondarySkills: "副次的なスキル",
      experienceLevel: "経験レベル",
      detectedSkills: "検出されたスキル",
      analysisConfidence: "分析の信頼度",
      highConfidence: "高い信頼度 - 質問は高度にパーソナライズされます",
      mediumConfidence: "中程度の信頼度 - 質問は適度にパーソナライズされます",
      lowConfidence: "低い信頼度 - 一般的な質問が使用されます",
      selectDifficulty: "難易度の選択",
      difficultyDetected: "CV分析に基づいて、{level}レベルが検出されました。必要に応じて調整できます。",
      uploadFirst: "自動難易度検出のために、まずCVをアップロードしてください。",
      low: "簡単",
      mid: "中級",
      high: "難しい",
      lowDesc: "基本概念と基礎",
      midDesc: "中級トピックとパターン",
      highDesc: "上級＆エキスパートレベル",
      quizInfo: "クイズ情報",
      personalizedReady: "パーソナライズされたクイズの準備完了",
      focusOn: "質問は以下に焦点を当てます",
      standardMode: "標準クイズモード",
      uploadForPersonalized: "パーソナライズされた質問を取得するには、CVをアップロードしてください。デフォルトのJavaScript質問が使用されます。",
      totalQuestions: "総質問数",
      easyQuestions: "簡単な質問",
      mediumQuestions: "中級の質問",
      hardQuestions: "難しい質問",
      startQuiz: "クイズを開始",
      loadingQuestions: "質問を読み込み中...",
      tip: "ヒント",
      tipText: "上記で履歴書をアップロードして、特定のスキルと経験レベルに合わせた質問を取得してください！",
      question: "質問",
      of: "の",
      chooseAnswer: "答えを選択して続行",
      lastQuestion: "最後の質問 - 答えを選択して完了",
      finishQuiz: "クイズを終了",
      excellent: "優秀",
      good: "良好",
      average: "平均",
      needsImprovement: "改善が必要",
      correct: "正解",
      wrong: "不正解",
      detailedResults: "詳細な結果",
      explanation: "説明：",
      performanceAnalysis: "パフォーマンス分析",
      outstandingPerf: "優れたパフォーマンス！シニアの役割に準備ができています。",
      goodPerf: "よくできました！改善の余地がある確固たるスキルを持っています。",
      averagePerf: "基本は理解しています。弱い分野を強化することに焦点を当ててください。",
      needsImprovementPerf: "心配しないでください！集中的な学習で、すぐに改善します。",
      recommendations: "パーソナライズされた推奨事項",
      recommendedResources: "推奨リソース：",
      studyPlan: "パーソナライズされた学習計画",
      timeframe: "期間：",
      hoursPerDay: "時間/日",
      topicsToCover: "カバーするトピック：",
      goals: "目標：",
      careerInsights: "キャリアインサイト",
      highImpact: "高い影響",
      mediumImpact: "中程度の影響",
      lowImpact: "低い影響",
      actionable: "実行可能",
      takeAnotherQuiz: "別のクイズを受ける",
      senior: "シニア",
      midLevel: "中級",
      junior: "ジュニア"
    },
    zh: {
      title: "增强型测验系统",
      subtitle: "用1000多个问题测试您的知识 • 智能难度分配 • AI驱动",
      uploadResume: "上传您的简历（必需）",
      uploadResumeDesc: "上传您的简历以获取基于您的技能和经验的个性化问题",
      analyzing: "分析中...",
      dragDrop: "拖放您的简历",
      formatSupport: "PDF、DOCX或TXT格式",
      cvAnalysis: "简历分析结果",
      primaryFocus: "主要专业领域",
      secondarySkills: "次要技能",
      experienceLevel: "经验水平",
      detectedSkills: "检测到的技能",
      analysisConfidence: "分析置信度",
      highConfidence: "高置信度 - 问题将高度个性化",
      mediumConfidence: "中等置信度 - 问题将适度个性化",
      lowConfidence: "低置信度 - 将使用一般性问题",
      selectDifficulty: "选择难度偏好",
      difficultyDetected: "根据您的简历分析，我们检测到{level}级别。如果需要，您可以调整。",
      uploadFirst: "请先上传您的简历以进行自动难度检测。",
      low: "简单",
      mid: "中等",
      high: "困难",
      lowDesc: "基本概念和基础",
      midDesc: "中级主题和模式",
      highDesc: "高级和专家级别",
      quizInfo: "测验信息",
      personalizedReady: "个性化测验准备就绪",
      focusOn: "问题将集中在",
      standardMode: "标准测验模式",
      uploadForPersonalized: "请上传您的简历以获取个性化问题。将使用默认的JavaScript问题。",
      totalQuestions: "总问题数",
      easyQuestions: "简单问题",
      mediumQuestions: "中等问题",
      hardQuestions: "困难问题",
      startQuiz: "开始测验",
      loadingQuestions: "加载问题中...",
      tip: "提示",
      tipText: "在上面上传您的简历，以获取针对您的具体技能和经验水平的问题！",
      question: "问题",
      of: "共",
      chooseAnswer: "选择答案继续",
      lastQuestion: "最后一个问题 - 选择答案完成",
      finishQuiz: "完成测验",
      excellent: "优秀",
      good: "良好",
      average: "一般",
      needsImprovement: "需要改进",
      correct: "正确",
      wrong: "错误",
      detailedResults: "详细结果",
      explanation: "解释：",
      performanceAnalysis: "性能分析",
      outstandingPerf: "出色的表现！您已准备好担任高级职位。",
      goodPerf: "干得好！您拥有扎实的技能，还有改进的空间。",
      averagePerf: "您已掌握基础知识。专注于加强薄弱领域。",
      needsImprovementPerf: "别担心！通过专注学习，您会快速进步。",
      recommendations: "个性化建议",
      recommendedResources: "推荐资源：",
      studyPlan: "个性化学习计划",
      timeframe: "时间框架：",
      hoursPerDay: "小时/天",
      topicsToCover: "要学习的主题：",
      goals: "目标：",
      careerInsights: "职业见解",
      highImpact: "高影响",
      mediumImpact: "中等影响",
      lowImpact: "低影响",
      actionable: "可执行",
      takeAnotherQuiz: "参加另一个测验",
      senior: "高级",
      midLevel: "中级",
      junior: "初级"
    },
    ko: {
      title: "향상된 퀴즈 시스템",
      subtitle: "1000개 이상의 질문으로 지식 테스트 • 스마트 난이도 분배 • AI 지원",
      uploadResume: "이력서 업로드 (필수)",
      uploadResumeDesc: "기술과 경험을 기반으로 맞춤형 질문을 받으려면 이력서를 업로드하세요",
      analyzing: "분석 중...",
      dragDrop: "이력서를 드래그 앤 드롭",
      formatSupport: "PDF, DOCX 또는 TXT 형식",
      cvAnalysis: "이력서 분석 결과",
      primaryFocus: "주요 전문 분야",
      secondarySkills: "보조 기술",
      experienceLevel: "경험 수준",
      detectedSkills: "감지된 기술",
      analysisConfidence: "분석 신뢰도",
      highConfidence: "높은 신뢰도 - 질문이 고도로 맞춤화됩니다",
      mediumConfidence: "중간 신뢰도 - 질문이 적당히 맞춤화됩니다",
      lowConfidence: "낮은 신뢰도 - 일반적인 질문이 사용됩니다",
      selectDifficulty: "난이도 선택",
      difficultyDetected: "이력서 분석을 기반으로 {level} 수준을 감지했습니다. 필요시 조정할 수 있습니다.",
      uploadFirst: "자동 난이도 감지를 위해 먼저 이력서를 업로드하세요.",
      low: "쉬움",
      mid: "중간",
      high: "어려움",
      lowDesc: "기본 개념 및 기초",
      midDesc: "중급 주제 및 패턴",
      highDesc: "고급 및 전문가 수준",
      quizInfo: "퀴즈 정보",
      personalizedReady: "맞춤형 퀴즈 준비 완료",
      focusOn: "질문은 다음에 집중합니다",
      standardMode: "표준 퀴즈 모드",
      uploadForPersonalized: "맞춤형 질문을 받으려면 이력서를 업로드하세요. 기본 JavaScript 질문이 사용됩니다.",
      totalQuestions: "총 질문 수",
      easyQuestions: "쉬운 질문",
      mediumQuestions: "중간 질문",
      hardQuestions: "어려운 질문",
      startQuiz: "퀴즈 시작",
      loadingQuestions: "질문 로딩 중...",
      tip: "팁",
      tipText: "위에서 이력서를 업로드하여 특정 기술과 경험 수준에 맞춤화된 질문을 받으세요!",
      question: "질문",
      of: "중",
      chooseAnswer: "답변을 선택하여 계속",
      lastQuestion: "마지막 질문 - 답변을 선택하여 완료",
      finishQuiz: "퀴즈 완료",
      excellent: "우수",
      good: "좋음",
      average: "보통",
      needsImprovement: "개선 필요",
      correct: "정답",
      wrong: "오답",
      detailedResults: "상세 결과",
      explanation: "설명：",
      performanceAnalysis: "성능 분석",
      outstandingPerf: "뛰어난 성능! 시니어 역할을 맡을 준비가 되었습니다.",
      goodPerf: "잘했습니다! 개선의 여지가 있는 탄탄한 기술을 갖고 있습니다.",
      averagePerf: "기본은 이해했습니다. 약한 영역을 강화하는 데 집중하세요.",
      needsImprovementPerf: "걱정하지 마세요! 집중적인 학습으로 빠르게 향상될 것입니다.",
      recommendations: "맞춤형 추천",
      recommendedResources: "추천 리소스：",
      studyPlan: "맞춤형 학습 계획",
      timeframe: "기간：",
      hoursPerDay: "시간/일",
      topicsToCover: "다룰 주제：",
      goals: "목표：",
      careerInsights: "경력 인사이트",
      highImpact: "높은 영향",
      mediumImpact: "중간 영향",
      lowImpact: "낮은 영향",
      actionable: "실행 가능",
      takeAnotherQuiz: "다른 퀴즈 보기",
      senior: "시니어",
      midLevel: "중급",
      junior: "주니어"
    }
  };

  const t = translations[language];

  // Helper function để tạo title cho quiz
  const getQuizTitle = (analysis: SkillAnalysis): string => {
    const skills = [analysis.primaryCategory, ...analysis.secondaryCategories.slice(0, 2)]
      .map(skill => skill.replace('-', ' ').toUpperCase())
      .join(' + ');
    return skills;
  };

  // Timer
  useEffect(() => {
    if (mode === 'quiz' && startTime > 0) {
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode, startTime]);

  // Handle Resume Upload
  const handleResumeUpload = async (file: File | null) => {
    setUploadedResume(file);
    
    if (file) {
      setIsAnalyzingResume(true);
      try {
        const extractedText = await extractTextFromFile(file);
        const analysis = analyzeSkills(extractedText);
        setSkillAnalysis(analysis);
        console.log('CV Analysis:', analysis);
      } catch (error) {
        console.error('Error analyzing resume:', error);
      } finally {
        setIsAnalyzingResume(false);
      }
    } else {
      setSkillAnalysis(null);
    }
  };

  // Smart Question Generation Logic
  const generateSmartQuestions = async (analysis: SkillAnalysis): Promise<QuizQuestion[]> => {
    const allSkills = [analysis.primaryCategory, ...analysis.secondaryCategories];
    
    console.log(`[Multi-Agent Strategy] Step 1: Checking database for skills:`, allSkills);
    
    // STEP 1: Try to get questions from database FIRST (fast!)
    const dbQuestions: QuizQuestion[] = [];
    const skillsWithoutQuestions: string[] = [];
    
    for (const skill of allSkills) {
      try {
        const skillQuestions = getRandomQuestions(skill, 20, { 
          low: selectedLevel === 'low' ? 14 : 6, 
          mid: selectedLevel === 'mid' ? 14 : 6, 
          high: selectedLevel === 'high' ? 14 : 6 
        });
        dbQuestions.push(...skillQuestions);
        console.log(`✓ Found ${skillQuestions.length} questions for ${skill} in database`);
      } catch (err) {
        console.log(`✗ No questions for ${skill} in database - will need AI`);
        skillsWithoutQuestions.push(skill);
      }
    }
    
    // STEP 2: If we have enough questions from database, use them!
    if (dbQuestions.length >= 20) {
      console.log(`[Multi-Agent Strategy] Success! Found ${dbQuestions.length} questions in database`);
      
      // Prioritize primary and secondary skills
      const primaryQuestions = dbQuestions.filter(q => 
        q.category === analysis.primaryCategory
      ).slice(0, 12);
      
      const secondaryQuestions = dbQuestions.filter(q => 
        analysis.secondaryCategories.includes(q.category)
      ).slice(0, 8);
      
      let finalQuestions = [...primaryQuestions, ...secondaryQuestions].slice(0, 20);
      
      // TRANSLATION: If not English, translate database questions
      if (language !== 'en') {
        console.log(`[Multi-Agent Strategy] Step 2.5: Translating ${finalQuestions.length} questions to ${language}`);
        try {
          const translatedQuestions = await translateQuestions(finalQuestions, language);
          console.log(`✓ Translation complete for ${translatedQuestions.length} questions`);
          return translatedQuestions;
        } catch (error) {
          console.error('Translation failed, using English questions:', error);
          return finalQuestions;
        }
      }
      
      return finalQuestions;
    }
    
    // STEP 3: Mixed approach - use DB questions + AI for missing ones
    if (dbQuestions.length > 0 && skillsWithoutQuestions.length > 0) {
      console.log(`[Multi-Agent Strategy] Step 3: Mixed approach`);
      console.log(`- ${dbQuestions.length} questions from database`);
      console.log(`- Need AI for: ${skillsWithoutQuestions.join(', ')}`);
      
      const neededAICount = Math.max(20 - dbQuestions.length, 5);
      
      try {
        const aiQuestions = await generateQuestionsWithAI(
          skillsWithoutQuestions,
          selectedLevel,
          neededAICount,
          language
        );
        
        console.log(`✓ Generated ${aiQuestions.length} AI questions in ${language}`);
        
        // Combine DB and AI questions
        let combinedQuestions = [...dbQuestions.slice(0, 15), ...aiQuestions].slice(0, 20);
        
        // Translate DB questions if needed
        if (language !== 'en' && dbQuestions.length > 0) {
          console.log(`[Multi-Agent Strategy] Step 3.5: Translating ${dbQuestions.length} DB questions to ${language}`);
          try {
            const translatedDbQuestions = await translateQuestions(dbQuestions.slice(0, 15), language);
            combinedQuestions = [...translatedDbQuestions, ...aiQuestions].slice(0, 20);
            console.log(`✓ Translation complete for mixed questions`);
          } catch (error) {
            console.error('Translation failed, using mixed English/AI questions:', error);
          }
        }
        
        return combinedQuestions;
        
      } catch (error) {
        console.error('AI generation failed, using only DB questions:', error);
        
        // Fallback: translate DB questions if needed
        if (language !== 'en' && dbQuestions.length > 0) {
          try {
            const translatedQuestions = await translateQuestions(dbQuestions.slice(0, 20), language);
            return translatedQuestions;
          } catch (translError) {
            console.error('Translation also failed:', translError);
          }
        }
        
        return dbQuestions.slice(0, 20);
      }
    }
    
    // STEP 4: Last resort - all AI (slowest, only if no DB questions)
    console.log(`[Multi-Agent Strategy] Step 4: Generating all questions with AI for:`, allSkills);
    
    try {
      const aiQuestions = await generateQuestionsWithAI(
        allSkills,
        selectedLevel,
        20,
        language
      );
      
      console.log(`✓ Generated ${aiQuestions.length} AI questions in ${language}`);
      return aiQuestions;
      
    } catch (error) {
      console.error('Failed to generate AI questions:', error);
      
      // Final fallback
      const warningMessages = {
        vi: 'Không thể tạo câu hỏi. Vui lòng thử lại sau.',
        en: 'Failed to generate questions. Please try again later.',
        ja: '質問の生成に失敗しました。後でもう一度お試しください。',
        zh: '生成问题失败。请稍后再试。',
        ko: '질문 생성에 실패했습니다. 나중에 다시 시도하십시오.'
      };
      alert(warningMessages[language]);
      
      return dbQuestions.length > 0 ? dbQuestions.slice(0, 20) : [];
    }
  };

  // Start Quiz Handler
  const handleStartQuiz = async () => {
    if (!skillAnalysis || !uploadedResume) {
      const alertMessages = {
        vi: 'Vui lòng tải lên CV của bạn trước để có trải nghiệm quiz cá nhân hóa!',
        en: 'Please upload your CV first for a personalized quiz experience!',
        ja: 'パーソナライズされたクイズ体験のために、まずCVをアップロードしてください！',
        zh: '请先上传您的简历以获得个性化的测验体验！',
        ko: '맞춤형 퀴즈 경험을 위해 먼저 이력서를 업로드하세요!'
      };
      alert(alertMessages[language]);
      return;
    }
    
    setIsLoadingQuestions(true);
    
    try {
      const selectedQuestions = await generateSmartQuestions(skillAnalysis);
      
      console.log('Generated questions for skills:', {
        primary: skillAnalysis.primaryCategory,
        secondary: skillAnalysis.secondaryCategories,
        totalQuestions: selectedQuestions.length,
        questionCategories: [...new Set(selectedQuestions.map(q => q.category))]
      });

      setQuestions(selectedQuestions);
      setMode('quiz');
      setStartTime(Date.now());
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Answer Selection Handler
  const handleAnswerSelect = (answerIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    setUserAnswers([
      ...userAnswers,
      {
        questionId: currentQuestion.id,
        selectedAnswer: answerIndex,
        timeSpent
      }
    ]);

    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  // Submit Quiz Handler
  const handleSubmitQuiz = () => {
    const results: QuizResult[] = questions.map((question, index) => {
      const userAnswer = userAnswers[index];
      const selectedAnswerIndex = userAnswer?.selectedAnswer ?? -1;
      
      // Validate directly from question object (works for both DB and AI questions)
      const isCorrect = selectedAnswerIndex === question.correctAnswer;

      return {
        questionId: question.id,
        question: question.question,
        userAnswer: selectedAnswerIndex,
        correctAnswer: question.correctAnswer,
        isCorrect: isCorrect,
        explanation: question.explanation || 'No explanation available',
        options: question.options,
        category: question.category,
        difficulty: question.level
      };
    });

    setQuizResults(results);
    
    // Generate comprehensive feedback
    if (skillAnalysis) {
      const feedback = generateComprehensiveFeedback(
        results as FeedbackQuizResult[], 
        skillAnalysis, 
        timeElapsed
      );
      setComprehensiveFeedback(feedback);
      console.log('Generated comprehensive feedback:', feedback);
    }
    
    setMode('result');
  };

  // Calculate Score
  const calculateScore = () => {
    const correct = quizResults.filter(r => r.isCorrect).length;
    const total = quizResults.length;
    const percentage = Math.round((correct / total) * 100);
    return { correct, total, percentage };
  };

  // Get Performance Level
  const getPerformanceLevel = (percentage: number): { level: string; color: string; icon: any } => {
    if (percentage >= 90) return { level: t.excellent, color: 'text-green-500', icon: Award };
    if (percentage >= 75) return { level: t.good, color: 'text-blue-500', icon: TrendingUp };
    if (percentage >= 60) return { level: t.average, color: 'text-purple-500', icon: Target };
    return { level: t.needsImprovement, color: 'text-orange-500', icon: BarChart3 };
  };

  // Format Time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render Mode: Selection
  if (mode === 'select') {
    return (
      <div className="relative min-h-screen">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block mb-4">
            <Brain className="h-16 w-16 text-purple-500 animate-float mx-auto" />
          </div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            {t.title}
          </h1>
          <p className="text-lg text-gray-400">
            {t.subtitle}
          </p>
        </div>

        {/* Language Selector */}
        <div className="glass-effect rounded-xl p-6 mb-8 max-w-md mx-auto">
          <LanguageSelector
            value={language}
            onChange={setLanguage}
            disabled={isLoadingQuestions || isAnalyzingResume}
          />
        </div>

        {/* Resume Upload (Required) */}
        <div className="glass-effect rounded-2xl p-8 mb-8 hover-scale">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="h-6 w-6 text-purple-500" />
            <h3 className="text-xl font-semibold">{t.uploadResume}</h3>
            {isAnalyzingResume && (
              <div className="flex items-center gap-2 text-purple-500">
                <Clock className="animate-spin h-5 w-5" />
                <span className="text-sm">{t.analyzing}</span>
              </div>
            )}
          </div>
          <p className="text-gray-400 mb-6">
            {t.uploadResumeDesc}
          </p>
          <FileUpload
            onFileChange={handleResumeUpload}
            maxSizeInMB={10}
            validTypes={["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"]}
            title={t.dragDrop}
            description={t.formatSupport}
            icon={<Upload className="h-12 w-12 text-purple-500" />}
          />
        </div>

        {/* Skills Analysis Display */}
        {skillAnalysis && (
          <div className="glass-effect rounded-2xl p-8 mb-8 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-6 gradient-text">📊 {t.cvAnalysis}</h3>
            
            {/* Primary Skills */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Target className="h-5 w-5 text-green-500" />
                <h4 className="text-lg font-semibold text-green-500">{t.primaryFocus}</h4>
              </div>
              <div className="inline-block px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl">
                <span className="text-green-500 font-semibold">
                  {getCategoryJobTitle(skillAnalysis.primaryCategory, language)}
                </span>
              </div>
            </div>

            {/* Secondary Skills */}
            {skillAnalysis.secondaryCategories.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  <h4 className="text-lg font-semibold text-blue-500">{t.secondarySkills}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillAnalysis.secondaryCategories.map((category, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-500 text-sm"
                    >
                      {getCategoryJobTitle(category, language)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Level */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <h4 className="text-lg font-semibold text-purple-500">{t.experienceLevel}</h4>
              </div>
              <div className={`inline-block px-4 py-2 rounded-xl border ${
                skillAnalysis.experienceLevel === 'senior' ? 'bg-red-500/20 border-red-500/30 text-red-500' :
                skillAnalysis.experienceLevel === 'mid' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500' :
                'bg-green-500/20 border-green-500/30 text-green-500'
              }`}>
                <span className="font-semibold capitalize">
                  {skillAnalysis.experienceLevel === 'senior' ? t.senior :
                   skillAnalysis.experienceLevel === 'mid' ? t.midLevel : t.junior}
                </span>
              </div>
            </div>

            {/* Detected Skills */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                <h4 className="text-lg font-semibold text-orange-500">{t.detectedSkills}</h4>
                <span className="text-sm text-gray-400">
                  ({skillAnalysis.detectedSkills.length} {language === 'vi' ? 'kỹ năng' : language === 'ja' ? 'スキル' : language === 'zh' ? '技能' : language === 'ko' ? '기술' : 'skills'})
                </span>
              </div>
              
              {/* Detailed Skills Breakdown */}
              {skillAnalysis.detailedSkills && (
                <div className="space-y-3 mb-4">
                  {skillAnalysis.detailedSkills.languages && skillAnalysis.detailedSkills.languages.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {language === 'vi' ? '💻 Ngôn ngữ lập trình' : 
                         language === 'ja' ? '💻 プログラミング言語' :
                         language === 'zh' ? '💻 编程语言' :
                         language === 'ko' ? '💻 프로그래밍 언어' : '💻 Programming Languages'}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {skillAnalysis.detailedSkills.languages.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-400 text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {skillAnalysis.detailedSkills.frameworks && skillAnalysis.detailedSkills.frameworks.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {language === 'vi' ? '🔧 Frameworks' : 
                         language === 'ja' ? '🔧 フレームワーク' :
                         language === 'zh' ? '🔧 框架' :
                         language === 'ko' ? '🔧 프레임워크' : '🔧 Frameworks'}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {skillAnalysis.detailedSkills.frameworks.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-green-400 text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {skillAnalysis.detailedSkills.database && skillAnalysis.detailedSkills.database.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {language === 'vi' ? '🗄️ Cơ sở dữ liệu' : 
                         language === 'ja' ? '🗄️ データベース' :
                         language === 'zh' ? '🗄️ 数据库' :
                         language === 'ko' ? '🗄️ 데이터베이스' : '🗄️ Databases'}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {skillAnalysis.detailedSkills.database.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-purple-400 text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {skillAnalysis.detailedSkills.tools && skillAnalysis.detailedSkills.tools.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {language === 'vi' ? '🛠️ Công cụ & Công nghệ' : 
                         language === 'ja' ? '🛠️ ツール＆技術' :
                         language === 'zh' ? '🛠️ 工具与技术' :
                         language === 'ko' ? '🛠️ 도구 및 기술' : '🛠️ Tools & Technologies'}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {skillAnalysis.detailedSkills.tools.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-yellow-400 text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* All Skills Compact View */}
              {!skillAnalysis.detailedSkills && skillAnalysis.detectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {skillAnalysis.detectedSkills.slice(0, 30).map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded text-orange-400 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {skillAnalysis.detectedSkills.length > 30 && (
                    <span className="text-gray-400 text-xs self-center">
                      +{skillAnalysis.detectedSkills.length - 30} more
                    </span>
                  )}
                </div>
              )}
              
              {skillAnalysis.detectedSkills.length === 0 && (
                <p className="text-gray-500 text-sm italic">
                  {language === 'vi' ? 'Không phát hiện kỹ năng kỹ thuật trong CV' :
                   language === 'ja' ? 'CVに技術スキルが検出されませんでした' :
                   language === 'zh' ? '简历中未检测到技术技能' :
                   language === 'ko' ? 'CV에서 기술적 기술이 감지되지 않았습니다' :
                   'No technical skills detected in CV'}
                </p>
              )}
            </div>

            {/* Confidence Score */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="h-5 w-5 text-purple-500" />
                <h4 className="text-lg font-semibold text-purple-500">{t.analysisConfidence}</h4>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/10 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${skillAnalysis.confidence * 100}%` }}
                  />
                </div>
                <span className="text-purple-500 font-semibold">
                  {Math.round(skillAnalysis.confidence * 100)}%
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                {skillAnalysis.confidence > 0.7 ? t.highConfidence :
                 skillAnalysis.confidence > 0.4 ? t.mediumConfidence :
                 t.lowConfidence}
              </p>
            </div>
          </div>
        )}

        {/* Category Selection - REMOVED */}
        
        {/* Level Selection - Simplified */}
        <div className="glass-effect rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 gradient-text">{t.selectDifficulty}</h3>
          <p className="text-gray-400 mb-6">
            {skillAnalysis ? 
              t.difficultyDetected.replace('{level}', t[skillAnalysis.experienceLevel as keyof typeof t] as string || skillAnalysis.experienceLevel) :
              t.uploadFirst
            }
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['low', 'mid', 'high'] as QuizLevel[]).map((level) => (
              <Ripple
                key={level}
                color={selectedLevel === level ? "green" : "white"}
                as="button"
                onClick={() => setSelectedLevel(level)}
                onMouseDown={() => {}}
                style={{}}
                className={`p-6 rounded-xl border-2 transition-all hover-scale ${
                  selectedLevel === level
                    ? 'border-green-500 bg-green-500/20 neon-shadow'
                    : 'border-white/10 bg-white/5 hover:border-green-400'
                }`}
              >
                <div className="text-center">
                  <Target className={`h-10 w-10 mx-auto mb-3 ${
                    level === 'low' ? 'text-green-500' :
                    level === 'mid' ? 'text-yellow-500' :
                    'text-red-500'
                  }`} />
                  <h4 className="text-xl font-bold mb-2 capitalize">{t[level]}</h4>
                  <p className="text-sm text-gray-400">
                    {level === 'low' && t.lowDesc}
                    {level === 'mid' && t.midDesc}
                    {level === 'high' && t.highDesc}
                  </p>
                </div>
              </Ripple>
            ))}
          </div>
        </div>

        {/* Quiz Information - Dynamic based on CV analysis */}
        <div className="glass-effect rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 gradient-text">📊 {t.quizInfo}</h3>
          {skillAnalysis ? (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-green-500 font-semibold">{t.personalizedReady}</span>
              </div>
              <p className="text-gray-300 text-sm">
                {t.focusOn} <strong className="text-green-500">
                  {getCategoryJobTitle(skillAnalysis.primaryCategory, language)}
                </strong> {language === 'vi' ? 'cùng với các câu hỏi bổ sung từ kỹ năng phụ của bạn' : 
                   language === 'ja' ? 'および副次的なスキルからの追加質問' :
                   language === 'zh' ? '以及来自您次要技能的其他问题' :
                   language === 'ko' ? '및 보조 기술의 추가 질문' :
                   'with additional questions from your secondary skills'}.
              </p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span className="text-orange-500 font-semibold">{t.standardMode}</span>
              </div>
              <p className="text-gray-300 text-sm">
                {t.uploadForPersonalized}
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
              <p className="text-3xl font-bold text-purple-500">20</p>
              <p className="text-sm text-gray-400 mt-2">{t.totalQuestions}</p>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/30">
              <p className="text-3xl font-bold text-green-500">
                {skillAnalysis ? '4-6' : '6'}
              </p>
              <p className="text-sm text-gray-400 mt-2">{t.easyQuestions}</p>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
              <p className="text-3xl font-bold text-yellow-500">
                {skillAnalysis ? '8-10' : '8'}
              </p>
              <p className="text-sm text-gray-400 mt-2">{t.mediumQuestions}</p>
            </div>
            <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/30">
              <p className="text-3xl font-bold text-red-500">
                {skillAnalysis ? '4-6' : '6'}
              </p>
              <p className="text-sm text-gray-400 mt-2">{t.hardQuestions}</p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <Ripple
            as="button"
            color="purple"
            disabled={isLoadingQuestions || isAnalyzingResume}
            onClick={handleStartQuiz}
            className="btn-neon text-white px-12 py-8 text-xl rounded-2xl animate-pulse-glow"
            style={{}}
            onMouseDown={() => {}}
          >
            {isLoadingQuestions ? (
              <>
                <Clock className="animate-spin mr-3 h-6 w-6" />
                {t.loadingQuestions}
              </>
            ) : (
              <>
                <Play className="mr-3 h-6 w-6" />
                {t.startQuiz}
              </>
            )}
          </Ripple>
        </div>

        {/* Help Text */}
        {!uploadedResume && (
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              💡 <strong>{t.tip}:</strong> {t.tipText}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Render Mode: Quiz
  if (mode === 'quiz' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="relative min-h-screen">
        {/* Progress Bar */}
        <div className="glass-effect rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-500" />
              <span className="text-lg font-semibold">
                {t.question} {currentQuestionIndex + 1} {t.of} {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-purple-500 animate-pulse" />
              <span className="text-lg font-semibold">{formatTime(timeElapsed)}</span>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 neon-shadow"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-effect rounded-2xl p-8 mb-8 hover-scale animate-fade-in-up">
          {/* Level Badge */}
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase ${
              currentQuestion.level === 'low' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
              currentQuestion.level === 'mid' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
              'bg-red-500/20 text-red-500 border border-red-500/30'
            }`}>
              {t[currentQuestion.level]} {language === 'vi' ? 'CẤP ĐỘ' :
               language === 'ja' ? 'レベル' :
               language === 'zh' ? '级别' :
               language === 'ko' ? '레벨' : 'LEVEL'}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-2xl font-bold mb-8 text-white leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className="w-full p-6 rounded-xl border-2 border-white/10 bg-white/5 hover:border-purple-500 hover:bg-purple-500/10 transition-all hover-scale text-left group ripple-container"
                onMouseDown={(e) => {
                  const ripple = document.createElement('span');
                  const rect = e.currentTarget.getBoundingClientRect();
                  const size = Math.max(rect.width, rect.height);
                  const x = e.clientX - rect.left - size / 2;
                  const y = e.clientY - rect.top - size / 2;
                  ripple.style.width = ripple.style.height = `${size}px`;
                  ripple.style.left = `${x}px`;
                  ripple.style.top = `${y}px`;
                  ripple.classList.add('ripple-effect', 'ripple-purple');
                  e.currentTarget.appendChild(ripple);
                  setTimeout(() => ripple.remove(), 600);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center font-bold text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg flex-1">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <p className="text-gray-400">
            {currentQuestionIndex === questions.length - 1 
              ? t.lastQuestion
              : t.chooseAnswer}
          </p>
          <Button
            onClick={handleSubmitQuiz}
            variant="outline"
            className="border-purple-500 text-purple-500 hover:bg-purple-500/20 ripple-container"
            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
              const ripple = document.createElement('span');
              const rect = e.currentTarget.getBoundingClientRect();
              const size = Math.max(rect.width, rect.height);
              const x = e.clientX - rect.left - size / 2;
              const y = e.clientY - rect.top - size / 2;
              ripple.style.width = ripple.style.height = `${size}px`;
              ripple.style.left = `${x}px`;
              ripple.style.top = `${y}px`;
              ripple.classList.add('ripple-effect', 'ripple-purple');
              e.currentTarget.appendChild(ripple);
              setTimeout(() => ripple.remove(), 600);
            }}
          >
            {t.finishQuiz}
          </Button>
        </div>
      </div>
    );
  }

  // Render Mode: Results

  // Render Mode: Results
  if (mode === 'result') {
    const score = calculateScore();
    const performance = getPerformanceLevel(score.percentage);
    const PerformanceIcon = performance.icon;

    return (
      <>
        <NeuralNetworkBg />
        <div className="relative z-10 min-h-screen">
        {/* Score Card */}
        <div className="glass-effect rounded-2xl p-12 mb-8 text-center animate-fade-in-up">
          <div className="mb-6">
            <PerformanceIcon className={`h-24 w-24 mx-auto ${performance.color} animate-float`} />
          </div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            {score.percentage}%
          </h1>
          <p className={`text-2xl font-semibold mb-6 ${performance.color}`}>
            {performance.level}
          </p>
          <div className="flex justify-center gap-8 text-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <span>{score.correct} {t.correct}</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-500" />
              <span>{score.total - score.correct} {t.wrong}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-purple-500" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="glass-effect rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-8 gradient-text">📝 {t.detailedResults}</h2>
          <div className="space-y-6">
            {quizResults.map((result, index) => (
              <div
                key={result.questionId}
                className={`p-6 rounded-xl border-2 ${
                  result.isCorrect
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-red-500/30 bg-red-500/5'
                }`}
              >
                {/* Question Number & Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    {result.isCorrect ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-lg font-semibold mb-4">{result.question}</p>

                {/* Options */}
                <div className="space-y-3 mb-4">
                  {result.options.map((option, optIndex) => {
                    const isUserAnswer = optIndex === result.userAnswer;
                    const isCorrectAnswer = optIndex === result.correctAnswer;

                    return (
                      <div
                        key={optIndex}
                        className={`p-4 rounded-lg border ${
                          isCorrectAnswer
                            ? 'border-green-500 bg-green-500/10'
                            : isUserAnswer
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-white/10 bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          <span className="flex-1">{option}</span>
                          {isCorrectAnswer && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                          {isUserAnswer && !isCorrectAnswer && (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-purple-500 mb-2">{t.explanation}</p>
                      <p className="text-gray-300">{result.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comprehensive Feedback Section */}
        {comprehensiveFeedback && (
          <div className="space-y-8 mb-8">
            {/* Performance Analysis */}
            <div className="glass-effect rounded-2xl p-8 animate-fade-in-up">
              <h2 className="text-3xl font-bold mb-6 gradient-text">🎯 {t.performanceAnalysis}</h2>
              
              {/* Overall Performance */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`text-4xl ${
                    comprehensiveFeedback.performanceLevel === 'excellent' ? 'text-green-500' :
                    comprehensiveFeedback.performanceLevel === 'good' ? 'text-blue-500' :
                    comprehensiveFeedback.performanceLevel === 'average' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {comprehensiveFeedback.performanceLevel === 'excellent' ? '🏆' :
                     comprehensiveFeedback.performanceLevel === 'good' ? '👏' :
                     comprehensiveFeedback.performanceLevel === 'average' ? '👍' : '📚'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold capitalize">{comprehensiveFeedback.performanceLevel.replace('-', ' ')}</h3>
                    <p className="text-gray-400">
                      {comprehensiveFeedback.performanceLevel === 'excellent' && t.outstandingPerf}
                      {comprehensiveFeedback.performanceLevel === 'good' && t.goodPerf}
                      {comprehensiveFeedback.performanceLevel === 'average' && t.averagePerf}
                      {comprehensiveFeedback.performanceLevel === 'needs-improvement' && t.needsImprovementPerf}
                    </p>
                  </div>
                </div>

                {/* Skill Performance Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comprehensiveFeedback.skillAnalysis.map((skill, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-white/5 rounded-xl border border-white/10 ripple-container cursor-pointer"
                      onMouseDown={(e) => {
                        const ripple = document.createElement('span');
                        const rect = e.currentTarget.getBoundingClientRect();
                        const size = Math.max(rect.width, rect.height);
                        const x = e.clientX - rect.left - size / 2;
                        const y = e.clientY - rect.top - size / 2;
                        ripple.style.width = ripple.style.height = `${size}px`;
                        ripple.style.left = `${x}px`;
                        ripple.style.top = `${y}px`;
                        ripple.classList.add('ripple-effect', 'ripple-blue');
                        e.currentTarget.appendChild(ripple);
                        setTimeout(() => ripple.remove(), 600);
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold capitalize text-purple-400">{skill.skill.replace('-', ' ')}</h4>
                        <span className={`text-lg font-bold ${
                          skill.accuracy >= 80 ? 'text-green-500' :
                          skill.accuracy >= 60 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {skill.accuracy}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            skill.accuracy >= 80 ? 'bg-green-500' :
                            skill.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${skill.accuracy}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-400">
                        {skill.correctAnswers}/{skill.questionsAnswered} {t.correct.toLowerCase()}
                        {skill.strengths.length > 0 && (
                          <div className="mt-2">
                            <span className="text-green-400">✓ {skill.strengths[0]}</span>
                          </div>
                        )}
                        {skill.weaknesses.length > 0 && (
                          <div className="mt-1">
                            <span className="text-red-400">⚠ {skill.weaknesses[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass-effect rounded-2xl p-8 animate-fade-in-up">
              <h2 className="text-3xl font-bold mb-6 gradient-text">💡 {t.recommendations}</h2>
              <div className="space-y-4">
                {comprehensiveFeedback.recommendations.slice(0, 3).map((rec, index) => (
                  <div 
                    key={index} 
                    className="p-6 bg-white/5 rounded-xl border border-white/10 ripple-container cursor-pointer"
                    onMouseDown={(e) => {
                      const ripple = document.createElement('span');
                      const rect = e.currentTarget.getBoundingClientRect();
                      const size = Math.max(rect.width, rect.height);
                      const x = e.clientX - rect.left - size / 2;
                      const y = e.clientY - rect.top - size / 2;
                      ripple.style.width = ripple.style.height = `${size}px`;
                      ripple.style.left = `${x}px`;
                      ripple.style.top = `${y}px`;
                      ripple.classList.add('ripple-effect', 'ripple-green');
                      e.currentTarget.appendChild(ripple);
                      setTimeout(() => ripple.remove(), 600);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${
                          rec.type === 'study' ? '📚' :
                          rec.type === 'practice' ? '💻' :
                          rec.type === 'project' ? '🚀' : '🏅'
                        }`}>
                          {rec.type === 'study' ? '📚' :
                           rec.type === 'practice' ? '💻' :
                           rec.type === 'project' ? '🚀' : '🏅'}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                          <p className="text-gray-400 text-sm">{rec.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {rec.priority === 'high' ? t.highImpact : rec.priority === 'medium' ? t.mediumImpact : t.lowImpact}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{rec.timeEstimate}</p>
                      </div>
                    </div>
                    
                    {/* Resources */}
                    {rec.resources.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-purple-400 mb-2">{t.recommendedResources}</p>
                        <div className="flex flex-wrap gap-2">
                          {rec.resources.slice(0, 3).map((resource, rIndex) => (
                            <a
                              key={rIndex}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-lg hover:bg-purple-500/30 transition-all"
                            >
                              {resource.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Study Plan */}
            <div className="glass-effect rounded-2xl p-8 animate-fade-in-up">
              <h2 className="text-3xl font-bold mb-6 gradient-text">📅 {t.studyPlan}</h2>
              <div className="mb-6">
                <div className="flex items-center gap-4 text-lg">
                  <span className="text-purple-400 font-semibold">{t.timeframe}</span>
                  <span className="capitalize">{comprehensiveFeedback.studyPlan.timeframe.replace('-', ' ')}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-400 font-semibold">{comprehensiveFeedback.studyPlan.dailyHours}{t.hoursPerDay}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {comprehensiveFeedback.studyPlan.phases.map((phase, index) => (
                  <div 
                    key={index} 
                    className="p-6 bg-white/5 rounded-xl border border-white/10 ripple-container cursor-pointer"
                    onMouseDown={(e) => {
                      const ripple = document.createElement('span');
                      const rect = e.currentTarget.getBoundingClientRect();
                      const size = Math.max(rect.width, rect.height);
                      const x = e.clientX - rect.left - size / 2;
                      const y = e.clientY - rect.top - size / 2;
                      ripple.style.width = ripple.style.height = `${size}px`;
                      ripple.style.left = `${x}px`;
                      ripple.style.top = `${y}px`;
                      ripple.classList.add('ripple-effect', 'ripple-pink');
                      e.currentTarget.appendChild(ripple);
                      setTimeout(() => ripple.remove(), 600);
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                        {phase.week}
                      </div>
                      <h3 className="text-xl font-semibold text-white">{phase.focus}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-blue-400 mb-2">{t.topicsToCover}</h4>
                        <ul className="space-y-1">
                          {phase.topics.map((topic, tIndex) => (
                            <li key={tIndex} className="text-sm text-gray-300">• {topic}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-green-400 mb-2">{t.goals}</h4>
                        <ul className="space-y-1">
                          {phase.goals.map((goal, gIndex) => (
                            <li key={gIndex} className="text-sm text-gray-300">✓ {goal}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Insights */}
            <div className="glass-effect rounded-2xl p-8 animate-fade-in-up">
              <h2 className="text-3xl font-bold mb-6 gradient-text">🎯 Career Insights</h2>
              <div className="space-y-4">
                {comprehensiveFeedback.careerInsights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${
                    insight.impact === 'high' ? 'bg-red-500/10 border-red-500/30' :
                    insight.impact === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                    'bg-blue-500/10 border-blue-500/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`text-xl ${
                        insight.impact === 'high' ? 'text-red-400' :
                        insight.impact === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                      }`}>
                        {insight.impact === 'high' ? '🎯' : insight.impact === 'medium' ? '💡' : 'ℹ️'}
                      </div>
                      <div>
                        <p className="text-white font-medium">{insight.insight}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            insight.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                            insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {insight.impact} impact
                          </span>
                          {insight.actionable && (
                            <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                              Actionable
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-6">
          <Button
            onClick={() => {
              setMode('select');
              setQuestions([]);
              setUserAnswers([]);
              setQuizResults([]);
              setCurrentQuestionIndex(0);
              setTimeElapsed(0);
              setSkillAnalysis(null);
              setUploadedResume(null);
              setComprehensiveFeedback(null);
            }}
            onMouseDown={(e) => {
              const ripple = document.createElement('span');
              const rect = e.currentTarget.getBoundingClientRect();
              const size = Math.max(rect.width, rect.height);
              const x = e.clientX - rect.left - size / 2;
              const y = e.clientY - rect.top - size / 2;
              ripple.style.width = ripple.style.height = `${size}px`;
              ripple.style.left = `${x}px`;
              ripple.style.top = `${y}px`;
              ripple.classList.add('ripple-effect', 'ripple-purple');
              e.currentTarget.appendChild(ripple);
              setTimeout(() => ripple.remove(), 600);
            }}
            className="btn-neon text-white px-8 py-6 text-lg rounded-xl ripple-container"
            size="lg"
          >
            <Sparkles className="mr-3 h-6 w-6" />
            {t.takeAnotherQuiz}
          </Button>
        </div>
      </div>
      </>
    );
  }

  return null;
};

export default EnhancedQuizPage;
