import { QuizCategory } from "@/data/quiz-questions";

// Retry utility for API calls with exponential backoff
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retries = 8,
  baseDelayMs = 3000
): Promise<Response> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // If successful, return immediately
      if (response.ok) {
        return response;
      }
      
      // If it's a 503 (overload) or 429 (rate limit), retry with exponential backoff
      if ((response.status === 503 || response.status === 429) && attempt < retries) {
        // Longer delays for rate limiting - wait 10-60+ seconds
        const delay = baseDelayMs * Math.pow(2, attempt) + Math.floor(Math.random() * 2000);
        console.log(`[fetchWithRetry] Rate limited (${response.status}). Attempt ${attempt + 1}/${retries + 1}, waiting ${Math.round(delay/1000)}s before retry...`);
        await sleep(delay);
        continue;
      }
      
      // For other errors, throw immediately
      const errorText = await response.text().catch(() => '');
      throw new Error(`API Error ${response.status}: ${errorText}`);
      
    } catch (error: any) {
      lastError = error;
      
      // Only retry on network errors
      if (attempt < retries && (error.name === 'TypeError' || error.message.includes('fetch'))) {
        const delay = baseDelayMs * Math.pow(2, attempt) + Math.floor(Math.random() * 1000);
        console.log(`[fetchWithRetry] Network error on attempt ${attempt + 1}/${retries + 1}, retrying in ${delay}ms...`);
        await sleep(delay);
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
};

export interface SkillAnalysis {
  detectedSkills: string[];
  primaryCategory: QuizCategory;
  secondaryCategories: QuizCategory[];
  experienceLevel: 'junior' | 'mid' | 'senior';
  confidence: number; // 0-1
  detailedSkills?: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    devops?: string[];
    tools?: string[];
    languages?: string[];
    frameworks?: string[];
  };
}

export interface ExtractedText {
  content: string;
  skills: string[];
}

