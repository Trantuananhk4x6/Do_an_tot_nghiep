'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  Check, 
  MapPin, 
  Briefcase, 
  DollarSign,
  Building2,
  Home,
  Sparkles,
  Target,
  Globe,
  Lightbulb,
  CheckCircle2,
  Rocket,
  Layers,
  ChevronDown,
  ChevronUp,
  Star,
  Filter,
  Zap
} from 'lucide-react';
import { JobSearchPlatform, JobPreferences, FieldMarketInsights } from '../types/job.types';
import { formatLevelForPlatform, vietnamJobPlatforms, internationalJobPlatforms } from '../services/jobPlatforms';
import { formatSalary } from '../services/marketInsights';
import { platformCategories, getRecommendedPlatforms } from '../services/jobAvailabilityService';
import { useLanguage } from '../contexts/LanguageContext';

interface JobResultsProps {
  platforms: JobSearchPlatform[];
  keyword: string;
  location: string;
  level: string;
  onBack: () => void;
  preferences?: JobPreferences | null;
  marketInsights?: FieldMarketInsights | null;
}

export default function JobResults({ 
  platforms: initialPlatforms, 
  keyword, 
  location, 
  level, 
  onBack,
  preferences,
  marketInsights
}: JobResultsProps) {
  const { language, t } = useLanguage();
  
  // Use all platforms instead of just the ones passed
  const allPlatforms = useMemo(() => {
    return getRecommendedPlatforms(
      keyword,
      location,
      level,
      preferences?.workPreference,
      marketInsights?.field
    );
  }, [keyword, location, level, preferences?.workPreference, marketInsights?.field]);

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    allPlatforms.filter(p => p.recommended).map(p => p.id)
  );
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['vietnam-major', 'global-major']);
  const [filterType, setFilterType] = useState<'all' | 'recommended' | 'vietnam' | 'international'>('all');

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const selectAllInCategory = (platformIds: string[]) => {
    setSelectedPlatforms(prev => {
      const newSelected = [...prev];
      platformIds.forEach(id => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
      return newSelected;
    });
  };

  const deselectAllInCategory = (platformIds: string[]) => {
    setSelectedPlatforms(prev => prev.filter(id => !platformIds.includes(id)));
  };

  // Filter platforms based on filter type
  const filteredPlatforms = useMemo(() => {
    switch (filterType) {
      case 'recommended':
        return allPlatforms.filter(p => p.recommended);
      case 'vietnam':
        return allPlatforms.filter(p => p.country === 'Vietnam');
      case 'international':
        return allPlatforms.filter(p => p.country === 'Global');
      default:
        return allPlatforms;
    }
  }, [allPlatforms, filterType]);

  // Group platforms by category
  const groupedPlatforms = useMemo(() => {
    const platformMap = new Map(filteredPlatforms.map(p => [p.id, p]));
    
    return platformCategories
      .map(category => ({
        category,
        platforms: category.platforms
          .map(id => platformMap.get(id))
          .filter((p): p is typeof filteredPlatforms[0] => p !== undefined),
      }))
      .filter(group => group.platforms.length > 0);
  }, [filteredPlatforms]);

  const openAllSelected = () => {
    const selected = allPlatforms.filter(p => selectedPlatforms.includes(p.id));
    selected.forEach(platform => {
      window.open(platform.searchUrl, '_blank');
    });
  };

  const getWorkPreferenceLabel = (pref: string) => {
    switch (pref) {
      case 'remote': return { label: 'Remote', icon: <Home className="w-4 h-4" /> };
      case 'hybrid': return { label: 'Hybrid', icon: <Building2 className="w-4 h-4" /> };
      case 'onsite': return { label: 'Onsite', icon: <Building2 className="w-4 h-4" /> };
      default: return { label: language === 'vi' ? 'Tất cả' : 'All', icon: <Globe className="w-4 h-4" /> };
    }
  };

  // Get platform logo as styled initials
  const renderPlatformLogo = (logo: string, name: string, recommended?: boolean) => {
    return (
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center relative ${
        recommended 
          ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border border-yellow-500/30'
          : 'bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-purple-500/30'
      }`}>
        <span className="text-sm font-bold text-white">{logo}</span>
        {recommended && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
            <Star className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          {t.results.title}
        </h2>
        <p className="text-gray-300">
          {t.results.subtitle}
        </p>
        <p className="text-sm text-purple-400 mt-2">
          {allPlatforms.length} {language === 'vi' ? 'nền tảng tìm việc' : 'job platforms available'}
        </p>
      </div>

      {/* Enhanced Search Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-6 mb-8 border border-purple-500/30"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-4">{t.results.searchInfo}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  <p className="text-sm text-gray-400">{t.results.position}</p>
                </div>
                <p className="text-white font-medium truncate">{keyword}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <p className="text-sm text-gray-400">{t.results.level}</p>
                </div>
                <p className="text-white font-medium capitalize">{level}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <p className="text-sm text-gray-400">{t.results.location}</p>
                </div>
                <p className="text-white font-medium">{location}</p>
              </div>
              {preferences && (
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    {getWorkPreferenceLabel(preferences.workPreference).icon}
                    <p className="text-sm text-gray-400">{t.results.workType}</p>
                  </div>
                  <p className="text-white font-medium">
                    {getWorkPreferenceLabel(preferences.workPreference).label}
                  </p>
                </div>
              )}
            </div>

            {/* Salary Expectation */}
            {preferences?.salaryRange && (
              <div className="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400 text-sm">{t.results.expectedSalary}:</span>
                  <span className="text-green-400 font-bold">
                    {formatSalary(preferences.salaryRange)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            filterType === 'all'
              ? 'bg-purple-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Layers className="w-4 h-4" />
          {language === 'vi' ? 'Tất cả' : 'All'} ({allPlatforms.length})
        </button>
        <button
          onClick={() => setFilterType('recommended')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            filterType === 'recommended'
              ? 'bg-yellow-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Star className="w-4 h-4" />
          {language === 'vi' ? 'Đề xuất' : 'Recommended'}
        </button>
        <button
          onClick={() => setFilterType('vietnam')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            filterType === 'vietnam'
              ? 'bg-red-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <MapPin className="w-4 h-4" />
          {t.results.vietnamPlatforms}
        </button>
        <button
          onClick={() => setFilterType('international')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            filterType === 'international'
              ? 'bg-blue-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Globe className="w-4 h-4" />
          {t.results.internationalPlatforms}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={onBack}
          className="px-6 py-3 glass-effect border-2 border-white/20 text-white rounded-xl font-medium hover:border-purple-400 transition-all duration-300"
        >
          ← {t.common.back}
        </button>
        <button
          onClick={openAllSelected}
          disabled={selectedPlatforms.length === 0}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl glow-effect disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-5 h-5" />
          {t.results.openAll} ({selectedPlatforms.length}) {t.results.selected}
        </button>
      </div>

      {/* Platforms by Category */}
      <div className="space-y-6">
        {groupedPlatforms.map(({ category, platforms }) => {
          const isExpanded = expandedCategories.includes(category.id);
          const selectedInCategory = platforms.filter(p => selectedPlatforms.includes(p.id)).length;
          const allSelectedInCategory = selectedInCategory === platforms.length;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-2xl border border-white/10 overflow-hidden"
            >
              {/* Category Header */}
              <div
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer"
              >
                <div 
                  className="flex items-center gap-3 flex-1"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white">
                      {language === 'vi' ? category.nameVi : category.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {selectedInCategory}/{platforms.length} {language === 'vi' ? 'đã chọn' : 'selected'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (allSelectedInCategory) {
                        deselectAllInCategory(platforms.map(p => p.id));
                      } else {
                        selectAllInCategory(platforms.map(p => p.id));
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      allSelectedInCategory
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    {allSelectedInCategory 
                      ? (language === 'vi' ? 'Bỏ chọn tất cả' : 'Deselect all')
                      : (language === 'vi' ? 'Chọn tất cả' : 'Select all')
                    }
                  </button>
                  <div 
                    onClick={() => toggleCategory(category.id)}
                    className="cursor-pointer p-1 hover:bg-white/10 rounded-lg transition-all"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Platform Cards */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 pt-0">
                      {platforms.map((platform, index) => {
                        const isSelected = selectedPlatforms.includes(platform.id);
                        
                        return (
                          <motion.div
                            key={platform.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`bg-white/5 rounded-xl p-4 transition-all duration-300 cursor-pointer ${
                              isSelected 
                                ? 'ring-2 ring-purple-500 bg-purple-500/10' 
                                : 'hover:bg-white/10'
                            }`}
                            onClick={() => togglePlatform(platform.id)}
                          >
                            <div className="flex items-start gap-3">
                              {renderPlatformLogo(platform.logo, platform.name, platform.recommended)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-white truncate">{platform.name}</h4>
                                  {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                                </div>
                                <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                                  {platform.description}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 mt-3">
                              <a
                                href={platform.searchUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-xs font-medium hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {t.results.openPage}
                              </a>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Tips with market insights */}
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
            <h4 className="font-bold text-blue-300 mb-2">{t.results.tips}</h4>
            <ul className="space-y-1 text-gray-300 text-sm">
              {t.results.tipItems.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span>•</span>
                  <span>{tip}</span>
                </li>
              ))}
              {marketInsights && (
                <>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span className="text-green-400">
                      {t.results.demandFor} {marketInsights.field}: {marketInsights.jobOpenings} {t.results.openPositions}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span className="text-purple-400">
                      {t.results.hotSkills}: {marketInsights.hotSkills.slice(0, 3).join(', ')}
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center glass-effect rounded-xl p-6"
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <Layers className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">{allPlatforms.length}</p>
          <p className="text-sm text-gray-400">{t.results.platforms}</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center glass-effect rounded-xl p-6"
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">{selectedPlatforms.length}</p>
          <p className="text-sm text-gray-400">{t.results.selectedCount}</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center glass-effect rounded-xl p-6"
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {allPlatforms.filter(p => p.recommended).length}
          </p>
          <p className="text-sm text-gray-400">{language === 'vi' ? 'Đề xuất' : 'Recommended'}</p>
        </motion.div>
      </div>
    </div>
  );
}
