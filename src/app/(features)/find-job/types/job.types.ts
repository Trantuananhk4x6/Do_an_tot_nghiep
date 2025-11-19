// Job-related types and interfaces

export type JobLevel = 
  | 'intern' 
  | 'fresher' 
  | 'junior' 
  | 'middle' 
  | 'senior' 
  | 'manager' 
  | 'director';

export interface JobSearchPlatform {
  id: string;
  name: string;
  country: string;
  url: string;
  logo: string;
  description: string;
  searchUrlTemplate: string; // Template with {keyword}, {location}, {level} placeholders
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

export interface CVAnalysisForJob {
  skills: string[];
  yearsOfExperience: number;
  currentLevel: JobLevel;
  suggestedLevel: JobLevel[];
  mainField: string; // e.g., "Frontend Developer", "Backend Developer", "Data Science"
  location: string;
  summary: string;
}

export interface JobSearchCriteria {
  cvAnalysis: CVAnalysisForJob;
  selectedLevel: JobLevel;
  preferredLocation?: string;
  platforms: string[]; // Platform IDs to search
}