// Enhanced skill mapping with more comprehensive keywords
const SKILL_CATEGORY_MAP: Record<string, QuizCategory> = {
  // JavaScript ecosystem - Enhanced
  'javascript': 'javascript',
  'js': 'javascript',
  'es6': 'javascript',
  'es2015': 'javascript',
  'es2016': 'javascript',
  'es2017': 'javascript',
  'es2018': 'javascript',
  'es2019': 'javascript',
  'es2020': 'javascript',
  'es2021': 'javascript',
  'ecmascript': 'javascript',
  'vanilla js': 'javascript',
  'vanilla javascript': 'javascript',
  'dom': 'javascript',
  'dom manipulation': 'javascript',
  'ajax': 'javascript',
  'fetch': 'javascript',
  'fetch api': 'javascript',
  'promises': 'javascript',
  'async/await': 'javascript',
  'async': 'javascript',
  'await': 'javascript',
  'closure': 'javascript',
  'closures': 'javascript',
  'prototype': 'javascript',
  'prototypal inheritance': 'javascript',
  'event loop': 'javascript',
  'callback': 'javascript',
  'callbacks': 'javascript',
  'arrow functions': 'javascript',
  'destructuring': 'javascript',
  'spread operator': 'javascript',
  'rest parameters': 'javascript',
  'modules': 'javascript',
  'imports': 'javascript',
  'exports': 'javascript',

  // TypeScript - Enhanced
  'typescript': 'typescript',
  'ts': 'typescript',
  'type annotations': 'typescript',
  'interfaces': 'typescript',
  'generics': 'typescript',
  'decorators': 'typescript',
  'type guards': 'typescript',
  'utility types': 'typescript',
  'enums': 'typescript',
  'type inference': 'typescript',
  'strict mode': 'typescript',
  'tsconfig': 'typescript',

  // React ecosystem - Enhanced
  'react': 'react',
  'reactjs': 'react',
  'react.js': 'react',
  'jsx': 'react',
  'tsx': 'react',
  'hooks': 'react',
  'react hooks': 'react',
  'usestate': 'react',
  'useeffect': 'react',
  'usememo': 'react',
  'usecallback': 'react',
  'useref': 'react',
  'usecontext': 'react',
  'usereducer': 'react',
  'custom hooks': 'react',
  'redux': 'react',
  'redux toolkit': 'react',
  'rtk': 'react',
  'redux saga': 'react',
  'redux thunk': 'react',
  'context api': 'react',
  'react context': 'react',
  'next.js': 'react',
  'nextjs': 'react',
  'next': 'react',
  'gatsby': 'react',
  'react router': 'react',
  'react-router': 'react',
  'react-native': 'react',
  'mobx': 'react',
  'zustand': 'react',
  'recoil': 'react',
  'jotai': 'react',
  'tanstack query': 'react',
  'react query': 'react',
  'swr': 'react',
  'create-react-app': 'react',
  'cra': 'react',

  // Node.js ecosystem - Enhanced
  'node.js': 'nodejs',
  'nodejs': 'nodejs',
  'node': 'nodejs',
  'express': 'nodejs',
  'expressjs': 'nodejs',
  'express.js': 'nodejs',
  'koa': 'nodejs',
  'koajs': 'nodejs',
  'fastify': 'nodejs',
  'nest': 'nodejs',
  'nestjs': 'nodejs',
  'nest.js': 'nodejs',
  'npm': 'nodejs',
  'yarn': 'nodejs',
  'pnpm': 'nodejs',
  'websocket': 'nodejs',
  'websockets': 'nodejs',
  'socket.io': 'nodejs',
  'graphql': 'nodejs',
  'apollo': 'nodejs',
  'apollo server': 'nodejs',
  'apollo client': 'nodejs',
  'prisma': 'nodejs',
  'typeorm': 'nodejs',
  'mongoose': 'nodejs',
  'sequelize': 'nodejs',
  'passport': 'nodejs',
  'passport.js': 'nodejs',
  'jwt': 'nodejs',
  'jsonwebtoken': 'nodejs',
  'bcrypt': 'nodejs',
  'helmet': 'nodejs',
  'cors': 'nodejs',
  'dotenv': 'nodejs',
  'multer': 'nodejs',

  // Python - Enhanced
  'python': 'python',
  'python3': 'python',
  'py': 'python',
  'django': 'python',
  'flask': 'python',
  'fastapi': 'python',
  'fast api': 'python',
  'pandas': 'python',
  'numpy': 'python',
  'scipy': 'python',
  'matplotlib': 'python',
  'seaborn': 'python',
  'plotly': 'python',
  'sklearn': 'python',
  'scikit-learn': 'python',
  'tensorflow': 'python',
  'tf': 'python',
  'keras': 'python',
  'pytorch': 'python',
  'torch': 'python',
  'jupyter': 'python',
  'jupyter notebook': 'python',
  'anaconda': 'python',
  'pip': 'python',
  'virtualenv': 'python',
  'pipenv': 'python',
  'poetry': 'python',
  'requests': 'python',
  'beautifulsoup': 'python',
  'bs4': 'python',
  'scrapy': 'python',
  'celery': 'python',

  // Java - Enhanced
  'java': 'java',
  'java se': 'java',
  'java ee': 'java',
  'j2ee': 'java',
  'spring': 'java',
  'spring boot': 'java',
  'spring framework': 'java',
  'spring mvc': 'java',
  'spring data': 'java',
  'spring security': 'java',
  'spring cloud': 'java',
  'hibernate': 'java',
  'jpa': 'java',
  'jdbc': 'java',
  'maven': 'java',
  'gradle': 'java',
  'junit': 'java',
  'junit5': 'java',
  'mockito': 'java',
  'tomcat': 'java',
  'jetty': 'java',
  'wildfly': 'java',
  'jboss': 'java',

  // Database - Enhanced
  'sql': 'database',
  'mysql': 'database',
  'mariadb': 'database',
  'postgresql': 'database',
  'postgres': 'database',
  'pg': 'database',
  'mongodb': 'database',
  'mongo': 'database',
  'redis': 'database',
  'elasticsearch': 'database',
  'elastic': 'database',
  'oracle': 'database',
  'oracle db': 'database',
  'sqlite': 'database',
  'nosql': 'database',
  'database design': 'database',
  'db': 'database',
  'dba': 'database',
  'sql server': 'database',
  'mssql': 'database',
  'cassandra': 'database',
  'dynamodb': 'database',
  'firestore': 'database',
  'firebase': 'database',
  'supabase': 'database',
  'planetscale': 'database',
  'cockroachdb': 'database',

  // Algorithms & Data Structures - Enhanced
  'algorithms': 'algorithms',
  'algorithm': 'algorithms',
  'data structures': 'algorithms',
  'data structure': 'algorithms',
  'dsa': 'algorithms',
  'leetcode': 'algorithms',
  'hackerrank': 'algorithms',
  'codewars': 'algorithms',
  'big o': 'algorithms',
  'complexity': 'algorithms',
  'time complexity': 'algorithms',
  'space complexity': 'algorithms',
  'sorting': 'algorithms',
  'searching': 'algorithms',
  'binary search': 'algorithms',
  'trees': 'algorithms',
  'binary tree': 'algorithms',
  'bst': 'algorithms',
  'graphs': 'algorithms',
  'graph theory': 'algorithms',
  'dynamic programming': 'algorithms',
  'dp': 'algorithms',
  'recursion': 'algorithms',
  'backtracking': 'algorithms',
  'greedy': 'algorithms',
  'divide and conquer': 'algorithms',
  'linked list': 'algorithms',
  'stack': 'algorithms',
  'queue': 'algorithms',
  'hash table': 'algorithms',
  'hashmap': 'algorithms',
  'heap': 'algorithms',
  'trie': 'algorithms',

  // System Design - Enhanced
  'system design': 'system-design',
  'systems design': 'system-design',
  'microservices': 'system-design',
  'micro services': 'system-design',
  'microservice architecture': 'system-design',
  'architecture': 'system-design',
  'software architecture': 'system-design',
  'scalability': 'system-design',
  'scaling': 'system-design',
  'horizontal scaling': 'system-design',
  'vertical scaling': 'system-design',
  'load balancing': 'system-design',
  'load balancer': 'system-design',
  'caching': 'system-design',
  'cache': 'system-design',
  'cdn': 'system-design',
  'content delivery network': 'system-design',
  'distributed systems': 'system-design',
  'distributed': 'system-design',
  'api design': 'system-design',
  'rest api': 'system-design',
  'rest': 'system-design',
  'restful': 'system-design',
  'restful api': 'system-design',
  'grpc': 'system-design',
  'message queue': 'system-design',
  'rabbitmq': 'system-design',
  'kafka': 'system-design',
  'event driven': 'system-design',
  'event-driven': 'system-design',
  'saga pattern': 'system-design',
  'cqrs': 'system-design',

  // DevOps - Enhanced  
  'devops': 'devops',
  'docker': 'devops',
  'dockerfile': 'devops',
  'docker-compose': 'devops',
  'kubernetes': 'devops',
  'k8s': 'devops',
  'helm': 'devops',
  'aws': 'devops',
  'amazon web services': 'devops',
  'ec2': 'devops',
  's3': 'devops',
  'lambda': 'devops',
  'cloudformation': 'devops',
  'azure': 'devops',
  'microsoft azure': 'devops',
  'gcp': 'devops',
  'google cloud': 'devops',
  'google cloud platform': 'devops',
  'terraform': 'devops',
  'ansible': 'devops',
  'puppet': 'devops',
  'chef': 'devops',
  'jenkins': 'devops',
  'ci/cd': 'devops',
  'ci': 'devops',
  'cd': 'devops',
  'gitlab ci': 'devops',
  'gitlab': 'devops',
  'github actions': 'devops',
  'circleci': 'devops',
  'travis ci': 'devops',
  'linux': 'devops',
  'unix': 'devops',
  'ubuntu': 'devops',
  'centos': 'devops',
  'debian': 'devops',
  'bash': 'devops',
  'shell scripting': 'devops',
  'shell': 'devops',
  'nginx': 'devops',
  'apache': 'devops',
  'monitoring': 'devops',
  'prometheus': 'devops',
  'grafana': 'devops',
  'elk': 'devops',
  'elk stack': 'devops',
  'logstash': 'devops',
  'kibana': 'devops',

  // Frontend Development (NEW)
  'html': 'frontend',
  'html5': 'frontend',
  'css': 'frontend',
  'css3': 'frontend',
  'sass': 'frontend',
  'scss': 'frontend',
  'less': 'frontend',
  'tailwind': 'frontend',
  'tailwindcss': 'frontend',
  'bootstrap': 'frontend',
  'material-ui': 'frontend',
  'mui': 'frontend',
  'styled-components': 'frontend',
  'emotion': 'frontend',
  'webpack': 'frontend',
  'vite': 'frontend',
  'parcel': 'frontend',
  'rollup': 'frontend',
  'babel': 'frontend',
  'responsive design': 'frontend',
  'responsive': 'frontend',
  'accessibility': 'frontend',
  'a11y': 'frontend',
  'seo': 'frontend',
  'performance optimization': 'frontend',
  'web performance': 'frontend',

  // Mobile Development (NEW)
  'mobile development': 'mobile-dev',
  'mobile app': 'mobile-dev',
  'ios': 'mobile-dev',
  'android': 'mobile-dev',
  'swift': 'mobile-dev',
  'swiftui': 'mobile-dev',
  'objective-c': 'mobile-dev',
  'kotlin': 'mobile-dev',
  'java android': 'mobile-dev',
  'flutter': 'mobile-dev',
  'dart': 'mobile-dev',
  'react native': 'mobile-dev',
  'ionic': 'mobile-dev',
  'cordova': 'mobile-dev',
  'phonegap': 'mobile-dev',
  'expo': 'mobile-dev',

  // Cloud Computing (NEW)
  'cloud computing': 'cloud',
  'cloud architecture': 'cloud',
  'aws lambda': 'cloud',
  'aws s3': 'cloud',
  'aws ec2': 'cloud',
  'aws rds': 'cloud',
  'azure functions': 'cloud',
  'azure devops': 'cloud',
  'google cloud functions': 'cloud',
  'firebase functions': 'cloud',
  'serverless': 'cloud',
  'iaas': 'cloud',
  'paas': 'cloud',
  'saas': 'cloud',
  'cloud migration': 'cloud',
  'multi-cloud': 'cloud',
  'hybrid cloud': 'cloud',

  // Cybersecurity (NEW)
  'cybersecurity': 'cybersecurity',
  'information security': 'cybersecurity',
  'infosec': 'cybersecurity',
  'security': 'cybersecurity',
  'encryption': 'cybersecurity',
  'ssl': 'cybersecurity',
  'tls': 'cybersecurity',
  'https': 'cybersecurity',
  'oauth': 'cybersecurity',
  'oauth2': 'cybersecurity',
  'authentication': 'cybersecurity',
  'authorization': 'cybersecurity',
  'penetration testing': 'penetration-testing',
  'pen testing': 'penetration-testing',
  'pentesting': 'penetration-testing',
  'ethical hacking': 'penetration-testing',
  'vulnerability assessment': 'penetration-testing',
  'metasploit': 'penetration-testing',
  'burp suite': 'penetration-testing',
  'kali linux': 'penetration-testing',
  'nmap': 'penetration-testing',
  'wireshark': 'penetration-testing',
  'security engineering': 'security-engineering',
  'appsec': 'security-engineering',
  'application security': 'security-engineering',
  'network security': 'security-engineering',
  'firewall': 'security-engineering',
  'ids': 'security-engineering',
  'ips': 'security-engineering',
  'siem': 'security-engineering',
  'forensics': 'forensics',
  'digital forensics': 'forensics',
  'incident response': 'forensics',
  'malware analysis': 'forensics',

  // Data Analysis & Science (NEW)
  'data analysis': 'data-analysis',
  'data analytics': 'data-analysis',
  'data analyst': 'data-analysis',
  'excel': 'data-analysis',
  'power bi': 'data-analysis',
  'powerbi': 'data-analysis',
  'tableau': 'data-analysis',
  'looker': 'data-analysis',
  'qlik': 'data-analysis',
  'bi tools': 'data-analysis',
  'business intelligence': 'data-analysis',
  'data visualization': 'data-analysis',
  'data science': 'data-science',
  'data scientist': 'data-science',
  'statistics': 'data-science',
  'statistical analysis': 'data-science',
  'r programming': 'data-science',
  'r language': 'data-science',
 
  'data engineering': 'data-engineering',
  'data engineer': 'data-engineering',
  'etl': 'data-engineering',
  'data pipeline': 'data-engineering',
  'airflow': 'data-engineering',
  'apache airflow': 'data-engineering',
  'spark': 'data-engineering',
  'apache spark': 'data-engineering',
  'hadoop': 'data-engineering',
  'hive': 'data-engineering',
  'data warehouse': 'data-engineering',
  'snowflake': 'data-engineering',
  'bigquery': 'data-engineering',
  'redshift': 'data-engineering',

  // Machine Learning & AI (NEW)
  'machine learning': 'machine-learning',
  'ml': 'machine-learning',
  'deep learning': 'machine-learning',
  'neural networks': 'machine-learning',
  'cnn': 'machine-learning',
  'rnn': 'machine-learning',
  'lstm': 'machine-learning',
  'transformer': 'machine-learning',
  'bert': 'machine-learning',
  'gpt': 'machine-learning',
  'supervised learning': 'machine-learning',
  'unsupervised learning': 'machine-learning',
  'reinforcement learning': 'machine-learning',
  'model training': 'machine-learning',
  'hyperparameter tuning': 'machine-learning',
  'artificial intelligence': 'ai-engineering',
  'ai': 'ai-engineering',
  'ai engineering': 'ai-engineering',
  'llm': 'ai-engineering',
  'large language models': 'ai-engineering',
  'chatbot': 'ai-engineering',
  'conversational ai': 'ai-engineering',
  'computer vision': 'computer-vision',
  'cv': 'computer-vision',
  'image processing': 'computer-vision',
  'object detection': 'computer-vision',
  'image recognition': 'computer-vision',
  'opencv': 'computer-vision',
  'yolo': 'computer-vision',
  'nlp': 'nlp',
  'natural language processing': 'nlp',
  'text mining': 'nlp',
  'sentiment analysis': 'nlp',
  'named entity recognition': 'nlp',
  'ner': 'nlp',
  'spacy': 'nlp',
  'nltk': 'nlp',
  'hugging face': 'nlp',
  'transformers': 'nlp',

  // UI/UX Design (NEW)
  'ui design': 'ui-ux-design',
  'ux design': 'ui-ux-design',
  'ui/ux': 'ui-ux-design',
  'user experience': 'ui-ux-design',
  'user interface': 'ui-ux-design',
  'figma': 'ui-ux-design',
  'sketch': 'ui-ux-design',
  'adobe xd': 'ui-ux-design',
  'xd': 'ui-ux-design',
  'invision': 'ui-ux-design',
  'prototyping': 'ui-ux-design',
  'wireframing': 'ui-ux-design',
  'user research': 'ui-ux-design',
  'usability testing': 'ui-ux-design',
  'interaction design': 'ui-ux-design',
  'visual design': 'ui-ux-design',
  'design thinking': 'ui-ux-design',
  'web design': 'web-design',
  'graphic design': 'web-design',
  'photoshop': 'web-design',
  'illustrator': 'web-design',
  'product design': 'product-design',
  'product designer': 'product-design',

  // Project & Product Management (NEW)
  'project management': 'project-management',
  'project manager': 'project-management',
  'pmp': 'project-management',
  'pmbok': 'project-management',
  'gantt chart': 'project-management',
  'critical path': 'project-management',
  'risk management': 'project-management',
  'stakeholder management': 'project-management',
  'jira': 'project-management',
  'trello': 'project-management',
  'asana': 'project-management',
  'monday': 'project-management',
  'ms project': 'project-management',
  'product management': 'product-management',
  'product manager': 'product-management',
  'product owner': 'product-management',
  'roadmap': 'product-management',
  'product strategy': 'product-management',
  'feature prioritization': 'product-management',
  'user stories': 'product-management',
  'backlog': 'product-management',
  'agile': 'agile-scrum',
  'scrum': 'agile-scrum',
  'scrum master': 'agile-scrum',
  'sprint': 'agile-scrum',
  'kanban': 'agile-scrum',
  'standup': 'agile-scrum',
  'retrospective': 'agile-scrum',
  'sprint planning': 'agile-scrum',
  'agile coach': 'agile-scrum',
  'safe': 'agile-scrum',
  'business analysis': 'business-analysis',
  'business analyst': 'business-analysis',
  'requirements gathering': 'business-analysis',
  'process improvement': 'business-analysis',
  'gap analysis': 'business-analysis',
  'use case': 'business-analysis',
  'bpmn': 'business-analysis',

  // QA & Testing (NEW)
  'qa': 'qa-testing',
  'quality assurance': 'qa-testing',
  'testing': 'qa-testing',
  'test case': 'qa-testing',
  'test plan': 'qa-testing',
  'manual testing': 'qa-testing',
  'functional testing': 'qa-testing',
  'regression testing': 'qa-testing',
  'integration testing': 'qa-testing',
  'system testing': 'qa-testing',
  'uat': 'qa-testing',
  'user acceptance testing': 'qa-testing',
  'automation testing': 'automation-testing',
  'test automation': 'automation-testing',
  'selenium': 'automation-testing',
  'cypress': 'automation-testing',
  'playwright': 'automation-testing',
  'puppeteer': 'automation-testing',
  'webdriverio': 'automation-testing',
  'appium': 'automation-testing',
  'jest': 'automation-testing',
  'mocha': 'automation-testing',
  'chai': 'automation-testing',
  'jasmine': 'automation-testing',
  'testng': 'automation-testing',
  'cucumber': 'automation-testing',
  'bdd': 'automation-testing',
  'tdd': 'automation-testing',
  'test management': 'test-management',
  'test lead': 'test-management',
  'qa manager': 'test-management',
  'test strategy': 'test-management',
  'defect management': 'test-management',

  // IT Support (NEW)
  'it support': 'it-support',
  'helpdesk': 'it-support',
  'help desk': 'it-support',
  'technical support': 'technical-support',
  'customer support': 'technical-support',
  'troubleshooting': 'it-support',
  'ticketing system': 'it-support',
  'incident management': 'it-support',
  'service desk': 'it-support',
  'it service management': 'it-support',
  'itil': 'it-support',
  'windows server': 'it-support',
  'active directory': 'it-support',
  'ad': 'it-support',
  'office 365': 'it-support',
  'microsoft 365': 'it-support',
  'exchange': 'it-support',

  // System Administration & Network (NEW)
  'system administration': 'system-admin',
  'sysadmin': 'system-admin',
  'system administrator': 'system-admin',
  'server administration': 'system-admin',
  'windows administration': 'system-admin',
  'linux administration': 'system-admin',
  'unix administration': 'system-admin',
  'network administration': 'network',
  'network engineer': 'network',
  'networking': 'network',
  'tcp/ip': 'network',
  'dns': 'network',
  'dhcp': 'network',
  'vpn': 'network',
  'lan': 'network',
  'wan': 'network',
  'routing': 'network',
  'switching': 'network',
  'cisco': 'network',
  'ccna': 'network',
  'ccnp': 'network',
  'juniper': 'network',
  'infrastructure': 'infrastructure',
  'infrastructure engineer': 'infrastructure',
  'it infrastructure': 'infrastructure',
  'datacenter': 'infrastructure',
  'data center': 'infrastructure',
  'virtualization': 'infrastructure',
  'vmware': 'infrastructure',
  'hyper-v': 'infrastructure',
  'proxmox': 'infrastructure',
  'sre': 'sre',
  'site reliability': 'sre',
  'site reliability engineer': 'sre',
  'observability': 'sre',
  'on-call': 'sre',
  

  // Advanced/Research (NEW)
  'robotics': 'robotics',
  'robot': 'robotics',
  'ros': 'robotics',
  'robot operating system': 'robotics',
  'embedded systems': 'embedded',
  'embedded': 'embedded',
  'iot': 'embedded',
  'internet of things': 'embedded',
  'arduino': 'embedded',
  'raspberry pi': 'embedded',
  'microcontroller': 'embedded',
  'firmware': 'embedded',
  'embedded c': 'embedded',
  'rtos': 'embedded',

  // Other Professional Skills (NEW)
  'technical writing': 'technical-writing',
  'documentation': 'technical-writing',
  'technical documentation': 'technical-writing',
  'api documentation': 'technical-writing',
  'readme': 'technical-writing',
  'confluence': 'technical-writing',
  'it consulting': 'it-consulting',
  'consultant': 'it-consulting',
  'it consultant': 'it-consulting',
  'technology consultant': 'it-consulting',
  'advisory': 'it-consulting',
  'it audit': 'it-audit',
  'it auditor': 'it-audit',
  'compliance': 'it-audit',
  'sox': 'it-audit',
  'iso 27001': 'it-audit',
  'gdpr': 'it-audit',
};

