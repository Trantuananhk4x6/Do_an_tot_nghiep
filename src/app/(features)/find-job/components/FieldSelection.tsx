'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Star, 
  TrendingUp, 
  Users,
  Zap,
  ChevronRight,
  Palette,
  Server,
  Globe,
  Smartphone,
  BarChart3,
  Brain,
  Bot,
  Settings,
  TestTube,
  Layout,
  Briefcase,
  LineChart,
  Code,
  Database,
  Shield,
  Cloud,
  Gamepad2,
  Cpu,
  Network,
  Monitor,
  FileText,
  Lightbulb
} from 'lucide-react';
import { CVAnalysisForJob } from '../types/job.types';
import { getFieldMarketInsights } from '../services/marketInsights';
import SmartMatchScore from './SmartMatchScore';
import { useLanguage } from '../contexts/LanguageContext';

interface FieldSelectionProps {
  cvAnalysis: CVAnalysisForJob;
  selectedField: string | null;
  onFieldSelected: (field: string) => void;
}

// Map detected fields from CV analysis - using lucide-react icons
const getFieldIcon = (field: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Frontend Developer': <Palette className="w-8 h-8" />,
    'Backend Developer': <Server className="w-8 h-8" />,
    'Full Stack Developer': <Globe className="w-8 h-8" />,
    'Mobile Developer': <Smartphone className="w-8 h-8" />,
    'Data Science': <BarChart3 className="w-8 h-8" />,
    'Machine Learning': <Brain className="w-8 h-8" />,
    'AI Engineer': <Bot className="w-8 h-8" />,
    'DevOps Engineer': <Settings className="w-8 h-8" />,
    'QA Engineer': <TestTube className="w-8 h-8" />,
    'UI/UX Designer': <Layout className="w-8 h-8" />,
    'Product Manager': <Briefcase className="w-8 h-8" />,
    'Business Analyst': <LineChart className="w-8 h-8" />,
    'Software Developer': <Code className="w-8 h-8" />,
    'Database Administrator': <Database className="w-8 h-8" />,
    'Security Engineer': <Shield className="w-8 h-8" />,
    'Cloud Engineer': <Cloud className="w-8 h-8" />,
    'Game Developer': <Gamepad2 className="w-8 h-8" />,
    'Embedded Engineer': <Cpu className="w-8 h-8" />,
    'Network Engineer': <Network className="w-8 h-8" />,
    'System Administrator': <Monitor className="w-8 h-8" />,
  };
  return iconMap[field] || <Briefcase className="w-8 h-8" />;
};

