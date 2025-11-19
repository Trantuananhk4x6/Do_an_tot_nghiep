// ============================================================================
// CV Editor Service - AI-powered CV improvements
// ============================================================================

import { CVData } from '../../types/cv.types';
import { Result, Ok, Err } from '../../lib/result';
import { geminiClient, parseJSONResponse } from './gemini.client';
import { rateLimiter } from './rate-limiter.service';
import { AIServiceError } from '../../lib/errors';

// ============================================================================
// Types
// ============================================================================

export interface CVEditChange {
  id: string;
  type: 'add' | 'modify' | 'remove' | 'rewrite';
  section: string;
  field: string;
  itemLabel?: string; // Human-readable label like "Software Engineer at Google"
  original: string;
  suggestion: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
}

export interface EditResult {
  editedCV: CVData;
  changes: CVEditChange[];
  suggestions: any[]; // Raw AI suggestions for selective apply
  summary: {
    totalChanges: number;
    highImpact: number;
    mediumImpact: number;
    lowImpact: number;
  };
}

export interface CVReview {
  overallScore: number;
  atsScore: number;
  impactScore: number;
  clarityScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

type ProgressCallback = (progress: number, step: string) => void;

// ============================================================================
// Service Class
// ============================================================================

class CVEditorService {
  async autoEdit(
    cvData: CVData,
    review: CVReview,
    onProgress?: ProgressCallback
  ): Promise<Result<EditResult, Error>> {
    console.log('[CV Editor] Starting auto-edit...');
    
    try {
      // Check if AI is available
      if (!geminiClient.isAvailable()) {
        console.warn('[CV Editor] AI not available, using basic improvements');
        return this.basicEdit(cvData, review);
      }

      onProgress?.(10, 'Analyzing CV structure...');

      // Generate improvement suggestions
      const suggestionsResult = await this.generateSuggestions(cvData, review);
      if (!suggestionsResult.success) {
        console.warn('[CV Editor] Failed to generate suggestions, using basic');
        return this.basicEdit(cvData, review);
      }

      onProgress?.(40, 'Applying improvements...');

      // Apply suggestions to CV
      const editedCV = this.applySuggestions(cvData, suggestionsResult.data);
      
      onProgress?.(80, 'Creating change summary...');

      // Generate change list
      const changes = this.generateChangeList(cvData, editedCV, suggestionsResult.data);

      onProgress?.(100, 'Complete!');

      const summary = {
        totalChanges: changes.length,
        highImpact: changes.filter(c => c.impact === 'high').length,
        mediumImpact: changes.filter(c => c.impact === 'medium').length,
        lowImpact: changes.filter(c => c.impact === 'low').length,
      };

      console.log(`[CV Editor] ✓ Auto-edit complete. ${summary.totalChanges} changes`);
      return Ok({ 
        editedCV, 
        changes, 
        suggestions: suggestionsResult.data, // Store raw suggestions for selective apply
        summary 
      });

    } catch (error: any) {
      console.error('[CV Editor] Error:', error);
      
      // Fallback to basic edit
      return this.basicEdit(cvData, review);
    }
  }

  private async generateSuggestions(
    cvData: CVData,
    review: CVReview
  ): Promise<Result<any[], Error>> {
    try {
      const result = await rateLimiter.execute(async () => {
        return await geminiClient.generateContent(
          this.buildEditPrompt(cvData, review),
          { temperature: 0.7 }
        );
      });

      if (!result.success) {
        return Err(new AIServiceError('Failed to generate suggestions', 'AI service unavailable'));
      }

      // Parse suggestions from response
      const parseResult = parseJSONResponse<{ suggestions: any[] }>(result.data.text);
      if (!parseResult.success) {
        return Err(new AIServiceError('Failed to parse suggestions', 'Invalid response format'));
      }

      return Ok(parseResult.data.suggestions || []);

    } catch (error: any) {
      return Err(new AIServiceError(error.message || 'Unknown error', 'Editor service error'));
    }
  }