// Keywords để xác định level kinh nghiệm
const EXPERIENCE_KEYWORDS = {
  senior: [
    'senior', 'lead', 'principal', 'architect', 'manager', 'head of',
    '5+ years', '6+ years', '7+ years', '8+ years', '9+ years', '10+ years',
    'team lead', 'technical lead', 'engineering manager', 'cto', 'staff engineer',
    '5 years', '6 years', '7 years', '8 years', '9 years', '10 years'
  ],
  mid: [
    'mid-level', 'mid level', 'intermediate', 'software engineer', 'developer',
    '2-5 years', '3-5 years', '2+ years', '3+ years', '4+ years',
    '2 years', '3 years', '4 years', '5 years',
    'full stack', 'backend engineer', 'frontend engineer', 'full-stack'
  ],
  junior: [
    'junior', 'entry-level', 'entry level', 'fresh graduate', 'intern', 'trainee',
    '0-2 years', '1 year', 'recent graduate', 'new graduate', '0-1 year',
    'fresher', 'graduate'
  ]
};

export async function extractTextFromFile(file: File): Promise<ExtractedText> {
  const text = await readFileContent(file);
  
  // Use AI-enhanced analysis for better skill detection
  try {
    const aiAnalysis = await analyzeSkillsWithAI(text);
    return {
      content: text,
      skills: aiAnalysis.detectedSkills
    };
  } catch (error) {
    console.error('AI analysis failed, using keyword extraction:', error);
    const skills = extractSkillsFromText(text);
    return {
      content: text,
      skills
    };
  }
}

