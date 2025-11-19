import { JobSearchPlatform } from '../types/job.types';

// Vietnam Job Platforms
export const vietnamJobPlatforms: JobSearchPlatform[] = [
  {
    id: 'topcv',
    name: 'TopCV',
    country: 'Vietnam',
    url: 'https://www.topcv.vn',
    logo: '🇻🇳',
    description: 'Nền tảng tuyển dụng hàng đầu Việt Nam với hơn 200,000 việc làm',
    searchUrlTemplate: 'https://www.topcv.vn/tim-viec-lam-{keyword}?keyword={keyword}&location={location}&level={level}'
  },
  {
    id: 'itviec',
    name: 'ITviec',
    country: 'Vietnam',
    url: 'https://itviec.com',
    logo: '💻',
    description: 'Nền tảng tuyển dụng IT số 1 Việt Nam',
    searchUrlTemplate: 'https://itviec.com/it-jobs/{keyword}?level={level}&city={location}'
  },
  {
    id: 'topdev',
    name: 'TopDev',
    country: 'Vietnam',
    url: 'https://topdev.vn',
    logo: '👨‍💻',
    description: 'Cổng thông tin việc làm IT chuyên nghiệp',
    searchUrlTemplate: 'https://topdev.vn/viec-lam-it?keyword={keyword}&level={level}&location={location}'
  },
  {
    id: 'vietnamworks',
    name: 'VietnamWorks',
    country: 'Vietnam',
    url: 'https://www.vietnamworks.com',
    logo: '🏢',
    description: 'Website tuyển dụng uy tín với hơn 100,000 nhà tuyển dụng',
    searchUrlTemplate: 'https://www.vietnamworks.com/tim-viec-lam/{keyword}?level={level}&location={location}'
  },
  {
    id: 'ybox',
    name: 'Ybox',
    country: 'Vietnam',
    url: 'https://ybox.vn',
    logo: '📦',
    description: 'Nền tảng kết nối nhân tài công nghệ',
    searchUrlTemplate: 'https://ybox.vn/viec-lam?keyword={keyword}&level={level}&location={location}'
  },
  {
    id: 'glints',
    name: 'Glints',
    country: 'Vietnam',
    url: 'https://glints.com/vn',
    logo: '✨',
    description: 'Nền tảng tuyển dụng và phát triển sự nghiệp',
    searchUrlTemplate: 'https://glints.com/vn/opportunities/jobs/explore?keyword={keyword}&level={level}&location={location}'
  },
  {
    id: 'careerbuilder',
    name: 'CareerBuilder',
    country: 'Vietnam',
    url: 'https://www.careerbuilder.vn',
    logo: '🎯',
    description: 'Nền tảng tuyển dụng toàn cầu tại Việt Nam',
    searchUrlTemplate: 'https://www.careerbuilder.vn/viec-lam/{keyword}?level={level}&location={location}'
  },
  {
    id: 'careerviet',
    name: 'CareerViet',
    country: 'Vietnam',
    url: 'https://www.careerviet.vn',
    logo: '🌟',
    description: 'Website tìm việc làm trực tuyến hàng đầu',
    searchUrlTemplate: 'https://www.careerviet.vn/tim-viec-lam/{keyword}?level={level}&location={location}'
  },
  {
    id: 'timviecnhanh',
    name: 'Tìm Việc Nhanh',
    country: 'Vietnam',
    url: 'https://www.timviecnhanh.com',
    logo: '⚡',
    description: 'Website tìm việc làm nhanh chóng và hiệu quả',
    searchUrlTemplate: 'https://www.timviecnhanh.com/viec-lam/{keyword}?level={level}&location={location}'
  },
  {
    id: 'jobsgo',
    name: 'JobsGO',
    country: 'Vietnam',
    url: 'https://jobsgo.vn',
    logo: '🚀',
    description: 'Nền tảng việc làm trẻ và năng động',
    searchUrlTemplate: 'https://jobsgo.vn/viec-lam?keyword={keyword}&level={level}&location={location}'
  },
  {
    id: 'vieclam24h',
    name: 'ViecLam24h',
    country: 'Vietnam',
    url: 'https://vieclam24h.vn',
    logo: '🕐',
    description: 'Tìm việc làm 24/7 với hàng ngàn cơ hội',
    searchUrlTemplate: 'https://vieclam24h.vn/tim-kiem-viec-lam?keyword={keyword}&level={level}&location={location}'
  },
  {
    id: 'mywork',
    name: 'MyWork',
    country: 'Vietnam',
    url: 'https://mywork.com.vn',
    logo: '💼',
    description: 'Giải pháp tuyển dụng thông minh',
    searchUrlTemplate: 'https://mywork.com.vn/tim-viec-lam/{keyword}?level={level}&location={location}'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    country: 'Global',
    url: 'https://www.linkedin.com',
    logo: '🔗',
    description: 'Mạng xã hội nghề nghiệp toàn cầu',
    searchUrlTemplate: 'https://www.linkedin.com/jobs/search/?keywords={keyword}&location={location}&f_E={level}'
  }
];