// Bilingual descriptions
const getFieldDescriptions = (lang: 'vi' | 'en'): Record<string, string> => {
  if (lang === 'vi') {
    return {
      'Frontend Developer': 'Xây dựng giao diện người dùng, làm việc với HTML/CSS/JS, React, Vue, Angular',
      'Backend Developer': 'Xây dựng server, API, database, xử lý logic nghiệp vụ phía server',
      'Full Stack Developer': 'Làm việc cả Frontend và Backend, phát triển ứng dụng hoàn chỉnh',
      'Mobile Developer': 'Phát triển ứng dụng di động cho iOS, Android, React Native, Flutter',
      'Data Science': 'Phân tích dữ liệu, xây dựng mô hình dự đoán, khai phá dữ liệu',
      'Machine Learning': 'Xây dựng và tối ưu mô hình ML, deep learning, mạng neural',
      'AI Engineer': 'Phát triển giải pháp AI, NLP, computer vision, chatbot',
      'DevOps Engineer': 'CI/CD, Docker, Kubernetes, hạ tầng cloud, tự động hóa',
      'QA Engineer': 'Kiểm thử phần mềm, automation testing, đảm bảo chất lượng',
      'UI/UX Designer': 'Thiết kế giao diện và trải nghiệm người dùng, wireframe, prototype',
      'Product Manager': 'Quản lý sản phẩm, định hướng phát triển, điều phối team',
      'Business Analyst': 'Phân tích kinh doanh, thu thập yêu cầu, tư vấn giải pháp',
      'Software Developer': 'Phát triển phần mềm đa dạng, làm việc với nhiều công nghệ',
      'Database Administrator': 'Quản trị cơ sở dữ liệu, tối ưu hiệu năng, backup và recovery',
      'Security Engineer': 'Bảo mật hệ thống, phát hiện và xử lý lỗ hổng, pentest',
      'Cloud Engineer': 'Thiết kế và quản lý hạ tầng cloud AWS/Azure/GCP',
      'Game Developer': 'Phát triển game, Unity, Unreal Engine, logic và đồ họa game',
      'Embedded Engineer': 'Lập trình nhúng, IoT, firmware, vi điều khiển',
      'Network Engineer': 'Thiết kế và quản lý hệ thống mạng, routing, switching',
      'System Administrator': 'Quản trị hệ thống Linux/Windows, server, monitoring',
    };
  }
  return {
    'Frontend Developer': 'Build user interfaces, work with HTML/CSS/JS, React, Vue, Angular',
    'Backend Developer': 'Build servers, APIs, databases, handle server-side business logic',
    'Full Stack Developer': 'Work on both Frontend and Backend, develop complete applications',
    'Mobile Developer': 'Develop mobile apps for iOS, Android, React Native, Flutter',
    'Data Science': 'Data analysis, build predictive models, data mining',
    'Machine Learning': 'Build and optimize ML models, deep learning, neural networks',
    'AI Engineer': 'Develop AI solutions, NLP, computer vision, chatbot',
    'DevOps Engineer': 'CI/CD, Docker, Kubernetes, cloud infrastructure, automation',
    'QA Engineer': 'Software testing, automation testing, ensure product quality',
    'UI/UX Designer': 'Design interfaces and user experience, wireframe, prototype',
    'Product Manager': 'Product management, development direction, team coordination',
    'Business Analyst': 'Business analysis, requirements gathering, solution consulting',
    'Software Developer': 'Develop diverse software, work with multiple technologies',
    'Database Administrator': 'Database administration, performance optimization, backup and recovery',
    'Security Engineer': 'System security, detect and fix vulnerabilities, penetration testing',
    'Cloud Engineer': 'Design and manage cloud infrastructure AWS/Azure/GCP',
    'Game Developer': 'Game development, Unity, Unreal Engine, game logic and graphics',
    'Embedded Engineer': 'Embedded programming, IoT, firmware, microcontrollers',
    'Network Engineer': 'Design and manage network systems, routing, switching',
    'System Administrator': 'Linux/Windows system administration, server, monitoring',
  };
};

