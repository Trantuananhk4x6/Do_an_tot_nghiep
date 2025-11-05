'use client';

import React, { useState } from 'react';
import { CVBuilderState, CVTemplate, CVData } from '@/app/(features)/support-cv/types/cv.types';
import CVUploader from '@/app/(features)/support-cv/components/CVUploader';
import CVReviewPanel from '@/app/(features)/support-cv/components/CVReviewPanel';
import CVAutoEditComparison from '@/app/(features)/support-cv/components/CVAutoEditComparison';
import CVEditor from '@/app/(features)/support-cv/components/CVEditor';
import CVPreview from '@/app/(features)/support-cv/components/CVPreview_NEW';
import ExportPanel from '@/app/(features)/support-cv/components/ExportPanel';
import { autoEditCVWithAI, applySelectedChanges, CVEditChange } from '@/app/(features)/support-cv/services/aiCVAutoEditor';

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

export default function SupportCVPage() {
  const [state, setState] = useState<CVBuilderState>({
    currentStep: 'upload',
    selectedTemplate: 'ats-friendly', // Default template
    cvData: initialCVData,
    aiSuggestions: [],
    isGeneratingSuggestions: false,
    isExporting: false
  });

  // Review state
  const [review, setReview] = useState<any | null>(null);
  const [isAutoEditing, setIsAutoEditing] = useState(false);
  
  // Auto-edit state
  const [originalCVBeforeEdit, setOriginalCVBeforeEdit] = useState<CVData | null>(null);
  const [editedCV, setEditedCV] = useState<CVData | null>(null);
  const [autoEditChanges, setAutoEditChanges] = useState<CVEditChange[]>([]);

  const updateState = (updates: Partial<CVBuilderState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleTemplateChange = (template: CVTemplate) => {
    updateState({
      selectedTemplate: template
    });
  };

  const handleCVUploaded = (cvData: CVData) => {
    // After upload, go to review step if review data available
    updateState({ cvData });
    // If review already produced (fallback or AI), go to review step
    setState(prev => ({ ...prev, cvData }));
    setState(prev => ({ ...prev, currentStep: 'review' }));
  };

  const handleReviewReady = (reviewData: any) => {
    setReview(reviewData);
    setState(prev => ({ ...prev, currentStep: 'review' }));
  };

  const handleAutoEdit = async () => {
    setIsAutoEditing(true);
    
    try {
      // Save original CV before editing
      setOriginalCVBeforeEdit(state.cvData);
      
      // Call AI auto-edit service
      const result = await autoEditCVWithAI(state.cvData, review);
      
      setEditedCV(result.editedCV);
      setAutoEditChanges(result.changes);
      
      // Move to comparison screen
      setState(prev => ({ ...prev, currentStep: 'auto-edit-comparison' as any }));
      
    } catch (error) {
      console.error('Auto-edit failed:', error);
      alert('❌ Auto-edit failed. Please try manual edit instead.');
    } finally {
      setIsAutoEditing(false);
    }
  };

  const handleAcceptAutoEditChanges = (selectedIds: string[]) => {
    if (!originalCVBeforeEdit || !editedCV) return;
    
    // Apply only selected changes
    const finalCV = applySelectedChanges(
      originalCVBeforeEdit,
      editedCV,
      autoEditChanges,
      selectedIds
    );
    
    // Update state with final CV
    updateState({ cvData: finalCV, currentStep: 'edit' });
  };

  const handleRejectAllAutoEdit = () => {
    // Go back to review without applying changes
    setState(prev => ({ ...prev, currentStep: 'review' }));
  };

  const handleManualEditFromReview = () => {
    updateState({ currentStep: 'edit' });
  };

  const handleBackToReview = () => {
    updateState({ currentStep: 'review' });
  };

  const handleStartFromScratch = () => {
    updateState({
      currentStep: 'edit'
    });
  };

  const handleCVDataUpdate = (cvData: CVData) => {
    updateState({ cvData });
  };

  const handlePreview = () => {
    updateState({ currentStep: 'preview' });
  };

  const handleBackToEdit = () => {
    updateState({ currentStep: 'edit' });
  };

  const handleExport = () => {
    updateState({ currentStep: 'export' });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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

            {/* Progress Steps */}
            <div className="mt-8 flex items-center justify-center gap-2">
              {[
                { key: 'upload', label: 'Upload', icon: '📤' },
                { key: 'review', label: 'Review', icon: '📝' },
                { key: 'edit', label: 'Edit', icon: '✏️' },
                { key: 'preview', label: 'Preview', icon: '👁️' },
                { key: 'export', label: 'Export', icon: '💾' }
              ].map((step, index) => {
                const isActive = state.currentStep === step.key;
                const isCompleted = ['upload', 'edit', 'preview', 'export'].indexOf(state.currentStep) > index;
                
                return (
                  <React.Fragment key={step.key}>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105 glow-effect' 
                        : isCompleted
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'glass-effect text-gray-400'
                    }`}>
                      <span className="text-xl">{step.icon}</span>
                      <span className="font-medium">{step.label}</span>
                    </div>
                    {index < 3 && (
                      <svg className="w-6 h-6 text-purple-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.currentStep === 'upload' && (
          <CVUploader
            selectedTemplate={state.selectedTemplate!}
            onCVUploaded={handleCVUploaded}
            onStartFromScratch={handleStartFromScratch}
            onReviewReady={handleReviewReady}
          />
        )}

        {state.currentStep === 'review' && (
          review ? (
            <CVReviewPanel
              cvData={state.cvData}
              review={review}
              onAutoEdit={handleAutoEdit}
              onManualEdit={handleManualEditFromReview}
              isAutoEditing={isAutoEditing}
            />
          ) : (
            <div className="p-12 text-center text-gray-300">Analyzing review results...</div>
          )
        )}

        {state.currentStep === 'auto-edit-comparison' && originalCVBeforeEdit && editedCV && (
          <CVAutoEditComparison
            originalCV={originalCVBeforeEdit}
            editedCV={editedCV}
            changes={autoEditChanges}
            onAcceptAll={() => {
              updateState({ cvData: editedCV, currentStep: 'edit' });
            }}
            onRejectAll={handleRejectAllAutoEdit}
            onAcceptSelected={handleAcceptAutoEditChanges}
            onBack={handleRejectAllAutoEdit}
          />
        )}

        {state.currentStep === 'edit' && (
          <CVEditor
            cvData={state.cvData}
            aiSuggestions={state.aiSuggestions}
            selectedTemplate={state.selectedTemplate || 'ats-friendly'}
            onUpdate={handleCVDataUpdate}
            onTemplateChange={handleTemplateChange}
            onPreview={handlePreview}
            onBackToReview={review ? handleBackToReview : undefined}
            isGeneratingSuggestions={state.isGeneratingSuggestions}
          />
        )}

        {state.currentStep === 'preview' && (
          <CVPreview
            cvData={state.cvData}
            template={state.selectedTemplate!}
            onBackToEdit={handleBackToEdit}
            onExport={handleExport}
          />
        )}

        {state.currentStep === 'export' && (
          <ExportPanel
            cvData={state.cvData}
            template={state.selectedTemplate!}
            onBackToPreview={() => updateState({ currentStep: 'preview' })}
          />
        )}
      </div>
    </div>
  );
}