  private buildEditPrompt(cvData: CVData, review: CVReview): string {
    const hasContent = (cvData.experiences?.length || 0) > 0 || (cvData.skills?.length || 0) > 5;
    const firstExp = cvData.experiences?.[0];
    const firstEdu = cvData.education?.[0];
    const firstProject = cvData.projects?.[0];
    
    // Check what's missing
    const missingGithub = !cvData.personalInfo.github;
    const missingLinkedIn = !cvData.personalInfo.linkedin;
    const missingWebsite = !cvData.personalInfo.website;
    const hasProjects = (cvData.projects?.length || 0) > 0;
    
    return `You are an expert CV editor. Your task: Review the existing CV content and suggest ONLY realistic improvements based on what's already there.

**CV DATA:**
Name: ${cvData.personalInfo.fullName} | Title: ${cvData.personalInfo.title}
Summary: ${cvData.personalInfo.summary || '[EMPTY]'}
LinkedIn: ${cvData.personalInfo.linkedin || '[MISSING]'} | GitHub: ${cvData.personalInfo.github || '[MISSING]'} | Website: ${cvData.personalInfo.website || '[MISSING]'}
Experiences: ${cvData.experiences?.length || 0} entries
Education: ${cvData.education?.length || 0} entries
Projects: ${cvData.projects?.length || 0} entries
Skills: ${cvData.skills?.length || 0} skills

**REVIEW SCORES:** 
Overall: ${review.overallScore}/100 | ATS: ${review.atsScore}/100 | Impact: ${review.impactScore}/100

**IDENTIFIED WEAKNESSES:** 
${review.weaknesses.slice(0, 3).join('\n')}

---

**YOUR TASK:** Generate 8-15 targeted improvements as JSON array. Focus on enhancing EXISTING content.

**STRICT RULES:**
1. ✅ **Fix Grammar & Spelling** - Correct any errors in existing text
2. ✅ **Rewrite Weak Statements** - Transform vague/weak bullet points into professional CV language with action verbs
3. ✅ **Add Metrics** - If achievement lacks numbers, suggest realistic metrics (e.g., "improved performance by 30%")
4. ✅ **Optimize Length** - Shorten overly long text while keeping key details; expand overly short descriptions with common responsibilities for that role
5. ✅ **ATS Optimization** - Add relevant industry keywords naturally into existing content
6. ✅ **Missing Fields** - If LinkedIn/GitHub/Website is empty, suggest placeholder: "[Your LinkedIn URL]"
7. ❌ **DO NOT Fabricate** - NEVER invent companies, projects, or achievements not in the original CV
8. ❌ **DO NOT Add Experience Years** - Unless already stated, don't add "5+ years" or time durations
9. ❌ **DO NOT Create New Sections** - Only improve what exists
10. ✅ **Suggest Placeholders** - If CV is missing critical info (e.g., no projects for tech role), add placeholder entry like "Project Name" with note "[Add your project details]"

**RESPONSE FORMAT:**
{
  "suggestions": [
    {
      "section": "experiences|education|projects|skills|personalInfo",
      "itemId": "0",
      "itemLabel": "Backend Engineer Intern at AdsAgency Vietnam",
      "field": "achievements",
      "type": "modify",
      "original": "Participated in professional training courses",
      "improved": "Completed intensive PHP & WordPress training program, delivering 3 production features within 8 weeks",
      "reason": "Transformed vague statement into specific achievement with timeline and deliverables",
      "impact": "high"
    },
    {
      "section": "personalInfo",
      "itemId": "linkedin",
      "itemLabel": "LinkedIn Profile",
      "field": "linkedin",
      "type": "add",
      "original": "",
      "improved": "[Your LinkedIn Profile URL]",
      "reason": "LinkedIn profile is essential for professional networking - add your actual URL here",
      "impact": "medium"
    }
  ]
}

**IMPROVEMENT TYPES:**
- **modify**: Fix grammar, rewrite weak text, add metrics, optimize length
- **add**: Fill missing LinkedIn/GitHub/Website with placeholders

**EXAMPLES OF GOOD IMPROVEMENTS:**

✅ **Grammar Fix:**
Original: "Participated in professional training courses and contributed to developing Multi-Channel Sales Management System built on WordPress"
Improved: "Participated in professional training courses and contributed to developing a Multi-Channel Sales Management System built on WordPress"

✅ **Add Metrics:**
Original: "Designed and implemented key modules"
Improved: "Designed and implemented 5 key modules using PHP & jQuery, reducing data sync time by 40%"

✅ **Shorten Long Text:**
Original: "Collaborated with cross-functional teams to analyze requirements, design responsive user interfaces, and deploy new system features while ensuring optimal performance"
Improved: "Collaborated with cross-functional teams to design responsive UIs and deploy system features, ensuring 99%+ uptime"

✅ **Expand Short Text:**
Original: "Backend Engineer Intern"
Improved: "Backend Engineer Intern - Developed WordPress plugins and REST APIs for multi-channel sales platform"

✅ **Skills Detail:**
Original: "JavaScript"
Improved: "JavaScript & TypeScript (React, Node.js, Express)"

❌ **BAD - Fabricated Company:**
Original: "Backend Engineer at AdsAgency"
Improved: "Senior Software Engineer at Google" ← NEVER DO THIS

❌ **BAD - Added Years:**
Original: "Python, Flask"
Improved: "Python & Flask (5+ years)" ← NEVER add years unless in original

❌ **BAD - Invented Achievement:**
Original: "Worked on e-commerce project"
Improved: "Led 10-person team to build $5M revenue platform" ← NEVER fabricate metrics

Return ONLY valid JSON matching the format above.`;
  }

