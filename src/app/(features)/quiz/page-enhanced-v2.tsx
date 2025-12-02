"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  Upload, 
  Briefcase, 
  Trophy, 
  BarChart3,
  Target,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Animated3DBackground from "@/components/ui/Animated3DBackground";
import { LanguageSelector, Language } from "@/components/ui/language-selector";

// Import step components
import CVUploadStep from "./components/CVUploadStep";
import FieldSelectionStep from "./components/FieldSelectionStep";
import LevelSelectionStep from "./components/LevelSelectionStep";
import DifficultySelectionStep from "./components/DifficultySelectionStep";
import QuestionCountStep from "./components/QuestionCountStep";
import QuizProgressBar from "./components/QuizProgressBar";
import QuizSessionStep from "./components/QuizSessionStep";
import EnhancedFeedbackStep from "./components/EnhancedFeedbackStep";

// Import types and data
import { 
  QuizSession, 
  CareerField, 
  DifficultyLevel, 
  ExperienceLevel,
  EnhancedQuizFeedback,
  DIFFICULTY_CONFIGS
} from "./types/quiz.types";
import { CAREER_FIELDS } from "./data/careerFields";
import { analyzeCV, CVAnalysisResult, FieldMatchResult } from "./services/cvMatchService";
import { extractTextFromFile } from "./services/resumeAnalysisService";
import { generateQuestionsWithAI } from "./services/questionService";
import { generateComprehensiveFeedback } from "./services/feedbackService";

// Step definitions
type QuizStep = 'upload' | 'field' | 'level' | 'difficulty' | 'count' | 'quiz' | 'result';

const STEP_ORDER: QuizStep[] = ['upload', 'field', 'level', 'difficulty', 'count', 'quiz', 'result'];

const translations = {
  vi: {
    title: "Quiz Đánh Giá Kỹ Năng",
    subtitle: "Hệ thống đánh giá thông minh dựa trên CV và ngành nghề của bạn",
    back: "Quay lại",
    next: "Tiếp tục",
    start: "Bắt đầu Quiz",
    skip: "Bỏ qua",
    stepUpload: "Tải CV",
    stepField: "Ngành nghề",
    stepLevel: "Cấp bậc",
    stepDifficulty: "Độ khó",
    stepCount: "Số câu hỏi",
    stepQuiz: "Làm Quiz",
    stepResult: "Kết quả",
    noCV: "Không có CV",
    continueWithoutCV: "Tiếp tục không cần CV",
    generatingQuestions: "Đang tạo câu hỏi...",
    generatingQuestionsDesc: "AI đang tạo câu hỏi phù hợp với bạn",
    error: "Có lỗi xảy ra",
    tryAgain: "Thử lại"
  },
  en: {
    title: "Skill Assessment Quiz",
    subtitle: "Smart assessment system based on your CV and career field",
    back: "Back",
    next: "Continue",
    start: "Start Quiz",
    skip: "Skip",
    stepUpload: "Upload CV",
    stepField: "Field",
    stepLevel: "Level",
    stepDifficulty: "Difficulty",
    stepCount: "Questions",
    stepQuiz: "Quiz",
    stepResult: "Results",
    noCV: "No CV",
    continueWithoutCV: "Continue without CV",
    generatingQuestions: "Generating questions...",
    generatingQuestionsDesc: "AI is creating questions tailored for you",
    error: "An error occurred",
    tryAgain: "Try again"
  },
  ja: {
    title: "スキル評価クイズ",
    subtitle: "CVとキャリア分野に基づくスマート評価システム",
    back: "戻る",
    next: "続ける",
    start: "クイズを開始",
    skip: "スキップ",
    stepUpload: "CVアップロード",
    stepField: "分野",
    stepLevel: "レベル",
    stepDifficulty: "難易度",
    stepCount: "問題数",
    stepQuiz: "クイズ",
    stepResult: "結果",
    noCV: "CVなし",
    continueWithoutCV: "CVなしで続ける",
    generatingQuestions: "質問を生成中...",
    generatingQuestionsDesc: "AIがあなたに合わせた質問を作成中",
    error: "エラーが発生しました",
    tryAgain: "再試行"
  },
  zh: {
    title: "技能评估测验",
    subtitle: "基于您的简历和职业领域的智能评估系统",
    back: "返回",
    next: "继续",
    start: "开始测验",
    skip: "跳过",
    stepUpload: "上传简历",
    stepField: "领域",
    stepLevel: "等级",
    stepDifficulty: "难度",
    stepCount: "题目数",
    stepQuiz: "测验",
    stepResult: "结果",
    noCV: "无简历",
    continueWithoutCV: "不使用简历继续",
    generatingQuestions: "正在生成问题...",
    generatingQuestionsDesc: "AI正在为您创建量身定制的问题",
    error: "发生错误",
    tryAgain: "重试"
  },
  ko: {
    title: "스킬 평가 퀴즈",
    subtitle: "이력서와 커리어 분야를 기반으로 한 스마트 평가 시스템",
    back: "뒤로",
    next: "계속",
    start: "퀴즈 시작",
    skip: "건너뛰기",
    stepUpload: "이력서 업로드",
    stepField: "분야",
    stepLevel: "레벨",
    stepDifficulty: "난이도",
    stepCount: "문제 수",
    stepQuiz: "퀴즈",
    stepResult: "결과",
    noCV: "이력서 없음",
    continueWithoutCV: "이력서 없이 계속",
    generatingQuestions: "문제 생성 중...",
    generatingQuestionsDesc: "AI가 맞춤형 문제를 만들고 있습니다",
    error: "오류가 발생했습니다",
    tryAgain: "다시 시도"
  }
};

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
}

