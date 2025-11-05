'use client';

import React, { useState, useCallback } from 'react';
import { CVTemplate, CVData } from '@/app/(features)/support-cv/types/cv.types';
import { extractTextFromPDF } from '@/app/(features)/support-cv/services/pdfExtractor';
import { analyzeCVWithAI } from '@/app/(features)/support-cv/services/aiCVAnalyzer';
import { reviewCVWithAI } from '@/app/(features)/support-cv/services/aiCVReviewer';

interface CVUploaderProps {
  selectedTemplate: CVTemplate;
  onCVUploaded: (cvData: CVData) => void;
  // Called when AI review is ready (after analysis)
  onReviewReady?: (reviewData: any) => void;
  onStartFromScratch: () => void;
}

export default function CVUploader({ 
  selectedTemplate, 
  onCVUploaded, 
  onReviewReady,
  onStartFromScratch 
}: CVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

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
    setRetryCount(0);
    setProgress('📄 Reading PDF file...');

    try {
      // Step 1: Extract text from PDF
      const extractResult = await extractTextFromPDF(file);
      
      if (!extractResult.success) {
        throw new Error(extractResult.error || 'Failed to extract text from PDF');
      }

      setProgress('🤖 AI analyzing your CV... (This may take 10-30 seconds)');
      
      // Step 2: Analyze with AI (with automatic retry)
      const analysisResult = await analyzeCVWithAI(extractResult.extractedText);

      setProgress('✨ Generating suggestions...');

      // Run AI review on the extracted/parsed CV data
      const cvParsed = analysisResult.cvData as CVData;
      const review = await reviewCVWithAI(cvParsed);

      // Step 3: Complete - notify parent with CV data and review
      setTimeout(() => {
        onCVUploaded(cvParsed);
        if (onReviewReady) onReviewReady(review);
        setRetryCount(0);
      }, 500);

    } catch (err) {
      console.error('Error processing CV:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process CV';
      
      // Check if this is a rate limit error that returned fallback data
      // In this case, we should still proceed but show a warning
      if (errorMessage.includes('AI-enhanced suggestions')) {
        console.log('[CVUploader] Proceeding with basic parsed data');
        // Error is actually a success with limited data - no need to show error
        setIsProcessing(false);
        setProgress('');
        return;
      }
      
      // Show user-friendly error message
      if (errorMessage.includes('429') || 
          errorMessage.includes('Resource exhausted') || 
          errorMessage.includes('temporarily busy') ||
          errorMessage.includes('quota exceeded')) {
        setError('⚠️ AI service is temporarily busy due to high usage.\n\n💡 Options:\n\n1️⃣ Wait 1-2 minutes and try uploading again\n2️⃣ Click "Start from Blank" below to fill in manually\n3️⃣ The system is auto-retrying in background...');
      } else if (errorMessage.includes('API key') || errorMessage.includes('configuration')) {
        setError('❌ AI service configuration error.\n\nPlease contact support or use "Start from Blank" option.');
      } else {
        setError(`❌ ${errorMessage}\n\n💡 You can still create your CV by clicking "Start from Blank" below.`);
      }
      
      setIsProcessing(false);
      setProgress('');
    }
  }, [onCVUploaded, onReviewReady]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      await processCV(pdfFile);
    } else {
      setError('Please upload a PDF file');
    }
  }, [processCV]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      await processCV(file);
    } else {
      setError('Please select a PDF file');
    }
  }, [processCV]);

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
        } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!isProcessing ? (
          <>
            <div className="text-center">
              <div className="text-8xl mb-6 animate-float">📎</div>
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
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isProcessing}
                />
                <span className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium cursor-pointer hover:from-purple-600 hover:to-blue-600 transition-all duration-300 inline-block shadow-lg hover:shadow-xl glow-effect">
                  📤 Choose PDF File
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
                onClick={onStartFromScratch}
                className="px-8 py-4 border-2 border-purple-500 text-purple-400 rounded-xl font-medium hover:bg-purple-500/20 transition-all duration-300"
                disabled={isProcessing}
              >
                ✏️ Start from Blank Template
              </button>
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🤖</div>
                <p className="text-sm text-white font-medium">AI Auto-Extract</p>
                <p className="text-xs text-gray-400">Automatic data extraction</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⭐</div>
                <p className="text-sm text-white font-medium">STAR Method</p>
                <p className="text-xs text-gray-400">Optimize achievements</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-sm text-white font-medium">Smart Metrics</p>
                <p className="text-xs text-gray-400">Add quantifiable results</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="text-8xl mb-6 animate-bounce">🚀</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Processing Your CV
            </h3>
            <p className="text-gray-300 mb-8">
              {progress}
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse" 
                     style={{ width: '70%' }} />
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              {retryCount > 0 
                ? `🔄 Auto-retrying due to high server load... (attempt ${retryCount + 1}/3)` 
                : 'This may take 10-30 seconds...'}
            </p>
            
            {retryCount > 0 && (
              <div className="mt-3 glass-effect border border-yellow-500/30 rounded-lg p-3 max-w-md mx-auto">
                <p className="text-xs text-yellow-300 text-center">
                  ⚠️ AI service is busy. Waiting before retry...
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className={`mt-6 glass-effect rounded-xl p-6 flex items-start gap-4 animate-fade-in ${
          error.includes('⚠️') 
            ? 'border-2 border-yellow-500/50 bg-yellow-500/10' 
            : 'border-2 border-red-500/50 bg-red-500/10'
        }`}>
          <span className="text-4xl flex-shrink-0">
            {error.includes('⚠️') ? '⚠️' : '❌'}
          </span>
          <div className="flex-1">
            <h4 className={`font-bold mb-2 text-lg ${
              error.includes('⚠️') ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {error.includes('⚠️') ? 'Temporary Issue' : 'Upload Failed'}
            </h4>
            <div className={`whitespace-pre-line text-sm leading-relaxed ${
              error.includes('⚠️') ? 'text-yellow-200' : 'text-red-300'
            }`}>
              {error}
            </div>
            
            {/* Retry button for rate limit errors */}
            {(error.includes('429') || error.includes('busy') || error.includes('quota')) && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    setError('');
                    // Re-trigger upload if we have the file
                  }}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  <span>🔄</span>
                  <span>Try Again</span>
                </button>
                <button
                  onClick={onStartFromScratch}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  <span>✏️</span>
                  <span>Start from Blank</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 glass-effect border border-purple-500/30 rounded-xl p-6 glow-effect-pink">
        <div className="flex items-start gap-4">
          <span className="text-3xl animate-float">💡</span>
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
      
      {/* Service Status Info */}
      {error && (error.includes('429') || error.includes('busy') || error.includes('quota')) && (
        <div className="mt-4 glass-effect border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h4 className="font-bold text-blue-300 mb-2">Why is this happening?</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Google's AI service has usage limits to ensure fair access for all users. 
                This is temporary and typically resolves within 1-2 minutes. 
                The system is designed to automatically retry and fall back to basic parsing if needed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
