'use client';

import React, { useState, useCallback } from 'react';
import { pdfExtractor } from '@/app/(features)/support-cv/services/pdf/extractor.service';
import { 
  FileText, 
  Upload, 
  Search, 
  AlertCircle, 
  Bot, 
  Target, 
  Globe,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CVUploadStepProps {
  onCVAnalyzed: (cvText: string) => void;
}

export default function CVUploadStep({ onCVAnalyzed }: CVUploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const { language, t } = useLanguage();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processCV = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError('');

    try {
      console.log('🔍 Bắt đầu đọc CV:', file.name);
      const result = await pdfExtractor.extractText(file);
      
      if (!result.success) {
        const errorMsg = (result as any).error?.message || 
          (language === 'vi' ? 'Không thể đọc file PDF' : 'Cannot read PDF file');
        throw new Error(errorMsg);
      }

      const extractedText = result.data.text;
      console.log('✅ Đã đọc CV thành công, độ dài:', extractedText.length);
      
      if (!extractedText || extractedText.trim().length < 50) {
        throw new Error(
          language === 'vi' 
            ? 'CV không có đủ nội dung. Vui lòng kiểm tra lại file PDF.'
            : 'CV does not have enough content. Please check the PDF file again.'
        );
      }

      // Pass extracted text to parent
      onCVAnalyzed(extractedText);
    } catch (err) {
      console.error('❌ Lỗi khi xử lý CV:', err);
      setError(err instanceof Error ? err.message : 
        (language === 'vi' ? 'Không thể xử lý CV' : 'Cannot process CV'));
      setIsProcessing(false);
    }
  }, [onCVAnalyzed, language]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      await processCV(pdfFile);
    } else {
      setError(language === 'vi' ? 'Vui lòng tải lên file PDF' : 'Please upload PDF file');
    }
  }, [processCV, language]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      await processCV(file);
    } else {
      setError(language === 'vi' ? 'Vui lòng chọn file PDF' : 'Please select PDF file');
    }
  }, [processCV, language]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          {t.upload.title}
        </h2>
        <p className="text-gray-300">
          {t.upload.subtitle}
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-4 border-dashed rounded-3xl p-12 transition-all duration-300 ${
          isDragging
            ? 'border-purple-500 glass-effect scale-105 glow-effect'
            : 'glass-effect border-white/20 hover:border-purple-400'
        } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!isProcessing ? (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center animate-float">
              <FileText className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {language === 'vi' ? 'Kéo thả CV của bạn vào đây' : 'Drag and drop your CV here'}
            </h3>
            <p className="text-gray-300 mb-6">
              {language === 'vi' 
                ? 'Chúng tôi sẽ phân tích CV và đề xuất công việc phù hợp'
                : 'We will analyze your CV and suggest suitable jobs'
              }
            </p>

            <label className="inline-block">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isProcessing}
              />
              <span className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium cursor-pointer hover:from-purple-600 hover:to-blue-600 transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl glow-effect">
                <Upload className="w-5 h-5" />
                {t.upload.button}
              </span>
            </label>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center animate-bounce">
              <Search className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {t.upload.analyzing}
            </h3>
            <div className="max-w-md mx-auto">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse" 
                     style={{ width: '70%' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 glass-effect rounded-xl p-6 border-2 border-red-500/50 bg-red-500/10 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h4 className="font-bold text-red-400 text-lg mb-2">
                {t.upload.error}
              </h4>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="mt-12 grid grid-cols-3 gap-6">
        <div className="text-center glass-effect rounded-xl p-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-sm text-white font-medium">
            {t.upload.features.analyze}
          </p>
        </div>
        <div className="text-center glass-effect rounded-xl p-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-sm text-white font-medium">
            {t.upload.features.extract}
          </p>
        </div>
        <div className="text-center glass-effect rounded-xl p-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
            <Globe className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-sm text-white font-medium">
            {t.upload.features.match}
          </p>
        </div>
      </div>
    </div>
  );
}
