"use client";

import { motion } from "framer-motion";
import { 
  Hash,
  Plus,
  Minus,
  Clock,
  Target,
  HelpCircle,
  Sparkles,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionCountStepProps {
  questionCount: number;
  onQuestionCountChange: (count: number) => void;
  minQuestions: number;
  maxQuestions: number;
  recommendedCount: number;
  estimatedTime: number; // in minutes
  language: 'vi' | 'en' | 'ja' | 'zh' | 'ko';
}

const translations = {
  vi: {
    title: "Số lượng câu hỏi",
    subtitle: "Chọn số lượng câu hỏi phù hợp với thời gian của bạn",
    questions: "câu hỏi",
    estimatedTime: "Thời gian dự kiến",
    minutes: "phút",
    recommended: "Được khuyến nghị",
    quickQuiz: "Quiz nhanh",
    standardQuiz: "Quiz tiêu chuẩn",
    comprehensiveQuiz: "Quiz toàn diện",
    quickQuizDesc: "Kiểm tra nhanh kiến thức cơ bản",
    standardQuizDesc: "Đánh giá cân bằng và chi tiết",
    comprehensiveQuizDesc: "Đánh giá toàn diện mọi khía cạnh",
    customCount: "Tùy chỉnh",
    tip: "Mẹo: Quiz dài hơn cho kết quả đánh giá chính xác hơn"
  },
  en: {
    title: "Number of Questions",
    subtitle: "Choose the number of questions that fits your schedule",
    questions: "questions",
    estimatedTime: "Estimated time",
    minutes: "minutes",
    recommended: "Recommended",
    quickQuiz: "Quick Quiz",
    standardQuiz: "Standard Quiz",
    comprehensiveQuiz: "Comprehensive Quiz",
    quickQuizDesc: "Quick test of basic knowledge",
    standardQuizDesc: "Balanced and detailed assessment",
    comprehensiveQuizDesc: "Thorough evaluation of all aspects",
    customCount: "Custom",
    tip: "Tip: Longer quizzes provide more accurate assessments"
  },
  ja: {
    title: "質問数",
    subtitle: "時間に合った質問数を選択してください",
    questions: "問",
    estimatedTime: "推定時間",
    minutes: "分",
    recommended: "おすすめ",
    quickQuiz: "クイッククイズ",
    standardQuiz: "スタンダードクイズ",
    comprehensiveQuiz: "総合クイズ",
    quickQuizDesc: "基礎知識の素早いテスト",
    standardQuizDesc: "バランスの取れた詳細な評価",
    comprehensiveQuizDesc: "すべての側面の徹底的な評価",
    customCount: "カスタム",
    tip: "ヒント: より長いクイズはより正確な評価を提供します"
  },
  zh: {
    title: "问题数量",
    subtitle: "选择适合您时间的问题数量",
    questions: "题",
    estimatedTime: "预计时间",
    minutes: "分钟",
    recommended: "推荐",
    quickQuiz: "快速测验",
    standardQuiz: "标准测验",
    comprehensiveQuiz: "综合测验",
    quickQuizDesc: "基础知识快速测试",
    standardQuizDesc: "平衡且详细的评估",
    comprehensiveQuizDesc: "全面评估各个方面",
    customCount: "自定义",
    tip: "提示：较长的测验提供更准确的评估"
  },
  ko: {
    title: "질문 수",
    subtitle: "시간에 맞는 질문 수를 선택하세요",
    questions: "문제",
    estimatedTime: "예상 시간",
    minutes: "분",
    recommended: "추천",
    quickQuiz: "빠른 퀴즈",
    standardQuiz: "표준 퀴즈",
    comprehensiveQuiz: "종합 퀴즈",
    quickQuizDesc: "기본 지식 빠른 테스트",
    standardQuizDesc: "균형 잡힌 상세 평가",
    comprehensiveQuizDesc: "모든 측면의 철저한 평가",
    customCount: "사용자 정의",
    tip: "팁: 더 긴 퀴즈가 더 정확한 평가를 제공합니다"
  }
};

const presetOptions = [
  { count: 10, key: 'quickQuiz' },
  { count: 20, key: 'standardQuiz' },
  { count: 30, key: 'comprehensiveQuiz' }
];

export default function QuestionCountStep({
  questionCount,
  onQuestionCountChange,
  minQuestions,
  maxQuestions,
  recommendedCount,
  estimatedTime,
  language
}: QuestionCountStepProps) {
  const t = translations[language];

  const handleIncrement = () => {
    if (questionCount < maxQuestions) {
      onQuestionCountChange(questionCount + 5);
    }
  };

  const handleDecrement = () => {
    if (questionCount > minQuestions) {
      onQuestionCountChange(questionCount - 5);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
          <Hash className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t.title}</h2>
        <p className="text-gray-400 max-w-lg mx-auto">{t.subtitle}</p>
      </motion.div>

      {/* Preset Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {presetOptions.map((option, index) => {
          const isSelected = questionCount === option.count;
          const isRecommended = option.count === recommendedCount;
          const descKey = `${option.key}Desc` as keyof typeof t;

          return (
            <motion.button
              key={option.count}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onQuestionCountChange(option.count)}
              className={cn(
                "relative p-6 rounded-2xl border transition-all duration-300",
                isSelected
                  ? "bg-purple-500/20 border-purple-500/50 ring-2 ring-purple-500"
                  : "bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Recommended Badge */}
              {isRecommended && (
                <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-xs font-bold text-white shadow-lg">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  {t.recommended}
                </div>
              )}

              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{option.count}</div>
                <div className="text-gray-400 text-sm mb-3">{t.questions}</div>
                <div className="text-lg font-medium text-purple-400 mb-1">
                  {t[option.key as keyof typeof t]}
                </div>
                <div className="text-gray-500 text-xs">
                  {t[descKey]}
                </div>
                
                {/* Estimated Time */}
                <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
                  <Timer className="w-4 h-4" />
                  <span className="text-sm">~{Math.round(option.count * 1.5)} {t.minutes}</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom Counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50"
      >
        <h3 className="text-lg font-medium text-white mb-4 text-center">{t.customCount}</h3>
        
        <div className="flex items-center justify-center gap-6">
          {/* Decrement Button */}
          <button
            onClick={handleDecrement}
            disabled={questionCount <= minQuestions}
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
              questionCount <= minQuestions
                ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-gray-600 active:scale-95"
            )}
          >
            <Minus className="w-6 h-6" />
          </button>

          {/* Counter Display */}
          <div className="text-center">
            <div className="relative">
              <motion.div
                key={questionCount}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl font-bold text-white"
              >
                {questionCount}
              </motion.div>
              <div className="text-gray-400 text-sm mt-1">{t.questions}</div>
            </div>
          </div>

          {/* Increment Button */}
          <button
            onClick={handleIncrement}
            disabled={questionCount >= maxQuestions}
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
              questionCount >= maxQuestions
                ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-gray-600 active:scale-95"
            )}
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>{minQuestions}</span>
            <span>{maxQuestions}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((questionCount - minQuestions) / (maxQuestions - minQuestions)) * 100}%` 
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Estimated Time */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-700/50">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300">
              {t.estimatedTime}: <span className="text-white font-bold">{estimatedTime}</span> {t.minutes}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm"
      >
        <HelpCircle className="w-4 h-4" />
        <span>{t.tip}</span>
      </motion.div>
    </div>
  );
}