  /**
   * Apply only selected suggestions to CV
   * Used when user accepts specific changes from comparison view
   */
  applySelectedSuggestions(
    originalCV: CVData,
    allSuggestions: any[],
    selectedChangeIds: string[]
  ): CVData {
    // Filter suggestions based on selected change IDs
    // Each change ID corresponds to a suggestion
    const selectedSuggestions = allSuggestions.filter((_, index) => {
      const changeId = `change-${index}`;
      return selectedChangeIds.some(id => id.includes(String(index)));
    });

    // Apply only selected suggestions
    return this.applySuggestions(originalCV, selectedSuggestions);
  }

  private applySuggestions(cvData: CVData, suggestions: any[]): CVData {
    const edited = JSON.parse(JSON.stringify(cvData)); // Deep clone

    for (const suggestion of suggestions) {
      try {
        const section = suggestion.section;
        
        // Handle both "personalInfo" and "summary" for summary field
        if (section === 'personalInfo' || section === 'summary') {
          this.applySummarySuggestion(edited, suggestion);
        } else if (section === 'experiences') {
          this.applyExperienceSuggestion(edited, suggestion);
        } else if (section === 'education') {
          this.applyEducationSuggestion(edited, suggestion);
        } else if (section === 'projects') {
          this.applyProjectSuggestion(edited, suggestion);
        } else if (section === 'skills') {
          this.applySkillsSuggestion(edited, suggestion);
        }
      } catch (error) {
        console.warn('[CV Editor] Failed to apply suggestion:', suggestion, error);
      }
    }

    return edited;
  }

  private applyExperienceSuggestion(cvData: CVData, suggestion: any): void {
    const experience = cvData.experiences?.find(e => e.id === suggestion.itemId);
    if (!experience) return;

    if (suggestion.field === 'achievements') {
      if (suggestion.type === 'add') {
        experience.achievements = experience.achievements || [];
        experience.achievements.push(suggestion.improved);
      } else if (suggestion.type === 'modify' || suggestion.type === 'rewrite') {
        const index = experience.achievements?.indexOf(suggestion.original) ?? -1;
        if (index >= 0 && experience.achievements) {
          experience.achievements[index] = suggestion.improved;
        }
      }
    } else if (suggestion.field === 'description') {
      experience.description = suggestion.improved;
    }
  }

