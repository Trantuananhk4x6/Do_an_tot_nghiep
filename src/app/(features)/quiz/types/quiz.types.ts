// Quiz Enhanced Types

import { QuizCategory, QuizLevel, QuizQuestion } from "@/data/quiz-questions";

// ============================================
// Quiz Session Types
// ============================================

export interface QuizSession {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  status: 'setup' | 'in-progress' | 'completed' | 'abandoned';
  language: 'vi' | 'en' | 'ja' | 'zh' | 'ko';
  config: QuizConfig;
  cvAnalysis?: EnhancedCVAnalysis;
  selectedField?: CareerField;
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  result?: EnhancedQuizResult;
}

export interface QuizConfig {
  questionCount: number;
  timeLimit?: number; // seconds, optional
  difficulty: DifficultyLevel;
  level: ExperienceLevel;
  allowSkip: boolean;
  showHints: boolean;
  adaptiveDifficulty: boolean;
}

// ============================================
// CV Analysis Types
// ============================================

export interface EnhancedCVAnalysis {
  // Basic info
  detectedSkills: SkillWithLevel[];
  primaryCategory: QuizCategory;
  secondaryCategories: QuizCategory[];
  experienceLevel: ExperienceLevel;
  confidence: number;
  
  // Enhanced fields
  suggestedFields: SuggestedField[];
  skillSummary: SkillSummary;
  careerPath: CareerPathSuggestion;
  keywords: string[];
  yearsOfExperience: number;
}

export interface SkillWithLevel {
  name: string;
  level: SkillProficiency;
  category: SkillCategory;
  relevance: number; // 0-1, how relevant to the field
}

export type SkillProficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type SkillCategory = 
  | 'language' 
  | 'framework' 
  | 'database' 
  | 'tool' 
  | 'cloud' 
  | 'methodology' 
  | 'soft-skill';

export interface SkillSummary {
  languages: SkillWithLevel[];
  frameworks: SkillWithLevel[];
  databases: SkillWithLevel[];
  tools: SkillWithLevel[];
  cloudPlatforms: SkillWithLevel[];
  softSkills: string[];
  totalSkillCount: number;
  strongestArea: string;
  areasToImprove: string[];
}

export interface SuggestedField {
  field: CareerField;
  matchScore: number; // 0-100
  reasons: string[];
  missingSkills: string[];
  hotSkillsMatched: string[];
  marketDemand: 'high' | 'medium' | 'low';
  salaryRange?: SalaryRange;
}

export interface CareerPathSuggestion {
  currentPosition: string;
  nextSteps: CareerStep[];
  longTermGoals: string[];
  skillGaps: SkillGap[];
}

export interface CareerStep {
  title: string;
  timeframe: string;
  requirements: string[];
  salaryIncrease?: number; // percentage
}

export interface SkillGap {
  skill: string;
  currentLevel: SkillProficiency;
  requiredLevel: SkillProficiency;
  priority: 'high' | 'medium' | 'low';
  learningResources: LearningResource[];
}

export interface LearningResource {
  type: 'course' | 'book' | 'video' | 'practice' | 'project' | 'certification';
  title: string;
  url?: string;
  duration?: string;
  cost?: 'free' | 'paid';
}

// ============================================
// Career Field Types
// ============================================

export interface CareerField {
  id: string;
  name: string;
  nameVi: string;
  nameJa: string;
  nameZh: string;
  nameKo: string;
  icon: string;
  description: string;
  categories: QuizCategory[];
  requiredSkills: string[];
  niceToHaveSkills: string[];
  demandLevel: 'high' | 'medium' | 'low';
  growthRate: number; // percentage
  avgSalary: SalaryRange;
  topCompanies: string[];
  trends: string[];
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'monthly' | 'yearly';
}

// ============================================
// Difficulty & Level Types
// ============================================

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'mixed' | 'adaptive';

export type ExperienceLevel = 'intern' | 'fresher' | 'junior' | 'mid' | 'senior' | 'lead' | 'expert';

export interface DifficultyConfig {
  level: DifficultyLevel;
  description: string;
  descriptionVi: string;
  questionDistribution: {
    low: number;
    mid: number;
    high: number;
  };
  timePerQuestion: number; // seconds
  passingScore: number; // percentage
}

export interface ExperienceLevelConfig {
  level: ExperienceLevel;
  yearsRange: string;
  description: string;
  descriptionVi: string;
  defaultDifficulty: DifficultyLevel;
  focusAreas: string[];
}

// ============================================
// Quiz Answer & Result Types
// ============================================

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number | null;
  isSkipped: boolean;
  timeSpent: number; // seconds
  timestamp: Date;
  confidence?: 'sure' | 'unsure' | 'guessing';
}

export interface EnhancedQuizResult {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  score: number; // percentage
  totalTime: number; // seconds
  averageTimePerQuestion: number;
  
  // Performance analysis
  performanceLevel: PerformanceLevel;
  skillAnalysis: SkillPerformanceResult[];
  difficultyAnalysis: DifficultyPerformanceResult;
  categoryAnalysis: CategoryPerformanceResult[];
  
