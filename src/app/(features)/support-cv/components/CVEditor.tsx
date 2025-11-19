'use client';

import React, { useState, useMemo } from 'react';
import { CVData, AISuggestion, CVTemplate } from '@/app/(features)/support-cv/types/cv.types';
import PersonalInfoSection from '@/app/(features)/support-cv/components/editor/PersonalInfoSection';
import ExperienceSection from '@/app/(features)/support-cv/components/editor/ExperienceSection';
import EducationSection from '@/app/(features)/support-cv/components/editor/EducationSection';
import SkillsSection from '@/app/(features)/support-cv/components/editor/SkillsSection';
import ProjectsSection from '@/app/(features)/support-cv/components/editor/ProjectsSection';
import CertificationsSection from '@/app/(features)/support-cv/components/editor/CertificationsSection';
import LanguagesSection from '@/app/(features)/support-cv/components/editor/LanguagesSection';
import AwardsSection from '@/app/(features)/support-cv/components/editor/AwardsSection';
import TemplateSelectorPanel from '@/app/(features)/support-cv/components/TemplateSelectorPanel';

interface CVEditorProps {
  cvData: CVData;
  aiSuggestions: AISuggestion[];
  selectedTemplate: CVTemplate;
  onUpdate: (cvData: CVData) => void;
  onTemplateChange: (template: CVTemplate) => void;
  onPreview: () => void;
  onBackToReview?: () => void; // Optional: go back to review screen
  isGeneratingSuggestions: boolean;
}

interface SectionConfig {
  id: string;
  label: string;
  icon: string;
  required: boolean;
  hasData?: (data: CVData) => boolean;
}

