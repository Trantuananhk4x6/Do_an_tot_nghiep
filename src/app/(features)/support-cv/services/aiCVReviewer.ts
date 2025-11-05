// AI CV Reviewer Service - Analyze and provide feedback on CV

import { GoogleGenerativeAI } from '@google/generative-ai';
import { CVData } from '@/app/(features)/support-cv/types/cv.types';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface CVReview {
  overallScore: number;
  atsScore: number;
  impactScore: number;
  clarityScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export async function reviewCVWithAI(cvData: CVData): Promise<CVReview> {
  try {
    console.log('[AI CV Reviewer] Starting review...');

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.4,
      }
    });

    const prompt = `You are an expert CV/Resume reviewer and career coach. Analyze this CV and provide detailed feedback.

**CV DATA:**
${JSON.stringify(cvData, null, 2)}

**YOUR TASK:**
Analyze the CV and provide a comprehensive review in this JSON format:

{
  "overallScore": 85,
  "atsScore": 90,
  "impactScore": 80,
  "clarityScore": 85,
  "strengths": [
    "Clear and well-structured layout",
    "Strong technical skills section",
    "Quantifiable achievements in experience",
    "Professional summary is concise and impactful",
    "Good use of action verbs"
  ],
  "weaknesses": [
    "Some achievements lack quantifiable metrics",
    "Missing LinkedIn profile",
    "Education section could include GPA or honors",
    "No certifications listed",
    "Some descriptions are too generic"
  ],
  "suggestions": [
    "Add metrics to all achievements (e.g., 'Improved performance by 23%' instead of 'Improved performance')",
    "Include LinkedIn and GitHub profiles for better professional presence",
    "Add 2-3 relevant certifications to boost credibility",
    "Use STAR method for all experience descriptions: Situation, Task, Action, Result",
    "Replace generic phrases like 'Responsible for' with strong action verbs like 'Led', 'Developed', 'Implemented'",
    "Add a projects section showcasing personal/professional projects with technologies used",
    "Include language proficiency if applicable (especially for international roles)",
    "Optimize keywords for ATS systems based on target job descriptions"
  ]
}

**SCORING CRITERIA:**

1. **ATS Score (0-100):**
   - Clear section headings (+10)
   - Standard fonts and formatting (+10)
   - Keywords relevant to job role (+20)
   - No images/graphics/tables (+10)
   - Proper contact information (+10)
   - Relevant skills section (+20)
   - Chronological format (+10)
   - File format compatibility (+10)

2. **Impact Score (0-100):**
   - Quantifiable achievements (+25)
   - Action verbs used (+15)
   - STAR method applied (+20)
   - Specific results mentioned (+20)
   - Business impact shown (+20)

3. **Clarity Score (0-100):**
   - Easy to read layout (+20)
   - Consistent formatting (+15)
   - Clear sections (+15)
   - No spelling/grammar errors (+20)
   - Appropriate length (+15)
   - Professional tone (+15)

**IMPORTANT RULES:**
- Be specific and actionable in suggestions
- Identify 3-5 clear strengths
- Identify 3-5 areas for improvement
- Provide 5-8 concrete suggestions
- Score honestly based on criteria above
- Overall score = (ATS + Impact + Clarity) / 3

Return ONLY valid JSON, no markdown, no explanation.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Clean markdown if present
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const review: CVReview = JSON.parse(jsonText);
    console.log('[AI CV Reviewer] ✓ Review completed successfully');
    console.log(`[AI CV Reviewer] Overall Score: ${review.overallScore}/100`);

    return review;

  } catch (error: any) {
    console.error('[AI CV Reviewer] Error:', error);

    // Return default review on error
    if (error?.message?.includes('429') ||
        error?.message?.includes('Resource exhausted') ||
        error?.status === 429) {
      console.warn('[AI CV Reviewer] API rate limited, returning basic review');
      return getBasicReview(cvData);
    }

    throw new Error('Failed to review CV with AI. Please try again.');
  }
}

// Basic review as fallback
function getBasicReview(cvData: CVData): CVReview {
  const hasExperience = cvData.experiences && cvData.experiences.length > 0;
  const hasEducation = cvData.education && cvData.education.length > 0;
  const hasSkills = cvData.skills && cvData.skills.length >= 5;
  const hasProjects = cvData.projects && cvData.projects.length > 0;
  const hasSummary = cvData.personalInfo.summary && cvData.personalInfo.summary.length > 50;

  let atsScore = 50;
  if (hasExperience) atsScore += 15;
  if (hasEducation) atsScore += 10;
  if (hasSkills) atsScore += 15;
  if (cvData.personalInfo.email) atsScore += 10;

  let impactScore = 40;
  if (hasExperience && cvData.experiences.some(exp => exp.achievements?.length > 0)) {
    impactScore += 30;
  }
  if (hasSummary) impactScore += 15;
  if (hasProjects) impactScore += 15;

  let clarityScore = 60;
  if (hasSummary) clarityScore += 15;
  if (hasSkills) clarityScore += 15;
  if (cvData.personalInfo.phone && cvData.personalInfo.email) clarityScore += 10;

  return {
    overallScore: Math.round((atsScore + impactScore + clarityScore) / 3),
    atsScore,
    impactScore,
    clarityScore,
    strengths: [
      hasExperience ? 'Has work experience listed' : 'Personal information is complete',
      hasSkills ? 'Skills section is well-populated' : 'Contact information provided',
      hasEducation ? 'Education background included' : 'Basic structure is clear'
    ],
    weaknesses: [
      !hasSummary ? 'Missing professional summary' : 'Some achievements could be more quantified',
      !hasProjects ? 'No projects section' : 'Could add more detailed metrics',
      !cvData.certifications?.length ? 'No certifications listed' : 'LinkedIn profile not provided',
      'Could improve ATS compatibility',
      'Action verbs could be stronger'
    ],
    suggestions: [
      'Add quantifiable metrics to all achievements (e.g., percentages, numbers, time saved)',
      'Use strong action verbs: Led, Developed, Implemented, Achieved, Optimized',
      'Apply STAR method: Situation, Task, Action, Result for each experience',
      'Add a projects section showcasing your work',
      'Include relevant certifications to boost credibility',
      'Optimize keywords for ATS (Applicant Tracking Systems)',
      'Add LinkedIn and GitHub profiles if available'
    ]
  };
}