  private applyEducationSuggestion(cvData: CVData, suggestion: any): void {
    const education = cvData.education?.find(e => e.id === suggestion.itemId);
    if (!education) return;

    if (suggestion.field === 'achievements') {
      if (suggestion.type === 'add') {
        education.achievements = education.achievements || [];
        education.achievements.push(suggestion.improved);
      } else if (suggestion.type === 'modify' || suggestion.type === 'rewrite') {
        const index = education.achievements?.indexOf(suggestion.original) ?? -1;
        if (index >= 0 && education.achievements) {
          education.achievements[index] = suggestion.improved;
        }
      }
    }
  }

  private applyProjectSuggestion(cvData: CVData, suggestion: any): void {
    const project = cvData.projects?.find(p => p.id === suggestion.itemId);
    if (!project) return;

    if (suggestion.field === 'achievements') {
      if (suggestion.type === 'add') {
        project.achievements = project.achievements || [];
        project.achievements.push(suggestion.improved);
      } else if (suggestion.type === 'modify' || suggestion.type === 'rewrite') {
        const index = project.achievements?.indexOf(suggestion.original) ?? -1;
        if (index >= 0 && project.achievements) {
          project.achievements[index] = suggestion.improved;
        }
      }
    } else if (suggestion.field === 'description') {
      project.description = suggestion.improved;
    } else if (suggestion.field === 'technologies') {
      if (suggestion.type === 'add') {
        project.technologies = project.technologies || [];
        project.technologies.push(suggestion.improved);
      }
    }
  }

  private applySkillsSuggestion(cvData: CVData, suggestion: any): void {
    if (suggestion.type === 'add') {
      cvData.skills = cvData.skills || [];
      cvData.skills.push({
        id: `skill-${Date.now()}`,
        category: suggestion.category || 'Technical',
        name: suggestion.improved,
        level: suggestion.level || 'intermediate'
      });
    }
  }

  private applySummarySuggestion(cvData: CVData, suggestion: any): void {
    if (!cvData.personalInfo) return;
    
    const field = suggestion.field;
    
    // Handle different personalInfo fields
    if (field === 'summary') {
      cvData.personalInfo.summary = suggestion.improved;
    } else if (field === 'linkedin') {
      cvData.personalInfo.linkedin = suggestion.improved;
    } else if (field === 'github') {
      cvData.personalInfo.github = suggestion.improved;
    } else if (field === 'website') {
      cvData.personalInfo.website = suggestion.improved;
    } else if (field === 'title') {
      cvData.personalInfo.title = suggestion.improved;
    } else if (field === 'location') {
      cvData.personalInfo.location = suggestion.improved;
    } else {
      // Default to summary if field not specified
      cvData.personalInfo.summary = suggestion.improved;
    }
  }

  private generateChangeList(
    original: CVData,
    edited: CVData,
    suggestions: any[]
  ): CVEditChange[] {
    const changes: CVEditChange[] = [];

    for (const suggestion of suggestions) {
      // Use itemLabel from suggestion if available, otherwise generate it
      let itemLabel = suggestion.itemLabel || '';
      
      if (!itemLabel) {
        // Generate label based on section and field
        if (suggestion.section === 'personalInfo' || suggestion.section === 'summary') {
          if (suggestion.field === 'linkedin') {
            itemLabel = 'LinkedIn Profile';
          } else if (suggestion.field === 'github') {
            itemLabel = 'GitHub Profile';
          } else if (suggestion.field === 'website') {
            itemLabel = 'Personal Website';
          } else if (suggestion.field === 'title') {
            itemLabel = 'Professional Title';
          } else if (suggestion.field === 'location') {
            itemLabel = 'Location';
          } else {
            itemLabel = 'Professional Summary';
          }
        } else if (suggestion.section === 'experiences' && suggestion.itemId) {
          const exp = original.experiences?.find(e => e.id === suggestion.itemId);
          itemLabel = exp ? `${exp.position} at ${exp.company}` : 'Work Experience';
        } else if (suggestion.section === 'education' && suggestion.itemId) {
          const edu = original.education?.find(e => e.id === suggestion.itemId);
          itemLabel = edu ? `${edu.degree} - ${edu.school}` : 'Education';
        } else if (suggestion.section === 'projects' && suggestion.itemId) {
          const proj = original.projects?.find(p => p.id === suggestion.itemId);
          itemLabel = proj ? proj.name : 'Project';
        } else if (suggestion.section === 'skills') {
          itemLabel = 'Technical Skills';
        } else {
          itemLabel = suggestion.section;
        }
      }
      
      changes.push({
        id: `change-${Date.now()}-${Math.random()}`,
        type: suggestion.type,
        section: suggestion.section,
        field: suggestion.field,
        original: suggestion.original || '',
        suggestion: suggestion.improved || '',
        reason: suggestion.reason || 'Improved clarity and impact',
        impact: suggestion.impact || 'medium',
        itemLabel: itemLabel
      });
    }

    return changes;
  }

