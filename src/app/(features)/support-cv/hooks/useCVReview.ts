// ============================================================================
// Custom Hook: useCVReview
// Handles CV review with AI
// ============================================================================

import { useState, useCallback } from 'react';
import { CVData } from '../types/cv.types';
import { cvReviewer, CVReview } from '../services/ai/reviewer.service';
import { getUserFriendlyError } from '../lib/errors';

// ============================================================================
// Types
// ============================================================================

export interface ReviewState {
  isReviewing: boolean;
  error: string | null;
}

// ============================================================================
// Hook
// ============================================================================

export function useCVReview() {
  const [state, setState] = useState<ReviewState>({
    isReviewing: false,
    error: null
  });

  const review = useCallback(async (cvData: CVData): Promise<CVReview | null> => {
    setState({
      isReviewing: true,
      error: null
    });

    try {
      const result = await cvReviewer.review(cvData);

      if (!result.success) {
        throw new Error('Review failed');
      }

      setState({
        isReviewing: false,
        error: null
      });

      return result.data;

    } catch (error: any) {
      console.error('[useCVReview] Error:', error);
      
      const errorMessage = getUserFriendlyError(error);
      setState({
        isReviewing: false,
        error: errorMessage
      });

      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isReviewing: false,
      error: null
    });
  }, []);

  return {
    ...state,
    review,
    reset
  };
}