async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result as string;
      resolve(result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    if (file.type === 'application/pdf') {
      // For PDF files, read as ArrayBuffer and extract text
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          // Simple PDF text extraction (basic implementation)
          // In a real app, you'd use pdf-lib or pdfjs-dist
          const text = await extractTextFromPDF(arrayBuffer);
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // For DOCX files, read as ArrayBuffer
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          // Simple DOCX text extraction
          const text = await extractTextFromDOCX(arrayBuffer);
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // For text files
      reader.readAsText(file);
    }
  });
}

// Simple PDF text extraction (basic implementation)
async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    // This is a very basic PDF text extraction
    // In production, use pdfjs-dist library
    const uint8Array = new Uint8Array(arrayBuffer);
    const text = new TextDecoder().decode(uint8Array);
    
    // Extract readable text between stream objects
    const textMatches = text.match(/stream\s*\n([\s\S]*?)\nendstream/g);
    let extractedText = '';
    
    if (textMatches) {
      textMatches.forEach(match => {
        const content = match.replace(/stream\s*\n/, '').replace(/\nendstream/, '');
        // Simple text extraction - remove control characters
        const readable = content.replace(/[^\x20-\x7E\n]/g, ' ');
        extractedText += readable + ' ';
      });
    }
    
    return extractedText || 'Unable to extract text from PDF. Please try uploading a text file or DOCX.';
  } catch (error) {
    console.error('PDF extraction error:', error);
    return 'Error reading PDF file. Please try a different format.';
  }
}