  private basicEdit(cvData: CVData, review: CVReview): Result<EditResult, Error> {
    console.log('[CV Editor] Using basic edit mode');

    const editedCV = JSON.parse(JSON.stringify(cvData));
    const changes: CVEditChange[] = [];

    // Basic improvements without AI
    // 1. Enhance summary if exists
    if (editedCV.personalInfo?.summary) {
      const improved = this.improveText(editedCV.personalInfo.summary);
      if (improved !== editedCV.personalInfo.summary) {
        changes.push({
          id: `change-summary-${Date.now()}`,
          type: 'modify',
          section: 'personalInfo',
          field: 'summary',
          original: editedCV.personalInfo.summary,
          suggestion: improved,
          reason: 'Replaced weak verbs with strong action verbs',
          impact: 'high'
        });
        editedCV.personalInfo.summary = improved;
      }
    } else if (editedCV.personalInfo) {
      // Add generic summary if missing
      const genericSummary = `Results-driven ${editedCV.personalInfo.title || 'professional'} with proven expertise in delivering high-impact solutions. Demonstrated ability to drive innovation and achieve measurable outcomes.`;
      changes.push({
        id: `change-summary-add-${Date.now()}`,
        type: 'add',
        section: 'personalInfo',
        field: 'summary',
        original: '',
        suggestion: genericSummary,
        reason: 'Added professional summary to strengthen CV',
        impact: 'high'
      });
      editedCV.personalInfo.summary = genericSummary;
    }

    // 2. Improve experience achievements
    if (editedCV.experiences && editedCV.experiences.length > 0) {
      editedCV.experiences.forEach((exp, expIdx) => {
        if (exp.achievements && exp.achievements.length > 0) {
          exp.achievements = exp.achievements.map((achievement, achIdx) => {
            const improved = this.improveAchievement(achievement);
            if (improved !== achievement) {
              changes.push({
                id: `change-exp-${expIdx}-ach-${achIdx}-${Date.now()}`,
                type: 'modify',
                section: 'experiences',
                field: 'achievements',
                original: achievement,
                suggestion: improved,
                reason: 'Enhanced with action verb and quantifiable metric',
                impact: 'high'
              });
            }
            return improved;
          });
        } else {
          // Add generic achievements if missing
          const genericAchievements = [
            `Led key initiatives that improved team efficiency and project outcomes`,
            `Delivered projects on time while maintaining high quality standards`,
            `Collaborated with cross-functional teams to achieve business objectives`
          ];
          
          genericAchievements.forEach((ach, idx) => {
            changes.push({
              id: `change-exp-${expIdx}-add-${idx}-${Date.now()}`,
              type: 'add',
              section: 'experiences',
              field: 'achievements',
              original: '',
              suggestion: ach,
              reason: 'Added achievement to demonstrate impact',
              impact: 'medium'
            });
          });
          
          exp.achievements = genericAchievements;
        }
        
        // Improve description
        if (exp.description) {
          const improved = this.improveText(exp.description);
          if (improved !== exp.description) {
            changes.push({
              id: `change-exp-${expIdx}-desc-${Date.now()}`,
              type: 'modify',
              section: 'experiences',
              field: 'description',
              original: exp.description,
              suggestion: improved,
              reason: 'Strengthened with action-oriented language',
              impact: 'medium'
            });
            exp.description = improved;
          }
        }
      });
    }

    // 3. Improve education achievements
    if (editedCV.education && editedCV.education.length > 0) {
      editedCV.education.forEach((edu, eduIdx) => {
        if (!edu.achievements || edu.achievements.length === 0) {
          const genericEduAchievements = [
            `Completed coursework with strong academic performance`,
            `Participated in relevant projects and research activities`
          ];
          
          genericEduAchievements.forEach((ach, idx) => {
            changes.push({
              id: `change-edu-${eduIdx}-add-${idx}-${Date.now()}`,
              type: 'add',
              section: 'education',
              field: 'achievements',
              original: '',
              suggestion: ach,
              reason: 'Added academic achievement highlight',
              impact: 'low'
            });
          });
          
          edu.achievements = genericEduAchievements;
        }
      });
    }

    // 4. Ensure key skills are present
    if (!editedCV.skills || editedCV.skills.length < 3) {
      const genericSkills = [
        { id: `skill-${Date.now()}-1`, category: 'Technical', name: 'Problem Solving', level: 'advanced' as const },
        { id: `skill-${Date.now()}-2`, category: 'Professional', name: 'Team Collaboration', level: 'advanced' as const },
        { id: `skill-${Date.now()}-3`, category: 'Communication', name: 'Presentation Skills', level: 'intermediate' as const }
      ];
      
      genericSkills.forEach(skill => {
        changes.push({
          id: `change-skill-add-${skill.id}`,
          type: 'add',
          section: 'skills',
          field: 'name',
          original: '',
          suggestion: skill.name,
          reason: 'Added important professional skill',
          impact: 'medium'
        });
      });
      
      editedCV.skills = [...(editedCV.skills || []), ...genericSkills];
    }

    const summary = {
      totalChanges: changes.length,
      highImpact: changes.filter(c => c.impact === 'high').length,
      mediumImpact: changes.filter(c => c.impact === 'medium').length,
      lowImpact: changes.filter(c => c.impact === 'low').length,
    };

    console.log(`[CV Editor] Basic edit complete: ${summary.totalChanges} changes generated`);
    return Ok({ editedCV, changes, suggestions: [], summary });
  }

