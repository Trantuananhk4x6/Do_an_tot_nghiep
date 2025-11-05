// Types for Interview Assessment System

export interface InterviewerProfile {
  name: string;
  title: string;
  gender: "male" | "female";
  age: number;
  voiceTone: string;
  expertise: string;
  yearsOfExperience: number;
  interviewStyle: string;
  focusAreas: string[];
  questionTypes: string[];
  personality: string;
}

export interface TranscriptEntry {
  speaker: 'interviewer' | 'candidate';
  message: string;
  timestamp: number; // milliseconds since interview start
  isQuestion?: boolean;
}

export interface InterviewSession {
  sessionId: string;
  startTime: number; // Unix timestamp in milliseconds
  endTime?: number; // Unix timestamp in milliseconds
  duration?: number; // in seconds
  
  interviewer: {
    name: string;
    title: string;
    gender: string; // Changed from "male" | "female" to allow flexibility
    age: number;
    voiceTone: string;
    expertise: string;
  };
  
  candidate?: {
    name?: string;
    position: string;
  };
  
  transcript: TranscriptEntry[];
  
  assessment?: AssessmentResult;
}

export interface CategoryScore {
  score: number; // 0-100
  justification: string;
}

export interface DetailedFeedback {
  category: string;
  rating: 'Excellent' | 'Strong' | 'Good' | 'Fair' | 'Needs Improvement';
  comment: string;
}

export interface ImprovementArea {
  area: string;
  suggestion: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface AssessmentResult {
  scores: {
    technicalSkills: CategoryScore;
    problemSolving: CategoryScore;
    communication: CategoryScore;
    experience: CategoryScore;
    professionalism: CategoryScore;
  };
  
  overallScore: number; // weighted average, 0-100
  readinessLevel: string; // "Strong Hire" | "Hire" | "Maybe" | "No Hire"
  
  strengths: string[];
  weaknesses: string[];
  
  detailedFeedback: DetailedFeedback[];
  
  improvementAreas: ImprovementArea[];
  
  interviewSummary: string;
  recommendedActions: string[];
  
  // For radar chart
  skillsRadar: Array<{
    name: string;
    score: number;
    maxScore: number;
    description: string;
  }>;
}

export interface AssessmentAPIRequest {
  interviewSession: InterviewSession;
}

export interface AssessmentAPIResponse {
  success: boolean;
  assessment?: AssessmentResult;
  error?: string;
}
