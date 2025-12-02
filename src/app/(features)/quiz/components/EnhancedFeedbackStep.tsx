"use client";

import { motion } from "framer-motion";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Briefcase,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Download,
  Share2,
  RotateCcw,
  Star,
  Zap,
  Award,
  Clock,
  BarChart3,
  Lightbulb,
  GraduationCap,
  Rocket,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  PlayCircle,
  FileText,
  Globe,
  BookMarked,
  Youtube,
  AlertTriangle,
  Info
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { EnhancedQuizFeedback, CareerField } from "../types/quiz.types";
import { 
  LEARNING_RESOURCES, 
  KNOWLEDGE_EXPLANATIONS,
  getRecommendedResources,
  LearningResource 
} from "../data/learningResources";

interface EnhancedFeedbackStepProps {
  feedback: EnhancedQuizFeedback;
  selectedField: CareerField | null;
  onRetakeQuiz: () => void;
  onTryAnotherField: () => void;
  onDownloadReport: () => void;
  onShareResults: () => void;
  language: 'vi' | 'en' | 'ja' | 'zh' | 'ko';
}

const translations = {
  vi: {
    title: "Kết quả Quiz",
    overallScore: "Điểm tổng",
    correct: "Đúng",
    incorrect: "Sai",
    timeTaken: "Thời gian",
    performanceLevel: "Mức độ",
    excellent: "Xuất sắc",
    good: "Tốt",
    average: "Trung bình",
    needsImprovement: "Cần cải thiện",
    skillBreakdown: "Phân tích kỹ năng",
    recommendations: "Đề xuất học tập",
    studyPlan: "Lộ trình học",
    careerInsights: "Góc nhìn nghề nghiệp",
    retakeQuiz: "Làm lại Quiz",
    tryAnotherField: "Thử ngành khác",
    downloadReport: "Tải báo cáo",
    shareResults: "Chia sẻ",
    viewMore: "Xem thêm",
    viewLess: "Thu gọn",
    questionsAnswered: "câu đã trả lời",
    accuracy: "Độ chính xác",
    averageTime: "Thời gian TB/câu",
    strongSkills: "Kỹ năng mạnh",
    weakSkills: "Cần cải thiện",
    priority: "Ưu tiên",
    high: "Cao",
    medium: "Trung bình",
    low: "Thấp",
    week: "Tuần",
    learningResources: "Khóa học & Tài liệu đề xuất",
    practiceProjects: "Dự án thực hành",
    marketDemand: "Nhu cầu thị trường",
    salaryRange: "Khoảng lương",
    growthPotential: "Tiềm năng phát triển",
    requiredSkills: "Kỹ năng yêu cầu",
    matchScore: "Mức độ phù hợp",
    yourProgress: "Tiến độ của bạn",
    nextSteps: "Bước tiếp theo",
    congratulations: "Chúc mừng",
    keepLearning: "Tiếp tục cố gắng",
    almostThere: "Sắp đạt rồi",
    greatStart: "Khởi đầu tốt",
    // New translations
    knowledgeGaps: "Lỗ hổng kiến thức",
    detailedAnalysis: "Phân tích chi tiết",
    whyImportant: "Tại sao quan trọng",
    howToImprove: "Cách cải thiện",
    recommendedCourses: "Khóa học gợi ý",
    recommendedVideos: "Video hướng dẫn",
    recommendedWebsites: "Website tham khảo",
    free: "Miễn phí",
    paid: "Trả phí",
    beginner: "Cơ bản",
    intermediate: "Trung cấp",
    advanced: "Nâng cao",
    openResource: "Mở tài liệu",
    basedOnAnalysis: "Dựa trên phân tích",
    yourWeakAreas: "Những điểm yếu của bạn",
    conceptExplanation: "Giải thích khái niệm",
    keyPoints: "Điểm chính cần nhớ"
  },
  en: {
    title: "Quiz Results",
    overallScore: "Overall Score",
    correct: "Correct",
    incorrect: "Incorrect",
    timeTaken: "Time Taken",
    performanceLevel: "Level",
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    needsImprovement: "Needs Improvement",
    skillBreakdown: "Skill Breakdown",
    recommendations: "Learning Recommendations",
    studyPlan: "Study Plan",
    careerInsights: "Career Insights",
    retakeQuiz: "Retake Quiz",
    tryAnotherField: "Try Another Field",
    downloadReport: "Download Report",
    shareResults: "Share Results",
    viewMore: "View More",
    viewLess: "View Less",
    questionsAnswered: "questions answered",
    accuracy: "Accuracy",
    averageTime: "Avg Time/Question",
    strongSkills: "Strong Skills",
    weakSkills: "Needs Improvement",
    priority: "Priority",
    high: "High",
    medium: "Medium",
    low: "Low",
    week: "Week",
    learningResources: "Learning Resources",
    practiceProjects: "Practice Projects",
    marketDemand: "Market Demand",
    salaryRange: "Salary Range",
    growthPotential: "Growth Potential",
    requiredSkills: "Required Skills",
    matchScore: "Match Score",
    yourProgress: "Your Progress",
    nextSteps: "Next Steps",
    congratulations: "Congratulations",
    keepLearning: "Keep Learning",
    almostThere: "Almost There",
    greatStart: "Great Start"
  },
  ja: {
    title: "クイズ結果",
    overallScore: "総合スコア",
    correct: "正解",
    incorrect: "不正解",
    timeTaken: "所要時間",
    performanceLevel: "レベル",
    excellent: "優秀",
    good: "良い",
    average: "平均",
    needsImprovement: "改善が必要",
    skillBreakdown: "スキル分析",
    recommendations: "学習の推奨事項",
    studyPlan: "学習計画",
    careerInsights: "キャリアインサイト",
    retakeQuiz: "クイズを再受験",
    tryAnotherField: "別の分野を試す",
    downloadReport: "レポートをダウンロード",
    shareResults: "結果を共有",
    viewMore: "もっと見る",
    viewLess: "折りたたむ",
    questionsAnswered: "問回答済み",
    accuracy: "正答率",
    averageTime: "平均時間/問",
    strongSkills: "得意スキル",
    weakSkills: "改善が必要",
    priority: "優先度",
    high: "高",
    medium: "中",
    low: "低",
    week: "週",
    learningResources: "学習リソース",
    practiceProjects: "実践プロジェクト",
    marketDemand: "市場需要",
    salaryRange: "給与範囲",
    growthPotential: "成長の可能性",
    requiredSkills: "必要なスキル",
    matchScore: "マッチスコア",
    yourProgress: "あなたの進捗",
    nextSteps: "次のステップ",
    congratulations: "おめでとう",
    keepLearning: "学習を続けて",
    almostThere: "もう少し",
    greatStart: "素晴らしいスタート"
  },
  zh: {
    title: "测验结果",
    overallScore: "总分",
    correct: "正确",
    incorrect: "错误",
    timeTaken: "用时",
    performanceLevel: "等级",
    excellent: "优秀",
    good: "良好",
    average: "一般",
    needsImprovement: "需要改进",
    skillBreakdown: "技能分析",
    recommendations: "学习建议",
    studyPlan: "学习计划",
    careerInsights: "职业见解",
    retakeQuiz: "重新测验",
    tryAnotherField: "尝试其他领域",
    downloadReport: "下载报告",
    shareResults: "分享结果",
    viewMore: "查看更多",
    viewLess: "收起",
    questionsAnswered: "题已回答",
    accuracy: "准确率",
    averageTime: "平均时间/题",
    strongSkills: "强项技能",
    weakSkills: "需要改进",
    priority: "优先级",
    high: "高",
    medium: "中",
    low: "低",
    week: "周",
    learningResources: "学习资源",
    practiceProjects: "实践项目",
    marketDemand: "市场需求",
    salaryRange: "薪资范围",
    growthPotential: "发展潜力",
    requiredSkills: "所需技能",
    matchScore: "匹配度",
    yourProgress: "您的进度",
    nextSteps: "下一步",
    congratulations: "恭喜",
    keepLearning: "继续学习",
    almostThere: "快要达到了",
    greatStart: "良好开端"
  },
  ko: {
    title: "퀴즈 결과",
    overallScore: "총점",
    correct: "정답",
    incorrect: "오답",
    timeTaken: "소요 시간",
    performanceLevel: "레벨",
    excellent: "우수",
    good: "좋음",
    average: "보통",
    needsImprovement: "개선 필요",
    skillBreakdown: "스킬 분석",
    recommendations: "학습 추천",
    studyPlan: "학습 계획",
    careerInsights: "커리어 인사이트",
    retakeQuiz: "퀴즈 다시 풀기",
    tryAnotherField: "다른 분야 시도",
    downloadReport: "보고서 다운로드",
    shareResults: "결과 공유",
    viewMore: "더 보기",
    viewLess: "접기",
    questionsAnswered: "문제 답변 완료",
    accuracy: "정확도",
    averageTime: "평균 시간/문제",
    strongSkills: "강점 스킬",
    weakSkills: "개선 필요",
    priority: "우선순위",
    high: "높음",
    medium: "중간",
    low: "낮음",
    week: "주",
    learningResources: "학습 자료",
    practiceProjects: "실습 프로젝트",
    marketDemand: "시장 수요",
    salaryRange: "급여 범위",
    growthPotential: "성장 잠재력",
    requiredSkills: "필요 스킬",
    matchScore: "매칭 점수",
    yourProgress: "당신의 진행 상황",
    nextSteps: "다음 단계",
    congratulations: "축하합니다",
    keepLearning: "계속 학습하세요",
    almostThere: "거의 다 왔어요",
    greatStart: "좋은 시작"
  }
};