export default function FieldSelection({ cvAnalysis, selectedField, onFieldSelected }: FieldSelectionProps) {
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const { language, t } = useLanguage();
  
  // Detect potential fields from CV analysis
  const detectedFields = detectFieldsFromCV(cvAnalysis);
  
  // Get market insights for hovered field
  const hoveredInsights = hoveredField ? getFieldMarketInsights(hoveredField) : null;
  
  // Get descriptions based on language
  const fieldDescriptions = getFieldDescriptions(language);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          {t.field.title}
        </h2>
        <p className="text-gray-300">
          {t.field.subtitle}
        </p>
      </div>

      {/* CV Summary with Match Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 glass-effect rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                {language === 'vi' ? 'Tóm tắt CV' : 'CV Summary'}
              </h3>
              <p className="text-gray-300 mb-3">{cvAnalysis.summary}</p>
              
              {/* Skills with levels */}
              <div className="flex flex-wrap gap-2 mb-4">
                {cvAnalysis.skills.slice(0, 8).map((skill, index) => {
                  const skillInfo = cvAnalysis.skillsWithLevels?.find(s => s.skill === skill);
                  const levelColors: Record<string, string> = {
                    'expert': 'bg-green-500/20 border-green-500/50 text-green-300',
                    'advanced': 'bg-blue-500/20 border-blue-500/50 text-blue-300',
                    'intermediate': 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
                    'beginner': 'bg-gray-500/20 border-gray-500/50 text-gray-300'
                  };
                  const colorClass = skillInfo ? levelColors[skillInfo.level] : 'bg-blue-500/20 border-blue-500/50 text-blue-300';
                  
                  return (
                    <span 
                      key={index}
                      className={`px-3 py-1 border rounded-full text-sm flex items-center gap-1 ${colorClass}`}
                    >
                      {skill}
                      {skillInfo && skillInfo.level === 'expert' && <Star className="w-3 h-3" />}
                    </span>
                  );
                })}
                {cvAnalysis.skills.length > 8 && (
                  <span className="px-3 py-1 bg-gray-500/20 border border-gray-500/50 rounded-full text-sm text-gray-400">
                    +{cvAnalysis.skills.length - 8} {language === 'vi' ? 'skills khác' : 'more skills'}
                  </span>
                )}
              </div>

              {/* Strong Points */}
              {cvAnalysis.strongPoints && cvAnalysis.strongPoints.length > 0 && (
                <div className="mt-4 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                  <p className="text-sm text-green-400 font-medium mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    {language === 'vi' ? 'Điểm mạnh của bạn:' : 'Your strengths:'}
                  </p>
                  <ul className="space-y-1">
                    {cvAnalysis.strongPoints.map((point, idx) => (
                      <li key={idx} className="text-sm text-green-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Smart Match Score Panel */}
        <div>
          <SmartMatchScore 
            cvAnalysis={cvAnalysis}
            selectedField={selectedField || cvAnalysis.mainField}
            marketInsights={getFieldMarketInsights(selectedField || cvAnalysis.mainField)}
          />
        </div>
      </div>

      {/* Field Selection Grid */}
      {detectedFields.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detectedFields.map((field, index) => {
              const isMainField = field === cvAnalysis.mainField;
              const isSelected = field === selectedField;
              const insights = getFieldMarketInsights(field);
              
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onFieldSelected(field)}
                  onMouseEnter={() => setHoveredField(field)}
                  onMouseLeave={() => setHoveredField(null)}
                  className={`relative glass-effect rounded-2xl p-6 text-left transition-all duration-300 ${
                    isSelected 
                      ? 'border-2 border-purple-500 glow-effect scale-105' 
                      : 'border-2 border-white/20 hover:border-purple-400 hover:scale-105'
                  }`}
                >
                  {/* Main Field Badge */}
                  {isMainField && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {t.field.recommended}
                    </div>
                  )}

                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      {getFieldIcon(field)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {field}
                      </h3>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {fieldDescriptions[field] || (language === 'vi' ? 'Lĩnh vực phát triển phần mềm' : 'Software development field')}
                      </p>
                    </div>
                  </div>

                  {/* Market Quick Stats */}
                  {insights && (
                    <div className="flex items-center gap-3 mb-4 text-xs">
                      <span className={`px-2 py-1 rounded-full flex items-center gap-1 ${
                        insights.demandLevel === 'very-high' ? 'bg-green-500/20 text-green-400' :
                        insights.demandLevel === 'high' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        <TrendingUp className="w-3 h-3" />
                        {insights.demandLevel === 'very-high' ? 'Hot' : 
                         insights.demandLevel === 'high' ? (language === 'vi' ? 'Cao' : 'High') : 
                         (language === 'vi' ? 'TB' : 'Med')}
                      </span>
                      <span className="text-gray-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {insights.jobOpenings}
                      </span>
                      <span className="text-gray-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {insights.hotSkills.length} hot skills
                      </span>
                    </div>
                  )}

                  {/* Selection Indicator */}
                  <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isSelected 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-medium">{language === 'vi' ? 'Đã chọn' : 'Selected'}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-medium">{language === 'vi' ? 'Chọn lĩnh vực này' : 'Select this field'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Help Text */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 glass-effect border border-blue-500/30 rounded-xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-blue-300 mb-2">
                  {language === 'vi' ? 'Gợi ý' : 'Tips'}
                </h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      {language === 'vi' 
                        ? <>Lĩnh vực có nhãn <strong className="text-purple-300">{t.field.recommended}</strong> được phân tích từ CV của bạn</>
                        : <>Fields marked with <strong className="text-purple-300">{t.field.recommended}</strong> are analyzed from your CV</>
                      }
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      {language === 'vi' 
                        ? 'Bạn có thể chọn lĩnh vực khác nếu muốn khám phá cơ hội mới'
                        : 'You can choose other fields to explore new opportunities'
                      }
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      {language === 'vi' 
                        ? 'Sau khi chọn lĩnh vực, bạn sẽ chọn cấp bậc mong muốn'
                        : 'After selecting a field, you will choose your desired level'
                      }
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </>
      ) : (
        <div className="glass-effect rounded-2xl p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-500/20 flex items-center justify-center">
            <Brain className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            {language === 'vi' ? 'Không thể xác định rõ lĩnh vực' : 'Could not determine field'}
          </h3>
          <p className="text-gray-300">
            {language === 'vi' 
              ? 'Vui lòng kiểm tra lại CV hoặc thử upload lại'
              : 'Please check your CV or try uploading again'
            }
          </p>
        </div>
      )}
    </div>
  );
}

// Detect potential fields from CV analysis
function detectFieldsFromCV(cvAnalysis: CVAnalysisForJob): string[] {
  const detectedFields: Set<string> = new Set();
  const text = cvAnalysis.skills.join(' ').toLowerCase();
  const mainField = cvAnalysis.mainField;

  // Add main field first
  detectedFields.add(mainField);

  // Check for both frontend AND backend
  const hasFrontend = text.match(/react|vue|angular|html|css|javascript|typescript|frontend|ui/);
  const hasBackend = text.match(/backend|api|server|node|express|django|spring|nest|php|laravel/);

  // Full Stack - if has BOTH frontend and backend
  if (text.match(/fullstack|full stack|full-stack/) || (hasFrontend && hasBackend)) {
    detectedFields.add('Full Stack Developer');
  }

  // Frontend
  if (hasFrontend) {
    detectedFields.add('Frontend Developer');
  }

  // Backend
  if (hasBackend) {
    detectedFields.add('Backend Developer');
  }

  // Mobile
  if (text.match(/mobile|android|ios|react native|flutter|kotlin|swift/)) {
    detectedFields.add('Mobile Developer');
  }

  // Data Science
  if (text.match(/data science|data analysis|data analytics|pandas|numpy|matplotlib|statistics/)) {
    detectedFields.add('Data Science');
  }

  // Machine Learning
  if (text.match(/machine learning|ml|deep learning|tensorflow|pytorch|scikit|neural network/)) {
    detectedFields.add('Machine Learning');
  }

  // AI
  if (text.match(/artificial intelligence|ai|nlp|computer vision|chatbot|gpt|llm/)) {
    detectedFields.add('AI Engineer');
  }

  // DevOps
  if (text.match(/devops|ci\/cd|docker|kubernetes|jenkins|terraform|ansible|aws|azure|gcp/)) {
    detectedFields.add('DevOps Engineer');
  }

  // QA
  if (text.match(/qa|quality assurance|testing|test automation|selenium|cypress|jest/)) {
    detectedFields.add('QA Engineer');
  }

  // Database
  if (text.match(/database|dba|sql|mysql|postgresql|mongodb|oracle|redis/) && 
      !text.match(/developer|engineering/)) {
    detectedFields.add('Database Administrator');
  }

  // Security
  if (text.match(/security|cybersecurity|penetration|vulnerability|encryption|firewall/)) {
    detectedFields.add('Security Engineer');
  }

  // Cloud
  if (text.match(/cloud|aws|azure|gcp|cloud architecture|cloud infrastructure/)) {
    detectedFields.add('Cloud Engineer');
  }

  // If only mainField detected, add related fields
  if (detectedFields.size === 1) {
    addRelatedFields(mainField, detectedFields);
  }

  return Array.from(detectedFields).slice(0, 6); // Limit to 6 fields
}

// Add related fields based on main field
function addRelatedFields(mainField: string, fields: Set<string>) {
  const relatedMap: Record<string, string[]> = {
    'Frontend Developer': ['Full Stack Developer', 'UI/UX Designer'],
    'Backend Developer': ['Full Stack Developer', 'DevOps Engineer'],
    'Full Stack Developer': ['Frontend Developer', 'Backend Developer'],
    'Mobile Developer': ['Frontend Developer', 'Full Stack Developer'],
    'Software Developer': ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
    'Data Science': ['Machine Learning', 'AI Engineer'],
    'Machine Learning': ['Data Science', 'AI Engineer'],
    'AI Engineer': ['Machine Learning', 'Data Science'],
    'DevOps Engineer': ['Backend Developer', 'Cloud Engineer'],
    'QA Engineer': ['Backend Developer', 'Frontend Developer'],
  };

  const related = relatedMap[mainField] || ['Full Stack Developer', 'Software Developer'];
  related.forEach(field => fields.add(field));
}
