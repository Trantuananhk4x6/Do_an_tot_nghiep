'use client';

import React, { useState } from 'react';
import CVUploadStep from './components/CVUploadStep';
import FieldSelection from './components/FieldSelection';
import LevelSelection from './components/LevelSelection';
import JobResults from './components/JobResults';
import { CVAnalysisForJob, JobLevel } from './types/job.types';
import { analyzeCVForJobSearch } from './services/cvAnalyzer';
import { getPlatformsByCountry } from './services/jobPlatforms';
import { motion } from 'framer-motion';
import Animated3DBackground from '@/components/ui/Animated3DBackground';
import { Briefcase, Sparkles, ArrowLeft } from 'lucide-react';

type Step = 'upload' | 'field' | 'level' | 'results';

export default function FindJobPage() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [cvText, setCvText] = useState<string>('');
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysisForJob | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<JobLevel | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleCVAnalyzed = async (text: string) => {
    setCvText(text);
    setIsAnalyzing(true);
    
    try {
      const analysis = await analyzeCVForJobSearch(text);
      setCvAnalysis(analysis);
      setCurrentStep('field');
    } catch (error) {
      console.error('Error analyzing CV:', error);
      alert('An error occurred while analyzing CV. Please try again.');
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
    setCurrentStep('results');
  };

  const handleBack = () => {
    if (currentStep === 'results') {
      setCurrentStep('level');
    } else if (currentStep === 'level') {
      setCurrentStep('field');
    } else if (currentStep === 'field') {
      setCurrentStep('upload');
      setCvAnalysis(null);
      setSelectedField(null);
    }
  };

  const platforms = cvAnalysis 
    ? getPlatformsByCountry(cvAnalysis.location.includes('Vietnam') || cvAnalysis.location.includes('Việt Nam') ? 'Vietnam' : 'Global')
    : [];

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
            Find Your Dream Job
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-300 text-lg">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <p>AI-powered job search based on your CV</p>
          </div>
        </motion.div>

        {/* Progress Indicator với enhanced animations */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-20 blur-xl" />
            <div className="relative glass-effect rounded-2xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between">
                {/* Step 1 - Upload CV */}
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                    currentStep !== 'upload'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : currentStep === 'upload'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-white/20 text-gray-400'
                  }`}>
                    {currentStep === 'upload' && (
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
                    <span className="relative z-10">{currentStep !== 'upload' ? '✓' : '1'}</span>
                  </div>
                  <span className="text-white font-semibold hidden md:block">Upload CV</span>
                </motion.div>

                <div className={`flex-1 h-1 mx-4 ${
                  currentStep !== 'upload' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                    : 'bg-white/20'
                }`} />

                {/* Step 2 - Chọn Lĩnh Vực */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`flex items-center gap-3 ${
                    currentStep === 'field' || currentStep === 'level' || currentStep === 'results' ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                    currentStep === 'level' || currentStep === 'results'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : currentStep === 'field'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-white/20 text-gray-400'
                  }`}>
                    {currentStep === 'level' || currentStep === 'results' ? '✓' : '2'}
                  </div>
                  <span className="text-white font-semibold hidden md:block">Select Field</span>
                </motion.div>

                <div className={`flex-1 h-1 mx-4 ${
                  currentStep === 'level' || currentStep === 'results' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                    : 'bg-white/20'
                }`} />

                {/* Step 3 - Chọn Vị Trí */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`flex items-center gap-3 ${
                    currentStep === 'level' || currentStep === 'results' ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                    currentStep === 'results'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : currentStep === 'level'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-white/20 text-gray-400'
                  }`}>
                    {currentStep === 'results' ? '✓' : '3'}
                  </div>
                  <span className="text-white font-semibold hidden md:block">Select Level</span>
                </motion.div>

                <div className={`flex-1 h-1 mx-4 ${
                  currentStep === 'results' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                    : 'bg-white/20'
                }`} />

                {/* Step 4 - Kết Quả */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`flex items-center gap-3 ${
                    currentStep === 'results' ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                    currentStep === 'results'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-white/20 text-gray-400'
                  }`}>
                    4
                  </div>
                  <span className="text-white font-semibold hidden md:block">Results</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back Button với animation */}
        {currentStep !== 'upload' && !isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-6xl mx-auto mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="relative overflow-hidden flex items-center gap-2 px-6 py-3 glass-effect border border-purple-500/30 rounded-xl text-white transition-all duration-300"
            >
              <motion.div
                animate={{ x: [-200, 1000] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
              />
              <ArrowLeft className="w-5 h-5 relative z-10" />
              <span className="relative z-10 font-semibold">Back</span>
            </motion.button>
          </motion.div>
        )}

      {/* Content */}
      {isAnalyzing ? (
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-effect rounded-3xl p-12">
            <div className="text-8xl mb-6 animate-bounce">🤖</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Analyzing your CV...
            </h3>
            <p className="text-gray-300 mb-8">
              AI is analyzing your skills, experience and suggesting suitable positions
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
            />
          )}

          {currentStep === 'results' && cvAnalysis && selectedField && selectedLevel && (
            <JobResults 
              platforms={platforms}
              keyword={selectedField}
              location={cvAnalysis.location}
              level={selectedLevel}
              onBack={handleBack}
            />
          )}
        </>
      )}
      </div>
    </div>
  );
}
