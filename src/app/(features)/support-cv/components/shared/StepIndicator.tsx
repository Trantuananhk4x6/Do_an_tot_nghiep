'use client';

import React from 'react';
import { CVStep } from '../../contexts/CVBuilderContext';
import { Upload, FileSearch, Edit3, Eye, Download, Check, ChevronRight } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface StepIndicatorProps {
  currentStep: CVStep;
}

interface Step {
  key: CVStep;
  label: string;
  icon: React.ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps: Step[] = [
    { key: 'upload', label: 'Upload', icon: <Upload className="w-5 h-5" /> },
    { key: 'review', label: 'Review', icon: <FileSearch className="w-5 h-5" /> },
    { key: 'edit', label: 'Edit', icon: <Edit3 className="w-5 h-5" /> },
    { key: 'preview', label: 'Preview', icon: <Eye className="w-5 h-5" /> },
    { key: 'export', label: 'Export', icon: <Download className="w-5 h-5" /> }
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
              {step.icon}
              <span className="font-medium">{step.label}</span>
              {isCompleted && <Check className="w-4 h-4" />}
            </div>
            
            {index < steps.length - 1 && (
              <ChevronRight className={`w-6 h-6 ${isCompleted ? 'text-green-500' : 'text-purple-500/50'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
