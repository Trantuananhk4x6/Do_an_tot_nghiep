'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  GripVertical, 
  ArrowLeft, 
  Download, 
  Lightbulb,
  LayoutGrid,
  Edit3
} from 'lucide-react';
import { CVData, CVTemplate } from '@/app/(features)/support-cv/types/cv.types';
import { useCVBuilder } from '../contexts/CVBuilderContext';
import CVTemplateRenderer from './CVTemplateRenderer';

interface CVPreviewProps {
  cvData: CVData;
  template: CVTemplate;
  onBackToEdit: () => void;
  onExport: () => void;
  onUpdateCV?: (cvData: CVData) => void; // New: allow updating CV from preview
}

type SectionType = 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'awards' | 'publications' | 'volunteer' | 'references';

interface SectionOrder {
  id: SectionType;
  label: string;
  visible: boolean;
}

export default function CVPreview({ cvData, template, onBackToEdit, onExport, onUpdateCV }: CVPreviewProps) {
  const { actions } = useCVBuilder();
  const [localCVData, setLocalCVData] = useState<CVData>(cvData);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const cvPreviewRef = useRef<HTMLDivElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [sectionOrder, setSectionOrder] = useState<SectionOrder[]>([
    { id: 'summary', label: 'Summary', visible: !!cvData.personalInfo.summary },
    { id: 'experience', label: 'Experience', visible: cvData.experiences.length > 0 },
    { id: 'education', label: 'Education', visible: cvData.education.length > 0 },
    { id: 'skills', label: 'Skills', visible: cvData.skills.length > 0 },
    { id: 'projects', label: 'Projects', visible: cvData.projects.length > 0 },
    { id: 'awards', label: 'Awards & Honors', visible: (cvData.awards && cvData.awards.length > 0) || false },
    { id: 'certifications', label: 'Certifications', visible: cvData.certifications.length > 0 },
    { id: 'languages', label: 'Languages', visible: cvData.languages.length > 0 },
    { id: 'publications', label: 'Publications', visible: (cvData.publications && cvData.publications.length > 0) || false },
    { id: 'volunteer', label: 'Volunteer', visible: (cvData.volunteer && cvData.volunteer.length > 0) || false },
    { id: 'references', label: 'References', visible: (cvData.references && cvData.references.length > 0) || false }
  ]);

  // Sync sectionOrder to context whenever it changes
  useEffect(() => {
    actions.setSectionOrder(sectionOrder);
  }, [sectionOrder, actions]);

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
      <div className="flex items-center justify-between mb-6 glass-effect rounded-xl p-4 border border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Interactive Preview
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Template: <span className="font-semibold text-purple-400">{getTemplateName()}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onBackToEdit}
            className="px-5 py-2.5 glass-effect border border-white/20 text-gray-200 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Edit
          </button>
          <button
            onClick={onExport}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Section Order Controller */}
        <div className="col-span-3 print:hidden">
          <div className="glass-effect border border-purple-500/30 rounded-xl p-4 sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white">Section Order</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">Drag to reorder sections. Click eye to toggle visibility.</p>
            
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
                  <GripVertical className="w-4 h-4 text-gray-500" />
                  <span className="flex-1 text-sm font-medium text-gray-200">{section.label}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionVisibility(section.id);
                    }}
                    className="p-1 hover:bg-white/10 rounded transition-colors print:hidden"
                    title={section.visible ? 'Hide section' : 'Show section'}
                  >
                    {section.visible ? (
                      <Eye className="w-4 h-4 text-blue-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 glass-effect border border-blue-500/30 rounded-lg p-3 print:hidden">
              <p className="text-xs text-blue-300 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
                <span><strong>Tip:</strong> Drag sections to reorder. Click eye icon to toggle visibility.</span>
              </p>
            </div>
          </div>
        </div>

        {/* CV Preview */}
        <div className="col-span-9" ref={cvPreviewRef}>
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
