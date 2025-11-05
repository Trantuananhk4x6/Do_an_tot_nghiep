export interface Summary {
  summary: string;
  keyPoints: string[];
  wordCount: number;
  readingTime: number;
}

export interface SummaryResponse {
  summary: string;
  keyPoints: string[];
  wordCount: number;
  readingTime: number;
   weaknesses?: Weakness[];
}
export interface Weakness {
  issue: string;
  suggestion: string;
}

