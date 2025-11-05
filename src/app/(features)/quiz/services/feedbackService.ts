import { type SkillAnalysis } from "./resumeAnalysisService";

export interface QuizFeedback {
  overallScore: number;
  performanceLevel: 'excellent' | 'good' | 'average' | 'needs-improvement';
  skillAnalysis: SkillPerformance[];
  recommendations: Recommendation[];
  studyPlan: StudyPlan;
  careerInsights: CareerInsight[];
}

export interface SkillPerformance {
  skill: string;
  category: string;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  strengths: string[];
  weaknesses: string[];
  difficulty: 'low' | 'mid' | 'high';
}

export interface Recommendation {
  type: 'study' | 'practice' | 'project' | 'certification';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeEstimate: string;
  resources: Resource[];
}

export interface Resource {
  type: 'course' | 'book' | 'documentation' | 'video' | 'practice' | 'project' | 'certification';
  title: string;
  url?: string;
  description: string;
}

export interface StudyPlan {
  timeframe: '1-week' | '2-weeks' | '1-month' | '3-months';
  dailyHours: number;
  phases: StudyPhase[];
}

export interface StudyPhase {
  week: number;
  focus: string;
  topics: string[];
  goals: string[];
  resources: Resource[];
}

export interface CareerInsight {
  insight: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
}

export interface QuizResult {
  questionId: string;
  question: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
  options: string[];
  category: string;
  difficulty: 'low' | 'mid' | 'high';
}

export function generateComprehensiveFeedback(
  quizResults: QuizResult[],
  skillAnalysis: SkillAnalysis,
  timeSpent: number
): QuizFeedback {
  const overallScore = calculateOverallScore(quizResults);
  const performanceLevel = determinePerformanceLevel(overallScore);
  const skillPerformances = analyzeSkillPerformance(quizResults, skillAnalysis);
  const recommendations = generateRecommendations(skillPerformances, skillAnalysis);
  const studyPlan = createStudyPlan(skillPerformances, skillAnalysis, timeSpent);
  const careerInsights = generateCareerInsights(skillAnalysis, skillPerformances);

  return {
    overallScore,
    performanceLevel,
    skillAnalysis: skillPerformances,
    recommendations,
    studyPlan,
    careerInsights
  };
}

function calculateOverallScore(results: QuizResult[]): number {
  const totalQuestions = results.length;
  const correctAnswers = results.filter(r => r.isCorrect).length;
  return Math.round((correctAnswers / totalQuestions) * 100);
}

function determinePerformanceLevel(score: number): 'excellent' | 'good' | 'average' | 'needs-improvement' {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'average';
  return 'needs-improvement';
}

function analyzeSkillPerformance(results: QuizResult[], skillAnalysis: SkillAnalysis): SkillPerformance[] {
  const skillGroups = groupResultsByCategory(results);
  const performances: SkillPerformance[] = [];

  Object.entries(skillGroups).forEach(([category, categoryResults]) => {
    const totalQuestions = categoryResults.length;
    const correctAnswers = categoryResults.filter(r => r.isCorrect).length;
    const accuracy = (correctAnswers / totalQuestions) * 100;

    // Analyze strengths and weaknesses
    const { strengths, weaknesses } = analyzeStrengthsWeaknesses(categoryResults);
    
    // Determine average difficulty
    const avgDifficulty = determineDominantDifficulty(categoryResults);

    performances.push({
      skill: category,
      category: category,
      questionsAnswered: totalQuestions,
      correctAnswers,
      accuracy: Math.round(accuracy),
      strengths,
      weaknesses,
      difficulty: avgDifficulty
    });
  });

  return performances;
}

function groupResultsByCategory(results: QuizResult[]): Record<string, QuizResult[]> {
  return results.reduce((groups, result) => {
    const category = result.category || 'general';
    if (!groups[category]) groups[category] = [];
    groups[category].push(result);
    return groups;
  }, {} as Record<string, QuizResult[]>);
}

