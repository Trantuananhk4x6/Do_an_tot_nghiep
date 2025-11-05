// CV Template Definitions with Enhanced Details

import { CVTemplate } from '../types/cv.types';

export interface TemplateInfo {
  id: CVTemplate;
  name: string;
  description: string;
  longDescription: string;
  features: string[];
  bestFor: string[];
  icon: string;
  color: string;
  previewImage: string;
  recommended?: boolean;
}

export const CV_TEMPLATES: TemplateInfo[] = [
  {
    id: 'ats-friendly',
    name: 'ATS-Friendly',
    description: 'Optimized for Applicant Tracking Systems',
    longDescription: 'Designed to pass through automated screening systems used by most companies. Uses standard fonts, simple layout, and keyword-friendly format.',
    features: [
      'Machine-readable format',
      'Standard fonts (Times New Roman)',
      'No graphics or complex layouts',
      'Keyword optimized',
      'ATS parsing friendly'
    ],
    bestFor: [
      'Tech companies',
      'Large corporations',
      'Online applications',
      'Entry-level positions'
    ],
    icon: '🤖',
    color: 'from-green-500 to-emerald-500',
    previewImage: '/templates/ats-preview.svg',
    recommended: true
  },
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Contemporary design with color accents',
    longDescription: 'Perfect balance of professionalism and modern aesthetics. Features colored header, clean typography, and visual hierarchy.',
    features: [
      'Colored header section',
      'Modern typography',
      'Visual hierarchy',
      'Professional appearance',
      'Eye-catching design'
    ],
    bestFor: [
      'Mid-level professionals',
      'Tech industry',
      'Startup jobs',
      'Creative roles'
    ],
    icon: '🎨',
    color: 'from-blue-500 to-cyan-500',
    previewImage: '/templates/modern-preview.svg'
  },
  {
    id: 'minimal',
    name: 'Clean Minimal',
    description: 'Simple and elegant design',
    longDescription: 'Less is more. Clean, uncluttered design that lets your achievements speak for themselves. Perfect for any industry.',
    features: [
      'Simple layout',
      'Easy to read',
      'Professional look',
      'Focus on content',
      'Timeless design'
    ],
    bestFor: [
      'All industries',
      'Senior positions',
      'Conservative fields',
      'Academic roles'
    ],
    icon: '📄',
    color: 'from-gray-500 to-slate-500',
    previewImage: '/templates/minimal-preview.svg'
  },
  {
    id: 'creative',
    name: 'Creative Bold',
    description: 'Stand out with unique design',
    longDescription: 'Bold colors, unique layout, and creative elements. Perfect for roles where creativity and design sense matter.',
    features: [
      'Unique layout',
      'Colorful design',
      'Creative elements',
      'Stands out',
      'Shows personality'
    ],
    bestFor: [
      'Designers',
      'Marketers',
      'Media professionals',
      'Creative agencies'
    ],
    icon: '✨',
    color: 'from-purple-500 to-pink-500',
    previewImage: '/templates/creative-preview.svg'
  },
  {
    id: 'professional',
    name: 'Executive Professional',
    description: 'Traditional format for corporate roles',
    longDescription: 'Classic, formal design for executive and senior-level positions. Conveys authority and professionalism.',
    features: [
      'Formal style',
      'Conservative design',
      'Traditional layout',
      'Trusted appearance',
      'Executive presence'
    ],
    bestFor: [
      'Executive positions',
      'Finance industry',
      'Legal field',
      'Consulting firms'
    ],
    icon: '💼',
    color: 'from-indigo-500 to-blue-600',
    previewImage: '/templates/professional-preview.svg'
  },
  // NEW TEMPLATES
  {
    id: 'tech-modern',
    name: 'Tech Minimalist',
    description: 'Clean tech-focused layout',
    longDescription: 'Designed for software engineers and tech professionals. Features clean code-like structure with technical skills emphasis.',
    features: [
      'Tech-focused layout',
      'Skills-first approach',
      'GitHub/Portfolio links prominent',
      'Projects showcase',
      'Developer-friendly'
    ],
    bestFor: [
      'Software Engineers',
      'Full Stack Developers',
      'DevOps Engineers',
      'Tech Startups'
    ],
    icon: '💻',
    color: 'from-cyan-500 to-blue-500',
    previewImage: '/templates/tech-preview.svg'
  },
  {
    id: 'two-column',
    name: 'Two Column Pro',
    description: 'Sidebar layout for maximum info',
    longDescription: 'Efficient two-column design that fits more information while maintaining readability. Perfect for experienced professionals.',
    features: [
      'Two-column layout',
      'Sidebar for skills',
      'More content density',
      'Visual separation',
      'Space efficient'
    ],
    bestFor: [
      'Senior Professionals',
      'Multi-skilled roles',
      'Career changers',
      'Detailed CVs'
    ],
    icon: '📊',
    color: 'from-teal-500 to-green-500',
    previewImage: '/templates/two-column-preview.svg'
  },
  {
    id: 'timeline',
    name: 'Timeline Style',
    description: 'Visual career progression',
    longDescription: 'Timeline-based layout that clearly shows your career journey and progression. Great for storytelling your experience.',
    features: [
      'Visual timeline',
      'Career progression focus',
      'Story-driven layout',
      'Achievement highlights',
      'Clear chronology'
    ],
    bestFor: [
      'Career progressors',
      'Leadership roles',
      'Long career history',
      'Project managers'
    ],
    icon: '📈',
    color: 'from-orange-500 to-red-500',
    previewImage: '/templates/timeline-preview.svg'
  },
  {
    id: 'infographic',
    name: 'Infographic Style',
    description: 'Visual data-driven CV',
    longDescription: 'Modern infographic approach with charts, icons, and visual elements. Perfect for roles requiring data visualization skills.',
    features: [
      'Visual data representation',
      'Skill charts',
      'Icons and graphics',
      'Modern aesthetic',
      'Attention-grabbing'
    ],
    bestFor: [
      'Data Analysts',
      'Marketing roles',
      'Visual designers',
      'Product Managers'
    ],
    icon: '📉',
    color: 'from-pink-500 to-rose-500',
    previewImage: '/templates/infographic-preview.svg'
  },
  {
    id: 'academic',
    name: 'Academic Scholar',
    description: 'Research-focused format',
    longDescription: 'Tailored for academics, researchers, and scientists. Emphasizes publications, research, and academic achievements.',
    features: [
      'Publications section',
      'Research emphasis',
      'Academic credentials',
      'Conference presentations',
      'Formal structure'
    ],
    bestFor: [
      'PhD candidates',
      'Researchers',
      'University professors',
      'Scientific roles'
    ],
    icon: '🎓',
    color: 'from-violet-500 to-purple-500',
    previewImage: '/templates/academic-preview.svg'
  },
  {
    id: 'elegant',
    name: 'Elegant Classic',
    description: 'Sophisticated serif design',
    longDescription: 'Sophisticated design with serif fonts and elegant spacing. Perfect for creative professionals who value aesthetics.',
    features: [
      'Serif typography',
      'Elegant spacing',
      'Sophisticated look',
      'Refined aesthetics',
      'Premium feel'
    ],
    bestFor: [
      'Creative Directors',
      'Fashion industry',
      'Luxury brands',
      'Editorial roles'
    ],
    icon: '🎭',
    color: 'from-amber-500 to-yellow-500',
    previewImage: '/templates/elegant-preview.svg'
  },
  {
    id: 'compact',
    name: 'Compact One-Page',
    description: 'Maximum info in minimal space',
    longDescription: 'Ultra-compact design that fits extensive experience into one page without feeling cramped. Great for quick scanning.',
    features: [
      'One-page format',
      'Compact layout',
      'Dense but readable',
      'Quick scan friendly',
      'Space optimized'
    ],
    bestFor: [
      'Experienced professionals',
      'Career fairs',
      'Quick applications',
      'Networking events'
    ],
    icon: '📝',
    color: 'from-lime-500 to-green-600',
    previewImage: '/templates/compact-preview.svg'
  },
  // TECH & MODERN SECTION (4 more)
  {
    id: 'developer-pro',
    name: 'Developer Pro',
    description: 'GitHub-centric developer CV',
    longDescription: 'Built for developers who code first, talk second. Prominent GitHub stats, contribution graphs, and tech stack visualization.',
    features: [
      'GitHub integration ready',
      'Tech stack icons',
      'Code contribution visual',
      'Open source projects',
      'Terminal-inspired design'
    ],
    bestFor: [
      'Open source contributors',
      'Frontend developers',
      'Backend engineers',
      'Full-stack developers'
    ],
    icon: '👨‍💻',
    color: 'from-slate-700 to-gray-900',
    previewImage: '/templates/developer-pro-preview.svg'
  },
  {
    id: 'startup-vibes',
    name: 'Startup Vibes',
    description: 'Fast-paced startup culture',
    longDescription: 'Dynamic design for startup enthusiasts. Shows hustle, growth mindset, and adaptability. Perfect for high-energy environments.',
    features: [
      'Dynamic layout',
      'Growth metrics',
      'Impact-focused',
      'Bold typography',
      'Energy-driven design'
    ],
    bestFor: [
      'Startup founders',
      'Product managers',
      'Growth hackers',
      'Venture-backed companies'
    ],
    icon: '🚀',
    color: 'from-orange-500 to-red-600',
    previewImage: '/templates/startup-preview.svg'
  },
  {
    id: 'silicon-valley',
    name: 'Silicon Valley',
    description: 'Tech giants favorite',
    longDescription: 'Inspired by FAANG company applications. Clean, scalable, and optimized for tech recruiters at major companies.',
    features: [
      'FAANG-optimized',
      'Leadership principles',
      'System design highlights',
      'Scale indicators',
      'Impact metrics'
    ],
    bestFor: [
      'FAANG applicants',
      'Senior engineers',
      'Tech leads',
      'Engineering managers'
    ],
    icon: '🏢',
    color: 'from-blue-600 to-indigo-700',
    previewImage: '/templates/silicon-valley-preview.svg'
  },
  // CREATIVE & DESIGN SECTION (4 new)
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    description: 'Daring and distinctive',
    longDescription: 'Make a statement with bold colors and unconventional layouts. For creatives who dare to be different.',
    features: [
      'Bold color palette',
      'Asymmetric layout',
      'Creative typography',
      'Visual hierarchy',
      'Personality showcase'
    ],
    bestFor: [
      'Graphic designers',
      'Art directors',
      'Brand strategists',
      'Creative agencies'
    ],
    icon: '🎨',
    color: 'from-fuchsia-500 to-purple-600',
    previewImage: '/templates/creative-bold-preview.svg'
  },
  {
    id: 'designer-portfolio',
    name: 'Designer Portfolio',
    description: 'Portfolio-first approach',
    longDescription: 'Your work speaks louder than words. Large visual portfolio section with case studies and design process.',
    features: [
      'Portfolio gallery',
      'Case study format',
      'Visual storytelling',
      'Design process',
      'Project thumbnails'
    ],
    bestFor: [
      'UX/UI designers',
      'Product designers',
      'Visual designers',
      'Design leads'
    ],
    icon: '🖼️',
    color: 'from-pink-400 to-rose-500',
    previewImage: '/templates/designer-portfolio-preview.svg'
  },
  {
    id: 'artistic-flair',
    name: 'Artistic Flair',
    description: 'Expressive and creative',
    longDescription: 'For artists and creatives who want to showcase their aesthetic sense through their CV itself.',
    features: [
      'Artistic elements',
      'Custom illustrations',
      'Expressive colors',
      'Creative sections',
      'Unique layouts'
    ],
    bestFor: [
      'Illustrators',
      'Fine artists',
      'Creative writers',
      'Art directors'
    ],
    icon: '🎭',
    color: 'from-purple-400 to-pink-400',
    previewImage: '/templates/artistic-preview.svg'
  },
  {
    id: 'photography-pro',
    name: 'Photography Pro',
    description: 'Visual storytelling focus',
    longDescription: 'Perfect for photographers and visual artists. Emphasizes portfolio with stunning image layout.',
    features: [
      'Large image areas',
      'Portfolio grid',
      'Exhibition history',
      'Client logos',
      'Visual emphasis'
    ],
    bestFor: [
      'Photographers',
      'Visual artists',
      'Videographers',
      'Content creators'
    ],
    icon: '📸',
    color: 'from-gray-700 to-slate-800',
    previewImage: '/templates/photography-preview.svg'
  },
  // BUSINESS & EXECUTIVE SECTION (4 new)
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    description: 'C-suite excellence',
    longDescription: 'Premium design for executives and senior leadership. Emphasizes strategic impact and leadership experience.',
    features: [
      'Executive summary',
      'Board experience',
      'Strategic achievements',
      'Premium aesthetic',
      'Leadership focus'
    ],
    bestFor: [
      'C-level executives',
      'Board members',
      'Senior VPs',
      'General managers'
    ],
    icon: '👔',
    color: 'from-gray-800 to-slate-900',
    previewImage: '/templates/executive-preview.svg'
  },
  {
    id: 'corporate-elite',
    name: 'Corporate Elite',
    description: 'Fortune 500 standard',
    longDescription: 'Conservative, formal design for corporate environments. Trusted by major corporations and traditional industries.',
    features: [
      'Conservative layout',
      'Traditional format',
      'Business formal',
      'Trust signals',
      'Corporate standard'
    ],
    bestFor: [
      'Fortune 500',
      'Banking sector',
      'Corporate roles',
      'Traditional industries'
    ],
    icon: '🏛️',
    color: 'from-blue-900 to-indigo-900',
    previewImage: '/templates/corporate-preview.svg'
  },
  {
    id: 'consulting-pro',
    name: 'Consulting Pro',
    description: 'McKinsey-style format',
    longDescription: 'Optimized for consulting firms. Clear problem-solving framework, client impact metrics, and analytical skills.',
    features: [
      'Case study format',
      'Client impact',
      'Analytical skills',
      'Framework thinking',
      'Results-driven'
    ],
    bestFor: [
      'Management consultants',
      'Strategy roles',
      'Business analysts',
      'Consulting firms'
    ],
    icon: '📊',
    color: 'from-teal-700 to-cyan-800',
    previewImage: '/templates/consulting-preview.svg'
  },
  {
    id: 'finance-master',
    name: 'Finance Master',
    description: 'Numbers tell the story',
    longDescription: 'Quantitative focus with financial metrics, CFA credentials, and deal experience. Perfect for finance professionals.',
    features: [
      'Financial metrics',
      'Deal experience',
      'CFA/CPA prominent',
      'Quantitative focus',
      'Clean numbers'
    ],
    bestFor: [
      'Investment bankers',
      'Financial analysts',
      'Portfolio managers',
      'Accountants'
    ],
    icon: '💰',
    color: 'from-green-700 to-emerald-800',
    previewImage: '/templates/finance-preview.svg'
  },
  // TWO-COLUMN LAYOUTS (3 more)
  {
    id: 'sidebar-accent',
    name: 'Sidebar Accent',
    description: 'Colored sidebar emphasis',
    longDescription: 'Modern two-column with bold colored sidebar. Skills and contact info stand out while experience flows naturally.',
    features: [
      'Bold sidebar',
      'Color accent',
      'Visual separation',
      'Skill charts',
      'Modern aesthetic'
    ],
    bestFor: [
      'Mid-level professionals',
      'Tech roles',
      'Marketing positions',
      'Creative tech'
    ],
    icon: '📱',
    color: 'from-violet-500 to-purple-600',
    previewImage: '/templates/sidebar-preview.svg'
  },
  {
    id: 'split-modern',
    name: 'Split Modern',
    description: '50/50 split design',
    longDescription: 'Perfectly balanced two-column design. Equal visual weight on both sides creates harmonious professional look.',
    features: [
      'Balanced columns',
      'Equal emphasis',
      'Harmonious design',
      'Easy to scan',
      'Professional polish'
    ],
    bestFor: [
      'All industries',
      'Experienced professionals',
      'Career changers',
      'Multi-skilled roles'
    ],
    icon: '⚖️',
    color: 'from-cyan-600 to-blue-700',
    previewImage: '/templates/split-preview.svg'
  },
  {
    id: 'dual-tone',
    name: 'Dual Tone',
    description: 'Two-color theme design',
    longDescription: 'Sophisticated two-color palette with asymmetric columns. Modern yet professional for creative industries.',
    features: [
      'Two-tone design',
      'Color harmony',
      'Asymmetric layout',
      'Modern feel',
      'Visual interest'
    ],
    bestFor: [
      'Designers',
      'Creative tech',
      'Media roles',
      'Startups'
    ],
    icon: '🎨',
    color: 'from-pink-500 to-orange-500',
    previewImage: '/templates/dual-tone-preview.svg'
  },
  // TIMELINE & VISUAL (3 more)
  {
    id: 'journey-map',
    name: 'Journey Map',
    description: 'Career journey visualization',
    longDescription: 'Visual map of your career path with milestones, pivots, and growth trajectory. Storytelling at its best.',
    features: [
      'Visual journey',
      'Milestone markers',
      'Growth trajectory',
      'Story flow',
      'Career pivots'
    ],
    bestFor: [
      'Career storytellers',
      'Leadership roles',
      'Career changers',
      'Entrepreneurs'
    ],
    icon: '🗺️',
    color: 'from-blue-500 to-teal-500',
    previewImage: '/templates/journey-preview.svg'
  },
  {
    id: 'milestone-story',
    name: 'Milestone Story',
    description: 'Achievement-focused timeline',
    longDescription: 'Each position is a milestone with key achievements highlighted. Perfect for impact-driven professionals.',
    features: [
      'Achievement focus',
      'Milestone emphasis',
      'Impact metrics',
      'Visual timeline',
      'Results-driven'
    ],
    bestFor: [
      'Sales professionals',
      'Product managers',
      'Growth roles',
      'Achievement-driven'
    ],
    icon: '🎯',
    color: 'from-amber-500 to-orange-600',
    previewImage: '/templates/milestone-preview.svg'
  },
  {
    id: 'career-path',
    name: 'Career Path',
    description: 'Progressive career ladder',
    longDescription: 'Shows clear career progression from entry to current level. Emphasizes growth and upward mobility.',
    features: [
      'Career progression',
      'Level indicators',
      'Growth visualization',
      'Ladder layout',
      'Promotion history'
    ],
    bestFor: [
      'Career progressors',
      'Internal promotions',
      'Leadership track',
      'Long tenure'
    ],
    icon: '🪜',
    color: 'from-green-600 to-teal-600',
    previewImage: '/templates/career-path-preview.svg'
  },
  // INFOGRAPHIC & DATA (3 more)
  {
    id: 'data-driven',
    name: 'Data Driven',
    description: 'Numbers and metrics focus',
    longDescription: 'Let your data do the talking. Charts, graphs, and quantified achievements take center stage.',
    features: [
      'Data visualization',
      'Metrics emphasis',
      'Chart integration',
      'Quantified results',
      'Visual analytics'
    ],
    bestFor: [
      'Data scientists',
      'Analysts',
      'Sales roles',
      'Performance-driven'
    ],
    icon: '📈',
    color: 'from-blue-600 to-cyan-600',
    previewImage: '/templates/data-driven-preview.svg'
  },
  {
    id: 'visual-impact',
    name: 'Visual Impact',
    description: 'High-impact infographics',
    longDescription: 'Maximum visual impact with icons, badges, and infographic elements. Catches attention immediately.',
    features: [
      'High visual impact',
      'Icon library',
      'Badge system',
      'Infographic style',
      'Attention-grabbing'
    ],
    bestFor: [
      'Marketing professionals',
      'Product managers',
      'Brand managers',
      'Visual communicators'
    ],
    icon: '💥',
    color: 'from-red-500 to-pink-500',
    previewImage: '/templates/visual-impact-preview.svg'
  },
  {
    id: 'chart-master',
    name: 'Chart Master',
    description: 'Excel-inspired professional',
    longDescription: 'For professionals who love data. Skill charts, performance graphs, and quantified achievements throughout.',
    features: [
      'Skill charts',
      'Performance graphs',
      'Data tables',
      'Quantified metrics',
      'Excel-inspired'
    ],
    bestFor: [
      'Business analysts',
      'Operations managers',
      'Finance professionals',
      'Data-focused roles'
    ],
    icon: '📊',
    color: 'from-emerald-600 to-green-700',
    previewImage: '/templates/chart-master-preview.svg'
  },
  // ACADEMIC & RESEARCH (3 more)
  {
    id: 'research-scholar',
    name: 'Research Scholar',
    description: 'Publication-heavy format',
    longDescription: 'Emphasizes research publications, citations, and academic contributions. Perfect for research-intensive roles.',
    features: [
      'Publication list',
      'Citation metrics',
      'Research focus',
      'Grant history',
      'Academic credentials'
    ],
    bestFor: [
      'Research scientists',
      'Postdocs',
      'Lab directors',
      'Academic researchers'
    ],
    icon: '🔬',
    color: 'from-indigo-600 to-purple-700',
    previewImage: '/templates/research-preview.svg'
  },
  {
    id: 'publication-focus',
    name: 'Publication Focus',
    description: 'Scholarly publishing emphasis',
    longDescription: 'For authors and researchers with extensive publication records. Features categorized publication sections.',
    features: [
      'Categorized publications',
      'Journal impact factors',
      'Conference presentations',
      'Book chapters',
      'Peer review activity'
    ],
    bestFor: [
      'Published authors',
      'Senior researchers',
      'Journal editors',
      'Academic leaders'
    ],
    icon: '📚',
    color: 'from-blue-700 to-indigo-800',
    previewImage: '/templates/publication-preview.svg'
  },
  {
    id: 'phd-candidate',
    name: 'PhD Candidate',
    description: 'Doctoral student format',
    longDescription: 'Tailored for PhD students and recent graduates. Highlights dissertation, research, and academic journey.',
    features: [
      'Dissertation focus',
      'Research projects',
      'Teaching experience',
      'Academic awards',
      'Conference activity'
    ],
    bestFor: [
      'PhD students',
      'Recent PhDs',
      'Academic job market',
      'Postdoc applications'
    ],
    icon: '🎓',
    color: 'from-purple-600 to-violet-700',
    previewImage: '/templates/phd-preview.svg'
  },
  // INDUSTRY SPECIFIC (6 new)
  {
    id: 'healthcare-pro',
    name: 'Healthcare Professional',
    description: 'Medical & healthcare focus',
    longDescription: 'Designed for healthcare professionals. Emphasizes certifications, clinical experience, and patient care.',
    features: [
      'Medical credentials',
      'Certifications prominent',
      'Clinical rotations',
      'Patient care focus',
      'Healthcare specific'
    ],
    bestFor: [
      'Doctors',
      'Nurses',
      'Healthcare administrators',
      'Medical professionals'
    ],
    icon: '⚕️',
    color: 'from-red-600 to-rose-700',
    previewImage: '/templates/healthcare-preview.svg'
  },
  {
    id: 'education-specialist',
    name: 'Education Specialist',
    description: 'Teaching & education focus',
    longDescription: 'Perfect for educators and academic professionals. Highlights teaching philosophy, curriculum development.',
    features: [
      'Teaching philosophy',
      'Curriculum development',
      'Student outcomes',
      'Educational credentials',
      'Professional development'
    ],
    bestFor: [
      'Teachers',
      'Professors',
      'Education administrators',
      'Curriculum developers'
    ],
    icon: '📖',
    color: 'from-yellow-600 to-amber-700',
    previewImage: '/templates/education-preview.svg'
  },
  {
    id: 'marketing-guru',
    name: 'Marketing Guru',
    description: 'Campaign-driven marketing',
    longDescription: 'Showcases marketing campaigns, brand work, and creative strategy. Perfect for marketing professionals.',
    features: [
      'Campaign highlights',
      'Brand portfolios',
      'ROI metrics',
      'Creative strategy',
      'Channel expertise'
    ],
    bestFor: [
      'Marketing managers',
      'Brand strategists',
      'Digital marketers',
      'Growth marketers'
    ],
    icon: '📣',
    color: 'from-orange-500 to-red-600',
    previewImage: '/templates/marketing-preview.svg'
  },
  {
    id: 'sales-champion',
    name: 'Sales Champion',
    description: 'Quota-crushing sales pro',
    longDescription: 'Numbers-focused design for sales professionals. Revenue achievements, quota attainment, and deal sizes.',
    features: [
      'Revenue metrics',
      'Quota achievement',
      'Deal sizes',
      'Client wins',
      'Performance graphs'
    ],
    bestFor: [
      'Sales executives',
      'Account managers',
      'Business development',
      'Sales leaders'
    ],
    icon: '💼',
    color: 'from-green-600 to-emerald-700',
    previewImage: '/templates/sales-preview.svg'
  },
  {
    id: 'legal-professional',
    name: 'Legal Professional',
    description: 'Attorney & legal focus',
    longDescription: 'Formal design for legal professionals. Emphasizes bar admissions, case work, and legal credentials.',
    features: [
      'Bar admissions',
      'Legal credentials',
      'Case experience',
      'Practice areas',
      'Formal structure'
    ],
    bestFor: [
      'Attorneys',
      'Legal counsels',
      'Paralegals',
      'Legal professionals'
    ],
    icon: '⚖️',
    color: 'from-gray-700 to-slate-800',
    previewImage: '/templates/legal-preview.svg'
  },
  {
    id: 'hospitality-pro',
    name: 'Hospitality Professional',
    description: 'Service excellence focus',
    longDescription: 'Designed for hospitality industry professionals. Highlights customer service, management, and operations.',
    features: [
      'Service excellence',
      'Guest satisfaction',
      'Operations management',
      'Industry certifications',
      'Team leadership'
    ],
    bestFor: [
      'Hotel managers',
      'Restaurant managers',
      'Event coordinators',
      'Hospitality leaders'
    ],
    icon: '🏨',
    color: 'from-teal-600 to-cyan-700',
    previewImage: '/templates/hospitality-preview.svg'
  },
  // COLOR THEMES (7 new)
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Calm and professional blue',
    longDescription: 'Soothing ocean blue theme. Professional, trustworthy, and calming. Perfect for corporate environments.',
    features: [
      'Blue color theme',
      'Professional tone',
      'Trust signals',
      'Calm aesthetic',
      'Corporate friendly'
    ],
    bestFor: [
      'Finance',
      'Healthcare',
      'Technology',
      'Consulting'
    ],
    icon: '🌊',
    color: 'from-blue-500 to-cyan-600',
    previewImage: '/templates/ocean-blue-preview.svg'
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Natural and growth-focused',
    longDescription: 'Fresh forest green theme. Represents growth, sustainability, and natural progression.',
    features: [
      'Green color theme',
      'Growth focus',
      'Eco-friendly vibe',
      'Fresh aesthetic',
      'Natural feel'
    ],
    bestFor: [
      'Environmental roles',
      'Sustainability',
      'Organic/green companies',
      'Growth-focused'
    ],
    icon: '🌲',
    color: 'from-green-600 to-emerald-700',
    previewImage: '/templates/forest-green-preview.svg'
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Warm and energetic',
    longDescription: 'Vibrant sunset orange theme. Energetic, creative, and warm. Great for dynamic personalities.',
    features: [
      'Orange color theme',
      'Energetic vibe',
      'Creative feel',
      'Warm aesthetic',
      'Dynamic personality'
    ],
    bestFor: [
      'Creative roles',
      'Startups',
      'Marketing',
      'Innovation-focused'
    ],
    icon: '🌅',
    color: 'from-orange-500 to-amber-600',
    previewImage: '/templates/sunset-orange-preview.svg'
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Luxurious and creative',
    longDescription: 'Rich royal purple theme. Luxurious, creative, and sophisticated. For premium positioning.',
    features: [
      'Purple color theme',
      'Luxury feel',
      'Creative edge',
      'Sophisticated look',
      'Premium positioning'
    ],
    bestFor: [
      'Executive roles',
      'Creative leadership',
      'Luxury brands',
      'Premium services'
    ],
    icon: '👑',
    color: 'from-purple-600 to-violet-700',
    previewImage: '/templates/royal-purple-preview.svg'
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    description: 'Elegant and modern',
    longDescription: 'Trendy rose gold theme. Elegant, modern, and fashionable. Perfect for creative industries.',
    features: [
      'Rose gold theme',
      'Elegant design',
      'Modern feel',
      'Fashion-forward',
      'Sophisticated charm'
    ],
    bestFor: [
      'Fashion industry',
      'Beauty/cosmetics',
      'Lifestyle brands',
      'Creative fields'
    ],
    icon: '🌹',
    color: 'from-pink-400 to-rose-500',
    previewImage: '/templates/rose-gold-preview.svg'
  },
  {
    id: 'midnight-black',
    name: 'Midnight Black',
    description: 'Bold and powerful',
    longDescription: 'Striking midnight black theme. Bold, powerful, and commanding. For strong executive presence.',
    features: [
      'Black color theme',
      'Bold design',
      'Powerful presence',
      'Executive feel',
      'Command attention'
    ],
    bestFor: [
      'C-level executives',
      'Creative directors',
      'Luxury brands',
      'High-end services'
    ],
    icon: '🌑',
    color: 'from-gray-900 to-black',
    previewImage: '/templates/midnight-black-preview.svg'
  },
  {
    id: 'emerald-luxury',
    name: 'Emerald Luxury',
    description: 'Premium and sophisticated',
    longDescription: 'Luxurious emerald green theme. Premium, sophisticated, and timeless. For high-level positioning.',
    features: [
      'Emerald color theme',
      'Luxury aesthetic',
      'Sophisticated design',
      'Premium feel',
      'Timeless elegance'
    ],
    bestFor: [
      'Luxury brands',
      'High-net-worth',
      'Premium services',
      'Executive roles'
    ],
    icon: '💎',
    color: 'from-emerald-600 to-green-800',
    previewImage: '/templates/emerald-luxury-preview.svg'
  }
];

export function getTemplateInfo(template: CVTemplate): TemplateInfo | undefined {
  return CV_TEMPLATES.find(t => t.id === template);
}
