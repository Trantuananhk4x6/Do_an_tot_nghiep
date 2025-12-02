// ============================================================================
// CV Analyzer Service - Extract structured data from CV text
// ============================================================================

import { CVData } from '../../types/cv.types';
import { Result, Ok, Err } from '../../lib/result';
import { geminiClient, parseJSONResponse } from '../ai/gemini.client';
import { rateLimiter } from '../ai/rate-limiter.service';
import { AIServiceError } from '../../lib/errors';

// ============================================================================
// Types
// ============================================================================

export interface AnalysisResult {
  cvData: CVData;
  score: number;
  missingFields: string[];
}

// ============================================================================
// Service Class
// ============================================================================

class CVAnalyzerService {
  async analyze(text: string): Promise<Result<AnalysisResult, Error>> {
    console.log('[CV Analyzer] Starting analysis...');
    console.log('[CV Analyzer] Text length:', text.length);

    // Check if AI is available
    if (!geminiClient.isAvailable()) {
      console.warn('[CV Analyzer] AI not available, using fallback');
      return this.fallbackAnalysis(text);
    }

    try {
      // Use rate limiter with cache key based on text hash
      const cacheKey = `cv-analyze-${this.hashText(text.slice(0, 500))}`;
      
      const result = await rateLimiter.execute(async () => {
        return await geminiClient.generateContent(this.buildPrompt(text), {
          temperature: 0.2, // Lower for more consistent JSON output
          maxOutputTokens: 4096,
        });
      }, cacheKey);

      if (!result.success) {
        console.warn('[CV Analyzer] AI failed, using fallback');
        return this.fallbackAnalysis(text);
      }

      console.log('[CV Analyzer] Raw AI response length:', result.data.text.length);
      console.log('[CV Analyzer] First 500 chars:', result.data.text.substring(0, 500));

      // Parse JSON response
      const parseResult = parseJSONResponse<CVData>(result.data.text);
      if (!parseResult.success) {
        console.error('[CV Analyzer] Failed to parse JSON, trying to extract manually');
        
        // Try to extract JSON from response
        const manualParse = this.tryExtractJSON(result.data.text);
        if (manualParse) {
          let cvData = this.cleanCVData(manualParse);
          const score = this.calculateScore(cvData);
          const missingFields = this.findMissingFields(cvData);
          console.log(`[CV Analyzer] ✓ Manual extraction successful. Score: ${score}/100`);
          return Ok({ cvData, score, missingFields });
        }
        
        return this.fallbackAnalysis(text);
      }

      let cvData = parseResult.data;
      
      // Post-process to clean data
      cvData = this.cleanCVData(cvData);

      const score = this.calculateScore(cvData);
      const missingFields = this.findMissingFields(cvData);

      console.log(`[CV Analyzer] ✓ Analysis complete. Score: ${score}/100`);
      return Ok({ cvData, score, missingFields });

    } catch (error: any) {
      console.error('[CV Analyzer] Error:', error);
      
      // Always fallback to basic parsing on error
      return this.fallbackAnalysis(text);
    }
  }

