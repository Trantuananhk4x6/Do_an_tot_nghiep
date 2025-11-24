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
  let hasExplicitLevel = false;
  
  // Check for explicit level keywords first (highest priority)
  if (text.match(/\b(fresher|mới tốt nghiệp|fresh graduate|0[\s-]1\s+(?:years?|năm))\b/i)) {
    yearsOfExperience = 0;
    hasExplicitLevel = true;
    console.log('🎯 Phát hiện từ khóa: Fresher');
  } else if (text.match(/\b(intern|thực tập|internship|student)\b/i)) {
    yearsOfExperience = 0;
    hasExplicitLevel = true;
    console.log('🎯 Phát hiện từ khóa: Intern');
  }
  
  // Only calculate from other patterns if no explicit level found
  if (!hasExplicitLevel) {
    // Pattern 1: "9+ years", "9 years", "9+ năm"
    const pattern1 = text.match(/(\d+)\+?\s*(?:years?|năm)\s*(?:of\s*)?(?:experience|kinh nghiệm)/i);
    if (pattern1) {
      yearsOfExperience = Math.max(yearsOfExperience, parseInt(pattern1[1]));
    }
    
    // Pattern 2: "with 9+ years", "over 9 years"
    const pattern2 = text.match(/(?:with|over|more than)\s*(\d+)\+?\s*(?:years?|năm)/i);
    if (pattern2) {
      yearsOfExperience = Math.max(yearsOfExperience, parseInt(pattern2[1]));
    }
    
    // Pattern 3: Calculate from work history dates ONLY if "experience" keyword nearby
    // Look for work experience section indicators
    const hasWorkSection = text.match(/(?:work\s+experience|kinh nghiệm làm việc|professional\s+experience)/i);
    
    if (hasWorkSection) {
      const dateRanges = text.match(/(\d{4})\s*[-–—]\s*(?:present|hiện tại|\d{4})/gi);
      if (dateRanges && dateRanges.length > 0) {
        let totalYears = 0;
        const currentYear = new Date().getFullYear();
        
        dateRanges.forEach(range => {
          const match = range.match(/(\d{4})\s*[-–—]\s*(?:present|hiện tại|(\d{4}))/i);
          if (match) {
            const startYear = parseInt(match[1]);
            const endYear = match[2] ? parseInt(match[2]) : currentYear;
            const yearDiff = (endYear - startYear);
            // Only count if it's reasonable work experience (not education)
            if (yearDiff > 0 && yearDiff <= 50) {
              totalYears += yearDiff;
            }
          }
        });
        
        yearsOfExperience = Math.max(yearsOfExperience, totalYears);
      }
    }
    
    // Pattern 4: "Cybersecurity analyst with 9+ years"
    const pattern4 = text.match(/analyst\s+with\s+(\d+)\+?\s*(?:years?|năm)/i);
    if (pattern4) {
      yearsOfExperience = Math.max(yearsOfExperience, parseInt(pattern4[1]));
    }
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
    currentLevel = 'junior';
    suggestedLevel = ['junior', 'middle'];
  } else {
    // 0 years - check if student or fresh graduate
    if (text.match(/\b(student|\u0111ang h\u1ecdc|sinh vi\u00ean)\b/i)) {
      currentLevel = 'intern';
      suggestedLevel = ['intern', 'fresher'];
    } else {
      currentLevel = 'fresher';
      suggestedLevel = ['fresher', 'junior'];
    }
  }
  
  // Determine main field with better detection
  let mainField = 'Software Developer';
  
  // Check for both frontend AND backend skills (Fullstack)
  const hasFrontend = text.match(/react|vue|angular|html|css|javascript|typescript|frontend/i);
  const hasBackend = text.match(/backend|api|server|node\.?js|express|django|spring|database|sql/i);
  
  // Security field detection (based on CV content)
  if (text.match(/cyber\s*security|security\s+analyst|penetration|malware|threat\s+analysis|nist|dlp/i)) {
    mainField = 'Security Engineer';
  }
  // Full Stack - if has BOTH frontend and backend skills
  else if (text.match(/fullstack|full[\s-]stack/i) || (hasFrontend && hasBackend)) {
    mainField = 'Full Stack Developer';
  }
  // Frontend
  else if (text.includes('frontend') || hasFrontend) {
    mainField = 'Frontend Developer';
  }
  // Backend
  else if (text.includes('backend') || hasBackend) {
    mainField = 'Backend Developer';
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
      ? `${currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} ${mainField} with ${yearsOfExperience}+ years of experience`
      : `${currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} ${mainField}`
  };
}

// Helper function to get level display name
export function getLevelDisplayName(level: JobLevel): string {
  const displayNames: Record<JobLevel, string> = {
    intern: 'Intern',
    fresher: 'Fresher',
    junior: 'Junior',
    middle: 'Middle',
    senior: 'Senior',
    manager: 'Manager',
    director: 'Director'
  };
  return displayNames[level];
}

// Get recommended experience range for a level
export function getExperienceRange(level: JobLevel): string {
  const ranges: Record<JobLevel, string> = {
    intern: '0 years (Student)',
    fresher: '0-1 years',
    junior: '1-3 years',
    middle: '3-5 years',
    senior: '5-8 years',
    manager: '7+ years',
    director: '10+ years'
  };
  return ranges[level];
}
