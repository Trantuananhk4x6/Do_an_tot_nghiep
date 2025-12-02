"use client";

import { motion } from "framer-motion";
import { FileText, Upload, CheckCircle, Brain, Sparkles, Zap, SkipForward } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { analyzeCV, CVAnalysisResult } from "../services/cvMatchService";
import { extractTextFromFile } from "../services/resumeAnalysisService";

interface CVUploadStepProps {
  onFileUpload: (file: File, analysis: CVAnalysisResult | null) => void;
  onSkip?: () => void;
  language: 'vi' | 'en' | 'ja' | 'zh' | 'ko';
}

const translations = {
  vi: {
    title: "Tải lên CV của bạn",
    subtitle: "Chúng tôi sẽ phân tích CV để tạo câu hỏi phù hợp với kỹ năng và kinh nghiệm của bạn",
    dragDrop: "Kéo & thả file vào đây",
    or: "hoặc",
    browse: "Chọn file",
    supportedFormats: "Hỗ trợ PDF, DOCX, TXT (tối đa 10MB)",
    analyzing: "Đang phân tích CV...",
    uploadedSuccess: "Đã tải lên thành công",
    features: [
      "Nhận diện kỹ năng tự động",
      "Đề xuất ngành nghề phù hợp",
      "Câu hỏi được cá nhân hóa"
    ],
    tip: "Mẹo: CV càng chi tiết, câu hỏi càng chính xác!",
    skip: "Bỏ qua bước này",
    optional: "(Không bắt buộc)"
  },
  en: {
    title: "Upload Your CV",
    subtitle: "We'll analyze your CV to create questions matching your skills and experience",
    dragDrop: "Drag & drop your file here",
    or: "or",
    browse: "Browse files",
    supportedFormats: "Supports PDF, DOCX, TXT (max 10MB)",
    analyzing: "Analyzing CV...",
    uploadedSuccess: "Uploaded successfully",
    features: [
      "Automatic skill detection",
      "Career field suggestions",
      "Personalized questions"
    ],
    tip: "Tip: More detailed CV = More accurate questions!",
    skip: "Skip this step",
    optional: "(Optional)"
  },
  ja: {
    title: "履歴書をアップロード",
    subtitle: "スキルと経験に合わせた質問を作成するために履歴書を分析します",
    dragDrop: "ファイルをドラッグ＆ドロップ",
    or: "または",
    browse: "ファイルを選択",
    supportedFormats: "PDF、DOCX、TXTをサポート（最大10MB）",
    analyzing: "履歴書を分析中...",
    uploadedSuccess: "アップロード成功",
    features: [
      "自動スキル検出",
      "キャリア分野の提案",
      "パーソナライズされた質問"
    ],
    tip: "ヒント: 詳細な履歴書 = より正確な質問！",
    skip: "このステップをスキップ",
    optional: "（オプション）"
  },
  zh: {
    title: "上传您的简历",
    subtitle: "我们将分析您的简历，创建符合您技能和经验的问题",
    dragDrop: "将文件拖放到此处",
    or: "或",
    browse: "浏览文件",
    supportedFormats: "支持 PDF、DOCX、TXT（最大10MB）",
    analyzing: "正在分析简历...",
    uploadedSuccess: "上传成功",
    features: [
      "自动技能检测",
      "职业领域建议",
      "个性化问题"
    ],
    tip: "提示：简历越详细，问题越准确！",
    skip: "跳过此步骤",
    optional: "（可选）"
  },
  ko: {
    title: "이력서 업로드",
    subtitle: "귀하의 기술과 경험에 맞는 질문을 만들기 위해 이력서를 분석합니다",
    dragDrop: "파일을 여기에 드래그 앤 드롭",
    or: "또는",
    browse: "파일 선택",
    supportedFormats: "PDF, DOCX, TXT 지원 (최대 10MB)",
    analyzing: "이력서 분석 중...",
    uploadedSuccess: "업로드 성공",
    features: [
      "자동 기술 감지",
      "직업 분야 제안",
      "맞춤형 질문"
    ],
    tip: "팁: 상세한 이력서 = 더 정확한 질문!",
    skip: "이 단계 건너뛰기",
    optional: "(선택 사항)"
  }
};

