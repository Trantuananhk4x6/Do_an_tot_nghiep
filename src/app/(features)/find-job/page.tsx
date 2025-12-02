'use client';

import React, { useState } from 'react';
import CVUploadStep from './components/CVUploadStep';
import FieldSelection from './components/FieldSelection';
import LevelSelection from './components/LevelSelection';
import JobPreferencesStep from './components/JobPreferencesStep';
import JobResults from './components/JobResults';
import MarketInsightsCard from './components/MarketInsightsCard';
import LanguageSwitcher from './components/LanguageSwitcher';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { CVAnalysisForJob, JobLevel, JobPreferences, LocationInfo } from './types/job.types';
import { analyzeCVForJobSearch } from './services/cvAnalyzer';
import { getPlatformsByCountry } from './services/jobPlatforms';
import { getFieldMarketInsights } from './services/marketInsights';
import { motion } from 'framer-motion';
import Animated3DBackground from '@/components/ui/Animated3DBackground';
import { Briefcase, Sparkles, ArrowLeft, MapPin, TrendingUp, Bot, Check } from 'lucide-react';

type Step = 'upload' | 'field' | 'level' | 'preferences' | 'results';

function FindJobContent() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [cvText, setCvText] = useState<string>('');
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysisForJob | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<JobLevel | null>(null);
  const [jobPreferences, setJobPreferences] = useState<JobPreferences | null>(null);
  const [userLocation, setUserLocation] = useState<LocationInfo | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showMarketInsights, setShowMarketInsights] = useState(false);
  
  const { language, t } = useLanguage();

  const handleCVAnalyzed = async (text: string) => {
    setCvText(text);
    setIsAnalyzing(true);
    
    try {
      const analysis = await analyzeCVForJobSearch(text);
      setCvAnalysis(analysis);
      
      // Set initial location from CV analysis
      if (analysis.detectedLocation) {
        setUserLocation(analysis.detectedLocation);
      }
      
      setCurrentStep('field');
    } catch (error) {
      console.error('Error analyzing CV:', error);
      alert(language === 'vi' 
        ? 'Đã xảy ra lỗi khi phân tích CV. Vui lòng thử lại.'
        : 'An error occurred while analyzing CV. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFieldSelected = (field: string) => {
    setSelectedField(field);
    setCurrentStep('level');
  };

  const handleLevelSelected = (level: JobLevel) => {
    setSelectedLevel(level);
    setCurrentStep('preferences');
  };

  const handlePreferencesSelected = (preferences: JobPreferences, location: LocationInfo) => {
    setJobPreferences(preferences);
    setUserLocation(location);

    // Build combined keyword: Position + Level name
    const levelName = selectedLevel ? selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1) : '';
    const baseField = selectedField || (cvAnalysis?.mainField || '');
    const combinedKeyword = `${baseField} ${levelName}`.trim();
    setSearchKeyword(combinedKeyword);

    // Use the selected location from preferences
    let publicLocation = location.city || 'Vietnam';
    
    // Map city to standard format for job platforms
    const l = publicLocation.toLowerCase();
    if (l.includes('hồ chí minh') || l.includes('ho chi minh') || l.includes('hcm') || l.includes('saigon')) {
      publicLocation = 'Ho Chi Minh';
    } else if (l.includes('hà nội') || l.includes('hanoi') || l.includes('ha noi')) {
      publicLocation = 'Hà Nội';
    } else if (l.includes('đà nẵng') || l.includes('da nang')) {
      publicLocation = 'Đà Nẵng';
    }
    
    setSearchLocation(publicLocation);
    setCurrentStep('results');
  };

  const handleBack = () => {
    if (currentStep === 'results') {
      setCurrentStep('preferences');
      setSearchKeyword('');
      setSearchLocation('');
    } else if (currentStep === 'preferences') {
      setCurrentStep('level');
      setJobPreferences(null);
    } else if (currentStep === 'level') {
      setCurrentStep('field');
      setSelectedLevel(null);
    } else if (currentStep === 'field') {
      setCurrentStep('upload');
      setCvAnalysis(null);
      setSelectedField(null);
    }
  };

  const platforms = cvAnalysis 
    ? getPlatformsByCountry((searchLocation || userLocation?.city || cvAnalysis.location).toLowerCase().includes('vietnam') || 
        (searchLocation || userLocation?.city || cvAnalysis.location).toLowerCase().includes('việt nam') ? 'Vietnam' : 'Global')
    : [];

  const marketInsights = selectedField ? getFieldMarketInsights(selectedField) : null;

  // Get step labels based on language
  const getStepLabel = (step: string) => {
    const labels: Record<string, string> = {
      upload: t.steps.upload,
      field: t.steps.field,
      level: t.steps.level,
      preferences: t.steps.preferences,
      results: t.steps.results
    };
    return labels[step] || step;
  };

  return (
    <div className="relative min-h-screen">
      <Animated3DBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Language Switcher */}
          <div className="flex justify-end mb-6">
            <LanguageSwitcher />
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"
            >
              <Briefcase className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            {t.page.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-300 text-lg">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <p>{t.page.subtitle}</p>
          </div>
          
          {/* Show detected location */}
          {userLocation && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 mt-4"
            >
              <MapPin className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">
                {userLocation.isDetected 
                  ? (language === 'vi' ? 'Vị trí hiện tại: ' : 'Current location: ')
                  : (language === 'vi' ? 'Vị trí: ' : 'Location: ')
                }
                {userLocation.city}, {userLocation.country}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Progress Indicator - Updated for 5 steps */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl mx-auto mb-12"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-20 blur-xl" />
            <div className="relative glass-effect rounded-2xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between">
                {/* Step 1 - Upload CV */}
                <StepIndicator 
                  step={1} 
                  label={getStepLabel('upload')} 
                  isActive={currentStep === 'upload'}
                  isCompleted={currentStep !== 'upload'}
                />
                
                <StepConnector isActive={currentStep !== 'upload'} />

                {/* Step 2 - Chọn Lĩnh Vực */}
                <StepIndicator 
                  step={2} 
                  label={getStepLabel('field')} 
                  isActive={currentStep === 'field'}
                  isCompleted={['level', 'preferences', 'results'].includes(currentStep)}
                />

                <StepConnector isActive={['level', 'preferences', 'results'].includes(currentStep)} />

                {/* Step 3 - Chọn Level */}
                <StepIndicator 
                  step={3} 
                  label={getStepLabel('level')} 
                  isActive={currentStep === 'level'}
                  isCompleted={['preferences', 'results'].includes(currentStep)}
                />

                <StepConnector isActive={['preferences', 'results'].includes(currentStep)} />

                {/* Step 4 - Preferences */}
                <StepIndicator 
                  step={4} 
                  label={getStepLabel('preferences')} 
                  isActive={currentStep === 'preferences'}
                  isCompleted={currentStep === 'results'}
                />

                <StepConnector isActive={currentStep === 'results'} />

                {/* Step 5 - Results */}
                <StepIndicator 
                  step={5} 
                  label={getStepLabel('results')} 
                  isActive={currentStep === 'results'}
                  isCompleted={false}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        {currentStep !== 'upload' && !isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-6xl mx-auto mb-6 flex items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="relative overflow-hidden flex items-center gap-2 px-6 py-3 glass-effect border border-purple-500/30 rounded-xl text-white transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">{language === 'vi' ? 'Quay lại' : 'Back'}</span>
            </motion.button>

            {/* Market Insights Toggle Button */}
            {selectedField && marketInsights && currentStep !== 'results' && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowMarketInsights(!showMarketInsights)}
                className="flex items-center gap-2 px-4 py-3 glass-effect border border-green-500/30 rounded-xl text-green-400 hover:bg-green-500/10 transition-all"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {showMarketInsights 
                    ? (language === 'vi' ? 'Ẩn thông tin thị trường' : 'Hide market insights')
                    : (language === 'vi' ? 'Xem thông tin thị trường' : 'View market insights')
                  }
                </span>
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Market Insights Panel */}
        {showMarketInsights && marketInsights && currentStep !== 'results' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-6xl mx-auto mb-8"
          >
            <MarketInsightsCard insights={marketInsights} />
          </motion.div>
        )}

        {/* Content */}
        {isAnalyzing ? (
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-effect rounded-3xl p-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center animate-bounce">
                <Bot className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {language === 'vi' ? 'Đang phân tích CV của bạn...' : 'Analyzing your CV...'}
              </h3>
              <p className="text-gray-300 mb-8">
                {language === 'vi' 
                  ? 'AI đang phân tích kỹ năng, kinh nghiệm và đề xuất vị trí phù hợp'
                  : 'AI is analyzing skills, experience and suggesting suitable positions'
                }
              </p>
              <div className="max-w-md mx-auto">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse" 
                       style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {currentStep === 'upload' && (
              <CVUploadStep onCVAnalyzed={handleCVAnalyzed} />
            )}

            {currentStep === 'field' && cvAnalysis && (
              <FieldSelection 
                cvAnalysis={cvAnalysis}
                selectedField={selectedField}
                onFieldSelected={handleFieldSelected}
              />
            )}

            {currentStep === 'level' && cvAnalysis && selectedField && (
              <LevelSelection 
                cvAnalysis={cvAnalysis}
                selectedLevel={selectedLevel}
                onLevelSelected={handleLevelSelected}
                selectedField={selectedField}
              />
            )}

            {currentStep === 'preferences' && cvAnalysis && selectedField && selectedLevel && (
              <JobPreferencesStep
                currentLocation={userLocation?.city || cvAnalysis.location}
                selectedLevel={selectedLevel}
                selectedField={selectedField}
                onPreferencesSelected={handlePreferencesSelected}
                onBack={handleBack}
              />
            )}

            {currentStep === 'results' && cvAnalysis && selectedField && selectedLevel && (
              <div className="space-y-8">
                {/* Market Insights in Results */}
                {marketInsights && (
                  <MarketInsightsCard insights={marketInsights} />
                )}
                
                <JobResults 
                  platforms={platforms}
                  keyword={searchKeyword || selectedField}
                  location={searchLocation || userLocation?.city || cvAnalysis.location}
                  level={selectedLevel}
                  onBack={handleBack}
                  preferences={jobPreferences}
                  marketInsights={marketInsights}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Main Page Component with Language Provider
export default function FindJobPage() {
  return (
    <LanguageProvider>
      <FindJobContent />
    </LanguageProvider>
  );
}

// Step Indicator Component
function StepIndicator({ 
  step, 
  label, 
  isActive, 
  isCompleted 
}: { 
  step: number; 
  label: string; 
  isActive: boolean; 
  isCompleted: boolean;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: step * 0.1 }}
      className="flex flex-col items-center gap-2"
    >
      <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-bold text-sm md:text-base ${
        isCompleted
          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
          : isActive
          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
          : 'bg-white/20 text-gray-400'
      }`}>
        {isActive && (
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(139, 92, 246, 0.4)",
                "0 0 40px rgba(139, 92, 246, 0.6)",
                "0 0 20px rgba(139, 92, 246, 0.4)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-xl"
          />
        )}
        <span className="relative z-10">{isCompleted ? <Check className="w-5 h-5" /> : step}</span>
      </div>
      <span className="text-white text-xs md:text-sm font-medium text-center hidden sm:block">{label}</span>
    </motion.div>
  );
}

// Step Connector Component
function StepConnector({ isActive }: { isActive: boolean }) {
  return (
    <div className={`flex-1 h-1 mx-2 md:mx-4 rounded-full ${
      isActive 
        ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
        : 'bg-white/20'
    }`} />
  );
}
