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
  const [editingField, setEditingField] = useState<string | null>(null);
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

  const handleTextEdit = (field: string, value: string) => {
    const keys = field.split('.');
    const updated = { ...localCVData };
    
    if (keys[0] === 'personalInfo') {
      (updated.personalInfo as any)[keys[1]] = value;
    }
    
    setLocalCVData(updated);
  };

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
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          👁️ Interactive Preview
          <span className="text-sm font-normal text-gray-500">(Click to edit, drag to reorder)</span>
        </h2>
        <div className="flex gap-3">
          <button
            onClick={onBackToEdit}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
          >
            ← Back to Edit
          </button>
          <button
            onClick={onExport}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg"
          >
            Export CV →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Section Order Controller */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-4 sticky top-4">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📋</span>
              <span>Section Order</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">Drag to reorder sections</p>
            
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
                      ? 'border-purple-500 bg-purple-50 scale-105' 
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  } ${!section.visible ? 'opacity-50' : ''}`}
                >
                  <span className="text-xl">☰</span>
                  <span className="flex-1 text-sm font-medium">{section.label}</span>
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

            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
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

// Helper function to render sections
function renderSection(sectionId: SectionType, cvData: CVData) {
  switch (sectionId) {
    case 'summary':
      return cvData.personalInfo.summary ? (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-2">
            Professional Summary
          </h2>
          <p 
            className="text-gray-700 leading-relaxed cursor-text hover:bg-yellow-50 p-2 rounded"
            contentEditable
            suppressContentEditableWarning
          >
            {cvData.personalInfo.summary}
          </p>
        </div>
      ) : null;

    case 'experience':
      return cvData.experiences.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase border-b border-gray-300 pb-2">
            Work Experience
          </h2>
          <div className="space-y-6">
            {cvData.experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 cursor-text hover:bg-yellow-50 px-1 rounded" contentEditable suppressContentEditableWarning>
                      {exp.position}
                    </h3>
                    <p className="text-gray-700 cursor-text hover:bg-yellow-50 px-1 rounded" contentEditable suppressContentEditableWarning>
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {exp.achievements.filter(a => a).map((achievement, i) => (
                      <li key={i} className="cursor-text hover:bg-yellow-50 px-1 rounded" contentEditable suppressContentEditableWarning>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null;

    case 'education':
      return cvData.education.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase border-b border-gray-300 pb-2">
            Education
          </h2>
          <div className="space-y-4">
            {cvData.education.map(edu => (
              <div key={edu.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-gray-700">{edu.school}</p>
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                {edu.gpa && (
                  <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null;

    case 'skills':
      return cvData.skills.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase border-b border-gray-300 pb-2">
            Skills
          </h2>
          <div className="space-y-3">
            {Object.entries(
              cvData.skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill.name);
                return acc;
              }, {} as Record<string, string[]>)
            ).map(([category, skills]) => (
              <div key={category}>
                <span className="font-bold text-gray-900">{category}:</span>{' '}
                <span className="text-gray-700">{skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null;

    case 'projects':
      return cvData.projects.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase border-b border-gray-300 pb-2">
            Projects
          </h2>
          <div className="space-y-6">
            {cvData.projects.map(project => (
              <div key={project.id}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {project.link}
                      </a>
                    )}
                  </div>
                  {(project.startDate || project.endDate) && (
                    <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                      {project.startDate} {project.endDate && `- ${project.endDate}`}
                    </span>
                  )}
                </div>
                {project.description && (
                  <p className="text-gray-700 mb-2">{project.description}</p>
                )}
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null;

    case 'certifications':
      return cvData.certifications.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase border-b border-gray-300 pb-2">
            Certifications
          </h2>
          <div className="space-y-4">
            {cvData.certifications.map(cert => (
              <div key={cert.id}>
                <h3 className="text-lg font-bold text-gray-900">{cert.name}</h3>
                <p className="text-gray-700">{cert.issuer}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span>Issued: {cert.date}</span>
                  {cert.expiryDate && <span>Expires: {cert.expiryDate}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null;

    case 'languages':
      return cvData.languages.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase border-b border-gray-300 pb-2">
            Languages
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {cvData.languages.map(lang => (
              <div key={lang.id} className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{lang.name}</span>
                <span className="text-sm text-gray-600 capitalize">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null;

    default:
      return null;
  }
}
