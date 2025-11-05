'use client';

import React, { useState } from 'react';
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
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4 glow-effect">
          <span className="text-4xl">🤖</span>
        </div>
        <h2 className="text-4xl font-bold gradient-text mb-2">
          AI CV Review Complete
        </h2>
        <p className="text-gray-300 text-lg">
          Here's what our AI thinks about your CV
        </p>
      </div>

      {/* Overall Score Card */}
      <div className="glass-effect border-2 border-purple-500/50 rounded-2xl p-8 mb-6 glow-effect">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">Overall Score</h3>
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
              <span className="text-sm text-gray-300">ATS Compatibility</span>
              <span className={`text-lg font-bold ${getScoreColor(review.atsScore)}`}>
                {review.atsScore}%
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  review.atsScore >= 80 ? 'bg-green-500' :
                  review.atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${review.atsScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Impact & Results</span>
              <span className={`text-lg font-bold ${getScoreColor(review.impactScore)}`}>
                {review.impactScore}%
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  review.impactScore >= 80 ? 'bg-green-500' :
                  review.impactScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${review.impactScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Clarity & Format</span>
              <span className={`text-lg font-bold ${getScoreColor(review.clarityScore)}`}>
                {review.clarityScore}%
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${
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
            <span className="text-3xl">✅</span>
            <h3 className="text-xl font-bold text-green-400">Strengths</h3>
          </div>
          <ul className="space-y-3">
            {review.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-300">
                <span className="text-green-400 mt-1">●</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="glass-effect border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-xl font-bold text-red-400">Areas for Improvement</h3>
          </div>
          <ul className="space-y-3">
            {review.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-300">
                <span className="text-red-400 mt-1">●</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="glass-effect border border-purple-500/30 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">💡</span>
          <h3 className="text-xl font-bold text-purple-400">AI Recommendations</h3>
        </div>
        <div className="space-y-3">
          {review.suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <span className="text-purple-400 font-bold text-sm mt-0.5">{index + 1}</span>
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
                <span className="text-4xl">{isAutoEditing ? '⚙️' : '🤖'}</span>
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
                  <span>✓</span>
                  <span>Apply STAR method to achievements</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Add quantifiable metrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Improve action verbs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
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
              <span className="text-4xl">✏️</span>
              <span className="text-2xl font-bold">Manual Edit</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              Review and edit your CV manually with AI suggestions on the side
            </p>
            <div className="space-y-2 text-xs text-gray-400 text-left">
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Full control over all changes</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>View AI suggestions per section</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Accept or reject suggestions</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Customize as you prefer</span>
              </div>
            </div>
          </button>
        </div>

        {/* Info Note */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-gray-400 text-center">
            💡 <strong>Tip:</strong> Auto Edit is recommended for best results, but you can still make manual adjustments afterwards
          </p>
        </div>
      </div>
    </div>
  );
}