function analyzeStrengthsWeaknesses(results: QuizResult[]): { strengths: string[], weaknesses: string[] } {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Group by difficulty
  const byDifficulty = {
    low: results.filter(r => r.difficulty === 'low'),
    mid: results.filter(r => r.difficulty === 'mid'), 
    high: results.filter(r => r.difficulty === 'high')
  };

  // Analyze each difficulty level
  Object.entries(byDifficulty).forEach(([difficulty, difficultyResults]) => {
    if (difficultyResults.length === 0) return;
    
    const accuracy = (difficultyResults.filter(r => r.isCorrect).length / difficultyResults.length) * 100;
    
    if (accuracy >= 80) {
      strengths.push(`Strong ${difficulty}-level concepts`);
    } else if (accuracy < 50) {
      weaknesses.push(`Needs improvement in ${difficulty}-level concepts`);
    }
  });

  return { strengths, weaknesses };
}

function determineDominantDifficulty(results: QuizResult[]): 'low' | 'mid' | 'high' {
  const counts = { low: 0, mid: 0, high: 0 };
  results.forEach(r => counts[r.difficulty]++);
  
  const maxCount = Math.max(...Object.values(counts));
  return Object.entries(counts).find(([_, count]) => count === maxCount)?.[0] as 'low' | 'mid' | 'high' || 'mid';
}

function generateRecommendations(performances: SkillPerformance[], skillAnalysis: SkillAnalysis): Recommendation[] {
  const recommendations: Recommendation[] = [];

  performances.forEach(performance => {
    if (performance.accuracy < 60) {
      // Need fundamental improvement
      recommendations.push({
        type: 'study',
        title: `Strengthen ${performance.skill.replace('-', ' ')} Fundamentals`,
        description: `Focus on core concepts and basic principles of ${performance.skill}`,
        priority: 'high',
        timeEstimate: '2-3 weeks',
        resources: getStudyResources(performance.skill, 'fundamental')
      });
    } else if (performance.accuracy < 80) {
      // Need practice
      recommendations.push({
        type: 'practice',
        title: `Practice ${performance.skill.replace('-', ' ')} Problems`,
        description: `Solve more coding challenges and practical exercises`,
        priority: 'medium', 
        timeEstimate: '1-2 weeks',
        resources: getStudyResources(performance.skill, 'practice')
      });
    } else {
      // Already strong, suggest advanced topics
      recommendations.push({
        type: 'project',
        title: `Build Advanced ${performance.skill.replace('-', ' ')} Project`,
        description: `Create a complex project to demonstrate mastery`,
        priority: 'low',
        timeEstimate: '2-4 weeks',
        resources: getStudyResources(performance.skill, 'advanced')
      });
    }
  });

  // Add career-specific recommendations based on CV analysis
  if (skillAnalysis.experienceLevel === 'junior') {
    recommendations.push({
      type: 'certification',
      title: 'Consider Professional Certification',
      description: 'Boost your credibility with industry-recognized certifications',
      priority: 'medium',
      timeEstimate: '1-3 months',
      resources: getCertificationResources(skillAnalysis.primaryCategory)
    });
  }

  return recommendations.slice(0, 5); // Limit to top 5 recommendations
}

function getStudyResources(skill: string, level: 'fundamental' | 'practice' | 'advanced'): Resource[] {
  const resourceMap: Record<string, Record<string, Resource[]>> = {
    javascript: {
      fundamental: [
        {
          type: 'course',
          title: 'JavaScript Fundamentals',
          url: 'https://javascript.info',
          description: 'Complete modern JavaScript tutorial'
        },
        {
          type: 'book',
          title: 'Eloquent JavaScript',
          url: 'https://eloquentjavascript.net',
          description: 'In-depth JavaScript programming book'
        }
      ],
      practice: [
        {
          type: 'practice',
          title: 'Codewars JavaScript Kata',
          url: 'https://www.codewars.com',
          description: 'Practice JavaScript coding challenges'
        },
        {
          type: 'practice',
          title: 'JavaScript30',
          url: 'https://javascript30.com',
          description: '30 day JavaScript challenge'
        }
      ],
      advanced: [
        {
          type: 'project',
          title: 'Build a Full-Stack Application',
          description: 'Create a complete web application with modern JavaScript'
        }
      ]
    },
    react: {
      fundamental: [
        {
          type: 'documentation',
          title: 'React Official Docs',
          url: 'https://react.dev',
          description: 'Official React documentation and tutorial'
        }
      ],
      practice: [
        {
          type: 'course',
          title: 'React Challenges',
          description: 'Interactive React coding exercises'
        }
      ],
      advanced: [
        {
          type: 'project',
          title: 'React + TypeScript Project',
          description: 'Build a complex React application with TypeScript'
        }
      ]
    }
    // Add more skills...
  };

  return resourceMap[skill]?.[level] || [
    {
      type: 'course',
      title: `${skill.replace('-', ' ')} Learning Path`,
      description: `Comprehensive learning resources for ${skill}`
    }
  ];
}