// International Job Platforms (can be extended)
export const internationalJobPlatforms: JobSearchPlatform[] = [
  {
    id: 'linkedin-global',
    name: 'LinkedIn',
    country: 'Global',
    url: 'https://www.linkedin.com',
    logo: '💼',
    description: 'Global professional networking platform',
    searchUrlTemplate: 'https://www.linkedin.com/jobs/search/?keywords={keyword}&location={location}&f_E={level}'
  },
  {
    id: 'indeed',
    name: 'Indeed',
    country: 'Global',
    url: 'https://www.indeed.com',
    logo: '🌍',
    description: 'World\'s largest job search engine',
    searchUrlTemplate: 'https://www.indeed.com/jobs?q={keyword}&l={location}&explvl={level}'
  },
  {
    id: 'glassdoor',
    name: 'Glassdoor',
    country: 'Global',
    url: 'https://www.glassdoor.com',
    logo: '🔍',
    description: 'Job search with company reviews and salary insights',
    searchUrlTemplate: 'https://www.glassdoor.com/Job/jobs.htm?sc.keyword={keyword}&locT=C&locId={location}&seniorityType={level}'
  }
];

export function getPlatformsByCountry(country: string): JobSearchPlatform[] {
  switch (country.toLowerCase()) {
    case 'vietnam':
    case 'vn':
    case 'việt nam':
      return vietnamJobPlatforms;
    default:
      return internationalJobPlatforms;
  }
}

export function getAllPlatforms(): JobSearchPlatform[] {
  return [...vietnamJobPlatforms, ...internationalJobPlatforms];
}

export function getPlatformById(id: string): JobSearchPlatform | undefined {
  return getAllPlatforms().find(platform => platform.id === id);
}

// Helper to convert job level to platform-specific format
export function formatLevelForPlatform(level: string, platformId: string): string {
  const levelMap: Record<string, Record<string, string>> = {
    topcv: {
      intern: 'thuc-tap-sinh',
      fresher: 'moi-tot-nghiep',
      junior: 'nhan-vien',
      middle: 'truong-nhom',
      senior: 'truong-phong',
      manager: 'quan-ly',
      director: 'giam-doc'
    },
    itviec: {
      intern: 'intern',
      fresher: 'fresher',
      junior: 'junior',
      middle: 'middle',
      senior: 'senior',
      manager: 'manager',
      director: 'director'
    },
    topdev: {
      intern: 'intern',
      fresher: 'fresher',
      junior: 'junior',
      middle: 'middle',
      senior: 'senior',
      manager: 'manager',
      director: 'director'
    },
    vietnamworks: {
      intern: 'thuc-tap',
      fresher: 'moi-tot-nghiep',
      junior: 'nhan-vien',
      middle: 'truong-nhom',
      senior: 'chuyen-gia',
      manager: 'quan-ly',
      director: 'giam-doc'
    },
    ybox: {
      intern: 'intern',
      fresher: 'fresher',
      junior: 'junior',
      middle: 'middle',
      senior: 'senior',
      manager: 'manager',
      director: 'director'
    },
    glints: {
      intern: 'INTERNSHIP',
      fresher: 'ENTRY_LEVEL',
      junior: 'ENTRY_LEVEL',
      middle: 'MID_SENIOR_LEVEL',
      senior: 'MID_SENIOR_LEVEL',
      manager: 'MANAGER',
      director: 'DIRECTOR'
    },
    careerbuilder: {
      intern: 'thuc-tap',
      fresher: 'moi-tot-nghiep',
      junior: 'nhan-vien',
      middle: 'quan-ly-cap-trung',
      senior: 'chuyen-gia',
      manager: 'quan-ly',
      director: 'giam-doc'
    },
    careerviet: {
      intern: 'thuc-tap-sinh',
      fresher: 'moi-tot-nghiep',
      junior: 'nhan-vien',
      middle: 'truong-nhom',
      senior: 'chuyen-vien-cap-cao',
      manager: 'quan-ly',
      director: 'giam-doc'
    },
    timviecnhanh: {
      intern: 'thuc-tap',
      fresher: 'fresher',
      junior: 'nhan-vien',
      middle: 'truong-nhom',
      senior: 'senior',
      manager: 'quan-ly',
      director: 'giam-doc'
    },
    jobsgo: {
      intern: 'intern',
      fresher: 'fresher',
      junior: 'junior',
      middle: 'middle',
      senior: 'senior',
      manager: 'manager',
      director: 'director'
    },
    vieclam24h: {
      intern: 'thuc-tap',
      fresher: 'moi-tot-nghiep',
      junior: 'nhan-vien',
      middle: 'truong-nhom',
      senior: 'chuyen-gia',
      manager: 'quan-ly',
      director: 'giam-doc'
    },
    mywork: {
      intern: 'intern',
      fresher: 'fresher',
      junior: 'junior',
      middle: 'middle',
      senior: 'senior',
      manager: 'manager',
      director: 'director'
    },
    linkedin: {
      intern: '1',
      fresher: '2',
      junior: '3',
      middle: '4',
      senior: '5',
      manager: '6',
      director: '7'
    },
    indeed: {
      intern: 'entry_level',
      fresher: 'entry_level',
      junior: 'mid_level',
      middle: 'mid_level',
      senior: 'senior_level',
      manager: 'senior_level',
      director: 'senior_level'
    },
    glassdoor: {
      intern: 'INTERNSHIP',
      fresher: 'ENTRY_LEVEL',
      junior: 'MID_LEVEL',
      middle: 'MID_LEVEL',
      senior: 'SENIOR_LEVEL',
      manager: 'MANAGER',
      director: 'EXECUTIVE'
    }
  };

  return levelMap[platformId]?.[level] || level;
}
