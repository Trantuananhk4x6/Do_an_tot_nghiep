'use client';

import React, { useState, useCallback } from 'react';
import { CVTemplate, CVData } from '@/app/(features)/support-cv/types/cv.types';
import { pdfExtractor } from '@/app/(features)/support-cv/services/pdf/extractor.service';
import { cvAnalyzer } from '@/app/(features)/support-cv/services/ai/analyzer.service';
import { cvReviewer } from '@/app/(features)/support-cv/services/ai/reviewer.service';

/**
 * Smart CV Parser - Extract structured CV data from raw text
 * Handles messy PDFs with proper line break detection
 */
function parseExtractedText(text: string): CVData {
  console.log('🔍 RAW TEXT LENGTH:', text.length);
  console.log('🔍 LINE BREAKS IN RAW TEXT:', (text.match(/\n/g) || []).length);
  console.log('🔍 FIRST 200 CHARS:', JSON.stringify(text.substring(0, 200)));
  
  // FORCE line breaks before section headers to ensure proper splitting
  const textWithLineBreaks = text
    .replace(/\s+(SKILLS|WORK EXPERIENCE|EXPERIENCE|EDUCATION|PROJECTS?|AWARDS?|CERTIFICATIONS?)/gi, '\n$1')
    .replace(/\s+-\s+/g, '\n- ') // Force breaks before bullet points
    .replace(/([.!?])\s+([A-Z])/g, '$1\n$2'); // Break after sentences before capitals
  
  // Split by line breaks
  const lines = textWithLineBreaks
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);
  
  console.log('📝 Total lines after split:', lines.length);
  console.log('📝 First 10 lines:', lines.slice(0, 10));
  
  // ==================== EXTRACT PERSONAL INFO ====================
  
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/[\+]?\d{1,3}[\s\-]?\d{3,4}[\s\-]?\d{3,4}[\s\-]?\d{3,4}/);
  const linkedinMatch = text.match(/(?:linkedin\.com\/in\/|linkedin:?\s*)([a-zA-Z0-9\-]+)/i);
  const githubMatch = text.match(/(?:github\.com\/|github:?\s*)([a-zA-Z0-9\-]+)/i);
  
  // Extract name (first significant line before email)
  let fullName = 'Your Name';
  const emailIndex = lines.findIndex(l => l.includes(emailMatch?.[0] || '@@'));
  const nameCandidates = lines.slice(0, Math.max(3, emailIndex));
  
  for (const line of nameCandidates) {
    if (line.length >= 2 && line.length <= 50 && 
        !line.includes('@') && 
        !line.match(/[\d\+]{8,}/) &&
        !/skills|experience|education|resume|cv/i.test(line)) {
      fullName = line;
      break;
    }
  }
  
  // Extract title (job title keywords near name)
  let title = '';
  const titleKeywords = ['engineer', 'developer', 'designer', 'manager', 'analyst', 'architect', 'lead', 'senior'];
  for (const line of lines.slice(0, 8)) {
    if (line !== fullName && titleKeywords.some(kw => line.toLowerCase().includes(kw)) && line.length < 100) {
      title = line;
      break;
    }
  }
  
  // Extract summary (look for summary section or first paragraph)
  let summary = '';
  const summaryKeywords = ['summary', 'objective', 'profile', 'about'];
  for (let i = 0; i < Math.min(lines.length, 20); i++) {
    const lineLower = lines[i].toLowerCase();
    if (summaryKeywords.some(kw => lineLower.includes(kw)) && lines[i].length < 100) {
      const summaryLines = lines.slice(i + 1, i + 6).filter(l => l.length > 50);
      if (summaryLines.length > 0) {
        summary = summaryLines.join(' ').substring(0, 500);
        break;
      }
    }
  }
  
  // ==================== EXTRACT SKILLS ====================
  
  const skills: CVData['skills'] = [];
  const skillsIndex = lines.findIndex(l => /^skills/i.test(l.trim()) && l.length < 50);
  
  if (skillsIndex >= 0) {
    const nextSection = lines.findIndex((l, idx) => 
      idx > skillsIndex && /^(projects?|certifications?|languages?)/i.test(l.trim())
    );
    const skillsEnd = nextSection > 0 ? nextSection : Math.min(skillsIndex + 15, lines.length);
    const skillsText = lines.slice(skillsIndex + 1, skillsEnd).join(' ');
    
    const skillTokens = skillsText.split(/[,;•\-\n]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 50);
    
    const categories = {
      'Languages': ['java', 'python', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'go'],
      'Frameworks': ['react', 'angular', 'vue', 'spring', 'django', 'flask', 'express', 'next.js'],
      'Databases': ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle'],
      'Tools': ['git', 'docker', 'kubernetes', 'jenkins', 'aws', 'azure', 'gcp']
    };
    
    let skillId = 0;
    for (const token of skillTokens) {
      const tokenLower = token.toLowerCase();
      let category = 'Other';
      
      for (const [cat, keywords] of Object.entries(categories)) {
        if (keywords.some(kw => tokenLower.includes(kw))) {
          category = cat;
          break;
        }
      }
      
      skills.push({
        id: `skill-${skillId++}`,
        name: token,
        category
      });
    }
  }
  
  // ==================== EXTRACT EXPERIENCE ====================
  
  console.log('🔍 DEBUG PARSER - Looking for EXPERIENCE section...');
  
  const experiences: CVData['experiences'] = [];
  // Match "EXPERIENCE" or "WORK EXPERIENCE" or "WORK" at start of line
  const expIndex = lines.findIndex(l => {
    const trimmed = l.trim().toLowerCase();
    return (trimmed === 'experience' || 
            trimmed === 'work experience' || 
            trimmed === 'work' ||
            trimmed.startsWith('experience') ||
            trimmed.startsWith('work experience')) && 
           l.length < 100;
  });
  
  console.log('Experience section found at index:', expIndex);
  
  if (expIndex >= 0) {
    const eduIndex = lines.findIndex((l, idx) => idx > expIndex && /^education/i.test(l.trim()));
    const expEnd = eduIndex > 0 ? eduIndex : Math.min(expIndex + 50, lines.length);
    
    let currentExp: any = null;
    let expId = 0;
    
    for (let i = expIndex + 1; i < expEnd; i++) {
      const line = lines[i];
      const lineLower = line.toLowerCase();
      
      // Stop at education section
      if (/^education/i.test(line.trim())) break;
      
      // Detect job title (capitalized, contains job keywords)
      const isJobTitle = (
        line.length > 5 && line.length < 150 &&
        /[A-Z]/.test(line[0]) &&
        /(engineer|developer|designer|manager|analyst|lead|director|specialist|architect)/i.test(line) &&
        !/(university|college|bachelor|master)/i.test(line)
      );
      
      if (isJobTitle) {
        if (currentExp) experiences.push(currentExp);
        
        currentExp = {
          id: `exp-${expId++}`,
          position: line,
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          achievements: []
        };
      }
      else if (currentExp && !currentExp.company) {
        const yearMatch = line.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
          currentExp.company = line.substring(0, line.indexOf(yearMatch[0])).trim().replace(/[•\-–|]/g, '').trim();
          const dateMatch = line.match(/((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*\d{4})\s*[-–to]\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*\d{4}|Present|Current)/i);
          if (dateMatch) {
            currentExp.startDate = dateMatch[1];
            currentExp.endDate = dateMatch[2];
            currentExp.current = /present|current/i.test(dateMatch[2]);
          }
        } else {
          currentExp.company = line.replace(/[•\-–|]/g, '').trim();
        }
      }
      else if (currentExp && line.length > 20) {
        if (/^[•\-–*]/.test(line)) {
          currentExp.achievements.push(line.replace(/^[•\-–*]\s*/, '').trim());
        } else if (!currentExp.description && line.length > 50) {
          currentExp.description = line.substring(0, 300);
        }
      }
    }
    
    if (currentExp) experiences.push(currentExp);
  }
  
  // ==================== EXTRACT EDUCATION ====================
  
  console.log('🔍 DEBUG PARSER - Looking for EDUCATION section...');
  
  const education: CVData['education'] = [];
  // Match "EDUCATION" at start of line
  const eduIndex = lines.findIndex(l => {
    const trimmed = l.trim().toLowerCase();
    return (trimmed === 'education' || trimmed.startsWith('education')) && l.length < 100;
  });
  
  console.log('Education section found at index:', eduIndex);
  
  if (eduIndex >= 0) {
    const skillsStart = lines.findIndex((l, idx) => idx > eduIndex && /^skills/i.test(l.trim()));
    const eduEnd = skillsStart > 0 ? skillsStart : Math.min(eduIndex + 20, lines.length);
    
    let currentEdu: any = null;
    let eduId = 0;
    
    for (let i = eduIndex + 1; i < eduEnd; i++) {
      const line = lines[i];
      
      if (/^skills/i.test(line.trim())) break;
      
      const isDegree = /bachelor|master|phd|b\.?s\.?|m\.?s\.?/i.test(line);
      
      if (isDegree && line.length < 150) {
        if (currentEdu) education.push(currentEdu);
        
        const degreeMatch = line.match(/(bachelor|master|phd|b\.?s\.?|m\.?s\.?)(?:\s+(?:of|in)\s+)?(.+)?/i);
        currentEdu = {
          id: `edu-${eduId++}`,
          degree: degreeMatch ? degreeMatch[1] : line,
          field: degreeMatch && degreeMatch[2] ? degreeMatch[2].trim() : '',
          school: '',
          location: '',
          startDate: '',
          endDate: '',
          gpa: '',
          achievements: []
        };
      }
      else if (currentEdu && !currentEdu.school && line.length > 3) {
        const yearMatch = line.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
          currentEdu.school = line.substring(0, line.indexOf(yearMatch[0])).trim().replace(/[•\-–|]/g, '').trim();
          currentEdu.endDate = yearMatch[0];
        } else {
          currentEdu.school = line.replace(/[•\-–|]/g, '').trim();
        }
      }
    }
    
    if (currentEdu) education.push(currentEdu);
  }
  
  // ==================== EXTRACT PROJECTS ====================
  
  console.log('🔍 DEBUG PARSER - Looking for PROJECTS section...');
  
  const projects: CVData['projects'] = [];
  // Match "PROJECTS" or "PROJECT" at start of line
  const projectIndex = lines.findIndex(l => {
    const trimmed = l.trim().toLowerCase();
    return (trimmed === 'projects' || 
            trimmed === 'project' || 
            trimmed.startsWith('projects') || 
            trimmed.startsWith('project')) && 
           l.length < 100;
  });
  
  console.log('Projects section found at index:', projectIndex);
  
  if (projectIndex >= 0) {
    const certsIndex = lines.findIndex((l, idx) => idx > projectIndex && /^certifications?/i.test(l.trim()));
    const projectEnd = certsIndex > 0 ? certsIndex : Math.min(projectIndex + 30, lines.length);
    
    let currentProject: any = null;
    let projId = 0;
    
    for (let i = projectIndex + 1; i < projectEnd; i++) {
      const line = lines[i];
      
      if (/^certifications?/i.test(line.trim())) break;
      
      const isProjectTitle = (
        line.length > 5 && line.length < 150 &&
        /[A-Z]/.test(line[0]) &&
        !/bachelor|master|phd/i.test(line)
      );
      
      if (isProjectTitle && (!currentProject || currentProject.description)) {
        if (currentProject) projects.push(currentProject);
        
        currentProject = {
          id: `project-${projId++}`,
          name: line,
          description: '',
          technologies: [],
          role: '',
          duration: '',
          achievements: []
        };
      }
      else if (currentProject && line.length > 20) {
        if (/^[•\-–*]/.test(line)) {
          currentProject.achievements.push(line.replace(/^[•\-–*]\s*/, '').trim());
        } else if (!currentProject.description) {
          currentProject.description = line.substring(0, 300);
        }
      }
    }
    
    if (currentProject) projects.push(currentProject);
  }
  
  const result = {
    personalInfo: {
      fullName,
      title: title || 'Your Professional Title',
      email: emailMatch?.[0] || '',
      phone: phoneMatch?.[0] || '',
      location: '',
      linkedin: linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : '',
      github: githubMatch ? `https://github.com/${githubMatch[1]}` : '',
      website: '',
      summary: summary || 'Add your professional summary here. Click "Auto Edit" to get AI-powered improvements.'
    },
    experiences,
    education,
    skills,
    projects,
    certifications: [],
    languages: []
  };
  
  console.log('═══════════════════════════════════════════════════');
  console.log('📋 PARSED CV DATA:');
  console.log('═══════════════════════════════════════════════════');
  console.log('Personal Info:', {
    name: result.personalInfo.fullName,
    title: result.personalInfo.title,
    email: result.personalInfo.email,
    phone: result.personalInfo.phone,
    linkedin: result.personalInfo.linkedin,
    github: result.personalInfo.github,
    summaryLength: result.personalInfo.summary?.length || 0
  });
  console.log('Experiences:', result.experiences.length, result.experiences);
  console.log('Education:', result.education.length, result.education);
  console.log('Projects:', result.projects.length, result.projects);
  console.log('Skills:', result.skills.length, result.skills.slice(0, 5));
  console.log('═══════════════════════════════════════════════════');
  
  return result;
}

