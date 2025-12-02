"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  BarChart2, 
  Flame, 
  Shuffle, 
  Brain,
  CheckCircle2,
  Target,
  Clock
} from "lucide-react";
import { DifficultyLevel, DIFFICULTY_CONFIGS } from "../types/quiz.types";
import { cn } from "@/lib/utils";

interface DifficultySelectionStepProps {
  selectedDifficulty: DifficultyLevel | null;
  onDifficultySelect: (difficulty: DifficultyLevel) => void;
  language: 'vi' | 'en' | 'ja' | 'zh' | 'ko';
}

const translations = {
  vi: {
    title: "Chọn độ khó",
    subtitle: "Lựa chọn mức độ khó phù hợp với mục tiêu của bạn",
    easy: "Dễ",
    easyDesc: "Tập trung vào kiến thức cơ bản và nền tảng. Phù hợp để ôn tập.",
    medium: "Trung bình",
    mediumDesc: "Kết hợp kiến thức cơ bản và ứng dụng thực tế. Cân bằng giữa lý thuyết và thực hành.",
    hard: "Khó",
    hardDesc: "Câu hỏi nâng cao, edge cases và kiến thức chuyên gia. Thử thách bản thân!",
    mixed: "Hỗn hợp",
    mixedDesc: "Đa dạng mức độ khó để đánh giá toàn diện năng lực của bạn.",
    adaptive: "Thích ứng",
    adaptiveDesc: "AI tự động điều chỉnh độ khó dựa trên kết quả trả lời của bạn.",
    questionDistribution: "Phân bổ câu hỏi",
    easyQuestions: "Dễ",
    mediumQuestions: "Trung bình",
    hardQuestions: "Khó",
    timePerQuestion: "Thời gian/câu",
    passingScore: "Điểm đạt",
    selected: "Đã chọn"
  },
  en: {
    title: "Select Difficulty",
    subtitle: "Choose the difficulty level that matches your goals",
    easy: "Easy",
    easyDesc: "Focus on fundamentals and basics. Great for review.",
    medium: "Medium",
    mediumDesc: "Mix of basics and practical applications. Balance of theory and practice.",
    hard: "Hard",
    hardDesc: "Advanced questions, edge cases, and expert knowledge. Challenge yourself!",
    mixed: "Mixed",
    mixedDesc: "Variety of difficulty levels for comprehensive assessment.",
    adaptive: "Adaptive",
    adaptiveDesc: "AI adjusts difficulty based on your performance.",
    questionDistribution: "Question Distribution",
    easyQuestions: "Easy",
    mediumQuestions: "Medium",
    hardQuestions: "Hard",
    timePerQuestion: "Time/question",
    passingScore: "Passing score",
    selected: "Selected"
  },
  ja: {
    title: "難易度を選択",
    subtitle: "目標に合った難易度を選んでください",
    easy: "簡単",
    easyDesc: "基礎と基本に焦点。復習に最適。",
    medium: "中級",
    mediumDesc: "基礎と実践的な応用のミックス。理論と実践のバランス。",
    hard: "難しい",
    hardDesc: "高度な質問、エッジケース、専門知識。自分に挑戦！",
    mixed: "ミックス",
    mixedDesc: "包括的な評価のためのさまざまな難易度。",
    adaptive: "適応型",
    adaptiveDesc: "AIがあなたのパフォーマンスに基づいて難易度を調整。",
    questionDistribution: "質問の分布",
    easyQuestions: "簡単",
    mediumQuestions: "中級",
    hardQuestions: "難しい",
    timePerQuestion: "1問あたりの時間",
    passingScore: "合格点",
    selected: "選択済み"
  },
  zh: {
    title: "选择难度",
    subtitle: "选择适合您目标的难度级别",
    easy: "简单",
    easyDesc: "专注于基础知识。非常适合复习。",
    medium: "中等",
    mediumDesc: "基础和实际应用的结合。理论与实践的平衡。",
    hard: "困难",
    hardDesc: "高级问题、边缘情况和专家知识。挑战自己！",
    mixed: "混合",
    mixedDesc: "各种难度级别，进行全面评估。",
    adaptive: "自适应",
    adaptiveDesc: "AI根据您的表现调整难度。",
    questionDistribution: "问题分布",
    easyQuestions: "简单",
    mediumQuestions: "中等",
    hardQuestions: "困难",
    timePerQuestion: "每题时间",
    passingScore: "及格分数",
    selected: "已选择"
  },
  ko: {
    title: "난이도 선택",
    subtitle: "목표에 맞는 난이도를 선택하세요",
    easy: "쉬움",
    easyDesc: "기본 개념에 집중. 복습에 적합.",
    medium: "보통",
    mediumDesc: "기본과 실제 응용의 조합. 이론과 실습의 균형.",
    hard: "어려움",
    hardDesc: "고급 질문, 엣지 케이스, 전문 지식. 자신에게 도전!",
    mixed: "혼합",
    mixedDesc: "종합적인 평가를 위한 다양한 난이도.",
    adaptive: "적응형",
    adaptiveDesc: "AI가 성과에 따라 난이도를 조정.",
    questionDistribution: "문제 분포",
    easyQuestions: "쉬움",
    mediumQuestions: "보통",
    hardQuestions: "어려움",
    timePerQuestion: "문제당 시간",
    passingScore: "합격 점수",
    selected: "선택됨"
  }
};

