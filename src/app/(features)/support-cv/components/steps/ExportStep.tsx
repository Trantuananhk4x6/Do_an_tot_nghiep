'use client';

import React from 'react';
import { useCVBuilder } from '../../contexts/CVBuilderContext';
import ExportPanel from '../ExportPanel';

// ============================================================================
// Component
// ============================================================================

export function ExportStep() {
  const { state, actions } = useCVBuilder();

  return (
    <ExportPanel
      cvData={state.cvData}
      template={state.selectedTemplate}
      onBackToPreview={() => actions.setStep('preview')}
    />
  );
}