interface CVUploaderProps {
  selectedTemplate: CVTemplate;
  onCVUploaded: (cvData: CVData) => void;
  onReviewReady?: (reviewData: any) => void;
  onStartFromScratch: () => void;
}

export default function CVUploader({ 
  selectedTemplate, 
  onCVUploaded, 
  onReviewReady,
  onStartFromScratch 
}: CVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processCV = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError('');
    setRetryCount(0);
    setProgress('📄 Reading PDF file...');

    try {
      // Step 1: Extract text from PDF (Local - No API)
      const extractResult = await pdfExtractor.extractText(file);
      
      if (!extractResult.success) {
        const error = (extractResult as { success: false; error: Error }).error;
        throw error || new Error('Failed to extract text from PDF');
      }

      setProgress('📝 Parsing CV structure...');
      
      const extractedData = (extractResult as { success: true; data: any }).data;
      const extractedText = extractedData.text; // PDFExtractionResult has { text, pageCount, metadata }
      
      // Step 2: AI Parse CV structure (1 API call)
      console.log('[CVUploader] Calling AI analyzer...');
      const analyzeResult = await cvAnalyzer.analyze(extractedText);
      
      let parsedCV: CVData;
      
      if (analyzeResult.success) {
        parsedCV = (analyzeResult as { success: true; data: any }).data.cvData;
        console.log('[CVUploader] ✓ AI parsing successful');
      } else {
        console.warn('[CVUploader] AI parsing failed, using fallback:', analyzeResult);
        // Fallback to basic parsing if AI fails
        parsedCV = parseExtractedText(extractedText);
      }
      
      // Pass CV data to parent immediately (for display)
      onCVUploaded(parsedCV);
      
      setProgress('✨ Analyzing CV quality (AI Review)...');
      
      // Step 3: AI Review (1 API call)
      const reviewResult = await cvReviewer.review(parsedCV);
      
      if (reviewResult.success) {
        const reviewData = (reviewResult as { success: true; data: any }).data;
        if (onReviewReady) {
          onReviewReady(reviewData);
        }
        setProgress('✅ CV uploaded and reviewed successfully!');
      } else {
        // Review failed but CV is already displayed
        console.warn('[CVUploader] Review failed:', reviewResult);
        setProgress('✅ CV uploaded (review skipped due to API limit)');
      }
      
      setIsProcessing(false);
    } catch (err: any) {
      console.error('[CVUploader] Error:', err);
      setError(err?.message || 'Failed to process CV. Please try again.');
      setIsProcessing(false);
    }
  }, [onCVUploaded, onReviewReady]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      processCV(file);
    } else {
      setError('Please upload a PDF file');
    }
  }, [processCV]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processCV(file);
    }
  }, [processCV]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        {isProcessing ? (
          <div className="space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-700 font-medium">{progress}</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Upload Your CV
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your CV (PDF) here, or click to browse
            </p>
            <label className="inline-block">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors inline-block">
                Choose File
              </span>
            </label>
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Start from Scratch Option */}
      <div className="mt-6 text-center">
        <button
          onClick={onStartFromScratch}
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Or start building from scratch →
        </button>
      </div>
    </div>
  );
}