  // Detailed feedback
  feedback: DetailedFeedback;
  studyPlan: PersonalizedStudyPlan;
  careerInsights: CareerInsight[];
  
  // Comparison
  benchmarks: QuizBenchmarks;
}

export type PerformanceLevel = 
  | 'excellent' 
  | 'very-good' 
  | 'good' 
  | 'average' 
  | 'needs-improvement' 
  | 'requires-focus';

export interface SkillPerformanceResult {
  skill: string;
  category: QuizCategory;
  questionsCount: number;
  correctCount: number;
  accuracy: number;
  averageTime: number;
  strengths: string[];
  weaknesses: string[];
  trend: 'improving' | 'stable' | 'declining';
  recommendations: string[];
}

export interface DifficultyPerformanceResult {
  easy: { total: number; correct: number; accuracy: number };
  medium: { total: number; correct: number; accuracy: number };
  hard: { total: number; correct: number; accuracy: number };
  overallPattern: string;
}

export interface CategoryPerformanceResult {
  category: QuizCategory;
  questionsCount: number;
  correctCount: number;
  accuracy: number;
  badge?: 'master' | 'proficient' | 'learning' | 'beginner';
}

// ============================================
// Feedback Types
// ============================================

export interface DetailedFeedback {
  overallMessage: string;
  strengths: FeedbackPoint[];
  weaknesses: FeedbackPoint[];
  actionItems: ActionItem[];
  motivationalMessage: string;
  nextSteps: string[];
}

export interface FeedbackPoint {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  examples?: string[];
}

export interface ActionItem {
  priority: number;
  title: string;
  description: string;
  timeEstimate: string;
  resources: LearningResource[];
  expectedOutcome: string;
}

export interface PersonalizedStudyPlan {
  duration: '1-week' | '2-weeks' | '1-month' | '3-months' | '6-months';
  dailyCommitment: number; // hours
  totalHours: number;
  phases: StudyPhase[];
  milestones: Milestone[];
  resources: LearningResource[];
}

export interface StudyPhase {
  week: number;
  title: string;
  focus: string;
  topics: string[];
  goals: string[];
  exercises: string[];
  checkpoints: string[];
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  criteria: string[];
  reward?: string;
}

export interface CareerInsight {
  type: 'strength' | 'opportunity' | 'warning' | 'suggestion';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: string;
}

export interface QuizBenchmarks {
  userScore: number;
  averageScore: number;
  topPerformerScore: number;
  percentile: number;
  levelComparison: string;
}

// ============================================
// Step Flow Types
// ============================================

export type QuizStep = 
  | 'welcome'
  | 'upload-cv'
  | 'analyzing'
  | 'field-selection'
  | 'level-selection'
  | 'difficulty-selection'
  | 'quiz-preview'
  | 'quiz-in-progress'
  | 'quiz-completed'
  | 'results';

export interface StepConfig {
  step: QuizStep;
  title: string;
  titleVi: string;
  description: string;
  descriptionVi: string;
  isOptional: boolean;
  icon: string;
}

// ============================================
// Translation Types
// ============================================

export interface QuizTranslations {
  // Steps
  steps: {
    uploadCv: string;
    analyzeResults: string;
    selectField: string;
    selectLevel: string;
    selectDifficulty: string;
    startQuiz: string;
    viewResults: string;
  };
  
  // Upload step
  upload: {
    title: string;
    subtitle: string;
    dragDrop: string;
    supportedFormats: string;
    analyzing: string;
    uploadSuccess: string;
  };
  
  // Analysis step
  analysis: {
    title: string;
    primaryField: string;
    secondarySkills: string;
    experienceLevel: string;
    detectedSkills: string;
    confidence: string;
    suggestedFields: string;
  };
  
  // Field selection
  fieldSelection: {
    title: string;
    subtitle: string;
    matchScore: string;
    demand: string;
    salary: string;
    missingSkills: string;
  };
  
  // Level selection
  levelSelection: {
    title: string;
    subtitle: string;
    fresher: string;
    junior: string;
    mid: string;
    senior: string;
    lead: string;
    expert: string;
  };
  
  // Difficulty selection
  difficultySelection: {
    title: string;
    subtitle: string;
    easy: string;
    medium: string;
    hard: string;
    mixed: string;
    adaptive: string;
    easyDesc: string;
    mediumDesc: string;
    hardDesc: string;
    mixedDesc: string;
    adaptiveDesc: string;
  };
  
  // Quiz
  quiz: {
    question: string;
    of: string;
    timeRemaining: string;
    skip: string;
    hint: string;
    submit: string;
    finish: string;
    confirmFinish: string;
  };
  
  // Results
  results: {
    title: string;
    score: string;
    correct: string;
    incorrect: string;
    skipped: string;
    time: string;
    performance: string;
    excellent: string;
    veryGood: string;
    good: string;
    average: string;
    needsImprovement: string;
    requiresFocus: string;
    detailedResults: string;
    yourAnswer: string;
    correctAnswer: string;
    explanation: string;
    studyPlan: string;
    recommendations: string;
    retakeQuiz: string;
    newQuiz: string;
  };
}

