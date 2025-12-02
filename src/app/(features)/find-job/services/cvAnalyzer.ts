import { CVAnalysisForJob, JobLevel, LocationInfo, SkillMatch } from '../types/job.types';
import { parseLocationFromText, VIETNAMESE_CITIES, INTERNATIONAL_CITIES } from './locationService';
import { getFieldMarketInsights, getSalaryRangeForLevel } from './marketInsights';

// Comprehensive IT field definitions with keywords and skills
const IT_FIELDS = {
  // Frontend Development
  'Frontend Developer': {
    keywords: ['frontend', 'front-end', 'front end', 'ui developer', 'web developer'],
    skills: ['react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxt', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'webpack', 'vite', 'javascript', 'typescript'],
    weight: 1.0
  },
  
  // Backend Development
  'Backend Developer': {
    keywords: ['backend', 'back-end', 'back end', 'server-side', 'api developer'],
    skills: ['nodejs', 'node.js', 'express', 'nestjs', 'python', 'django', 'flask', 'fastapi', 'java', 'spring', 'spring boot', 'php', 'laravel', 'ruby', 'rails', 'go', 'golang', 'rust', '.net', 'c#', 'asp.net'],
    weight: 1.0
  },
  
  // Full Stack Development
  'Full Stack Developer': {
    keywords: ['fullstack', 'full-stack', 'full stack'],
    skills: ['mern', 'mean', 'lamp', 'jamstack'],
    weight: 1.2
  },
  
  // Mobile Development
  'Mobile Developer': {
    keywords: ['mobile', 'mobile app', 'app developer'],
    skills: ['react native', 'flutter', 'ionic', 'xamarin', 'swift', 'swiftui', 'objective-c', 'kotlin', 'android', 'ios', 'mobile development'],
    weight: 1.0
  },
  
  // DevOps Engineering
  'DevOps Engineer': {
    keywords: ['devops', 'dev ops', 'sre', 'site reliability', 'infrastructure engineer', 'platform engineer'],
    skills: ['docker', 'kubernetes', 'k8s', 'jenkins', 'gitlab ci', 'github actions', 'terraform', 'ansible', 'puppet', 'chef', 'aws', 'azure', 'gcp', 'ci/cd', 'monitoring', 'prometheus', 'grafana', 'elk', 'nginx', 'apache'],
    weight: 1.0
  },
  
  // Cloud Engineering
  'Cloud Engineer': {
    keywords: ['cloud engineer', 'cloud architect', 'cloud developer', 'cloud specialist'],
    skills: ['aws', 'amazon web services', 'azure', 'microsoft azure', 'gcp', 'google cloud', 'cloud computing', 'serverless', 'lambda', 'ec2', 's3', 'cloudformation', 'cloud architecture'],
    weight: 1.0
  },
  
  // Data Science & Analytics
  'Data Scientist': {
    keywords: ['data scientist', 'data science', 'ml engineer', 'machine learning engineer'],
    skills: ['python', 'r', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras', 'machine learning', 'deep learning', 'neural network', 'nlp', 'computer vision', 'data analysis', 'statistics'],
    weight: 1.0
  },
  
  // Data Engineering
  'Data Engineer': {
    keywords: ['data engineer', 'big data', 'etl developer', 'data pipeline'],
    skills: ['spark', 'hadoop', 'kafka', 'airflow', 'etl', 'data warehouse', 'snowflake', 'redshift', 'bigquery', 'databricks', 'hive', 'pig', 'data modeling', 'sql'],
    weight: 1.0
  },
  
  // Data Analytics
  'Data Analyst': {
    keywords: ['data analyst', 'business analyst', 'analytics', 'bi developer'],
    skills: ['sql', 'excel', 'power bi', 'tableau', 'looker', 'google analytics', 'data visualization', 'reporting', 'dashboard'],
    weight: 1.0
  },
  
  // AI/ML Specialist
  'AI/ML Engineer': {
    keywords: ['ai engineer', 'artificial intelligence', 'ml engineer', 'ai specialist'],
    skills: ['tensorflow', 'pytorch', 'opencv', 'yolo', 'transformers', 'bert', 'gpt', 'llm', 'generative ai', 'reinforcement learning', 'computer vision', 'nlp'],
    weight: 1.0
  },
  
  // Security Engineering
  'Security Engineer': {
    keywords: ['security engineer', 'cybersecurity', 'infosec', 'information security', 'appsec', 'security analyst'],
    skills: ['penetration testing', 'ethical hacking', 'vulnerability', 'threat analysis', 'siem', 'firewall', 'ids', 'ips', 'nist', 'iso 27001', 'owasp', 'burp suite', 'metasploit', 'wireshark', 'dlp'],
    weight: 1.0
  },
  
  // QA/Testing
  'QA Engineer': {
    keywords: ['qa', 'quality assurance', 'test engineer', 'sdet', 'automation tester'],
    skills: ['selenium', 'cypress', 'jest', 'mocha', 'junit', 'testng', 'playwright', 'appium', 'postman', 'jmeter', 'test automation', 'manual testing', 'api testing', 'load testing'],
    weight: 1.0
  },
  
  // Blockchain Development
  'Blockchain Developer': {
    keywords: ['blockchain', 'web3', 'crypto', 'defi', 'nft'],
    skills: ['solidity', 'ethereum', 'smart contract', 'web3.js', 'ethers.js', 'truffle', 'hardhat', 'bitcoin', 'hyperledger', 'polygon'],
    weight: 1.0
  },
  
  // Game Development
  'Game Developer': {
    keywords: ['game developer', 'game programmer', 'game engineer'],
    skills: ['unity', 'unreal', 'c++', 'c#', 'godot', 'game engine', '3d', 'graphics', 'opengl', 'directx'],
    weight: 1.0
  },
  
  // Embedded Systems
  'Embedded Engineer': {
    keywords: ['embedded', 'firmware', 'iot', 'hardware', 'embedded systems'],
    skills: ['c', 'c++', 'embedded c', 'microcontroller', 'arduino', 'raspberry pi', 'rtos', 'linux embedded', 'arm', 'fpga'],
    weight: 1.0
  },
  
  // UI/UX Design
  'UI/UX Designer': {
    keywords: ['ui designer', 'ux designer', 'product designer', 'interface designer', 'user experience'],
    skills: ['figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'prototyping', 'wireframe', 'user research', 'usability testing', 'design systems'],
    weight: 1.0
  },
  
  // System Administration
  'System Administrator': {
    keywords: ['sysadmin', 'system admin', 'systems administrator', 'it administrator'],
    skills: ['linux', 'unix', 'windows server', 'active directory', 'bash', 'powershell', 'virtualization', 'vmware', 'hyper-v', 'networking', 'dns', 'dhcp'],
    weight: 1.0
  },
  
  // Database Administration
  'Database Administrator': {
    keywords: ['dba', 'database administrator', 'database engineer'],
    skills: ['mysql', 'postgresql', 'oracle', 'sql server', 'mongodb', 'redis', 'cassandra', 'database optimization', 'backup', 'recovery', 'replication'],
    weight: 1.0
  },
  
  // Network Engineering
  'Network Engineer': {
    keywords: ['network engineer', 'network administrator', 'network architect'],
    skills: ['cisco', 'juniper', 'routing', 'switching', 'bgp', 'ospf', 'vpn', 'wan', 'lan', 'ccna', 'ccnp', 'firewall', 'load balancer'],
    weight: 1.0
  },
  
  // Product Management (Technical)
  'Technical Product Manager': {
    keywords: ['product manager', 'technical pm', 'tpm', 'product owner'],
    skills: ['product management', 'agile', 'scrum', 'jira', 'roadmap', 'user stories', 'stakeholder management', 'wireframing'],
    weight: 0.9
  },
  
  // Technical Writing
  'Technical Writer': {
    keywords: ['technical writer', 'documentation', 'technical author'],
    skills: ['technical writing', 'documentation', 'api documentation', 'markdown', 'confluence', 'swagger', 'openapi'],
    weight: 0.8
  },
  
  // Solutions Architect
  'Solutions Architect': {
    keywords: ['solutions architect', 'software architect', 'enterprise architect', 'system architect'],
    skills: ['architecture', 'microservices', 'design patterns', 'system design', 'scalability', 'distributed systems', 'cloud architecture', 'aws', 'azure'],
    weight: 1.1
  }
};

// Analyze CV and extract job-related information
export async function analyzeCVForJobSearch(cvText: string): Promise<CVAnalysisForJob> {
  console.log('🔍 Bắt đầu phân tích CV...');
  
  const analysis = getEnhancedAnalysis(cvText);
  
  console.log('✅ Phân tích CV thành công:', {
    skills: analysis.skills.length,
    level: analysis.currentLevel,
    field: analysis.mainField,
    matchScore: analysis.fieldMatchScore
  });
  
  return analysis;
}

// Enhanced analysis with better field detection
function getEnhancedAnalysis(cvText: string): CVAnalysisForJob {
  const text = cvText.toLowerCase();
  
  // Extract all skills from all fields
  const allSkills = new Set<string>();
  const skillMatches: { [key: string]: number } = {};
  const skillsWithLevels: { skill: string; level: 'beginner' | 'intermediate' | 'advanced' | 'expert' }[] = [];
  
  // Detect skills and count matches for each field
  Object.entries(IT_FIELDS).forEach(([field, config]) => {
    let matchCount = 0;
    
    // Check keywords
    config.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        matchCount += matches.length * 2; // Keywords have higher weight
      }
    });
    
    // Check skills
    config.skills.forEach(skill => {
      const normalizedSkill = skill.toLowerCase().replace(/[.\s]/g, '');
      const normalizedText = text.replace(/[.\s]/g, '');
      
      if (normalizedText.includes(normalizedSkill)) {
        allSkills.add(skill);
        matchCount += 1;
        
        // Try to determine skill level from context
        const skillLevel = inferSkillLevel(text, skill);
        skillsWithLevels.push({ skill, level: skillLevel });
      }
    });
    
    skillMatches[field] = matchCount * config.weight;
  });
  
  // Find best matching field
  let mainField = 'Software Developer';
  let maxScore = 0;
  let secondBestField = '';
  let secondMaxScore = 0;
  
  Object.entries(skillMatches).forEach(([field, score]) => {
    if (score > maxScore) {
      secondBestField = mainField;
      secondMaxScore = maxScore;
      mainField = field;
      maxScore = score;
    } else if (score > secondMaxScore) {
      secondBestField = field;
      secondMaxScore = score;
    }
  });
  
  // Check for Full Stack (if has both frontend and backend)
  const frontendScore = skillMatches['Frontend Developer'] || 0;
  const backendScore = skillMatches['Backend Developer'] || 0;
  
  if (frontendScore > 2 && backendScore > 2 && !text.includes('fullstack')) {
    mainField = 'Full Stack Developer';
    maxScore = frontendScore + backendScore;
  }
  
  // Calculate match confidence
  const fieldMatchScore = maxScore > 0 ? Math.min(Math.round((maxScore / 10) * 100), 100) : 50;
  
  // Extract years of experience
  let yearsOfExperience = 0;
  let hasExplicitLevel = false;
  
  // Check for explicit level keywords
  if (text.match(/\b(fresher|mới tốt nghiệp|fresh graduate|0[\s-]1\s+(?:years?|năm))\b/i)) {
    yearsOfExperience = 0;
    hasExplicitLevel = true;
  } else if (text.match(/\b(intern|thực tập|internship|student|đang học|sinh viên)\b/i)) {
    yearsOfExperience = 0;
    hasExplicitLevel = true;
  }
  
  if (!hasExplicitLevel) {
    // Multiple patterns to extract experience
    const patterns = [
      /(\d+)\+?\s*(?:years?|năm)\s*(?:of\s*)?(?:experience|kinh nghiệm)/i,
      /(?:with|over|more than)\s*(\d+)\+?\s*(?:years?|năm)/i,
      /(\d+)\+?\s*(?:years?|năm)\s*(?:in|as|working)/i
    ];
    
    patterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match) {
        yearsOfExperience = Math.max(yearsOfExperience, parseInt(match[1]));
      }
    });
    
    // Calculate from work history
    const hasWorkSection = text.match(/(?:work\s+experience|kinh nghiệm làm việc|professional\s+experience|employment\s+history)/i);
    
    if (hasWorkSection && yearsOfExperience === 0) {
      const dateRanges = text.match(/(\d{4})\s*[-–—]\s*(?:present|hiện tại|now|\d{4})/gi);
      if (dateRanges) {
        let totalYears = 0;
        const currentYear = new Date().getFullYear();
        
        dateRanges.forEach(range => {
          const match = range.match(/(\d{4})\s*[-–—]\s*(?:present|hiện tại|now|(\d{4}))/i);
          if (match) {
            const startYear = parseInt(match[1]);
            const endYear = match[2] ? parseInt(match[2]) : currentYear;
            const yearDiff = endYear - startYear;
            
            if (yearDiff > 0 && yearDiff <= 50 && startYear >= 1990) {
              totalYears += yearDiff;
            }
          }
        });
        
        yearsOfExperience = totalYears;
      }
    }
  }
  
  console.log('📊 Kinh nghiệm:', yearsOfExperience, 'năm');
  console.log('🎯 Lĩnh vực:', mainField, '(Độ khớp:', fieldMatchScore + '%)');
  
  // Determine level
  let currentLevel: JobLevel = 'fresher';
  let suggestedLevel: JobLevel[] = ['fresher', 'junior'];
  
  if (text.match(/\b(ceo|cto|vp|vice president|giám đốc|phó giám đốc)\b/i)) {
    currentLevel = 'director';
    suggestedLevel = ['director'];
  } else if (yearsOfExperience >= 10) {
    currentLevel = 'senior';
    suggestedLevel = ['senior', 'manager', 'director'];
  } else if (yearsOfExperience >= 7) {
    currentLevel = 'senior';
    suggestedLevel = ['senior', 'manager'];
  } else if (yearsOfExperience >= 5) {
    currentLevel = 'senior';
    suggestedLevel = ['middle', 'senior'];
  } else if (yearsOfExperience >= 3) {
    currentLevel = 'middle';
    suggestedLevel = ['middle', 'senior'];
  } else if (yearsOfExperience >= 1) {
    currentLevel = 'junior';
    suggestedLevel = ['junior', 'middle'];
  } else {
    if (text.match(/\b(student|đang học|sinh viên|university|trường)\b/i)) {
      currentLevel = 'intern';
      suggestedLevel = ['intern', 'fresher'];
    } else {
      currentLevel = 'fresher';
      suggestedLevel = ['fresher', 'junior'];
    }
  }
  
  // Enhanced location detection using locationService
  let location = 'Hồ Chí Minh';
  let detectedLocation: LocationInfo | undefined;
  
  const parsedLocation = parseLocationFromText(cvText);
  if (parsedLocation) {
    location = parsedLocation.city;
    detectedLocation = parsedLocation;
  }
  
  // Generate summary
  const levelName = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
  const summary = yearsOfExperience > 0 
    ? `${levelName} ${mainField} with ${yearsOfExperience}+ years of experience`
    : `${levelName} ${mainField}`;
  
  // Get market insights for the detected field
  const marketInsights = getFieldMarketInsights(mainField);
  
  // Get salary expectation based on field and level
  const salaryExpectation = getSalaryRangeForLevel(mainField, currentLevel);
  
  // Generate suggested keywords for job search
  const suggestedKeywords = generateSuggestedKeywords(mainField, Array.from(allSkills), currentLevel);
  
  // Identify strong points
  const strongPoints = identifyStrongPoints(skillsWithLevels, mainField);
  
  // Identify improvement areas
  const improvementAreas = identifyImprovementAreas(mainField, Array.from(allSkills), marketInsights);
  
  return {
    skills: Array.from(allSkills),
    yearsOfExperience,
    currentLevel,
    suggestedLevel,
    mainField,
    location,
    summary,
    fieldMatchScore,
    detectedLocation,
    skillsWithLevels,
    suggestedKeywords,
    marketInsights: marketInsights || undefined,
    salaryExpectation,
    strongPoints,
    improvementAreas
  };
}

