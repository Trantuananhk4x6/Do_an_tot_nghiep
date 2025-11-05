export interface Message {
  content: string;
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export interface InterviewResponse {
  id: number;
  text: string;
  audio: string;
}
