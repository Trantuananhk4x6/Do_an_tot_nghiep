// Career Fields Data for Quiz

import { CareerField } from "../types/quiz.types";

export const CAREER_FIELDS: CareerField[] = [
  // ============================================
  // DEVELOPMENT & ENGINEERING
  // ============================================
  {
    id: "frontend",
    name: "Frontend Developer",
    nameVi: "Lập trình viên Frontend",
    nameJa: "フロントエンドデベロッパー",
    nameZh: "前端开发工程师",
    nameKo: "프론트엔드 개발자",
    icon: "🎨",
    description: "Build beautiful, responsive, and interactive user interfaces",
    categories: ["frontend", "javascript", "react", "typescript"],
    requiredSkills: ["HTML", "CSS", "JavaScript", "React/Vue/Angular"],
    niceToHaveSkills: ["TypeScript", "Tailwind", "NextJS", "Testing"],
    demandLevel: "high",
    growthRate: 15,
    avgSalary: { min: 15000000, max: 45000000, currency: "VND", period: "monthly" },
    topCompanies: ["VNG", "FPT", "Momo", "Tiki", "Shopee"],
    trends: ["Server Components", "AI-powered UI", "Web Animations", "Micro-frontends"]
  },
  {
    id: "backend",
    name: "Backend Developer",
    nameVi: "Lập trình viên Backend",
    nameJa: "バックエンドデベロッパー",
    nameZh: "后端开发工程师",
    nameKo: "백엔드 개발자",
    icon: "⚙️",
    description: "Design and build server-side logic, APIs, and databases",
    categories: ["nodejs", "python", "java", "database"],
    requiredSkills: ["Node.js/Python/Java", "SQL", "REST APIs", "Database Design"],
    niceToHaveSkills: ["GraphQL", "Redis", "Message Queues", "Docker"],
    demandLevel: "high",
    growthRate: 18,
    avgSalary: { min: 18000000, max: 55000000, currency: "VND", period: "monthly" },
    topCompanies: ["VNG", "FPT", "Grab", "VNPAY", "Shopee"],
    trends: ["Serverless", "Microservices", "GraphQL", "Event-driven Architecture"]
  },
  {
    id: "fullstack",
    name: "Full Stack Developer",
    nameVi: "Lập trình viên Full Stack",
    nameJa: "フルスタックデベロッパー",
    nameZh: "全栈开发工程师",
    nameKo: "풀스택 개발자",
    icon: "🔄",
    description: "Handle both frontend and backend development",
    categories: ["frontend", "nodejs", "react", "database"],
    requiredSkills: ["JavaScript", "React/Vue", "Node.js", "SQL/NoSQL"],
    niceToHaveSkills: ["TypeScript", "Docker", "AWS/GCP", "CI/CD"],
    demandLevel: "high",
    growthRate: 20,
    avgSalary: { min: 20000000, max: 60000000, currency: "VND", period: "monthly" },
    topCompanies: ["Shopee", "VNG", "Zalo", "Tiki", "Momo"],
    trends: ["JAMstack", "NextJS", "Supabase", "Edge Computing"]
  },
  {
    id: "mobile",
    name: "Mobile Developer",
    nameVi: "Lập trình viên Mobile",
    nameJa: "モバイルデベロッパー",
    nameZh: "移动开发工程师",
    nameKo: "모바일 개발자",
    icon: "📱",
    description: "Create native and cross-platform mobile applications",
    categories: ["mobile-dev", "react", "javascript"],
    requiredSkills: ["React Native/Flutter", "JavaScript/Dart", "Mobile UI/UX"],
    niceToHaveSkills: ["Swift", "Kotlin", "App Store optimization"],
    demandLevel: "high",
    growthRate: 22,
    avgSalary: { min: 18000000, max: 50000000, currency: "VND", period: "monthly" },
    topCompanies: ["Momo", "Zalo", "Grab", "Gojek", "Tiki"],
    trends: ["Flutter", "Compose Multiplatform", "AI on device", "AR/VR"]
  },

  // ============================================
  // DATA & AI
  // ============================================
  {
    id: "data-science",
    name: "Data Scientist",
    nameVi: "Nhà khoa học dữ liệu",
    nameJa: "データサイエンティスト",
    nameZh: "数据科学家",
    nameKo: "데이터 과학자",
    icon: "📊",
    description: "Extract insights from data using statistics and machine learning",
    categories: ["data-science", "python", "machine-learning"],
    requiredSkills: ["Python", "Statistics", "Machine Learning", "Data Visualization"],
    niceToHaveSkills: ["Deep Learning", "SQL", "Spark", "Cloud ML platforms"],
    demandLevel: "high",
    growthRate: 25,
    avgSalary: { min: 25000000, max: 70000000, currency: "VND", period: "monthly" },
    topCompanies: ["FPT AI", "VinAI", "Momo", "VNG", "Grab"],
    trends: ["LLMs", "MLOps", "AutoML", "Explainable AI"]
  },
  {
    id: "data-engineer",
    name: "Data Engineer",
    nameVi: "Kỹ sư dữ liệu",
    nameJa: "データエンジニア",
    nameZh: "数据工程师",
    nameKo: "데이터 엔지니어",
    icon: "🔧",
    description: "Build and maintain data pipelines and infrastructure",
    categories: ["data-engineering", "python", "database"],
    requiredSkills: ["Python/Scala", "SQL", "ETL/ELT", "Data Warehousing"],
    niceToHaveSkills: ["Spark", "Airflow", "Kafka", "Cloud platforms"],
    demandLevel: "high",
    growthRate: 28,
    avgSalary: { min: 25000000, max: 65000000, currency: "VND", period: "monthly" },
    topCompanies: ["Grab", "Shopee", "VNG", "FPT", "Tiki"],
    trends: ["Real-time processing", "Data mesh", "Lakehouse", "Streaming ETL"]
  },
  {
    id: "ml-engineer",
    name: "ML Engineer",
    nameVi: "Kỹ sư Machine Learning",
    nameJa: "MLエンジニア",
    nameZh: "机器学习工程师",
    nameKo: "머신러닝 엔지니어",
    icon: "🤖",
    description: "Deploy and optimize machine learning models in production",
    categories: ["machine-learning", "python", "devops"],
    requiredSkills: ["Python", "ML Frameworks", "MLOps", "Model Optimization"],
    niceToHaveSkills: ["Kubernetes", "TensorFlow/PyTorch", "Cloud ML", "Docker"],
    demandLevel: "high",
    growthRate: 30,
    avgSalary: { min: 30000000, max: 80000000, currency: "VND", period: "monthly" },
    topCompanies: ["VinAI", "FPT AI", "Zalo AI", "VNG", "Grab"],
    trends: ["LLM deployment", "Edge ML", "MLOps", "Federated Learning"]
  },
  {
    id: "ai-engineer",
    name: "AI Engineer",
    nameVi: "Kỹ sư AI",
    nameJa: "AIエンジニア",
    nameZh: "AI工程师",
    nameKo: "AI 엔지니어",
    icon: "🧠",
    description: "Build intelligent systems using AI and deep learning",
    categories: ["ai-engineering", "machine-learning", "python"],
    requiredSkills: ["Deep Learning", "Python", "Neural Networks", "AI Frameworks"],
    niceToHaveSkills: ["NLP", "Computer Vision", "LLMs", "Reinforcement Learning"],
    demandLevel: "high",
    growthRate: 35,
    avgSalary: { min: 35000000, max: 100000000, currency: "VND", period: "monthly" },
    topCompanies: ["VinAI", "FPT AI", "Zalo AI", "Google Vietnam", "Microsoft"],
    trends: ["Generative AI", "LLM fine-tuning", "Multimodal AI", "AI Agents"]
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    nameVi: "Chuyên viên phân tích dữ liệu",
    nameJa: "データアナリスト",
    nameZh: "数据分析师",
    nameKo: "데이터 분석가",
    icon: "📈",
    description: "Analyze data to provide business insights and recommendations",
    categories: ["data-analysis", "database"],
    requiredSkills: ["SQL", "Excel", "Data Visualization", "Statistics basics"],
    niceToHaveSkills: ["Python", "Power BI", "Tableau", "A/B Testing"],
    demandLevel: "high",
    growthRate: 18,
    avgSalary: { min: 15000000, max: 40000000, currency: "VND", period: "monthly" },
    topCompanies: ["Shopee", "VNG", "Momo", "Tiki", "FPT"],
    trends: ["Self-service BI", "Data storytelling", "Real-time dashboards"]
  },

  // ============================================
  // DEVOPS & INFRASTRUCTURE
  // ============================================
  {
    id: "devops",
    name: "DevOps Engineer",
    nameVi: "Kỹ sư DevOps",
    nameJa: "DevOpsエンジニア",
    nameZh: "DevOps工程师",
    nameKo: "DevOps 엔지니어",
    icon: "🔄",
    description: "Bridge development and operations for faster, reliable delivery",
    categories: ["devops", "cloud"],
    requiredSkills: ["CI/CD", "Docker", "Kubernetes", "Cloud Platforms"],
    niceToHaveSkills: ["Terraform", "Ansible", "Monitoring", "Scripting"],
    demandLevel: "high",
    growthRate: 24,
    avgSalary: { min: 25000000, max: 70000000, currency: "VND", period: "monthly" },
    topCompanies: ["VNG", "FPT", "Grab", "Shopee", "Tiki"],
    trends: ["GitOps", "Platform Engineering", "FinOps", "DevSecOps"]
  },
  {
    id: "cloud",
    name: "Cloud Engineer",
    nameVi: "Kỹ sư Cloud",
    nameJa: "クラウドエンジニア",
    nameZh: "云工程师",
    nameKo: "클라우드 엔지니어",
    icon: "☁️",
    description: "Design and manage cloud infrastructure and services",
    categories: ["cloud", "devops"],
    requiredSkills: ["AWS/Azure/GCP", "Networking", "Security", "IaC"],
    niceToHaveSkills: ["Kubernetes", "Serverless", "Cost Optimization"],
    demandLevel: "high",
    growthRate: 26,
    avgSalary: { min: 28000000, max: 75000000, currency: "VND", period: "monthly" },
    topCompanies: ["AWS Vietnam", "Microsoft", "Google", "VNG", "FPT"],
    trends: ["Multi-cloud", "Serverless", "Edge computing", "Cloud-native"]
  },
  {
    id: "sre",
    name: "Site Reliability Engineer",
    nameVi: "Kỹ sư SRE",
    nameJa: "SREエンジニア",
    nameZh: "站点可靠性工程师",
    nameKo: "SRE 엔지니어",
    icon: "🛡️",
    description: "Ensure reliability, availability, and performance of systems",
    categories: ["sre", "devops", "cloud"],
    requiredSkills: ["Monitoring", "Incident Response", "Automation", "SLOs/SLIs"],
    niceToHaveSkills: ["Chaos Engineering", "Performance Tuning", "On-call"],
    demandLevel: "high",
    growthRate: 20,
    avgSalary: { min: 30000000, max: 80000000, currency: "VND", period: "monthly" },
    topCompanies: ["Google", "Grab", "Shopee", "VNG", "Tiki"],
    trends: ["Observability", "AIOps", "Chaos Engineering", "SLO-driven development"]
  },

  // ============================================
  // SECURITY
  // ============================================
  {
    id: "security",
    name: "Security Engineer",
    nameVi: "Kỹ sư bảo mật",
    nameJa: "セキュリティエンジニア",
    nameZh: "安全工程师",
    nameKo: "보안 엔지니어",
    icon: "🔒",
    description: "Protect systems and data from security threats",
    categories: ["cybersecurity", "security-engineering"],
    requiredSkills: ["Security fundamentals", "Vulnerability assessment", "SIEM"],
    niceToHaveSkills: ["Penetration testing", "Cloud security", "Compliance"],
    demandLevel: "high",
    growthRate: 22,
    avgSalary: { min: 25000000, max: 65000000, currency: "VND", period: "monthly" },
    topCompanies: ["Viettel Cyber Security", "FPT", "CMC", "VNG"],
    trends: ["Zero Trust", "Cloud Security", "AI-powered security", "DevSecOps"]
  },
  {
    id: "pentester",
    name: "Penetration Tester",
    nameVi: "Chuyên viên kiểm thử xâm nhập",
    nameJa: "ペネトレーションテスター",
    nameZh: "渗透测试工程师",
    nameKo: "침투 테스터",
    icon: "🎯",
    description: "Find and exploit security vulnerabilities ethically",
    categories: ["penetration-testing", "cybersecurity"],
    requiredSkills: ["Web security", "Network security", "Scripting", "Report writing"],
    niceToHaveSkills: ["Mobile security", "Cloud security", "CTF experience"],
    demandLevel: "medium",
    growthRate: 18,
    avgSalary: { min: 20000000, max: 55000000, currency: "VND", period: "monthly" },
    topCompanies: ["Viettel Cyber Security", "VNCS", "FPT IS", "NCC"],
    trends: ["Bug bounty", "AI in pentesting", "Cloud pentesting"]
  },

  // ============================================
  // QA & TESTING
  // ============================================
  {
    id: "qa",
    name: "QA Engineer",
    nameVi: "Kỹ sư QA",
    nameJa: "QAエンジニア",
    nameZh: "QA工程师",
    nameKo: "QA 엔지니어",
    icon: "✅",
    description: "Ensure software quality through comprehensive testing",
    categories: ["qa-testing", "automation-testing"],
    requiredSkills: ["Test planning", "Manual testing", "Bug tracking", "Test cases"],
    niceToHaveSkills: ["Automation", "API testing", "Performance testing"],
    demandLevel: "high",
    growthRate: 15,
    avgSalary: { min: 15000000, max: 40000000, currency: "VND", period: "monthly" },
    topCompanies: ["FPT", "VNG", "Shopee", "KMS", "TMA"],
    trends: ["Shift-left testing", "AI testing", "Continuous testing"]
  },
  {
    id: "automation-qa",
    name: "Automation QA",
    nameVi: "QA Automation",
    nameJa: "自動化QAエンジニア",
    nameZh: "自动化测试工程师",
    nameKo: "자동화 QA 엔지니어",
    icon: "🤖",
    description: "Build and maintain automated testing frameworks",
    categories: ["automation-testing", "qa-testing"],
    requiredSkills: ["Selenium/Cypress", "Programming", "CI/CD integration"],
    niceToHaveSkills: ["API automation", "Mobile automation", "Performance testing"],
    demandLevel: "high",
    growthRate: 20,
    avgSalary: { min: 18000000, max: 50000000, currency: "VND", period: "monthly" },
    topCompanies: ["FPT", "KMS", "TMA", "NashTech", "Harvey Nash"],
    trends: ["Codeless automation", "AI-powered testing", "Visual testing"]
  },

  // ============================================
  // DESIGN
  // ============================================
  {
    id: "ui-ux",
    name: "UI/UX Designer",
    nameVi: "Thiết kế UI/UX",
    nameJa: "UI/UXデザイナー",
    nameZh: "UI/UX设计师",
    nameKo: "UI/UX 디자이너",
    icon: "🎭",
    description: "Design intuitive and beautiful user experiences",
    categories: ["ui-ux-design", "web-design"],
    requiredSkills: ["Figma", "User Research", "Wireframing", "Prototyping"],
    niceToHaveSkills: ["Design Systems", "Animation", "Accessibility", "Usability Testing"],
    demandLevel: "high",
    growthRate: 18,
    avgSalary: { min: 15000000, max: 45000000, currency: "VND", period: "monthly" },
    topCompanies: ["Momo", "Zalo", "VNG", "Shopee", "Tiki"],
    trends: ["AI in design", "Design Systems", "Voice UI", "AR/VR interfaces"]
  },
  {
    id: "product-design",
    name: "Product Designer",
    nameVi: "Product Designer",
    nameJa: "プロダクトデザイナー",
    nameZh: "产品设计师",
    nameKo: "프로덕트 디자이너",
    icon: "💡",
    description: "Design end-to-end product experiences",
    categories: ["product-design", "ui-ux-design"],
    requiredSkills: ["Product thinking", "UX/UI Design", "Research", "Collaboration"],
    niceToHaveSkills: ["Coding basics", "Data analysis", "A/B Testing"],
    demandLevel: "high",
    growthRate: 22,
    avgSalary: { min: 20000000, max: 55000000, currency: "VND", period: "monthly" },
    topCompanies: ["Momo", "Grab", "Shopee", "VNG", "Tiki"],
    trends: ["Design ops", "Product-led growth", "Generative design"]
  },

  // ============================================
  // MANAGEMENT
  // ============================================
  {
    id: "pm",
    name: "Project Manager",
    nameVi: "Quản lý dự án",
    nameJa: "プロジェクトマネージャー",
    nameZh: "项目经理",
    nameKo: "프로젝트 매니저",
    icon: "📋",
    description: "Lead projects from initiation to successful delivery",
    categories: ["project-management", "agile-scrum"],
    requiredSkills: ["Project planning", "Risk management", "Communication", "Stakeholder management"],
    niceToHaveSkills: ["Agile/Scrum", "PMP certification", "Technical background"],
    demandLevel: "high",
    growthRate: 12,
    avgSalary: { min: 25000000, max: 60000000, currency: "VND", period: "monthly" },
    topCompanies: ["FPT", "VNG", "Shopee", "KMS", "TMA"],
    trends: ["Hybrid methodologies", "AI project management", "Remote team management"]
  },
  {
    id: "product-manager",
    name: "Product Manager",
    nameVi: "Quản lý sản phẩm",
    nameJa: "プロダクトマネージャー",
    nameZh: "产品经理",
    nameKo: "프로덕트 매니저",
    icon: "🚀",
    description: "Define product vision and drive product success",
    categories: ["product-management"],
    requiredSkills: ["Product strategy", "User research", "Roadmapping", "Metrics"],
    niceToHaveSkills: ["Technical background", "Data analysis", "A/B Testing"],
    demandLevel: "high",
    growthRate: 20,
    avgSalary: { min: 30000000, max: 80000000, currency: "VND", period: "monthly" },
    topCompanies: ["Momo", "VNG", "Grab", "Shopee", "Tiki"],
    trends: ["Product-led growth", "AI products", "Data-driven PM"]
  },
  {
    id: "scrum-master",
    name: "Scrum Master",
    nameVi: "Scrum Master",
    nameJa: "スクラムマスター",
    nameZh: "Scrum Master",
    nameKo: "스크럼 마스터",
    icon: "🏃",
    description: "Facilitate Agile teams and remove impediments",
    categories: ["agile-scrum", "project-management"],
    requiredSkills: ["Scrum framework", "Facilitation", "Coaching", "Agile mindset"],
    niceToHaveSkills: ["CSM/PSM certification", "SAFe", "Technical background"],
    demandLevel: "medium",
    growthRate: 15,
    avgSalary: { min: 25000000, max: 55000000, currency: "VND", period: "monthly" },
    topCompanies: ["FPT", "VNG", "TMA", "NashTech", "KMS"],
    trends: ["Agile at scale", "Remote Agile", "Value-driven delivery"]
  },

  // ============================================
  // IT SUPPORT
  // ============================================
  {
    id: "it-support",
    name: "IT Support",
    nameVi: "Hỗ trợ kỹ thuật IT",
    nameJa: "ITサポート",
    nameZh: "IT支持工程师",
    nameKo: "IT 지원",
    icon: "🛠️",
    description: "Provide technical assistance and troubleshooting",
    categories: ["it-support", "technical-support"],
    requiredSkills: ["Troubleshooting", "Customer service", "Hardware/Software knowledge"],
    niceToHaveSkills: ["Networking basics", "Scripting", "Active Directory"],
    demandLevel: "high",
    growthRate: 8,
    avgSalary: { min: 10000000, max: 25000000, currency: "VND", period: "monthly" },
    topCompanies: ["FPT", "CMC", "TMA", "VNG", "Various enterprises"],
    trends: ["Remote support", "AI-powered helpdesk", "Self-service portals"]
  },
  {
    id: "system-admin",
    name: "System Administrator",
    nameVi: "Quản trị hệ thống",
    nameJa: "システム管理者",
    nameZh: "系统管理员",
    nameKo: "시스템 관리자",
    icon: "🖥️",
    description: "Manage and maintain IT infrastructure",
    categories: ["system-admin", "infrastructure"],
    requiredSkills: ["Linux/Windows", "Networking", "Scripting", "Virtualization"],
    niceToHaveSkills: ["Cloud", "Containers", "Automation", "Security"],
    demandLevel: "medium",
    growthRate: 10,
    avgSalary: { min: 15000000, max: 40000000, currency: "VND", period: "monthly" },
    topCompanies: ["FPT", "VNG", "CMC", "Viettel", "Banks"],
    trends: ["Infrastructure as Code", "Cloud migration", "Hybrid infrastructure"]
  },

  // ============================================
  // SOFTWARE ENGINEERING (SPECIALIZED)
  // ============================================
  {
    id: "software-engineer",
    name: "Software Engineer",
    nameVi: "Kỹ sư phần mềm",
    nameJa: "ソフトウェアエンジニア",
    nameZh: "软件工程师",
    nameKo: "소프트웨어 엔지니어",
    icon: "💻",
    description: "Design, develop, and maintain software systems",
    categories: ["software-engineering", "programming"],
    requiredSkills: ["Programming", "Data Structures", "Algorithms", "System Design"],
    niceToHaveSkills: ["Clean Code", "Design Patterns", "Testing", "Documentation"],
    demandLevel: "high",
    growthRate: 20,
    avgSalary: { min: 20000000, max: 60000000, currency: "VND", period: "monthly" },
    topCompanies: ["Google", "Microsoft", "VNG", "Grab", "Shopee"],
    trends: ["AI-assisted coding", "Low-code platforms", "Clean Architecture"]
  },
  {
    id: "java-developer",
    name: "Java Developer",
    nameVi: "Lập trình viên Java",
    nameJa: "Javaデベロッパー",
    nameZh: "Java开发工程师",
    nameKo: "자바 개발자",
    icon: "☕",
    description: "Build enterprise applications using Java ecosystem",
    categories: ["java", "backend", "enterprise"],
    requiredSkills: ["Java", "Spring Boot", "SQL", "REST APIs"],
    niceToHaveSkills: ["Microservices", "Kafka", "Docker", "Kubernetes"],
    demandLevel: "high",
    growthRate: 15,
    avgSalary: { min: 18000000, max: 55000000, currency: "VND", period: "monthly" },
    topCompanies: ["FPT", "VNG", "TMA", "KMS", "Viettel"],
    trends: ["Spring Boot 3", "GraalVM", "Reactive programming", "Virtual Threads"]
  },
  {
    id: "python-developer",
    name: "Python Developer",
    nameVi: "Lập trình viên Python",
    nameJa: "Pythonデベロッパー",
    nameZh: "Python开发工程师",
    nameKo: "파이썬 개발자",
    icon: "🐍",
    description: "Build applications and scripts using Python",
    categories: ["python", "backend", "scripting"],
    requiredSkills: ["Python", "Django/FastAPI", "SQL", "REST APIs"],
    niceToHaveSkills: ["Data processing", "Automation", "Testing", "Async programming"],
    demandLevel: "high",
    growthRate: 22,
    avgSalary: { min: 18000000, max: 55000000, currency: "VND", period: "monthly" },
    topCompanies: ["FPT AI", "VNG", "Grab", "Shopee", "Momo"],
    trends: ["FastAPI", "AI/ML integration", "Async Python", "Type hints"]
  },
  {
    id: "dotnet-developer",
    name: ".NET Developer",
    nameVi: "Lập trình viên .NET",
    nameJa: ".NETデベロッパー",
    nameZh: ".NET开发工程师",
    nameKo: ".NET 개발자",
    icon: "🔷",
    description: "Build enterprise applications using .NET ecosystem",
    categories: ["dotnet", "csharp", "backend"],
    requiredSkills: ["C#", ".NET Core", "SQL Server", "REST APIs"],
    niceToHaveSkills: ["Azure", "Entity Framework", "Blazor", "Microservices"],
    demandLevel: "high",
    growthRate: 14,
    avgSalary: { min: 18000000, max: 55000000, currency: "VND", period: "monthly" },
    topCompanies: ["FPT", "TMA", "KMS", "NashTech", "CMC"],
    trends: [".NET 8", "Blazor", "MAUI", "Minimal APIs"]
  },
  {
    id: "golang-developer",
    name: "Golang Developer",
    nameVi: "Lập trình viên Golang",
    nameJa: "Golangデベロッパー",
    nameZh: "Golang开发工程师",
    nameKo: "Golang 개발자",
    icon: "🐹",
    description: "Build high-performance systems using Go",
    categories: ["golang", "backend", "systems"],
    requiredSkills: ["Go", "Concurrency", "REST/gRPC", "SQL"],
    niceToHaveSkills: ["Kubernetes", "Docker", "Microservices", "Cloud"],
    demandLevel: "high",
    growthRate: 28,
    avgSalary: { min: 25000000, max: 70000000, currency: "VND", period: "monthly" },
    topCompanies: ["Grab", "Shopee", "VNG", "Google", "Uber"],
    trends: ["Cloud-native", "Microservices", "High concurrency", "gRPC"]
  },
  {
    id: "rust-developer",
    name: "Rust Developer",
    nameVi: "Lập trình viên Rust",
    nameJa: "Rustデベロッパー",
    nameZh: "Rust开发工程师",
    nameKo: "Rust 개발자",
    icon: "🦀",
    description: "Build safe and performant systems using Rust",
    categories: ["rust", "systems", "backend"],
    requiredSkills: ["Rust", "Memory management", "Concurrency", "Systems programming"],
    niceToHaveSkills: ["WebAssembly", "Embedded", "Networking", "Async Rust"],
    demandLevel: "medium",
    growthRate: 35,
    avgSalary: { min: 30000000, max: 80000000, currency: "VND", period: "monthly" },
    topCompanies: ["Cloudflare", "Discord", "Meta", "Amazon", "Microsoft"],
    trends: ["WebAssembly", "Embedded systems", "Cloud infrastructure", "Blockchain"]
  },
  {
    id: "php-developer",
    name: "PHP Developer",
    nameVi: "Lập trình viên PHP",
    nameJa: "PHPデベロッパー",
    nameZh: "PHP开发工程师",
    nameKo: "PHP 개발자",
    icon: "🐘",
    description: "Build web applications using PHP ecosystem",
    categories: ["php", "backend", "web"],
    requiredSkills: ["PHP", "Laravel/Symfony", "MySQL", "REST APIs"],
    niceToHaveSkills: ["Redis", "Queue systems", "Docker", "Testing"],
    demandLevel: "medium",
    growthRate: 8,
    avgSalary: { min: 12000000, max: 40000000, currency: "VND", period: "monthly" },
    topCompanies: ["FPT", "TMA", "CMC", "Shopee", "Various startups"],
    trends: ["Laravel 11", "PHP 8.3", "API-first", "Headless CMS"]
  },
  {
    id: "ruby-developer",
    name: "Ruby Developer",
    nameVi: "Lập trình viên Ruby",
    nameJa: "Rubyデベロッパー",
    nameZh: "Ruby开发工程师",
    nameKo: "Ruby 개발자",
    icon: "💎",
    description: "Build web applications using Ruby on Rails",
    categories: ["ruby", "rails", "backend"],
    requiredSkills: ["Ruby", "Rails", "PostgreSQL", "REST APIs"],
    niceToHaveSkills: ["Sidekiq", "Redis", "Testing", "Docker"],
    demandLevel: "low",
    growthRate: 5,
    avgSalary: { min: 18000000, max: 50000000, currency: "VND", period: "monthly" },
    topCompanies: ["Shopify partners", "Various startups", "Tech agencies"],
    trends: ["Hotwire", "Rails 7", "ViewComponent", "Stimulus"]
  },

  // ============================================
  // FRONTEND SPECIALIZED
  // ============================================
  {
    id: "react-developer",
    name: "React Developer",
    nameVi: "Lập trình viên React",
    nameJa: "Reactデベロッパー",
    nameZh: "React开发工程师",
    nameKo: "React 개발자",
    icon: "⚛️",
    description: "Build modern web applications using React ecosystem",
    categories: ["react", "frontend", "javascript"],
    requiredSkills: ["React", "JavaScript/TypeScript", "State Management", "CSS"],
    niceToHaveSkills: ["NextJS", "Testing", "GraphQL", "Performance"],
    demandLevel: "high",
    growthRate: 18,
    avgSalary: { min: 18000000, max: 50000000, currency: "VND", period: "monthly" },
    topCompanies: ["VNG", "Shopee", "Momo", "Tiki", "Grab"],
    trends: ["React 19", "Server Components", "Suspense", "Concurrent features"]
  },
  {
    id: "vue-developer",
    name: "Vue.js Developer",
    nameVi: "Lập trình viên Vue.js",
    nameJa: "Vue.jsデベロッパー",
    nameZh: "Vue.js开发工程师",
    nameKo: "Vue.js 개발자",
    icon: "💚",
    description: "Build web applications using Vue.js ecosystem",
    categories: ["vue", "frontend", "javascript"],
    requiredSkills: ["Vue.js", "JavaScript/TypeScript", "Vuex/Pinia", "CSS"],
    niceToHaveSkills: ["Nuxt.js", "Testing", "Composition API", "Performance"],
    demandLevel: "medium",
    growthRate: 15,
    avgSalary: { min: 15000000, max: 45000000, currency: "VND", period: "monthly" },
    topCompanies: ["VNG", "FPT", "TMA", "Various startups"],
    trends: ["Vue 3", "Composition API", "Nuxt 3", "Vite"]
  },
  {
    id: "angular-developer",
    name: "Angular Developer",
    nameVi: "Lập trình viên Angular",
    nameJa: "Angularデベロッパー",
    nameZh: "Angular开发工程师",
    nameKo: "Angular 개발자",
    icon: "🔺",
    description: "Build enterprise web applications using Angular",
    categories: ["angular", "frontend", "typescript"],
    requiredSkills: ["Angular", "TypeScript", "RxJS", "SCSS"],
    niceToHaveSkills: ["NgRx", "Testing", "PWA", "Material Design"],
    demandLevel: "medium",
    growthRate: 10,
    avgSalary: { min: 18000000, max: 50000000, currency: "VND", period: "monthly" },
    topCompanies: ["FPT", "TMA", "KMS", "NashTech", "CMC"],
    trends: ["Standalone Components", "Signals", "SSR", "Ivy renderer"]
  },
  {
    id: "nextjs-developer",
    name: "Next.js Developer",
    nameVi: "Lập trình viên Next.js",
    nameJa: "Next.jsデベロッパー",
    nameZh: "Next.js开发工程师",
    nameKo: "Next.js 개발자",
    icon: "▲",
    description: "Build full-stack React applications with Next.js",
    categories: ["nextjs", "react", "fullstack"],
    requiredSkills: ["Next.js", "React", "TypeScript", "API Routes"],
    niceToHaveSkills: ["Vercel", "SSR/SSG", "Database", "Auth"],
    demandLevel: "high",
    growthRate: 30,
    avgSalary: { min: 20000000, max: 55000000, currency: "VND", period: "monthly" },
    topCompanies: ["VNG", "Momo", "Shopee", "Various startups"],
    trends: ["App Router", "Server Actions", "React Server Components", "Edge Runtime"]
  },

  // ============================================
  // MOBILE SPECIALIZED
  // ============================================
  {
    id: "ios-developer",
    name: "iOS Developer",
    nameVi: "Lập trình viên iOS",
    nameJa: "iOSデベロッパー",
    nameZh: "iOS开发工程师",
    nameKo: "iOS 개발자",
    icon: "🍎",
    description: "Build native iOS applications",
    categories: ["ios", "mobile", "swift"],
    requiredSkills: ["Swift", "UIKit/SwiftUI", "Xcode", "iOS SDK"],
    niceToHaveSkills: ["Core Data", "ARKit", "App Store", "Combine"],
    demandLevel: "high",
    growthRate: 15,
    avgSalary: { min: 20000000, max: 55000000, currency: "VND", period: "monthly" },
    topCompanies: ["Momo", "Zalo", "Grab", "Shopee", "Tiki"],
    trends: ["SwiftUI", "Async/await", "Vision Pro", "WidgetKit"]
  },
  {
    id: "android-developer",
    name: "Android Developer",
    nameVi: "Lập trình viên Android",
    nameJa: "Androidデベロッパー",
    nameZh: "Android开发工程师",
    nameKo: "안드로이드 개발자",
    icon: "🤖",
    description: "Build native Android applications",
    categories: ["android", "mobile", "kotlin"],
    requiredSkills: ["Kotlin", "Android SDK", "Jetpack Compose", "Android Studio"],
    niceToHaveSkills: ["Coroutines", "Room", "Play Store", "KMM"],
    demandLevel: "high",
    growthRate: 15,
    avgSalary: { min: 18000000, max: 50000000, currency: "VND", period: "monthly" },
    topCompanies: ["Momo", "Zalo", "Grab", "Shopee", "Tiki"],
    trends: ["Jetpack Compose", "Kotlin Multiplatform", "Material You", "Wear OS"]
  },
  {
    id: "flutter-developer",
    name: "Flutter Developer",
    nameVi: "Lập trình viên Flutter",
    nameJa: "Flutterデベロッパー",
    nameZh: "Flutter开发工程师",
    nameKo: "Flutter 개발자",
    icon: "🦋",
    description: "Build cross-platform apps with Flutter",
    categories: ["flutter", "dart", "mobile"],
    requiredSkills: ["Dart", "Flutter", "State Management", "Mobile UI"],
    niceToHaveSkills: ["Native integration", "Firebase", "Testing", "Animation"],
    demandLevel: "high",
    growthRate: 25,
    avgSalary: { min: 18000000, max: 50000000, currency: "VND", period: "monthly" },
    topCompanies: ["Momo", "VNG", "Grab", "Various startups"],
    trends: ["Flutter 3", "Impeller", "Platform views", "FFI"]
  },
  {
    id: "react-native-developer",
    name: "React Native Developer",
    nameVi: "Lập trình viên React Native",
    nameJa: "React Nativeデベロッパー",
    nameZh: "React Native开发工程师",
    nameKo: "React Native 개발자",
    icon: "📲",
    description: "Build cross-platform apps with React Native",
    categories: ["react-native", "mobile", "javascript"],
    requiredSkills: ["React Native", "JavaScript/TypeScript", "Mobile UI", "Native modules"],
    niceToHaveSkills: ["Redux/Zustand", "Expo", "Native code", "Testing"],
    demandLevel: "high",
    growthRate: 18,
    avgSalary: { min: 18000000, max: 50000000, currency: "VND", period: "monthly" },
    topCompanies: ["Shopee", "Momo", "VNG", "Various startups"],
    trends: ["New Architecture", "Fabric", "TurboModules", "Expo Router"]
  },

  // ============================================
  // GAME & CREATIVE TECH
  // ============================================
  {
    id: "game-developer",
    name: "Game Developer",
    nameVi: "Lập trình viên Game",
    nameJa: "ゲームデベロッパー",
    nameZh: "游戏开发工程师",
    nameKo: "게임 개발자",
    icon: "🎮",
    description: "Create video games for various platforms",
    categories: ["game-dev", "unity", "unreal"],
    requiredSkills: ["Unity/Unreal", "C#/C++", "Game Design", "3D Math"],
    niceToHaveSkills: ["Shader programming", "AI for games", "Networking", "Mobile games"],
    demandLevel: "medium",
    growthRate: 18,
    avgSalary: { min: 15000000, max: 50000000, currency: "VND", period: "monthly" },
    topCompanies: ["VNG", "Garena", "Amanotes", "Sparx*", "Glass Egg"],
    trends: ["Mobile gaming", "Cloud gaming", "AR/VR", "AI in games"]
  },
  {
    id: "unity-developer",
    name: "Unity Developer",
    nameVi: "Lập trình viên Unity",
    nameJa: "Unityデベロッパー",
    nameZh: "Unity开发工程师",
    nameKo: "Unity 개발자",
    icon: "🎲",
    description: "Build games and interactive experiences with Unity",
    categories: ["unity", "game-dev", "csharp"],
    requiredSkills: ["Unity", "C#", "Game Physics", "Animation"],
    niceToHaveSkills: ["AR/VR", "Shader Graph", "Multiplayer", "Mobile optimization"],
    demandLevel: "medium",
    growthRate: 15,
    avgSalary: { min: 15000000, max: 45000000, currency: "VND", period: "monthly" },
    topCompanies: ["VNG", "Amanotes", "Sparx*", "Glass Egg", "VTC"],
    trends: ["DOTS", "Unity 6", "XR development", "Multiplayer Netcode"]
  },
  {
    id: "ar-vr-developer",
    name: "AR/VR Developer",
    nameVi: "Lập trình viên AR/VR",
    nameJa: "AR/VRデベロッパー",
    nameZh: "AR/VR开发工程师",
    nameKo: "AR/VR 개발자",
    icon: "🥽",
    description: "Create immersive AR/VR experiences",
    categories: ["ar-vr", "3d", "game-dev"],
    requiredSkills: ["Unity/Unreal", "3D development", "AR/VR SDKs", "Spatial computing"],
    niceToHaveSkills: ["Computer Vision", "Hand tracking", "WebXR", "Optimization"],
    demandLevel: "medium",
    growthRate: 30,
    avgSalary: { min: 20000000, max: 55000000, currency: "VND", period: "monthly" },
    topCompanies: ["Meta", "Apple partners", "VNG", "Various studios"],
    trends: ["Vision Pro", "Quest 3", "WebXR", "Spatial computing"]
  },

  // ============================================
  // BLOCKCHAIN & WEB3
  // ============================================
  {
    id: "blockchain-developer",
    name: "Blockchain Developer",
    nameVi: "Lập trình viên Blockchain",
    nameJa: "ブロックチェーンデベロッパー",
    nameZh: "区块链开发工程师",
    nameKo: "블록체인 개발자",
    icon: "⛓️",
    description: "Build decentralized applications and smart contracts",
    categories: ["blockchain", "web3", "smart-contracts"],
    requiredSkills: ["Solidity/Rust", "Web3.js", "Smart Contracts", "Blockchain fundamentals"],
    niceToHaveSkills: ["DeFi", "NFT", "Layer 2", "Security auditing"],
    demandLevel: "medium",
    growthRate: 20,
    avgSalary: { min: 25000000, max: 80000000, currency: "VND", period: "monthly" },
    topCompanies: ["Sky Mavis", "Coin98", "Kyber Network", "Various crypto startups"],
    trends: ["Layer 2", "ZK proofs", "Account abstraction", "Cross-chain"]
  },
  {
    id: "smart-contract-developer",
    name: "Smart Contract Developer",
    nameVi: "Lập trình viên Smart Contract",
    nameJa: "スマートコントラクトデベロッパー",
    nameZh: "智能合约开发工程师",
    nameKo: "스마트 컨트랙트 개발자",
    icon: "📜",
    description: "Develop secure smart contracts for blockchain",
    categories: ["smart-contracts", "blockchain", "security"],
    requiredSkills: ["Solidity", "EVM", "Testing", "Security best practices"],
    niceToHaveSkills: ["Auditing", "Gas optimization", "Upgradeable patterns", "Foundry"],
    demandLevel: "medium",
    growthRate: 18,
    avgSalary: { min: 30000000, max: 90000000, currency: "VND", period: "monthly" },
    topCompanies: ["Sky Mavis", "Kyber Network", "Various DeFi protocols"],
    trends: ["Formal verification", "ZK contracts", "EIP standards", "Security"]
  },

  // ============================================
  // EMBEDDED & IOT
  // ============================================
  {
    id: "embedded-developer",
    name: "Embedded Developer",
    nameVi: "Lập trình viên nhúng",
    nameJa: "組み込みデベロッパー",
    nameZh: "嵌入式开发工程师",
    nameKo: "임베디드 개발자",
    icon: "🔌",
    description: "Develop software for embedded systems",
    categories: ["embedded", "c-cpp", "hardware"],
    requiredSkills: ["C/C++", "Microcontrollers", "RTOS", "Hardware interfaces"],
    niceToHaveSkills: ["Linux embedded", "IoT protocols", "Debug tools", "Assembly"],
    demandLevel: "medium",
    growthRate: 12,
    avgSalary: { min: 18000000, max: 50000000, currency: "VND", period: "monthly" },
    topCompanies: ["Samsung", "Intel", "LG", "Viettel", "VNPT"],
    trends: ["Edge AI", "RISC-V", "Rust embedded", "Matter protocol"]
  },
  {
    id: "iot-developer",
    name: "IoT Developer",
    nameVi: "Lập trình viên IoT",
    nameJa: "IoTデベロッパー",
    nameZh: "IoT开发工程师",
    nameKo: "IoT 개발자",
    icon: "📡",
    description: "Build Internet of Things solutions",
    categories: ["iot", "embedded", "cloud"],
    requiredSkills: ["IoT protocols", "Embedded systems", "Cloud IoT", "Sensors"],
    niceToHaveSkills: ["Edge computing", "Security", "Data processing", "ML on edge"],
    demandLevel: "medium",
    growthRate: 20,
    avgSalary: { min: 18000000, max: 50000000, currency: "VND", period: "monthly" },
    topCompanies: ["FPT", "Viettel", "VNPT", "Smart city projects"],
    trends: ["Edge AI", "5G IoT", "Digital twins", "Sustainability"]
  },

  // ============================================
  // DATABASE & BIG DATA
  // ============================================
  {
    id: "database-admin",
    name: "Database Administrator",
    nameVi: "Quản trị cơ sở dữ liệu",
    nameJa: "データベース管理者",
    nameZh: "数据库管理员",
    nameKo: "데이터베이스 관리자",
    icon: "🗄️",
    description: "Manage and optimize database systems",
    categories: ["database", "sql", "infrastructure"],
    requiredSkills: ["SQL", "Database tuning", "Backup/Recovery", "Security"],
    niceToHaveSkills: ["NoSQL", "Replication", "Cloud databases", "Automation"],
    demandLevel: "medium",
    growthRate: 10,
    avgSalary: { min: 18000000, max: 50000000, currency: "VND", period: "monthly" },
    topCompanies: ["Banks", "FPT", "VNG", "Enterprises"],
    trends: ["Cloud databases", "Automated DBA", "Database as Code"]
  },
  {
    id: "big-data-engineer",
    name: "Big Data Engineer",
    nameVi: "Kỹ sư Big Data",
    nameJa: "ビッグデータエンジニア",
    nameZh: "大数据工程师",
    nameKo: "빅데이터 엔지니어",
    icon: "📊",
    description: "Build and maintain big data infrastructure",
    categories: ["big-data", "data-engineering", "cloud"],
    requiredSkills: ["Spark", "Hadoop", "SQL", "Python/Scala"],
    niceToHaveSkills: ["Kafka", "Cloud platforms", "Data lakes", "Streaming"],
    demandLevel: "high",
    growthRate: 25,
    avgSalary: { min: 28000000, max: 70000000, currency: "VND", period: "monthly" },
    topCompanies: ["Grab", "Shopee", "VNG", "FPT", "Banks"],
    trends: ["Lakehouse", "Real-time analytics", "Data mesh", "Cost optimization"]
  },

  // ============================================
  // GRAPHICS & MEDIA
  // ============================================
  {
    id: "graphic-designer",
    name: "Graphic Designer",
    nameVi: "Thiết kế đồ họa",
    nameJa: "グラフィックデザイナー",
    nameZh: "平面设计师",
    nameKo: "그래픽 디자이너",
    icon: "🎨",
    description: "Create visual content for digital and print media",
    categories: ["graphic-design", "visual-design"],
    requiredSkills: ["Adobe Creative Suite", "Typography", "Color theory", "Layout"],
    niceToHaveSkills: ["Motion graphics", "3D basics", "Branding", "Print production"],
    demandLevel: "medium",
    growthRate: 10,
    avgSalary: { min: 12000000, max: 35000000, currency: "VND", period: "monthly" },
    topCompanies: ["Advertising agencies", "Tech companies", "Media companies"],
    trends: ["AI-assisted design", "Motion design", "3D graphics", "Generative art"]
  },
  {
    id: "motion-designer",
    name: "Motion Designer",
    nameVi: "Thiết kế Motion",
    nameJa: "モーションデザイナー",
    nameZh: "动效设计师",
    nameKo: "모션 디자이너",
    icon: "🎬",
    description: "Create animated graphics and visual effects",
    categories: ["motion-design", "animation", "video"],
    requiredSkills: ["After Effects", "Animation principles", "Typography", "Timing"],
    niceToHaveSkills: ["Cinema 4D", "Lottie", "WebGL", "3D animation"],
    demandLevel: "medium",
    growthRate: 15,
    avgSalary: { min: 15000000, max: 45000000, currency: "VND", period: "monthly" },
    topCompanies: ["Advertising agencies", "Tech companies", "Studios"],
    trends: ["Lottie animations", "Web animations", "3D motion", "AI motion"]
  },
  {
    id: "3d-artist",
    name: "3D Artist",
    nameVi: "Họa sĩ 3D",
    nameJa: "3Dアーティスト",
    nameZh: "3D美术师",
    nameKo: "3D 아티스트",
    icon: "🎭",
    description: "Create 3D models, textures, and animations",
    categories: ["3d-art", "game-dev", "visual-effects"],
    requiredSkills: ["3D modeling", "Texturing", "Lighting", "Rendering"],
    niceToHaveSkills: ["Animation", "Rigging", "Sculpting", "Real-time 3D"],
    demandLevel: "medium",
    growthRate: 15,
    avgSalary: { min: 15000000, max: 45000000, currency: "VND", period: "monthly" },
    topCompanies: ["Game studios", "Film studios", "Architecture firms", "VFX"],
    trends: ["Real-time rendering", "AI 3D", "Virtual production", "Metaverse"]
  },

  // ============================================
  // TECHNICAL WRITING & DOCS
  // ============================================
  {
    id: "technical-writer",
    name: "Technical Writer",
    nameVi: "Chuyên viên viết tài liệu kỹ thuật",
    nameJa: "テクニカルライター",
    nameZh: "技术文档工程师",
    nameKo: "테크니컬 라이터",
    icon: "📝",
    description: "Create technical documentation and content",
    categories: ["technical-writing", "documentation"],
    requiredSkills: ["Technical writing", "Documentation tools", "Research", "English"],
    niceToHaveSkills: ["API documentation", "Video tutorials", "Markdown", "Diagrams"],
    demandLevel: "medium",
    growthRate: 12,
    avgSalary: { min: 15000000, max: 40000000, currency: "VND", period: "monthly" },
    topCompanies: ["FPT", "VNG", "Tech companies", "SaaS companies"],
    trends: ["Docs as Code", "API docs", "Video tutorials", "AI writing"]
  },

  // ============================================
  // BUSINESS ANALYSIS
  // ============================================
  {
    id: "business-analyst",
    name: "Business Analyst",
    nameVi: "Chuyên viên phân tích nghiệp vụ",
    nameJa: "ビジネスアナリスト",
    nameZh: "业务分析师",
    nameKo: "비즈니스 분석가",
    icon: "📊",
    description: "Bridge business needs and technical solutions",
    categories: ["business-analysis", "requirements"],
    requiredSkills: ["Requirements gathering", "Documentation", "Communication", "Analysis"],
    niceToHaveSkills: ["SQL", "UML", "Agile", "Domain knowledge"],
    demandLevel: "high",
    growthRate: 15,
    avgSalary: { min: 18000000, max: 50000000, currency: "VND", period: "monthly" },
    topCompanies: ["FPT", "VNG", "Banks", "Consulting firms"],
    trends: ["Product BA", "Data-driven BA", "Agile BA", "Digital transformation"]
  },
  {
    id: "solutions-architect",
    name: "Solutions Architect",
    nameVi: "Kiến trúc sư giải pháp",
    nameJa: "ソリューションアーキテクト",
    nameZh: "解决方案架构师",
    nameKo: "솔루션 아키텍트",
    icon: "🏗️",
    description: "Design technical solutions for complex business problems",
    categories: ["architecture", "cloud", "enterprise"],
    requiredSkills: ["System design", "Cloud architecture", "Technical leadership", "Communication"],
    niceToHaveSkills: ["Multiple technologies", "Security", "Cost optimization", "Certifications"],
    demandLevel: "high",
    growthRate: 18,
    avgSalary: { min: 40000000, max: 100000000, currency: "VND", period: "monthly" },
    topCompanies: ["AWS", "Microsoft", "Google", "FPT", "Consulting"],
    trends: ["Cloud-native", "AI integration", "Event-driven", "Sustainability"]
  },

  // ============================================
  // NETWORK & INFRASTRUCTURE
  // ============================================
  {
    id: "network-engineer",
    name: "Network Engineer",
    nameVi: "Kỹ sư mạng",
    nameJa: "ネットワークエンジニア",
    nameZh: "网络工程师",
    nameKo: "네트워크 엔지니어",
    icon: "🌐",
    description: "Design and maintain network infrastructure",
    categories: ["networking", "infrastructure", "security"],
    requiredSkills: ["TCP/IP", "Routing/Switching", "Firewalls", "Network security"],
    niceToHaveSkills: ["Cloud networking", "SDN", "Automation", "Certifications"],
    demandLevel: "medium",
    growthRate: 10,
    avgSalary: { min: 18000000, max: 50000000, currency: "VND", period: "monthly" },
    topCompanies: ["Viettel", "VNPT", "FPT Telecom", "Enterprises"],
    trends: ["SD-WAN", "Zero Trust", "Cloud networking", "5G"]
  }
];

