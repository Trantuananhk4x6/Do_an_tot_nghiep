"use client";

import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Briefcase, 
  Star, 
  Crown, 
  Rocket, 
  Trophy,
  CheckCircle2,
  Clock
} from "lucide-react";
import { ExperienceLevel, ExperienceLevelConfig, EXPERIENCE_LEVEL_CONFIGS } from "../types/quiz.types";
import { cn } from "@/lib/utils";

interface LevelSelectionStepProps {
  detectedLevel?: ExperienceLevel;
  suggestedLevel?: ExperienceLevel | null;
  selectedLevel: ExperienceLevel | null;
  onLevelSelect: (level: ExperienceLevel) => void;
  language: 'vi' | 'en' | 'ja' | 'zh' | 'ko';
}

const translations = {
  vi: {
    title: "Chọn cấp độ của bạn",
    subtitle: "Chọn cấp độ kinh nghiệm để nhận câu hỏi phù hợp",
    detected: "Dựa trên CV, chúng tôi đề xuất",
    years: "năm",
    intern: "Intern",
    internDesc: "Sinh viên/Thực tập sinh, đang học nền tảng",
    fresher: "Fresher",
    fresherDesc: "Mới bắt đầu sự nghiệp, đang học hỏi",
    junior: "Junior",
    juniorDesc: "1-2 năm kinh nghiệm, xây dựng nền tảng",
    mid: "Middle",
    midDesc: "2-5 năm, có thể tự chủ công việc",
    senior: "Senior",
    seniorDesc: "5-8 năm, chuyên gia trong lĩnh vực",
    lead: "Tech Lead",
    leadDesc: "8-12 năm, lãnh đạo kỹ thuật",
    expert: "Expert",
    expertDesc: "12+ năm, chuyên gia cấp cao",
    selected: "Đã chọn",
    focusAreas: "Tập trung vào"
  },
  en: {
    title: "Select Your Level",
    subtitle: "Choose your experience level for matching questions",
    detected: "Based on your CV, we suggest",
    years: "years",
    intern: "Intern",
    internDesc: "Student/Intern, learning the basics",
    fresher: "Fresher",
    fresherDesc: "Just starting career, learning",
    junior: "Junior",
    juniorDesc: "1-2 years experience, building foundation",
    mid: "Middle",
    midDesc: "2-5 years, can work independently",
    senior: "Senior",
    seniorDesc: "5-8 years, domain expert",
    lead: "Tech Lead",
    leadDesc: "8-12 years, technical leadership",
    expert: "Expert",
    expertDesc: "12+ years, industry expert",
    selected: "Selected",
    focusAreas: "Focus on"
  },
  ja: {
    title: "レベルを選択",
    subtitle: "適切な質問のために経験レベルを選択してください",
    detected: "CVに基づいて、私たちが提案します",
    years: "年",
    intern: "インターン",
    internDesc: "学生・インターン、基礎を学んでいる",
    fresher: "フレッシャー",
    fresherDesc: "キャリアを始めたばかり、学習中",
    junior: "ジュニア",
    juniorDesc: "1-2年の経験、基礎を築いている",
    mid: "ミドル",
    midDesc: "2-5年、独立して仕事ができる",
    senior: "シニア",
    seniorDesc: "5-8年、ドメインエキスパート",
    lead: "テックリード",
    leadDesc: "8-12年、技術的リーダーシップ",
    expert: "エキスパート",
    expertDesc: "12年以上、業界の専門家",
    selected: "選択済み",
    focusAreas: "フォーカス"
  },
  zh: {
    title: "选择您的级别",
    subtitle: "选择您的经验级别以获得匹配的问题",
    detected: "根据您的简历，我们建议",
    years: "年",
    intern: "实习生",
    internDesc: "学生/实习生，学习基础",
    fresher: "新人",
    fresherDesc: "刚开始职业生涯，正在学习",
    junior: "初级",
    juniorDesc: "1-2年经验，正在打基础",
    mid: "中级",
    midDesc: "2-5年，可以独立工作",
    senior: "高级",
    seniorDesc: "5-8年，领域专家",
    lead: "技术主管",
    leadDesc: "8-12年，技术领导",
    expert: "专家",
    expertDesc: "12年以上，行业专家",
    selected: "已选择",
    focusAreas: "专注于"
  },
  ko: {
    title: "레벨 선택",
    subtitle: "적절한 질문을 위해 경험 수준을 선택하세요",
    detected: "이력서를 기반으로 추천합니다",
    years: "년",
    intern: "인턴",
    internDesc: "학생/인턴, 기초 학습 중",
    fresher: "신입",
    fresherDesc: "경력 시작, 학습 중",
    junior: "주니어",
    juniorDesc: "1-2년 경험, 기초 구축",
    mid: "미들",
    midDesc: "2-5년, 독립적으로 작업 가능",
    senior: "시니어",
    seniorDesc: "5-8년, 도메인 전문가",
    lead: "테크 리드",
    leadDesc: "8-12년, 기술 리더십",
    expert: "전문가",
    expertDesc: "12년 이상, 업계 전문가",
    selected: "선택됨",
    focusAreas: "집중 분야"
  }
};

