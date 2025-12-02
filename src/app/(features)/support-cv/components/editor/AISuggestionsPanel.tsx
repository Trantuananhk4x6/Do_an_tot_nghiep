'use client';

import React from 'react';
import { AISuggestion } from '@/app/(features)/support-cv/types/cv.types';
import { Sparkles, Bot, Lightbulb, BarChart2, Check, MessageCircle } from 'lucide-react';

interface AISuggestionsPanelProps {
  suggestions: AISuggestion[];
  isGenerating: boolean;
}

export default function AISuggestionsPanel({ suggestions, isGenerating }: AISuggestionsPanelProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-500" />
        AI Suggestions
      </h3>

      {isGenerating ? (
        <div className="text-center py-8">
          <Bot className="w-12 h-12 mx-auto mb-4 text-purple-500 animate-pulse" />
          <p className="text-gray-600">Analyzing your CV...</p>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-600 uppercase">
                  {suggestion.section}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  suggestion.score >= 80 ? 'bg-green-100 text-green-700' :
                  suggestion.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  Score: {suggestion.score}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                <strong>Original:</strong> {suggestion.originalText.substring(0, 80)}...
              </p>

              <p className="text-sm text-gray-900 mb-2">
                <strong>Suggested:</strong> {suggestion.suggestedText}
              </p>

              <p className="text-xs text-gray-500 mb-3 flex items-start gap-1">
                <Lightbulb className="w-3 h-3 flex-shrink-0 mt-0.5" />
                {suggestion.reason}
              </p>

              {suggestion.actionVerbs && suggestion.actionVerbs.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {suggestion.actionVerbs.map((verb, i) => (
                    <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {verb}
                    </span>
                  ))}
                </div>
              )}

              {suggestion.metrics && suggestion.metrics.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {suggestion.metrics.map((metric, i) => (
                    <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                      <BarChart2 className="w-3 h-3" />
                      {metric}
                    </span>
                  ))}
                </div>
              )}

              <button className="w-full mt-3 bg-purple-500 text-white py-2 rounded-lg text-sm hover:bg-purple-600 transition-all flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Apply Suggestion
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-sm">
            No suggestions yet. Fill in your experience to get AI-powered recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