export function getFieldById(id: string): CareerField | undefined {
  return CAREER_FIELDS.find(f => f.id === id);
}

export function getFieldsByCategories(categories: string[]): CareerField[] {
  return CAREER_FIELDS.filter(field => 
    field.categories.some(cat => categories.includes(cat))
  );
}

export function getFieldName(field: CareerField, language: string): string {
  switch (language) {
    case 'vi': return field.nameVi;
    case 'ja': return field.nameJa;
    case 'zh': return field.nameZh;
    case 'ko': return field.nameKo;
    default: return field.name;
  }
}

export function getTopDemandFields(count: number = 5): CareerField[] {
  return CAREER_FIELDS
    .filter(f => f.demandLevel === 'high')
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, count);
}

export function formatSalaryRange(
  salary: { min: number; max: number; currency: string; period: string },
  language: string
): string {
  const formatNum = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(0) + 'M';
    }
    return num.toLocaleString();
  };

  const periodText = {
    vi: salary.period === 'monthly' ? '/tháng' : '/năm',
    en: salary.period === 'monthly' ? '/month' : '/year',
    ja: salary.period === 'monthly' ? '/月' : '/年',
    zh: salary.period === 'monthly' ? '/月' : '/年',
    ko: salary.period === 'monthly' ? '/월' : '/년',
  }[language] || '/month';

  return `${formatNum(salary.min)} - ${formatNum(salary.max)} ${salary.currency}${periodText}`;
}