function getPerformanceLevel(score: number): { label: string; color: string; icon: React.ReactNode } {
  if (score >= 90) return { label: 'excellent', color: 'text-green-400', icon: <Trophy className="w-6 h-6 text-yellow-400" /> };
  if (score >= 70) return { label: 'good', color: 'text-blue-400', icon: <Star className="w-6 h-6 text-blue-400" /> };
  if (score >= 50) return { label: 'average', color: 'text-yellow-400', icon: <Target className="w-6 h-6 text-yellow-400" /> };
  return { label: 'needsImprovement', color: 'text-red-400', icon: <TrendingUp className="w-6 h-6 text-red-400" /> };
}

export default function EnhancedFeedbackStep({
  feedback,
  selectedField,
  onRetakeQuiz,
  onTryAnotherField,
  onDownloadReport,
  onShareResults,
  language
}: EnhancedFeedbackStepProps) {
  const t = translations[language];
  const [expandedSection, setExpandedSection] = useState<string | null>('skills');

  const performance = getPerformanceLevel(feedback.overallScore);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative p-8 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Performance Icon */}
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-purple-500/30"
            >
              {performance.icon}
            </motion.div>
          </div>

          {/* Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h2 className="text-lg text-gray-400 mb-2">{t.overallScore}</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-6xl font-bold text-white">{feedback.overallScore}</span>
              <span className="text-3xl text-gray-400">%</span>
            </div>
            <p className={cn("mt-2 text-lg font-medium", performance.color)}>
              {t[performance.label as keyof typeof t]}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-8 mt-6"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-2xl font-bold">{feedback.correctAnswers}</span>
              </div>
              <p className="text-sm text-gray-400">{t.correct}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-red-400">
                <XCircle className="w-5 h-5" />
                <span className="text-2xl font-bold">{feedback.totalQuestions - feedback.correctAnswers}</span>
              </div>
              <p className="text-sm text-gray-400">{t.incorrect}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-blue-400">
                <Clock className="w-5 h-5" />
                <span className="text-2xl font-bold">{formatTime(feedback.timeTaken)}</span>
              </div>
              <p className="text-sm text-gray-400">{t.timeTaken}</p>
            </div>
          </motion.div>

          {/* Selected Field Badge */}
          {selectedField && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center mt-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700">
                <span className="text-2xl">{selectedField.icon}</span>
                <span className="text-gray-300 font-medium">{selectedField.name}</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Skill Breakdown Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 overflow-hidden"
      >
        <button
          onClick={() => toggleSection('skills')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">{t.skillBreakdown}</h3>
          </div>
          {expandedSection === 'skills' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSection === 'skills' && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            className="p-4 pt-0 border-t border-gray-700/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {/* Strong Skills */}
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <h4 className="flex items-center gap-2 text-green-400 font-medium mb-3">
                  <Star className="w-4 h-4" />
                  {t.strongSkills}
                </h4>
                <div className="space-y-2">
                  {feedback.skillPerformance
                    .filter(s => s.score >= 70)
                    .slice(0, 5)
                    .map((skill, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{skill.skillName}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${skill.score}%` }}
                            />
                          </div>
                          <span className="text-green-400 text-sm font-medium w-10 text-right">
                            {skill.score}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Weak Skills */}
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <h4 className="flex items-center gap-2 text-red-400 font-medium mb-3">
                  <TrendingUp className="w-4 h-4" />
                  {t.weakSkills}
                </h4>
                <div className="space-y-2">
                  {feedback.skillPerformance
                    .filter(s => s.score < 70)
                    .slice(0, 5)
                    .map((skill, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{skill.skillName}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500 rounded-full"
                              style={{ width: `${skill.score}%` }}
                            />
                          </div>
                          <span className="text-red-400 text-sm font-medium w-10 text-right">
                            {skill.score}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Recommendations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 overflow-hidden"
      >
        <button
          onClick={() => toggleSection('recommendations')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">{t.recommendations}</h3>
          </div>
          {expandedSection === 'recommendations' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSection === 'recommendations' && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            className="p-4 pt-0 border-t border-gray-700/50"
          >
            <div className="space-y-3 pt-4">
              {feedback.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-700/30"
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    rec.priority === 'high' ? "bg-red-500/20 text-red-400" :
                    rec.priority === 'medium' ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-blue-500/20 text-blue-400"
                  )}>
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{rec.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">{rec.description}</p>
                    {rec.resources && rec.resources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {rec.resources.map((resource, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs"
                          >
                            {resource}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-md text-xs font-medium",
                    rec.priority === 'high' ? "bg-red-500/10 text-red-400" :
                    rec.priority === 'medium' ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-blue-500/10 text-blue-400"
                  )}>
                    {t[rec.priority]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Study Plan Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 overflow-hidden"
      >
        <button
          onClick={() => toggleSection('studyPlan')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">{t.studyPlan}</h3>
          </div>
          {expandedSection === 'studyPlan' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSection === 'studyPlan' && feedback.studyPlan && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            className="p-4 pt-0 border-t border-gray-700/50"
          >
            <div className="pt-4 space-y-4">
              {feedback.studyPlan.weeklyPlan.map((week, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-gray-700/30 border-l-4 border-green-500"
                >
                  <h4 className="text-green-400 font-medium mb-2">
                    {t.week} {week.week}: {week.focus}
                  </h4>
                  <ul className="space-y-1">
                    {week.topics.map((topic, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Career Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 overflow-hidden"
      >
        <button
          onClick={() => toggleSection('career')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">{t.careerInsights}</h3>
          </div>
          {expandedSection === 'career' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSection === 'career' && feedback.careerInsights && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            className="p-4 pt-0 border-t border-gray-700/50"
          >
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">{t.marketDemand}</span>
                </div>
                <p className="text-white text-lg font-bold">
                  {feedback.careerInsights.marketDemand}
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">{t.salaryRange}</span>
                </div>
                <p className="text-white text-lg font-bold">
                  {feedback.careerInsights.salaryRange}
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Rocket className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 font-medium">{t.growthPotential}</span>
                </div>
                <p className="text-white text-lg font-bold">
                  {feedback.careerInsights.growthPotential}
                </p>
              </div>
            </div>

            {/* Next Steps */}
            {feedback.careerInsights.nextSteps && (
              <div className="mt-4 p-4 rounded-xl bg-gray-700/30">
                <h4 className="flex items-center gap-2 text-white font-medium mb-3">
                  <ArrowRight className="w-5 h-5 text-purple-400" />
                  {t.nextSteps}
                </h4>
                <div className="space-y-2">
                  {feedback.careerInsights.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-300">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Learning Resources Section - NEW */}
      <LearningResourcesSection 
        feedback={feedback}
        selectedField={selectedField}
        language={language}
        t={t}
        expandedSection={expandedSection}
        toggleSection={toggleSection}
      />

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-4 pt-4"
      >
        <button
          onClick={onRetakeQuiz}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg shadow-purple-500/20"
        >
          <RotateCcw className="w-5 h-5" />
          {t.retakeQuiz}
        </button>

        <button
          onClick={onTryAnotherField}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-700 text-white font-medium hover:bg-gray-600 transition-all"
        >
          <Zap className="w-5 h-5" />
          {t.tryAnotherField}
        </button>

        <button
          onClick={onDownloadReport}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition-all"
        >
          <Download className="w-5 h-5" />
          {t.downloadReport}
        </button>

        <button
          onClick={onShareResults}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition-all"
        >
          <Share2 className="w-5 h-5" />
          {t.shareResults}
        </button>
      </motion.div>
    </div>
  );
}

// ============================================
// Learning Resources Section Component
// ============================================

interface LearningResourcesSectionProps {
  feedback: EnhancedQuizFeedback;
  selectedField: CareerField | null;
  language: 'vi' | 'en' | 'ja' | 'zh' | 'ko';
  t: any;
  expandedSection: string | null;
  toggleSection: (section: string) => void;
}

function LearningResourcesSection({ 
  feedback, 
  selectedField, 
  language, 
  t,
  expandedSection,
  toggleSection 
}: LearningResourcesSectionProps) {
  // Get weak skills from feedback
  const weakSkills = useMemo(() => {
    return feedback.skillPerformance
      .filter(s => s.score < 70)
      .map(s => s.skillName);
  }, [feedback.skillPerformance]);

  // Get recommended resources based on weak skills
  const recommendedResources = useMemo(() => {
    const level = feedback.overallScore >= 70 ? 'intermediate' : 'beginner';
    return getRecommendedResources(weakSkills, level, 8);
  }, [weakSkills, feedback.overallScore]);

  // Group resources by type
  const groupedResources = useMemo(() => {
    const groups: { [key: string]: LearningResource[] } = {
      courses: [],
      videos: [],
      websites: [],
      other: []
    };

    recommendedResources.forEach(resource => {
      if (resource.type === 'course' || resource.type === 'tutorial') {
        groups.courses.push(resource);
      } else if (resource.type === 'video') {
        groups.videos.push(resource);
      } else if (resource.type === 'website' || resource.type === 'article') {
        groups.websites.push(resource);
      } else {
        groups.other.push(resource);
      }
    });

    return groups;
  }, [recommendedResources]);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'course':
      case 'tutorial':
        return <GraduationCap className="w-4 h-4" />;
      case 'video':
        return <Youtube className="w-4 h-4" />;
      case 'website':
      case 'article':
        return <Globe className="w-4 h-4" />;
      case 'book':
        return <BookMarked className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'text-green-400 bg-green-500/10';
      case 'intermediate':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'advanced':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  const translations = {
    vi: {
      learningResources: "Khóa học & Tài liệu đề xuất",
      basedOnYourWeaknesses: "Dựa trên những kỹ năng cần cải thiện",
      courses: "Khóa học",
      videos: "Video hướng dẫn",
      websites: "Website & Bài viết",
      free: "Miễn phí",
      paid: "Trả phí",
      beginner: "Cơ bản",
      intermediate: "Trung cấp",
      advanced: "Nâng cao",
      openResource: "Mở",
      skillsToImprove: "Kỹ năng cần cải thiện",
      whyThisMatters: "Tại sao điều này quan trọng",
      knowledgeGaps: "Lỗ hổng kiến thức cần bổ sung",
      conceptsToReview: "Khái niệm cần ôn lại",
      practiceRecommendations: "Gợi ý thực hành"
    },
    en: {
      learningResources: "Recommended Courses & Resources",
      basedOnYourWeaknesses: "Based on your areas for improvement",
      courses: "Courses",
      videos: "Video Tutorials",
      websites: "Websites & Articles",
      free: "Free",
      paid: "Paid",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      openResource: "Open",
      skillsToImprove: "Skills to Improve",
      whyThisMatters: "Why This Matters",
      knowledgeGaps: "Knowledge Gaps to Fill",
      conceptsToReview: "Concepts to Review",
      practiceRecommendations: "Practice Recommendations"
    },
    ja: {
      learningResources: "おすすめのコースとリソース",
      basedOnYourWeaknesses: "改善が必要な分野に基づいて",
      courses: "コース",
      videos: "ビデオチュートリアル",
      websites: "ウェブサイトと記事",
      free: "無料",
      paid: "有料",
      beginner: "初級",
      intermediate: "中級",
      advanced: "上級",
      openResource: "開く",
      skillsToImprove: "改善すべきスキル",
      whyThisMatters: "なぜこれが重要なのか",
      knowledgeGaps: "埋めるべき知識のギャップ",
      conceptsToReview: "復習すべき概念",
      practiceRecommendations: "練習の推奨事項"
    },
    zh: {
      learningResources: "推荐课程和资源",
      basedOnYourWeaknesses: "基于您需要改进的领域",
      courses: "课程",
      videos: "视频教程",
      websites: "网站和文章",
      free: "免费",
      paid: "付费",
      beginner: "初级",
      intermediate: "中级",
      advanced: "高级",
      openResource: "打开",
      skillsToImprove: "需要提高的技能",
      whyThisMatters: "为什么这很重要",
      knowledgeGaps: "需要填补的知识空白",
      conceptsToReview: "需要复习的概念",
      practiceRecommendations: "练习建议"
    },
    ko: {
      learningResources: "추천 코스 및 리소스",
      basedOnYourWeaknesses: "개선이 필요한 영역을 기반으로",
      courses: "코스",
      videos: "비디오 튜토리얼",
      websites: "웹사이트 및 기사",
      free: "무료",
      paid: "유료",
      beginner: "초급",
      intermediate: "중급",
      advanced: "고급",
      openResource: "열기",
      skillsToImprove: "개선할 기술",
      whyThisMatters: "왜 이것이 중요한가",
      knowledgeGaps: "채워야 할 지식 격차",
      conceptsToReview: "복습할 개념",
      practiceRecommendations: "연습 권장사항"
    }
  };

  const lt = translations[language] || translations.en;

  if (recommendedResources.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 overflow-hidden"
    >
      <button
        onClick={() => toggleSection('resources')}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white">{lt.learningResources}</h3>
            <p className="text-sm text-gray-400">{lt.basedOnYourWeaknesses}</p>
          </div>
        </div>
        {expandedSection === 'resources' ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expandedSection === 'resources' && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          className="p-4 pt-0 border-t border-gray-700/50"
        >
          <div className="pt-4 space-y-6">
            {/* Skills to Improve Summary */}
            {weakSkills.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <h4 className="flex items-center gap-2 text-amber-400 font-medium mb-3">
                  <AlertTriangle className="w-4 h-4" />
                  {lt.skillsToImprove}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {weakSkills.slice(0, 6).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Courses Section */}
            {groupedResources.courses.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-white font-medium mb-3">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                  {lt.courses}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {groupedResources.courses.map((resource, idx) => (
                    <ResourceCard 
                      key={idx} 
                      resource={resource} 
                      language={language}
                      lt={lt}
                      getResourceIcon={getResourceIcon}
                      getLevelColor={getLevelColor}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {groupedResources.videos.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-white font-medium mb-3">
                  <PlayCircle className="w-5 h-5 text-red-400" />
                  {lt.videos}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {groupedResources.videos.map((resource, idx) => (
                    <ResourceCard 
                      key={idx} 
                      resource={resource} 
                      language={language}
                      lt={lt}
                      getResourceIcon={getResourceIcon}
                      getLevelColor={getLevelColor}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Websites Section */}
            {groupedResources.websites.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-white font-medium mb-3">
                  <Globe className="w-5 h-5 text-green-400" />
                  {lt.websites}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {groupedResources.websites.map((resource, idx) => (
                    <ResourceCard 
                      key={idx} 
                      resource={resource} 
                      language={language}
                      lt={lt}
                      getResourceIcon={getResourceIcon}
                      getLevelColor={getLevelColor}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Practice Recommendations */}
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <h4 className="flex items-center gap-2 text-purple-400 font-medium mb-3">
                <Target className="w-4 h-4" />
                {lt.practiceRecommendations}
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  {language === 'vi' 
                    ? "Làm bài tập thực hành trên LeetCode hoặc HackerRank mỗi ngày"
                    : "Practice coding exercises on LeetCode or HackerRank daily"
                  }
                </li>
                <li className="flex items-start gap-2 text-gray-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  {language === 'vi'
                    ? "Xây dựng dự án cá nhân để áp dụng kiến thức"
                    : "Build personal projects to apply your knowledge"
                  }
                </li>
                <li className="flex items-start gap-2 text-gray-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  {language === 'vi'
                    ? "Tham gia cộng đồng và thảo luận với developer khác"
                    : "Join communities and discuss with other developers"
                  }
                </li>
                <li className="flex items-start gap-2 text-gray-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  {language === 'vi'
                    ? "Đọc documentation chính thức và best practices"
                    : "Read official documentation and best practices"
                  }
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Resource Card Component
interface ResourceCardProps {
  resource: LearningResource;
  language: string;
  lt: any;
  getResourceIcon: (type: string) => React.ReactNode;
  getLevelColor: (level: string) => string;
}

function ResourceCard({ resource, language, lt, getResourceIcon, getLevelColor }: ResourceCardProps) {
  const title = language === 'vi' ? resource.titleVi : resource.title;
  const description = language === 'vi' ? resource.descriptionVi : resource.description;

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group p-4 rounded-xl bg-gray-700/30 border border-gray-600/30 hover:border-purple-500/50 hover:bg-gray-700/50 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-600/50 flex items-center justify-center text-gray-400 group-hover:text-purple-400 transition-colors">
          {getResourceIcon(resource.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-white font-medium truncate group-hover:text-purple-300 transition-colors">
            {title}
          </h5>
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs text-gray-500">{resource.platform}</span>
            <span className={cn("px-2 py-0.5 rounded text-xs", getLevelColor(resource.level))}>
              {lt[resource.level]}
            </span>
            <span className={cn(
              "px-2 py-0.5 rounded text-xs",
              resource.isFree ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
            )}>
              {resource.isFree ? lt.free : lt.paid}
            </span>
            {resource.rating && (
              <span className="flex items-center gap-1 text-xs text-yellow-400">
                <Star className="w-3 h-3 fill-current" />
                {resource.rating}
              </span>
            )}
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors flex-shrink-0" />
      </div>
    </a>
  );
}
