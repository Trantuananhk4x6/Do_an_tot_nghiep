export interface UserProfile {
  id: number;
  userEmail: string;
  fullName: string;
  currentPosition?: string;
  desiredPosition?: string;
  industry?: string;
  yearsOfExperience?: number;
  cv?: string;
  portfolio?: string;
  bio?: string;
  skills?: string[];
  linkedIn?: string;
  github?: string;
  avatar?: string;
  isMentor: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MentorCourse {
  id: number;
  mentorEmail: string;
  mentorName?: string;
  mentorAvatar?: string;
  title: string;
  description: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  scheduledDate: Date;
  duration: number;
  industry: string;
  meetingLink?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  portfolio?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseRegistration {
  id: number;
  courseId: number;
  userEmail: string;
  userName: string;
  registeredAt: Date;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  attended: boolean;
  feedback?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Connection {
  id: number;
  fromUserEmail: string;
  toUserEmail: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: number;
  fromUserEmail: string;
  toUserEmail: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: number;
  userEmail: string;
  userName: string;
  userAvatar?: string;
  content: string;
  industry?: string;
  tags?: string[];
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: number;
  postId: number;
  userEmail: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseData {
  title: string;
  description: string;
  maxParticipants: number;
  price: number;
  scheduledDate: Date;
  duration: number;
  industry: string;
  portfolio?: string;
  tags?: string[];
}

export interface NetworkFilter {
  industry?: string;
  yearsOfExperience?: number;
  skills?: string[];
  searchQuery?: string;
}
