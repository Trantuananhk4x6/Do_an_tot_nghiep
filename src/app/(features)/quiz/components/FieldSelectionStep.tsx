"use client";

import { motion } from "framer-motion";
import { 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles,
  DollarSign,
  ChevronRight
} from "lucide-react";
import { CareerField } from "../types/quiz.types";
import { CVAnalysisResult, FieldMatchResult } from "../services/cvMatchService";
import { getFieldName, formatSalaryRange } from "../data/careerFields";
import { cn } from "@/lib/utils";

interface FieldSelectionStepProps {
  fields: CareerField[];
  cvAnalysis: CVAnalysisResult | null;
  selectedField: CareerField | null;
  onFieldSelect: (field: CareerField) => void;
  language: 'vi' | 'en' | 'ja' | 'zh' | 'ko';
}

const translations = {
  vi: {
    title: "Chọn lĩnh vực",
    subtitle: "Dựa trên phân tích CV, đây là các lĩnh vực phù hợp với bạn",
    recommendedForYou: "Đề xuất cho bạn",
    matchScore: "Độ phù hợp",
    demand: "Nhu cầu",
    salary: "Mức lương",
    high: "Cao",
    medium: "Trung bình",
    low: "Thấp",
    missingSkills: "Kỹ năng cần bổ sung",
    matchedHotSkills: "Kỹ năng hot đã có",
    topCompanies: "Công ty hàng đầu",
    growthRate: "Tốc độ tăng trưởng",
    trends: "Xu hướng",
    otherFields: "Các lĩnh vực khác",
    selectField: "Chọn lĩnh vực này",
    selected: "Đã chọn",
    continue: "Tiếp tục"
  },
  en: {
    title: "Select Career Field",
    subtitle: "Based on your CV analysis, here are the fields that match your profile",
    recommendedForYou: "Recommended for you",
    matchScore: "Match Score",
    demand: "Demand",
    salary: "Salary",
    high: "High",
    medium: "Medium",
    low: "Low",
    missingSkills: "Skills to develop",
    matchedHotSkills: "Hot skills matched",
    topCompanies: "Top Companies",
    growthRate: "Growth Rate",
    trends: "Trends",
    otherFields: "Other Fields",
    selectField: "Select this field",
    selected: "Selected",
    continue: "Continue"
  },
  ja: {
    title: "キャリア分野を選択",
    subtitle: "CV分析に基づいて、あなたのプロフィールに合った分野です",
    recommendedForYou: "おすすめ",
    matchScore: "マッチ度",
    demand: "需要",
    salary: "給与",
    high: "高い",
    medium: "中程度",
    low: "低い",
    missingSkills: "習得すべきスキル",
    matchedHotSkills: "マッチした注目スキル",
    topCompanies: "トップ企業",
    growthRate: "成長率",
    trends: "トレンド",
    otherFields: "その他の分野",
    selectField: "この分野を選択",
    selected: "選択済み",
    continue: "続ける"
  },
  zh: {
    title: "选择职业领域",
    subtitle: "根据您的简历分析，以下是与您匹配的领域",
    recommendedForYou: "为您推荐",
    matchScore: "匹配度",
    demand: "需求",
    salary: "薪资",
    high: "高",
    medium: "中等",
    low: "低",
    missingSkills: "需要发展的技能",
    matchedHotSkills: "已匹配的热门技能",
    topCompanies: "顶级公司",
    growthRate: "增长率",
    trends: "趋势",
    otherFields: "其他领域",
    selectField: "选择此领域",
    selected: "已选择",
    continue: "继续"
  },
  ko: {
    title: "직업 분야 선택",
    subtitle: "이력서 분석을 기반으로 귀하의 프로필에 맞는 분야입니다",
    recommendedForYou: "추천",
    matchScore: "매칭 점수",
    demand: "수요",
    salary: "급여",
    high: "높음",
    medium: "보통",
    low: "낮음",
    missingSkills: "개발할 기술",
    matchedHotSkills: "매칭된 인기 기술",
    topCompanies: "최고 기업",
    growthRate: "성장률",
    trends: "트렌드",
    otherFields: "기타 분야",
    selectField: "이 분야 선택",
    selected: "선택됨",
    continue: "계속"
  }
};

