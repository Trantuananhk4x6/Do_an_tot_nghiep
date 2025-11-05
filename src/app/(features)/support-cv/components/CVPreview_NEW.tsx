'use client';

import React, { useState } from 'react';
import { CVData, CVTemplate } from '@/app/(features)/support-cv/types/cv.types';
import CVTemplateRenderer from './CVTemplateRenderer';

interface CVPreviewProps {
  cvData: CVData;
  template: CVTemplate;
  onBackToEdit: () => void;
  onExport: () => void;
}

type SectionType = 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages';

interface SectionOrder {
  id: SectionType;
  label: string;
  visible: boolean;
}

export default function CVPreview({ cvData, template, onBackToEdit, onExport }: CVPreviewProps) {
  const [localCVData, setLocalCVData] = useState<CVData>(cvData);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const [sectionOrder, setSectionOrder] = useState<SectionOrder[]>([
    { id: 'summary', label: 'Summary', visible: !!cvData.personalInfo.summary },
    { id: 'experience', label: 'Experience', visible: cvData.experiences.length > 0 },
    { id: 'education', label: 'Education', visible: cvData.education.length > 0 },
    { id: 'skills', label: 'Skills', visible: cvData.skills.length > 0 },
    { id: 'projects', label: 'Projects', visible: cvData.projects.length > 0 },
    { id: 'certifications', label: 'Certifications', visible: cvData.certifications.length > 0 },
    { id: 'languages', label: 'Languages', visible: cvData.languages.length > 0 }
  ]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newOrder = [...sectionOrder];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    
    setSectionOrder(newOrder);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const toggleSectionVisibility = (id: SectionType) => {
    setSectionOrder(prev => prev.map(section => 
      section.id === id ? { ...section, visible: !section.visible } : section
    ));
  };

  // Get template name for display
  const getTemplateName = () => {
    const names = {
      'ats-friendly': 'ATS-Friendly',
      'modern': 'Modern Professional',
      'minimal': 'Clean Minimal',
      'creative': 'Creative Bold',
      'professional': 'Executive Professional'
    };
    return names[template] || template;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 glass-effect rounded-lg p-4 border border-white/10">
        <div>
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
            👁️ Interactive Preview
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            Template: <span className="font-semibold text-purple-400">{getTemplateName()}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onBackToEdit}
            className="px-6 py-3 glass-effect border border-white/20 text-gray-200 rounded-lg hover:bg-white/10 transition-all"
          >
            ← Back to Edit
          </button>
          <button
            onClick={onExport}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg glow-effect"
          >
            Export CV →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Section Order Controller */}
        <div className="col-span-3">
          <div className="glass-effect border border-white/10 rounded-xl p-4 sticky top-4">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span>📋</span>
              <span>Section Order</span>
            </h3>
            <p className="text-xs text-gray-400 mb-4">Drag to reorder sections</p>
            
            <div className="space-y-2">
              {sectionOrder.map((section, index) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-move transition-all ${
                    draggedIndex === index 
                      ? 'border-purple-500 bg-purple-500/20 scale-105' 
                      : 'border-white/10 hover:border-purple-400 hover:bg-white/5'
                  } ${!section.visible ? 'opacity-50' : ''}`}
                >
                  <span className="text-xl">☰</span>
                  <span className="flex-1 text-sm font-medium text-gray-200">{section.label}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionVisibility(section.id);
                    }}
                    className="text-xs"
                  >
                    {section.visible ? '👁️' : '🚫'}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 glass-effect border border-blue-500/30 rounded-lg p-3">
              <p className="text-xs text-blue-300">
                💡 <strong>Tip:</strong> Drag sections to reorder. Click eye icon to hide/show.
              </p>
            </div>
          </div>
        </div>

        {/* CV Preview */}
        <div className="col-span-9">
          <CVTemplateRenderer
            cvData={localCVData}
            template={template}
            sectionOrder={sectionOrder}
          />
        </div>
      </div>
    </div>
  );
}
