'use client';

import React, { useState } from 'react';
import { CVBuilderState, CVTemplate, CVData } from '@/app/(features)/support-cv/types/cv.types';
import CVUploader from '@/app/(features)/support-cv/components/CVUploader';
import CVReviewPanel from '@/app/(features)/support-cv/components/CVReviewPanel';
import CVAutoEditComparison from '@/app/(features)/support-cv/components/CVAutoEditComparison';
import CVEditor from '@/app/(features)/support-cv/components/CVEditor';
import CVPreview from '@/app/(features)/support-cv/components/CVPreview_NEW';
import ExportPanel from '@/app/(features)/support-cv/components/ExportPanel';
import AutoEditLoadingDialog from '@/app/(features)/support-cv/components/AutoEditLoadingDialog';
import { QueueStatus } from '@/components/ui/queue-status';
import { QuotaStatusBanner } from '@/components/ui/quota-status-banner';
import { cvEditor } from '@/app/(features)/support-cv/services/ai/editor.service';
import { motion } from 'framer-motion';
import Animated3DBackground from '@/components/ui/Animated3DBackground';
import { FileText, Sparkles, Upload, FileSearch, Edit3, Eye, Download, Check, Bot, BarChart2, Target, Zap, Briefcase, TrendingUp } from 'lucide-react';

