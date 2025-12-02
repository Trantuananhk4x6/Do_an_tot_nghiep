// Learning Resources Data for Quiz Feedback

export interface LearningResource {
  id: string;
  title: string;
  titleVi: string;
  type: 'course' | 'video' | 'article' | 'book' | 'website' | 'tutorial' | 'certification';
  platform: string;
  url: string;
  duration?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isFree: boolean;
  rating?: number;
  skills: string[];
  categories: string[];
  description: string;
  descriptionVi: string;
}

export interface KnowledgeExplanation {
  topic: string;
  explanation: string;
  explanationVi: string;
  keyPoints: string[];
  keyPointsVi: string[];
  relatedTopics: string[];
  practiceQuestions?: string[];
}

// ============================================
// LEARNING RESOURCES BY CATEGORY
// ============================================

export const LEARNING_RESOURCES: LearningResource[] = [
  // ============================================
  // JAVASCRIPT / FRONTEND
  // ============================================
  {
    id: 'js-mdn',
    title: 'MDN Web Docs - JavaScript',
    titleVi: 'MDN Web Docs - JavaScript',
    type: 'website',
    platform: 'Mozilla',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    level: 'beginner',
    isFree: true,
    rating: 4.9,
    skills: ['JavaScript', 'ES6+', 'DOM', 'Web APIs'],
    categories: ['javascript', 'frontend', 'web'],
    description: 'The most comprehensive JavaScript documentation',
    descriptionVi: 'Tài liệu JavaScript toàn diện nhất'
  },
  {
    id: 'js-info',
    title: 'JavaScript.info - The Modern JavaScript Tutorial',
    titleVi: 'JavaScript.info - Hướng dẫn JavaScript hiện đại',
    type: 'tutorial',
    platform: 'javascript.info',
    url: 'https://javascript.info/',
    level: 'beginner',
    isFree: true,
    rating: 4.8,
    skills: ['JavaScript', 'ES6+', 'Async/Await', 'OOP'],
    categories: ['javascript', 'frontend'],
    description: 'From basics to advanced with interactive examples',
    descriptionVi: 'Từ cơ bản đến nâng cao với ví dụ tương tác'
  },
  {
    id: 'freecodecamp-js',
    title: 'freeCodeCamp - JavaScript Algorithms and Data Structures',
    titleVi: 'freeCodeCamp - Thuật toán và Cấu trúc dữ liệu JavaScript',
    type: 'course',
    platform: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
    duration: '300 hours',
    level: 'beginner',
    isFree: true,
    rating: 4.7,
    skills: ['JavaScript', 'Algorithms', 'Data Structures', 'ES6'],
    categories: ['javascript', 'algorithms'],
    description: 'Free interactive JavaScript course with certification',
    descriptionVi: 'Khóa học JavaScript tương tác miễn phí có chứng chỉ'
  },
  {
    id: 'traversy-js',
    title: 'Traversy Media - JavaScript Crash Course',
    titleVi: 'Traversy Media - Khóa học JavaScript nhanh',
    type: 'video',
    platform: 'YouTube',
    url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c',
    duration: '1.5 hours',
    level: 'beginner',
    isFree: true,
    rating: 4.8,
    skills: ['JavaScript Basics', 'DOM', 'Events'],
    categories: ['javascript', 'frontend'],
    description: 'Quick comprehensive JavaScript overview',
    descriptionVi: 'Tổng quan JavaScript nhanh và toàn diện'
  },

  // ============================================
  // REACT
  // ============================================
  {
    id: 'react-docs',
    title: 'React Official Documentation',
    titleVi: 'Tài liệu chính thức React',
    type: 'website',
    platform: 'React',
    url: 'https://react.dev/',
    level: 'beginner',
    isFree: true,
    rating: 4.9,
    skills: ['React', 'Hooks', 'Components', 'State Management'],
    categories: ['react', 'frontend', 'javascript'],
    description: 'The official React documentation with interactive tutorials',
    descriptionVi: 'Tài liệu React chính thức với hướng dẫn tương tác'
  },
  {
    id: 'react-fullstack',
    title: 'Full Stack Open - React Course',
    titleVi: 'Full Stack Open - Khóa học React',
    type: 'course',
    platform: 'University of Helsinki',
    url: 'https://fullstackopen.com/en/',
    duration: '200 hours',
    level: 'intermediate',
    isFree: true,
    rating: 4.9,
    skills: ['React', 'Node.js', 'MongoDB', 'GraphQL', 'TypeScript'],
    categories: ['react', 'frontend', 'fullstack', 'nodejs'],
    description: 'Deep dive into modern web development with React',
    descriptionVi: 'Học sâu về phát triển web hiện đại với React'
  },
  {
    id: 'scrimba-react',
    title: 'Scrimba - Learn React for Free',
    titleVi: 'Scrimba - Học React miễn phí',
    type: 'course',
    platform: 'Scrimba',
    url: 'https://scrimba.com/learn/learnreact',
    duration: '12 hours',
    level: 'beginner',
    isFree: true,
    rating: 4.7,
    skills: ['React Basics', 'Components', 'Props', 'State'],
    categories: ['react', 'frontend'],
    description: 'Interactive React course with code-along exercises',
    descriptionVi: 'Khóa học React tương tác với bài tập code thực hành'
  },

  // ============================================
  // TYPESCRIPT
  // ============================================
  {
    id: 'ts-docs',
    title: 'TypeScript Handbook',
    titleVi: 'Sổ tay TypeScript',
    type: 'website',
    platform: 'TypeScript',
    url: 'https://www.typescriptlang.org/docs/handbook/',
    level: 'beginner',
    isFree: true,
    rating: 4.8,
    skills: ['TypeScript', 'Types', 'Interfaces', 'Generics'],
    categories: ['typescript', 'javascript', 'frontend'],
    description: 'Official TypeScript documentation and handbook',
    descriptionVi: 'Tài liệu và sổ tay TypeScript chính thức'
  },
  {
    id: 'ts-exercises',
    title: 'TypeScript Exercises',
    titleVi: 'Bài tập TypeScript',
    type: 'tutorial',
    platform: 'typescript-exercises.github.io',
    url: 'https://typescript-exercises.github.io/',
    level: 'intermediate',
    isFree: true,
    rating: 4.6,
    skills: ['TypeScript', 'Type System', 'Advanced Types'],
    categories: ['typescript'],
    description: 'Practice TypeScript with interactive exercises',
    descriptionVi: 'Thực hành TypeScript với bài tập tương tác'
  },

  // ============================================
  // NODEJS / BACKEND
  // ============================================
  {
    id: 'node-docs',
    title: 'Node.js Documentation',
    titleVi: 'Tài liệu Node.js',
    type: 'website',
    platform: 'Node.js',
    url: 'https://nodejs.org/docs/latest/api/',
    level: 'beginner',
    isFree: true,
    rating: 4.7,
    skills: ['Node.js', 'JavaScript', 'Backend', 'APIs'],
    categories: ['nodejs', 'backend', 'javascript'],
    description: 'Official Node.js API documentation',
    descriptionVi: 'Tài liệu API Node.js chính thức'
  },
  {
    id: 'node-best-practices',
    title: 'Node.js Best Practices',
    titleVi: 'Best Practices Node.js',
    type: 'article',
    platform: 'GitHub',
    url: 'https://github.com/goldbergyoni/nodebestpractices',
    level: 'intermediate',
    isFree: true,
    rating: 4.9,
    skills: ['Node.js', 'Architecture', 'Security', 'Performance'],
    categories: ['nodejs', 'backend'],
    description: 'Comprehensive guide to Node.js best practices',
    descriptionVi: 'Hướng dẫn toàn diện về best practices Node.js'
  },

  // ============================================
  // PYTHON
  // ============================================
  {
    id: 'python-docs',
    title: 'Python Official Documentation',
    titleVi: 'Tài liệu chính thức Python',
    type: 'website',
    platform: 'Python',
    url: 'https://docs.python.org/3/',
    level: 'beginner',
    isFree: true,
    rating: 4.8,
    skills: ['Python', 'Standard Library', 'Best Practices'],
    categories: ['python', 'backend'],
    description: 'Official Python documentation',
    descriptionVi: 'Tài liệu Python chính thức'
  },
  {
    id: 'python-cs50',
    title: 'CS50\'s Introduction to Programming with Python',
    titleVi: 'CS50 - Giới thiệu lập trình với Python',
    type: 'course',
    platform: 'Harvard / edX',
    url: 'https://cs50.harvard.edu/python/',
    duration: '60 hours',
    level: 'beginner',
    isFree: true,
    rating: 4.9,
    skills: ['Python', 'Programming Fundamentals', 'Problem Solving'],
    categories: ['python', 'programming'],
    description: 'Harvard\'s intro to Python programming',
    descriptionVi: 'Khóa học Python nhập môn của Harvard'
  },
  {
    id: 'realpython',
    title: 'Real Python Tutorials',
    titleVi: 'Hướng dẫn Real Python',
    type: 'website',
    platform: 'Real Python',
    url: 'https://realpython.com/',
    level: 'intermediate',
    isFree: false,
    rating: 4.8,
    skills: ['Python', 'Django', 'Flask', 'Data Science'],
    categories: ['python', 'backend', 'data-science'],
    description: 'In-depth Python tutorials and articles',
    descriptionVi: 'Hướng dẫn và bài viết Python chuyên sâu'
  },

  // ============================================
  // DATA SCIENCE / ML
  // ============================================
  {
    id: 'kaggle-learn',
    title: 'Kaggle Learn',
    titleVi: 'Kaggle Learn',
    type: 'course',
    platform: 'Kaggle',
    url: 'https://www.kaggle.com/learn',
    duration: 'Various',
    level: 'beginner',
    isFree: true,
    rating: 4.7,
    skills: ['Python', 'Machine Learning', 'Data Visualization', 'SQL'],
    categories: ['data-science', 'machine-learning', 'python'],
    description: 'Free micro-courses on data science and ML',
    descriptionVi: 'Các khóa học ngắn miễn phí về data science và ML'
  },
  {
    id: 'fastai',
    title: 'Fast.ai - Practical Deep Learning',
    titleVi: 'Fast.ai - Deep Learning thực hành',
    type: 'course',
    platform: 'fast.ai',
    url: 'https://course.fast.ai/',
    duration: '50 hours',
    level: 'intermediate',
    isFree: true,
    rating: 4.9,
    skills: ['Deep Learning', 'PyTorch', 'Computer Vision', 'NLP'],
    categories: ['machine-learning', 'ai-engineering', 'python'],
    description: 'Practical deep learning course from fast.ai',
    descriptionVi: 'Khóa học deep learning thực hành từ fast.ai'
  },
  {
    id: 'andrew-ng-ml',
    title: 'Machine Learning by Andrew Ng',
    titleVi: 'Machine Learning của Andrew Ng',
    type: 'course',
    platform: 'Coursera',
    url: 'https://www.coursera.org/learn/machine-learning',
    duration: '60 hours',
    level: 'beginner',
    isFree: false,
    rating: 4.9,
    skills: ['Machine Learning', 'Linear Algebra', 'Statistics'],
    categories: ['machine-learning', 'data-science'],
    description: 'The famous ML course by Andrew Ng',
    descriptionVi: 'Khóa học ML nổi tiếng của Andrew Ng'
  },

  // ============================================
  // DEVOPS / CLOUD
  // ============================================
  {
    id: 'docker-docs',
    title: 'Docker Documentation',
    titleVi: 'Tài liệu Docker',
    type: 'website',
    platform: 'Docker',
    url: 'https://docs.docker.com/',
    level: 'beginner',
    isFree: true,
    rating: 4.7,
    skills: ['Docker', 'Containers', 'DevOps'],
    categories: ['devops', 'cloud', 'infrastructure'],
    description: 'Official Docker documentation',
    descriptionVi: 'Tài liệu Docker chính thức'
  },
  {
    id: 'kubernetes-docs',
    title: 'Kubernetes Documentation',
    titleVi: 'Tài liệu Kubernetes',
    type: 'website',
    platform: 'Kubernetes',
    url: 'https://kubernetes.io/docs/',
    level: 'intermediate',
    isFree: true,
    rating: 4.7,
    skills: ['Kubernetes', 'Container Orchestration', 'DevOps'],
    categories: ['devops', 'cloud', 'infrastructure'],
    description: 'Official Kubernetes documentation',
    descriptionVi: 'Tài liệu Kubernetes chính thức'
  },
  {
    id: 'aws-free-tier',
    title: 'AWS Free Tier & Training',
    titleVi: 'AWS Free Tier & Đào tạo',
    type: 'course',
    platform: 'AWS',
    url: 'https://aws.amazon.com/training/',
    level: 'beginner',
    isFree: true,
    rating: 4.6,
    skills: ['AWS', 'Cloud Computing', 'EC2', 'S3'],
    categories: ['cloud', 'devops'],
    description: 'Free AWS training and resources',
    descriptionVi: 'Đào tạo và tài nguyên AWS miễn phí'
  },

  // ============================================
  // SYSTEM DESIGN
  // ============================================
  {
    id: 'system-design-primer',
    title: 'System Design Primer',
    titleVi: 'Cẩm nang System Design',
    type: 'article',
    platform: 'GitHub',
    url: 'https://github.com/donnemartin/system-design-primer',
    level: 'intermediate',
    isFree: true,
    rating: 4.9,
    skills: ['System Design', 'Scalability', 'Distributed Systems'],
    categories: ['system-design', 'backend', 'architecture'],
    description: 'Learn how to design large-scale systems',
    descriptionVi: 'Học cách thiết kế hệ thống quy mô lớn'
  },
  {
    id: 'designing-data-intensive',
    title: 'Designing Data-Intensive Applications',
    titleVi: 'Thiết kế ứng dụng xử lý dữ liệu lớn',
    type: 'book',
    platform: 'O\'Reilly',
    url: 'https://dataintensive.net/',
    level: 'advanced',
    isFree: false,
    rating: 4.9,
    skills: ['System Design', 'Databases', 'Distributed Systems'],
    categories: ['system-design', 'database', 'backend'],
    description: 'The definitive guide to data systems',
    descriptionVi: 'Hướng dẫn chuyên sâu về hệ thống dữ liệu'
  },

  // ============================================
  // ALGORITHMS & DATA STRUCTURES
  // ============================================
  {
    id: 'leetcode',
    title: 'LeetCode',
    titleVi: 'LeetCode',
    type: 'website',
    platform: 'LeetCode',
    url: 'https://leetcode.com/',
    level: 'intermediate',
    isFree: true,
    rating: 4.8,
    skills: ['Algorithms', 'Data Structures', 'Problem Solving'],
    categories: ['algorithms', 'programming'],
    description: 'Practice coding problems for interviews',
    descriptionVi: 'Thực hành giải bài toán cho phỏng vấn'
  },
  {
    id: 'neetcode',
    title: 'NeetCode - DSA Roadmap',
    titleVi: 'NeetCode - Lộ trình DSA',
    type: 'video',
    platform: 'YouTube / NeetCode',
    url: 'https://neetcode.io/',
    level: 'intermediate',
    isFree: true,
    rating: 4.9,
    skills: ['Algorithms', 'Data Structures', 'Interview Prep'],
    categories: ['algorithms', 'programming'],
    description: 'Structured DSA learning path with video explanations',
    descriptionVi: 'Lộ trình học DSA có cấu trúc với video giải thích'
  },

  // ============================================
  // SECURITY
  // ============================================
  {
    id: 'owasp',
    title: 'OWASP - Web Security',
    titleVi: 'OWASP - Bảo mật Web',
    type: 'website',
    platform: 'OWASP',
    url: 'https://owasp.org/',
    level: 'intermediate',
    isFree: true,
    rating: 4.8,
    skills: ['Web Security', 'Vulnerability Assessment', 'OWASP Top 10'],
    categories: ['cybersecurity', 'security', 'web'],
    description: 'Web application security resources',
    descriptionVi: 'Tài nguyên bảo mật ứng dụng web'
  },
  {
    id: 'tryhackme',
    title: 'TryHackMe',
    titleVi: 'TryHackMe',
    type: 'course',
    platform: 'TryHackMe',
    url: 'https://tryhackme.com/',
    level: 'beginner',
    isFree: true,
    rating: 4.7,
    skills: ['Cybersecurity', 'Penetration Testing', 'Linux'],
    categories: ['cybersecurity', 'penetration-testing'],
    description: 'Learn cybersecurity through hands-on exercises',
    descriptionVi: 'Học cybersecurity qua bài tập thực hành'
  },

  // ============================================
  // UI/UX DESIGN
  // ============================================
  {
    id: 'figma-learn',
    title: 'Figma Learn',
    titleVi: 'Figma Learn',
    type: 'tutorial',
    platform: 'Figma',
    url: 'https://www.figma.com/resources/learn-design/',
    level: 'beginner',
    isFree: true,
    rating: 4.8,
    skills: ['UI Design', 'Figma', 'Prototyping'],
    categories: ['ui-ux-design', 'product-design'],
    description: 'Learn design fundamentals with Figma',
    descriptionVi: 'Học cơ bản thiết kế với Figma'
  },
  {
    id: 'laws-of-ux',
    title: 'Laws of UX',
    titleVi: 'Quy luật UX',
    type: 'website',
    platform: 'lawsofux.com',
    url: 'https://lawsofux.com/',
    level: 'beginner',
    isFree: true,
    rating: 4.7,
    skills: ['UX Design', 'Psychology', 'Design Principles'],
    categories: ['ui-ux-design'],
    description: 'Collection of UX design principles',
    descriptionVi: 'Bộ sưu tập nguyên tắc thiết kế UX'
  },

  // ============================================
  // DATABASE
  // ============================================
  {
    id: 'sqlbolt',
    title: 'SQLBolt - Learn SQL',
    titleVi: 'SQLBolt - Học SQL',
    type: 'tutorial',
    platform: 'SQLBolt',
    url: 'https://sqlbolt.com/',
    level: 'beginner',
    isFree: true,
    rating: 4.8,
    skills: ['SQL', 'Databases', 'Queries'],
    categories: ['database', 'backend'],
    description: 'Interactive SQL tutorials',
    descriptionVi: 'Hướng dẫn SQL tương tác'
  },
  {
    id: 'use-the-index-luke',
    title: 'Use The Index, Luke!',
    titleVi: 'Use The Index, Luke!',
    type: 'website',
    platform: 'use-the-index-luke.com',
    url: 'https://use-the-index-luke.com/',
    level: 'intermediate',
    isFree: true,
    rating: 4.7,
    skills: ['SQL Optimization', 'Indexing', 'Database Performance'],
    categories: ['database', 'backend'],
    description: 'SQL performance tuning guide',
    descriptionVi: 'Hướng dẫn tối ưu hiệu suất SQL'
  }
];

