import { GoogleGenerativeAI } from '@google/generative-ai';
import { CVData, CVTemplate } from '../types/cv.types';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface TemplateRecommendation {
  template: CVTemplate;
  score: number; // 0-100
  reason: string;
  pros: string[];
  cons: string[];
}

export interface AITemplateResult {
  recommendations: TemplateRecommendation[];
  topPick: CVTemplate;
  analysis: string;
}

/**
 * AI analyzes CV data and recommends the best template
 */
export async function recommendTemplate(cvData: CVData): Promise<AITemplateResult> {
  console.log('[AI Template Recommender] Starting analysis...');

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Analyze CV to determine best template
    const prompt = `You are an expert CV/Resume consultant. Analyze this CV data and recommend the BEST template from the following options:

**Available Templates:**
1. **ATS-Friendly** - Machine-readable, standard fonts, no graphics. Best for: Tech companies, large corporations, online applications, entry-level.
2. **Modern Professional** - Contemporary design with color accents, visual hierarchy. Best for: Mid-level professionals, tech industry, startups, creative roles.
3. **Clean Minimal** - Simple, elegant, timeless. Best for: All industries, senior positions, conservative fields, academic roles.
4. **Creative Bold** - Unique layout, colorful, creative elements. Best for: Designers, marketers, media professionals, creative agencies.
5. **Executive Professional** - Formal, traditional, conservative. Best for: Executive positions, finance, legal, consulting.

**CV Data to Analyze:**
- Job Title: ${cvData.personalInfo.title || 'Not specified'}
- Experience Level: ${cvData.experiences.length} positions
- Industries: ${cvData.experiences.map(e => e.company).join(', ')}
- Skills: ${cvData.skills.map(s => s.name).join(', ')}
- Projects: ${cvData.projects.length} projects
- Education: ${cvData.education.map(e => e.degree).join(', ')}

**Task:**
Analyze the candidate's profile and recommend ALL 5 templates ranked by suitability (1-5).

For EACH template, provide:
1. Score (0-100) - How well it matches this candidate
2. Reason (1 sentence) - Why this score?
3. Pros (2-3 points) - Advantages for this candidate
4. Cons (1-2 points) - Disadvantages

**Output Format (JSON):**
{
  "topPick": "template-id",
  "analysis": "Overall 2-3 sentence analysis of candidate's profile and template needs",
  "recommendations": [
    {
      "template": "ats-friendly",
      "score": 95,
      "reason": "...",
      "pros": ["...", "..."],
      "cons": ["..."]
    },
    ...all 5 templates
  ]
}

Template IDs: "ats-friendly", "modern", "minimal", "creative", "professional"

Return ONLY the JSON, no other text.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log('[AI Template Recommender] Raw response:', responseText);

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const aiResult: AITemplateResult = JSON.parse(jsonMatch[0]);

    console.log('[AI Template Recommender] Top pick:', aiResult.topPick);
    console.log('[AI Template Recommender] Recommendations:', aiResult.recommendations.length);

    return aiResult;
  } catch (error) {
    console.error('[AI Template Recommender] Error:', error);
    
    // Fallback: Simple rule-based recommendation
    return fallbackRecommendation(cvData);
  }
}

/**
 * Fallback recommendation if AI fails
 */
function fallbackRecommendation(cvData: CVData): AITemplateResult {
  console.log('[AI Template Recommender] Using fallback logic');

  const experienceLevel = cvData.experiences.length;
  const hasProjects = cvData.projects.length > 0;
  const isCreative = cvData.skills.some(s => 
    s.name.toLowerCase().includes('design') || 
    s.name.toLowerCase().includes('ui') || 
    s.name.toLowerCase().includes('creative')
  );

  let topPick: CVTemplate = 'ats-friendly';
  
  if (experienceLevel >= 5) {
    topPick = 'professional';
  } else if (isCreative) {
    topPick = 'creative';
  } else if (experienceLevel >= 2 && hasProjects) {
    topPick = 'modern';
  }

  return {
    topPick,
    analysis: 'Based on your experience level and skills, we recommend a template that highlights your strengths.',
    recommendations: [
      {
        template: 'ats-friendly',
        score: 85,
        reason: 'Safe choice that works for most applications',
        pros: ['ATS compatible', 'Universal format', 'High success rate'],
        cons: ['Less visually distinctive']
      },
      {
        template: 'modern',
        score: 75,
        reason: 'Good balance of style and professionalism',
        pros: ['Modern look', 'Eye-catching', 'Professional'],
        cons: ['May not pass all ATS']
      },
      {
        template: 'minimal',
        score: 70,
        reason: 'Clean and professional for any industry',
        pros: ['Timeless', 'Easy to read', 'Professional'],
        cons: ['May seem plain']
      },
      {
        template: 'creative',
        score: isCreative ? 80 : 50,
        reason: isCreative ? 'Great for showcasing creative skills' : 'Better for creative roles',
        pros: ['Unique', 'Memorable', 'Shows personality'],
        cons: ['Not suitable for conservative industries']
      },
      {
        template: 'professional',
        score: experienceLevel >= 5 ? 90 : 60,
        reason: 'Best for senior-level and executive positions',
        pros: ['Formal', 'Executive presence', 'Trusted'],
        cons: ['May seem too formal for some roles']
      }
    ]
  };
}
