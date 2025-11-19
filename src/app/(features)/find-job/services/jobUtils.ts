import { JobLevel } from '../types/job.types';

/**
 * Get color theme for job level
 */
export function getLevelColor(level: JobLevel): string {
  const colors: Record<JobLevel, string> = {
    intern: 'from-blue-500 to-cyan-500',
    fresher: 'from-green-500 to-emerald-500',
    junior: 'from-purple-500 to-violet-500',
    middle: 'from-orange-500 to-amber-500',
    senior: 'from-red-500 to-rose-500',
    manager: 'from-indigo-500 to-blue-500',
    director: 'from-yellow-500 to-orange-500'
  };
  return colors[level];
}

/**
 * Get salary range estimate for Vietnam market
 */
export function getSalaryRange(level: JobLevel, field: string): string {
  const baseSalary: Record<JobLevel, { min: number; max: number }> = {
    intern: { min: 3, max: 5 },
    fresher: { min: 8, max: 15 },
    junior: { min: 15, max: 25 },
    middle: { min: 25, max: 40 },
    senior: { min: 40, max: 70 },
    manager: { min: 60, max: 100 },
    director: { min: 100, max: 200 }
  };

  const range = baseSalary[level];
  
  // IT/Tech positions typically earn 20-30% more
  const multiplier = field.toLowerCase().includes('developer') || 
                     field.toLowerCase().includes('engineer') || 
                     field.toLowerCase().includes('data') ||
                     field.toLowerCase().includes('it') ? 1.2 : 1.0;

  const min = Math.round(range.min * multiplier);
  const max = Math.round(range.max * multiplier);

  return `${min}-${max} triệu VNĐ/tháng`;
}

/**
 * Generate search keywords from CV analysis
 */
export function generateSearchKeywords(mainField: string, skills: string[]): string[] {
  const keywords: string[] = [mainField];
  
  // Add variations
  if (mainField.includes('Frontend')) {
    keywords.push('Front-end Developer', 'FE Developer', 'React Developer', 'Vue Developer');
  } else if (mainField.includes('Backend')) {
    keywords.push('Back-end Developer', 'BE Developer', 'Node.js Developer', 'Java Developer');
  } else if (mainField.includes('Full Stack')) {
    keywords.push('Fullstack Developer', 'Full-stack Engineer');
  } else if (mainField.includes('Mobile')) {
    keywords.push('Android Developer', 'iOS Developer', 'React Native Developer');
  }
  
  // Add skill-based keywords
  if (skills.includes('react') || skills.includes('React')) {
    keywords.push('React Developer');
  }
  if (skills.includes('nodejs') || skills.includes('Node.js')) {
    keywords.push('Node.js Developer');
  }
  if (skills.includes('python') || skills.includes('Python')) {
    keywords.push('Python Developer');
  }
  
  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Format location for display
 */
export function formatLocation(location: string): string {
  const locationMap: Record<string, string> = {
    'hanoi': 'Hà Nội',
    'ho chi minh': 'Hồ Chí Minh',
    'da nang': 'Đà Nẵng',
    'hai phong': 'Hải Phòng',
    'can tho': 'Cần Thơ',
    'bien hoa': 'Biên Hòa',
    'hue': 'Huế',
    'nha trang': 'Nha Trang'
  };
  
  const normalized = location.toLowerCase();
  return locationMap[normalized] || location;
}

/**
 * Calculate CV match score with job requirements
 */
export function calculateMatchScore(
  cvSkills: string[],
  requiredSkills: string[],
  cvExperience: number,
  requiredExperience: number
): number {
  // Skills match (70% weight)
  const matchedSkills = cvSkills.filter(skill => 
    requiredSkills.some(req => 
      req.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(req.toLowerCase())
    )
  );
  const skillScore = requiredSkills.length > 0 
    ? (matchedSkills.length / requiredSkills.length) * 70 
    : 50;

  // Experience match (30% weight)
  const experienceScore = cvExperience >= requiredExperience 
    ? 30 
    : (cvExperience / requiredExperience) * 30;

  return Math.min(100, Math.round(skillScore + experienceScore));
}

/**
 * Get job level recommendations based on experience
 */
export function getCareerPathRecommendations(
  currentLevel: JobLevel,
  yearsOfExperience: number
): { nextLevel: JobLevel; timeframe: string; tips: string[] } {
  const paths: Record<JobLevel, { nextLevel: JobLevel; timeframe: string; tips: string[] }> = {
    intern: {
      nextLevel: 'fresher',
      timeframe: '6-12 tháng',
      tips: [
        'Hoàn thành tốt các task được giao',
        'Học hỏi và tiếp thu feedback nhanh',
        'Tích cực tham gia các dự án thực tế'
      ]
    },
    fresher: {
      nextLevel: 'junior',
      timeframe: '1-2 năm',
      tips: [
        'Nắm vững kiến thức nền tảng',
        'Làm việc độc lập với supervision',
        'Đóng góp vào code review và technical discussions'
      ]
    },
    junior: {
      nextLevel: 'middle',
      timeframe: '2-3 năm',
      tips: [
        'Lead các task và mini-projects',
        'Mentor fresher developers',
        'Cải thiện kỹ năng thiết kế hệ thống'
      ]
    },
    middle: {
      nextLevel: 'senior',
      timeframe: '2-4 năm',
      tips: [
        'Thiết kế và implement các features phức tạp',
        'Đưa ra technical decisions',
        'Chia sẻ kiến thức và best practices'
      ]
    },
    senior: {
      nextLevel: 'manager',
      timeframe: '3-5 năm',
      tips: [
        'Phát triển kỹ năng leadership',
        'Tham gia planning và strategy',
        'Mentor junior/middle developers'
      ]
    },
    manager: {
      nextLevel: 'director',
      timeframe: '5+ năm',
      tips: [
        'Xây dựng và phát triển teams',
        'Strategic planning và roadmap',
        'Cross-functional collaboration'
      ]
    },
    director: {
      nextLevel: 'director',
      timeframe: 'Continuous improvement',
      tips: [
        'Organizational leadership',
        'Business strategy alignment',
        'Industry thought leadership'
      ]
    }
  };

  return paths[currentLevel];
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
