// AI Auto-Edit Service - Apply AI recommendations to CV data

import { GoogleGenerativeAI } from '@google/generative-ai';
import { CVData } from '@/app/(features)/support-cv/types/cv.types';
import { CVReview } from './aiCVReviewer';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface CVEditChange {
  id: string;
  section: string; // 'Experience', 'Skills', 'Summary', etc.
  field: string; // 'achievements[0]', 'summary', 'description'
  itemLabel: string; // Human-readable label like "Software Engineer at Google"
  before: string;
  after: string;
  reason: string;
  accepted: boolean;
}

export interface AutoEditResult {
  editedCV: CVData;
  changes: CVEditChange[];
}

export async function autoEditCVWithAI(
  cvData: CVData,
  review: CVReview
): Promise<AutoEditResult> {
  try {
    console.log('[AI Auto-Edit] Starting auto-edit based on review...');

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.3,
      }
    });

    const prompt = `You are an expert CV editor. Based on the review feedback, improve this CV by applying the suggestions.

**CURRENT CV:**
${JSON.stringify(cvData, null, 2)}

**REVIEW FEEDBACK:**
Weaknesses: ${review.weaknesses.join(', ')}
Suggestions: ${review.suggestions.join(', ')}

**YOUR TASK:**
1. Apply STAR method to experience descriptions
2. Add quantifiable metrics where missing
3. Improve action verbs
4. Enhance ATS compatibility
5. Fix any weaknesses mentioned in the review

Return a JSON object with two parts:

{
  "editedCV": {
    // Full CV structure with ALL improvements applied
    // Keep the same structure as input CV
    // Only modify what needs improvement
  },
  "changes": [
    {
      "id": "change_1",
      "section": "Experience",
      "field": "achievements[0]",
      "itemLabel": "Software Engineer at Google (2020-2023)",
      "before": "Developed features for the product",
      "after": "Led development of 5 core features that increased user engagement by 34% and reduced load time by 500ms, impacting 2M+ daily active users",
      "reason": "Applied STAR method and added quantifiable metrics to demonstrate impact",
      "accepted": true
    },
    {
      "id": "change_2",
      "section": "Summary",
      "field": "summary",
      "itemLabel": "Professional Summary",
      "before": "I am a software engineer with experience in web development",
      "after": "Results-driven Software Engineer with 5+ years of experience building scalable web applications. Proven track record of delivering high-impact features that improve user engagement by 30%+ and system performance by 40%",
      "reason": "Strengthened summary with action verbs, specific experience duration, and quantifiable achievements",
      "accepted": true
    }
  ]
}

**IMPORTANT RULES:**
- Generate unique IDs for each change (change_1, change_2, etc.)
- Keep all original data that doesn't need improvement
- Only create changes for actual improvements, not for unchanged content
- Be specific in "reason" field - explain WHY this is better
- Use strong action verbs: Led, Developed, Architected, Implemented, Achieved, Optimized
- Add metrics: percentages, numbers, time saved, revenue increased, users impacted
- Apply STAR method: Situation → Task → Action → Result
- For itemLabel, use descriptive text like "Job Title at Company (dates)" or "Section Name"

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

    const autoEditResult: AutoEditResult = JSON.parse(jsonText);
    
    console.log('[AI Auto-Edit] ✓ Generated', autoEditResult.changes.length, 'improvements');

    return autoEditResult;

  } catch (error: any) {
    console.error('[AI Auto-Edit] Error:', error);

    // Return minimal changes on error
    if (error?.message?.includes('429') ||
        error?.message?.includes('Resource exhausted') ||
        error?.status === 429) {
      console.warn('[AI Auto-Edit] API rate limited, returning basic improvements');
      return getBasicImprovements(cvData, review);
    }

    throw new Error('Failed to auto-edit CV. Please try manual edit instead.');
  }
}

// Basic improvements as fallback
function getBasicImprovements(cvData: CVData, review: CVReview): AutoEditResult {
  const changes: CVEditChange[] = [];
  const editedCV = JSON.parse(JSON.stringify(cvData)); // Deep clone

  // Improve summary if exists
  if (cvData.personalInfo.summary && cvData.personalInfo.summary.length > 0) {
    const originalSummary = cvData.personalInfo.summary;
    const improvedSummary = improveSummary(originalSummary);
    
    if (improvedSummary !== originalSummary) {
      editedCV.personalInfo.summary = improvedSummary;
      changes.push({
        id: 'change_summary',
        section: 'Summary',
        field: 'summary',
        itemLabel: 'Professional Summary',
        before: originalSummary,
        after: improvedSummary,
        reason: 'Enhanced with action verbs and more professional language',
        accepted: true
      });
    }
  }

  // Improve experience achievements
  if (cvData.experiences && cvData.experiences.length > 0) {
    cvData.experiences.forEach((exp, expIndex) => {
      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach((achievement, achIndex) => {
          if (achievement && achievement.length > 10) {
            const improved = improveAchievement(achievement);
            if (improved !== achievement) {
              editedCV.experiences[expIndex].achievements[achIndex] = improved;
              changes.push({
                id: `change_exp_${expIndex}_ach_${achIndex}`,
                section: 'Experience',
                field: `achievements[${achIndex}]`,
                itemLabel: `${exp.position} at ${exp.company}`,
                before: achievement,
                after: improved,
                reason: 'Added action verb and made more specific',
                accepted: true
              });
            }
          }
        });
      }
    });
  }

  return { editedCV, changes };
}

function improveSummary(summary: string): string {
  // Basic improvements without AI
  let improved = summary;
  
  // Remove weak starts
  improved = improved.replace(/^I am /, '');
  improved = improved.replace(/^I'm /, '');
  
  // Capitalize first letter
  improved = improved.charAt(0).toUpperCase() + improved.slice(1);
  
  return improved;
}

function improveAchievement(achievement: string): string {
  // Basic improvements without AI
  let improved = achievement;
  
  // Replace weak verbs
  const replacements: Record<string, string> = {
    'Worked on': 'Developed',
    'Responsible for': 'Led',
    'Helped': 'Contributed to',
    'Did': 'Implemented',
    'Made': 'Created'
  };
  
  Object.entries(replacements).forEach(([weak, strong]) => {
    improved = improved.replace(new RegExp(`^${weak}`, 'i'), strong);
  });
  
  return improved;
}

// Apply selected changes to CV
export function applySelectedChanges(
  originalCV: CVData,
  editedCV: CVData,
  changes: CVEditChange[],
  selectedIds: string[]
): CVData {
  const result = JSON.parse(JSON.stringify(originalCV)); // Start with original
  
  // Apply only selected changes
  changes.forEach(change => {
    if (selectedIds.includes(change.id)) {
      // Apply this change
      applyChange(result, change, editedCV);
    }
  });
  
  return result;
}

function applyChange(targetCV: CVData, change: CVEditChange, editedCV: CVData) {
  // Apply the change based on section and field
  if (change.section === 'Summary' && change.field === 'summary') {
    targetCV.personalInfo.summary = change.after;
  } else if (change.section === 'Experience') {
    // Parse field like "achievements[0]"
    const match = change.field.match(/achievements\[(\d+)\]/);
    if (match) {
      const achIndex = parseInt(match[1]);
      // Find the experience by itemLabel
      const exp = targetCV.experiences.find(e => 
        change.itemLabel.includes(e.position) && change.itemLabel.includes(e.company)
      );
      if (exp && exp.achievements && exp.achievements[achIndex] !== undefined) {
        exp.achievements[achIndex] = change.after;
      }
    }
  }
  // Add more sections as needed
}
