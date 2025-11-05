// AI CV Analysis Service - Extract structured data and generate suggestions

import { GoogleGenerativeAI } from '@google/generative-ai';
import { CVData, AISuggestion, AIAnalysisResult, Experience } from '@/app/(features)/support-cv/types/cv.types';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Helper function to retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  baseDelay: number = 2000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on non-429 errors
      if (!error?.message?.includes('429') && 
          !error?.message?.includes('Resource exhausted') &&
          error?.status !== 429) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`[AI CV Analysis] Rate limited, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

export async function analyzeCVWithAI(extractedText: string): Promise<AIAnalysisResult> {
  try {
    console.log('[AI CV Analysis] Starting analysis...');

    // Check if API key exists
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.3,
      }
    });

    const prompt = `You are an expert CV/resume analyzer and career coach. Analyze this CV text and extract structured data.

**CV TEXT:**
${extractedText}

**TASK:**
Extract all information into this JSON structure:

{
  "personalInfo": {
    "fullName": "string",
    "title": "string (job title)",
    "email": "string",
    "phone": "string",
    "location": "string (city, country)",
    "linkedin": "string (optional)",
    "github": "string (optional)",
    "website": "string (optional)",
    "summary": "string (professional summary)"
  },
  "experiences": [
    {
      "id": "uuid",
      "company": "string",
      "position": "string",
      "location": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or Present",
      "current": boolean,
      "description": "string",
      "achievements": ["achievement 1", "achievement 2"]
    }
  ],
  "education": [
    {
      "id": "uuid",
      "school": "string",
      "degree": "string (Bachelor, Master, PhD)",
      "field": "string",
      "location": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "gpa": "string (optional)",
      "achievements": ["string"] (optional)
    }
  ],
  "skills": [
    {
      "id": "uuid",
      "category": "string (Programming, Frameworks, Tools, Soft Skills)",
      "name": "string",
      "level": "beginner|intermediate|advanced|expert"
    }
  ],
  "projects": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "technologies": ["tech1", "tech2"],
      "link": "string (optional)",
      "achievements": ["string"] (optional)
    }
  ],
  "certifications": [
    {
      "id": "uuid",
      "name": "string",
      "issuer": "string",
      "date": "YYYY-MM",
      "credentialId": "string (optional)"
    }
  ],
  "languages": [
    {
      "id": "uuid",
      "name": "string",
      "proficiency": "basic|conversational|professional|native"
    }
  ]
}

**IMPORTANT:**
- Generate unique IDs for each item
- Extract ALL information, don't skip anything
- If information is missing, use empty string or empty array
- For dates, use YYYY-MM format
- Be precise and accurate

Return ONLY valid JSON, no markdown, no explanation.`;

    // Use retry logic with exponential backoff
    const result = await retryWithBackoff(() => model.generateContent(prompt));
    const response = result.response.text();
    
    // Clean markdown code blocks if present
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const cvData = JSON.parse(jsonText);
    console.log('[AI CV Analysis] ✓ Extracted data successfully');

    // Generate suggestions for improvement
    const suggestions = await generateSTARSuggestions(cvData.experiences || []);

    return {
      cvData,
      suggestions,
      overallScore: calculateCVScore(cvData),
      missingFields: findMissingFields(cvData)
    };

  } catch (error: any) {
    console.error('[AI CV Analysis] Error:', error);
    
    // Handle specific API errors
    if (error?.message?.includes('429') || 
        error?.message?.includes('Resource exhausted') ||
        error?.status === 429) {
      
      // Return basic parsed data as fallback
      console.warn('[AI CV Analysis] API rate limited, returning basic parsed data');
      return {
        cvData: parseBasicCV(extractedText),
        suggestions: [],
        overallScore: 50,
        missingFields: ['AI-enhanced suggestions (retry later for better results)']
      };
    }
    
    if (error?.message?.includes('API key') || 
        error?.message?.includes('API_KEY')) {
      throw new Error('❌ AI service configuration error. Please contact support.');
    }
    
    if (error?.message?.includes('quota') || 
        error?.message?.includes('QUOTA_EXCEEDED')) {
      console.warn('[AI CV Analysis] API quota exceeded, returning basic parsed data');
      return {
        cvData: parseBasicCV(extractedText),
        suggestions: [],
        overallScore: 50,
        missingFields: ['AI-enhanced suggestions (try again tomorrow)']
      };
    }
    
    throw new Error('❌ Failed to analyze CV with AI. You can still fill in your information manually by clicking "Start from Blank".');
  }
}

// Basic CV parser as fallback when AI is unavailable
function parseBasicCV(text: string): Partial<CVData> {
  console.log('[AI CV Analysis] Using basic text parser as fallback');
  
  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const email = emailMatch ? emailMatch[0] : '';
  
  // Extract phone
  const phoneMatch = text.match(/[\+\(]?\d{1,4}[\)\s-]?\d{3,4}[\s-]?\d{3,4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';
  
  // Try to find name (usually at the top)
  const lines = text.split('\n').filter(line => line.trim());
  const fullName = lines[0] || '';
  
  return {
    personalInfo: {
      fullName: fullName.trim(),
      title: '',
      email: email,
      phone: phone,
      location: '',
      summary: '⚠️ AI parsing temporarily unavailable. Please fill in your information manually for best results.'
    },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: []
  };
}

async function generateSTARSuggestions(experiences: Experience[]): Promise<AISuggestion[]> {
  if (experiences.length === 0) return [];

  try {
    console.log('[AI CV Analysis] Generating STAR model suggestions...');

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.4,
      }
    });

    const prompt = `You are a professional CV coach specializing in the STAR method (Situation, Task, Action, Result).