const difficultyIcons: Record<DifficultyLevel, React.ReactNode> = {
  easy: <Zap className="w-7 h-7" />,
  medium: <BarChart2 className="w-7 h-7" />,
  hard: <Flame className="w-7 h-7" />,
  mixed: <Shuffle className="w-7 h-7" />,
  adaptive: <Brain className="w-7 h-7" />
};

const difficultyColors: Record<DifficultyLevel, string> = {
  easy: "from-green-500 to-emerald-500",
  medium: "from-yellow-500 to-orange-500",
  hard: "from-red-500 to-pink-500",
  mixed: "from-purple-500 to-indigo-500",
  adaptive: "from-blue-500 to-cyan-500"
};

const difficultyBgColors: Record<DifficultyLevel, string> = {
  easy: "bg-green-500/10 border-green-500/30 hover:bg-green-500/20",
  medium: "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20",
  hard: "bg-red-500/10 border-red-500/30 hover:bg-red-500/20",
  mixed: "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20",
  adaptive: "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20"
};

export default function DifficultySelectionStep({
  selectedDifficulty,
  onDifficultySelect,
  language
}: DifficultySelectionStepProps) {
  const t = translations[language];

  const getDifficultyName = (difficulty: DifficultyLevel): string => {
    return t[difficulty] || difficulty;
  };

  const getDifficultyDesc = (difficulty: DifficultyLevel): string => {
    return t[`${difficulty}Desc` as keyof typeof t] || '';
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t.title}</h2>
        <p className="text-gray-400 max-w-lg mx-auto">{t.subtitle}</p>
      </motion.div>

      {/* Difficulty Grid - First row: 3 main difficulties */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {['easy', 'medium', 'hard'].map((difficultyKey, index) => {
          const difficulty = difficultyKey as DifficultyLevel;
          const config = DIFFICULTY_CONFIGS.find(c => c.level === difficulty);
          const isSelected = selectedDifficulty === difficulty;

          return (
            <motion.div
              key={difficulty}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative p-6 rounded-2xl border cursor-pointer transition-all duration-300",
                isSelected
                  ? "ring-2 ring-purple-500 bg-purple-500/10 border-purple-500/50"
                  : difficultyBgColors[difficulty]
              )}
              onClick={() => onDifficultySelect(difficulty)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-purple-500 text-white shadow-lg">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}

              {/* Icon */}
              <div className={cn(
                "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4",
                difficultyColors[difficulty]
              )}>
                {difficultyIcons[difficulty]}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2">
                {getDifficultyName(difficulty)}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4">
                {getDifficultyDesc(difficulty)}
              </p>

              {/* Stats */}
              {config && (
                <div className="space-y-3">
                  {/* Question Distribution */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">{t.questionDistribution}:</p>
                    <div className="flex gap-2">
                      <div className="flex-1 text-center p-2 rounded-lg bg-green-500/10">
                        <p className="text-xs text-green-400">{t.easyQuestions}</p>
                        <p className="text-lg font-bold text-green-400">{config.questionDistribution.low}%</p>
                      </div>
                      <div className="flex-1 text-center p-2 rounded-lg bg-yellow-500/10">
                        <p className="text-xs text-yellow-400">{t.mediumQuestions}</p>
                        <p className="text-lg font-bold text-yellow-400">{config.questionDistribution.mid}%</p>
                      </div>
                      <div className="flex-1 text-center p-2 rounded-lg bg-red-500/10">
                        <p className="text-xs text-red-400">{t.hardQuestions}</p>
                        <p className="text-lg font-bold text-red-400">{config.questionDistribution.high}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Time & Passing Score */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{config.timePerQuestion}s/{t.timePerQuestion}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Target className="w-4 h-4" />
                      <span>{config.passingScore}% {t.passingScore}</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Second row: Mixed and Adaptive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {['mixed', 'adaptive'].map((difficultyKey, index) => {
          const difficulty = difficultyKey as DifficultyLevel;
          const config = DIFFICULTY_CONFIGS.find(c => c.level === difficulty);
          const isSelected = selectedDifficulty === difficulty;

          return (
            <motion.div
              key={difficulty}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={cn(
                "relative p-6 rounded-2xl border cursor-pointer transition-all duration-300",
                isSelected
                  ? "ring-2 ring-purple-500 bg-purple-500/10 border-purple-500/50"
                  : difficultyBgColors[difficulty]
              )}
              onClick={() => onDifficultySelect(difficulty)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Recommended Badge for Adaptive */}
              {difficulty === 'adaptive' && !isSelected && (
                <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-xs font-bold text-white shadow-lg">
                  ✨ AI Powered
                </div>
              )}

              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-purple-500 text-white shadow-lg">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn(
                  "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-white flex-shrink-0",
                  difficultyColors[difficulty]
                )}>
                  {difficultyIcons[difficulty]}
                </div>

                <div className="flex-1">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {getDifficultyName(difficulty)}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4">
                    {getDifficultyDesc(difficulty)}
                  </p>

                  {/* Stats */}
                  {config && (
                    <div className="flex gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{config.timePerQuestion}s</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>{config.passingScore}%</span>
                      </div>
                      {difficulty === 'mixed' && (
                        <div className="flex items-center gap-2">
                          <span className="text-green-400">33%</span>
                          <span className="text-yellow-400">34%</span>
                          <span className="text-red-400">33%</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