function getCertificationResources(skill: string): Resource[] {
  const certificationMap: Record<string, Resource[]> = {
    javascript: [
      {
        type: 'certification',
        title: 'Microsoft Certified: Azure Developer Associate',
        url: 'https://docs.microsoft.com/en-us/learn/certifications/azure-developer/',
        description: 'Industry-recognized JavaScript/Azure certification'
      }
    ],
    react: [
      {
        type: 'certification',  
        title: 'Meta React Certificate',
        url: 'https://www.coursera.org/professional-certificates/meta-react-native',
        description: 'Official React certification from Meta'
      }
    ]
  };

  return certificationMap[skill] || [];
}

function createStudyPlan(performances: SkillPerformance[], skillAnalysis: SkillAnalysis, timeSpent: number): StudyPlan {
  const weakSkills = performances.filter(p => p.accuracy < 70);
  const timeframe = weakSkills.length > 2 ? '3-months' : weakSkills.length > 1 ? '1-month' : '2-weeks';
  const dailyHours = skillAnalysis.experienceLevel === 'senior' ? 1 : 2;

  const phases: StudyPhase[] = [];

  if (timeframe === '3-months') {
    phases.push(
      {
        week: 1,
        focus: 'Foundation Building',
        topics: ['Core concepts', 'Basic syntax', 'Fundamentals'],
        goals: ['Master basic concepts', 'Build solid foundation'],
        resources: getStudyResources(skillAnalysis.primaryCategory, 'fundamental')
      },
      {
        week: 2, 
        focus: 'Practical Application',
        topics: ['Hands-on coding', 'Small projects', 'Problem solving'],
        goals: ['Apply concepts practically', 'Build confidence'],
        resources: getStudyResources(skillAnalysis.primaryCategory, 'practice')
      },
      {
        week: 3,
        focus: 'Advanced Topics',
        topics: ['Complex patterns', 'Best practices', 'Performance'],
        goals: ['Master advanced concepts', 'Industry readiness'],
        resources: getStudyResources(skillAnalysis.primaryCategory, 'advanced')
      }
    );
  } else {
    phases.push({
      week: 1,
      focus: 'Targeted Improvement',
      topics: weakSkills.map(s => s.skill),
      goals: ['Address weak areas', 'Improve accuracy'],
      resources: getStudyResources(skillAnalysis.primaryCategory, 'practice')
    });
  }

  return {
    timeframe,
    dailyHours,
    phases
  };
}

function generateCareerInsights(skillAnalysis: SkillAnalysis, performances: SkillPerformance[]): CareerInsight[] {
  const insights: CareerInsight[] = [];

  // Overall performance insight
  const avgAccuracy = performances.reduce((sum, p) => sum + p.accuracy, 0) / performances.length;
  
  if (avgAccuracy >= 85) {
    insights.push({
      insight: 'Your technical skills are strong! You\'re ready for senior-level responsibilities.',
      impact: 'high',
      actionable: true
    });
  } else if (avgAccuracy >= 70) {
    insights.push({
      insight: 'You have solid fundamentals. Focus on advanced topics to reach the next level.',
      impact: 'medium', 
      actionable: true
    });
  } else {
    insights.push({
      insight: 'Strengthen your core concepts before pursuing advanced topics.',
      impact: 'high',
      actionable: true
    });
  }

  // Skill diversity insight
  if (skillAnalysis.secondaryCategories.length >= 2) {
    insights.push({
      insight: 'Your diverse skill set makes you valuable for full-stack roles.',
      impact: 'medium',
      actionable: false
    });
  }

  // Experience level insight
  if (skillAnalysis.experienceLevel === 'junior' && avgAccuracy >= 75) {
    insights.push({
      insight: 'Your performance exceeds typical junior level. Consider applying for mid-level positions.',
      impact: 'high', 
      actionable: true
    });
  }

  return insights;
}