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
      {/* Left Sidebar - Enhanced Navigation */}
      <div className="col-span-4">
        <div className="relative glass-effect border border-purple-500/30 rounded-2xl p-6 sticky top-4 max-h-[calc(100vh-2rem)] overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-50" />
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-xl opacity-50" />
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-purple-500/30">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-2xl">✏️</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Sections
                </h3>
                <p className="text-xs text-gray-400">Edit your CV</p>
              </div>
            </div>
          
          {/* Active Sections */}
          <div className="space-y-2 mb-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {visibleSections.map((section, index) => {
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
                  style={{ animationDelay: `${index * 0.05}s` }}
                  className={`relative group w-full text-left px-4 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-3 overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105'
                      : 'hover:bg-white/5 text-gray-300 hover:scale-102 hover:border-purple-500/50 border border-transparent'
                  }`}
                >
                  {/* Animated background for active */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-blue-600/50 animate-pulse" />
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                      </div>
                    </>
                  )}
                  
                  <span className={`text-2xl transition-all duration-300 relative z-10 ${
                    isActive ? 'scale-110 animate-bounce-slow' : 'group-hover:scale-110'
                  }`}>
                    {section.icon}
                  </span>
                  <div className="flex-1 min-w-0 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate">{section.label}</span>
                      {section.required && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/50">Required</span>
                      )}
                    </div>
                    {dataCount > 0 && (
                      <span className={`text-xs ${
                        isActive ? 'text-white/80' : 'text-purple-400'
                      }`}>{dataCount} {dataCount === 1 ? 'item' : 'items'}</span>
                    )}
                  </div>
                  {isActive && (
                    <div className="relative z-10 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-white/80">Editing</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Add Section Button */}
          {availableSections.length > 0 && (
            <div className="pt-4 border-t border-purple-500/30">
              <details className="group">
                <summary className="cursor-pointer px-4 py-3 rounded-xl hover:bg-purple-500/20 text-gray-300 hover:text-white transition-all flex items-center gap-3 text-sm font-medium border border-purple-500/30 hover:border-purple-500/50">
                  <span className="text-xl group-open:rotate-90 transition-transform duration-300">➕</span>
                  <span className="flex-1">Add New Section</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs">{availableSections.length}</span>
                </summary>
                <div className="mt-2 space-y-1 pl-2 animate-fade-in">
                  {availableSections.map((section, idx) => (
                    <button
                      key={section.id}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                      onClick={() => {
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
                      className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-purple-500/20 text-gray-400 hover:text-white transition-all flex items-center gap-3 text-sm border border-transparent hover:border-purple-500/30 group"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">{section.icon}</span>
                      <span>{section.label}</span>
                    </button>
                  ))}
                </div>
              </details>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t border-purple-500/30 space-y-3">
            {onBackToReview && (
              <button
                onClick={onBackToReview}
                className="w-full glass-effect border-2 border-yellow-500/50 text-yellow-300 py-3 rounded-xl text-sm font-semibold hover:bg-yellow-500/20 hover:border-yellow-500 transition-all flex items-center justify-center gap-2 group"
              >
                <span className="group-hover:-translate-x-1 transition-transform text-lg">←</span>
                <span>Back to Review</span>
              </button>
            )}
            
            <button
              onClick={onPreview}
              className="relative w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3.5 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              <span className="group-hover:scale-110 transition-transform text-xl relative z-10">👁️</span>
              <span className="relative z-10">Preview CV</span>
            </button>
            
            <div className="flex items-center justify-center gap-2 glass-effect border border-purple-500/30 py-2.5 rounded-xl text-sm text-purple-300">
              <span className="animate-pulse">💾</span>
              <span className="font-medium">Auto-saved</span>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Main Content Area - Enhanced */}
      <div className="col-span-4">
        <div className="relative glass-effect border border-purple-500/30 rounded-2xl overflow-hidden">
          {/* Animated border glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 blur opacity-50 animate-pulse" />
          {/* Section Header */}
          <div className="relative bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-b border-purple-500/30 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <span className="text-2xl">
                    {visibleSections.find(s => s.id === activeSection)?.icon}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                    {visibleSections.find(s => s.id === activeSection)?.label}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                    {visibleSections.find(s => s.id === activeSection)?.required ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        <span>Required</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span>Optional</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              
              {/* Progress Indicator */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Progress</div>
                  <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {Math.floor((visibleSections.indexOf(visibleSections.find(s => s.id === activeSection)!) + 1) / visibleSections.length * 100)}%
                  </div>
                </div>
                <div className="w-14 h-14 relative">
                  <svg className="w-14 h-14 transform -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${(visibleSections.indexOf(visibleSections.find(s => s.id === activeSection)!) + 1) / visibleSections.length * 151} 151`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {visibleSections.indexOf(visibleSections.find(s => s.id === activeSection)!) + 1}/{visibleSections.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Section Content with Better Scrolling */}
          <div className="relative p-6 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
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
        <div className="relative sticky top-4 max-h-[calc(100vh-2rem)] glass-effect border border-purple-500/30 rounded-2xl overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-50" />
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-xl opacity-50" />
          
          <div className="relative z-10 h-full">
            <TemplateSelectorPanel
              selectedTemplate={selectedTemplate}
              onSelectTemplate={onTemplateChange}
              cvData={cvData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
