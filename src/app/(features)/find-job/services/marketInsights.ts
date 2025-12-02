import { FieldMarketInsights, SalaryRange, JobLevel } from '../types/job.types';

// Market insights for IT fields in Vietnam
const FIELD_MARKET_DATA: Record<string, FieldMarketInsights> = {
  'Frontend Developer': {
    field: 'Frontend Developer',
    demandLevel: 'very-high',
    trendDirection: 'rising',
    averageSalary: { min: 15000000, max: 45000000, currency: 'VND' },
    topCompanies: ['FPT Software', 'VNG', 'Tiki', 'Shopee', 'VinGroup', 'Grab'],
    hotSkills: ['React', 'TypeScript', 'Next.js', 'Vue 3', 'Tailwind CSS'],
    jobOpenings: '2,500+',
    competitionLevel: 'medium',
    tips: [
      'React và TypeScript là bắt buộc cho hầu hết các vị trí',
      'Có portfolio với dự án thực tế sẽ tăng cơ hội',
      'Kiến thức về responsive design và performance optimization rất được đánh giá cao'
    ]
  },
  'Backend Developer': {
    field: 'Backend Developer',
    demandLevel: 'very-high',
    trendDirection: 'stable',
    averageSalary: { min: 18000000, max: 55000000, currency: 'VND' },
    topCompanies: ['FPT Software', 'VNG', 'Tiki', 'MoMo', 'VNPay', 'Techcombank'],
    hotSkills: ['Node.js', 'Java Spring', 'Python', 'Microservices', 'PostgreSQL'],
    jobOpenings: '3,200+',
    competitionLevel: 'medium',
    tips: [
      'Kinh nghiệm với Microservices architecture rất quan trọng',
      'Database optimization và caching là kỹ năng được săn đón',
      'Cloud services (AWS/GCP) sẽ giúp bạn nổi bật'
    ]
  },
  'Full Stack Developer': {
    field: 'Full Stack Developer',
    demandLevel: 'very-high',
    trendDirection: 'rising',
    averageSalary: { min: 20000000, max: 60000000, currency: 'VND' },
    topCompanies: ['Shopee', 'Grab', 'Tiki', 'VNG', 'Axon', 'KMS Technology'],
    hotSkills: ['React', 'Node.js', 'TypeScript', 'Docker', 'AWS'],
    jobOpenings: '1,800+',
    competitionLevel: 'low',
    tips: [
      'Full Stack rất được ưa chuộng tại startup',
      'Khả năng tự làm việc độc lập là điểm cộng lớn',
      'DevOps skills sẽ giúp bạn trở thành ứng viên hoàn hảo'
    ]
  },
  'Mobile Developer': {
    field: 'Mobile Developer',
    demandLevel: 'high',
    trendDirection: 'stable',
    averageSalary: { min: 18000000, max: 50000000, currency: 'VND' },
    topCompanies: ['Grab', 'MoMo', 'Zalo', 'Tiki', 'VNG', 'Shopee'],
    hotSkills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
    jobOpenings: '1,200+',
    competitionLevel: 'medium',
    tips: [
      'React Native và Flutter đang rất hot',
      'Có app published trên Store sẽ rất ấn tượng',
      'Kiến thức về app performance và UX rất quan trọng'
    ]
  },
  'DevOps Engineer': {
    field: 'DevOps Engineer',
    demandLevel: 'very-high',
    trendDirection: 'rising',
    averageSalary: { min: 25000000, max: 70000000, currency: 'VND' },
    topCompanies: ['VNG', 'FPT', 'Viettel', 'Techcombank', 'VPBank', 'Masan'],
    hotSkills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD', 'Monitoring'],
    jobOpenings: '800+',
    competitionLevel: 'low',
    tips: [
      'Nhu cầu DevOps đang tăng rất nhanh, cạnh tranh thấp',
      'Chứng chỉ AWS/Azure sẽ tăng lương đáng kể',
      'Kỹ năng scripting (Python/Bash) là bắt buộc'
    ]
  },
  'Data Scientist': {
    field: 'Data Scientist',
    demandLevel: 'high',
    trendDirection: 'rising',
    averageSalary: { min: 25000000, max: 80000000, currency: 'VND' },
    topCompanies: ['Grab', 'Shopee', 'VNG', 'Tiki', 'FE Credit', 'Home Credit'],
    hotSkills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Data Visualization'],
    jobOpenings: '600+',
    competitionLevel: 'high',
    tips: [
      'Kinh nghiệm với real-world datasets rất quan trọng',
      'Kaggle profile sẽ là điểm cộng lớn',
      'Business acumen kết hợp với technical skills rất được đánh giá'
    ]
  },
  'Data Engineer': {
    field: 'Data Engineer',
    demandLevel: 'very-high',
    trendDirection: 'rising',
    averageSalary: { min: 22000000, max: 65000000, currency: 'VND' },
    topCompanies: ['Grab', 'Shopee', 'VNG', 'Tiki', 'VPBank', 'Techcombank'],
    hotSkills: ['Spark', 'Airflow', 'Kafka', 'Python', 'SQL', 'AWS'],
    jobOpenings: '500+',
    competitionLevel: 'low',
    tips: [
      'Data Engineering đang thiếu nhân lực trầm trọng',
      'Kinh nghiệm với Big Data tools rất được săn đón',
      'Cloud data services (Redshift, BigQuery) là điểm cộng lớn'
    ]
  },
  'AI/ML Engineer': {
    field: 'AI/ML Engineer',
    demandLevel: 'very-high',
    trendDirection: 'rising',
    averageSalary: { min: 30000000, max: 100000000, currency: 'VND' },
    topCompanies: ['VinAI', 'FPT.AI', 'Zalo AI', 'VNG', 'Grab', 'Shopee'],
    hotSkills: ['PyTorch', 'TensorFlow', 'LLM', 'Computer Vision', 'NLP', 'MLOps'],
    jobOpenings: '400+',
    competitionLevel: 'high',
    tips: [
      'AI/ML là field có mức lương cao nhất hiện tại',
      'Kinh nghiệm với LLM và Generative AI rất hot',
      'Research papers hoặc contributions sẽ rất nổi bật'
    ]
  },
  'QA Engineer': {
    field: 'QA Engineer',
    demandLevel: 'high',
    trendDirection: 'stable',
    averageSalary: { min: 12000000, max: 35000000, currency: 'VND' },
    topCompanies: ['FPT Software', 'KMS', 'NashTech', 'TMA', 'Enclave', 'Katalon'],
    hotSkills: ['Selenium', 'Cypress', 'API Testing', 'Performance Testing', 'Automation'],
    jobOpenings: '1,500+',
    competitionLevel: 'medium',
    tips: [
      'Automation testing skills sẽ tăng lương đáng kể',
      'ISTQB certification là điểm cộng',
      'Kinh nghiệm với CI/CD integration rất được đánh giá'
    ]
  },
  'Security Engineer': {
    field: 'Security Engineer',
    demandLevel: 'high',
    trendDirection: 'rising',
    averageSalary: { min: 25000000, max: 70000000, currency: 'VND' },
    topCompanies: ['Viettel Cyber', 'BKAV', 'CMC', 'VNG', 'Techcombank', 'VPBank'],
    hotSkills: ['Penetration Testing', 'SIEM', 'Cloud Security', 'Network Security'],
    jobOpenings: '350+',
    competitionLevel: 'low',
    tips: [
      'Security là field đang thiếu nhân lực nghiêm trọng',
      'Chứng chỉ CEH, OSCP rất có giá trị',
      'Kinh nghiệm với compliance (ISO 27001, PCI DSS) được ưu tiên'
    ]
  },
  'Cloud Engineer': {
    field: 'Cloud Engineer',
    demandLevel: 'very-high',
    trendDirection: 'rising',
    averageSalary: { min: 25000000, max: 65000000, currency: 'VND' },
    topCompanies: ['AWS Vietnam', 'Microsoft', 'FPT', 'VNG', 'Viettel', 'CMC'],
    hotSkills: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'Serverless'],
    jobOpenings: '600+',
    competitionLevel: 'low',
    tips: [
      'Chứng chỉ AWS/Azure Solutions Architect rất có giá trị',
      'Multi-cloud experience là điểm cộng lớn',
      'Infrastructure as Code là kỹ năng bắt buộc'
    ]
  },
  'UI/UX Designer': {
    field: 'UI/UX Designer',
    demandLevel: 'high',
    trendDirection: 'rising',
    averageSalary: { min: 15000000, max: 45000000, currency: 'VND' },
    topCompanies: ['Grab', 'Tiki', 'VNG', 'MoMo', 'Shopee', 'VinGroup'],
    hotSkills: ['Figma', 'Design System', 'Prototyping', 'User Research', 'Motion Design'],
    jobOpenings: '700+',
    competitionLevel: 'medium',
    tips: [
      'Portfolio với case studies chi tiết rất quan trọng',
      'Khả năng làm việc với developers sẽ được đánh giá cao',
      'Data-driven design approach là xu hướng'
    ]
  },
  'Software Developer': {
    field: 'Software Developer',
    demandLevel: 'very-high',
    trendDirection: 'stable',
    averageSalary: { min: 15000000, max: 50000000, currency: 'VND' },
    topCompanies: ['FPT', 'VNG', 'Tiki', 'Shopee', 'Grab', 'KMS'],
    hotSkills: ['Java', 'Python', 'JavaScript', 'SQL', 'Git'],
    jobOpenings: '5,000+',
    competitionLevel: 'medium',
    tips: [
      'Chọn một specialization để phát triển sâu',
      'Problem-solving skills quan trọng hơn số lượng ngôn ngữ',
      'Open source contributions sẽ giúp bạn nổi bật'
    ]
  },
  'Blockchain Developer': {
    field: 'Blockchain Developer',
    demandLevel: 'medium',
    trendDirection: 'stable',
    averageSalary: { min: 30000000, max: 80000000, currency: 'VND' },
    topCompanies: ['Kyber Network', 'Coin98', 'TomoChain', 'Axie Infinity', 'Sky Mavis'],
    hotSkills: ['Solidity', 'Web3.js', 'Smart Contracts', 'DeFi', 'NFT'],
    jobOpenings: '200+',
    competitionLevel: 'low',
    tips: [
      'Blockchain có mức lương cao nhưng thị trường biến động',
      'Kinh nghiệm với DeFi protocols rất được săn đón',
      'Security auditing skills rất quan trọng'
    ]
  },
  'Game Developer': {
    field: 'Game Developer',
    demandLevel: 'medium',
    trendDirection: 'stable',
    averageSalary: { min: 15000000, max: 45000000, currency: 'VND' },
    topCompanies: ['VNG Games', 'Garena', 'Amanotes', 'Hiker Games', 'Topebox'],
    hotSkills: ['Unity', 'Unreal Engine', 'C#', 'C++', '3D Graphics'],
    jobOpenings: '300+',
    competitionLevel: 'medium',
    tips: [
      'Portfolio với playable games rất quan trọng',
      'Mobile game development đang hot tại Việt Nam',
      'Kiến thức về game monetization sẽ là điểm cộng'
    ]
  }
};

