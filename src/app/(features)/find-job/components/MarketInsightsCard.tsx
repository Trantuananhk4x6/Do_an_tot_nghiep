'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  Minus,
  Building2, 
  DollarSign, 
  Briefcase, 
  Zap,
  Users,
  Target,
  Lightbulb,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { FieldMarketInsights } from '../types/job.types';
import { formatSalary, getDemandLevelColor, getCompetitionDescription } from '../services/marketInsights';
import { useLanguage } from '../contexts/LanguageContext';

interface MarketInsightsCardProps {
  insights: FieldMarketInsights;
  className?: string;
}

export default function MarketInsightsCard({ insights, className = '' }: MarketInsightsCardProps) {
  const { language } = useLanguage();

  const getTrendIcon = () => {
    switch (insights.trendDirection) {
      case 'rising':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getTrendText = () => {
    if (language === 'vi') {
      switch (insights.trendDirection) {
        case 'rising': return 'Đang tăng';
        case 'declining': return 'Đang giảm';
        default: return 'Ổn định';
      }
    }
    switch (insights.trendDirection) {
      case 'rising': return 'Rising';
      case 'declining': return 'Declining';
      default: return 'Stable';
    }
  };

  const getDemandBadgeClass = () => {
    switch (insights.demandLevel) {
      case 'very-high':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'high':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getDemandText = () => {
    if (language === 'vi') {
      switch (insights.demandLevel) {
        case 'very-high': return 'Rất cao';
        case 'high': return 'Cao';
        case 'medium': return 'Trung bình';
        case 'low': return 'Thấp';
        default: return 'N/A';
      }
    }
    switch (insights.demandLevel) {
      case 'very-high': return 'Very High';
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'N/A';
    }
  };

  const getCompetitionText = () => {
    if (language === 'vi') {
      return insights.competitionLevel === 'low' ? 'Thấp' : 
             insights.competitionLevel === 'high' ? 'Cao' : 'Trung bình';
    }
    return insights.competitionLevel === 'low' ? 'Low' : 
           insights.competitionLevel === 'high' ? 'High' : 'Medium';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-effect rounded-2xl overflow-hidden border border-white/10 ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="text-lg font-bold text-white">
                {language === 'vi' ? 'Thông tin thị trường' : 'Market Insights'}
              </h3>
              <p className="text-sm text-purple-300">{insights.field}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDemandBadgeClass()}`}>
              {language === 'vi' ? 'Nhu cầu' : 'Demand'}: {getDemandText()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Salary */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">
                {language === 'vi' ? 'Mức lương' : 'Salary'}
              </span>
            </div>
            <p className="text-lg font-bold text-white">
              {formatSalary(insights.averageSalary)}
            </p>
          </div>

          {/* Job Openings */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">
                {language === 'vi' ? 'Việc làm' : 'Jobs'}
              </span>
            </div>
            <p className="text-lg font-bold text-white">{insights.jobOpenings}</p>
          </div>

          {/* Trend */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              {getTrendIcon()}
              <span className="text-sm text-gray-400">
                {language === 'vi' ? 'Xu hướng' : 'Trend'}
              </span>
            </div>
            <p className="text-lg font-bold text-white">{getTrendText()}</p>
          </div>

          {/* Competition */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-400">
                {language === 'vi' ? 'Cạnh tranh' : 'Competition'}
              </span>
            </div>
            <p className="text-lg font-bold text-white capitalize">
              {getCompetitionText()}
            </p>
          </div>
        </div>

        {/* Hot Skills */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h4 className="text-white font-semibold">
              {language === 'vi' ? 'Hot Skills đang được săn đón' : 'In-demand Hot Skills'}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {insights.hotSkills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white rounded-full text-sm border border-purple-500/30 hover:border-purple-500/60 transition-colors"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Top Companies */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-blue-400" />
            <h4 className="text-white font-semibold">
              {language === 'vi' ? 'Top công ty tuyển dụng' : 'Top Hiring Companies'}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {insights.topCompanies.map((company, index) => (
              <motion.span
                key={company}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-lg text-sm border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-default"
              >
                {company}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h4 className="text-white font-semibold">
              {language === 'vi' ? 'Lời khuyên cho bạn' : 'Tips for you'}
            </h4>
          </div>
          <ul className="space-y-2">
            {insights.tips.map((tip, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-2 text-gray-300"
              >
                <ChevronRight className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
                <span className="text-sm">{tip}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Competition Description */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            <p className="text-sm text-gray-300">
              <span className="font-medium text-white">{getCompetitionDescription(insights.competitionLevel)}</span>
              {insights.competitionLevel === 'low' && (
                <span className="ml-2 text-green-400">
                  → {language === 'vi' ? 'Đây là thời điểm tốt để apply!' : 'This is a good time to apply!'}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