**CURRENT EXPERIENCES:**
${JSON.stringify(experiences, null, 2)}

**TASK:**
For EACH experience/achievement, rewrite it using:
1. **Action Verbs** (Achieved, Developed, Led, Implemented, Increased, Reduced, etc.)
2. **Quantifiable Metrics** (percentages, numbers, time saved, revenue increased)
3. **STAR Model:**
   - **Situation**: What was the context?
   - **Task**: What needed to be done?
   - **Action**: What did you do?
   - **Result**: What was the measurable outcome?

Return JSON array:
[
  {
    "section": "experiences",
    "itemId": "experience id",
    "field": "description or achievements[index]",
    "originalText": "original text",
    "suggestedText": "improved text with action verbs and metrics",
    "reason": "why this is better",
    "score": 85,
    "actionVerbs": ["Developed", "Increased"],
    "metrics": ["23% accuracy improvement", "500ms faster"]
  }
]

**RULES:**
- Use strong action verbs (Achieved, Developed, Led, NOT "Worked on", "Responsible for")
- Include metrics whenever possible (%, $, time, users, etc.)
- Be specific and quantify results
- Keep it concise (1-2 sentences per point)
- Score 0-100 based on improvement impact

Return ONLY valid JSON array, no markdown.`;

    // Use retry logic with exponential backoff
    const result = await retryWithBackoff(() => model.generateContent(prompt));
    const response = result.response.text();
    
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const suggestions: AISuggestion[] = JSON.parse(jsonText);
    console.log(`[AI CV Analysis] ✓ Generated ${suggestions.length} STAR suggestions`);

    return suggestions;

  } catch (error: any) {
    console.error('[AI CV Analysis] Error generating suggestions:', error);
    
    // If API quota exceeded, just skip suggestions (not critical)
    if (error?.message?.includes('429') || error?.message?.includes('Resource exhausted')) {
      console.warn('[AI CV Analysis] ⚠️ API quota exceeded, skipping STAR suggestions');
    }
    
    return []; // Return empty array if suggestions fail (non-critical)
  }
}

function calculateCVScore(cvData: Partial<CVData>): number {
  let score = 0;
  
  // Personal info completeness (20 points)
  if (cvData.personalInfo) {
    const pi = cvData.personalInfo;
    if (pi.fullName) score += 5;
    if (pi.email) score += 5;
    if (pi.phone) score += 3;
    if (pi.summary) score += 7;
  }

  // Experience section (30 points)
  if (cvData.experiences && cvData.experiences.length > 0) {
    score += 10;
    const hasAchievements = cvData.experiences.some(exp => 
      exp.achievements && exp.achievements.length > 0
    );
    if (hasAchievements) score += 10;
    if (cvData.experiences.length >= 2) score += 10;
  }

  // Education (15 points)
  if (cvData.education && cvData.education.length > 0) {
    score += 15;
  }

  // Skills (15 points)
  if (cvData.skills && cvData.skills.length >= 5) {
    score += 15;
  }

  // Projects (10 points)
  if (cvData.projects && cvData.projects.length > 0) {
    score += 10;
  }

  // Certifications (5 points)
  if (cvData.certifications && cvData.certifications.length > 0) {
    score += 5;
  }

  // Languages (5 points)
  if (cvData.languages && cvData.languages.length > 1) {
    score += 5;
  }

  return Math.min(score, 100);
}

function findMissingFields(cvData: Partial<CVData>): string[] {
  const missing: string[] = [];

  if (!cvData.personalInfo?.summary) {
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

  if (!cvData.projects || cvData.projects.length === 0) {
    missing.push('Projects');
  }

  return missing;
}
