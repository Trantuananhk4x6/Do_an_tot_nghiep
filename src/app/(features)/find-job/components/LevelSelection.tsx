'use client';

import React from 'react';
import { JobLevel, CVAnalysisForJob } from '../types/job.types';
import { getLevelDisplayName, getExperienceRange } from '../services/cvAnalyzer';
import CareerInsights from './CareerInsights';

interface LevelSelectionProps {
  cvAnalysis: CVAnalysisForJob;
  selectedLevel: JobLevel | null;
  onLevelSelected: (level: JobLevel) => void;
}

const allLevels: JobLevel[] = ['intern', 'fresher', 'junior', 'middle', 'senior', 'manager', 'director'];

const levelIcons: Record<JobLevel, string> = {
  intern: '🎓',
  fresher: '🌱',
  junior: '👨‍💻',
  middle: '🚀',
  senior: '⭐',
  manager: '👔',
  director: '👑'
};

export default function LevelSelection({ cvAnalysis, selectedLevel, onLevelSelected }: LevelSelectionProps) {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          Chọn Cấp Độ Công Việc
        </h2>
        <p className="text-gray-300">
          Chúng tôi phân tích bạn phù hợp với các vị trí sau
        </p>
      </div>

      {/* CV Analysis Summary */}
      <div className="glass-effect rounded-2xl p-6 mb-8 border border-purple-500/30 glow-effect-pink">
        <div className="flex items-start gap-4">
          <span className="text-4xl">📊</span>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-3">Phân Tích CV Của Bạn</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Lĩnh vực</p>
                <p className="text-white font-medium">{cvAnalysis.mainField}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Kinh nghiệm</p>
                <p className="text-white font-medium">{cvAnalysis.yearsOfExperience}+ năm</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Cấp độ hiện tại</p>
                <p className="text-white font-medium">{getLevelDisplayName(cvAnalysis.currentLevel)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Địa điểm</p>
                <p className="text-white font-medium">{cvAnalysis.location}</p>
              </div>
            </div>
            {cvAnalysis.skills.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Kỹ năng nổi bật</p>
                <div className="flex flex-wrap gap-2">
                  {cvAnalysis.skills.slice(0, 10).map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm text-purple-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Level Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allLevels.map((level) => {
          const isRecommended = cvAnalysis.suggestedLevel.includes(level);
          const isCurrent = level === cvAnalysis.currentLevel;
          const isSelected = level === selectedLevel;
          
          return (
            <button
              key={level}
              onClick={() => onLevelSelected(level)}
              className={`relative glass-effect rounded-2xl p-6 text-left transition-all duration-300 ${
                isSelected 
                  ? 'border-2 border-purple-500 glow-effect scale-105' 
                  : 'border-2 border-white/20 hover:border-purple-400 hover:scale-105'
              }`}
            >
              {/* Recommended Badge */}
              {isRecommended && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                  ✨ Gợi ý
                </div>
              )}
              
              {/* Current Badge */}
              {isCurrent && (
                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  📍 Hiện tại
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">{levelIcons[level]}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {getLevelDisplayName(level)}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Kinh nghiệm: {getExperienceRange(level)}
                  </p>
                </div>
              </div>

              {/* Level Description */}
              <p className="text-sm text-gray-300 mb-4">
                {getLevelDescription(level)}
              </p>

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
                  <span className="font-medium">Chọn vị trí này</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Career Insights */}
      <CareerInsights 
        currentLevel={cvAnalysis.currentLevel}
        yearsOfExperience={cvAnalysis.yearsOfExperience}
        mainField={cvAnalysis.mainField}
      />

      {/* Help Text */}
      <div className="mt-8 glass-effect border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <h4 className="font-bold text-blue-300 mb-2">Lời khuyên</h4>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Các vị trí có nhãn <strong className="text-purple-300">✨ Gợi ý</strong> phù hợp nhất với kinh nghiệm của bạn</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Bạn có thể chọn vị trí thấp hơn để tăng cơ hội hoặc cao hơn để thử thách bản thân</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Hệ thống sẽ tìm kiếm việc làm phù hợp trên các trang tuyển dụng lớn tại Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function getLevelDescription(level: JobLevel): string {
  const descriptions: Record<JobLevel, string> = {
    intern: 'Phù hợp cho sinh viên đang học, muốn tích lũy kinh nghiệm thực tế',
    fresher: 'Dành cho người mới tốt nghiệp, bắt đầu sự nghiệp chuyên môn',
    junior: 'Có 1-3 năm kinh nghiệm, làm việc độc lập với các task cơ bản',
    middle: 'Có 3-5 năm kinh nghiệm, có thể dẫn dắt dự án nhỏ hoặc team',
    senior: 'Chuyên gia 5+ năm, tư vấn kiến trúc và giải quyết vấn đề phức tạp',
    manager: 'Quản lý team, phối hợp nhiều dự án, có kỹ năng lãnh đạo tốt',
    director: 'Lãnh đạo cấp cao, định hướng chiến lược và phát triển tổ chức'
  };
  return descriptions[level];
}
