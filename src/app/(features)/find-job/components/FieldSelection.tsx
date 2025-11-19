'use client';

import React from 'react';
import { CVAnalysisForJob } from '../types/job.types';

interface FieldSelectionProps {
  cvAnalysis: CVAnalysisForJob;
  selectedField: string | null;
  onFieldSelected: (field: string) => void;
}

// Map detected fields from CV analysis
const fieldIcons: Record<string, string> = {
  'Frontend Developer': '🎨',
  'Backend Developer': '⚙️',
  'Full Stack Developer': '🌐',
  'Mobile Developer': '📱',
  'Data Science': '📊',
  'Machine Learning': '🤖',
  'AI Engineer': '🧠',
  'DevOps Engineer': '🔧',
  'QA Engineer': '🧪',
  'UI/UX Designer': '🎭',
  'Product Manager': '📋',
  'Business Analyst': '💼',
  'Software Developer': '💻',
  'Database Administrator': '🗄️',
  'Security Engineer': '🔒',
  'Cloud Engineer': '☁️',
  'Game Developer': '🎮',
  'Embedded Engineer': '🔌',
  'Network Engineer': '🌐',
  'System Administrator': '🖥️',
};

const fieldDescriptions: Record<string, string> = {
  'Frontend Developer': 'Phát triển giao diện người dùng, làm việc với HTML/CSS/JS, React, Vue, Angular',
  'Backend Developer': 'Xây dựng server, API, database, xử lý logic nghiệp vụ phía server',
  'Full Stack Developer': 'Làm việc cả Frontend và Backend, phát triển ứng dụng hoàn chỉnh',
  'Mobile Developer': 'Phát triển ứng dụng di động iOS, Android, React Native, Flutter',
  'Data Science': 'Phân tích dữ liệu, xây dựng mô hình dự đoán, data mining',
  'Machine Learning': 'Xây dựng và tối ưu mô hình ML, deep learning, neural networks',
  'AI Engineer': 'Phát triển giải pháp AI, NLP, computer vision, chatbot',
  'DevOps Engineer': 'CI/CD, Docker, Kubernetes, cloud infrastructure, automation',
  'QA Engineer': 'Kiểm thử phần mềm, automation testing, đảm bảo chất lượng sản phẩm',
  'UI/UX Designer': 'Thiết kế giao diện và trải nghiệm người dùng, wireframe, prototype',
  'Product Manager': 'Quản lý sản phẩm, định hướng phát triển, phối hợp team',
  'Business Analyst': 'Phân tích nghiệp vụ, thu thập yêu cầu, tư vấn giải pháp',
  'Software Developer': 'Phát triển phần mềm đa dạng, làm việc với nhiều công nghệ',
  'Database Administrator': 'Quản trị cơ sở dữ liệu, tối ưu hiệu suất, backup và recovery',
  'Security Engineer': 'Bảo mật hệ thống, phát hiện và xử lý lỗ hổng, penetration testing',
  'Cloud Engineer': 'Thiết kế và quản lý hạ tầng cloud AWS/Azure/GCP',
  'Game Developer': 'Phát triển game, Unity, Unreal Engine, game logic và graphics',
  'Embedded Engineer': 'Lập trình nhúng, IoT, firmware, vi điều khiển',
  'Network Engineer': 'Thiết kế và quản lý hệ thống mạng, routing, switching',
  'System Administrator': 'Quản trị hệ thống Linux/Windows, server, monitoring',
};

export default function FieldSelection({ cvAnalysis, selectedField, onFieldSelected }: FieldSelectionProps) {
  // Detect potential fields from CV analysis
  const detectedFields = detectFieldsFromCV(cvAnalysis);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          🎯 Chọn Lĩnh Vực Công Việc
        </h2>
        <p className="text-gray-300">
          Dựa trên CV của bạn, chúng tôi phát hiện các lĩnh vực phù hợp sau
        </p>
      </div>

      {/* CV Summary */}
      <div className="glass-effect rounded-2xl p-6 mb-8 border border-purple-500/30">
        <div className="flex items-start gap-4">
          <span className="text-4xl">📝</span>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">Tóm Tắt CV</h3>
            <p className="text-gray-300 mb-3">{cvAnalysis.summary}</p>
            <div className="flex flex-wrap gap-2">
              {cvAnalysis.skills.slice(0, 8).map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-sm text-blue-300"
                >
                  {skill}
                </span>
              ))}
              {cvAnalysis.skills.length > 8 && (
                <span className="px-3 py-1 bg-gray-500/20 border border-gray-500/50 rounded-full text-sm text-gray-400">
                  +{cvAnalysis.skills.length - 8} kỹ năng khác
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Field Selection Grid */}
      {detectedFields.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detectedFields.map((field, index) => {
              const isMainField = field === cvAnalysis.mainField;
              const isSelected = field === selectedField;
              
              return (
                <button
                  key={index}
                  onClick={() => onFieldSelected(field)}
                  className={`relative glass-effect rounded-2xl p-6 text-left transition-all duration-300 ${
                    isSelected 
                      ? 'border-2 border-purple-500 glow-effect scale-105' 
                      : 'border-2 border-white/20 hover:border-purple-400 hover:scale-105'
                  }`}
                >
                  {/* Main Field Badge */}
                  {isMainField && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      🎯 Phù hợp nhất
                    </div>
                  )}

                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-5xl">{fieldIcons[field] || '💼'}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {field}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {fieldDescriptions[field] || 'Lĩnh vực phát triển phần mềm'}
                      </p>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isSelected 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {isSelected ? (
                      <>
                        <span>✓</span>
                        <span className="font-medium">Đã chọn</span>
                      </>
                    ) : (
                      <span className="font-medium">Chọn lĩnh vực này</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Help Text */}
          <div className="mt-8 glass-effect border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">💡</span>
              <div>
                <h4 className="font-bold text-blue-300 mb-2">Lời khuyên</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Lĩnh vực có nhãn <strong className="text-purple-300">🎯 Phù hợp nhất</strong> được phân tích từ CV của bạn</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Bạn có thể chọn lĩnh vực khác nếu muốn khám phá cơ hội mới</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Sau khi chọn lĩnh vực, bạn sẽ chọn cấp độ công việc mong muốn</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-effect rounded-2xl p-12 text-center">
          <div className="text-8xl mb-6">🤔</div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Không thể xác định lĩnh vực rõ ràng
          </h3>
          <p className="text-gray-300">
            Vui lòng kiểm tra lại CV hoặc thử upload lại
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

  // Frontend
  if (text.match(/react|vue|angular|html|css|javascript|typescript|frontend|ui/)) {
    detectedFields.add('Frontend Developer');
  }

  // Backend
  if (text.match(/backend|api|server|node|express|django|spring|nest|php|laravel/)) {
    detectedFields.add('Backend Developer');
  }

  // Full Stack
  if (text.match(/fullstack|full stack|full-stack/) || 
      (text.includes('frontend') && text.includes('backend'))) {
    detectedFields.add('Full Stack Developer');
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
