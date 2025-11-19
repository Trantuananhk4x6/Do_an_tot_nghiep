'use client';

import React from 'react';
import { useCVBuilder } from '../../contexts/CVBuilderContext';

// ============================================================================
// Component
// ============================================================================

export function ComparisonStep() {
  const { state, actions } = useCVBuilder();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="glass-effect rounded-xl p-8 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-white mb-4">Before/After Comparison</h2>
        <p className="text-gray-300 mb-6">
          Comparison feature is being implemented...
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={() => actions.setStep('edit')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            Continue to Edit
          </button>
        </div>
      </div>
    </div>
  );
}
