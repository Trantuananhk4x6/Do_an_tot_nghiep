import { CVAnalysisForJob, JobLevel } from '../types/job.types';

// Analyze CV and extract job-related information
export async function analyzeCVForJobSearch(cvText: string): Promise<CVAnalysisForJob> {
  console.log('🔍 Bắt đầu phân tích CV...');
  
  // Use local analysis for now (faster and no API quota)
  // TODO: Implement AI analysis later if needed
  const analysis = getFallbackAnalysis(cvText);
  
  console.log('✅ Phân tích CV thành công:', {
    skills: analysis.skills.length,
    level: analysis.currentLevel,
    field: analysis.mainField
  });
  
  return analysis;
}

// Fallback analysis if API fails
function getFallbackAnalysis(cvText: string): CVAnalysisForJob {
  const text = cvText.toLowerCase();
  
  // Extract skills - expanded list
  const commonSkills = [
    // Programming Languages
    'javascript', 'typescript', 'react', 'angular', 'vue', 'node.js',
    'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'kotlin', 'swift',
    // Backend
    'express', 'nest.js', 'django', 'flask', 'spring', 'laravel',
    // Database
    'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
    // DevOps & Cloud
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'terraform',
    // Tools
    'git', 'agile', 'scrum', 'jira', 'linux',
    // Security
    'cybersecurity', 'security', 'penetration', 'malware', 'nist', 'dlp'
  ];
  
  const skills = commonSkills.filter(skill => text.includes(skill.toLowerCase()));
  
  // Estimate years of experience - multiple patterns
  let yearsOfExperience = 0;
  
  // Pattern 1: "9+ years", "9 years", "9+ năm"
  const pattern1 = text.match(/(\d+)\+?\s*(?:years?|năm)\s*(?:of\s*)?(?:experience|kinh nghiệm)?/i);
  if (pattern1) {
    yearsOfExperience = Math.max(yearsOfExperience, parseInt(pattern1[1]));
  }
  
  // Pattern 2: "with 9+ years", "over 9 years"
  const pattern2 = text.match(/(?:with|over|more than)\s*(\d+)\+?\s*(?:years?|năm)/i);
  if (pattern2) {
    yearsOfExperience = Math.max(yearsOfExperience, parseInt(pattern2[1]));
  }
  
  // Pattern 3: Calculate from work history dates (e.g., "2020 - Present", "2016 - 2020")
  const dateRanges = text.match(/(\d{4})\s*[-–—]\s*(?:present|hiện tại|\d{4})/gi);
  if (dateRanges && dateRanges.length > 0) {
    let totalYears = 0;
    const currentYear = new Date().getFullYear();
    
    dateRanges.forEach(range => {
      const match = range.match(/(\d{4})\s*[-–—]\s*(?:present|hiện tại|(\d{4}))/i);
      if (match) {
        const startYear = parseInt(match[1]);
        const endYear = match[2] ? parseInt(match[2]) : currentYear;
        totalYears += (endYear - startYear);
      }
    });
    
    yearsOfExperience = Math.max(yearsOfExperience, totalYears);
  }
  
  // Pattern 4: "Cybersecurity analyst with 9+ years"
  const pattern4 = text.match(/analyst\s+with\s+(\d+)\+?\s*(?:years?|năm)/i);
  if (pattern4) {
    yearsOfExperience = Math.max(yearsOfExperience, parseInt(pattern4[1]));
  }
  
  console.log('📊 Phát hiện kinh nghiệm:', yearsOfExperience, 'năm');
  
  // Determine level based on experience
  let currentLevel: JobLevel = 'fresher';
  let suggestedLevel: JobLevel[] = ['fresher', 'junior'];
  
  if (yearsOfExperience >= 10) {
    currentLevel = 'senior';
    suggestedLevel = ['senior', 'manager', 'director'];
  } else if (yearsOfExperience >= 7) {
    currentLevel = 'senior';
    suggestedLevel = ['senior', 'manager'];
  } else if (yearsOfExperience >= 4) {
    currentLevel = 'middle';
    suggestedLevel = ['middle', 'senior'];
  } else if (yearsOfExperience >= 2) {
    currentLevel = 'junior';
    suggestedLevel = ['junior', 'middle'];
  } else if (yearsOfExperience >= 1) {
    currentLevel = 'fresher';
    suggestedLevel = ['fresher', 'junior'];
  } else {
    currentLevel = 'intern';
    suggestedLevel = ['intern', 'fresher'];
  }
  
  // Determine main field with better detection
  let mainField = 'Software Developer';
  
  // Security field detection (based on CV content)
  if (text.match(/cyber\s*security|security\s+analyst|penetration|malware|threat\s+analysis|nist|dlp/i)) {
    mainField = 'Security Engineer';
  }
  // Frontend
  else if (text.includes('frontend') || text.match(/react|vue|angular/)) {
    mainField = 'Frontend Developer';
  }
  // Backend
  else if (text.includes('backend') || text.match(/api|server|node\.?js|express|django|spring/)) {
    mainField = 'Backend Developer';
  }
  // Full Stack
  else if (text.match(/fullstack|full[\s-]stack/)) {
    mainField = 'Full Stack Developer';
  }
  // Data Science / ML / AI
  else if (text.match(/data\s+scien|machine\s+learning|artificial\s+intelligence|deep\s+learning/)) {
    mainField = 'Data Science';
  }
  // Mobile
  else if (text.match(/mobile|android|ios|react\s+native|flutter/)) {
    mainField = 'Mobile Developer';
  }
  // DevOps
  else if (text.match(/devops|infrastructure|docker|kubernetes|ci\/cd/)) {
    mainField = 'DevOps Engineer';
  }
  // QA
  else if (text.match(/qa|quality\s+assurance|testing|test\s+automation/)) {
    mainField = 'QA Engineer';
  }
  
  // Extract location - expanded detection
  const vietnamCities = [
    'hà nội', 'hanoi', 'ha noi',
    'hồ chí minh', 'ho chi minh', 'hcm', 'saigon', 'sài gòn',
    'đà nẵng', 'da nang',
    'new york', 'san francisco', 'san diego', 'california'
  ];
  
  let location = 'Ho Chi Minh';
  for (const city of vietnamCities) {
    if (text.includes(city)) {
      location = city;
      break;
    }
  }
  
  // Capitalize location properly
  if (location === 'hanoi' || location === 'ha noi' || location === 'hà nội') {
    location = 'Hà Nội';
  } else if (location.includes('chi minh') || location === 'hcm' || location.includes('saigon')) {
    location = 'Hồ Chí Minh';
  } else if (location.includes('da nang') || location.includes('đà nẵng')) {
    location = 'Đà Nẵng';
  } else if (location === 'new york') {
    location = 'New York';
  } else if (location === 'san francisco') {
    location = 'San Francisco';
  } else if (location === 'san diego') {
    location = 'San Diego';
  } else {
    location = location.charAt(0).toUpperCase() + location.slice(1);
  }
  
  return {
    skills: skills.length > 0 ? skills : ['Programming', 'Software Development'],
    yearsOfExperience,
    currentLevel,
    suggestedLevel,
    mainField,
    location,
    summary: yearsOfExperience > 0 
      ? `${currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} ${mainField} với ${yearsOfExperience}+ năm kinh nghiệm`
      : `${currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} ${mainField}`
  };
}

// Helper function to get level display name
export function getLevelDisplayName(level: JobLevel): string {
  const displayNames: Record<JobLevel, string> = {
    intern: 'Thực tập sinh (Intern)',
    fresher: 'Mới tốt nghiệp (Fresher)',
    junior: 'Nhân viên (Junior)',
    middle: 'Trưởng nhóm (Middle)',
    senior: 'Chuyên gia (Senior)',
    manager: 'Quản lý (Manager)',
    director: 'Giám đốc (Director)'
  };
  return displayNames[level];
}

// Get recommended experience range for a level
export function getExperienceRange(level: JobLevel): string {
  const ranges: Record<JobLevel, string> = {
    intern: '0 năm (Đang học)',
    fresher: '0-1 năm',
    junior: '1-3 năm',
    middle: '3-5 năm',
    senior: '5-8 năm',
    manager: '7+ năm',
    director: '10+ năm'
  };
  return ranges[level];
}
