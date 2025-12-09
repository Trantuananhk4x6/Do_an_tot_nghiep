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
  // Enhanced template styles with more distinct designs
  const getTemplateStyles = () => {
    switch (template) {
      case 'modern':
        return {
          headerBg: 'bg-gradient-to-r from-blue-600 to-cyan-500',
          headerText: 'text-white',
          accentColor: 'text-blue-600',
          borderColor: 'border-blue-500',
          sectionBg: 'bg-blue-50',
          titleStyle: 'tracking-wide',
          fontFamily: 'font-sans',
          layout: 'modern'
        };
      case 'creative':
        return {
          headerBg: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
          headerText: 'text-white',
          accentColor: 'text-purple-600',
          borderColor: 'border-purple-500',
          sectionBg: 'bg-gradient-to-r from-purple-50 to-pink-50',
          titleStyle: 'font-bold',
          fontFamily: 'font-sans',
          layout: 'creative'
        };
      case 'professional':
        return {
          headerBg: 'bg-gradient-to-r from-gray-800 to-gray-900',
          headerText: 'text-white',
          accentColor: 'text-indigo-700',
          borderColor: 'border-indigo-600',
          sectionBg: 'bg-indigo-50',
          titleStyle: 'font-serif',
          fontFamily: 'font-serif',
          layout: 'professional'
        };
      case 'minimal':
        return {
          headerBg: 'bg-white',
          headerText: 'text-gray-900',
          accentColor: 'text-gray-700',
          borderColor: 'border-gray-400',
          sectionBg: 'bg-gray-50',
          titleStyle: 'tracking-tight',
          fontFamily: 'font-sans',
          layout: 'minimal'
        };
      case 'tech-modern':
        return {
          headerBg: 'bg-gradient-to-r from-slate-900 to-slate-800',
          headerText: 'text-white',
          accentColor: 'text-cyan-600',
          borderColor: 'border-cyan-500',
          sectionBg: 'bg-slate-50',
          titleStyle: 'font-mono',
          fontFamily: 'font-mono',
          layout: 'tech'
        };
      case 'two-column':
        return {
          headerBg: 'bg-gradient-to-r from-teal-600 to-emerald-500',
          headerText: 'text-white',
          accentColor: 'text-teal-700',
          borderColor: 'border-teal-500',
          sectionBg: 'bg-teal-50',
          titleStyle: 'font-semibold',
          fontFamily: 'font-sans',
          layout: 'two-column'
        };
      case 'timeline':
        return {
          headerBg: 'bg-gradient-to-r from-orange-500 to-red-500',
          headerText: 'text-white',
          accentColor: 'text-orange-600',
          borderColor: 'border-orange-500',
          sectionBg: 'bg-orange-50',
          titleStyle: 'font-bold',
          fontFamily: 'font-sans',
          layout: 'timeline'
        };
      case 'ats-friendly':
      default:
        return {
          headerBg: 'bg-white',
          headerText: 'text-gray-900',
          accentColor: 'text-gray-800',
          borderColor: 'border-gray-400',
          sectionBg: 'bg-white',
          titleStyle: 'font-serif',
          fontFamily: 'font-serif',
          layout: 'ats'
        };
    }
  };

  const styles = getTemplateStyles();

  // Render section title with template-specific styling
  const renderSectionTitle = (title: string) => {
    switch (styles.layout) {
      case 'creative':
        return (
          <h2 className={`text-xl font-bold ${styles.accentColor} mb-4 relative inline-block`}>
            <span className={`${styles.titleStyle}`}>{title}</span>
            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </h2>
        );
      case 'tech':
        return (
          <h2 className={`text-lg ${styles.fontFamily} font-bold ${styles.accentColor} mb-4 flex items-center gap-2`}>
            <span className="text-cyan-500">{'<'}</span>
            {title}
            <span className="text-cyan-500">{'/>'}</span>
          </h2>
        );
      case 'timeline':
        return (
          <h2 className={`text-xl font-black ${styles.accentColor} mb-4 uppercase tracking-wide flex items-center gap-3`}>
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            {title}
          </h2>
        );
      case 'minimal':
        return (
          <h2 className={`text-lg ${styles.titleStyle} ${styles.accentColor} mb-4 uppercase tracking-widest border-b border-gray-200 pb-2`}>
            {title}
          </h2>
        );
      case 'professional':
        return (
          <h2 className={`text-xl ${styles.fontFamily} font-bold ${styles.accentColor} mb-4 border-l-4 ${styles.borderColor} pl-3`}>
            {title}
          </h2>
        );
      default:
        return (
          <h2 className={`text-xl font-bold ${styles.accentColor} mb-4 uppercase border-b-2 ${styles.borderColor} pb-2`}>
            {title}
          </h2>
        );
    }
  };

  // Render section content
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        return cvData.personalInfo.summary ? (
          <div>
            {renderSectionTitle('Professional Summary')}
            <p className="text-gray-700 leading-relaxed">
              {cvData.personalInfo.summary}
            </p>
          </div>
        ) : null;

      case 'experience':
        return cvData.experiences.length > 0 ? (
          <div>
            {renderSectionTitle('Work Experience')}
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
            {renderSectionTitle('Education')}
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
            {renderSectionTitle('Skills')}
            <div className={`${styles.layout === 'tech' ? 'flex flex-wrap gap-2' : 'space-y-3'}`}>
              {styles.layout === 'tech' ? (
                // Tech template: display skills as badges
                cvData.skills
                  .filter(skill => skill.name && skill.name.length < 50)
                  .map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-800 text-cyan-400 text-sm rounded-md font-mono">
                      {skill.name}
                    </span>
                  ))
              ) : (
                // Other templates: grouped by category
                Object.entries(
                  cvData.skills
                    .filter(skill => {
                      const isValidSkill = skill.name && 
                                         skill.name.length < 50 &&
                                         skill.category && 
                                         skill.category.length < 30;
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
                ))
              )}
            </div>
          </div>
        ) : null;

      case 'projects':
        return cvData.projects.length > 0 ? (
          <div>
            {renderSectionTitle('Projects')}
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
            {renderSectionTitle('Certifications')}
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
            {renderSectionTitle('Languages')}
            <div className={`${styles.layout === 'creative' ? 'flex flex-wrap gap-3' : 'grid grid-cols-2 gap-3'}`}>
              {cvData.languages.map(lang => (
                <div key={lang.id} className={`${
                  styles.layout === 'creative' 
                    ? 'px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center gap-2' 
                    : 'flex items-center justify-between'
                }`}>
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
            {renderSectionTitle('Awards & Honors')}
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

      case 'publications':
        return cvData.publications && cvData.publications.length > 0 ? (
          <div>
            {renderSectionTitle('Publications')}
            <div className="space-y-4">
              {cvData.publications.map(pub => (
                <div key={pub.id} className="break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 break-words">{pub.title}</h3>
                      <p className="text-gray-700 break-words">{pub.publisher}</p>
                      {pub.authors && pub.authors.length > 0 && (
                        <p className="text-sm text-gray-600 break-words">Authors: {pub.authors.join(', ')}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-600 shrink-0">
                      {pub.date}
                    </span>
                  </div>
                  {pub.description && (
                    <p className="text-gray-700 leading-relaxed break-words">{pub.description}</p>
                  )}
                  {pub.link && (
                    <a href={pub.link} target="_blank" rel="noopener noreferrer" className={`text-sm ${styles.accentColor} hover:underline break-all`}>
                      {pub.link}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'volunteer':
        return cvData.volunteer && cvData.volunteer.length > 0 ? (
          <div>
            {renderSectionTitle('Volunteer Experience')}
            <div className="space-y-4">
              {cvData.volunteer.map(vol => (
                <div key={vol.id} className="break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 break-words">{vol.role}</h3>
                      <p className="text-gray-700 break-words">{vol.organization}</p>
                      {vol.location && (
                        <p className="text-sm text-gray-600 break-words">{vol.location}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-600 shrink-0">
                      {vol.startDate} - {vol.current ? 'Present' : vol.endDate || 'Present'}
                    </span>
                  </div>
                  {vol.description && (
                    <p className="text-gray-700 leading-relaxed break-words">{vol.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'references':
        return cvData.references && cvData.references.length > 0 ? (
          <div>
            {renderSectionTitle('References')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cvData.references.map(ref => (
                <div key={ref.id} className="break-inside-avoid p-3 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 break-words">{ref.name}</h3>
                  <p className="text-gray-700 break-words">{ref.title}</p>
                  <p className="text-gray-600 break-words">{ref.company}</p>
                  {ref.relationship && (
                    <p className="text-sm text-gray-500 break-words mt-1">Relationship: {ref.relationship}</p>
                  )}
                  <div className="mt-2 text-sm text-gray-600">
                    {ref.email && <p className="break-all">{ref.email}</p>}
                    {ref.phone && <p>{ref.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  // Render different header styles based on template
  const renderHeader = () => {
    const profileImage = cvData.personalInfo.profileImage && (
      <div className="flex-shrink-0">
        <div className={`relative overflow-hidden ${
          styles.layout === 'creative' ? 'w-28 h-28 rounded-2xl rotate-3' :
          styles.layout === 'tech' ? 'w-24 h-24 rounded-lg' :
          styles.layout === 'minimal' ? 'w-20 h-20 rounded-full' :
          'w-24 h-24 rounded-full'
        } border-4 ${
          styles.layout === 'minimal' ? 'border-gray-200' :
          styles.layout === 'creative' ? 'border-pink-300' :
          'border-white'
        } shadow-lg`}>
          <Image
            src={cvData.personalInfo.profileImage}
            alt={cvData.personalInfo.fullName || 'Profile'}
            fill
            className="object-cover"
            unoptimized={cvData.personalInfo.profileImage.startsWith('data:')}
          />
        </div>
      </div>
    );

    const contactInfo = (
      <div className={`flex items-center gap-3 text-sm flex-wrap ${
        styles.layout === 'minimal' ? 'justify-center text-gray-600' :
        styles.layout === 'ats' ? 'justify-start text-gray-700' :
        `${styles.headerText} opacity-80`
      }`}>
        <span>{cvData.personalInfo.email}</span>
        <span className="opacity-50">|</span>
        <span>{cvData.personalInfo.phone}</span>
        {cvData.personalInfo.location && (
          <>
            <span className="opacity-50">|</span>
            <span>{cvData.personalInfo.location}</span>
          </>
        )}
        {cvData.personalInfo.linkedin && (
          <>
            <span className="opacity-50">|</span>
            <a href={cvData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" 
              className={`hover:underline ${styles.layout === 'tech' ? 'text-cyan-300' : ''}`}>
              LinkedIn
            </a>
          </>
        )}
        {cvData.personalInfo.github && (
          <>
            <span className="opacity-50">|</span>
            <a href={cvData.personalInfo.github} target="_blank" rel="noopener noreferrer"
              className={`hover:underline ${styles.layout === 'tech' ? 'text-cyan-300' : ''}`}>
              GitHub
            </a>
          </>
        )}
      </div>
    );

    switch (styles.layout) {
      case 'creative':
        return (
          <div className={`${styles.headerBg} p-8 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative flex items-center gap-8">
              {profileImage}
              <div className="flex-1">
                <h1 className={`text-5xl ${styles.titleStyle} font-bold ${styles.headerText} mb-3`}>
                  {cvData.personalInfo.fullName || 'Your Name'}
                </h1>
                <p className={`text-2xl ${styles.headerText} opacity-90 mb-4 ${styles.titleStyle}`}>
                  {cvData.personalInfo.title || 'Job Title'}
                </p>
                {contactInfo}
              </div>
            </div>
          </div>
        );

      case 'minimal':
        return (
          <div className={`${styles.headerBg} p-8 text-center border-b-2 border-gray-200`}>
            {profileImage && <div className="flex justify-center mb-4">{profileImage}</div>}
            <h1 className={`text-3xl font-light ${styles.headerText} ${styles.titleStyle} mb-1`}>
              {cvData.personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="text-lg text-gray-500 mb-4">
              {cvData.personalInfo.title || 'Job Title'}
            </p>
            {contactInfo}
          </div>
        );

      case 'tech':
        return (
          <div className={`${styles.headerBg} p-6`}>
            <div className="flex items-center gap-6">
              {profileImage}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-cyan-400 font-mono text-sm">const</span>
                  <h1 className={`text-3xl ${styles.fontFamily} font-bold ${styles.headerText}`}>
                    {cvData.personalInfo.fullName || 'Your Name'}
                  </h1>
                  <span className="text-cyan-400 font-mono text-sm">=</span>
                </div>
                <p className={`text-lg ${styles.headerText} opacity-80 mb-3 ${styles.fontFamily}`}>
                  {'// '}{cvData.personalInfo.title || 'Job Title'}
                </p>
                {contactInfo}
              </div>
            </div>
          </div>
        );

      case 'two-column':
        return (
          <div className={`${styles.headerBg} p-6`}>
            <div className="flex items-center gap-6">
              {profileImage}
              <div className="flex-1">
                <h1 className={`text-3xl font-bold ${styles.headerText} mb-2`}>
                  {cvData.personalInfo.fullName || 'Your Name'}
                </h1>
                <p className={`text-xl ${styles.headerText} opacity-90 mb-3`}>
                  {cvData.personalInfo.title || 'Job Title'}
                </p>
                {contactInfo}
              </div>
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className={`${styles.headerBg} p-6`}>
            <div className="flex items-center gap-6">
              {profileImage}
              <div className="flex-1">
                <h1 className={`text-4xl font-black ${styles.headerText} mb-2 uppercase tracking-wider`}>
                  {cvData.personalInfo.fullName || 'Your Name'}
                </h1>
                <p className={`text-xl ${styles.headerText} opacity-90 mb-3`}>
                  {cvData.personalInfo.title || 'Job Title'}
                </p>
                {contactInfo}
              </div>
            </div>
          </div>
        );

      case 'ats':
        return (
          <div className={`${styles.headerBg} p-6 border-b-2 border-gray-400`}>
            <h1 className={`text-3xl ${styles.fontFamily} font-bold ${styles.headerText} mb-1`}>
              {cvData.personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="text-lg text-gray-600 mb-3">
              {cvData.personalInfo.title || 'Job Title'}
            </p>
            {contactInfo}
          </div>
        );

      case 'professional':
        return (
          <div className={`${styles.headerBg} p-6`}>
            <div className="flex items-center gap-6">
              {profileImage}
              <div className="flex-1">
                <h1 className={`text-4xl ${styles.fontFamily} font-bold ${styles.headerText} mb-2`}>
                  {cvData.personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="h-1 w-20 bg-indigo-500 mb-3"></div>
                <p className={`text-xl ${styles.headerText} opacity-90 mb-3`}>
                  {cvData.personalInfo.title || 'Job Title'}
                </p>
                {contactInfo}
              </div>
            </div>
          </div>
        );

      case 'modern':
      default:
        return (
          <div className={`${styles.headerBg} p-6`}>
            <div className="flex items-center gap-6">
              {profileImage}
              <div className="flex-1">
                <h1 className={`text-4xl font-bold ${styles.headerText} ${styles.titleStyle} mb-2`}>
                  {cvData.personalInfo.fullName || 'Your Name'}
                </h1>
                <p className={`text-xl ${styles.headerText} opacity-90 mb-3`}>
                  {cvData.personalInfo.title || 'Job Title'}
                </p>
                {contactInfo}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className={`bg-white mx-auto ${styles.fontFamily} cv-template-container`} 
      style={{ 
        width: '210mm', 
        minHeight: '297mm', 
        maxWidth: '210mm',
        boxSizing: 'border-box',
        pageBreakAfter: 'auto',
        pageBreakInside: 'avoid'
      }}
    >
      {/* Header - Template-specific design */}
      {renderHeader()}

      {/* Body - Sections with template-aware styling */}
      <div className={`p-8 space-y-6 ${
        styles.layout === 'creative' ? 'bg-gradient-to-b from-white to-purple-50/30' :
        styles.layout === 'tech' ? 'bg-slate-50/50' :
        ''
      }`} style={{ pageBreakInside: 'auto' }}>
        {sectionOrder.map((section) => {
          if (!section.visible) return null;
          const content = renderSection(section.id);
          if (!content) return null;
          
          return (
            <div 
              key={section.id} 
              className={`break-inside-avoid ${
                styles.layout === 'creative' ? 'p-4 rounded-xl bg-white/60 shadow-sm' :
                styles.layout === 'timeline' ? 'border-l-2 border-orange-200 pl-4' :
                ''
              }`}
              style={{ pageBreakInside: 'avoid' }}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