  private improveText(text: string): string {
    let improved = text;

    // Replace weak verbs with strong action verbs
    const weakToStrong: Record<string, string> = {
      'responsible for': 'Led',
      'helped with': 'Contributed to',
      'helped': 'Supported',
      'worked on': 'Developed',
      'assisted in': 'Facilitated',
      'assisted with': 'Enabled',
      'did': 'Executed',
      'made': 'Created',
      'was part of': 'Collaborated on',
      'in charge of': 'Managed',
      'handled': 'Coordinated',
      'dealt with': 'Resolved'
    };

    Object.entries(weakToStrong).forEach(([weak, strong]) => {
      const regex = new RegExp(`\\b${weak}\\b`, 'gi');
      improved = improved.replace(regex, strong);
    });

    return improved;
  }

  private improveAchievement(text: string): string {
    let improved = this.improveText(text);
    
    // If no metrics, suggest adding one
    const hasMetric = /\d+%|\d+\+|increased|improved|reduced|saved|\$\d+|grew/i.test(improved);
    
    if (!hasMetric && !improved.startsWith('Led') && !improved.startsWith('Developed')) {
      // Add strong action verb at start
      const actionVerbs = ['Delivered', 'Achieved', 'Drove', 'Optimized', 'Enhanced', 'Streamlined'];
      const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
      improved = `${randomVerb} ${improved.charAt(0).toLowerCase()}${improved.slice(1)}`;
    }
    
    return improved;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const cvEditor = new CVEditorService();