// ============================================
// Predefined Data
// ============================================

export const DIFFICULTY_CONFIGS: DifficultyConfig[] = [
  {
    level: 'easy',
    description: 'Focus on fundamental concepts and basic knowledge',
    descriptionVi: 'Tập trung vào khái niệm cơ bản và kiến thức nền tảng',
    questionDistribution: { low: 70, mid: 25, high: 5 },
    timePerQuestion: 60,
    passingScore: 70
  },
  {
    level: 'medium',
    description: 'Balance between fundamentals and practical applications',
    descriptionVi: 'Cân bằng giữa kiến thức cơ bản và ứng dụng thực tế',
    questionDistribution: { low: 30, mid: 50, high: 20 },
    timePerQuestion: 90,
    passingScore: 65
  },
  {
    level: 'hard',
    description: 'Advanced topics, edge cases, and expert-level questions',
    descriptionVi: 'Chủ đề nâng cao, edge cases và câu hỏi cấp chuyên gia',
    questionDistribution: { low: 10, mid: 30, high: 60 },
    timePerQuestion: 120,
    passingScore: 60
  },
  {
    level: 'mixed',
    description: 'Variety of difficulty levels for comprehensive assessment',
    descriptionVi: 'Đa dạng mức độ khó để đánh giá toàn diện',
    questionDistribution: { low: 33, mid: 34, high: 33 },
    timePerQuestion: 90,
    passingScore: 65
  },
  {
    level: 'adaptive',
    description: 'Difficulty adjusts based on your performance',
    descriptionVi: 'Độ khó tự động điều chỉnh theo kết quả của bạn',
    questionDistribution: { low: 40, mid: 40, high: 20 },
    timePerQuestion: 90,
    passingScore: 65
  }
];

// ============================================
// Enhanced Feedback Types (for new UI)
// ============================================

export interface EnhancedQuizFeedback {
  overallScore: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  skillPerformance: SkillPerformance[];
  recommendations: Recommendation[];
  studyPlan?: StudyPlan;
  careerInsights?: CareerInsightSummary | null;
}

export interface SkillPerformance {
  skillName: string;
  score: number;
  questionsAttempted: number;
  correctAnswers: number;
}

export interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  resources?: string[];
}

export interface StudyPlan {
  duration: string;
  weeklyPlan: WeeklyPlan[];
}

export interface WeeklyPlan {
  week: number;
  focus: string;
  topics: string[];
  hoursPerDay: number;
}

export interface CareerInsightSummary {
  marketDemand: string;
  salaryRange: string;
  growthPotential: string;
  nextSteps?: string[];
}

// ============================================
// Skill Match Types
// ============================================

export interface SkillMatchScore {
  fieldId: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export const EXPERIENCE_LEVEL_CONFIGS: ExperienceLevelConfig[] = [
  {
    level: 'intern',
    yearsRange: '0 năm (thực tập)',
    description: 'Student or intern, learning the basics',
    descriptionVi: 'Sinh viên hoặc thực tập sinh, đang học nền tảng',
    defaultDifficulty: 'easy',
    focusAreas: ['basic syntax', 'fundamentals', 'learning attitude']
  },
  {
    level: 'fresher',
    yearsRange: '0-1 năm',
    description: 'Just starting your career journey',
    descriptionVi: 'Mới bắt đầu hành trình sự nghiệp',
    defaultDifficulty: 'easy',
    focusAreas: ['fundamentals', 'syntax', 'basic concepts']
  },
  {
    level: 'junior',
    yearsRange: '1-2 năm',
    description: 'Building foundational skills',
    descriptionVi: 'Đang xây dựng kỹ năng nền tảng',
    defaultDifficulty: 'easy',
    focusAreas: ['fundamentals', 'common patterns', 'debugging']
  },
  {
    level: 'mid',
    yearsRange: '2-5 năm',
    description: 'Developing expertise and taking ownership',
    descriptionVi: 'Phát triển chuyên môn và tự chủ công việc',
    defaultDifficulty: 'medium',
    focusAreas: ['design patterns', 'optimization', 'architecture basics']
  },
  {
    level: 'senior',
    yearsRange: '5-8 năm',
    description: 'Deep expertise and technical leadership',
    descriptionVi: 'Chuyên môn sâu và kỹ năng lãnh đạo kỹ thuật',
    defaultDifficulty: 'hard',
    focusAreas: ['system design', 'scalability', 'mentoring']
  },
  {
    level: 'lead',
    yearsRange: '8-12 năm',
    description: 'Team leadership and architectural decisions',
    descriptionVi: 'Lãnh đạo team và quyết định kiến trúc',
    defaultDifficulty: 'hard',
    focusAreas: ['architecture', 'team dynamics', 'technical strategy']
  },
  {
    level: 'expert',
    yearsRange: '12+ năm',
    description: 'Industry expert and thought leader',
    descriptionVi: 'Chuyên gia ngành và người dẫn đầu tư duy',
    defaultDifficulty: 'hard',
    focusAreas: ['innovation', 'cross-domain expertise', 'industry trends']
  }
];