export default function FieldSelectionStep({
  fields,
  cvAnalysis,
  selectedField,
  onFieldSelect,
  language
}: FieldSelectionStepProps) {
  const t = translations[language];

  // Get suggested fields from CV analysis or use all fields
  const getSuggestedFields = (): FieldMatchResult[] => {
    if (cvAnalysis && cvAnalysis.matchedFields.length > 0) {
      return cvAnalysis.matchedFields.slice(0, 8);
    }

    // If no CV analysis, return fields with default scores
    return fields.map(field => ({
      field,
      matchScore: 50,
      matchedSkills: [],
      missingSkills: field.requiredSkills
    }));
  };

  const suggestedFields = getSuggestedFields();
  const topRecommendations = suggestedFields.slice(0, 3);
  const otherFields = suggestedFields.slice(3);

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default: return '';
    }
  };

  const getDemandText = (demand: string) => {
    switch (demand) {
      case 'high': return t.high;
      case 'medium': return t.medium;
      case 'low': return t.low;
      default: return demand;
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t.title}</h2>
        <p className="text-gray-400 max-w-lg mx-auto">{t.subtitle}</p>
      </motion.div>

      {/* Top Recommendations */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">{t.recommendedForYou}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topRecommendations.map((suggestion, index) => {
            const isSelected = selectedField?.id === suggestion.field.id;
            
            return (
              <motion.div
                key={suggestion.field.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300",
                  isSelected 
                    ? "ring-2 ring-purple-500 bg-purple-500/10" 
                    : "bg-white/5 hover:bg-white/10 border border-white/10"
                )}
                onClick={() => onFieldSelect(suggestion.field)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Rank Badge */}
                {index === 0 && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-xs font-bold text-white">
                      🏆 TOP 1
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Field Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-3xl">
                      {suggestion.field.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white">
                        {getFieldName(suggestion.field, language)}
                      </h4>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {suggestion.field.description}
                      </p>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">{t.matchScore}</span>
                      <span className={cn("text-lg font-bold", getMatchColor(suggestion.matchScore))}>
                        {suggestion.matchScore}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${suggestion.matchScore}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className={cn(
                          "h-full rounded-full",
                          suggestion.matchScore >= 70 ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                          suggestion.matchScore >= 50 ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
                          "bg-gradient-to-r from-orange-500 to-red-500"
                        )}
                      />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Demand */}
                    <div className={cn(
                      "p-2 rounded-lg border",
                      getDemandColor(suggestion.field.demandLevel)
                    )}>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-xs">{t.demand}</span>
                      </div>
                      <p className="text-sm font-semibold mt-1">{getDemandText(suggestion.field.demandLevel)}</p>
                    </div>

                    {/* Salary */}
                    <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span className="text-xs">{t.salary}</span>
                      </div>
                      <p className="text-xs font-semibold mt-1">
                        {formatSalaryRange(suggestion.field.avgSalary, language)}
                      </p>
                    </div>
                  </div>

                  {/* Matched Skills */}
                  {suggestion.matchedSkills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">✅ {t.matchedHotSkills}</p>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.matchedSkills.slice(0, 4).map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {suggestion.matchedSkills.length > 4 && (
                          <span className="px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 text-xs">
                            +{suggestion.matchedSkills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {suggestion.missingSkills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">⚠️ {t.missingSkills}</p>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.missingSkills.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {suggestion.missingSkills.length > 3 && (
                          <span className="px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 text-xs">
                            +{suggestion.missingSkills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Select Button */}
                  <button
                    className={cn(
                      "w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                      isSelected
                        ? "bg-purple-500 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    )}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        {t.selected}
                      </>
                    ) : (
                      <>
                        {t.selectField}
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Other Fields */}
      {otherFields.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">{t.otherFields}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {otherFields.map((suggestion, index) => {
              const isSelected = selectedField?.id === suggestion.field.id;

              return (
                <motion.div
                  key={suggestion.field.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className={cn(
                    "p-4 rounded-xl cursor-pointer transition-all duration-300",
                    isSelected
                      ? "ring-2 ring-purple-500 bg-purple-500/10"
                      : "bg-white/5 hover:bg-white/10 border border-white/10"
                  )}
                  onClick={() => onFieldSelect(suggestion.field)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{suggestion.field.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {getFieldName(suggestion.field, language)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn("text-sm font-semibold", getMatchColor(suggestion.matchScore))}>
                          {suggestion.matchScore}%
                        </span>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-xs",
                          getDemandColor(suggestion.field.demandLevel)
                        )}>
                          {getDemandText(suggestion.field.demandLevel)}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