// Infer skill level from context
function inferSkillLevel(text: string, skill: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  const skillLower = skill.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Check for explicit level mentions
  const expertPatterns = [
    new RegExp(`expert\\s+(?:in|with)?\\s*${skillLower}`, 'i'),
    new RegExp(`${skillLower}\\s*(?:expert|chuyên gia|thành thạo)`, 'i'),
    new RegExp(`advanced\\s+${skillLower}`, 'i')
  ];
  
  const advancedPatterns = [
    new RegExp(`proficient\\s+(?:in|with)?\\s*${skillLower}`, 'i'),
    new RegExp(`${skillLower}\\s*(?:proficient|khá tốt)`, 'i'),
    new RegExp(`strong\\s+${skillLower}`, 'i')
  ];
  
  const beginnerPatterns = [
    new RegExp(`basic\\s+${skillLower}`, 'i'),
    new RegExp(`${skillLower}\\s*(?:basic|cơ bản|learning)`, 'i'),
    new RegExp(`learning\\s+${skillLower}`, 'i')
  ];
  
  for (const pattern of expertPatterns) {
    if (pattern.test(textLower)) return 'expert';
  }
  
  for (const pattern of advancedPatterns) {
    if (pattern.test(textLower)) return 'advanced';
  }
  
  for (const pattern of beginnerPatterns) {
    if (pattern.test(textLower)) return 'beginner';
  }
  
  // Check frequency of skill mention (more mentions = higher level assumed)
  const regex = new RegExp(skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const matches = textLower.match(regex);
  const count = matches ? matches.length : 0;
  
  if (count >= 5) return 'advanced';
  if (count >= 3) return 'intermediate';
  
  return 'intermediate'; // Default to intermediate
}

// Generate suggested keywords for job search
function generateSuggestedKeywords(field: string, skills: string[], level: JobLevel): string[] {
  const keywords: string[] = [];
  
  // Add field name
  keywords.push(field);
  
  // Add level-specific keywords
  const levelKeywords: Record<JobLevel, string[]> = {
    intern: ['intern', 'thực tập', 'internship'],
    fresher: ['fresher', 'junior', 'entry level'],
    junior: ['junior', 'entry level'],
    middle: ['middle', 'mid-level'],
    senior: ['senior', 'lead'],
    manager: ['manager', 'team lead', 'engineering manager'],
    director: ['director', 'head of', 'principal']
  };
  keywords.push(...(levelKeywords[level] || []));
  
  // Add top skills (max 5)
  const topSkills = skills.slice(0, 5);
  keywords.push(...topSkills);
  
  // Remove duplicates
  return [...new Set(keywords)];
}

// Identify strong points from CV
function identifyStrongPoints(skillsWithLevels: { skill: string; level: string }[], field: string): string[] {
  const strongPoints: string[] = [];
  
  // Count advanced/expert skills
  const advancedSkills = skillsWithLevels.filter(s => 
    s.level === 'advanced' || s.level === 'expert'
  );
  
  if (advancedSkills.length > 0) {
    strongPoints.push(`Thành thạo ${advancedSkills.slice(0, 3).map(s => s.skill).join(', ')}`);
  }
  
  // Check for in-demand combinations
  const skills = skillsWithLevels.map(s => s.skill.toLowerCase());
  
  if (skills.includes('typescript') && skills.includes('react')) {
    strongPoints.push('Sử dụng TypeScript với React - Rất được ưa chuộng');
  }
  
  if (skills.includes('docker') && skills.includes('kubernetes')) {
    strongPoints.push('Kinh nghiệm containerization với Docker & K8s');
  }
  
  if (skills.includes('aws') || skills.includes('azure') || skills.includes('gcp')) {
    strongPoints.push('Có kinh nghiệm với Cloud platforms');
  }
  
  return strongPoints.slice(0, 4);
}

// Identify areas for improvement
function identifyImprovementAreas(field: string, currentSkills: string[], marketInsights: any): string[] {
  const improvements: string[] = [];
  
  if (!marketInsights) return improvements;
  
  const hotSkills = marketInsights.hotSkills || [];
  const currentSkillsLower = currentSkills.map(s => s.toLowerCase());
  
  // Find missing hot skills
  const missingHotSkills = hotSkills.filter((skill: string) => 
    !currentSkillsLower.some(cs => cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs))
  );
  
  if (missingHotSkills.length > 0) {
    improvements.push(`Nên học thêm: ${missingHotSkills.slice(0, 3).join(', ')}`);
  }
  
  // Field-specific suggestions
  if (field.includes('Frontend') && !currentSkillsLower.includes('typescript')) {
    improvements.push('TypeScript đang là yêu cầu bắt buộc cho nhiều vị trí Frontend');
  }
  
  if (field.includes('Backend') && !currentSkillsLower.some(s => ['aws', 'azure', 'gcp'].includes(s))) {
    improvements.push('Bổ sung kiến thức Cloud (AWS/Azure/GCP) để tăng cơ hội');
  }
  
  if (field.includes('DevOps') && !currentSkillsLower.includes('kubernetes')) {
    improvements.push('Kubernetes là skill cần thiết cho DevOps hiện nay');
  }
  
  return improvements.slice(0, 3);
}

