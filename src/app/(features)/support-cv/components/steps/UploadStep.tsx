'use client';

import React, { useCallback } from 'react';
import { useCVBuilder } from '../../contexts/CVBuilderContext';
import { useCVUpload } from '../../hooks/useCVUpload';
import { useCVReview } from '../../hooks/useCVReview';
import { Paperclip, Upload, Edit, Bot, Star, BarChart2, Rocket, XCircle, Lightbulb } from 'lucide-react';

// ============================================================================
// Component
// ============================================================================

export function UploadStep() {
  const { actions } = useCVBuilder();
  const upload = useCVUpload();
  const review = useCVReview();

  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    // Upload and analyze
    const result = await upload.uploadAndAnalyze(file);
    
    if (!result) {
      return; // Error already handled
    }

    // Set CV data immediately
    actions.setCVData(result.cvData);

    // Start review in background (non-blocking)
    review.review(result.cvData).then(reviewData => {
      if (reviewData) {
        actions.setReviewData(reviewData);
      }
    });

  }, [upload, review, actions]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');

    if (pdfFile) {
      await handleFileSelect(pdfFile);
    } else {
      alert('Please upload a PDF file');
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      await handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleStartFromScratch = useCallback(() => {
    actions.setStep('edit');
  }, [actions]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          Upload Your CV
        </h2>
        <p className="text-gray-300">
          Upload your existing CV or start from scratch
        </p>
      </div>

      {/* Drag & Drop Area */}
      <div
        className={`relative border-4 border-dashed rounded-3xl p-12 transition-all duration-300 ${
          isDragging
            ? 'border-purple-500 glass-effect scale-105 glow-effect'
            : 'glass-effect border-white/20 hover:border-purple-400'
        } ${upload.isProcessing ? 'pointer-events-none opacity-60' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
      >
        {!upload.isProcessing ? (
          <>
            <div className="text-center">
              <Paperclip className="w-20 h-20 mx-auto mb-6 text-purple-400 animate-float" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Drop your CV PDF here
              </h3>
              <p className="text-gray-300 mb-6">
                AI will automatically extract and optimize your information
              </p>

              {/* Upload Button */}
              <label className="inline-block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={upload.isProcessing}
                />
                <span className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium cursor-pointer hover:from-purple-600 hover:to-blue-600 transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl glow-effect">
                  <Upload className="w-5 h-5" />
                  Choose PDF File
                </span>
              </label>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 border-t border-white/20" />
                <span className="text-gray-400 font-medium">OR</span>
                <div className="flex-1 border-t border-white/20" />
              </div>

              {/* Start from Scratch */}
              <button
                onClick={handleStartFromScratch}
                className="px-8 py-4 border-2 border-purple-500 text-purple-400 rounded-xl font-medium hover:bg-purple-500/20 transition-all duration-300 inline-flex items-center gap-2"
                disabled={upload.isProcessing}
              >
                <Edit className="w-5 h-5" />
                Start from Blank Template
              </button>
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <Bot className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-sm text-white font-medium">AI Auto-Extract</p>
                <p className="text-xs text-gray-400">Automatic data extraction</p>
              </div>
              <div className="text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <p className="text-sm text-white font-medium">STAR Method</p>
                <p className="text-xs text-gray-400">Optimize achievements</p>
              </div>
              <div className="text-center">
                <BarChart2 className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p className="text-sm text-white font-medium">Smart Metrics</p>
                <p className="text-xs text-gray-400">Add quantifiable results</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <Rocket className="w-20 h-20 mx-auto mb-6 text-purple-400 animate-bounce" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Processing Your CV
            </h3>
            <p className="text-gray-300 mb-8">
              {upload.currentStep}
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${upload.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">{upload.progress}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {upload.error && (
        <div className="mt-6 glass-effect border-2 border-red-500/50 rounded-xl p-6 flex items-start gap-4 animate-fade-in bg-red-500/10">
          <XCircle className="w-10 h-10 flex-shrink-0 text-red-400" />
          <div className="flex-1">
            <h4 className="font-bold text-red-400 mb-2 text-lg">
              Upload Failed
            </h4>
            <p className="text-red-300 text-sm leading-relaxed whitespace-pre-line">
              {upload.error}
            </p>
            <button
              onClick={upload.reset}
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 glass-effect border border-purple-500/30 rounded-xl p-6 glow-effect-pink">
        <div className="flex items-start gap-4">
          <Lightbulb className="w-8 h-8 flex-shrink-0 text-yellow-400 animate-float" />
          <div>
            <h4 className="font-bold text-purple-300 mb-2">Tips for Best Results</h4>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Upload a clear, text-based PDF (not scanned images)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Make sure your CV includes contact info, experience, and skills</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>AI will optimize your content using STAR method and action verbs</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span className="text-yellow-300">If AI is busy, the system will auto-retry or use basic parsing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
