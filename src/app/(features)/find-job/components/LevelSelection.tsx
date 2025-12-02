'use client';

import React from 'react';
import { 
  GraduationCap, 
  Sprout, 
  Code, 
  Rocket, 
  Star, 
  Users, 
  Crown,
  BarChart2,
  Check,
  MapPin,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { JobLevel, CVAnalysisForJob } from '../types/job.types';
import { getLevelDisplayName, getExperienceRange } from '../services/cvAnalyzer';
import CareerInsights from './CareerInsights';
import { useLanguage } from '../contexts/LanguageContext';

interface LevelSelectionProps {
  cvAnalysis: CVAnalysisForJob;
  selectedLevel: JobLevel | null;
  onLevelSelected: (level: JobLevel) => void;
  selectedField?: string | null;
}

const allLevels: JobLevel[] = ['intern', 'fresher', 'junior', 'middle', 'senior', 'manager', 'director'];

// Use lucide-react icons instead of emojis
const getLevelIcon = (level: JobLevel) => {
  const iconMap: Record<JobLevel, React.ReactNode> = {
    intern: <GraduationCap className="w-8 h-8" />,
    fresher: <Sprout className="w-8 h-8" />,
    junior: <Code className="w-8 h-8" />,
    middle: <Rocket className="w-8 h-8" />,
    senior: <Star className="w-8 h-8" />,
    manager: <Users className="w-8 h-8" />,
    director: <Crown className="w-8 h-8" />
  };
  return iconMap[level];
};

export default function LevelSelection({ cvAnalysis, selectedLevel, onLevelSelected, selectedField }: LevelSelectionProps) {
  const { language, t } = useLanguage();

  // Bilingual descriptions
  const getLevelDescription = (level: JobLevel): string => {
    if (language === 'vi') {
      const descriptions: Record<JobLevel, string> = {
        intern: 'Phù hợp cho sinh viên, muốn tích lũy kinh nghiệm thực tế',
        fresher: 'Dành cho người mới ra trường, bắt đầu sự nghiệp chuyên nghiệp',
        junior: '1-3 năm kinh nghiệm, làm việc độc lập các tác vụ cơ bản',
        middle: '3-5 năm kinh nghiệm, có thể dẫn dắt dự án hoặc nhóm nhỏ',
        senior: '5+ năm chuyên gia, tư vấn kiến trúc và giải quyết vấn đề phức tạp',
        manager: 'Quản lý team, điều phối nhiều dự án, kỹ năng lãnh đạo cao',
        director: 'Lãnh đạo cấp cao, định hướng chiến lược và phát triển tổ chức'
      };
      return descriptions[level];
    }
    const descriptions: Record<JobLevel, string> = {
      intern: 'Suitable for students, want to gain practical experience',
      fresher: 'For fresh graduates, starting professional career',
      junior: '1-3 years experience, work independently on basic tasks',
      middle: '3-5 years experience, can lead small projects or teams',
      senior: '5+ years expert, advise on architecture and solve complex problems',
      manager: 'Manage team, coordinate multiple projects, strong leadership skills',
      director: 'Senior leadership, define strategy and organizational development'
    };
    return descriptions[level];
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          {t.level.title}
        </h2>
        <p className="text-gray-300">
          {t.level.subtitle}
        </p>
      </div>

      {/* CV Analysis Summary */}
      <div className="glass-effect rounded-2xl p-6 mb-8 border border-purple-500/30 glow-effect-pink">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-3">{t.level.cvAnalysis}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">{language === 'vi' ? 'Lĩnh vực' : 'Field'}</p>
                <p className="text-white font-medium">{cvAnalysis.mainField}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">{language === 'vi' ? 'Kinh nghiệm' : 'Experience'}</p>
                <p className="text-white font-medium">{cvAnalysis.yearsOfExperience}+ {language === 'vi' ? 'năm' : 'years'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">{language === 'vi' ? 'Cấp độ hiện tại' : 'Current Level'}</p>
                <p className="text-white font-medium">{getLevelDisplayName(cvAnalysis.currentLevel)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">{language === 'vi' ? 'Địa điểm' : 'Location'}</p>
                <p className="text-white font-medium">{cvAnalysis.location}</p>
              </div>
            </div>
            {cvAnalysis.skills.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">{language === 'vi' ? 'Kỹ năng chính' : 'Key Skills'}</p>
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
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {language === 'vi' ? 'Đề xuất' : 'Recommended'}
                </div>
              )}
              
              {/* Current Badge */}
              {isCurrent && (
                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {language === 'vi' ? 'Hiện tại' : 'Current'}
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  {getLevelIcon(level)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {getLevelDisplayName(level)}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {language === 'vi' ? 'Kinh nghiệm: ' : 'Experience: '}{getExperienceRange(level)}
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
                    <Check className="w-4 h-4" />
                    <span className="font-medium">{language === 'vi' ? 'Đã chọn' : 'Selected'}</span>
                  </>
                ) : (
                  <span className="font-medium">{language === 'vi' ? 'Chọn cấp bậc này' : 'Select this level'}</span>
                )}
              </div>
              {/* Preview: what will be searched */}
              <div className="mt-3 text-sm text-gray-400">
                {language === 'vi' ? 'Tìm kiếm: ' : 'Search for: '}
                <strong className="text-white">{(selectedField || cvAnalysis.mainField) + ' ' + getLevelDisplayName(level)}</strong> 
                {language === 'vi' ? ' tại ' : ' in '}
                <strong className="text-white">{cvAnalysis.location}</strong>
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
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="font-bold text-blue-300 mb-2">{language === 'vi' ? 'Gợi ý' : 'Tips'}</h4>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>
                  {language === 'vi' 
                    ? <>Vị trí có nhãn <strong className="text-purple-300">Đề xuất</strong> phù hợp nhất với kinh nghiệm của bạn</>
                    : <>Positions with <strong className="text-purple-300">Recommended</strong> label are best suited to your experience</>
                  }
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>
                  {language === 'vi' 
                    ? 'Bạn có thể chọn cấp thấp hơn để tăng cơ hội hoặc cao hơn để thử thách bản thân'
                    : 'You can choose a lower position to increase opportunities or higher to challenge yourself'
                  }
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>
                  {language === 'vi' 
                    ? 'Hệ thống sẽ tìm kiếm việc làm phù hợp trên các trang tuyển dụng lớn tại Việt Nam'
                    : 'The system will search for suitable jobs on major recruitment sites in Vietnam'
                  }
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