// Salary by level (multiplier from base)
const LEVEL_SALARY_MULTIPLIERS: Record<JobLevel, { min: number; max: number }> = {
  intern: { min: 0.3, max: 0.5 },
  fresher: { min: 0.5, max: 0.7 },
  junior: { min: 0.7, max: 1.0 },
  middle: { min: 1.0, max: 1.4 },
  senior: { min: 1.4, max: 2.0 },
  manager: { min: 1.8, max: 2.8 },
  director: { min: 2.5, max: 4.0 }
};

// Get market insights for a field
export function getFieldMarketInsights(field: string): FieldMarketInsights | null {
  // Try exact match
  if (FIELD_MARKET_DATA[field]) {
    return FIELD_MARKET_DATA[field];
  }
  
  // Try partial match
  const lowerField = field.toLowerCase();
  for (const [key, value] of Object.entries(FIELD_MARKET_DATA)) {
    if (key.toLowerCase().includes(lowerField) || lowerField.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Return generic Software Developer insights as fallback
  return FIELD_MARKET_DATA['Software Developer'];
}

// Get salary range for field and level
export function getSalaryRangeForLevel(field: string, level: JobLevel): SalaryRange {
  const insights = getFieldMarketInsights(field);
  const baseSalary = insights?.averageSalary || { min: 15000000, max: 45000000, currency: 'VND' };
  const multiplier = LEVEL_SALARY_MULTIPLIERS[level];
  
  return {
    min: Math.round(baseSalary.min * multiplier.min),
    max: Math.round(baseSalary.max * multiplier.max),
    currency: baseSalary.currency
  };
}

// Format salary for display
export function formatSalary(salary: SalaryRange): string {
  const formatNumber = (n: number) => {
    if (n >= 1000000) {
      return `${(n / 1000000).toFixed(0)}M`;
    }
    return n.toLocaleString();
  };
  
  return `${formatNumber(salary.min)} - ${formatNumber(salary.max)} ${salary.currency}`;
}

// Get demand level color
export function getDemandLevelColor(level: string): string {
  switch (level) {
    case 'very-high': return 'text-green-400';
    case 'high': return 'text-blue-400';
    case 'medium': return 'text-yellow-400';
    case 'low': return 'text-red-400';
    default: return 'text-gray-400';
  }
}

// Get trend icon
export function getTrendIcon(trend: string): string {
  switch (trend) {
    case 'rising': return '📈';
    case 'stable': return '➡️';
    case 'declining': return '📉';
    default: return '➡️';
  }
}

// Get competition level description
export function getCompetitionDescription(level: string): string {
  switch (level) {
    case 'low': return 'Ít cạnh tranh - Cơ hội cao';
    case 'medium': return 'Cạnh tranh trung bình';
    case 'high': return 'Cạnh tranh cao - Cần nổi bật';
    default: return 'Cạnh tranh trung bình';
  }
}

// Generate smart search keywords based on field and level
export function generateSmartKeywords(field: string, level: JobLevel, skills: string[]): string[] {
  const keywords: string[] = [];
  
  // Base keyword
  keywords.push(field);
  
  // Level-specific keywords
  const levelKeywords: Record<JobLevel, string[]> = {
    intern: ['intern', 'thực tập', 'internship'],
    fresher: ['fresher', 'junior', 'entry level', 'mới tốt nghiệp'],
    junior: ['junior', 'entry level', '1-3 years'],
    middle: ['middle', 'mid-level', '3-5 years'],
    senior: ['senior', 'lead', '5+ years', 'expert'],
    manager: ['manager', 'team lead', 'engineering manager'],
    director: ['director', 'head of', 'VP', 'principal']
  };
  
  keywords.push(...(levelKeywords[level] || []));
  
  // Add top skills as keywords
  if (skills.length > 0) {
    keywords.push(...skills.slice(0, 3));
  }
  
  return [...new Set(keywords)]; // Remove duplicates
}