  /**
   * Simple hash for cache key
   */
  private hashText(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Try to manually extract JSON from malformed response
   */
  private tryExtractJSON(text: string): CVData | null {
    try {
      // Remove common issues
      let cleaned = text
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .replace(/^\s*json\s*/i, '')
        .trim();

      // Find JSON object boundaries
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }

      // Fix common JSON issues
      cleaned = cleaned
        .replace(/,\s*}/g, '}')  // Remove trailing commas
        .replace(/,\s*]/g, ']')  // Remove trailing commas in arrays
        .replace(/'/g, '"')      // Replace single quotes
        .replace(/\n/g, ' ')     // Remove newlines inside strings
        .replace(/\t/g, ' ');    // Remove tabs

      const parsed = JSON.parse(cleaned);
      console.log('[CV Analyzer] Manual JSON extraction successful');
      return parsed;
    } catch (e) {
      console.error('[CV Analyzer] Manual JSON extraction failed:', e);
      return null;
    }
  }

  private buildPrompt(text: string): string {
    // Truncate text if too long
    const maxLength = 8000;
    const truncatedText = text.length > maxLength 
      ? text.slice(0, maxLength) + '...[truncated]' 
      : text;

    return `Parse this CV/Resume into JSON. Return ONLY valid JSON, no markdown, no explanation.

CV TEXT:
${truncatedText}

REQUIRED JSON FORMAT (return exactly this structure):
{
  "personalInfo": {
    "fullName": "string",
    "title": "string or empty",
    "email": "string or empty",
    "phone": "string or empty",
    "location": "string or empty",
    "linkedin": "string or empty",
    "github": "string or empty",
    "website": "string or empty",
    "summary": "string or empty"
  },
  "experiences": [
    {
      "id": "exp-1",
      "company": "Company Name",
      "position": "Job Title",
      "location": "City",
      "startDate": "YYYY-MM or Month YYYY",
      "endDate": "YYYY-MM or Present",
      "current": false,
      "description": "Brief role description",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "school": "University Name",
      "degree": "Bachelor/Master/PhD",
      "field": "Major/Field of Study",
      "location": "City",
      "startDate": "YYYY",
      "endDate": "YYYY",
      "gpa": "if mentioned",
      "achievements": ["Coursework or honors"]
    }
  ],
  "skills": [
    {"id": "skill-1", "category": "Languages", "name": "Java", "level": "intermediate"},
    {"id": "skill-2", "category": "Frameworks", "name": "React", "level": "intermediate"}
  ],
  "projects": [
    {
      "id": "proj-1",
      "name": "Project Name",
      "description": "What the project does",
      "technologies": ["Tech1", "Tech2"],
      "link": "",
      "achievements": []
    }
  ],
  "certifications": [],
  "languages": [{"id": "lang-1", "name": "English", "proficiency": "professional"}],
  "awards": [{"id": "award-1", "title": "Award Name", "issuer": "Organization", "date": "YYYY", "description": ""}]
}

RULES:
1. Parse EACH skill separately (not comma-separated in one entry)
2. Skill categories: Languages, Frameworks, Databases, Tools, Cloud, Other
3. Use "Present" for current positions
4. If info not in CV, use empty string "" or empty array []
5. Return ONLY the JSON object, nothing else`;
  }

  private fallbackAnalysis(text: string): Result<AnalysisResult, Error> {
    console.log('[CV Analyzer] Using fallback parser');

    const cvData = this.basicParse(text);
    const score = this.calculateScore(cvData);
    const missingFields = this.findMissingFields(cvData);

    return Ok({
      cvData,
      score,
      missingFields: [
        '⚠️ Basic parsing used (AI temporarily unavailable)',
        ...missingFields
      ]
    });
  }

  private basicParse(text: string): CVData {
    console.log('[CV Analyzer] Basic parse - text length:', text.length);
    
    // Clean and normalize text
    const normalizedText = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');
    
    // Split by line breaks
    const lines = normalizedText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    console.log('[CV Analyzer] Basic parse - total lines:', lines.length);

    // Extract email and phone
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = text.match(/[\+\(]?\d{1,4}[\)\s-]?\d{3,4}[\s-]?\d{3,4}/);
    const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i);
    const githubMatch = text.match(/github\.com\/([a-zA-Z0-9-]+)/i);

    // Find name (first line that's not a section header and has proper length)
    let fullName = '';
    for (const line of lines.slice(0, 5)) {
      if (line.length >= 3 && line.length <= 50 && 
          !line.includes('@') && 
          !/^(skills|experience|education|projects|summary)/i.test(line) &&
          !/^\d{3,}/.test(line)) { // Not starting with numbers (phone)
        fullName = line;
        break;
      }
    }

    // Extract skills (look for skills section)
    const skills: CVData['skills'] = [];
    const skillsIndex = lines.findIndex(l => /^skills/i.test(l));
    if (skillsIndex >= 0) {
      const nextSectionIndex = lines.findIndex((l, i) => 
        i > skillsIndex && /^(experience|education|projects|certifications)/i.test(l)
      );
      const endIndex = nextSectionIndex > 0 ? nextSectionIndex : Math.min(skillsIndex + 10, lines.length);
      
      // Get skill lines
      const skillLines = lines.slice(skillsIndex + 1, endIndex).join(' ');
      const skillTokens = skillLines
        .split(/[,;•\-\n]/)
        .map(s => s.trim())
        .filter(s => s.length > 1 && s.length < 40);

      skillTokens.forEach((skill, i) => {
        let category = 'Other';
        const lowerSkill = skill.toLowerCase();
        
        if (/java|python|javascript|typescript|c\+\+|c#|ruby|go|php|swift|kotlin/i.test(lowerSkill)) {
          category = 'Languages';
        } else if (/react|angular|vue|spring|django|flask|express|nextjs|node/i.test(lowerSkill)) {
          category = 'Frameworks';
        } else if (/sql|mysql|postgresql|mongodb|redis|oracle|database/i.test(lowerSkill)) {
          category = 'Databases';
        } else if (/git|docker|kubernetes|jenkins|aws|azure|gcp|linux/i.test(lowerSkill)) {
          category = 'Tools';
        }

        skills.push({
          id: `skill-${i + 1}`,
          name: skill,
          category,
          level: 'intermediate'
        });
      });
    }

    // Extract experiences
    const experiences: CVData['experiences'] = [];
    const expIndex = lines.findIndex(l => /^(work\s+)?experience/i.test(l));
    if (expIndex >= 0) {
      const eduIndex = lines.findIndex((l, i) => i > expIndex && /^education/i.test(l));
      const endIndex = eduIndex > 0 ? eduIndex : Math.min(expIndex + 30, lines.length);
      
      let currentExp: any = null;
      let expId = 0;

      for (let i = expIndex + 1; i < endIndex; i++) {
        const line = lines[i];
        
        // Check if this is a job title (contains common job keywords)
        if (/(engineer|developer|manager|analyst|designer|lead|director|specialist|intern)/i.test(line) && 
            line.length < 100) {
          if (currentExp && currentExp.position) {
            experiences.push(currentExp);
          }
          currentExp = {
            id: `exp-${++expId}`,
            position: line,
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
            achievements: []
          };
        } else if (currentExp && !currentExp.company && line.length > 3) {
          // Next line after job title is usually company
          currentExp.company = line.replace(/[•\-–|]/g, '').trim();
        } else if (currentExp && /^[•\-–*]/.test(line)) {
          // Bullet point = achievement
          currentExp.achievements.push(line.replace(/^[•\-–*]\s*/, ''));
        }
      }
      
      if (currentExp && currentExp.position) {
        experiences.push(currentExp);
      }
    }

    // Extract education
    const education: CVData['education'] = [];
    const eduIndex = lines.findIndex(l => /^education/i.test(l));
    if (eduIndex >= 0) {
      const nextSection = lines.findIndex((l, i) => i > eduIndex && /^(skills|projects|certifications)/i.test(l));
      const endIndex = nextSection > 0 ? nextSection : Math.min(eduIndex + 15, lines.length);
      
      let currentEdu: any = null;
      let eduId = 0;

      for (let i = eduIndex + 1; i < endIndex; i++) {
        const line = lines[i];
        
        if (/(university|college|institute|school|bachelor|master|phd)/i.test(line) && line.length < 150) {
          if (currentEdu) education.push(currentEdu);
          
          currentEdu = {
            id: `edu-${++eduId}`,
            school: line.includes('University') || line.includes('College') ? line : '',
            degree: '',
            field: '',
            location: '',
            startDate: '',
            endDate: '',
            gpa: '',
            achievements: []
          };

          // Extract degree from line
          const degreeMatch = line.match(/(bachelor|master|phd|b\.?s\.?|m\.?s\.?|m\.?b\.?a\.?)/i);
          if (degreeMatch) {
            currentEdu.degree = degreeMatch[1];
          }
        } else if (currentEdu && !currentEdu.school && line.length > 3) {
          currentEdu.school = line;
        }
      }
      
      if (currentEdu) education.push(currentEdu);
    }

    return {
      personalInfo: {
        fullName: fullName || 'Your Name',
        title: '',
        email: emailMatch?.[0] || '',
        phone: phoneMatch?.[0] || '',
        location: '',
        linkedin: linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : '',
        github: githubMatch ? `https://github.com/${githubMatch[1]}` : '',
        website: '',
        summary: ''
      },
      experiences,
      education,
      skills,
      projects: [],
      certifications: [],
      languages: [],
      awards: []
    };
  }

  /**
   * Clean and validate CV data after AI parsing
   */
  private cleanCVData(cvData: CVData): CVData {
    console.log('[CV Analyzer] Cleaning CV data...');

    // Ensure all arrays exist
    const cleaned: CVData = {
      personalInfo: cvData.personalInfo || {
        fullName: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
      },
      experiences: Array.isArray(cvData.experiences) ? cvData.experiences : [],
      education: Array.isArray(cvData.education) ? cvData.education : [],
      skills: Array.isArray(cvData.skills) ? this.cleanSkills(cvData.skills) : [],
      projects: Array.isArray(cvData.projects) ? this.cleanProjects(cvData.projects) : [],
      certifications: Array.isArray(cvData.certifications) ? cvData.certifications : [],
      languages: Array.isArray(cvData.languages) ? cvData.languages : [],
      awards: Array.isArray(cvData.awards) ? this.cleanAwards(cvData.awards) : []
    };

    return cleaned;
  }

  /**
   * Clean skills - remove invalid entries
   */
  private cleanSkills(skills: any[]): any[] {
    if (!skills || !Array.isArray(skills)) return [];

    return skills.filter(skill => {
      // Must have name and category
      if (!skill.name || !skill.category) return false;
      
      // Skill name should be short (not a sentence)
      if (skill.name.length > 50) return false;
      
      // Category should be valid
      if (skill.category.length > 30) return false;
      
      return true;
    }).map((skill, index) => ({
      ...skill,
      id: skill.id || `skill-${index + 1}`,
      level: skill.level || 'intermediate'
    }));
  }

  /**
   * Clean projects - remove invalid entries
   */
  private cleanProjects(projects: any[]): any[] {
    if (!projects || !Array.isArray(projects)) return [];

    const invalidNames = ['PROJECTS', 'Projects', 'PROJECT', 'WORK EXPERIENCE'];

    return projects.filter(project => {
      if (!project.name) return false;
      if (invalidNames.includes(project.name.trim())) return false;
      if (project.name.length > 120) return false;
      return true;
    }).map((project, index) => ({
      ...project,
      id: project.id || `proj-${index + 1}`,
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      achievements: Array.isArray(project.achievements) ? project.achievements : []
    }));
  }

  /**
   * Clean awards
   */
  private cleanAwards(awards: any[]): any[] {
    if (!awards || !Array.isArray(awards)) return [];

    return awards
      .filter(award => award.title)
      .map((award, index) => ({
        ...award,
        id: award.id || `award-${index + 1}`
      }));
  }

  private calculateScore(cvData: CVData): number {
    let score = 0;

    // Personal info (20 points)
    if (cvData.personalInfo.fullName) score += 5;
    if (cvData.personalInfo.email) score += 5;
    if (cvData.personalInfo.phone) score += 3;
    if (cvData.personalInfo.summary && cvData.personalInfo.summary.length > 50) score += 7;

    // Experience (30 points)
    if (cvData.experiences.length > 0) {
      score += 10;
      if (cvData.experiences.some(e => e.achievements && e.achievements.length > 0)) {
        score += 10;
      }
      if (cvData.experiences.length >= 2) score += 10;
    }

    // Education (15 points)
    if (cvData.education.length > 0) score += 15;

    // Skills (15 points)
    if (cvData.skills.length >= 5) score += 15;

    // Projects (8 points)
    if (cvData.projects.length > 0) score += 8;

    // Certifications (4 points)
    if (cvData.certifications.length > 0) score += 4;

    // Awards (3 points)
    if (cvData.awards && cvData.awards.length > 0) score += 3;

    // Languages (5 points)
    if (cvData.languages.length > 1) score += 5;

    return Math.min(score, 100);
  }

  private findMissingFields(cvData: CVData): string[] {
    const missing: string[] = [];

    if (!cvData.personalInfo.summary) {
      missing.push('Professional Summary');
    }
    if (!cvData.experiences || cvData.experiences.length === 0) {
      missing.push('Work Experience');
    }
    if (!cvData.education || cvData.education.length === 0) {
      missing.push('Education');
    }
    if (!cvData.skills || cvData.skills.length < 5) {
      missing.push('Skills (at least 5)');
    }

    return missing;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const cvAnalyzer = new CVAnalyzerService();
