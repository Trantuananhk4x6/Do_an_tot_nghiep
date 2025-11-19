// ============================================================================
// Custom Hook: useCVUpload
// Handles file upload, PDF extraction, and AI analysis
// ============================================================================

import { useState, useCallback } from 'react';
import { CVData } from '../types/cv.types';
import { pdfExtractor } from '../services/pdf/extractor.service';
import { cvAnalyzer } from '../services/ai/analyzer.service';
import { getUserFriendlyError } from '../lib/errors';

// ============================================================================
// Types
// ============================================================================

export interface UploadState {
  isProcessing: boolean;
  progress: number;
  currentStep: string;
  error: string | null;
}

export interface UploadResult {
  cvData: CVData;
  score: number;
  missingFields: string[];
}

// ============================================================================
// Hook
// ============================================================================

export function useCVUpload() {
  const [state, setState] = useState<UploadState>({
    isProcessing: false,
    progress: 0,
    currentStep: '',
    error: null
  });

  const updateProgress = useCallback((progress: number, step: string) => {
    setState(prev => ({ ...prev, progress, currentStep: step }));
  }, []);

  const uploadAndAnalyze = useCallback(async (file: File): Promise<UploadResult | null> => {
    setState({
      isProcessing: true,
      progress: 0,
      currentStep: 'Starting...',
      error: null
    });

    try {
      // Step 1: Extract PDF text (0-40%)
      updateProgress(10, 'Reading PDF file...');
      const extractResult = await pdfExtractor.extractText(file);

      if (!extractResult.success) {
        throw new Error('PDF extraction failed');
      }

      updateProgress(40, 'PDF extracted successfully');
      console.log(`[useCVUpload] Extracted ${extractResult.data.text.length} characters from PDF`);

      // Step 2: AI Analysis (40-90%)
      updateProgress(50, 'Analyzing CV with AI...');
      const analysisResult = await cvAnalyzer.analyze(extractResult.data.text);

      if (!analysisResult.success) {
        throw new Error('AI analysis failed');
      }

      updateProgress(90, 'Analysis complete!');

      // Step 3: Complete (90-100%)
      updateProgress(100, 'Done!');
      
      // Reset state after short delay
      setTimeout(() => {
        setState({
          isProcessing: false,
          progress: 0,
          currentStep: '',
          error: null
        });
      }, 1000);

      return {
        cvData: analysisResult.data.cvData,
        score: analysisResult.data.score,
        missingFields: analysisResult.data.missingFields
      };

    } catch (error: any) {
      console.error('[useCVUpload] Error:', error);
      
      const errorMessage = getUserFriendlyError(error);
      setState({
        isProcessing: false,
        progress: 0,
        currentStep: '',
        error: errorMessage
      });

      return null;
    }
  }, [updateProgress]);

  const reset = useCallback(() => {
    setState({
      isProcessing: false,
      progress: 0,
      currentStep: '',
      error: null
    });
  }, []);

  return {
    ...state,
    uploadAndAnalyze,
    reset
  };
}
