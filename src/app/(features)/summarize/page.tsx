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
      title: "Tóm tắt tri thức",
      subtitle: "Chuyển đổi tài liệu hoặc file âm thanh của bạn thành bản tóm tắt ngắn gọn với AI",
      uploadTitle: "Tải lên tài liệu hoặc file âm thanh của bạn",
      uploadDesc: "Định dạng hỗ trợ: PDF, DOCX, TXT, MP3, WAV, OGG",
      uploadError: "Vui lòng tải lên tài liệu hoặc file âm thanh trước khi tạo tóm tắt",
      generateError: "Không thể tạo tóm tắt. Vui lòng thử lại.",
      processing: "Đang xử lý file...",
      generateBtn: "Tạo tóm tắt",
      wordCount: "Số từ",
      readingTime: "Thời gian đọc",
      overview: "Tóm tắt tổng quan",
      keyPoints: "Các điểm chính",
      weaknesses: "Nhược điểm & Gợi ý cải thiện",
      words: "từ",
      secondsRead: "giây đọc",
      minRead: "phút đọc",
      minSecRead: "phút",
      secRead: "giây đọc"
    },
    en: {
      title: "Summarize Knowledge",
      subtitle: "Transform your documents or audio files into concise, actionable summaries with AI",
      uploadTitle: "Upload your document or audio file",
      uploadDesc: "Supported formats: PDF, DOCX, TXT, MP3, WAV, OGG",
      uploadError: "Please upload a document or audio file before generating a summary",
      generateError: "Failed to generate summary. Please try again.",
      processing: "Processing file...",
      generateBtn: "Generate Summary",
      wordCount: "Word Count",
      readingTime: "Reading Time",
      overview: "Overview Summary",
      keyPoints: "Key Points",
      weaknesses: "Weaknesses & Improvement Suggestions",
      words: "words",
      secondsRead: "seconds read",
      minRead: "min read",
      minSecRead: "min",
      secRead: "sec read"
    },
    ja: {
      title: "知識の要約",
      subtitle: "AIでドキュメントや音声ファイルを簡潔な要約に変換",
      uploadTitle: "ドキュメントまたは音声ファイルをアップロード",
      uploadDesc: "サポート形式: PDF、DOCX、TXT、MP3、WAV、OGG",
      uploadError: "要約を生成する前にドキュメントまたは音声ファイルをアップロードしてください",
      generateError: "要約の生成に失敗しました。もう一度お試しください。",
      processing: "ファイルを処理中...",
      generateBtn: "要約を生成",
      wordCount: "単語数",
      readingTime: "読書時間",
      overview: "概要",
      keyPoints: "主要なポイント",
      weaknesses: "弱点と改善提案",
      words: "単語",
      secondsRead: "秒読む",
      minRead: "分読む",
      minSecRead: "分",
      secRead: "秒読む"
    },
    zh: {
      title: "知识摘要",
      subtitle: "使用AI将您的文档或音频文件转换为简洁的摘要",
      uploadTitle: "上传您的文档或音频文件",
      uploadDesc: "支持格式：PDF、DOCX、TXT、MP3、WAV、OGG",
      uploadError: "请在生成摘要之前上传文档或音频文件",
      generateError: "生成摘要失败。请重试。",
      processing: "正在处理文件...",
      generateBtn: "生成摘要",
      wordCount: "字数",
      readingTime: "阅读时间",
      overview: "总体概述",
      keyPoints: "要点",
      weaknesses: "弱点与改进建议",
      words: "字",
      secondsRead: "秒阅读",
      minRead: "分钟阅读",
      minSecRead: "分钟",
      secRead: "秒阅读"
    },
    ko: {
      title: "지식 요약",
      subtitle: "AI로 문서나 오디오 파일을 간결한 요약으로 변환하세요",
      uploadTitle: "문서 또는 오디오 파일 업로드",
      uploadDesc: "지원 형식: PDF, DOCX, TXT, MP3, WAV, OGG",
      uploadError: "요약을 생성하기 전에 문서 또는 오디오 파일을 업로드하세요",
      generateError: "요약 생성에 실패했습니다. 다시 시도하세요.",
      processing: "파일 처리 중...",
      generateBtn: "요약 생성",
      wordCount: "단어 수",
      readingTime: "읽기 시간",
      overview: "전체 요약",
      keyPoints: "주요 포인트",
      weaknesses: "약점 및 개선 제안",
      words: "단어",
      secondsRead: "초 읽기",
      minRead: "분 읽기",
      minSecRead: "분",
      secRead: "초 읽기"
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
        
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"
              >
                <BookOpen className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
              {t.title}
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-300 text-lg">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <p>{t.subtitle}</p>
            </div>
          </motion.div>

      <div className="glass-effect rounded-2xl p-8 mb-8 hover-scale">
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
          icon={<Upload className="h-12 w-12 text-purple-500 animate-float" />}
        />
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-center text-red-600">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-6 animate-fade-in-up">
        <div className="glass-effect rounded-xl p-6 w-full max-w-md">
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
          className="btn-neon text-white px-8 py-6 text-lg rounded-xl animate-pulse-glow"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Processing file...
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
        <div className="mt-12 animate-fade-in-up space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-effect rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Word Count</p>
                  <p className="text-2xl font-bold text-white">{summary.wordCount}</p>
                </div>
              </div>
            </div>
            <div className="glass-effect rounded-xl p-6 border border-white/10 hover:border-pink-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Reading Time</p>
                  <p className="text-2xl font-bold text-white">{formatReadingTime(summary.readingTime)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Summary - Tree Structure */}
          <div className="glass-effect rounded-xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-transparent">
              <h2 className="text-xl font-semibold text-white">📝 Tóm tắt tổng quan</h2>
            </div>
            <div className="p-6">
              {/* Parse and display summary as tree structure */}
              {(() => {
                const summaryText = summary.summary;
                const sections = summaryText.split(/\n\n|\. (?=[A-Z]|Kỹ năng|Công nghệ|Thành tích|Vai trò)/).filter(Boolean);
                
                return (
                  <div className="space-y-4">
                    {sections.map((section, idx) => {
                      // Check if this is a main category
                      const isCategory = /^(Kỹ năng|Công nghệ|Thành tích|Vai trò|Kinh nghiệm)/.test(section);
                      
                      if (isCategory) {
                        const [title, ...content] = section.split(':');
                        const items = content.join(':').split(/,(?=\s)/).filter(Boolean);
                        
                        return (
                          <div key={idx} className="relative pl-6 border-l-2 border-purple-500/30">
                            {/* Category Title */}
                            <div className="absolute -left-3 top-1 h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-white"></div>
                            </div>
                            <div className="mb-3">
                              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                                {title.trim()}
                              </h3>
                            </div>
                            
                            {/* Sub-items */}
                            <div className="space-y-2 ml-4">
                              {items.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex items-start gap-3 group">
                                  <div className="flex-shrink-0 mt-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400 group-hover:bg-pink-400 transition-colors"></div>
                                  </div>
                                  <p className="text-gray-300 leading-relaxed flex-1">
                                    {item.trim()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      } else {
                        // Regular paragraph
                        return (
                          <div key={idx} className="relative pl-6 border-l-2 border-purple-500/20">
                            <div className="absolute -left-2 top-2 h-3 w-3 rounded-full bg-purple-500/50"></div>
                            <p className="text-gray-300 leading-relaxed">
                              {section.trim()}
                            </p>
                          </div>
                        );
                      }
                    })}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Key Points */}
          <div className="glass-effect rounded-xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-transparent">
              <div className="flex items-center gap-2">
                <List className="h-5 w-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Các điểm chính</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {(Array.isArray((summary as any).summary)
                  ? (summary as any).summary
                  : summary.summary
                      .split(/(?:\r\n|\r|\n|[.]\s+)/)
                      .map((s) => s.trim())
                      .filter(Boolean)
                ).map((point: string, index: number) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all group"
                  >
                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 leading-relaxed flex-1 pt-1">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weaknesses & Improvements */}
          {summary.weaknesses && summary.weaknesses.length > 0 && (
            <div className="glass-effect rounded-xl border border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-red-500/10 to-transparent">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <h2 className="text-xl font-semibold text-white">Nhược điểm & Gợi ý cải thiện</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {summary.weaknesses.map((w, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-red-500/5 border border-red-500/20 overflow-hidden hover:border-red-500/40 transition-all"
                    >
                      <div className="px-5 py-3 bg-red-500/10 border-b border-red-500/20">
                        <div className="flex items-center gap-2 text-red-400 font-medium">
                          <span className="h-2 w-2 rounded-full bg-red-500"></span>
                          {w.issue}
                        </div>
                      </div>
                      <div className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <span className="text-purple-400 font-semibold text-sm mt-0.5">💡</span>
                          <p className="text-gray-300 leading-relaxed flex-1">{w.suggestion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
        </main>
      </div>
    </>
  );
};

export default SummarizePage;