// ============================================
// KNOWLEDGE EXPLANATIONS BY TOPIC
// ============================================

export const KNOWLEDGE_EXPLANATIONS: Record<string, KnowledgeExplanation> = {
  'closure': {
    topic: 'JavaScript Closures',
    explanation: 'A closure is a function that has access to variables from its outer (enclosing) scope, even after the outer function has returned. Closures are created every time a function is created.',
    explanationVi: 'Closure là một hàm có thể truy cập các biến từ phạm vi bên ngoài (enclosing scope), ngay cả sau khi hàm bên ngoài đã return. Closures được tạo mỗi khi một hàm được tạo.',
    keyPoints: [
      'Functions remember the environment they were created in',
      'Used for data privacy and encapsulation',
      'Common in callbacks and event handlers',
      'Can cause memory leaks if not managed properly'
    ],
    keyPointsVi: [
      'Hàm nhớ môi trường nơi chúng được tạo',
      'Dùng cho private data và đóng gói',
      'Thường gặp trong callbacks và event handlers',
      'Có thể gây memory leaks nếu không quản lý tốt'
    ],
    relatedTopics: ['Scope', 'Hoisting', 'Event Loop', 'Memory Management'],
    practiceQuestions: [
      'What will this code output and why?',
      'How would you use closures to create private variables?'
    ]
  },
  'hoisting': {
    topic: 'JavaScript Hoisting',
    explanation: 'Hoisting is JavaScript\'s default behavior of moving declarations to the top of their scope before code execution. Only declarations are hoisted, not initializations.',
    explanationVi: 'Hoisting là hành vi mặc định của JavaScript di chuyển các khai báo lên đầu scope trước khi thực thi code. Chỉ có declarations được hoisted, không phải initializations.',
    keyPoints: [
      'var declarations are hoisted and initialized with undefined',
      'let and const are hoisted but not initialized (TDZ)',
      'Function declarations are fully hoisted',
      'Function expressions follow variable hoisting rules'
    ],
    keyPointsVi: [
      'var declarations được hoisted và khởi tạo với undefined',
      'let và const được hoisted nhưng không khởi tạo (TDZ)',
      'Function declarations được hoisted hoàn toàn',
      'Function expressions tuân theo quy tắc hoisting của biến'
    ],
    relatedTopics: ['Scope', 'Closures', 'var vs let vs const'],
  },
  'event-loop': {
    topic: 'JavaScript Event Loop',
    explanation: 'The event loop is what allows JavaScript to perform non-blocking operations despite being single-threaded. It manages the call stack and callback queue.',
    explanationVi: 'Event loop là cơ chế cho phép JavaScript thực hiện các hoạt động không blocking dù là single-threaded. Nó quản lý call stack và callback queue.',
    keyPoints: [
      'JavaScript is single-threaded',
      'Web APIs handle async operations',
      'Callback queue holds completed async callbacks',
      'Event loop moves callbacks to call stack when empty'
    ],
    keyPointsVi: [
      'JavaScript là single-threaded',
      'Web APIs xử lý các hoạt động async',
      'Callback queue giữ các callbacks async đã hoàn thành',
      'Event loop di chuyển callbacks vào call stack khi trống'
    ],
    relatedTopics: ['Promises', 'async/await', 'setTimeout', 'Microtasks'],
  },
  'react-hooks': {
    topic: 'React Hooks',
    explanation: 'Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8.',
    explanationVi: 'Hooks là các hàm cho phép bạn sử dụng state và các tính năng React khác trong functional components. Chúng được giới thiệu trong React 16.8.',
    keyPoints: [
      'useState for component state',
      'useEffect for side effects',
      'useContext for context consumption',
      'Custom hooks for reusable logic'
    ],
    keyPointsVi: [
      'useState cho component state',
      'useEffect cho side effects',
      'useContext để sử dụng context',
      'Custom hooks cho logic tái sử dụng'
    ],
    relatedTopics: ['useState', 'useEffect', 'useCallback', 'useMemo'],
  },
  'rest-api': {
    topic: 'REST API Design',
    explanation: 'REST (Representational State Transfer) is an architectural style for designing networked applications. It uses HTTP methods and is stateless.',
    explanationVi: 'REST (Representational State Transfer) là một phong cách kiến trúc để thiết kế các ứng dụng mạng. Nó sử dụng các phương thức HTTP và là stateless.',
    keyPoints: [
      'Use HTTP methods correctly (GET, POST, PUT, DELETE)',
      'Resources are identified by URIs',
      'Stateless - no client context stored on server',
      'Use proper status codes'
    ],
    keyPointsVi: [
      'Sử dụng đúng HTTP methods (GET, POST, PUT, DELETE)',
      'Resources được xác định bởi URIs',
      'Stateless - không lưu context client trên server',
      'Sử dụng đúng status codes'
    ],
    relatedTopics: ['HTTP', 'API Design', 'GraphQL', 'Authentication'],
  },
  'sql-joins': {
    topic: 'SQL Joins',
    explanation: 'Joins combine rows from two or more tables based on a related column. Understanding joins is essential for working with relational databases.',
    explanationVi: 'Joins kết hợp các hàng từ hai hoặc nhiều bảng dựa trên một cột liên quan. Hiểu về joins là cần thiết khi làm việc với cơ sở dữ liệu quan hệ.',
    keyPoints: [
      'INNER JOIN returns matching rows from both tables',
      'LEFT JOIN returns all rows from left table',
      'RIGHT JOIN returns all rows from right table',
      'FULL OUTER JOIN returns all rows from both tables'
    ],
    keyPointsVi: [
      'INNER JOIN trả về các hàng khớp từ cả hai bảng',
      'LEFT JOIN trả về tất cả hàng từ bảng bên trái',
      'RIGHT JOIN trả về tất cả hàng từ bảng bên phải',
      'FULL OUTER JOIN trả về tất cả hàng từ cả hai bảng'
    ],
    relatedTopics: ['SQL', 'Database Design', 'Normalization', 'Indexing'],
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getResourcesBySkill(skill: string): LearningResource[] {
  const normalizedSkill = skill.toLowerCase();
  return LEARNING_RESOURCES.filter(resource => 
    resource.skills.some(s => s.toLowerCase().includes(normalizedSkill)) ||
    resource.categories.some(c => c.toLowerCase().includes(normalizedSkill))
  );
}

export function getResourcesByCategory(category: string): LearningResource[] {
  return LEARNING_RESOURCES.filter(resource => 
    resource.categories.includes(category.toLowerCase())
  );
}

export function getResourcesByLevel(level: 'beginner' | 'intermediate' | 'advanced'): LearningResource[] {
  return LEARNING_RESOURCES.filter(resource => resource.level === level);
}

export function getFreeResources(): LearningResource[] {
  return LEARNING_RESOURCES.filter(resource => resource.isFree);
}

export function getTopRatedResources(minRating: number = 4.5): LearningResource[] {
  return LEARNING_RESOURCES.filter(resource => 
    resource.rating && resource.rating >= minRating
  ).sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

export function getRecommendedResources(
  weakSkills: string[], 
  level: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
  maxResources: number = 5
): LearningResource[] {
  const matchedResources: { resource: LearningResource; score: number }[] = [];

  LEARNING_RESOURCES.forEach(resource => {
    let score = 0;
    
    // Match skills
    weakSkills.forEach(skill => {
      const normalizedSkill = skill.toLowerCase();
      if (resource.skills.some(s => s.toLowerCase().includes(normalizedSkill))) {
        score += 2;
      }
      if (resource.categories.some(c => c.toLowerCase().includes(normalizedSkill))) {
        score += 1;
      }
    });

    // Prefer matching level
    if (resource.level === level) {
      score += 1;
    }

    // Prefer free resources
    if (resource.isFree) {
      score += 0.5;
    }

    // Prefer higher rated
    if (resource.rating) {
      score += resource.rating / 10;
    }

    if (score > 0) {
      matchedResources.push({ resource, score });
    }
  });

  return matchedResources
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResources)
    .map(item => item.resource);
}