// Simple DOCX text extraction (basic implementation)
async function extractTextFromDOCX(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    // This is a very basic DOCX text extraction
    // In production, use mammoth.js or docx library
    const uint8Array = new Uint8Array(arrayBuffer);
    const text = new TextDecoder().decode(uint8Array);
    
    // Extract text from XML content
    const xmlMatches = text.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
    let extractedText = '';
    
    if (xmlMatches) {
      xmlMatches.forEach(match => {
        const content = match.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, '');
        extractedText += content + ' ';
      });
    }
    
    return extractedText || 'Unable to extract text from DOCX. Please try uploading a text file.';
  } catch (error) {
    console.error('DOCX extraction error:', error);
    return 'Error reading DOCX file. Please try a different format.';
  }
}

function extractSkillsFromText(text: string): string[] {
  const lowerText = text.toLowerCase();
  const detectedSkills: string[] = [];
  
  Object.keys(SKILL_CATEGORY_MAP).forEach(skill => {
    if (lowerText.includes(skill)) {
      detectedSkills.push(skill);
    }
  });
  
  return [...new Set(detectedSkills)]; // Remove duplicates
}

export function analyzeSkills(extractedText: ExtractedText): SkillAnalysis {
  const { content, skills } = extractedText;
  const lowerContent = content.toLowerCase();
  
  // Count occurrences per category
  const categoryCount: Record<string, number> = {};
  
  skills.forEach(skill => {
    const category = SKILL_CATEGORY_MAP[skill];
    if (category) {
      categoryCount[category]++;
    }
  });
  
  // Sort categories by frequency
  const sortedCategories = Object.entries(categoryCount)
    .filter(([_, count]) => count > 0)
    .sort(([_, a], [__, b]) => b - a)
    .map(([category, _]) => category as QuizCategory);
  
  const primaryCategory = sortedCategories[0] || 'javascript';
  const secondaryCategories = sortedCategories.slice(1, 3);
  
  // Determine experience level
  let experienceLevel: 'junior' | 'mid' | 'senior' = 'mid';
  let maxMatches = 0;
  
  Object.entries(EXPERIENCE_KEYWORDS).forEach(([level, keywords]) => {
    const matches = keywords.filter(keyword => 
      lowerContent.includes(keyword)
    ).length;
    
    if (matches > maxMatches) {
      maxMatches = matches;
      experienceLevel = level as 'junior' | 'mid' | 'senior';
    }
  });
  
  // Calculate confidence based on number of detected skills
  const confidence = Math.min(skills.length / 10, 1);
  
  return {
    detectedSkills: skills,
    primaryCategory,
    secondaryCategories,
    experienceLevel,
    confidence
  };
}

