'use client';

import React from 'react';
import { 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Wand2, 
  Edit3,
  Target,
  TrendingUp,
  FileText,
  Check,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';
import { CVData } from '@/app/(features)/support-cv/types/cv.types';

interface CVReview {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  atsScore: number;
  impactScore: number;
  clarityScore: number;
}

interface CVReviewPanelProps {
  cvData: CVData;
  review: CVReview;
  onAutoEdit: () => void;
  onManualEdit: () => void;
  isAutoEditing: boolean;
}

export default function CVReviewPanel({
  cvData,
  review,
  onAutoEdit,
  onManualEdit,
  isAutoEditing
}: CVReviewPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
          <Bot className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
          AI CV Review Complete
        </h2>
        <p className="text-gray-300 text-lg">
          Here's what our AI thinks about your CV
        </p>
      </div>

      {/* Overall Score Card */}
      <div className="glass-effect border-2 border-purple-500/50 rounded-2xl p-8 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-400" />
              Overall Score
            </h3>
            <p className="text-gray-300">Based on ATS compatibility, impact, and clarity</p>
          </div>
          <div className="text-center">
            <div className={`text-7xl font-bold ${getScoreColor(review.overallScore)} mb-2`}>
              {review.overallScore}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wide">
              {getScoreLabel(review.overallScore)}
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-white/10">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                ATS Compatibility
              </span>
              <span className={`text-lg font-bold ${getScoreColor(review.atsScore)}`}>
                {review.atsScore}%
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  review.atsScore >= 80 ? 'bg-green-500' :
                  review.atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${review.atsScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Impact & Results
              </span>
              <span className={`text-lg font-bold ${getScoreColor(review.impactScore)}`}>
                {review.impactScore}%
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  review.impactScore >= 80 ? 'bg-green-500' :
                  review.impactScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${review.impactScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Clarity & Format
              </span>
              <span className={`text-lg font-bold ${getScoreColor(review.clarityScore)}`}>
                {review.clarityScore}%
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  review.clarityScore >= 80 ? 'bg-green-500' :
                  review.clarityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${review.clarityScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Strengths */}
        <div className="glass-effect border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-green-400">Strengths</h3>
          </div>
          <ul className="space-y-3">
            {review.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-300">
                <Check className="w-4 h-4 text-green-400 mt-1 shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="glass-effect border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-red-400">Areas for Improvement</h3>
          </div>
          <ul className="space-y-3">
            {review.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-300">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="glass-effect border border-purple-500/30 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-purple-400">AI Recommendations</h3>
        </div>
        <div className="space-y-3">
          {review.suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {index + 1}
              </span>
              <p className="text-gray-300 text-sm leading-relaxed">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="glass-effect border border-white/10 rounded-xl p-8">
        <h3 className="text-xl font-bold text-white mb-6 text-center">
          How would you like to proceed?
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Auto Edit Button */}
          <button
            onClick={onAutoEdit}
            disabled={isAutoEditing}
            className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl p-6 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  {isAutoEditing ? (
                    <Zap className="w-6 h-6 animate-pulse" />
                  ) : (
                    <Wand2 className="w-6 h-6" />
                  )}
                </div>
                <span className="text-2xl font-bold">Auto Edit</span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed mb-4">
                {isAutoEditing 
                  ? 'AI is optimizing your CV...' 
                  : 'Let AI automatically optimize your CV based on the recommendations above'
                }
              </p>
              <div className="space-y-2 text-xs text-white/80 text-left">
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>Apply STAR method to achievements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>Add quantifiable metrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>Improve action verbs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>Enhance ATS compatibility</span>
                </div>
              </div>
            </div>
            {isAutoEditing && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 animate-pulse" />
            )}
          </button>

          {/* Manual Edit Button */}
          <button
            onClick={onManualEdit}
            disabled={isAutoEditing}
            className="group border-2 border-purple-500 hover:border-purple-400 text-white rounded-xl p-6 transition-all duration-300 hover:bg-purple-500/20 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold">Manual Edit</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              Review and edit your CV manually with AI suggestions on the side
            </p>
            <div className="space-y-2 text-xs text-gray-400 text-left">
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3" />
                <span>Full control over all changes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3" />
                <span>View AI suggestions per section</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3" />
                <span>Accept or reject suggestions</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3" />
                <span>Customize as you prefer</span>
              </div>
            </div>
          </button>
        </div>

        {/* Info Note */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-gray-400 text-center flex items-center justify-center gap-2">
            <Lightbulb className="w-4 h-4 text-purple-400" />
            <span><strong>Tip:</strong> Auto Edit is recommended for best results, but you can still make manual adjustments afterwards</span>
          </p>
        </div>
      </div>
    </div>
  );
}