export default function CVEditor({
  cvData,
  aiSuggestions,
  selectedTemplate,
  onUpdate,
  onTemplateChange,
  onPreview,
  onBackToReview,
  isGeneratingSuggestions
}: CVEditorProps) {
  const [activeSection, setActiveSection] = useState<string>('personal');

  // Define all possible sections with data check
  const allSections: SectionConfig[] = useMemo(() => [
    { 
      id: 'personal', 
      label: 'Personal Info', 
      icon: '👤',
      required: true 
    },
    { 
      id: 'experience', 
      label: 'Experience', 
      icon: '💼',
      required: false,
      hasData: (data) => data.experiences && data.experiences.length > 0
    },
    { 
      id: 'education', 
      label: 'Education', 
      icon: '🎓',
      required: false,
      hasData: (data) => data.education && data.education.length > 0
    },
    { 
      id: 'skills', 
      label: 'Skills', 
      icon: '⚡',
      required: false,
      hasData: (data) => data.skills && data.skills.length > 0
    },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: '🚀',
      required: false,
      hasData: (data) => data.projects && data.projects.length > 0
    },
    { 
      id: 'certifications', 
      label: 'Certifications', 
      icon: '🏆',
      required: false,
      hasData: (data) => data.certifications && data.certifications.length > 0
    },
    { 
      id: 'languages', 
      label: 'Languages', 
      icon: '🌍',
      required: false,
      hasData: (data) => data.languages && data.languages.length > 0
    },
    { 
      id: 'awards', 
      label: 'Awards', 
      icon: '🥇',
      required: false,
      hasData: (data) => data.awards && data.awards.length > 0
    },
    { 
      id: 'publications', 
      label: 'Publications', 
      icon: '📚',
      required: false,
      hasData: (data) => data.publications && data.publications.length > 0
    },
    { 
      id: 'volunteer', 
      label: 'Volunteer', 
      icon: '🤝',
      required: false,
      hasData: (data) => data.volunteer && data.volunteer.length > 0
    },
    { 
      id: 'references', 
      label: 'References', 
      icon: '📞',
      required: false,
      hasData: (data) => data.references && data.references.length > 0
    }
  ], []);

  // Dynamic sections - show required + sections with data + option to add new
  const visibleSections = useMemo(() => {
    return allSections.filter(section => {
      if (section.required) return true;
      if (section.hasData) return section.hasData(cvData);
      return false;
    });
  }, [cvData, allSections]);

  // Available sections to add (not yet visible)
  const availableSections = useMemo(() => {
    return allSections.filter(section => {
      if (section.required) return false;
      if (section.hasData) return !section.hasData(cvData);
      return true;
    });
  }, [cvData, allSections]);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Sidebar - Smart Navigation */}
      <div className="col-span-2">
        <div className="glass-effect border border-white/10 rounded-2xl p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl animate-float">✏️</span>
            <h3 className="text-sm font-bold text-purple-300 uppercase">
              Sections
            </h3>
          </div>
          
          {/* Active Sections */}
          <div className="space-y-2 mb-4">
            {visibleSections.map(section => {
              const isActive = activeSection === section.id;
              const dataCount = section.hasData ? (
                section.id === 'experience' ? cvData.experiences?.length :
                section.id === 'education' ? cvData.education?.length :
                section.id === 'skills' ? cvData.skills?.length :
                section.id === 'projects' ? cvData.projects?.length :
                section.id === 'certifications' ? cvData.certifications?.length :
                section.id === 'languages' ? cvData.languages?.length :
                section.id === 'awards' ? cvData.awards?.length :
                section.id === 'publications' ? cvData.publications?.length :
                section.id === 'volunteer' ? cvData.volunteer?.length :
                section.id === 'references' ? cvData.references?.length : 0
              ) : 0;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`group w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg glow-effect scale-105'
                      : 'hover:bg-white/10 text-gray-300 hover:scale-102'
                  }`}
                >
                  <span className={`text-xl transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {section.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium block truncate">{section.label}</span>
                    {isActive && (
                      <span className="text-xs text-white/70">Editing now</span>
                    )}
                    {!isActive && dataCount > 0 && (
                      <span className="text-xs text-purple-400">{dataCount} items</span>
                    )}
                  </div>
                  {isActive && (
                    <span className="text-green-400 animate-pulse">●</span>
                  )}
                  {section.required && (
                    <span className="text-xs text-red-400">*</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Add Section Button */}
          {availableSections.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <details className="group">
                <summary className="cursor-pointer px-4 py-2 rounded-lg hover:bg-white/10 text-gray-300 flex items-center gap-2 text-sm">
                  <span className="text-lg group-open:rotate-90 transition-transform">➕</span>
                  <span>Add Section</span>
                  <span className="text-xs text-gray-500">({availableSections.length})</span>
                </summary>
                <div className="mt-2 space-y-1 pl-2">
                  {availableSections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => {
                        // Initialize empty array for this section
                        const sectionKey = section.id === 'experience' ? 'experiences' :
                                         section.id === 'education' ? 'education' :
                                         section.id === 'skills' ? 'skills' :
                                         section.id === 'projects' ? 'projects' :
                                         section.id === 'certifications' ? 'certifications' :
                                         section.id === 'languages' ? 'languages' :
                                         section.id;
                        
                        onUpdate({
                          ...cvData,
                          [sectionKey]: []
                        });
                        setActiveSection(section.id);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-500/20 text-gray-400 hover:text-white transition-all flex items-center gap-2 text-sm"
                    >
                      <span>{section.icon}</span>
                      <span>{section.label}</span>
                    </button>
                  ))}
                </div>
              </details>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
            {/* Back to Review button - only show if onBackToReview is provided */}
            {onBackToReview && (
              <button
                onClick={onBackToReview}
                className="w-full glass-effect border border-yellow-500/50 text-yellow-300 py-2.5 rounded-lg text-sm font-medium hover:bg-yellow-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span>Back to Review</span>
              </button>
            )}
            
            <button
              onClick={onPreview}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg glow-effect flex items-center justify-center gap-2 group"
            >
              <span className="group-hover:scale-110 transition-transform">👁️</span>
              <span>Preview CV</span>
            </button>
            
            <button
              className="w-full glass-effect border border-purple-500/50 text-purple-300 py-2 rounded-lg text-sm font-medium hover:bg-purple-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>💾</span>
              <span>Auto-saved</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Enhanced */}
      <div className="col-span-6">
        <div className="glass-effect border border-white/10 rounded-2xl overflow-hidden">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-b border-white/10 px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {visibleSections.find(s => s.id === activeSection)?.icon}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {visibleSections.find(s => s.id === activeSection)?.label}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {visibleSections.find(s => s.id === activeSection)?.required 
                      ? 'Required section - Complete all fields' 
                      : 'Optional section - Add relevant information'}
                  </p>
                </div>
              </div>
              
              {/* Progress Indicator */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs text-gray-400">Progress</div>
                  <div className="text-sm font-bold text-purple-400">
                    {Math.floor((visibleSections.indexOf(visibleSections.find(s => s.id === activeSection)!) + 1) / visibleSections.length * 100)}%
                  </div>
                </div>
                <div className="w-12 h-12 relative">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${(visibleSections.indexOf(visibleSections.find(s => s.id === activeSection)!) + 1) / visibleSections.length * 125} 125`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Section Content with Padding */}
          <div className="p-8 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
            {activeSection === 'personal' && (
            <PersonalInfoSection
              data={cvData.personalInfo}
              onChange={(personalInfo) => onUpdate({ ...cvData, personalInfo })}
            />
          )}

          {activeSection === 'experience' && (
            <ExperienceSection
              data={cvData.experiences}
              onChange={(experiences) => onUpdate({ ...cvData, experiences })}
            />
          )}

          {activeSection === 'education' && (
            <EducationSection
              data={cvData.education}
              onChange={(education) => onUpdate({ ...cvData, education })}
            />
          )}

          {activeSection === 'skills' && (
            <SkillsSection
              data={cvData.skills}
              onChange={(skills) => onUpdate({ ...cvData, skills })}
            />
          )}

          {activeSection === 'projects' && (
            <ProjectsSection
              data={cvData.projects}
              onChange={(projects) => onUpdate({ ...cvData, projects })}
            />
          )}

          {activeSection === 'certifications' && (
            <CertificationsSection
              data={cvData.certifications}
              onChange={(certifications) => onUpdate({ ...cvData, certifications })}
            />
          )}

          {activeSection === 'languages' && (
            <LanguagesSection
              data={cvData.languages}
              onChange={(languages) => onUpdate({ ...cvData, languages })}
            />
          )}

          {activeSection === 'awards' && (
            <AwardsSection
              data={cvData.awards || []}
              onChange={(awards) => onUpdate({ ...cvData, awards })}
            />
          )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Template Selector with AI Recommendation */}
      <div className="col-span-4">
        <div className="sticky top-4 max-h-[calc(100vh-2rem)]">
          <TemplateSelectorPanel
            selectedTemplate={selectedTemplate}
            onSelectTemplate={onTemplateChange}
            cvData={cvData}
          />
        </div>
      </div>
    </div>
  );
}
