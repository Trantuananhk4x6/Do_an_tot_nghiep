'use client';

import React from 'react';
import { 
  Rocket, 
  Clock, 
  Lightbulb,
  Target,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { JobLevel } from '../types/job.types';
import { getCareerPathRecommendations, getSalaryRange } from '../services/jobUtils';
import { useLanguage } from '../contexts/LanguageContext';

interface CareerInsightsProps {
  currentLevel: JobLevel;
  yearsOfExperience: number;
  mainField: string;
}

export default function CareerInsights({ currentLevel, yearsOfExperience, mainField }: CareerInsightsProps) {
  const { language } = useLanguage();
  const recommendations = getCareerPathRecommendations(currentLevel, yearsOfExperience);
  const currentSalary = getSalaryRange(currentLevel, mainField);
  const nextSalary = getSalaryRange(recommendations.nextLevel, mainField);

  return (
    <div className="glass-effect rounded-2xl p-6 border border-blue-500/30 mt-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Rocket className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            {language === 'vi' ? 'Lộ trình phát triển nghề nghiệp' : 'Career Development Path'}
          </h3>
          <p className="text-gray-300 text-sm">
            {language === 'vi' 
              ? <>Gợi ý để phát triển từ <strong className="text-purple-400">{currentLevel}</strong> lên <strong className="text-green-400">{recommendations.nextLevel}</strong></>
              : <>Recommendations to grow from <strong className="text-purple-400">{currentLevel}</strong> to <strong className="text-green-400">{recommendations.nextLevel}</strong></>
            }
          </p>
        </div>
      </div>

      {/* Career Path Timeline */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="glass-effect rounded-xl p-4 border border-purple-500/30">
              <p className="text-xs text-gray-400 mb-1">
                {language === 'vi' ? 'Cấp độ hiện tại' : 'Current Level'}
              </p>
              <p className="text-lg font-bold text-white capitalize mb-1">{currentLevel}</p>
              <p className="text-sm text-purple-300">{currentSalary}</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full">
              <p className="text-xs text-blue-300 font-medium">{recommendations.timeframe}</p>
            </div>
          </div>

          <div className="flex-1">
            <div className="glass-effect rounded-xl p-4 border border-green-500/30">
              <p className="text-xs text-gray-400 mb-1">
                {language === 'vi' ? 'Cấp độ tiếp theo' : 'Next Level'}
              </p>
              <p className="text-lg font-bold text-white capitalize mb-1">{recommendations.nextLevel}</p>
              <p className="text-sm text-green-300">{nextSalary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div>
        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <span>{language === 'vi' ? 'Hành động cần thực hiện:' : 'Action Items:'}</span>
        </h4>
        <div className="space-y-2">
          {recommendations.tips.map((tip, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 glass-effect rounded-lg hover:border-purple-500/30 border border-transparent transition-all"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>
              <p className="text-gray-300 text-sm flex-1">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Encouragement */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
        <div className="flex items-center justify-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          <p className="text-sm text-gray-300 text-center">
            <span className="text-purple-300 font-semibold">
              {yearsOfExperience} {language === 'vi' ? 'năm kinh nghiệm' : 'years of experience'}
            </span> - {language === 'vi' 
              ? 'Bạn đang trên con đường phát triển tuyệt vời! Tiếp tục học hỏi và cải thiện để đạt được mục tiêu cao hơn.'
              : "You're on a great development path! Keep learning and improving to achieve higher goals."
            }
          </p>
        </div>
      </div>
    </div>
  );
}
