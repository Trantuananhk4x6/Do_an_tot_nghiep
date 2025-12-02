"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Loader2,
  AlertCircle,
  Upload,
  List,
  Clock,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle2,
  Star,
  Briefcase,
  Award,
  Zap,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { SummaryResponse } from "./models/Summary";
import { generateSummary } from "./services/summaryService";
import FileUpload from "./components/fileUpload";
import { Button } from "@/components/ui/button";
import { LanguageSelector, Language } from "@/components/ui/language-selector";
import { motion } from 'framer-motion';
import Animated3DBackground from '@/components/ui/Animated3DBackground';

const SummarizePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("vi");

  // Translations
  const translations = {
    vi: {
      title: "Phân tích CV chuyên sâu",
      subtitle: "AI phân tích chi tiết CV của bạn: Đánh giá kỹ năng, gợi ý nghề nghiệp, và lộ trình cải thiện",
      uploadTitle: "Tải lên tài liệu hoặc file âm thanh của bạn",
      uploadDesc: "Định dạng hỗ trợ: PDF, DOCX, TXT, MP3, WAV, OGG",
      uploadError: "Vui lòng tải lên tài liệu hoặc file âm thanh trước khi tạo tóm tắt",
      generateError: "Không thể tạo tóm tắt. Vui lòng thử lại.",
      processing: "Đang phân tích CV...",
      generateBtn: "Phân tích CV",
      wordCount: "Số từ",
      readingTime: "Thời gian đọc",
      overview: "Tóm tắt tổng quan",
      keyPoints: "Các điểm chính",
      weaknesses: "Nhược điểm & Gợi ý cải thiện",
      words: "từ",
      secondsRead: "giây đọc",
      minRead: "phút đọc",
      minSecRead: "phút",
      secRead: "giây đọc",
      // New translations
      cvScore: "Điểm CV",
      skillsAnalysis: "Phân tích kỹ năng",
      careerRecommendations: "Gợi ý nghề nghiệp",
      actionItems: "Việc cần làm",
      experienceHighlights: "Điểm nhấn kinh nghiệm",
      professionalSummary: "Tóm tắt chuyên nghiệp",
      cvCompleteness: "Độ hoàn thiện CV",
      overallRating: "Đánh giá tổng thể",
      matchScore: "Độ phù hợp",
      priority: "Ưu tiên",
      impact: "Tác động",
      technical: "Kỹ thuật",
      soft: "Kỹ năng mềm",
      language: "Ngôn ngữ",
      tool: "Công cụ",
      high: "Cao",
      medium: "Trung bình",
      low: "Thấp",
      complete: "Hoàn thiện",
      partial: "Một phần",
      missing: "Thiếu"
    },
    en: {
      title: "Advanced CV Analysis",
      subtitle: "AI analyzes your CV in detail: Skills assessment, career suggestions, and improvement roadmap",
      uploadTitle: "Upload your document or audio file",
      uploadDesc: "Supported formats: PDF, DOCX, TXT, MP3, WAV, OGG",
      uploadError: "Please upload a document or audio file before generating a summary",
      generateError: "Failed to generate summary. Please try again.",
      processing: "Analyzing CV...",
      generateBtn: "Analyze CV",
      wordCount: "Word Count",
      readingTime: "Reading Time",
      overview: "Overview Summary",
      keyPoints: "Key Points",
      weaknesses: "Weaknesses & Improvement Suggestions",
      words: "words",
      secondsRead: "seconds read",
      minRead: "min read",
      minSecRead: "min",
      secRead: "sec read",
      cvScore: "CV Score",
      skillsAnalysis: "Skills Analysis",
      careerRecommendations: "Career Recommendations",
      actionItems: "Action Items",
      experienceHighlights: "Experience Highlights",
      professionalSummary: "Professional Summary",
      cvCompleteness: "CV Completeness",
      overallRating: "Overall Rating",
      matchScore: "Match Score",
      priority: "Priority",
      impact: "Impact",
      technical: "Technical",
      soft: "Soft Skills",
      language: "Language",
      tool: "Tools",
      high: "High",
      medium: "Medium",
      low: "Low",
      complete: "Complete",
      partial: "Partial",
      missing: "Missing"
    },
    ja: {
      title: "高度なCV分析",
      subtitle: "AIがCVを詳細に分析：スキル評価、キャリア提案、改善ロードマップ",
      uploadTitle: "ドキュメントまたは音声ファイルをアップロード",
      uploadDesc: "サポート形式: PDF、DOCX、TXT、MP3、WAV、OGG",
      uploadError: "要約を生成する前にドキュメントまたは音声ファイルをアップロードしてください",
      generateError: "要約の生成に失敗しました。もう一度お試しください。",
      processing: "CV分析中...",
      generateBtn: "CV分析",
      wordCount: "単語数",
      readingTime: "読書時間",
      overview: "概要",
      keyPoints: "主要なポイント",
      weaknesses: "弱点と改善提案",
      words: "単語",
      secondsRead: "秒読む",
      minRead: "分読む",
      minSecRead: "分",
      secRead: "秒読む",
      cvScore: "CVスコア",
      skillsAnalysis: "スキル分析",
      careerRecommendations: "キャリア提案",
      actionItems: "アクション項目",
      experienceHighlights: "経験のハイライト",
      professionalSummary: "プロフェッショナルサマリー",
      cvCompleteness: "CV完成度",
      overallRating: "総合評価",
      matchScore: "マッチスコア",
      priority: "優先度",
      impact: "影響",
      technical: "技術",
      soft: "ソフトスキル",
      language: "言語",
      tool: "ツール",
      high: "高",
      medium: "中",
      low: "低",
      complete: "完了",
      partial: "部分的",
      missing: "欠落"
    },
    zh: {
      title: "高级简历分析",
      subtitle: "AI详细分析您的简历：技能评估、职业建议和改进路线图",
      uploadTitle: "上传您的文档或音频文件",
      uploadDesc: "支持格式：PDF、DOCX、TXT、MP3、WAV、OGG",
      uploadError: "请在生成摘要之前上传文档或音频文件",
      generateError: "生成摘要失败。请重试。",
      processing: "正在分析简历...",
      generateBtn: "分析简历",
      wordCount: "字数",
      readingTime: "阅读时间",
      overview: "总体概述",
      keyPoints: "要点",
      weaknesses: "弱点与改进建议",
      words: "字",
      secondsRead: "秒阅读",
      minRead: "分钟阅读",
      minSecRead: "分钟",
      secRead: "秒阅读",
      cvScore: "简历分数",
      skillsAnalysis: "技能分析",
      careerRecommendations: "职业建议",
      actionItems: "待办事项",
      experienceHighlights: "经验亮点",
      professionalSummary: "专业摘要",
      cvCompleteness: "简历完整度",
      overallRating: "综合评分",
      matchScore: "匹配分数",
      priority: "优先级",
      impact: "影响",
      technical: "技术",
      soft: "软技能",
      language: "语言",
      tool: "工具",
      high: "高",
      medium: "中",
      low: "低",
      complete: "完成",
      partial: "部分",
      missing: "缺失"
    },
    ko: {
      title: "고급 이력서 분석",
      subtitle: "AI가 이력서를 상세하게 분석합니다: 기술 평가, 경력 제안, 개선 로드맵",
      uploadTitle: "문서 또는 오디오 파일 업로드",
      uploadDesc: "지원 형식: PDF, DOCX, TXT, MP3, WAV, OGG",
      uploadError: "요약을 생성하기 전에 문서 또는 오디오 파일을 업로드하세요",
      generateError: "요약 생성에 실패했습니다. 다시 시도하세요.",
      processing: "이력서 분석 중...",
      generateBtn: "이력서 분석",
      wordCount: "단어 수",
      readingTime: "읽기 시간",
      overview: "전체 요약",
      keyPoints: "주요 포인트",
      weaknesses: "약점 및 개선 제안",
      words: "단어",
      secondsRead: "초 읽기",
      minRead: "분 읽기",
      minSecRead: "분",
      secRead: "초 읽기",
      cvScore: "이력서 점수",
      skillsAnalysis: "기술 분석",
      careerRecommendations: "경력 추천",
      actionItems: "할 일",
      experienceHighlights: "경험 하이라이트",
      professionalSummary: "전문 요약",
      cvCompleteness: "이력서 완성도",
      overallRating: "종합 평가",
      matchScore: "매칭 점수",
      priority: "우선순위",
      impact: "영향",
      technical: "기술적",
      soft: "소프트 스킬",
      language: "언어",
      tool: "도구",
      high: "높음",
      medium: "보통",
      low: "낮음",
      complete: "완료",
      partial: "부분",
      missing: "누락"
    }
  };

  const t = translations[language];

  const formatReadingTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} ${t.secondsRead}`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes} ${t.minSecRead} ${remainingSeconds} ${t.secRead}`
      : `${minutes} ${t.minRead}`;
  };

  const handleSummarize = async () => {
    if (!uploadedFile) {
      setError(
        "Please upload a document or audio file before generating a summary"
      );
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await generateSummary(uploadedFile, 5, language);
      setSummary(response);
    } catch (err) {
      setError("Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative min-h-screen">
        <Animated3DBackground />
        
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"
              >
                <BookOpen className="w-6 h-6 sm:w-7 sm:w-7 lg:w-8 lg:h-8 text-white" />
              </motion.div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3 sm:mb-4">
              {t.title}
            </h1>
            <div className="flex items-start sm:items-center justify-center gap-2 text-gray-300 text-sm sm:text-base lg:text-lg px-4">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0 mt-0.5 sm:mt-0" />
              <p>{t.subtitle}</p>
            </div>
          </motion.div>

      <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 hover-scale">
        <FileUpload
          onFileChange={setUploadedFile}
          maxSizeInMB={50}
          validTypes={[
            "application/pdf",
            "application/msword",
            "text/plain",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "audio/mpeg",
            "audio/wav",
            "audio/ogg",
          ]}
          title="Upload your document or audio file"
          description="Supported formats: PDF, DOCX, TXT, MP3, WAV, OGG"
          icon={<Upload className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-purple-500 animate-float" />}
        />
      </div>

      {error && (
        <div className="mt-3 sm:mt-4 flex items-center justify-center text-red-600 text-sm sm:text-base px-4">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-6 sm:mt-8 flex flex-col items-center gap-4 sm:gap-6 animate-fade-in-up px-4">
        <div className="glass-effect rounded-xl p-4 sm:p-6 w-full max-w-md">
          <LanguageSelector
            value={language}
            onChange={setLanguage}
            disabled={isLoading}
          />
        </div>
        
        <Button
          onClick={handleSummarize}
          disabled={isLoading}
          variant={"default"}
          size={"lg"}
          className="btn-neon text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl animate-pulse-glow w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Processing file...</span>
              <span className="sm:hidden">Processing...</span>
            </>
          ) : (
            <>
              <span className="mr-2">✨</span>
              Generate Summary
            </>
          )}
        </Button>
      </div>

      {summary && (
        <div className="mt-8 sm:mt-12 animate-fade-in-up space-y-4 sm:space-y-6">
          
          {/* Overall Score & Rating Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl border border-white/10 overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* CV Score Circle */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(summary.cvCompleteness?.overallScore || 70) * 2.83} 283`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {summary.cvCompleteness?.overallScore || 70}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-400">{t.cvScore}</span>
                    </div>
                  </div>
                </div>

                {/* Overall Rating */}
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 sm:w-8 sm:h-8 ${
                          star <= Math.round((summary.overallRating || 7) / 2)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <span className="text-2xl sm:text-3xl font-bold text-white">{summary.overallRating || 7}/10</span>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">{t.overallRating}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-effect rounded-xl p-3 sm:p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-gray-400">{t.wordCount}</span>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-white">{summary.wordCount}</span>
                  </div>
                  <div className="glass-effect rounded-xl p-3 sm:p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-pink-400" />
                      <span className="text-xs text-gray-400">{t.readingTime}</span>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-white">{formatReadingTime(summary.readingTime)}</span>
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              {summary.professionalSummary && (
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <p className="text-gray-200 text-sm sm:text-base leading-relaxed italic">
                    "{summary.professionalSummary}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Skills Analysis */}
          {summary.skillsAnalysis && summary.skillsAnalysis.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-effect rounded-xl border border-white/10 overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-transparent">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  <h2 className="text-lg sm:text-xl font-semibold text-white">{t.skillsAnalysis}</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {/* Skills by Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['technical', 'soft', 'language', 'tool'].map((category) => {
                    const categorySkills = summary.skillsAnalysis?.filter(s => s.category === category) || [];
                    if (categorySkills.length === 0) return null;
                    
                    const categoryLabels: Record<string, string> = {
                      technical: t.technical,
                      soft: t.soft,
                      language: t.language,
                      tool: t.tool
                    };
                    
                    const categoryColors: Record<string, string> = {
                      technical: 'from-purple-500 to-blue-500',
                      soft: 'from-pink-500 to-rose-500',
                      language: 'from-green-500 to-emerald-500',
                      tool: 'from-orange-500 to-amber-500'
                    };

                    return (
                      <div key={category} className="space-y-3">
                        <h3 className={`text-sm font-semibold bg-gradient-to-r ${categoryColors[category]} bg-clip-text text-transparent`}>
                          {categoryLabels[category]}
                        </h3>
                        <div className="space-y-2">
                          {categorySkills.map((skill, idx) => (
                            <div key={idx} className="group">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-300">{skill.name}</span>
                                <div className="flex items-center gap-2">
                                  {skill.yearsOfExperience && (
                                    <span className="text-xs text-gray-500">{skill.yearsOfExperience}</span>
                                  )}
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
                                    {skill.level}
                                  </span>
                                </div>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(skill.rating / 5) * 100}%` }}
                                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                                  className={`h-full bg-gradient-to-r ${categoryColors[category]} rounded-full`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Career Recommendations */}
          {summary.careerRecommendations && summary.careerRecommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-xl border border-white/10 overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-transparent">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-400" />
                  <h2 className="text-lg sm:text-xl font-semibold text-white">{t.careerRecommendations}</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {summary.careerRecommendations.map((career, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * idx }}
                      className="group relative glass-effect rounded-xl p-4 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer"
                    >
                      {/* Match Score Badge */}
                      <div className={`absolute -top-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                        career.matchScore >= 80 ? 'bg-green-500' : 
                        career.matchScore >= 60 ? 'bg-yellow-500' : 'bg-orange-500'
                      } text-white shadow-lg`}>
                        {career.matchScore}%
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2 pr-10">{career.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{career.description}</p>
                      
                      {career.salaryRange && (
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-green-400">{career.salaryRange}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1.5">
                        {career.requiredSkills.slice(0, 4).map((skill, sIdx) => (
                          <span key={sIdx} className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                            {skill}
                          </span>
                        ))}
                        {career.requiredSkills.length > 4 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-400">
                            +{career.requiredSkills.length - 4}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Items */}
          {summary.actionItems && summary.actionItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-effect rounded-xl border border-white/10 overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-gradient-to-r from-amber-500/10 to-transparent">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-400" />
                  <h2 className="text-lg sm:text-xl font-semibold text-white">{t.actionItems}</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3">
                  {summary.actionItems.map((action, idx) => {
                    const priorityColors: Record<string, string> = {
                      high: 'border-red-500/50 bg-red-500/10',
                      medium: 'border-yellow-500/50 bg-yellow-500/10',
                      low: 'border-green-500/50 bg-green-500/10'
                    };
                    const priorityLabels: Record<string, string> = {
                      high: t.high,
                      medium: t.medium,
                      low: t.low
                    };
                    
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className={`flex items-start gap-4 p-4 rounded-xl border ${priorityColors[action.priority]} transition-all hover:scale-[1.02]`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          action.priority === 'high' ? 'bg-red-500' :
                          action.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}>
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white">{action.title}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              action.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                              action.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'
                            }`}>
                              {priorityLabels[action.priority]}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{action.description}</p>
                          {action.impact && (
                            <div className="flex items-center gap-2">
                              <ArrowUpRight className="w-4 h-4 text-purple-400" />
                              <span className="text-xs text-purple-300">{action.impact}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* CV Completeness */}
          {summary.cvCompleteness && summary.cvCompleteness.sections.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-effect rounded-xl border border-white/10 overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-gradient-to-r from-green-500/10 to-transparent">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-400" />
                  <h2 className="text-lg sm:text-xl font-semibold text-white">{t.cvCompleteness}</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {summary.cvCompleteness.sections.map((section, idx) => {
                    const statusColors: Record<string, string> = {
                      complete: 'text-green-400 bg-green-500/20',
                      partial: 'text-yellow-400 bg-yellow-500/20',
                      missing: 'text-red-400 bg-red-500/20'
                    };
                    const statusLabels: Record<string, string> = {
                      complete: t.complete,
                      partial: t.partial,
                      missing: t.missing
                    };
                    
                    return (
                      <div key={idx} className="glass-effect rounded-lg p-4 border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">{section.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[section.status]}`}>
                            {statusLabels[section.status]}
                          </span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${section.score}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className={`h-full rounded-full ${
                              section.score >= 80 ? 'bg-green-500' :
                              section.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{section.score}%</span>
                        {section.suggestions && section.suggestions.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {section.suggestions.map((suggestion, sIdx) => (
                              <p key={sIdx} className="text-xs text-gray-400 flex items-start gap-1">
                                <ChevronRight className="w-3 h-3 mt-0.5 text-purple-400 flex-shrink-0" />
                                {suggestion}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Experience Highlights */}
          {summary.experienceHighlights && summary.experienceHighlights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-effect rounded-xl border border-white/10 overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-transparent">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-lg sm:text-xl font-semibold text-white">{t.experienceHighlights}</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {summary.experienceHighlights.map((exp, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-cyan-500/30">
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-cyan-500"></div>
                      <div className="mb-2">
                        <h4 className="text-lg font-semibold text-white">{exp.role}</h4>
                        {(exp.company || exp.duration) && (
                          <p className="text-sm text-gray-400">
                            {exp.company}{exp.company && exp.duration && ' • '}{exp.duration}
                          </p>
                        )}
                      </div>
                      {exp.achievements.length > 0 && (
                        <ul className="space-y-1 mb-3">
                          {exp.achievements.map((achievement, aIdx) => (
                            <li key={aIdx} className="text-sm text-gray-300 flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      )}
                      {exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {exp.technologies.map((tech, tIdx) => (
                            <span key={tIdx} className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Key Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-effect rounded-xl border border-white/10 overflow-hidden"
          >
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-transparent">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                <h2 className="text-lg sm:text-xl font-semibold text-white">{t.keyPoints}</h2>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {(Array.isArray((summary as any).summary)
                  ? (summary as any).summary
                  : summary.summary
                      .split(/(?:\r\n|\r|\n|[.]\s+)/)
                      .map((s) => s.trim())
                      .filter(Boolean)
                ).map((point: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all group"
                  >
                    <div className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs sm:text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 leading-relaxed flex-1 pt-0.5 sm:pt-1 text-sm sm:text-base">{point}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Weaknesses & Improvements */}
          {summary.weaknesses && summary.weaknesses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-effect rounded-xl border border-white/10 overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-gradient-to-r from-red-500/10 to-transparent">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                  <h2 className="text-lg sm:text-xl font-semibold text-white">{t.weaknesses}</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {summary.weaknesses.map((w, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="rounded-lg bg-red-500/5 border border-red-500/20 overflow-hidden hover:border-red-500/40 transition-all"
                    >
                      <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-red-500/10 border-b border-red-500/20">
                        <div className="flex items-center gap-2 text-red-400 font-medium text-sm sm:text-base">
                          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-red-500"></span>
                          {w.issue}
                        </div>
                      </div>
                      <div className="px-4 sm:px-5 py-3 sm:py-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <span className="text-purple-400 font-semibold text-xs sm:text-sm mt-0.5">💡</span>
                          <p className="text-gray-300 leading-relaxed flex-1 text-sm sm:text-base">{w.suggestion}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
        </main>
      </div>
    </>
  );
};

export default SummarizePage;
