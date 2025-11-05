import { QuizCategory } from "@/data/quiz-questions";

// Map từ QuizCategory sang tên nghề nghiệp
export const CATEGORY_TO_JOB_TITLE: Record<QuizCategory, {
  vi: string;
  en: string;
  ja: string;
  zh: string;
  ko: string;
}> = {
  // Programming & Development
  'javascript': {
    vi: 'Lập trình viên JavaScript',
    en: 'JavaScript Developer',
    ja: 'JavaScript開発者',
    zh: 'JavaScript开发工程师',
    ko: 'JavaScript 개발자'
  },
  'typescript': {
    vi: 'Lập trình viên TypeScript',
    en: 'TypeScript Developer',
    ja: 'TypeScript開発者',
    zh: 'TypeScript开发工程师',
    ko: 'TypeScript 개발자'
  },
  'react': {
    vi: 'Lập trình viên React',
    en: 'React Developer',
    ja: 'React開発者',
    zh: 'React开发工程师',
    ko: 'React 개발자'
  },
  'nodejs': {
    vi: 'Lập trình viên Node.js',
    en: 'Node.js Developer',
    ja: 'Node.js開発者',
    zh: 'Node.js开发工程师',
    ko: 'Node.js 개발자'
  },
  'python': {
    vi: 'Lập trình viên Python',
    en: 'Python Developer',
    ja: 'Python開発者',
    zh: 'Python开发工程师',
    ko: 'Python 개발자'
  },
  'java': {
    vi: 'Lập trình viên Java',
    en: 'Java Developer',
    ja: 'Java開発者',
    zh: 'Java开发工程师',
    ko: 'Java 개발자'
  },
  'frontend': {
    vi: 'Lập trình viên Front-end',
    en: 'Frontend Developer',
    ja: 'フロントエンド開発者',
    zh: '前端开发工程师',
    ko: '프론트엔드 개발자'
  },
  'mobile-dev': {
    vi: 'Lập trình viên Di động',
    en: 'Mobile Developer',
    ja: 'モバイル開発者',
    zh: '移动开发工程师',
    ko: '모바일 개발자'
  },
  'game-dev': {
    vi: 'Lập trình viên Game',
    en: 'Game Developer',
    ja: 'ゲーム開発者',
    zh: '游戏开发工程师',
    ko: '게임 개발자'
  },
  'embedded': {
    vi: 'Kỹ sư Phần mềm Nhúng',
    en: 'Embedded Software Engineer',
    ja: '組み込みソフトウェアエンジニア',
    zh: '嵌入式软件工程师',
    ko: '임베디드 소프트웨어 엔지니어'
  },

  // Infrastructure & Cloud
  'system-admin': {
    vi: 'Quản trị Hệ thống',
    en: 'System Administrator',
    ja: 'システム管理者',
    zh: '系统管理员',
    ko: '시스템 관리자'
  },
  'network': {
    vi: 'Kỹ sư Mạng',
    en: 'Network Engineer',
    ja: 'ネットワークエンジニア',
    zh: '网络工程师',
    ko: '네트워크 엔지니어'
  },
  'cloud': {
    vi: 'Kỹ sư Điện toán Đám mây',
    en: 'Cloud Engineer',
    ja: 'クラウドエンジニア',
    zh: '云计算工程师',
    ko: '클라우드 엔지니어'
  },
  'infrastructure': {
    vi: 'Kỹ sư Hạ tầng',
    en: 'Infrastructure Engineer',
    ja: 'インフラエンジニア',
    zh: '基础设施工程师',
    ko: '인프라 엔지니어'
  },
  'devops': {
    vi: 'Kỹ sư DevOps',
    en: 'DevOps Engineer',
    ja: 'DevOpsエンジニア',
    zh: 'DevOps工程师',
    ko: 'DevOps 엔지니어'
  },
  'sre': {
    vi: 'Kỹ sư Độ tin cậy Hệ thống (SRE)',
    en: 'Site Reliability Engineer',
    ja: 'サイト信頼性エンジニア',
    zh: '站点可靠性工程师',
    ko: '사이트 신뢰성 엔지니어'
  },

  // Cybersecurity
  'cybersecurity': {
    vi: 'Chuyên gia An ninh Mạng',
    en: 'Cybersecurity Analyst',
    ja: 'サイバーセキュリティアナリスト',
    zh: '网络安全分析师',
    ko: '사이버 보안 분석가'
  },
  'penetration-testing': {
    vi: 'Chuyên gia Kiểm thử Xâm nhập',
    en: 'Penetration Tester',
    ja: 'ペネトレーションテスター',
    zh: '渗透测试工程师',
    ko: '침투 테스터'
  },
  'security-engineering': {
    vi: 'Kỹ sư Bảo mật',
    en: 'Security Engineer',
    ja: 'セキュリティエンジニア',
    zh: '安全工程师',
    ko: '보안 엔지니어'
  },
  'forensics': {
    vi: 'Chuyên gia Điều tra Số',
    en: 'Digital Forensics Analyst',
    ja: 'デジタルフォレンジックアナリスト',
    zh: '数字取证分析师',
    ko: '디지털 포렌식 분석가'
  },

  // Data & AI
  'database': {
    vi: 'Quản trị Cơ sở Dữ liệu',
    en: 'Database Administrator',
    ja: 'データベース管理者',
    zh: '数据库管理员',
    ko: '데이터베이스 관리자'
  },
  'data-analysis': {
    vi: 'Chuyên viên Phân tích Dữ liệu',
    en: 'Data Analyst',
    ja: 'データアナリスト',
    zh: '数据分析师',
    ko: '데이터 분석가'
  },
  'data-science': {
    vi: 'Nhà Khoa học Dữ liệu',
    en: 'Data Scientist',
    ja: 'データサイエンティスト',
    zh: '数据科学家',
    ko: '데이터 과학자'
  },
  'data-engineering': {
    vi: 'Kỹ sư Dữ liệu',
    en: 'Data Engineer',
    ja: 'データエンジニア',
    zh: '数据工程师',
    ko: '데이터 엔지니어'
  },
  'machine-learning': {
    vi: 'Kỹ sư Học máy',
    en: 'Machine Learning Engineer',
    ja: '機械学習エンジニア',
    zh: '机器学习工程师',
    ko: '머신러닝 엔지니어'
  },
  'ai-engineering': {
    vi: 'Kỹ sư Trí tuệ Nhân tạo',
    en: 'AI Engineer',
    ja: 'AIエンジニア',
    zh: 'AI工程师',
    ko: 'AI 엔지니어'
  },

  // Design & UX
  'ui-ux-design': {
    vi: 'Thiết kế UI/UX',
    en: 'UI/UX Designer',
    ja: 'UI/UXデザイナー',
    zh: 'UI/UX设计师',
    ko: 'UI/UX 디자이너'
  },
  'web-design': {
    vi: 'Thiết kế Web',
    en: 'Web Designer',
    ja: 'Webデザイナー',
    zh: 'Web设计师',
    ko: '웹 디자이너'
  },
  'product-design': {
    vi: 'Thiết kế Sản phẩm',
    en: 'Product Designer',
    ja: 'プロダクトデザイナー',
    zh: '产品设计师',
    ko: '프로덕트 디자이너'
  },

  // Management
  'project-management': {
    vi: 'Quản lý Dự án',
    en: 'Project Manager',
    ja: 'プロジェクトマネージャー',
    zh: '项目经理',
    ko: '프로젝트 매니저'
  },
  'product-management': {
    vi: 'Quản lý Sản phẩm',
    en: 'Product Manager',
    ja: 'プロダクトマネージャー',
    zh: '产品经理',
    ko: '프로덕트 매니저'
  },
  'agile-scrum': {
    vi: 'Scrum Master',
    en: 'Scrum Master',
    ja: 'スクラムマスター',
    zh: 'Scrum Master',
    ko: '스크럼 마스터'
  },
  'business-analysis': {
    vi: 'Phân tích Nghiệp vụ',
    en: 'Business Analyst',
    ja: 'ビジネスアナリスト',
    zh: '业务分析师',
    ko: '비즈니스 분석가'
  },

  // Testing & QA
  'qa-testing': {
    vi: 'Kỹ sư Kiểm thử QA',
    en: 'QA Engineer',
    ja: 'QAエンジニア',
    zh: 'QA工程师',
    ko: 'QA 엔지니어'
  },
  'automation-testing': {
    vi: 'Kỹ sư Kiểm thử Tự động',
    en: 'Automation Test Engineer',
    ja: '自動化テストエンジニア',
    zh: '自动化测试工程师',
    ko: '자동화 테스트 엔지니어'
  },
  'test-management': {
    vi: 'Quản lý Kiểm thử',
    en: 'Test Manager',
    ja: 'テストマネージャー',
    zh: '测试经理',
    ko: '테스트 매니저'
  },

  // Support
  'it-support': {
    vi: 'Hỗ trợ CNTT',
    en: 'IT Support',
    ja: 'ITサポート',
    zh: 'IT支持',
    ko: 'IT 지원'
  },
  'technical-support': {
    vi: 'Hỗ trợ Kỹ thuật',
    en: 'Technical Support Engineer',
    ja: 'テクニカルサポートエンジニア',
    zh: '技术支持工程师',
    ko: '기술 지원 엔지니어'
  },

  // Research & Advanced
  'algorithms': {
    vi: 'Kỹ sư Thuật toán',
    en: 'Algorithm Engineer',
    ja: 'アルゴリズムエンジニア',
    zh: '算法工程师',
    ko: '알고리즘 엔지니어'
  },
  'system-design': {
    vi: 'Kiến trúc sư Phần mềm',
    en: 'Software Architect',
    ja: 'ソフトウェアアーキテクト',
    zh: '软件架构师',
    ko: '소프트웨어 아키텍트'
  },
  'computer-vision': {
    vi: 'Kỹ sư Thị giác Máy tính',
    en: 'Computer Vision Engineer',
    ja: 'コンピュータービジョンエンジニア',
    zh: '计算机视觉工程师',
    ko: '컴퓨터 비전 엔지니어'
  },
  'nlp': {
    vi: 'Kỹ sư Xử lý Ngôn ngữ Tự nhiên',
    en: 'NLP Engineer',
    ja: '自然言語処理エンジニア',
    zh: '自然语言处理工程师',
    ko: '자연어 처리 엔지니어'
  },
  'robotics': {
    vi: 'Kỹ sư Robot',
    en: 'Robotics Engineer',
    ja: 'ロボティクスエンジニア',
    zh: '机器人工程师',
    ko: '로보틱스 엔지니어'
  },

  // Other
  'technical-writing': {
    vi: 'Chuyên viên Viết Tài liệu Kỹ thuật',
    en: 'Technical Writer',
    ja: 'テクニカルライター',
    zh: '技术文档工程师',
    ko: '기술 작가'
  },
  'it-consulting': {
    vi: 'Tư vấn CNTT',
    en: 'IT Consultant',
    ja: 'ITコンサルタント',
    zh: 'IT顾问',
    ko: 'IT 컨설턴트'
  },
  'it-audit': {
    vi: 'Kiểm toán CNTT',
    en: 'IT Auditor',
    ja: 'IT監査人',
    zh: 'IT审计师',
    ko: 'IT 감사'
  }
};

export type Language = 'vi' | 'en' | 'ja' | 'zh' | 'ko';

/**
 * Convert QuizCategory to job title in specified language
 */
export function getCategoryJobTitle(category: QuizCategory, language: Language = 'vi'): string {
  return CATEGORY_TO_JOB_TITLE[category]?.[language] || category;
}

/**
 * Get all job titles for a category (all languages)
 */
export function getAllJobTitles(category: QuizCategory) {
  return CATEGORY_TO_JOB_TITLE[category];
}
