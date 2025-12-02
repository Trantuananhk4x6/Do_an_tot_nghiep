'use client';

import { useState } from 'react';
import { CVTemplate } from '../types/cv.types';
import { TemplateInfo } from '../templates/templateData';
import { Trophy, Check } from 'lucide-react';

interface TemplatePreviewCardProps {
  template: TemplateInfo;
  isSelected: boolean;
  isTopPick: boolean;
  aiScore: number;
  onSelect: () => void;
}

export default function TemplatePreviewCard({
  template,
  isSelected,
  isTopPick,
  aiScore,
  onSelect
}: TemplatePreviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'ring-4 ring-purple-500 shadow-2xl scale-105'
          : 'hover:shadow-xl hover:scale-[1.02] border-2 border-gray-200'
      }`}
    >
      {/* Top Pick Badge */}
      {isTopPick && (
        <div className="absolute top-2 right-2 z-20 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
          <Trophy className="w-3 h-3" />
          <span>AI Top Pick</span>
        </div>
      )}

      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute top-2 left-2 z-20 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
          <Check className="w-3 h-3" />
          <span>Selected</span>
        </div>
      )}

      {/* Template Preview Image */}
      <div className={`relative h-64 bg-gradient-to-br ${template.color} overflow-hidden group`}>
        {/* Placeholder CV Preview */}
        <div className="absolute inset-0 p-4 transform transition-transform duration-300 group-hover:scale-110">
          {renderTemplatePreview(template.id)}
        </div>

        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isHovered ? 'opacity-10' : 'opacity-0'
        }`} />

        {/* Quick Action on hover */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold shadow-xl transform transition-all duration-200 hover:scale-110">
              {isSelected ? 'Selected ✓' : 'Select Template'}
            </button>
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{template.icon}</span>
          <h4 className="text-base font-bold text-gray-900 flex-1">{template.name}</h4>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {template.description}
        </p>

        {/* AI Score */}
        {aiScore > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">AI Match:</span>
              <span className={`text-sm font-bold ${
                aiScore >= 80 ? 'text-green-600' : aiScore >= 60 ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {aiScore}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  aiScore >= 80 ? 'bg-green-500' : aiScore >= 60 ? 'bg-yellow-500' : 'bg-gray-400'
                }`}
                style={{ width: `${aiScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {template.features.slice(0, 2).map((feature, i) => (
            <span
              key={i}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to render mini CV preview for each template
function renderTemplatePreview(templateId: CVTemplate) {
  const commonStyles = "bg-white shadow-lg rounded-lg overflow-hidden text-xs";

  switch (templateId) {
    case 'ats-friendly':
      return (
        <div className={`${commonStyles} p-3 space-y-2`}>
          <div className="border-b border-gray-300 pb-2">
            <div className="h-2 bg-gray-800 w-3/4 mb-1 rounded"></div>
            <div className="h-1.5 bg-gray-600 w-1/2 rounded"></div>
          </div>
          <div className="space-y-1">
            <div className="h-1 bg-gray-400 w-full rounded"></div>
            <div className="h-1 bg-gray-400 w-5/6 rounded"></div>
            <div className="h-1 bg-gray-400 w-4/6 rounded"></div>
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-gray-600 w-2/3 mb-1 rounded"></div>
            <div className="h-1 bg-gray-400 w-full rounded"></div>
            <div className="h-1 bg-gray-400 w-5/6 rounded"></div>
          </div>
        </div>
      );

    case 'modern':
      return (
        <div className={`${commonStyles}`}>
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 text-white">
            <div className="h-2 bg-white/90 w-3/4 mb-1 rounded"></div>
            <div className="h-1.5 bg-white/80 w-1/2 rounded"></div>
          </div>
          <div className="p-3 space-y-2">
            <div className="space-y-1">
              <div className="h-1 bg-blue-400 w-full rounded"></div>
              <div className="h-1 bg-blue-300 w-5/6 rounded"></div>
              <div className="h-1 bg-blue-300 w-4/6 rounded"></div>
            </div>
            <div className="flex gap-1">
              <div className="h-1 bg-cyan-400 w-1/4 rounded"></div>
              <div className="h-1 bg-cyan-400 w-1/4 rounded"></div>
              <div className="h-1 bg-cyan-400 w-1/4 rounded"></div>
            </div>
          </div>
        </div>
      );

    case 'minimal':
      return (
        <div className={`${commonStyles} p-3 space-y-2`}>
          <div className="text-center pb-2 border-b border-gray-200">
            <div className="h-2 bg-gray-700 w-3/4 mx-auto mb-1 rounded"></div>
            <div className="h-1.5 bg-gray-500 w-1/2 mx-auto rounded"></div>
          </div>
          <div className="space-y-1">
            <div className="h-1 bg-gray-300 w-full rounded"></div>
            <div className="h-1 bg-gray-300 w-5/6 rounded"></div>
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-gray-500 w-2/3 rounded"></div>
            <div className="h-1 bg-gray-300 w-full rounded"></div>
            <div className="h-1 bg-gray-300 w-4/6 rounded"></div>
          </div>
        </div>
      );

    case 'creative':
      return (
        <div className={`${commonStyles} flex`}>
          <div className="w-1/3 bg-gradient-to-b from-purple-500 to-pink-500 p-2">
            <div className="h-8 w-8 bg-white rounded-full mb-2 mx-auto"></div>
            <div className="space-y-1">
              <div className="h-1 bg-white/80 w-full rounded"></div>
              <div className="h-1 bg-white/80 w-4/5 rounded"></div>
              <div className="h-1 bg-white/80 w-3/5 rounded"></div>
            </div>
          </div>
          <div className="flex-1 p-2 space-y-1">
            <div className="h-1.5 bg-purple-600 w-3/4 rounded"></div>
            <div className="h-1 bg-gray-400 w-full rounded"></div>
            <div className="h-1 bg-gray-400 w-5/6 rounded"></div>
            <div className="h-1 bg-gray-400 w-4/6 rounded"></div>
            <div className="flex gap-1 mt-2">
              <div className="h-1 bg-pink-400 w-1/5 rounded"></div>
              <div className="h-1 bg-pink-400 w-1/5 rounded"></div>
              <div className="h-1 bg-pink-400 w-1/5 rounded"></div>
            </div>
          </div>
        </div>
      );

    case 'professional':
      return (
        <div className={`${commonStyles} p-3 space-y-2`}>
          <div className="border-l-4 border-indigo-600 pl-2 pb-2">
            <div className="h-2 bg-gray-800 w-3/4 mb-1 rounded"></div>
            <div className="h-1.5 bg-gray-600 w-1/2 rounded"></div>
          </div>
          <div className="space-y-1 pl-2">
            <div className="h-1.5 bg-indigo-600 w-2/3 mb-1 rounded"></div>
            <div className="h-1 bg-gray-400 w-full rounded"></div>
            <div className="h-1 bg-gray-400 w-5/6 rounded"></div>
            <div className="h-1 bg-gray-400 w-4/6 rounded"></div>
          </div>
          <div className="grid grid-cols-2 gap-1 pl-2">
            <div className="h-1 bg-indigo-400 rounded"></div>
            <div className="h-1 bg-indigo-400 rounded"></div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
