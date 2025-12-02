'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  TrendingUp,
  Award,
  Zap,
  Star,
  ThumbsUp
} from 'lucide-react';
import { CVAnalysisForJob, FieldMarketInsights } from '../types/job.types';
import { useLanguage } from '../contexts/LanguageContext';

interface SmartMatchScoreProps {
  cvAnalysis: CVAnalysisForJob;
  selectedField: string;
  marketInsights?: FieldMarketInsights | null;
}

export default function SmartMatchScore({ 
  cvAnalysis, 
  selectedField,
  marketInsights 
}: SmartMatchScoreProps) {
  const { language, t } = useLanguage();
  
  // Calculate match score
  const fieldMatchScore = cvAnalysis.fieldMatchScore || 0;
  
  // Check skill coverage
  const hotSkills = marketInsights?.hotSkills || [];
  const userSkills = cvAnalysis.skills.map(s => s.toLowerCase());
  
  const skillMatches = hotSkills.filter(skill => 
    userSkills.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us))
  );
  const skillCoveragePercent = hotSkills.length > 0 
    ? Math.round((skillMatches.length / hotSkills.length) * 100) 
    : 50;

  // Overall score (weighted average)
  const overallScore = Math.round((fieldMatchScore * 0.6 + skillCoveragePercent * 0.4));

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-blue-500 to-cyan-500';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return { text: t.match.excellent, icon: <Star className="w-4 h-4 inline ml-1" /> };
    if (score >= 60) return { text: t.match.good, icon: <ThumbsUp className="w-4 h-4 inline ml-1" /> };
    if (score >= 40) return { text: t.match.average, icon: null };
    return { text: t.match.needMore, icon: null };
  };

  const scoreMessage = getScoreMessage(overallScore);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-effect rounded-2xl p-6 border border-purple-500/30"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <Award className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{t.match.title}</h3>
          <p className="text-sm text-gray-400">{selectedField}</p>
        </div>
      </div>

      {/* Overall Score Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${overallScore * 3.52} 352`}
              initial={{ strokeDasharray: "0 352" }}
              animate={{ strokeDasharray: `${overallScore * 3.52} 352` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              className={`text-3xl font-bold ${getScoreColor(overallScore)}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {overallScore}%
            </motion.span>
            <span className="text-xs text-gray-400">Match Score</span>
          </div>
        </div>
      </div>

      <p className={`text-center font-medium mb-6 ${getScoreColor(overallScore)} flex items-center justify-center gap-1`}>
        {scoreMessage.text}
        {scoreMessage.icon}
      </p>

      {/* Score Breakdown */}
      <div className="space-y-4">
        {/* Field Match */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {t.match.fieldMatch}
            </span>
            <span className={`text-sm font-medium ${getScoreColor(fieldMatchScore)}`}>
              {fieldMatchScore}%
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${getScoreGradient(fieldMatchScore)}`}
              initial={{ width: 0 }}
              animate={{ width: `${fieldMatchScore}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Skill Coverage */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {t.match.skillCoverage}
            </span>
            <span className={`text-sm font-medium ${getScoreColor(skillCoveragePercent)}`}>
              {skillMatches.length}/{hotSkills.length} skills
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${getScoreGradient(skillCoveragePercent)}`}
              initial={{ width: 0 }}
              animate={{ width: `${skillCoveragePercent}%` }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Skill Status List */}
      {hotSkills.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-gray-400 mb-3">{t.match.hotSkillsInField}</p>
          <div className="flex flex-wrap gap-2">
            {hotSkills.map((skill, index) => {
              const hasSkill = userSkills.some(us => 
                us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us)
              );
              return (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                    hasSkill 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {hasSkill ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {skill}
                </motion.span>
              );
            })}
          </div>
        </div>
      )}

      {/* Improvement Suggestions */}
      {cvAnalysis.improvementAreas && cvAnalysis.improvementAreas.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            {t.match.suggestions}
          </p>
          <ul className="space-y-2">
            {cvAnalysis.improvementAreas.map((area, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-sm text-yellow-400/80 flex items-start gap-2"
              >
                <span>•</span>
                <span>{area}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
