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
          Select Job Level
        </h2>
        <p className="text-gray-300">
          We analyzed that you are suitable for the following positions
        </p>
      </div>

      {/* CV Analysis Summary */}
      <div className="glass-effect rounded-2xl p-6 mb-8 border border-purple-500/30 glow-effect-pink">
        <div className="flex items-start gap-4">
          <span className="text-4xl">📊</span>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-3">Your CV Analysis</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Field</p>
                <p className="text-white font-medium">{cvAnalysis.mainField}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Experience</p>
                <p className="text-white font-medium">{cvAnalysis.yearsOfExperience}+ years</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Current Level</p>
                <p className="text-white font-medium">{getLevelDisplayName(cvAnalysis.currentLevel)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Location</p>
                <p className="text-white font-medium">{cvAnalysis.location}</p>
              </div>
            </div>
            {cvAnalysis.skills.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Key Skills</p>
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
                  ✨ Recommended
                </div>
              )}
              
              {/* Current Badge */}
              {isCurrent && (
                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  📍 Current
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">{levelIcons[level]}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {getLevelDisplayName(level)}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Experience: {getExperienceRange(level)}
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
                    <span className="font-medium">Selected</span>
                  </>
                ) : (
                  <span className="font-medium">Select this level</span>
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
            <h4 className="font-bold text-blue-300 mb-2">Tips</h4>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Positions with <strong className="text-purple-300">✨ Recommended</strong> label are best suited to your experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>You can choose a lower position to increase opportunities or higher to challenge yourself</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>The system will search for suitable jobs on major recruitment sites in Vietnam</span>
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
    intern: 'Suitable for students, want to gain practical experience',
    fresher: 'For fresh graduates, starting professional career',
    junior: '1-3 years experience, work independently on basic tasks',
    middle: '3-5 years experience, can lead small projects or teams',
    senior: '5+ years expert, advise on architecture and solve complex problems',
    manager: 'Manage team, coordinate multiple projects, strong leadership skills',
    director: 'Senior leadership, define strategy and organizational development'
  };
  return descriptions[level];
}