export default function EnhancedQuizPage() {
  const [language, setLanguage] = useState<Language>('vi');
  const t = translations[language];

  // Session state
  const [currentStep, setCurrentStep] = useState<QuizStep>('upload');
  const [cvFile, setCVFile] = useState<File | null>(null);
  const [cvAnalysis, setCVAnalysis] = useState<CVAnalysisResult | null>(null);
  const [selectedField, setSelectedField] = useState<CareerField | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [feedback, setFeedback] = useState<EnhancedQuizFeedback | null>(null);

  // Step labels for progress bar
  const stepLabels = [
    { id: 'upload', label: t.stepUpload, icon: <Upload className="w-4 h-4" /> },
    { id: 'field', label: t.stepField, icon: <Briefcase className="w-4 h-4" /> },
    { id: 'level', label: t.stepLevel, icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'difficulty', label: t.stepDifficulty, icon: <Target className="w-4 h-4" /> },
    { id: 'count', label: t.stepCount, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'quiz', label: t.stepQuiz, icon: <Play className="w-4 h-4" /> },
    { id: 'result', label: t.stepResult, icon: <Trophy className="w-4 h-4" /> }
  ];

  const currentStepIndex = STEP_ORDER.indexOf(currentStep);

  // Handle CV upload
  const handleCVUpload = useCallback(async (file: File, analysis: CVAnalysisResult | null) => {
    setCVFile(file);
    if (analysis) {
      setCVAnalysis(analysis);
      // Auto-suggest level based on CV analysis
      if (analysis.suggestedLevel) {
        setSelectedLevel(analysis.suggestedLevel);
      }
    }
  }, []);

  // Navigate to next step
  const goToNextStep = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEP_ORDER.length) {
      setCurrentStep(STEP_ORDER[nextIndex]);
    }
  }, [currentStepIndex]);

  // Navigate to previous step
  const goToPreviousStep = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEP_ORDER[prevIndex]);
    }
  }, [currentStepIndex]);

  // Check if current step is complete
  const isStepComplete = useCallback((): boolean => {
    switch (currentStep) {
      case 'upload':
        return true; // CV is optional
      case 'field':
        return selectedField !== null;
      case 'level':
        return selectedLevel !== null;
      case 'difficulty':
        return selectedDifficulty !== null;
      case 'count':
        return questionCount >= 5;
      default:
        return true;
    }
  }, [currentStep, selectedField, selectedLevel, selectedDifficulty, questionCount]);

  // Generate questions and start quiz
  const startQuiz = useCallback(async () => {
    if (!selectedField || !selectedLevel || !selectedDifficulty) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Get difficulty config
      const diffConfig = DIFFICULTY_CONFIGS.find(d => d.level === selectedDifficulty);
      
      // Map experience level to quiz level
      const levelMap: Record<ExperienceLevel, 'low' | 'mid' | 'high'> = {
        'intern': 'low',
        'fresher': 'low',
        'junior': 'low',
        'mid': 'mid',
        'senior': 'high',
        'lead': 'high',
        'expert': 'high'
      };
      const quizLevel = levelMap[selectedLevel] || 'mid';
      
      // Generate questions using AI
      const generatedQuestions = await generateQuestionsWithAI(
        [...selectedField.requiredSkills, ...selectedField.niceToHaveSkills],
        quizLevel,
        questionCount,
        language
      );

      // Format questions for quiz session
      const formattedQuestions: QuizQuestion[] = generatedQuestions.map((q: QuizQuestion, i: number) => ({
        id: `q-${i}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty || 'medium',
        category: selectedField.name
      }));

      setQuestions(formattedQuestions);
      setAnswers(new Array(formattedQuestions.length).fill(null));
      setFlaggedQuestions([]);
      setCurrentQuestionIndex(0);
      setQuizStartTime(Date.now());
      setCurrentStep('quiz');
    } catch (err) {
      console.error('Error generating questions:', err);
      setError(t.error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedField, selectedLevel, selectedDifficulty, questionCount, language, t.error]);

  // Handle answer selection
  const handleAnswer = useCallback((questionIndex: number, answerIndex: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answerIndex;
      return newAnswers;
    });
  }, []);

  // Handle flag question
  const handleFlagQuestion = useCallback((questionIndex: number) => {
    setFlaggedQuestions(prev => {
      if (prev.includes(questionIndex)) {
        return prev.filter(i => i !== questionIndex);
      }
      return [...prev, questionIndex];
    });
  }, []);

  // Navigate questions
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  // Finish quiz and generate feedback
  const finishQuiz = useCallback(async () => {
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
    
    // Calculate results
    let correctCount = 0;
    const skillScores: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) correctCount++;

      const category = q.category || 'General';
      if (!skillScores[category]) {
        skillScores[category] = { correct: 0, total: 0 };
      }
      skillScores[category].total++;
      if (isCorrect) skillScores[category].correct++;
    });

    const overallScore = Math.round((correctCount / questions.length) * 100);

    // Generate comprehensive feedback
    const feedbackData: EnhancedQuizFeedback = {
      overallScore,
      correctAnswers: correctCount,
      totalQuestions: questions.length,
      timeTaken,
      skillPerformance: Object.entries(skillScores).map(([skillName, data]) => ({
        skillName,
        score: Math.round((data.correct / data.total) * 100),
        questionsAttempted: data.total,
        correctAnswers: data.correct
      })),
      recommendations: generateRecommendations(overallScore, skillScores),
      studyPlan: generateStudyPlan(overallScore, skillScores),
      careerInsights: generateCareerInsights(selectedField, overallScore)
    };

    setFeedback(feedbackData);
    setCurrentStep('result');
  }, [questions, answers, quizStartTime, selectedField]);

  // Helper functions for feedback generation
  const generateRecommendations = (score: number, skillScores: Record<string, { correct: number; total: number }>) => {
    const recommendations = [];
    
    // Find weak areas
    const weakSkills = Object.entries(skillScores)
      .filter(([_, data]) => (data.correct / data.total) < 0.7)
      .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total));

    weakSkills.forEach(([skill, _], index) => {
      recommendations.push({
        title: `Improve ${skill}`,
        description: `Focus on strengthening your ${skill} knowledge through practice and study.`,
        priority: index === 0 ? 'high' as const : index === 1 ? 'medium' as const : 'low' as const,
        resources: [`${skill} Documentation`, `${skill} Practice Exercises`, `${skill} Online Course`]
      });
    });

    if (score < 50) {
      recommendations.unshift({
        title: 'Focus on Fundamentals',
        description: 'Review basic concepts before moving to advanced topics.',
        priority: 'high' as const,
        resources: ['Beginner Tutorials', 'Fundamentals Course', 'Practice Problems']
      });
    }

    return recommendations.slice(0, 5);
  };

  const generateStudyPlan = (score: number, skillScores: Record<string, { correct: number; total: number }>) => {
    const weeklyPlan = [];
    const weakSkills = Object.entries(skillScores)
      .filter(([_, data]) => (data.correct / data.total) < 0.7)
      .map(([skill]) => skill);

    const weeksNeeded = Math.max(2, Math.ceil(weakSkills.length / 2));

    for (let i = 0; i < weeksNeeded; i++) {
      const skillsForWeek = weakSkills.slice(i * 2, (i + 1) * 2);
      if (skillsForWeek.length === 0) break;

      weeklyPlan.push({
        week: i + 1,
        focus: skillsForWeek.join(' & '),
        topics: skillsForWeek.flatMap(skill => [
          `${skill} basics review`,
          `${skill} practice exercises`,
          `${skill} real-world examples`
        ]),
        hoursPerDay: score < 50 ? 2 : 1.5
      });
    }

    return {
      duration: `${weeksNeeded} weeks`,
      weeklyPlan
    };
  };

  const generateCareerInsights = (field: CareerField | null, score: number) => {
    if (!field) return null;

    // Format salary range as string
    const formatSalary = (salary: typeof field.avgSalary): string => {
      const formatter = new Intl.NumberFormat('vi-VN');
      const min = formatter.format(salary.min / 1000000);
      const max = formatter.format(salary.max / 1000000);
      return `${min}M - ${max}M ${salary.currency}/${salary.period === 'monthly' ? 'tháng' : 'năm'}`;
    };

    return {
      marketDemand: field.demandLevel === 'high' ? 'Very High' : 
                    field.demandLevel === 'medium' ? 'Moderate' : 'Growing',
      salaryRange: formatSalary(field.avgSalary),
      growthPotential: score >= 70 ? 'Excellent' : score >= 50 ? 'Good' : 'Promising',
      nextSteps: [
        score >= 70 ? 'Apply for roles in your field' : 'Continue skill development',
        'Build portfolio projects',
        'Network with professionals',
        'Get relevant certifications'
      ]
    };
  };

  // Reset quiz
  const resetQuiz = useCallback(() => {
    setCurrentStep('upload');
    setCVFile(null);
    setCVAnalysis(null);
    setSelectedField(null);
    setSelectedLevel(null);
    setSelectedDifficulty(null);
    setQuestionCount(20);
    setQuestions([]);
    setAnswers([]);
    setFlaggedQuestions([]);
    setFeedback(null);
  }, []);

  // Get time per question based on difficulty
  const getTimePerQuestion = useCallback(() => {
    const config = DIFFICULTY_CONFIGS.find(d => d.level === selectedDifficulty);
    return config?.timePerQuestion || 60;
  }, [selectedDifficulty]);

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <CVUploadStep
            onFileUpload={handleCVUpload}
            onSkip={goToNextStep}
            language={language}
          />
        );

      case 'field':
        return (
          <FieldSelectionStep
            fields={CAREER_FIELDS}
            cvAnalysis={cvAnalysis}
            selectedField={selectedField}
            onFieldSelect={(field) => setSelectedField(field)}
            language={language}
          />
        );

      case 'level':
        return (
          <LevelSelectionStep
            selectedLevel={selectedLevel}
            suggestedLevel={cvAnalysis?.suggestedLevel || null}
            onLevelSelect={(level) => setSelectedLevel(level)}
            language={language}
          />
        );

      case 'difficulty':
        return (
          <DifficultySelectionStep
            selectedDifficulty={selectedDifficulty}
            onDifficultySelect={(diff) => setSelectedDifficulty(diff)}
            language={language}
          />
        );

      case 'count':
        return (
          <QuestionCountStep
            questionCount={questionCount}
            onQuestionCountChange={setQuestionCount}
            minQuestions={5}
            maxQuestions={50}
            recommendedCount={20}
            estimatedTime={Math.round(questionCount * 1.5)}
            language={language}
          />
        );

      case 'quiz':
        return (
          <QuizSessionStep
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            timePerQuestion={getTimePerQuestion()}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
            onFinish={finishQuiz}
            onFlagQuestion={handleFlagQuestion}
            flaggedQuestions={flaggedQuestions}
            showExplanation={true}
            language={language}
          />
        );

      case 'result':
        return feedback && (
          <EnhancedFeedbackStep
            feedback={feedback}
            selectedField={selectedField}
            onRetakeQuiz={resetQuiz}
            onTryAnotherField={() => {
              setSelectedField(null);
              setCurrentStep('field');
            }}
            onDownloadReport={() => {
              // TODO: Implement PDF download
              console.log('Download report');
            }}
            onShareResults={() => {
              // TODO: Implement share functionality
              console.log('Share results');
            }}
            language={language}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <Animated3DBackground />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-4 sm:p-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                {t.title}
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">{t.subtitle}</p>
            </div>

            {/* Language Selector */}
            <LanguageSelector
              value={language}
              onChange={setLanguage}
            />
          </div>
        </div>

        {/* Progress Bar - only show for setup steps */}
        {currentStep !== 'quiz' && currentStep !== 'result' && (
          <div className="flex-shrink-0 px-4 sm:px-6 pb-4">
            <QuizProgressBar
              steps={stepLabels.slice(0, 5)}
              currentStep={STEP_ORDER.slice(0, 5).indexOf(currentStep)}
              language={language}
            />
          </div>
        )}

        {/* Step Content */}
        <div className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Loading State */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            >
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4 mx-auto" />
                <p className="text-xl font-semibold text-white">{t.generatingQuestions}</p>
                <p className="text-gray-400 mt-2">{t.generatingQuestionsDesc}</p>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-20 left-1/2 -translate-x-1/2 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400"
            >
              <p>{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm underline"
              >
                {t.tryAgain}
              </button>
            </motion.div>
          )}
        </div>

        {/* Bottom Navigation - only for setup steps */}
        {currentStep !== 'quiz' && currentStep !== 'result' && (
          <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={goToPreviousStep}
                disabled={currentStepIndex === 0}
                className={currentStepIndex === 0 ? 'invisible' : ''}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>

              {/* Next/Start Button */}
              {currentStep === 'count' ? (
                <Button
                  onClick={startQuiz}
                  disabled={!isStepComplete() || isProcessing}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {t.start}
                </Button>
              ) : (
                <Button
                  onClick={goToNextStep}
                  disabled={!isStepComplete()}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {t.next}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
