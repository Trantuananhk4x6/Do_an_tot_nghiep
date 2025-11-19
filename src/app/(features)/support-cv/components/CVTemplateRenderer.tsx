'use client';

import React from 'react';
import Image from 'next/image';
import { CVData, CVTemplate } from '@/app/(features)/support-cv/types/cv.types';

interface CVTemplateRendererProps {
  cvData: CVData;
  template: CVTemplate;
  sectionOrder: Array<{
    id: string;
    label: string;
    visible: boolean;
  }>;
}

export default function CVTemplateRenderer({ cvData, template, sectionOrder }: CVTemplateRendererProps) {
  // Get template colors and styles
  const getTemplateStyles = () => {
    switch (template) {
      case 'modern':
        return {
          headerBg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          headerText: 'text-white',
          accentColor: 'text-blue-600',
          borderColor: 'border-blue-500',
          sectionBg: 'bg-blue-50'
        };
      case 'creative':
        return {
          headerBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
          headerText: 'text-white',
          accentColor: 'text-purple-600',
          borderColor: 'border-purple-500',
          sectionBg: 'bg-purple-50'
        };
      case 'professional':
        return {
          headerBg: 'bg-gray-800',
          headerText: 'text-white',
          accentColor: 'text-indigo-600',
          borderColor: 'border-indigo-500',
          sectionBg: 'bg-indigo-50'
        };
      case 'minimal':
        return {
          headerBg: 'bg-white',
          headerText: 'text-gray-900',
          accentColor: 'text-gray-700',
          borderColor: 'border-gray-300',
          sectionBg: 'bg-gray-50'
        };
      case 'ats-friendly':
      default:
        return {
          headerBg: 'bg-white',
          headerText: 'text-gray-900',
          accentColor: 'text-gray-800',
          borderColor: 'border-gray-400',
          sectionBg: 'bg-white'
        };
    }
  };

  const styles = getTemplateStyles();

  // Render section content
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        return cvData.personalInfo.summary ? (
          <div>
            <h2 className={`text-xl font-bold ${styles.accentColor} mb-3 uppercase border-b-2 ${styles.borderColor} pb-2`}>
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {cvData.personalInfo.summary}
            </p>
          </div>
        ) : null;

      case 'experience':
        return cvData.experiences.length > 0 ? (
          <div>
            <h2 className={`text-xl font-bold ${styles.accentColor} mb-4 uppercase border-b-2 ${styles.borderColor} pb-2`}>
              Work Experience
            </h2>
            <div className="space-y-6">
              {cvData.experiences.map(exp => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 break-words">{exp.position}</h3>
                      <p className="text-gray-700 break-words">{exp.company}</p>
                      {exp.location && (
                        <p className="text-sm text-gray-600 break-words">{exp.location}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-600 shrink-0">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 mb-2 break-words">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {exp.achievements.filter(a => a).map((achievement, i) => (
                        <li key={i} className="break-words leading-relaxed">{achievement}</li>
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
            <h2 className={`text-xl font-bold ${styles.accentColor} mb-4 uppercase border-b-2 ${styles.borderColor} pb-2`}>
              Education
            </h2>
            <div className="space-y-4">
              {cvData.education.map(edu => (
                <div key={edu.id} className="break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 break-words">
                        {edu.school}
                      </h3>
                      <p className="text-gray-700 break-words">
                        {edu.degree}{edu.field && ` in ${edu.field}`}
                      </p>
                      {edu.location && (
                        <p className="text-sm text-gray-600 break-words">{edu.location}</p>
                      )}
                    </div>
                    {(edu.startDate || edu.endDate) && (
                      <span className="text-sm text-gray-600 shrink-0">
                        {edu.startDate} {edu.endDate && `- ${edu.endDate}`}
                      </span>
                    )}
                  </div>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                  )}
                  {edu.achievements && edu.achievements.length > 0 && edu.achievements.filter(a => a && a.trim()).length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">Relevant Coursework:</p>
                      <p className="text-sm text-gray-700">
                        {edu.achievements.filter(a => a && a.trim()).join('; ')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'skills':
        return cvData.skills.length > 0 ? (
          <div>
            <h2 className={`text-xl font-bold ${styles.accentColor} mb-4 uppercase border-b-2 ${styles.borderColor} pb-2`}>
              Skills
            </h2>
            <div className="space-y-3">
              {Object.entries(
                cvData.skills
                  // Filter out invalid skills (too long text, likely parsing errors)
                  .filter(skill => {
                    const isValidSkill = skill.name && 
                                       skill.name.length < 50 && // Skill names shouldn't be super long
                                       skill.category && 
                                       skill.category.length < 30; // Category names shouldn't be super long
                    return isValidSkill;
                  })
                  .reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = [];
                    acc[skill.category].push(skill.name);
                    return acc;
                  }, {} as Record<string, string[]>)
              ).map(([category, skills]) => (
                <div key={category} className="break-inside-avoid">
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
            <h2 className={`text-xl font-bold ${styles.accentColor} mb-4 uppercase border-b-2 ${styles.borderColor} pb-2`}>
              Projects
            </h2>
            <div className="space-y-6">
              {cvData.projects
                .filter(project => {
                  // Filter out invalid projects (generic names, missing data)
                  const isValidProject = project.name && 
                                        project.name !== 'PROJECTS' &&
                                        project.name !== 'Projects' &&
                                        project.name.length > 0 &&
                                        project.name.length < 100;
                  return isValidProject;
                })
                .map(project => (
                <div key={project.id} className="break-inside-avoid">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 break-words">{project.name}</h3>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className={`text-sm ${styles.accentColor} hover:underline break-all`}>
                          {project.link}
                        </a>
                      )}
                    </div>
                    {(project.startDate || project.endDate) && (
                      <span className="text-sm text-gray-600 whitespace-nowrap ml-4 shrink-0">
                        {project.startDate} {project.endDate && `- ${project.endDate}`}
                      </span>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-gray-700 mb-2 break-words leading-relaxed">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className={`text-xs px-2 py-1 ${styles.sectionBg} ${styles.accentColor} rounded`}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.achievements && project.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
                      {project.achievements.filter(a => a).map((achievement, i) => (
                        <li key={i} className="break-words leading-relaxed">{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'certifications':
        return cvData.certifications.length > 0 ? (
          <div>
            <h2 className={`text-xl font-bold ${styles.accentColor} mb-4 uppercase border-b-2 ${styles.borderColor} pb-2`}>
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
            <h2 className={`text-xl font-bold ${styles.accentColor} mb-4 uppercase border-b-2 ${styles.borderColor} pb-2`}>
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

      case 'awards':
        return cvData.awards && cvData.awards.length > 0 ? (
          <div>
            <h2 className={`text-xl font-bold ${styles.accentColor} mb-4 uppercase border-b-2 ${styles.borderColor} pb-2`}>
              Awards & Honors
            </h2>
            <div className="space-y-4">
              {cvData.awards.map(award => (
                <div key={award.id} className="break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 break-words">{award.title}</h3>
                      <p className="text-gray-700 break-words">{award.issuer}</p>
                    </div>
                    <span className="text-sm text-gray-600 shrink-0">
                      {award.date}
                    </span>
                  </div>
                  {award.description && (
                    <p className="text-gray-700 leading-relaxed break-words">{award.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl mx-auto" style={{ maxWidth: '210mm', minHeight: '297mm' }}>
      {/* Header - Different style per template */}
      <div className={`${styles.headerBg} ${template === 'creative' ? 'p-8' : 'p-6'} ${
        template === 'minimal' || template === 'ats-friendly' ? 'border-b-2 border-gray-300' : ''
      }`}>
        <div className={`${template === 'minimal' ? 'text-center' : 'flex items-center gap-6'}`}>
          {/* Profile Image */}
          {cvData.personalInfo.profileImage && (
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                <Image
                  src={cvData.personalInfo.profileImage}
                  alt={cvData.personalInfo.fullName || 'Profile'}
                  fill
                  className="object-cover"
                  unoptimized={cvData.personalInfo.profileImage.startsWith('data:')}
                />
              </div>
            </div>
          )}
          
          {/* Text Content */}
          <div className="flex-1">
            <h1 className={`text-4xl font-bold ${styles.headerText} mb-2`}>
              {cvData.personalInfo.fullName || 'Your Name'}
            </h1>
            <p className={`text-xl ${styles.headerText} ${template === 'modern' || template === 'creative' || template === 'professional' ? 'opacity-90' : 'text-gray-600'} mb-3`}>
              {cvData.personalInfo.title || 'Job Title'}
            </p>
            <div className={`flex items-center ${template === 'minimal' && !cvData.personalInfo.profileImage ? 'justify-center' : ''} gap-4 text-sm ${
              template === 'modern' || template === 'creative' || template === 'professional' ? `${styles.headerText} opacity-80` : 'text-gray-600'
            } flex-wrap`}>
              <span>{cvData.personalInfo.email}</span>
              <span>•</span>
              <span>{cvData.personalInfo.phone}</span>
              {cvData.personalInfo.location && (
                <>
                  <span>•</span>
                  <span>{cvData.personalInfo.location}</span>
                </>
              )}
              {cvData.personalInfo.linkedin && (
                <>
                  <span>•</span>
                  <a href={cvData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    LinkedIn
                  </a>
                </>
              )}
              {cvData.personalInfo.github && (
                <>
                  <span>•</span>
                  <a href={cvData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    GitHub
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body - Sections */}
      <div className="p-8 space-y-8">
        {sectionOrder.map((section) => {
          if (!section.visible) return null;
          return (
            <div key={section.id}>
              {renderSection(section.id)}
            </div>
          );
        })}
      </div>

      {/* Template indicator (for testing) */}
      <div className="px-8 pb-4 text-xs text-gray-400 text-right">
        Template: {template}
      </div>
    </div>
  );
}
