'use client';

import React from 'react';
import { JobLevel } from '../types/job.types';
import { getCareerPathRecommendations, getSalaryRange } from '../services/jobUtils';

interface CareerInsightsProps {
  currentLevel: JobLevel;
  yearsOfExperience: number;
  mainField: string;
}

export default function CareerInsights({ currentLevel, yearsOfExperience, mainField }: CareerInsightsProps) {
  const recommendations = getCareerPathRecommendations(currentLevel, yearsOfExperience);
  const currentSalary = getSalaryRange(currentLevel, mainField);
  const nextSalary = getSalaryRange(recommendations.nextLevel, mainField);

  return (
    <div className="glass-effect rounded-2xl p-6 border border-blue-500/30 mt-8">
      <div className="flex items-start gap-4 mb-6">
        <span className="text-4xl">🚀</span>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Lộ Trình Phát Triển Sự Nghiệp</h3>
          <p className="text-gray-300 text-sm">
            Gợi ý để phát triển từ <strong className="text-purple-400">{currentLevel}</strong> lên <strong className="text-green-400">{recommendations.nextLevel}</strong>
          </p>
        </div>
      </div>

      {/* Career Path Timeline */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="glass-effect rounded-xl p-4 border border-purple-500/30">
              <p className="text-xs text-gray-400 mb-1">Cấp độ hiện tại</p>
              <p className="text-lg font-bold text-white capitalize mb-1">{currentLevel}</p>
              <p className="text-sm text-purple-300">{currentSalary}</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full">
              <p className="text-xs text-blue-300 font-medium">{recommendations.timeframe}</p>
            </div>
          </div>

          <div className="flex-1">
            <div className="glass-effect rounded-xl p-4 border border-green-500/30">
              <p className="text-xs text-gray-400 mb-1">Cấp độ tiếp theo</p>
              <p className="text-lg font-bold text-white capitalize mb-1">{recommendations.nextLevel}</p>
              <p className="text-sm text-green-300">{nextSalary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div>
        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
          <span>💡</span>
          <span>Hành động cần làm:</span>
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
        <p className="text-sm text-gray-300 text-center">
          <span className="text-purple-300 font-semibold">
            {yearsOfExperience} năm kinh nghiệm
          </span> - Bạn đang trên con đường phát triển tốt! 
          Tiếp tục học hỏi và cải thiện để đạt được mục tiêu cao hơn. 🎯
        </p>
      </div>
    </div>
  );
}
