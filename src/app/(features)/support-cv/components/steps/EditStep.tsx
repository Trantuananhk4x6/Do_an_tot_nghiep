'use client';

import React from 'react';
import { useCVBuilder } from '../../contexts/CVBuilderContext';
import CVEditor from '../CVEditor';

// ============================================================================
// Component
// ============================================================================

export function EditStep() {
  const { state, actions } = useCVBuilder();

  return (
    <CVEditor
      cvData={state.cvData}
      selectedTemplate={state.selectedTemplate}
      onUpdate={actions.setCVData}
      onTemplateChange={actions.setTemplate}
      onPreview={() => actions.setStep('preview')}
      onBackToReview={state.reviewData ? () => actions.setStep('review') : undefined}
      aiSuggestions={[]}
      isGeneratingSuggestions={false}
    />
  );
}
