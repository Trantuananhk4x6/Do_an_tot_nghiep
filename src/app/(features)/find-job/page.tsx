'use client';

import React, { useState } from 'react';
import CVUploadStep from './components/CVUploadStep';
import FieldSelection from './components/FieldSelection';
import LevelSelection from './components/LevelSelection';
import JobResults from './components/JobResults';
import { CVAnalysisForJob, JobLevel } from './types/job.types';
import { analyzeCVForJobSearch } from './services/cvAnalyzer';
import { getPlatformsByCountry } from './services/jobPlatforms';

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
      alert('Có lỗi xảy ra khi phân tích CV. Vui lòng thử lại.');
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
    <div className="min-h-screen py-12 px-4">
      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex items-center justify-between">
          {/* Step 1 - Upload CV */}
          <div className={`flex items-center gap-3 ${
            currentStep === 'upload' ? 'opacity-100' : 'opacity-100'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              currentStep !== 'upload'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : currentStep === 'upload'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-white/20 text-gray-400'
            }`}>
              {currentStep !== 'upload' ? '✓' : '1'}
            </div>
            <span className="text-white font-medium hidden md:block">Upload CV</span>
          </div>

          <div className={`flex-1 h-1 mx-4 ${
            currentStep !== 'upload' 
              ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
              : 'bg-white/20'
          }`} />

          {/* Step 2 - Chọn Lĩnh Vực */}
          <div className={`flex items-center gap-3 ${
            currentStep === 'field' || currentStep === 'level' || currentStep === 'results' ? 'opacity-100' : 'opacity-50'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              currentStep === 'level' || currentStep === 'results'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : currentStep === 'field'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-white/20 text-gray-400'
            }`}>
              {currentStep === 'level' || currentStep === 'results' ? '✓' : '2'}
            </div>
            <span className="text-white font-medium hidden md:block">Chọn lĩnh vực</span>
          </div>

          <div className={`flex-1 h-1 mx-4 ${
            currentStep === 'level' || currentStep === 'results' 
              ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
              : 'bg-white/20'
          }`} />

          {/* Step 3 - Chọn Vị Trí */}
          <div className={`flex items-center gap-3 ${
            currentStep === 'level' || currentStep === 'results' ? 'opacity-100' : 'opacity-50'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              currentStep === 'results'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : currentStep === 'level'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-white/20 text-gray-400'
            }`}>
              {currentStep === 'results' ? '✓' : '3'}
            </div>
            <span className="text-white font-medium hidden md:block">Chọn vị trí</span>
          </div>

          <div className={`flex-1 h-1 mx-4 ${
            currentStep === 'results' 
              ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
              : 'bg-white/20'
          }`} />

          {/* Step 4 - Kết Quả */}
          <div className={`flex items-center gap-3 ${
            currentStep === 'results' ? 'opacity-100' : 'opacity-50'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              currentStep === 'results'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-white/20 text-gray-400'
            }`}>
              4
            </div>
            <span className="text-white font-medium hidden md:block">Kết quả</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      {currentStep !== 'upload' && !isAnalyzing && (
        <div className="max-w-6xl mx-auto mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-6 py-3 glass-effect border border-white/20 rounded-xl text-white hover:border-purple-400 transition-all duration-300"
          >
            <span>←</span>
            <span>Quay lại</span>
          </button>
        </div>
      )}

      {/* Content */}
      {isAnalyzing ? (
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-effect rounded-3xl p-12">
            <div className="text-8xl mb-6 animate-bounce">🤖</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Đang phân tích CV của bạn...
            </h3>
            <p className="text-gray-300 mb-8">
              AI đang phân tích kỹ năng, kinh nghiệm và đề xuất vị trí phù hợp
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
  );
}
