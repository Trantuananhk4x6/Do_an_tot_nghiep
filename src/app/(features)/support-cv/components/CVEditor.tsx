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
import PublicationsSection from '@/app/(features)/support-cv/components/editor/PublicationsSection';
import VolunteerSection from '@/app/(features)/support-cv/components/editor/VolunteerSection';
import ReferencesSection from '@/app/(features)/support-cv/components/editor/ReferencesSection';
import TemplateSelectorPanel from '@/app/(features)/support-cv/components/TemplateSelectorPanel';
import { 
  User, Briefcase, GraduationCap, Zap, Rocket, Award, 
  Globe, Medal, BookOpen, Heart, Phone, Plus, 
  ArrowLeft, Eye, Save, Edit3, CheckCircle, Loader2, Sparkles
} from 'lucide-react';
import { AIAppliedChange } from '@/app/(features)/support-cv/types/cv.types';

interface CVEditorProps {
  cvData: CVData;
  aiSuggestions: AISuggestion[];
  aiAppliedChanges?: AIAppliedChange[];
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
  icon: React.ReactNode;
  required: boolean;
  hasData?: (data: CVData) => boolean;
}

export default function CVEditor({
  cvData,
  aiSuggestions,
  aiAppliedChanges = [],
  selectedTemplate,
  onUpdate,
  onTemplateChange,
  onPreview,
  onBackToReview,
  isGeneratingSuggestions
}: CVEditorProps) {
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [showAIBadges, setShowAIBadges] = useState(true); // Toggle to show/hide AI badges

  // Count AI changes per section
  const aiChangesBySection = useMemo(() => {
    const counts: Record<string, number> = {};
    aiAppliedChanges.forEach(change => {
      const section = change.section.toLowerCase();
      counts[section] = (counts[section] || 0) + 1;
    });
    return counts;
  }, [aiAppliedChanges]);

  // Define all possible sections with data check
  const allSections: SectionConfig[] = useMemo(() => [
    { 
      id: 'personal', 
      label: 'Personal Info', 
      icon: <User className="w-5 h-5 lg:w-6 lg:h-6" />,
      required: true 
    },
    { 
      id: 'experience', 
      label: 'Experience', 
      icon: <Briefcase className="w-5 h-5 lg:w-6 lg:h-6" />,
      required: false,
      hasData: (data) => data.experiences && data.experiences.length > 0
    },
    { 
      id: 'education', 
      label: 'Education', 
      icon: <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6" />,
      required: false,
      hasData: (data) => data.education && data.education.length > 0
    },
    { 
      id: 'skills', 
      label: 'Skills', 
      icon: <Zap className="w-5 h-5 lg:w-6 lg:h-6" />,
      required: false,
      hasData: (data) => data.skills && data.skills.length > 0
    },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: <Rocket className="w-5 h-5 lg:w-6 lg:h-6" />,
      required: false,
      hasData: (data) => data.projects && data.projects.length > 0
    },
    { 
      id: 'certifications', 
      label: 'Certifications', 
      icon: <Award className="w-5 h-5 lg:w-6 lg:h-6" />,
      required: false,
      hasData: (data) => data.certifications && data.certifications.length > 0
    },
    { 
      id: 'languages', 
      label: 'Languages', 
      icon: <Globe className="w-5 h-5 lg:w-6 lg:h-6" />,
      required: false,
      hasData: (data) => data.languages && data.languages.length > 0
    },
    { 
      id: 'awards', 
      label: 'Awards', 
      icon: <Medal className="w-5 h-5 lg:w-6 lg:h-6" />,
      required: false,
      hasData: (data) => data.awards && data.awards.length > 0
    },
    { 
      id: 'publications', 
      label: 'Publications', 
      icon: <BookOpen className="w-5 h-5 lg:w-6 lg:h-6" />,
      required: false,
      hasData: (data) => data.publications && data.publications.length > 0
    },
    { 
      id: 'volunteer', 
      label: 'Volunteer', 
      icon: <Heart className="w-5 h-5 lg:w-6 lg:h-6" />,
      required: false,
      hasData: (data) => data.volunteer && data.volunteer.length > 0
    },
    { 
      id: 'references', 
      label: 'References', 
      icon: <Phone className="w-5 h-5 lg:w-6 lg:h-6" />,
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
    <div className="space-y-4">
      {/* AI Applied Changes Banner */}
      {aiAppliedChanges.length > 0 && (
        <div className="glass-effect border border-amber-500/30 rounded-xl p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  AI Enhancements Applied
                  <span className="px-2 py-0.5 bg-amber-500/20 rounded-full text-xs font-medium">
                    {aiAppliedChanges.length} changes
                  </span>
                </h3>
                <p className="text-xs text-amber-200/70">
                  Fields enhanced by AI are marked with <Sparkles className="w-3 h-3 inline text-amber-400" /> in each section
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAIBadges(!showAIBadges)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showAIBadges 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                  : 'bg-gray-700/50 text-gray-400 border border-gray-600'
              }`}
            >
              {showAIBadges ? 'Hide Markers' : 'Show Markers'}
            </button>
          </div>
        </div>
      )}
      
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
      {/* Left Sidebar - Enhanced Navigation */}
      <div className="lg:col-span-3">
        <div className="relative glass-effect border border-purple-500/30 rounded-xl lg:rounded-2xl p-4 lg:p-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-50" />
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-xl opacity-50" />
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6 pb-3 lg:pb-4 border-b border-purple-500/30">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Edit3 className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm lg:text-lg font-bold text-white">
                  Sections
                </h3>
                <p className="text-[10px] lg:text-xs text-gray-400">Edit your CV</p>
              </div>
            </div>
          
          {/* Active Sections */}
          <div className="space-y-1.5 lg:space-y-2 mb-3 lg:mb-4 flex-1 lg:overflow-y-auto lg:custom-scrollbar lg:pr-2 overflow-x-auto flex lg:flex-col flex-row gap-2 lg:gap-0 pb-2 lg:pb-0">
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
              
              // Check for AI changes in this section
              const sectionKey = section.id.toLowerCase();
              const aiChangesCount = aiChangesBySection[sectionKey] || 
                                    aiChangesBySection[section.label.toLowerCase()] || 0;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  className={`relative group flex-shrink-0 lg:flex-shrink lg:w-full text-left px-3 lg:px-4 py-2.5 lg:py-3.5 rounded-lg lg:rounded-xl transition-all duration-300 flex items-center gap-2 lg:gap-3 overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg lg:scale-105'
                      : 'hover:bg-white/5 text-gray-300 lg:hover:scale-102 lg:hover:border-purple-500/50 border border-transparent'
                  }`}
                >
                  {/* AI Enhanced badge */}
                  {showAIBadges && aiChangesCount > 0 && (
                    <div className="absolute -top-1 -right-1 z-20">
                      <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg animate-pulse">
                        <Sparkles className="w-2.5 h-2.5 text-white" />
                        <span className="text-[9px] font-bold text-white">{aiChangesCount}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Animated background for active */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-blue-600/50 animate-pulse" />
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                      </div>
                    </>
                  )}
                  
                  <span className={`transition-all duration-300 relative z-10 ${
                    isActive ? 'lg:scale-110' : 'lg:group-hover:scale-110'
                  }`}>
                    {section.icon}
                  </span>
                  <div className="flex-1 min-w-0 relative z-10 hidden lg:block">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate">{section.label}</span>
                      {section.required && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/50">Required</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {dataCount > 0 && (
                        <span className={`text-xs ${
                          isActive ? 'text-white/80' : 'text-purple-400'
                        }`}>{dataCount} {dataCount === 1 ? 'item' : 'items'}</span>
                      )}
                      {showAIBadges && aiChangesCount > 0 && (
                        <span className="text-xs text-amber-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI edited
                        </span>
                      )}
                    </div>
                  </div>
                  {isActive && (
                    <div className="relative z-10 items-center gap-1 hidden lg:flex">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-white/80">Editing</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Add Section Button - Hidden on mobile */}
          {availableSections.length > 0 && (
            <div className="pt-3 lg:pt-4 border-t border-purple-500/30 hidden lg:block">
              <details className="group">
                <summary className="cursor-pointer px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl hover:bg-purple-500/20 text-gray-300 hover:text-white transition-all flex items-center gap-2 lg:gap-3 text-xs lg:text-sm font-medium border border-purple-500/30 hover:border-purple-500/50">
                  <Plus className="w-4 h-4 lg:w-5 lg:h-5 group-open:rotate-90 transition-transform duration-300" />
                  <span className="flex-1">Add New Section</span>
                  <span className="px-1.5 lg:px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] lg:text-xs">{availableSections.length}</span>
                </summary>
                <div className="mt-2 space-y-1 pl-2 animate-fade-in max-h-40 overflow-y-auto custom-scrollbar">
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
                      className="w-full text-left px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg hover:bg-purple-500/20 text-gray-400 hover:text-white transition-all flex items-center gap-2 lg:gap-3 text-xs lg:text-sm border border-transparent hover:border-purple-500/30 group"
                    >
                      <span className="group-hover:scale-110 transition-transform">{section.icon}</span>
                      <span>{section.label}</span>
                    </button>
                  ))}
                </div>
              </details>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-purple-500/30 space-y-2 lg:space-y-3">
            {onBackToReview && (
              <button
                onClick={onBackToReview}
                className="w-full glass-effect border-2 border-yellow-500/50 text-yellow-300 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold hover:bg-yellow-500/20 hover:border-yellow-500 transition-all flex items-center justify-center gap-2 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Review</span>
              </button>
            )}
            
            <button
              onClick={onPreview}
              className="relative w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 lg:py-3.5 rounded-lg lg:rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group overflow-hidden text-sm lg:text-base"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              <Eye className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
              <span className="relative z-10">Preview CV</span>
            </button>
            
            <div className="hidden lg:flex items-center justify-center gap-2 glass-effect border border-purple-500/30 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-sm text-purple-300">
              <Save className="w-4 h-4 animate-pulse" />
              <span className="font-medium">Auto-saved</span>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Main Content Area - Enhanced */}
      <div className="lg:col-span-6">
        <div className="relative glass-effect border border-purple-500/30 rounded-xl lg:rounded-2xl overflow-hidden">
          {/* Animated border glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 blur opacity-50 animate-pulse" />
          {/* Section Header */}
          <div className="relative bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-b border-purple-500/30 px-4 lg:px-6 py-4 lg:py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-xl lg:text-2xl">
                    {visibleSections.find(s => s.id === activeSection)?.icon}
                  </span>
                </div>
                <div>
                  <h2 className="text-base lg:text-lg font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                    {visibleSections.find(s => s.id === activeSection)?.label}
                  </h2>
                  <p className="text-[10px] lg:text-xs text-gray-400 mt-0.5 flex items-center gap-1 lg:gap-1.5">
                    {visibleSections.find(s => s.id === activeSection)?.required ? (
                      <>
                        <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-red-400 animate-pulse" />
                        <span>Required</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span>Optional</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              
              {/* Progress Indicator - Hidden on small screens */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="text-right">
                  <div className="text-[10px] lg:text-xs text-gray-400 uppercase tracking-wider">Progress</div>
                  <div className="text-base lg:text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {Math.floor((visibleSections.indexOf(visibleSections.find(s => s.id === activeSection)!) + 1) / visibleSections.length * 100)}%
                  </div>
                </div>
                <div className="w-12 h-12 lg:w-14 lg:h-14 relative">
                  <svg className="w-12 h-12 lg:w-14 lg:h-14 transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="3"
                      fill="none"
                      className="lg:hidden"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${(visibleSections.indexOf(visibleSections.find(s => s.id === activeSection)!) + 1) / visibleSections.length * 126} 126`}
                      strokeLinecap="round"
                      className="transition-all duration-500 lg:hidden"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="4"
                      fill="none"
                      className="hidden lg:block"
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
                      className="transition-all duration-500 hidden lg:block"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] lg:text-xs font-bold text-white">
                      {visibleSections.indexOf(visibleSections.find(s => s.id === activeSection)!) + 1}/{visibleSections.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Changes for Current Section */}
          {showAIBadges && (() => {
            const sectionKey = activeSection.toLowerCase();
            const sectionChanges = aiAppliedChanges.filter(change => 
              change.section.toLowerCase() === sectionKey ||
              change.section.toLowerCase() === visibleSections.find(s => s.id === activeSection)?.label.toLowerCase()
            );
            
            if (sectionChanges.length === 0) return null;
            
            return (
              <div className="relative mx-4 lg:mx-6 mt-4 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-300">
                    AI Enhanced Fields ({sectionChanges.length})
                  </span>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                  {sectionChanges.map((change, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded font-medium whitespace-nowrap">
                        {change.field}
                      </span>
                      <span className="text-gray-400 truncate flex-1" title={change.reason}>
                        {change.reason}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
          
          {/* Section Content with Better Scrolling */}
          <div className="relative p-4 lg:p-6 max-h-[60vh] lg:max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
            {activeSection === 'personal' && (
            <PersonalInfoSection
              data={cvData.personalInfo}
              onChange={(personalInfo) => onUpdate({ ...cvData, personalInfo })}
              aiAppliedChanges={aiAppliedChanges}
            />
          )}

          {activeSection === 'experience' && (
            <ExperienceSection
              data={cvData.experiences}
              onChange={(experiences) => onUpdate({ ...cvData, experiences })}
              aiAppliedChanges={aiAppliedChanges}
            />
          )}

          {activeSection === 'education' && (
            <EducationSection
              data={cvData.education}
              onChange={(education) => onUpdate({ ...cvData, education })}
              aiAppliedChanges={aiAppliedChanges}
            />
          )}

          {activeSection === 'skills' && (
            <SkillsSection
              data={cvData.skills}
              onChange={(skills) => onUpdate({ ...cvData, skills })}
              aiAppliedChanges={aiAppliedChanges}
            />
          )}

          {activeSection === 'projects' && (
            <ProjectsSection
              data={cvData.projects}
              onChange={(projects) => onUpdate({ ...cvData, projects })}
              aiAppliedChanges={aiAppliedChanges}
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

          {activeSection === 'publications' && (
            <PublicationsSection
              data={cvData.publications || []}
              onChange={(publications) => onUpdate({ ...cvData, publications })}
            />
          )}

          {activeSection === 'volunteer' && (
            <VolunteerSection
              data={cvData.volunteer || []}
              onChange={(volunteer) => onUpdate({ ...cvData, volunteer })}
            />
          )}

          {activeSection === 'references' && (
            <ReferencesSection
              data={cvData.references || []}
              onChange={(references) => onUpdate({ ...cvData, references })}
            />
          )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Template Selector with AI Recommendation */}
      <div className="lg:col-span-3">
        <div className="relative lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] glass-effect border border-purple-500/30 rounded-xl lg:rounded-2xl overflow-hidden">
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
    </div>
  );
}