// Temporary type definition (will be replaced by new architecture)
interface CVEditChange {
  id: string;
  section: string;
  field: string;
  itemLabel: string;
  before: string;
  after: string;
  reason: string;
  accepted: boolean;
}

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
  const [autoEditProgress, setAutoEditProgress] = useState(0);
  const [autoEditStep, setAutoEditStep] = useState('');
  
  // Auto-edit state
  const [originalCVBeforeEdit, setOriginalCVBeforeEdit] = useState<CVData | null>(null);
  const [editedCV, setEditedCV] = useState<CVData | null>(null);
  const [autoEditChanges, setAutoEditChanges] = useState<CVEditChange[]>([]);
  const [rawSuggestions, setRawSuggestions] = useState<any[]>([]); // Store raw AI suggestions
  const [showLanding, setShowLanding] = useState(state.currentStep === 'upload');

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
    setShowLanding(false);
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
    setAutoEditProgress(0);
    setAutoEditStep('Initializing...');
    
    try {
      // Save original CV before editing
      setOriginalCVBeforeEdit(state.cvData);
      
      // Simulate progress updates
      setAutoEditProgress(10);
      setAutoEditStep('Analyzing CV content...');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setAutoEditProgress(30);
      setAutoEditStep('Generating improvements...');
      
      // Create minimal review if not available
      const reviewData = review || {
        overallScore: 60,
        atsScore: 60,
        impactScore: 60,
        clarityScore: 60,
        strengths: [],
        weaknesses: [],
        suggestions: []
      };
      
      // Use new editor service
      const result = await cvEditor.autoEdit(state.cvData, reviewData, (progress, step) => {
        setAutoEditProgress(30 + (progress * 0.6));
        setAutoEditStep(step);
      });
      
      if (!result.success) {
        const error = (result as { success: false; error: Error }).error;
        throw new Error(error.message || 'Failed to auto-edit');
      }
      
      setAutoEditProgress(95);
      setAutoEditStep('Finalizing changes...');
      
      // Convert changes to old format
      const convertedChanges: CVEditChange[] = result.data.changes.map(change => ({
        id: change.id,
        section: change.section,
        field: change.field,
        itemLabel: change.itemLabel || `${change.section} - ${change.field}`,
        before: change.original,
        after: change.suggestion,
        reason: change.reason,
        accepted: true
      }));
      
      // Apply results
      setEditedCV(result.data.editedCV);
      setAutoEditChanges(convertedChanges);
      setRawSuggestions(result.data.suggestions); // Store raw suggestions
      
      setAutoEditProgress(100);
      setAutoEditStep('Complete!');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Move to auto-edit-comparison step to review changes
      setState(prev => ({ ...prev, currentStep: 'auto-edit-comparison' }));
      
    } catch (error: any) {
      console.error('Auto-edit failed:', error);
      
      if (error?.message?.includes('EMERGENCY_BLOCK')) {
        alert('🔴 API Quota Exceeded\n\nThe Gemini API has been temporarily blocked due to too many requests. Please try again in 30 minutes, or use the Manual Edit option instead.\n\n💡 Tip: The app will continue to work with basic improvements during this time.');
      } else {
        alert('❌ Auto-edit failed. Please try manual edit instead.');
      }
    } finally {
      setIsAutoEditing(false);
      setAutoEditProgress(0);
    }
  };

  const handleAcceptAutoEditChanges = (selectedIds: string[]) => {
    if (!originalCVBeforeEdit || !rawSuggestions) {
      console.warn('[Support CV] Missing original CV or suggestions');
      return;
    }
    
    console.log('[Support CV] Applying', selectedIds.length, 'selected changes');
    
    // Apply only selected suggestions to original CV
    const finalCV = cvEditor.applySelectedSuggestions(
      originalCVBeforeEdit,
      rawSuggestions,
      selectedIds
    );
    
    // Update state with final CV and go back to edit
    updateState({ cvData: finalCV, currentStep: 'edit' });
    
    // Clear auto-edit state
    setOriginalCVBeforeEdit(null);
    setEditedCV(null);
    setAutoEditChanges([]);
    setRawSuggestions([]);
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
    <div className="relative min-h-screen">
      <Animated3DBackground />
      
      {/* Quota Status Banner */}
      <QuotaStatusBanner />
      
      {/* Auto-Edit Loading Dialog */}
      <AutoEditLoadingDialog 
        isOpen={isAutoEditing}
        progress={autoEditProgress}
        currentStep={autoEditStep}
      />
      
      {/* Header */}
      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  y: [0, -10, 0]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"
              >
                {/* Animated glow effect */}
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(139, 92, 246, 0.3)",
                      "0 0 60px rgba(139, 92, 246, 0.8)",
                      "0 0 20px rgba(139, 92, 246, 0.3)"
                    ],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl"
                />
                {/* Rotating border */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl opacity-75 blur"
                />
                <FileText className="w-8 h-8 text-white relative z-10" />
              </motion.div>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                >
                  CV Support
                </motion.h1>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-center gap-2 mt-2"
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </motion.div>
                  <p className="text-gray-300 text-lg">
                    AI-powered CV builder with STAR method optimization
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Progress Steps with enhanced animations */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center justify-center gap-2"
            >
              {[
                { key: 'upload', label: 'Upload', icon: <Upload className="w-5 h-5" /> },
                { key: 'review', label: 'Review', icon: <FileSearch className="w-5 h-5" /> },
                { key: 'edit', label: 'Edit', icon: <Edit3 className="w-5 h-5" /> },
                { key: 'preview', label: 'Preview', icon: <Eye className="w-5 h-5" /> },
                { key: 'export', label: 'Export', icon: <Download className="w-5 h-5" /> }
              ].map((step, index) => {
                const isActive = state.currentStep === step.key;
                const isCompleted = ['upload', 'edit', 'preview', 'export'].indexOf(state.currentStep) > index;
                
                return (
                  <React.Fragment key={step.key}>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className={`relative flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                          : isCompleted
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : 'glass-effect text-gray-400 border border-white/10'
                      }`}
                    >
                      {isActive && (
                        <>
                          {/* Animated glow effect for active step */}
                          <motion.div
                            animate={{ 
                              boxShadow: [
                                "0 0 20px rgba(139, 92, 246, 0.4)",
                                "0 0 40px rgba(139, 92, 246, 0.8)",
                                "0 0 20px rgba(139, 92, 246, 0.4)"
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-xl"
                          />
                          {/* Shimmer effect */}
                          <motion.div
                            animate={{ x: [-200, 1000] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            className="absolute inset-0 w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                          />
                        </>
                      )}
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs z-20"
                        >
                          <Check className="w-3 h-3" />
                        </motion.div>
                      )}
                      <motion.span 
                        animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
                        transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                        className="relative z-10"
                      >
                        {step.icon}
                      </motion.span>
                      <span className="font-semibold relative z-10">{step.label}</span>
                    </motion.div>
                    {index < 4 && (
                      <motion.svg 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="w-6 h-6 text-purple-500/50" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    )}
                  </React.Fragment>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showLanding && state.currentStep === 'upload' && (
          <div className="mb-12">
            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <motion.div 
                className="relative inline-block mb-8"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 blur-3xl animate-pulse" />
                <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto shadow-2xl">
                  <FileText className="h-12 w-12 text-white" />
                </div>
              </motion.div>

              <h1 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  AI-Powered CV Builder
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Create professional, ATS-optimized CVs with intelligent suggestions powered by AI
              </p>
            </motion.div>

            {/* Upload Section */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative mb-16"
            >
              <CVUploader
                selectedTemplate={state.selectedTemplate!}
                onCVUploaded={handleCVUploaded}
                onStartFromScratch={handleStartFromScratch}
                onReviewReady={handleReviewReady}
              />
            </motion.div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: <Bot className="w-12 h-12 text-purple-400" />,
                  title: "AI Analysis",
                  description: "Get instant feedback on your CV with our advanced AI that analyzes content, formatting, and ATS compatibility",
                  color: "from-purple-500/20 to-purple-600/20",
                  delay: 0.3
                },
                {
                  icon: <Sparkles className="w-12 h-12 text-blue-400" />,
                  title: "Smart Optimization",
                  description: "Automatically improve your CV with STAR method optimization and keyword enhancement",
                  color: "from-blue-500/20 to-blue-600/20",
                  delay: 0.4
                },
                {
                  icon: <BarChart2 className="w-12 h-12 text-pink-400" />,
                  title: "ATS Friendly",
                  description: "Ensure your CV passes Applicant Tracking Systems with optimized formatting and structure",
                  color: "from-pink-500/20 to-pink-600/20",
                  delay: 0.5
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: feature.delay }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative glass-effect border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 h-full">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Why Choose Us */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative glass-effect border border-purple-500/30 rounded-2xl p-8 mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
              <div className="relative">
                <h3 className="text-2xl font-bold text-center mb-8">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Why Use Our CV Builder?
                  </span>
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { icon: <Target className="w-6 h-6 text-white" />, title: "Increase Interview Chances", desc: "Optimized for ATS systems used by 90% of companies" },
                    { icon: <Zap className="w-6 h-6 text-white" />, title: "Save Time", desc: "AI suggestions help you create a perfect CV in minutes" },
                    { icon: <Briefcase className="w-6 h-6 text-white" />, title: "Professional Templates", desc: "Choose from multiple industry-standard designs" },
                    { icon: <TrendingUp className="w-6 h-6 text-white" />, title: "Track Progress", desc: "Get detailed scores and improvement recommendations" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 group">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
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

      {/* Queue Status Indicator */}
      <QueueStatus />
    </div>
  );
}
