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

    // Check if AI is available
    if (!geminiClient.isAvailable()) {
      console.warn('[CV Analyzer] AI not available, using fallback');
      return this.fallbackAnalysis(text);
    }

    try {
      // Use rate limiter
      const result = await rateLimiter.execute(async () => {
        return await geminiClient.generateContent(this.buildPrompt(text), {
          temperature: 0.3,
        });
      });

      if (!result.success) {
        console.warn('[CV Analyzer] AI failed, using fallback');
        return this.fallbackAnalysis(text);
      }

      // Parse JSON response
      const parseResult = parseJSONResponse<CVData>(result.data.text);
      if (!parseResult.success) {
        console.error('[CV Analyzer] Failed to parse JSON');
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

  private buildPrompt(text: string): string {
    return `You are an expert CV parser. Extract ONLY the information that exists in the CV text. Do NOT make up or infer information.

**CV TEXT:**
${text.slice(0, 10000)}

**STRICT OUTPUT FORMAT (JSON only, no markdown):**
{
  "personalInfo": {
    "fullName": "string",
    "title": "string",
    "email": "string", 
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "github": "string",
    "website": "string",
    "summary": "string"
  },
  "experiences": [
    {
      "id": "exp-1",
      "company": "string",
      "position": "string",
      "location": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "description": "string (1 sentence summary)",
      "achievements": ["bullet point 1", "bullet point 2"]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "school": "string",
      "degree": "string",
      "field": "string",
      "location": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "gpa": "string",
      "achievements": ["string"]
    }
  ],
  "skills": [
    {
      "id": "skill-1",
      "category": "Languages|Frameworks|Databases|Tools|Cloud|Other",
      "name": "Java",
      "level": "intermediate"
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "name": "Project Name (NOT section header)",
      "description": "Full description",
      "technologies": ["Tech1", "Tech2"],
      "link": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "achievements": ["string"]
    }
  ],
  "certifications": [],
  "languages": [
    {
      "id": "lang-1",
      "name": "English",
      "proficiency": "professional"
    }
  ],
  "awards": [
    {
      "id": "award-1",
      "title": "Award title",
      "issuer": "Organization",
      "date": "YYYY-MM",
      "description": "What was achieved"
    }
  ]
}

**CRITICAL PARSING RULES - FOLLOW EXACTLY:**

1. **SKILLS - PARSE EACH SKILL INDIVIDUALLY:**
   ❌ WRONG: {"category": "Languages", "name": "Java, JavaScript, Python"}
   ✅ CORRECT: Create 3 separate objects
   
   ❌ WRONG: Put entire sentences or paragraphs in skills
   ✅ CORRECT: Only technology/tool names (max 3 words)
   
   Categories mapping:
   - "Languages" → Java, Python, C#, JavaScript, TypeScript, etc.
   - "Frameworks" → React, Spring Boot, Flask, NextJS, TensorFlow, etc.
   - "Databases" → MySQL, MongoDB, SQL Server, PostgreSQL, etc.
   - "Tools" → Git, Docker, Jenkins, VS Code, etc.
   - "Cloud" → AWS, Azure, GCP, etc.
   - "Other" → Only if doesn't fit above categories
   
   **NEVER include work experience text, course names, or job descriptions in skills!**

2. **PROJECTS - IDENTIFY REAL PROJECTS:**
   Look for these patterns in CV:
   - Project names (e.g., "Restaurant management", "Detection System")
   - Year/date associated with project
   - Technical descriptions with "Built", "Developed", "Created"
   
   ❌ DO NOT treat these as projects:
   - Section headers ("PROJECTS", "WORK EXPERIENCE")
   - Award titles ("Champion at X Hackathon")
   - Course names ("Learning, Requirement Analysis")
   
   ✅ Extract FULL description from CV, including:
   - What was built
   - Technologies used
   - Role/contribution
   - Team size if mentioned
   - Achievements/impact

3. **AWARDS vs PROJECTS:**
   Awards keywords: Champion, Winner, Award, Recognition, Honor, Prize, Competition
   Projects keywords: Built, Developed, Created, Implemented, System, Platform, Application
   
   Example:
   - "Champion at BizTech Hackathon" → AWARD (even if followed by project description)
   - "Restaurant management 2023" → PROJECT

4. **WORK EXPERIENCE:**
   - Extract clean company name
   - Extract exact position title
   - Description: 1 sentence overview of role
   - Achievements: Each bullet point as separate array item
   - **DO NOT mix work experience into skills or other sections**

5. **DATA QUALITY:**
   - NO duplicate entries
   - NO placeholder text
   - NO made-up information
   - If data not in CV, use empty string "" or empty array []
   - Dates: YYYY-MM format (if only year, use YYYY-01)

6. **VALIDATION:**
   - Skill names: 1-3 words maximum
   - Project names: NOT generic headers, must be actual project titles
   - Categories: Use exact names from schema
   - IDs: Sequential (skill-1, skill-2, proj-1, etc.)

**STEP-BY-STEP PROCESS:**
1. Read CV section by section
2. Identify SKILLS section → parse each technology individually
3. Identify PROJECTS section → extract each project with full details
4. Identify AWARDS section → separate from projects
5. Cross-check: Ensure no content mixing between sections

**OUTPUT:**
Return ONLY the JSON object. No markdown, no explanations, no code blocks.
`;
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
    // Basic regex-based parsing
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = text.match(/[\+\(]?\d{1,4}[\)\s-]?\d{3,4}[\s-]?\d{3,4}/);
    
    const lines = text.split('\n').filter(line => line.trim());
    const fullName = lines[0] || '';

    return {
      personalInfo: {
        fullName: fullName.trim(),
        title: '',
        email: emailMatch?.[0] || '',
        phone: phoneMatch?.[0] || '',
        location: '',
        summary: 'Please fill in your professional summary'
      },
      experiences: [],
      education: [],
      skills: [],
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

    return {
      ...cvData,
      skills: this.cleanSkills(cvData.skills),
      projects: this.cleanProjects(cvData.projects),
      awards: cvData.awards ? this.cleanAwards(cvData.awards) : []
    };
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
      
      // Check for common parsing errors (sentences in skill names)
      const hasCommonWords = /\b(and|the|with|for|using|to|in|on|at|of)\b/i.test(skill.name);
      if (hasCommonWords && skill.name.split(' ').length > 3) return false;
      
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

    // Keywords that indicate this is NOT a real project name (EXACT matches or starts with)
    const invalidExactNames = [
      'PROJECTS', 'Projects', 'PROJECT',
      'WORK EXPERIENCE', 'Work Experience',
      'EDUCATION', 'Education',
      'SKILLS', 'Skills',  // Only if it's the WHOLE name, not part of project name
      'Learning, Requirement Analysis', // This is an award
      'APIs for smooth', // Fragment
      'REST API', // Too generic
      'E-commerce', // Too generic
      'Data visualization' // Too generic
    ];

    // Action verbs that indicate a description, not a project name
    const descriptionStarters = /^(Built|Created|Developed|Designed|Implemented|Established|Launched|Produced|Engineered|Constructed|Wrote|Made)\s/i;

    return projects.filter(project => {
      // Must have name
      if (!project.name) {
        console.log(`[CV Analyzer] Filtered out project with no name`);
        return false;
      }
      
      const trimmedName = project.name.trim();
      
      // Check against invalid names (EXACT match or STARTS WITH only)
      const isInvalid = invalidExactNames.some(invalid => {
        const lowerName = trimmedName.toLowerCase();
        const lowerInvalid = invalid.toLowerCase();
        return lowerName === lowerInvalid || lowerName.startsWith(lowerInvalid + ' ');
      });
      
      if (isInvalid) {
        console.log(`[CV Analyzer] Filtered out invalid project: ${project.name}`);
        return false;
      }
      
      // Project name shouldn't be too long (but allow up to 120 chars for descriptive names)
      if (trimmedName.length > 120) {
        console.log(`[CV Analyzer] Filtered out project (too long): ${project.name}`);
        return false;
      }
      
      // Project name shouldn't start with action verbs followed by space (likely a description)
      if (descriptionStarters.test(trimmedName)) {
        console.log(`[CV Analyzer] Filtered out description as project name: ${project.name}`);
        return false;
      }
      
      return true;
    }).map((project, index) => ({
      ...project,
      id: project.id || `proj-${index + 1}`,
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      achievements: Array.isArray(project.achievements) ? project.achievements : []
    }));
  }

  /**
   * Clean awards - ensure proper format
   */
  private cleanAwards(awards: any[]): any[] {
    if (!awards || !Array.isArray(awards)) return [];

    return awards
      .filter(award => award.title && award.issuer)
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
