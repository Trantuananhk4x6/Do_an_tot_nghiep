// Types for Support CV Feature

export type CVTemplate = 
  // Basic & Professional
  | 'ats-friendly' 
  | 'minimal' 
  | 'modern' 
  | 'professional'
  | 'creative'
  | 'elegant'
  | 'compact'
  
  // Tech & Modern
  | 'tech-modern'
  | 'developer-pro'
  | 'startup-vibes'
  | 'silicon-valley'
  
  // Creative & Design
  | 'creative-bold'
  | 'designer-portfolio'
  | 'artistic-flair'
  | 'photography-pro'
  
  // Business & Executive
  | 'executive-premium'
  | 'corporate-elite'
  | 'consulting-pro'
  | 'finance-master'
  
  // Two-Column Layouts
  | 'two-column'
  | 'sidebar-accent'
  | 'split-modern'
  | 'dual-tone'
  
  // Timeline & Visual
  | 'timeline'
  | 'journey-map'
  | 'milestone-story'
  | 'career-path'
  
  // Infographic & Data
  | 'infographic'
  | 'data-driven'
  | 'visual-impact'
  | 'chart-master'
  
  // Academic & Research
  | 'academic'
  | 'research-scholar'
  | 'publication-focus'
  | 'phd-candidate'
  
  // Industry Specific
  | 'healthcare-pro'
  | 'education-specialist'
  | 'marketing-guru'
  | 'sales-champion'
  | 'legal-professional'
  | 'hospitality-pro'
  
  // Color Themes
  | 'ocean-blue'
  | 'forest-green'
  | 'sunset-orange'
  | 'royal-purple'
  | 'rose-gold'
  | 'midnight-black'
  | 'emerald-luxury';

export type ExportFormat = 'pdf' | 'docx';

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
  profileImage?: string; // Base64 or URL
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  // STAR model suggestions
  situation?: string;
  task?: string;
  action?: string;
  result?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
  achievements?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  link?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'professional' | 'native';
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  authors?: string[];
  link?: string;
  description?: string;
}

export interface Volunteer {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  location?: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email?: string;
  phone?: string;
  relationship?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  awards?: Award[];
  publications?: Publication[];
  volunteer?: Volunteer[];
  references?: Reference[];
  customSections?: CustomSection[];
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface AISuggestion {
  section: keyof CVData;
  itemId?: string;
  field: string;
  originalText: string;
  suggestedText: string;
  reason: string;
  score: number; // 0-100, higher is better
  actionVerbs?: string[];
  metrics?: string[];
}

export interface CVBuilderState {
  // Added 'review' step to support AI review flow after upload
  // Added 'auto-edit-comparison' step to show before/after changes
  currentStep: 'template' | 'upload' | 'review' | 'auto-edit-comparison' | 'edit' | 'preview' | 'export';
  selectedTemplate: CVTemplate | null;
  cvData: CVData;
  aiSuggestions: AISuggestion[];
  isGeneratingSuggestions: boolean;
  isExporting: boolean;
}

export interface PDFExtractResult {
  success: boolean;
  extractedText: string;
  cvData?: Partial<CVData>;
  error?: string;
}

export interface AIAnalysisResult {
  cvData: Partial<CVData>;
  suggestions: AISuggestion[];
  overallScore: number;
  missingFields: string[];
}
