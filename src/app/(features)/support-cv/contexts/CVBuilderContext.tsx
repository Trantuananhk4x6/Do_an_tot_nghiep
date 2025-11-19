'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { CVData, CVTemplate } from '../types/cv.types';

// ============================================================================
// Types
// ============================================================================

export type CVStep = 'upload' | 'review' | 'comparison' | 'edit' | 'preview' | 'export';

export interface CVBuilderState {
  currentStep: CVStep;
  selectedTemplate: CVTemplate;
  cvData: CVData;
  originalCV: CVData | null; // Before auto-edit
  editedCV: CVData | null;   // After auto-edit
  reviewData: any | null;
  autoEditChanges: any[];
  isProcessing: boolean;
  error: string | null;
}

type CVBuilderAction =
  | { type: 'SET_STEP'; payload: CVStep }
  | { type: 'SET_TEMPLATE'; payload: CVTemplate }
  | { type: 'SET_CV_DATA'; payload: CVData }
  | { type: 'SET_REVIEW_DATA'; payload: any }
  | { type: 'SET_AUTO_EDIT_RESULT'; payload: { original: CVData; edited: CVData; changes: any[] } }
  | { type: 'APPLY_CHANGES'; payload: CVData }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

// ============================================================================
// Initial State
// ============================================================================

const initialCVData: CVData = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    summary: ''
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: []
};

const initialState: CVBuilderState = {
  currentStep: 'upload',
  selectedTemplate: 'ats-friendly',
  cvData: initialCVData,
  originalCV: null,
  editedCV: null,
  reviewData: null,
  autoEditChanges: [],
  isProcessing: false,
  error: null
};

// ============================================================================
// Reducer
// ============================================================================

function cvBuilderReducer(state: CVBuilderState, action: CVBuilderAction): CVBuilderState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload, error: null };
    
    case 'SET_TEMPLATE':
      return { ...state, selectedTemplate: action.payload };
    
    case 'SET_CV_DATA':
      return { ...state, cvData: action.payload };
    
    case 'SET_REVIEW_DATA':
      return { ...state, reviewData: action.payload, currentStep: 'review' };
    
    case 'SET_AUTO_EDIT_RESULT':
      return {
        ...state,
        originalCV: action.payload.original,
        editedCV: action.payload.edited,
        autoEditChanges: action.payload.changes,
        currentStep: 'comparison'
      };
    
    case 'APPLY_CHANGES':
      return {
        ...state,
        cvData: action.payload,
        currentStep: 'edit',
        originalCV: null,
        editedCV: null,
        autoEditChanges: []
      };
    
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isProcessing: false };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

interface CVBuilderContextValue {
  state: CVBuilderState;
  actions: {
    setStep: (step: CVStep) => void;
    setTemplate: (template: CVTemplate) => void;
    setCVData: (data: CVData) => void;
    setReviewData: (data: any) => void;
    setAutoEditResult: (original: CVData, edited: CVData, changes: any[]) => void;
    applyChanges: (data: CVData) => void;
    setProcessing: (processing: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
  };
}

const CVBuilderContext = createContext<CVBuilderContextValue | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

export function CVBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cvBuilderReducer, initialState);

  const actions = {
    setStep: useCallback((step: CVStep) => {
      dispatch({ type: 'SET_STEP', payload: step });
    }, []),

    setTemplate: useCallback((template: CVTemplate) => {
      dispatch({ type: 'SET_TEMPLATE', payload: template });
    }, []),

    setCVData: useCallback((data: CVData) => {
      dispatch({ type: 'SET_CV_DATA', payload: data });
    }, []),

    setReviewData: useCallback((data: any) => {
      dispatch({ type: 'SET_REVIEW_DATA', payload: data });
    }, []),

    setAutoEditResult: useCallback((original: CVData, edited: CVData, changes: any[]) => {
      dispatch({ type: 'SET_AUTO_EDIT_RESULT', payload: { original, edited, changes } });
    }, []),

    applyChanges: useCallback((data: CVData) => {
      dispatch({ type: 'APPLY_CHANGES', payload: data });
    }, []),

    setProcessing: useCallback((processing: boolean) => {
      dispatch({ type: 'SET_PROCESSING', payload: processing });
    }, []),

    setError: useCallback((error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    }, []),

    reset: useCallback(() => {
      dispatch({ type: 'RESET' });
    }, [])
  };

  return (
    <CVBuilderContext.Provider value={{ state, actions }}>
      {children}
    </CVBuilderContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useCVBuilder() {
  const context = useContext(CVBuilderContext);
  if (!context) {
    throw new Error('useCVBuilder must be used within CVBuilderProvider');
  }
  return context;
}
