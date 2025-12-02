export interface Summary {
  summary: string;
  keyPoints: string[];
  wordCount: number;
  readingTime: number;
}

// Skill analysis with rating
export interface SkillAnalysis {
  name: string;
  category: 'technical' | 'soft' | 'language' | 'tool';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  rating: number; // 1-5
  yearsOfExperience?: string;
}

// Career recommendation
export interface CareerRecommendation {
  title: string;
  matchScore: number; // 0-100
  description: string;
  requiredSkills: string[];
  salaryRange?: string;
}

// Action item with priority
export interface ActionItem {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'skills' | 'experience' | 'education' | 'format' | 'content';
  impact: string;
}

// CV Completeness score
export interface CVCompleteness {
  overallScore: number; // 0-100
  sections: {
    name: string;
    score: number;
    status: 'complete' | 'partial' | 'missing';
    suggestions?: string[];
  }[];
}

// Experience highlight
export interface ExperienceHighlight {
  role: string;
  company?: string;
  duration?: string;
  achievements: string[];
  technologies: string[];
}

export interface Weakness {
  issue: string;
  suggestion: string;
}

export interface SummaryResponse {
  summary: string;
  keyPoints: string[];
  wordCount: number;
  readingTime: number;
  weaknesses?: Weakness[];
  
  // New enhanced fields
  skillsAnalysis?: SkillAnalysis[];
  careerRecommendations?: CareerRecommendation[];
  actionItems?: ActionItem[];
  cvCompleteness?: CVCompleteness;
  experienceHighlights?: ExperienceHighlight[];
  overallRating?: number; // 1-10
  professionalSummary?: string;
}

