import { CareerField, ExperienceLevel } from "../types/quiz.types";
import { CAREER_FIELDS } from "../data/careerFields";

interface CVAnalysisResult {
  detectedSkills: string[];
  experienceYears: number;
  educationLevel: string;
  matchedFields: FieldMatchResult[];
  suggestedLevel: ExperienceLevel;
}

interface FieldMatchResult {
  field: CareerField;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

// Skill synonyms and related terms mapping
const SKILL_ALIASES: Record<string, string[]> = {
  // Frontend
  'javascript': ['js', 'ecmascript', 'es6', 'es2015', 'vanilla js'],
  'typescript': ['ts', 'tsc'],
  'react': ['reactjs', 'react.js', 'react native'],
  'vue': ['vuejs', 'vue.js', 'vue3', 'vue2'],
  'angular': ['angularjs', 'angular.js', 'ng'],
  'html': ['html5', 'html4'],
  'css': ['css3', 'scss', 'sass', 'less', 'stylus'],
  'tailwind': ['tailwindcss', 'tailwind css'],
  'nextjs': ['next.js', 'next js', 'next'],
  'webpack': ['webpack5', 'bundler'],
  
  // Backend
  'nodejs': ['node.js', 'node', 'express', 'expressjs', 'nestjs', 'nest.js'],
  'python': ['python3', 'python2', 'py'],
  'java': ['java8', 'java11', 'java17', 'jdk', 'jre'],
  'spring': ['spring boot', 'springboot', 'spring framework'],
  'csharp': ['c#', '.net', 'dotnet', 'asp.net', 'aspnet'],
  'golang': ['go', 'go lang', 'golang'],
  'rust': ['rustlang'],
  'php': ['php7', 'php8', 'laravel', 'symfony'],
  'ruby': ['ruby on rails', 'rails', 'ror'],
  
  // Database
  'mysql': ['mariadb'],
  'postgresql': ['postgres', 'psql'],
  'mongodb': ['mongo', 'mongoose'],
  'redis': ['redis cache'],
  'sqlite': ['sqlite3'],
  'oracle': ['oracle db', 'oracledb'],
  
  // DevOps
  'docker': ['dockerfile', 'docker-compose', 'containerization'],
  'kubernetes': ['k8s', 'k3s', 'eks', 'aks', 'gke'],
  'aws': ['amazon web services', 'ec2', 's3', 'lambda', 'cloudformation'],
  'azure': ['microsoft azure', 'azure devops'],
  'gcp': ['google cloud', 'google cloud platform'],
  'terraform': ['tf', 'iac'],
  'ansible': ['ansible playbook'],
  'jenkins': ['jenkins ci', 'jenkins pipeline'],
  'gitlab': ['gitlab ci', 'gitlab-ci'],
  'github': ['github actions'],
  
  // Data
  'sql': ['t-sql', 'plsql', 'pl/sql'],
  'pandas': ['numpy', 'scipy'],
  'tensorflow': ['tf', 'keras'],
  'pytorch': ['torch'],
  'spark': ['apache spark', 'pyspark'],
  'hadoop': ['hdfs', 'mapreduce'],
  'tableau': ['power bi', 'powerbi', 'looker'],
  
  // Mobile
  'react native': ['rn', 'react-native'],
  'flutter': ['dart'],
  'swift': ['swiftui', 'ios development'],
  'kotlin': ['kotlin android'],
  'android': ['android studio', 'android sdk'],
  'ios': ['xcode', 'objective-c', 'objc'],
  
  // Testing
  'jest': ['testing-library', 'react testing library'],
  'cypress': ['e2e testing', 'end-to-end'],
  'selenium': ['webdriver'],
  'junit': ['testng', 'mockito'],
  
  // Security
  'security': ['cybersecurity', 'infosec', 'information security'],
  'penetration testing': ['pentest', 'pentesting', 'ethical hacking'],
  'owasp': ['security testing'],
  
  // AI/ML
  'machine learning': ['ml', 'deep learning', 'dl', 'neural networks'],
  'nlp': ['natural language processing', 'text processing'],
  'computer vision': ['cv', 'image processing'],
  'llm': ['large language model', 'gpt', 'claude', 'llama'],
  
  // Design
  'figma': ['sketch', 'adobe xd'],
  'ui design': ['ux design', 'ui/ux', 'user interface'],
  'photoshop': ['illustrator', 'adobe creative'],
  
  // Project Management
  'agile': ['scrum', 'kanban'],
  'jira': ['trello', 'asana', 'monday'],
  'pm': ['project management', 'product management']
};

// Define frontend and backend skill categories for Full Stack validation
const FRONTEND_SKILLS = [
  'javascript', 'typescript', 'react', 'vue', 'angular', 'html', 'css',
  'tailwind', 'nextjs', 'webpack', 'sass', 'scss', 'less', 'jquery',
  'bootstrap', 'material ui', 'ant design', 'chakra ui', 'svelte',
  'nuxt', 'gatsby', 'redux', 'zustand', 'mobx', 'vite'
];

const BACKEND_SKILLS = [
  'nodejs', 'python', 'java', 'spring', 'csharp', 'golang', 'rust',
  'php', 'ruby', 'django', 'flask', 'fastapi', 'express', 'nestjs',
  'laravel', 'rails', 'asp.net', 'graphql', 'rest api', 'grpc',
  'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle',
  'sql server', 'elasticsearch', 'kafka', 'rabbitmq'
];

// Normalize skill text for matching
function normalizeSkill(skill: string): string {
  return skill.toLowerCase().trim()
    .replace(/[.,;:!?()[\]{}'"]/g, '')
    .replace(/\s+/g, ' ');
}

// Find canonical skill name from aliases
function findCanonicalSkill(skill: string): string {
  const normalized = normalizeSkill(skill);
  
  // Direct match
  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    if (canonical === normalized || aliases.includes(normalized)) {
      return canonical;
    }
  }
  
  return normalized;
}

// Check if skills include both frontend and backend (required for Full Stack)
function validateFullStackSkills(cvSkills: string[]): {
  hasFrontend: boolean;
  hasBackend: boolean;
  frontendSkills: string[];
  backendSkills: string[];
} {
  const normalizedSkills = cvSkills.map(s => normalizeSkill(s));
  
  const frontendSkills: string[] = [];
  const backendSkills: string[] = [];
  
  for (const skill of normalizedSkills) {
    const canonical = findCanonicalSkill(skill);
    
    // Check frontend
    if (FRONTEND_SKILLS.some(fs => canonical.includes(fs) || fs.includes(canonical))) {
      frontendSkills.push(skill);
    }
    
    // Check backend
    if (BACKEND_SKILLS.some(bs => canonical.includes(bs) || bs.includes(canonical))) {
      backendSkills.push(skill);
    }
  }
  
  return {
    hasFrontend: frontendSkills.length > 0,
    hasBackend: backendSkills.length > 0,
    frontendSkills,
    backendSkills
  };
}

// Calculate match score between CV skills and field skills
function calculateFieldMatch(
  cvSkills: string[],
  field: CareerField
): FieldMatchResult {
  const normalizedCVSkills = cvSkills.map(findCanonicalSkill);
  const allFieldSkills = [...field.requiredSkills, ...field.niceToHaveSkills];
  const fieldSkills = allFieldSkills.map(s => normalizeSkill(s));
  
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  
  for (const fieldSkill of fieldSkills) {
    const canonicalFieldSkill = findCanonicalSkill(fieldSkill);
    
    // Check if CV has this skill or any alias
    const hasSkill = normalizedCVSkills.some(cvSkill => {
      if (cvSkill === canonicalFieldSkill) return true;
      
      // Check aliases
      const aliases = SKILL_ALIASES[canonicalFieldSkill] || [];
      if (aliases.includes(cvSkill)) return true;
      
      // Partial match for compound skills
      if (cvSkill.includes(canonicalFieldSkill) || canonicalFieldSkill.includes(cvSkill)) {
        return cvSkill.length > 2 && canonicalFieldSkill.length > 2;
      }
      
      return false;
    });
    
    if (hasSkill) {
      matchedSkills.push(fieldSkill);
    } else {
      missingSkills.push(fieldSkill);
    }
  }
  
  // Calculate score (weighted: matched skills / total skills, with bonus for core skills)
  const coreSkillsCount = Math.min(5, fieldSkills.length);
  const coreMatchedCount = matchedSkills.filter((_, i) => i < coreSkillsCount).length;
  const coreBonus = (coreMatchedCount / coreSkillsCount) * 20; // Up to 20% bonus for core skills
  
  let baseScore = (matchedSkills.length / fieldSkills.length) * 80;
  
  // Special validation for Full Stack: must have both frontend AND backend skills
  const isFullStack = field.id === 'fullstack' || 
                      field.name.toLowerCase().includes('full stack') ||
                      field.name.toLowerCase().includes('fullstack');
  
  if (isFullStack) {
    const fullStackValidation = validateFullStackSkills(cvSkills);
    
    if (!fullStackValidation.hasFrontend || !fullStackValidation.hasBackend) {
      // Penalize score significantly if missing frontend or backend
      baseScore = baseScore * 0.4; // Reduce to 40% of original score
      
      // Add missing category to missingSkills
      if (!fullStackValidation.hasFrontend) {
        missingSkills.unshift('Frontend skills (React/Vue/Angular/HTML/CSS)');
      }
      if (!fullStackValidation.hasBackend) {
        missingSkills.unshift('Backend skills (Node.js/Python/Java/etc)');
      }
    } else {
      // Bonus for having both frontend and backend
      baseScore = Math.min(100, baseScore * 1.1); // 10% bonus
    }
  }
  
  const matchScore = Math.min(100, Math.round(baseScore + coreBonus));
  
  return {
    field,
    matchScore,
    matchedSkills,
    missingSkills
  };
}

// Suggest experience level based on years and skill depth
function suggestLevel(yearsOfExperience: number, skillCount: number): ExperienceLevel {
  if (yearsOfExperience >= 12 || (yearsOfExperience >= 10 && skillCount >= 20)) {
    return 'expert';
  }
  if (yearsOfExperience >= 8 || (yearsOfExperience >= 5 && skillCount >= 15)) {
    return 'lead';
  }
  if (yearsOfExperience >= 5 || (yearsOfExperience >= 3 && skillCount >= 12)) {
    return 'senior';
  }
  if (yearsOfExperience >= 2 || skillCount >= 8) {
    return 'mid';
  }
  if (yearsOfExperience >= 1 || skillCount >= 5) {
    return 'junior';
  }
  if (yearsOfExperience > 0 || skillCount >= 3) {
    return 'fresher';
  }
  return 'intern';
}

// Extract years of experience from CV text
function extractExperienceYears(cvText: string): number {
  const patterns = [
    /(\d+)\+?\s*(?:years?|năm)\s*(?:of\s*)?(?:experience|kinh nghiệm)/i,
    /(?:experience|kinh nghiệm)[:\s]*(\d+)\+?\s*(?:years?|năm)/i,
    /(\d{4})\s*[-–]\s*(?:present|hiện tại|nay)/i, // Date range to present
    /(?:since|từ)\s*(\d{4})/i
  ];
  
  for (const pattern of patterns) {
    const match = cvText.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      // If it's a year (e.g., 2020), calculate years
      if (value > 1990 && value <= new Date().getFullYear()) {
        return new Date().getFullYear() - value;
      }
      return value;
    }
  }
  
  // Try to count distinct companies/positions
  const positionPatterns = /(?:developer|engineer|manager|lead|designer|analyst|specialist|intern)/gi;
  const positions = cvText.match(positionPatterns);
  if (positions && positions.length > 0) {
    return Math.min(positions.length * 1.5, 10); // Estimate
  }
  
  return 0;
}

// Extract education level from CV text
function extractEducationLevel(cvText: string): string {
  const educationPatterns = [
    { pattern: /(?:ph\.?d|doctor|tiến sĩ)/i, level: 'PhD' },
    { pattern: /(?:master|m\.?s\.?|thạc sĩ)/i, level: 'Master' },
    { pattern: /(?:bachelor|b\.?s\.?|b\.?a\.?|cử nhân|đại học)/i, level: 'Bachelor' },
    { pattern: /(?:associate|cao đẳng)/i, level: 'Associate' },
    { pattern: /(?:diploma|chứng chỉ)/i, level: 'Diploma' },
    { pattern: /(?:bootcamp|self-taught|tự học)/i, level: 'Self-taught' }
  ];
  
  for (const { pattern, level } of educationPatterns) {
    if (pattern.test(cvText)) {
      return level;
    }
  }
  
  return 'Unknown';
}

// Main analysis function
export async function analyzeCV(cvText: string): Promise<CVAnalysisResult> {
  // Extract skills from CV text
  const detectedSkills = extractSkillsFromText(cvText);
  
  // Extract experience years
  const experienceYears = extractExperienceYears(cvText);
  
  // Extract education level
  const educationLevel = extractEducationLevel(cvText);
  
  // Calculate match scores for all fields
  const matchedFields = CAREER_FIELDS
    .map(field => calculateFieldMatch(detectedSkills, field))
    .sort((a, b) => b.matchScore - a.matchScore);
  
  // Suggest level based on experience
  const suggestedLevel = suggestLevel(experienceYears, detectedSkills.length);
  
  return {
    detectedSkills,
    experienceYears,
    educationLevel,
    matchedFields,
    suggestedLevel
  };
}

// Extract skills from text using keyword matching and NLP patterns
function extractSkillsFromText(text: string): string[] {
  const allSkills = new Set<string>();
  const normalizedText = text.toLowerCase();
  
  // Check for all known skills and their aliases
  for (const [skill, aliases] of Object.entries(SKILL_ALIASES)) {
    if (normalizedText.includes(skill)) {
      allSkills.add(skill);
    }
    for (const alias of aliases) {
      if (normalizedText.includes(alias)) {
        allSkills.add(skill);
        break;
      }
    }
  }
  
  // Also extract from career field skills
  for (const field of CAREER_FIELDS) {
    for (const skill of [...field.requiredSkills, ...field.niceToHaveSkills]) {
      const normalizedSkill = normalizeSkill(skill);
      if (normalizedText.includes(normalizedSkill)) {
        allSkills.add(normalizedSkill);
      }
    }
  }
  
  // Extract technical terms using common patterns
  const techPatterns = [
    // Programming languages
    /\b(python|java|javascript|typescript|c\+\+|c#|ruby|golang|rust|swift|kotlin|php|scala|perl|r)\b/gi,
    // Frameworks
    /\b(react|angular|vue|django|flask|spring|express|laravel|rails|nextjs|nuxt)\b/gi,
    // Databases
    /\b(mysql|postgresql|mongodb|redis|elasticsearch|oracle|sqlite|cassandra|dynamodb)\b/gi,
    // Cloud & DevOps
    /\b(aws|azure|gcp|docker|kubernetes|terraform|ansible|jenkins|gitlab|github)\b/gi,
    // Tools
    /\b(git|linux|nginx|apache|graphql|rest|api|microservices)\b/gi
  ];
  
  for (const pattern of techPatterns) {
    const matches = normalizedText.match(pattern);
    if (matches) {
      matches.forEach(match => allSkills.add(match.toLowerCase()));
    }
  }
  
  return Array.from(allSkills);
}

// Get recommended fields based on CV analysis
export function getRecommendedFields(
  analysisResult: CVAnalysisResult,
  limit: number = 5
): FieldMatchResult[] {
  return analysisResult.matchedFields
    .filter(m => m.matchScore >= 20) // At least 20% match
    .slice(0, limit);
}

// Get skill gaps for a specific field
export function getSkillGaps(
  analysisResult: CVAnalysisResult,
  fieldId: string
): { missing: string[]; score: number } {
  const fieldMatch = analysisResult.matchedFields.find(
    m => m.field.id === fieldId
  );
  
  if (!fieldMatch) {
    return { missing: [], score: 0 };
  }
  
  return {
    missing: fieldMatch.missingSkills,
    score: fieldMatch.matchScore
  };
}

export type { CVAnalysisResult, FieldMatchResult };
