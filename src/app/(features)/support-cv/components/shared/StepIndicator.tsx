'use client';

import React from 'react';
import { CVStep } from '../../contexts/CVBuilderContext';

// ============================================================================
// Types
// ============================================================================

interface StepIndicatorProps {
  currentStep: CVStep;
}

interface Step {
  key: CVStep;
  label: string;
  icon: string;
}

// ============================================================================
// Component
// ============================================================================

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps: Step[] = [
    { key: 'upload', label: 'Upload', icon: '📤' },
    { key: 'review', label: 'Review', icon: '📝' },
    { key: 'edit', label: 'Edit', icon: '✏️' },
    { key: 'preview', label: 'Preview', icon: '👁️' },
    { key: 'export', label: 'Export', icon: '💾' }
  ];

  const currentIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => {
        const isActive = step.key === currentStep;
        const isCompleted = index < currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <React.Fragment key={step.key}>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105 glow-effect'
                  : isCompleted
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'glass-effect text-gray-400'
              }`}
            >
              <span className="text-xl">{step.icon}</span>
              <span className="font-medium">{step.label}</span>
              {isCompleted && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            
            {index < steps.length - 1 && (
              <svg 
                className={`w-6 h-6 ${isCompleted ? 'text-green-500' : 'text-purple-500/50'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
