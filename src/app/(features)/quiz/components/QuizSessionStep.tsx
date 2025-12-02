"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Lightbulb,
  AlertTriangle,
  Timer,
  Zap,
  Flag,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
}

interface QuizSessionStepProps {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: (number | null)[];
  timePerQuestion: number;
  onAnswer: (questionIndex: number, answerIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFinish: () => void;
  onFlagQuestion: (questionIndex: number) => void;
  flaggedQuestions: number[];
  showExplanation: boolean;
  language: 'vi' | 'en' | 'ja' | 'zh' | 'ko';
}

const translations = {
  vi: {
    question: "Câu hỏi",
    of: "của",
    timeLeft: "Thời gian còn lại",
    previous: "Trước",
    next: "Tiếp",
    finish: "Hoàn thành",
    correct: "Chính xác!",
    incorrect: "Chưa đúng",
    explanation: "Giải thích",
    flagQuestion: "Đánh dấu",
    unflagQuestion: "Bỏ đánh dấu",
    flagged: "Đã đánh dấu",
    hint: "Gợi ý",
    easy: "Dễ",
    medium: "Trung bình",
    hard: "Khó",
    answered: "Đã trả lời",
    notAnswered: "Chưa trả lời",
    reviewLater: "Xem lại sau",
    skipToQuestion: "Chuyển đến câu",
    confirmFinish: "Bạn có chắc muốn hoàn thành?",
    unansweredWarning: "câu chưa trả lời"
  },
  en: {
    question: "Question",
    of: "of",
    timeLeft: "Time left",
    previous: "Previous",
    next: "Next",
    finish: "Finish",
    correct: "Correct!",
    incorrect: "Incorrect",
    explanation: "Explanation",
    flagQuestion: "Flag",
    unflagQuestion: "Unflag",
    flagged: "Flagged",
    hint: "Hint",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    answered: "Answered",
    notAnswered: "Not answered",
    reviewLater: "Review later",
    skipToQuestion: "Skip to question",
    confirmFinish: "Are you sure you want to finish?",
    unansweredWarning: "unanswered questions"
  },
  ja: {
    question: "質問",
    of: "の",
    timeLeft: "残り時間",
    previous: "前へ",
    next: "次へ",
    finish: "完了",
    correct: "正解！",
    incorrect: "不正解",
    explanation: "説明",
    flagQuestion: "フラグ",
    unflagQuestion: "フラグ解除",
    flagged: "フラグ付き",
    hint: "ヒント",
    easy: "簡単",
    medium: "中級",
    hard: "難しい",
    answered: "回答済み",
    notAnswered: "未回答",
    reviewLater: "後で確認",
    skipToQuestion: "質問にスキップ",
    confirmFinish: "完了してもよろしいですか？",
    unansweredWarning: "未回答の質問"
  },
  zh: {
    question: "问题",
    of: "共",
    timeLeft: "剩余时间",
    previous: "上一题",
    next: "下一题",
    finish: "完成",
    correct: "正确！",
    incorrect: "错误",
    explanation: "解释",
    flagQuestion: "标记",
    unflagQuestion: "取消标记",
    flagged: "已标记",
    hint: "提示",
    easy: "简单",
    medium: "中等",
    hard: "困难",
    answered: "已回答",
    notAnswered: "未回答",
    reviewLater: "稍后复习",
    skipToQuestion: "跳转到问题",
    confirmFinish: "确定要完成吗？",
    unansweredWarning: "个未回答的问题"
  },
  ko: {
    question: "질문",
    of: "중",
    timeLeft: "남은 시간",
    previous: "이전",
    next: "다음",
    finish: "완료",
    correct: "정답!",
    incorrect: "오답",
    explanation: "설명",
    flagQuestion: "플래그",
    unflagQuestion: "플래그 해제",
    flagged: "플래그됨",
    hint: "힌트",
    easy: "쉬움",
    medium: "보통",
    hard: "어려움",
    answered: "답변 완료",
    notAnswered: "미답변",
    reviewLater: "나중에 검토",
    skipToQuestion: "질문으로 이동",
    confirmFinish: "완료하시겠습니까?",
    unansweredWarning: "개의 미답변 질문"
  }
};

const difficultyColors = {
  easy: "text-green-400 bg-green-500/10",
  medium: "text-yellow-400 bg-yellow-500/10",
  hard: "text-red-400 bg-red-500/10"
};

export default function QuizSessionStep({
  questions,
  currentQuestionIndex,
  answers,
  timePerQuestion,
  onAnswer,
  onNext,
  onPrevious,
  onFinish,
  onFlagQuestion,
  flaggedQuestions,
  showExplanation,
  language
}: QuizSessionStepProps) {
  const t = translations[language];
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [showQuestionNav, setShowQuestionNav] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const isCurrentFlagged = flaggedQuestions.includes(currentQuestionIndex);
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const unansweredCount = answers.filter(a => a === null).length;

  // Timer effect
  useEffect(() => {
    setTimeLeft(timePerQuestion);
    setShowHint(false);
    setSelectedAnswer(currentAnswer);
    setIsAnswerLocked(currentAnswer !== null);
  }, [currentQuestionIndex, timePerQuestion, currentAnswer]);

  useEffect(() => {
    if (timeLeft <= 0 || isAnswerLocked) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Auto-move to next question or finish
          if (!isLastQuestion) {
            onNext();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswerLocked, isLastQuestion, onNext]);

  // Handle answer selection
  const handleAnswer = useCallback((answerIndex: number) => {
    if (isAnswerLocked) return;
    setSelectedAnswer(answerIndex);
    setIsAnswerLocked(true);
    onAnswer(currentQuestionIndex, answerIndex);
  }, [currentQuestionIndex, isAnswerLocked, onAnswer]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Time warning color
  const timeColor = useMemo(() => {
    if (timeLeft <= 10) return "text-red-400";
    if (timeLeft <= 30) return "text-yellow-400";
    return "text-green-400";
  }, [timeLeft]);

  const getDifficultyLabel = (difficulty?: string) => {
    if (!difficulty) return null;
    return t[difficulty as keyof typeof t] || difficulty;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Top Bar: Progress + Timer */}
      <div className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
        {/* Question Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{currentQuestionIndex + 1}</span>
            <span className="text-gray-400">{t.of}</span>
            <span className="text-2xl font-bold text-gray-400">{questions.length}</span>
          </div>
          
          {/* Difficulty Badge */}
          {currentQuestion?.difficulty && (
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              difficultyColors[currentQuestion.difficulty]
            )}>
              {getDifficultyLabel(currentQuestion.difficulty)}
            </span>
          )}

          {/* Category Badge */}
          {currentQuestion?.category && (
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium">
              {currentQuestion.category}
            </span>
          )}
        </div>

        {/* Timer */}
        <motion.div
          animate={{ scale: timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
          transition={{ repeat: timeLeft <= 10 ? Infinity : 0, duration: 0.5 }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold",
            timeLeft <= 10 
              ? "bg-red-500/20 border border-red-500/50" 
              : "bg-gray-700/50"
          )}
        >
          {timeLeft <= 10 ? (
            <Timer className={cn("w-5 h-5", timeColor)} />
          ) : (
            <Clock className={cn("w-5 h-5", timeColor)} />
          )}
          <span className={timeColor}>{formatTime(timeLeft)}</span>
        </motion.div>

        {/* Quick Nav Toggle */}
        <button
          onClick={() => setShowQuestionNav(!showQuestionNav)}
          className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
        >
          <HelpCircle className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Quick Navigation */}
      <AnimatePresence>
        {showQuestionNav && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 overflow-hidden"
          >
            <p className="text-sm text-gray-400 mb-3">{t.skipToQuestion}:</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Navigate to question
                    if (index !== currentQuestionIndex) {
                      // This would require a callback to parent
                    }
                  }}
                  className={cn(
                    "w-10 h-10 rounded-lg font-medium transition-all duration-200",
                    index === currentQuestionIndex
                      ? "bg-purple-500 text-white"
                      : answers[index] !== null
                        ? "bg-green-500/20 text-green-400 border border-green-500/50"
                        : flaggedQuestions.includes(index)
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                          : "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50"
                  )}
                >
                  {index + 1}
                  {flaggedQuestions.includes(index) && (
                    <Flag className="w-2 h-2 absolute top-0 right-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Card */}
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 mb-6"
      >
        {/* Question Text */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white leading-relaxed">
            {currentQuestion?.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion?.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showResult = showExplanation && isAnswerLocked;

            return (
              <motion.button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isAnswerLocked}
                className={cn(
                  "w-full p-4 rounded-xl text-left transition-all duration-300 border",
                  !isAnswerLocked && "hover:bg-purple-500/10 hover:border-purple-500/50",
                  isSelected && !showResult && "bg-purple-500/20 border-purple-500/50",
                  showResult && isCorrect && "bg-green-500/20 border-green-500/50",
                  showResult && isSelected && !isCorrect && "bg-red-500/20 border-red-500/50",
                  !isSelected && !showResult && "bg-gray-700/30 border-gray-700/50"
                )}
                whileHover={!isAnswerLocked ? { scale: 1.01 } : {}}
                whileTap={!isAnswerLocked ? { scale: 0.99 } : {}}
              >
                <div className="flex items-center gap-4">
                  {/* Option Letter */}
                  <span className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                    showResult && isCorrect 
                      ? "bg-green-500 text-white"
                      : showResult && isSelected && !isCorrect
                        ? "bg-red-500 text-white"
                        : isSelected
                          ? "bg-purple-500 text-white"
                          : "bg-gray-600 text-gray-300"
                  )}>
                    {String.fromCharCode(65 + index)}
                  </span>

                  {/* Option Text */}
                  <span className="flex-1 text-gray-200">{option}</span>

                  {/* Result Icon */}
                  {showResult && (
                    <div>
                      {isCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && isAnswerLocked && currentQuestion?.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30"
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-400 mb-1">{t.explanation}</p>
                  <p className="text-gray-300">{currentQuestion.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Banner */}
        <AnimatePresence>
          {showExplanation && isAnswerLocked && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "mt-4 p-3 rounded-xl flex items-center gap-3",
                selectedAnswer === currentQuestion?.correctAnswer
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              )}
            >
              {selectedAnswer === currentQuestion?.correctAnswer ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">{t.correct}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">{t.incorrect}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between">
        {/* Left: Flag Button */}
        <button
          onClick={() => onFlagQuestion(currentQuestionIndex)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
            isCurrentFlagged
              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
              : "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50"
          )}
        >
          <Flag className="w-4 h-4" />
          <span className="text-sm">{isCurrentFlagged ? t.flagged : t.flagQuestion}</span>
        </button>

        {/* Right: Navigation */}
        <div className="flex items-center gap-3">
          {currentQuestionIndex > 0 && (
            <button
              onClick={onPrevious}
              className="px-4 py-2 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition-colors"
            >
              {t.previous}
            </button>
          )}

          {isLastQuestion ? (
            <button
              onClick={onFinish}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/20"
            >
              <span>{t.finish}</span>
              <Zap className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg shadow-purple-500/20"
            >
              <span>{t.next}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Unanswered Warning */}
      {unansweredCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-400 text-sm">
            {unansweredCount} {t.unansweredWarning}
          </span>
        </motion.div>
      )}
    </div>
  );
}
