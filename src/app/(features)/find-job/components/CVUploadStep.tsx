'use client';

import React, { useState, useCallback } from 'react';
import { pdfExtractor } from '@/app/(features)/support-cv/services/pdf/extractor.service';

interface CVUploadStepProps {
  onCVAnalyzed: (cvText: string) => void;
}

export default function CVUploadStep({ onCVAnalyzed }: CVUploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

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
        const errorMsg = (result as any).error?.message || 'Cannot read PDF file';
        throw new Error(errorMsg);
      }

      const extractedText = result.data.text;
      console.log('✅ Đã đọc CV thành công, độ dài:', extractedText.length);
      
      if (!extractedText || extractedText.trim().length < 50) {
        throw new Error('CV does not have enough content. Please check the PDF file again.');
      }

      // Pass extracted text to parent
      onCVAnalyzed(extractedText);
    } catch (err) {
      console.error('❌ Lỗi khi xử lý CV:', err);
      setError(err instanceof Error ? err.message : 'Cannot process CV');
      setIsProcessing(false);
    }
  }, [onCVAnalyzed]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      await processCV(pdfFile);
    } else {
      setError('Please upload PDF file');
    }
  }, [processCV]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      await processCV(file);
    } else {
      setError('Please select PDF file');
    }
  }, [processCV]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          🎯 Find Your Dream Job
        </h2>
        <p className="text-gray-300">
          Upload your CV to find the most suitable jobs
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
            <div className="text-8xl mb-6 animate-float">📋</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Drag and drop your CV here
            </h3>
            <p className="text-gray-300 mb-6">
              We will analyze your CV and suggest suitable jobs
            </p>

            <label className="inline-block">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isProcessing}
              />
              <span className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium cursor-pointer hover:from-purple-600 hover:to-blue-600 transition-all duration-300 inline-block shadow-lg hover:shadow-xl glow-effect">
                📤 Select CV File (PDF)
              </span>
            </label>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-8xl mb-6 animate-bounce">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Analyzing your CV...
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
            <span className="text-4xl">❌</span>
            <div>
              <h4 className="font-bold text-red-400 text-lg mb-2">Error</h4>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="mt-12 grid grid-cols-3 gap-6">
        <div className="text-center glass-effect rounded-xl p-6">
          <div className="text-4xl mb-3">🤖</div>
          <p className="text-sm text-white font-medium">Smart Analysis</p>
          <p className="text-xs text-gray-400">AI analyzes skills & experience</p>
        </div>
        <div className="text-center glass-effect rounded-xl p-6">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-sm text-white font-medium">Accurate Suggestions</p>
          <p className="text-xs text-gray-400">Find jobs matching your profile</p>
        </div>
        <div className="text-center glass-effect rounded-xl p-6">
          <div className="text-4xl mb-3">🌎</div>
          <p className="text-sm text-white font-medium">Multiple Sources</p>
          <p className="text-xs text-gray-400">TopCV, ITviec, LinkedIn...</p>
        </div>
      </div>
    </div>
  );
}
