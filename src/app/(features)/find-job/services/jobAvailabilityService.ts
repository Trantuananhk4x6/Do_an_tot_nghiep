import { JobSearchPlatform } from '../types/job.types';
import { vietnamJobPlatforms, internationalJobPlatforms } from './jobPlatforms';

export interface JobCheckResult {
  platformId: string;
  hasJobs: boolean;
  estimatedCount?: number;
  error?: string;
  searchUrl: string;
}

// Build search URL from template
export function buildSearchUrl(
  platform: JobSearchPlatform,
  keyword: string,
  location: string,
  level?: string
): string {
  let url = platform.searchUrlTemplate
    .replace(/{keyword}/g, encodeURIComponent(keyword))
    .replace(/{location}/g, encodeURIComponent(location))
    .replace(/{level}/g, encodeURIComponent(level || ''));
  
  return url;
}

// Get platforms sorted by priority with search URLs
export function getPlatformsWithUrls(
  keyword: string,
  location: string,
  level?: string
): (JobSearchPlatform & { searchUrl: string })[] {
  const allPlatforms = [...vietnamJobPlatforms, ...internationalJobPlatforms];
  
  return allPlatforms
    .map(platform => ({
      ...platform,
      searchUrl: buildSearchUrl(platform, keyword, location, level),
    }))
    .sort((a, b) => (a.priority || 5) - (b.priority || 5));
}

// Get Vietnam platforms only
export function getVietnamPlatformsWithUrls(
  keyword: string,
  location: string,
  level?: string
): (JobSearchPlatform & { searchUrl: string })[] {
  return vietnamJobPlatforms
    .map(platform => ({
      ...platform,
      searchUrl: buildSearchUrl(platform, keyword, location, level),
    }))
    .sort((a, b) => (a.priority || 5) - (b.priority || 5));
}

// Get international platforms only
export function getInternationalPlatformsWithUrls(
  keyword: string,
  location: string,
  level?: string
): (JobSearchPlatform & { searchUrl: string })[] {
  return internationalJobPlatforms
    .map(platform => ({
      ...platform,
      searchUrl: buildSearchUrl(platform, keyword, location, level),
    }))
    .sort((a, b) => (a.priority || 5) - (b.priority || 5));
}

// Filter platforms by field/keyword relevance
export function filterPlatformsByField(
  platforms: JobSearchPlatform[],
  field: string
): JobSearchPlatform[] {
  const fieldLower = field.toLowerCase();
  
  // IT-specific platforms
  const itPlatforms = ['itviec', 'topdev', 'stackoverflow', 'github', 'dice', 'turing', 'toptal'];
  const isITField = ['it', 'developer', 'software', 'web', 'mobile', 'frontend', 'backend', 'fullstack', 
    'devops', 'data', 'ai', 'machine learning', 'cyber', 'network', 'cloud'].some(
    term => fieldLower.includes(term)
  );
  
  // Remote-friendly platforms
  const remotePlatforms = ['remote', 'weworkremotely', 'flexjobs', 'turing', 'toptal'];
  
  // Freelance platforms
  const freelancePlatforms = ['upwork', 'freelancer', 'fiverr', 'toptal'];
  
  // Startup platforms
  const startupPlatforms = ['wellfound', 'builtin'];
  
  return platforms.map(platform => {
    let score = platform.priority || 3;
    
    // Boost IT platforms for IT fields
    if (isITField && itPlatforms.includes(platform.id)) {
      score -= 1;
    }
    
    // General platforms always relevant
    if (['topcv', 'vietnamworks', 'linkedin-global', 'indeed'].includes(platform.id)) {
      score -= 0.5;
    }
    
    return { ...platform, priority: Math.max(1, score) };
  }).sort((a, b) => (a.priority || 5) - (b.priority || 5));
}

// Get recommended platforms based on search criteria
export function getRecommendedPlatforms(
  keyword: string,
  location: string,
  level?: string,
  workType?: 'remote' | 'hybrid' | 'onsite' | 'any',
  field?: string
): (JobSearchPlatform & { searchUrl: string; recommended: boolean })[] {
  let platforms = [...vietnamJobPlatforms, ...internationalJobPlatforms];
  
  // Filter by field if provided
  if (field) {
    platforms = filterPlatformsByField(platforms, field);
  }
  
  // Mark remote-friendly platforms
  const remotePlatformIds = ['remote', 'weworkremotely', 'flexjobs', 'turing', 'toptal', 'upwork', 'freelancer'];
  
  return platforms
    .map(platform => ({
      ...platform,
      searchUrl: buildSearchUrl(platform, keyword, location, level),
      recommended: (platform.priority || 5) <= 2 || 
        (workType === 'remote' && remotePlatformIds.includes(platform.id)),
    }))
    .sort((a, b) => {
      // Recommended first, then by priority
      if (a.recommended !== b.recommended) {
        return a.recommended ? -1 : 1;
      }
      return (a.priority || 5) - (b.priority || 5);
    });
}

// Platform categories for grouping in UI
export interface PlatformCategory {
  id: string;
  name: string;
  nameVi: string;
  platforms: string[]; // Platform IDs
}

export const platformCategories: PlatformCategory[] = [
  {
    id: 'vietnam-major',
    name: 'Major Vietnam Platforms',
    nameVi: 'Nền tảng lớn tại Việt Nam',
    platforms: ['topcv', 'itviec', 'vietnamworks', 'topdev', 'careerbuilder', 'careerviet'],
  },
  {
    id: 'vietnam-other',
    name: 'Other Vietnam Platforms',
    nameVi: 'Nền tảng khác tại Việt Nam',
    platforms: ['glints', 'ybox', 'jobsgo', 'vieclam24h', 'mywork', 'timviecnhanh', 'job123', 'vieclam365', 'careerlink'],
  },
  {
    id: 'global-major',
    name: 'Global Platforms',
    nameVi: 'Nền tảng toàn cầu',
    platforms: ['linkedin-global', 'indeed', 'glassdoor', 'jobstreet', 'monster'],
  },
  {
    id: 'tech-focused',
    name: 'Tech-Focused Platforms',
    nameVi: 'Nền tảng chuyên IT',
    platforms: ['stackoverflow', 'github', 'dice', 'wellfound', 'builtin'],
  },
  {
    id: 'remote-work',
    name: 'Remote Work',
    nameVi: 'Làm việc từ xa',
    platforms: ['remote', 'weworkremotely', 'flexjobs', 'turing', 'toptal'],
  },
  {
    id: 'freelance',
    name: 'Freelance',
    nameVi: 'Freelance',
    platforms: ['upwork', 'freelancer', 'fiverr', 'toptal'],
  },
  {
    id: 'recruitment-agencies',
    name: 'Recruitment Agencies',
    nameVi: 'Công ty tuyển dụng',
    platforms: ['roberthalf', 'manpower', 'adecco', 'hays', 'michaelpage'],
  },
];

// Get platforms grouped by category
export function getPlatformsByCategory(
  keyword: string,
  location: string,
  level?: string
): { category: PlatformCategory; platforms: (JobSearchPlatform & { searchUrl: string })[] }[] {
  const allPlatforms = getPlatformsWithUrls(keyword, location, level);
  const platformMap = new Map(allPlatforms.map(p => [p.id, p]));
  
  return platformCategories
    .map(category => ({
      category,
      platforms: category.platforms
        .map(id => platformMap.get(id))
        .filter((p): p is (JobSearchPlatform & { searchUrl: string }) => p !== undefined),
    }))
    .filter(group => group.platforms.length > 0);
}