/**
 * AI-Enhanced CV Analysis using Gemini API
 * Provides more comprehensive skill detection than keyword matching
 */
export async function analyzeSkillsWithAI(cvText: string): Promise<SkillAnalysis> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn('Gemini API key not found, falling back to keyword analysis');
    const extractedText = { content: cvText, skills: extractSkillsFromText(cvText) };
    return analyzeSkills(extractedText);
  }

  const prompt = `You are an expert IT recruiter analyzing a CV/Resume. Your task is to:
1. Identify the PRIMARY job role/position this person is best suited for
2. Extract ALL technical skills comprehensively
3. Determine experience level accurately

**CRITICAL: PRIMARY ROLE IDENTIFICATION**
Analyze the CV and determine the MAIN job role from these categories:

💻 Programming & Development:
- "frontend" - If focuses on UI/UX, HTML/CSS, React/Vue/Angular (NOT just knowing them, but PRIMARY work)
- "backend" - If focuses on server-side, APIs, databases, business logic (Python/Java/Node.js backend development)
- "fullstack" - If EQUALLY strong in both frontend AND backend
- "mobile-dev" - If focuses on iOS/Android/Flutter/React Native app development
- "software-engineer" - General software development (if not clearly frontend/backend/fullstack)

⚙️ Infrastructure & Operations:
- "devops" - ONLY if PRIMARY role is CI/CD, infrastructure automation, deployment pipelines (not just using Docker/Git)
- "cloud" - If PRIMARY focus is cloud architecture, AWS/Azure/GCP services
- "system-admin" - If focuses on server administration, system maintenance
- "network" - If focuses on network engineering, routing, switching

🔒 Security:
- "cybersecurity" - If focuses on security analysis, threat detection
- "penetration-testing" - If focuses on ethical hacking, vulnerability testing

📊 Data:
- "data-analysis" - If focuses on business intelligence, data visualization, Excel/Power BI/Tableau
- "data-science" - If focuses on statistics, ML models, data research
- "data-engineering" - If focuses on ETL, data pipelines, data warehousing
- "machine-learning" - If PRIMARY work is ML model development
- "ai-engineering" - If focuses on AI systems, LLMs, chatbots

🎨 Design & Testing:
- "ui-ux-design" - If focuses on design, Figma, user research
- "qa-testing" - If focuses on manual/automated testing
- "automation-testing" - If PRIMARY focus is test automation

📋 Management:
- "project-management" - If focuses on PM, project coordination
- "product-management" - If focuses on product strategy, roadmap
- "agile-scrum" - If Scrum Master or Agile Coach

**SELECTION RULES:**
1. DevOps is ONLY selected if CV shows PRIMARY focus on CI/CD, Kubernetes, Terraform, infrastructure automation
2. Software Engineer who USES Docker/Git is NOT DevOps - they are "backend" or "fullstack"
3. Frontend Developer who knows Node.js is still "frontend" unless doing significant backend work
4. Someone with Python + Django + PostgreSQL is "backend", NOT devops even if they know Docker

CV Content:
${cvText.substring(0, 12000)}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "primaryRole": "one role from the list above that BEST matches this person's main job",
  "primaryRoleConfidence": "high|medium|low - how confident are you in this classification",
  "roleExplanation": "1-2 sentences explaining why you chose this primary role",
  "programmingLanguages": ["list ALL languages"],
  "frameworks": ["list ALL frameworks"],
  "databases": ["list ALL databases"],
  "tools": ["list ALL tools"],
  "cloudPlatforms": ["list ALL cloud services"],
  "experienceLevel": "junior|mid|senior",
  "yearsOfExperience": "X years or estimate",
  "allSkills": ["COMPREHENSIVE list of ALL technical skills"]
}

Analyze carefully. PRIMARY ROLE is the most important field.`;

  try {
    console.log('[analyzeSkillsWithAI] Calling Gemini API with retry logic...');
    const response = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 4096,
            topK: 40,
            topP: 0.95,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
          ]
        }),
      }
    );
    
    console.log('[analyzeSkillsWithAI] API call successful');

    const data = await response.json();
    console.log('[analyzeSkillsWithAI] Raw API response:', JSON.stringify(data, null, 2));
    
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      console.error('[analyzeSkillsWithAI] No response text from AI:', data);
      throw new Error('No response from AI');
    }

    console.log('[analyzeSkillsWithAI] AI response text:', aiResponse);

    // Extract JSON from response (remove markdown code blocks if present)
    let jsonStr = aiResponse.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\s*/i, '').replace(/```\s*$/, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\s*/i, '').replace(/```\s*$/, '');
    }

    console.log('[analyzeSkillsWithAI] Extracted JSON string:', jsonStr.substring(0, 500));

    const aiAnalysis = JSON.parse(jsonStr);
    console.log('[analyzeSkillsWithAI] Parsed AI analysis:', aiAnalysis);

    // Combine all detected skills
    const allDetectedSkills = [
      ...(aiAnalysis.programmingLanguages || []),
      ...(aiAnalysis.frameworks || []),
      ...(aiAnalysis.databases || []),
      ...(aiAnalysis.tools || []),
      ...(aiAnalysis.cloudPlatforms || []),
      ...(aiAnalysis.allSkills || [])
    ].map(s => s.toLowerCase());

    // Use AI's primary role determination (MOST IMPORTANT)
    let primaryCategory: QuizCategory = 'javascript'; // fallback
    
    // Map AI's primaryRole to our QuizCategory
    const roleMapping: Record<string, QuizCategory> = {
      'frontend': 'frontend',
      'backend': 'python', // or 'nodejs', 'java' based on detected languages
      'fullstack': 'react', // fullstack often uses React
      'software-engineer': 'javascript',
      'mobile-dev': 'mobile-dev',
      'devops': 'devops',
      'cloud': 'cloud',
      'system-admin': 'system-admin',
      'network': 'network',
      'cybersecurity': 'cybersecurity',
      'penetration-testing': 'penetration-testing',
      'data-analysis': 'data-analysis',
      'data-science': 'data-science',
      'data-engineering': 'data-engineering',
      'machine-learning': 'machine-learning',
      'ai-engineering': 'ai-engineering',
      'ui-ux-design': 'ui-ux-design',
      'qa-testing': 'qa-testing',
      'automation-testing': 'automation-testing',
      'project-management': 'project-management',
      'product-management': 'product-management',
      'agile-scrum': 'agile-scrum'
    };

    if (aiAnalysis.primaryRole && roleMapping[aiAnalysis.primaryRole.toLowerCase()]) {
      primaryCategory = roleMapping[aiAnalysis.primaryRole.toLowerCase()];
      
      // Special handling for backend - choose based on detected language
      if (aiAnalysis.primaryRole.toLowerCase() === 'backend') {
        const languages = (aiAnalysis.programmingLanguages || []).map((l: string) => l.toLowerCase());
        if (languages.includes('python')) primaryCategory = 'python';
        else if (languages.includes('java')) primaryCategory = 'java';
        else if (languages.includes('node.js') || languages.includes('nodejs')) primaryCategory = 'nodejs';
        else if (languages.includes('javascript') || languages.includes('typescript')) primaryCategory = 'nodejs';
      }
    }

    console.log('[AI Role Analysis]', {
      aiPrimaryRole: aiAnalysis.primaryRole,
      roleConfidence: aiAnalysis.primaryRoleConfidence,
      roleExplanation: aiAnalysis.roleExplanation,
      mappedCategory: primaryCategory
    });

    // Now count skills for secondary categories
    const categoryCount: Record<string, number> = {};
    
    allDetectedSkills.forEach(skill => {
      const category = SKILL_CATEGORY_MAP[skill];
      if (category && category !== primaryCategory) {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      }
    });

    // Sort secondary categories by frequency
    const sortedSecondary = Object.entries(categoryCount)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3)
      .map(([category, _]) => category as QuizCategory);

    const secondaryCategories = sortedSecondary;

    // Map AI experience level
    let experienceLevel: 'junior' | 'mid' | 'senior' = 'mid';
    if (aiAnalysis.experienceLevel) {
      experienceLevel = aiAnalysis.experienceLevel as 'junior' | 'mid' | 'senior';
    }

    // Calculate confidence based on AI's role confidence and skill detection quality
    let confidence = 0.5; // Base confidence for AI analysis
    
    // AI's confidence in role classification
    if (aiAnalysis.primaryRoleConfidence === 'high') confidence += 0.3;
    else if (aiAnalysis.primaryRoleConfidence === 'medium') confidence += 0.2;
    else if (aiAnalysis.primaryRoleConfidence === 'low') confidence += 0.1;
    
    // Quality of skill detection
    if ((aiAnalysis.programmingLanguages?.length || 0) > 0) confidence += 0.1;
    if ((aiAnalysis.frameworks?.length || 0) > 0) confidence += 0.05;
    if ((aiAnalysis.databases?.length || 0) > 0) confidence += 0.05;
    
    // Cap at 1.0
    confidence = Math.min(confidence, 1.0);
    
    // If no skills detected at all, lower confidence significantly
    if (allDetectedSkills.length === 0) {
      confidence = 0.1;
    }

    console.log('✅ AI Analysis Results:', {
      primaryRole: aiAnalysis.primaryRole,
      roleConfidence: aiAnalysis.primaryRoleConfidence,
      explanation: aiAnalysis.roleExplanation,
      mappedCategory: primaryCategory,
      secondaryCategories,
      experienceLevel,
      confidence: Math.round(confidence * 100) + '%',
      detectedSkillsCount: allDetectedSkills.length,
      breakdown: {
        languages: aiAnalysis.programmingLanguages?.length || 0,
        frameworks: aiAnalysis.frameworks?.length || 0,
        databases: aiAnalysis.databases?.length || 0,
        tools: aiAnalysis.tools?.length || 0,
        cloud: aiAnalysis.cloudPlatforms?.length || 0
      }
    });

    // If AI returned empty results, fallback to keyword matching
    if (allDetectedSkills.length === 0) {
      console.warn('[analyzeSkillsWithAI] AI returned no skills, falling back to keyword matching');
      const extractedText = { content: cvText, skills: extractSkillsFromText(cvText) };
      return analyzeSkills(extractedText);
    }

    return {
      detectedSkills: [...new Set(allDetectedSkills)], // Remove duplicates
      primaryCategory,
      secondaryCategories,
      experienceLevel,
      confidence,
      detailedSkills: {
        languages: aiAnalysis.programmingLanguages || [],
        frameworks: aiAnalysis.frameworks || [],
        database: aiAnalysis.databases || [],
        tools: aiAnalysis.tools || [],
        devops: aiAnalysis.cloudPlatforms || []
      }
    };

  } catch (error) {
    console.error('AI analysis failed, falling back to keyword matching:', error);
    // Fallback to keyword-based analysis
    const extractedText = { content: cvText, skills: extractSkillsFromText(cvText) };
    return analyzeSkills(extractedText);
  }
}

export async function generatePersonalizedQuestions(
  skillAnalysis: SkillAnalysis,
  count: number = 20
): Promise<any> {
  // This would integrate with AI service to generate questions
  // based on detected skills and experience level
  
  const prompt = `
  Generate ${count} technical interview questions based on:
  - Primary skill: ${skillAnalysis.primaryCategory}
  - Secondary skills: ${skillAnalysis.secondaryCategories.join(', ')}
  - Experience level: ${skillAnalysis.experienceLevel}
  - Detected skills: ${skillAnalysis.detectedSkills.slice(0, 10).join(', ')}
  
  Distribution:
  - 30% basic/fundamental questions
  - 40% intermediate questions  
  - 30% advanced questions
  
  Each question should include:
  - question text
  - 4 multiple choice options
  - correct answer index
  - detailed explanation
  - difficulty level (low/mid/high)
  `;
  
  // For now, return structure for integration
  return {
    prompt,
    skillAnalysis,
    questionCount: count
  };
}