const levelIcons: Record<ExperienceLevel, React.ReactNode> = {
  intern: <GraduationCap className="w-7 h-7" />,
  fresher: <GraduationCap className="w-7 h-7" />,
  junior: <Briefcase className="w-7 h-7" />,
  mid: <Star className="w-7 h-7" />,
  senior: <Crown className="w-7 h-7" />,
  lead: <Rocket className="w-7 h-7" />,
  expert: <Trophy className="w-7 h-7" />
};

const levelColors: Record<ExperienceLevel, string> = {
  intern: "from-teal-500 to-cyan-500",
  fresher: "from-green-500 to-emerald-500",
  junior: "from-blue-500 to-cyan-500",
  mid: "from-purple-500 to-violet-500",
  senior: "from-orange-500 to-amber-500",
  lead: "from-pink-500 to-rose-500",
  expert: "from-yellow-500 to-orange-500"
};

const levelBgColors: Record<ExperienceLevel, string> = {
  intern: "bg-teal-500/20 border-teal-500/30 hover:bg-teal-500/30",
  fresher: "bg-green-500/20 border-green-500/30 hover:bg-green-500/30",
  junior: "bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30",
  mid: "bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30",
  senior: "bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30",
  lead: "bg-pink-500/20 border-pink-500/30 hover:bg-pink-500/30",
  expert: "bg-yellow-500/20 border-yellow-500/30 hover:bg-yellow-500/30"
};

export default function LevelSelectionStep({
  detectedLevel,
  suggestedLevel,
  selectedLevel,
  onLevelSelect,
  language
}: LevelSelectionStepProps) {
  const t = translations[language];
  
  // Use suggestedLevel if provided, otherwise use detectedLevel
  const recommendedLevel = suggestedLevel || detectedLevel;

  const getLevelName = (level: ExperienceLevel): string => {
    return t[level] || level;
  };

  const getLevelDescription = (level: ExperienceLevel): string => {
    return t[`${level}Desc` as keyof typeof t] || '';
  };

  const getYearsRange = (level: ExperienceLevel): string => {
    const config = EXPERIENCE_LEVEL_CONFIGS.find(c => c.level === level);
    return config?.yearsRange || '';
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mb-4">
          <Star className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t.title}</h2>
        <p className="text-gray-400 max-w-lg mx-auto">{t.subtitle}</p>
        
        {/* Detected Level Suggestion */}
        {detectedLevel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30"
          >
            <span className="text-sm text-gray-300">{t.detected}:</span>
            <span className={cn(
              "font-semibold bg-gradient-to-r bg-clip-text text-transparent",
              levelColors[detectedLevel]
            )}>
              {getLevelName(detectedLevel)}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Level Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXPERIENCE_LEVEL_CONFIGS.map((config, index) => {
          const isSelected = selectedLevel === config.level;
          const isDetected = detectedLevel === config.level;

          return (
            <motion.div
              key={config.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative p-6 rounded-2xl border cursor-pointer transition-all duration-300",
                isSelected
                  ? "ring-2 ring-purple-500 bg-purple-500/10 border-purple-500/50"
                  : levelBgColors[config.level]
              )}
              onClick={() => onLevelSelect(config.level)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Recommended Badge */}
              {isDetected && !isSelected && (
                <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-bold text-white shadow-lg">
                  ⭐ Đề xuất
                </div>
              )}

              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-purple-500 text-white shadow-lg">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}

              {/* Icon */}
              <div className={cn(
                "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4",
                levelColors[config.level]
              )}>
                {levelIcons[config.level]}
              </div>

              {/* Title & Years */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white">
                  {getLevelName(config.level)}
                </h3>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {getYearsRange(config.level)}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4">
                {getLevelDescription(config.level)}
              </p>

              {/* Focus Areas */}
              <div>
                <p className="text-xs text-gray-500 mb-2">{t.focusAreas}:</p>
                <div className="flex flex-wrap gap-1.5">
                  {config.focusAreas.slice(0, 3).map((area, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300 text-xs"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  layoutId="levelSelector"
                  className="absolute inset-0 rounded-2xl ring-2 ring-purple-500"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