// Helper function to get level display name
export function getLevelDisplayName(level: JobLevel): string {
  const displayNames: Record<JobLevel, string> = {
    intern: 'Intern',
    fresher: 'Fresher (0-1 năm)',
    junior: 'Junior (1-3 năm)',
    middle: 'Middle (3-5 năm)',
    senior: 'Senior (5+ năm)',
    manager: 'Manager (7+ năm)',
    director: 'Director (10+ năm)'
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
    manager: '7-12 years',
    director: '10+ years'
  };
  return ranges[level];
}

// Get all available IT fields
export function getAllITFields(): string[] {
  return Object.keys(IT_FIELDS);
}

// Get skills for a specific field
export function getFieldSkills(field: string): string[] {
  return IT_FIELDS[field]?.skills || [];
}

// Get field description
export function getFieldDescription(field: string): string {
  const descriptions: { [key: string]: string } = {
    'Frontend Developer': 'Chuyên về giao diện người dùng, xây dựng web applications với HTML, CSS, JavaScript và các frameworks hiện đại',
    'Backend Developer': 'Phát triển logic phía server, API, và quản lý cơ sở dữ liệu',
    'Full Stack Developer': 'Kết hợp cả Frontend và Backend, có khả năng phát triển ứng dụng hoàn chỉnh',
    'Mobile Developer': 'Phát triển ứng dụng di động cho iOS, Android hoặc cross-platform',
    'DevOps Engineer': 'Tự động hóa quy trình phát triển, triển khai và vận hành hệ thống',
    'Cloud Engineer': 'Thiết kế và quản lý hạ tầng đám mây trên AWS, Azure, GCP',
    'Data Scientist': 'Phân tích dữ liệu, xây dựng mô hình Machine Learning và AI',
    'Data Engineer': 'Xây dựng và duy trì data pipeline, ETL processes',
    'Security Engineer': 'Bảo mật hệ thống, phát hiện và ngăn chặn các mối đe dọa',
    'QA Engineer': 'Đảm bảo chất lượng phần mềm thông qua testing và automation'
  };
  
  return descriptions[field] || 'Chuyên gia công nghệ thông tin';
}