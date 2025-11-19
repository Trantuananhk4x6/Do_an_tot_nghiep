'use client';

import React, { useMemo } from 'react';
import { CVBuilderProvider, useCVBuilder } from '@/app/(features)/support-cv/contexts/CVBuilderContext';
import { StepIndicator } from '@/app/(features)/support-cv/components/shared/StepIndicator';
import { ErrorBoundary } from '@/app/(features)/support-cv/components/shared/ErrorBoundary';
import { QuotaWarning } from '@/app/(features)/support-cv/components/shared/QuotaWarning';

// Lazy load step components
import { UploadStep } from '@/app/(features)/support-cv/components/steps/UploadStep';
import { ReviewStep } from '@/app/(features)/support-cv/components/steps/ReviewStep';
import { ComparisonStep } from '@/app/(features)/support-cv/components/steps/ComparisonStep';
import { EditStep } from '@/app/(features)/support-cv/components/steps/EditStep';
import { PreviewStep } from '@/app/(features)/support-cv/components/steps/PreviewStep';
import { ExportStep } from '@/app/(features)/support-cv/components/steps/ExportStep';

// ============================================================================
// Main Content Component
// ============================================================================

function SupportCVContent() {
  const { state, actions } = useCVBuilder();

  // Render current step
  const currentStepComponent = useMemo(() => {
    switch (state.currentStep) {
      case 'upload':
        return <UploadStep />;
      
      case 'review':
        return state.reviewData ? (
          <ReviewStep />
        ) : (
          <div className="p-12 text-center text-gray-300">
            Loading review...
          </div>
        );
      
      case 'comparison':
        return state.originalCV && state.editedCV ? (
          <ComparisonStep />
        ) : (
          <div className="p-12 text-center text-gray-300">
            Preparing comparison...
          </div>
        );
      
      case 'edit':
        return <EditStep />;
      
      case 'preview':
        return <PreviewStep />;
      
      case 'export':
        return <ExportStep />;
      
      default:
        return <div className="p-12 text-center text-gray-300">Unknown step</div>;
    }
  }, [state.currentStep, state.reviewData, state.originalCV, state.editedCV]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Quota Warning Banner */}
      <QuotaWarning />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="glass-effect border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center glow-effect">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  CV Support
                </h1>
                <p className="text-gray-300 mt-1">
                  AI-powered CV builder with STAR method optimization
                </p>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="mt-8">
              <StepIndicator currentStep={state.currentStep} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          {currentStepComponent}
        </ErrorBoundary>
      </div>
    </div>
  );
}

// ============================================================================
// Page Component with Provider
// ============================================================================

export default function SupportCVPage() {
  return (
    <CVBuilderProvider>
      <SupportCVContent />
    </CVBuilderProvider>
  );
}