export default function CVUploadStep({
  onFileUpload,
  onSkip,
  language
}: CVUploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(null);
  const t = translations[language];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setUploadedFile(file);
    
    try {
      // Extract text from file
      const extractedData = await extractTextFromFile(file);
      
      // Analyze CV using the extracted text content
      const analysis = await analyzeCV(extractedData.content);
      
      setAnalysisResult(analysis);
      onFileUpload(file, analysis);
    } catch (error) {
      console.error('Error analyzing CV:', error);
      onFileUpload(file, null);
    } finally {
      setIsAnalyzing(false);
    }
  }, [onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && isValidFile(file)) {
      processFile(file);
    }
  }, [processFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidFile(file)) {
      processFile(file);
    }
  }, [processFile]);

  const isValidFile = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          {t.title} <span className="text-gray-500 text-lg font-normal">{t.optional}</span>
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto">{t.subtitle}</p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mb-8"
      >
        <div
          className={cn(
            "relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden",
            isDragging 
              ? "border-purple-500 bg-purple-500/10 scale-[1.02]" 
              : uploadedFile && !isAnalyzing
                ? "border-green-500/50 bg-green-500/5"
                : "border-white/20 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Background Animation */}
          {isAnalyzing && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          )}

          <div className="relative p-8 sm:p-12 text-center">
            {isAnalyzing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="relative w-20 h-20 mx-auto">
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-purple-500/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute inset-2 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  <Brain className="absolute inset-0 m-auto w-8 h-8 text-purple-500" />
                </div>
                <p className="text-lg text-purple-400 font-medium">{t.analyzing}</p>
                <div className="flex justify-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-purple-500"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : uploadedFile ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-lg text-green-500 font-medium">{t.uploadedSuccess}</p>
                <p className="text-sm text-gray-400">{uploadedFile.name}</p>
                
                {/* Analysis Summary */}
                {analysisResult && (
                  <div className="mt-4 p-4 rounded-xl bg-gray-800/50 text-left">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Skills detected</p>
                        <p className="text-white font-medium">{analysisResult.detectedSkills.length} skills</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Experience</p>
                        <p className="text-white font-medium">{analysisResult.experienceYears} years</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Best match</p>
                        <p className="text-white font-medium">
                          {analysisResult.matchedFields[0]?.field.name || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Match score</p>
                        <p className="text-white font-medium">
                          {analysisResult.matchedFields[0]?.matchScore || 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="space-y-4">
                <motion.div
                  className="w-16 h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                </motion.div>
                
                <div>
                  <p className="text-lg text-gray-300 font-medium">{t.dragDrop}</p>
                  <p className="text-gray-500 my-2">{t.or}</p>
                  <label className="inline-block">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileChange}
                    />
                    <span className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium cursor-pointer hover:opacity-90 transition-opacity">
                      {t.browse}
                    </span>
                  </label>
                </div>
                
                <p className="text-sm text-gray-500">{t.supportedFormats}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        {t.features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
              {index === 0 && <Sparkles className="w-5 h-5 text-purple-400" />}
              {index === 1 && <Zap className="w-5 h-5 text-pink-400" />}
              {index === 2 && <Brain className="w-5 h-5 text-blue-400" />}
            </div>
            <span className="text-sm text-gray-300">{feature}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Skip Button */}
      {onSkip && !uploadedFile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <button
            onClick={onSkip}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-4 h-4" />
            <span>{t.skip}</span>
          </button>
        </motion.div>
      )}

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-4"
      >
        <p className="text-sm text-gray-500">
          💡 {t.tip}
        </p>
      </motion.div>
    </div>
  );
}
