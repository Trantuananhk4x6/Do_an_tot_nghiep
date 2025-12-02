// Job-related types and interfaces

export type JobLevel = 
  | 'intern' 
  | 'fresher' 
  | 'junior' 
  | 'middle' 
  | 'senior' 
  | 'manager' 
  | 'director';

export type WorkPreference = 'remote' | 'hybrid' | 'onsite' | 'any';

export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise' | 'any';

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface LocationInfo {
  city: string;
  country: string;
  isDetected: boolean; // true if detected via geolocation
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface JobPreferences {
  workPreference: WorkPreference;
  salaryRange?: SalaryRange;
  companySize: CompanySize;
  willingToRelocate: boolean;
  preferredLocations: string[];
}

export interface JobSearchPlatform {
  id: string;
  name: string;
  country: string;
  url: string;
  logo: string;
  description: string;
  searchUrlTemplate: string; // Template with {keyword}, {location}, {level} placeholders
  priority?: number; // 1 = highest priority, 4 = lowest
  hasJobs?: boolean; // Whether platform has matching jobs (checked at runtime)
  jobCount?: number; // Estimated job count if available
}

export interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  level: JobLevel;
  skills: string[];
  description: string;
  url: string;
  platform: string;
  matchScore: number; // 0-100
  matchReasons: string[];
}

// Market insights for a field
export interface FieldMarketInsights {
  field: string;
  demandLevel: 'very-high' | 'high' | 'medium' | 'low';
  trendDirection: 'rising' | 'stable' | 'declining';
  averageSalary: SalaryRange;
  topCompanies: string[];
  hotSkills: string[];
  jobOpenings: string; // e.g., "1,500+ jobs"
  competitionLevel: 'low' | 'medium' | 'high';
  tips: string[];
}

// Skill match details
export interface SkillMatch {
  skill: string;
  matchType: 'exact' | 'related' | 'missing';
  importance: 'required' | 'preferred' | 'bonus';
  yourLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface CVAnalysisForJob {
  fieldMatchScore: any;
  skills: string[];
  yearsOfExperience: number;
  currentLevel: JobLevel;
  suggestedLevel: JobLevel[];
  mainField: string; // e.g., "Frontend Developer", "Backend Developer", "Data Science"
  location: string;
  summary: string;
  
  // New enhanced fields
  detectedLocation?: LocationInfo;
  skillsWithLevels?: { skill: string; level: 'beginner' | 'intermediate' | 'advanced' | 'expert' }[];
  suggestedKeywords?: string[];
  marketInsights?: FieldMarketInsights;
  salaryExpectation?: SalaryRange;
  strongPoints?: string[];
  improvementAreas?: string[];
}

export interface JobSearchCriteria {
  cvAnalysis: CVAnalysisForJob;
  selectedLevel: JobLevel;
  preferredLocation?: string;
  platforms: string[]; // Platform IDs to search
  preferences?: JobPreferences;
}
