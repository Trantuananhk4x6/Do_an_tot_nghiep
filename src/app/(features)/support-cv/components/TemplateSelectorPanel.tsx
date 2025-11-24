'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CVTemplate, CVData } from '../types/cv.types';
import { CV_TEMPLATES, TemplateInfo } from '../templates/templateData';
import { recommendTemplate, AITemplateResult } from '../services/aiTemplateRecommender';
import TemplatePreviewCard from './TemplatePreviewCard';

interface TemplateSelectorPanelProps {
  selectedTemplate: CVTemplate;
  onSelectTemplate: (template: CVTemplate) => void;
  cvData: CVData;
}

export default function TemplateSelectorPanel({
  selectedTemplate,
  onSelectTemplate,
  cvData
}: TemplateSelectorPanelProps) {
  const [aiRecommendation, setAiRecommendation] = useState<AITemplateResult | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [expandedTemplate, setExpandedTemplate] = useState<CVTemplate | null>(null);

  // DON'T auto-load AI recommendation to avoid API quota issues
  // User can click button to get recommendation
  
  const getAIRecommendation = async () => {
    setIsLoadingAI(true);
    try {
      const result = await recommendTemplate(cvData);
      setAiRecommendation(result);
      setShowAIPanel(true);
    } catch (error) {
      console.error('Failed to get AI recommendation:', error);
      // Show user-friendly error
      alert('⚠️ AI recommendation temporarily unavailable. Please choose a template manually.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const getTemplateScore = (templateId: CVTemplate): number => {
    if (!aiRecommendation) return 0;
    const rec = aiRecommendation.recommendations.find(r => r.template === templateId);
    return rec?.score || 0;
  };

  const getTemplateRecommendation = (templateId: CVTemplate) => {
    if (!aiRecommendation) return null;
    return aiRecommendation.recommendations.find(r => r.template === templateId);
  };

  return (
    <div className="relative h-full overflow-y-auto space-y-4 pr-2">
      {/* Header Section with Gradient Background */}
      <div className="sticky top-0 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-sm z-10 pb-4 -mx-2 px-2">
        <div className="relative glass-effect border border-purple-500/30 rounded-2xl p-6 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-50" />
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-xl opacity-50" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                  CV Template
                </h3>
                <p className="text-xs text-gray-400">
                  <span className="text-purple-400 font-semibold">{CV_TEMPLATES.length}</span> professional designs
                </p>
              </div>
            </div>
            
            {/* Quick AI Button when panel hidden */}
            {!showAIPanel && !isLoadingAI && (
              <button
                onClick={getAIRecommendation}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl text-sm font-semibold hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span className="text-lg">🤖</span>
                <span>Get AI Recommendation</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Preview of Current CV */}
      <div className="relative glass-effect border border-purple-500/30 rounded-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative bg-gradient-to-r from-purple-500/30 to-blue-500/30 px-5 py-3 border-b border-purple-500/30">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="text-lg">👁️</span>
            <span>Live Preview</span>
          </h4>
        </div>
        <div className="relative p-4 bg-white/95 max-h-64 overflow-y-auto custom-scrollbar">
          {/* Mini CV Preview */}
          <div className="space-y-3">
            {/* Header with Profile Image */}
            <div className="flex items-center gap-3">
              {cvData.personalInfo.profileImage ? (
                <div className="relative w-16 h-16 rounded-full border-2 border-purple-500 shadow-md overflow-hidden flex-shrink-0">
                  <Image
                    src={cvData.personalInfo.profileImage}
                    alt={cvData.personalInfo.fullName || 'Profile'}
                    fill
                    className="object-cover"
                    unoptimized={cvData.personalInfo.profileImage.startsWith('data:')}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {cvData.personalInfo.fullName ? cvData.personalInfo.fullName.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-bold text-gray-900 truncate">
                  {cvData.personalInfo.fullName || 'Your Name'}
                </h5>
                <p className="text-xs text-gray-600 truncate">
                  {cvData.personalInfo.title || 'Job Title'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {cvData.personalInfo.email || 'email@example.com'}
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{cvData.experiences?.length || 0}</div>
                <div className="text-xs text-gray-600">Experience</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{cvData.skills?.length || 0}</div>
                <div className="text-xs text-gray-600">Skills</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{cvData.projects?.length || 0}</div>
                <div className="text-xs text-gray-600">Projects</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Panel */}
      {showAIPanel && (
        <div className="glass-effect border-2 border-purple-500/50 rounded-xl p-4 glow-effect">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-float">🤖</span>
              <div>
                <h4 className="text-sm font-bold text-white">AI Recommendation</h4>
                <p className="text-xs text-purple-300">Powered by Gemini</p>
              </div>
            </div>
            <button
              onClick={() => setShowAIPanel(false)}
              className="text-gray-400 hover:text-gray-200 text-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {isLoadingAI ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : aiRecommendation ? (
            <div className="space-y-3">
              {/* Analysis */}
              <div className="glass-effect border border-white/10 rounded-lg p-3">
                <p className="text-xs text-gray-300 leading-relaxed">
                  {aiRecommendation.analysis}
                </p>
              </div>

              {/* Top Pick */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-3 text-white animate-pulse-glow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🏆</span>
                  <span className="font-bold text-sm">Top Pick</span>
                </div>
                <p className="text-xs text-white/90 mb-2">
                  {CV_TEMPLATES.find(t => t.id === aiRecommendation.topPick)?.name}
                </p>
                <button
                  onClick={() => onSelectTemplate(aiRecommendation.topPick)}
                  className="w-full bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-all"
                >
                  Use This Template
                </button>
              </div>

              {/* Refresh */}
              <button
                onClick={getAIRecommendation}
                className="text-xs text-purple-300 hover:text-purple-200 font-medium flex items-center gap-1 transition-colors"
              >
                🔄 Refresh Recommendation
              </button>
            </div>
          ) : (
            <button
              onClick={getAIRecommendation}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg text-sm font-bold hover:from-purple-600 hover:to-blue-600 transition-all glow-effect"
            >
              Get AI Recommendation
            </button>
          )}
        </div>
      )}

      {/* Show AI Panel Button */}
      {!showAIPanel && (
        <button
          onClick={() => setShowAIPanel(true)}
          className="w-full glass-effect border border-purple-500/50 text-purple-300 py-2 rounded-lg text-sm font-medium hover:bg-purple-500/20 transition-all flex items-center justify-center gap-2"
        >
          <span>🤖</span>
          <span>Show AI Recommendation</span>
        </button>
      )}

      {/* Template Gallery */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">All Templates</h4>
          <span className="text-xs text-gray-400">{CV_TEMPLATES.length} templates</span>
        </div>
        
        {/* Scrollable Grid with Custom Scrollbar */}
        <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {CV_TEMPLATES.map(template => {
            const isSelected = selectedTemplate === template.id;
            const isTopPick = aiRecommendation?.topPick === template.id;
            const score = getTemplateScore(template.id);

            return (
              <TemplatePreviewCard
                key={template.id}
                template={template}
                isSelected={isSelected}
                isTopPick={isTopPick}
                aiScore={score}
                onSelect={() => onSelectTemplate(template.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="glass-effect border border-blue-500/30 rounded-lg p-3">
        <p className="text-xs text-blue-300 leading-relaxed">
          <strong>💡 Tip:</strong> Choose ATS-Friendly for online applications. 
          Creative templates work best for design roles.
        </p>
      </div>
    </div>
  );
}
