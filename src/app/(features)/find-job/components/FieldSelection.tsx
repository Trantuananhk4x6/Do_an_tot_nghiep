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

export default function FieldSelection({ cvAnalysis, selectedField, onFieldSelected }: FieldSelectionProps) {
  // Detect potential fields from CV analysis
  const detectedFields = detectFieldsFromCV(cvAnalysis);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          🎯 Select Your Field
        </h2>
        <p className="text-gray-300">
          Based on your CV, we detected the following suitable fields
        </p>
      </div>

      {/* CV Summary */}
      <div className="glass-effect rounded-2xl p-6 mb-8 border border-purple-500/30">
        <div className="flex items-start gap-4">
          <span className="text-4xl">📝</span>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">CV Summary</h3>
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
                  +{cvAnalysis.skills.length - 8} more skills
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
                      🎯 Best Match
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
                        <span className="font-medium">Selected</span>
                      </>
                    ) : (
                      <span className="font-medium">Select this field</span>
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
                <h4 className="font-bold text-blue-300 mb-2">Tips</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Field with <strong className="text-purple-300">🎯 Best Match</strong> label is analyzed from your CV</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>You can choose other fields if you want to explore new opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>After selecting a field, you will choose your desired job level</span>
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
            Cannot determine field clearly
          </h3>
          <p className="text-gray-300">
            Please check your CV or try uploading again
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
