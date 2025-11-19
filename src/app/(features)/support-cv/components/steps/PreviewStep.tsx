'use client';

import React from 'react';
import { useCVBuilder } from '../../contexts/CVBuilderContext';
import CVPreview from '../CVPreview_NEW';

// ============================================================================
// Component
// ============================================================================

export function PreviewStep() {
  const { state, actions } = useCVBuilder();

  return (
    <CVPreview
      cvData={state.cvData}
      template={state.selectedTemplate}
      onBackToEdit={() => actions.setStep('edit')}
      onExport={() => actions.setStep('export')}
    />
  );
}
