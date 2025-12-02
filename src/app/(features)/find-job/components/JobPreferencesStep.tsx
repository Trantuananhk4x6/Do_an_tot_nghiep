'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Building2, 
  Home, 
  Briefcase, 
  DollarSign, 
  Globe, 
  Navigation,
  Loader2,
  Check,
  ChevronDown,
  Target,
  Flag
} from 'lucide-react';
import { JobPreferences, WorkPreference, CompanySize, LocationInfo } from '../types/job.types';
import { getCurrentLocation, getAvailableCities, VIETNAMESE_CITIES } from '../services/locationService';
import { getSalaryRangeForLevel, formatSalary } from '../services/marketInsights';
import { JobLevel } from '../types/job.types';
import { useLanguage } from '../contexts/LanguageContext';

interface JobPreferencesStepProps {
  currentLocation: string;
  selectedLevel: JobLevel;
  selectedField: string;
  onPreferencesSelected: (preferences: JobPreferences, location: LocationInfo) => void;
  onBack: () => void;
}

export default function JobPreferencesStep({
  currentLocation,
  selectedLevel,
  selectedField,
  onPreferencesSelected,
  onBack
}: JobPreferencesStepProps) {
  const { t, language } = useLanguage();
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<LocationInfo | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>(currentLocation || 'Hồ Chí Minh');
  const [workPreference, setWorkPreference] = useState<WorkPreference>('any');
  const [companySize, setCompanySize] = useState<CompanySize>('any');
  const [willingToRelocate, setWillingToRelocate] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const estimatedSalary = getSalaryRangeForLevel(selectedField, selectedLevel);
  const cities = getAvailableCities();

  // Auto-detect location on mount
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    setIsDetecting(true);
    try {
      const location = await getCurrentLocation();
      if (location) {
        setDetectedLocation(location);
        setSelectedCity(location.city);
      }
    } catch (error) {
      console.error('Failed to detect location:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleContinue = () => {
    const preferences: JobPreferences = {
      workPreference,
      companySize,
      willingToRelocate,
      preferredLocations: [selectedCity],
      salaryRange: estimatedSalary
    };

    const locationInfo: LocationInfo = detectedLocation || {
      city: selectedCity,
      country: VIETNAMESE_CITIES.find(c => c.city === selectedCity)?.country || 'Vietnam',
      isDetected: false
    };

    onPreferencesSelected(preferences, locationInfo);
  };

  const workOptions: { value: WorkPreference; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: 'onsite', label: 'Onsite', icon: <Building2 className="w-5 h-5" />, desc: language === 'vi' ? 'Làm việc tại văn phòng' : 'Work at office' },
    { value: 'remote', label: 'Remote', icon: <Home className="w-5 h-5" />, desc: language === 'vi' ? 'Làm việc từ xa 100%' : '100% remote work' },
    { value: 'hybrid', label: 'Hybrid', icon: <Briefcase className="w-5 h-5" />, desc: language === 'vi' ? 'Kết hợp onsite & remote' : 'Combined onsite & remote' },
    { value: 'any', label: language === 'vi' ? 'Tất cả' : 'All', icon: <Globe className="w-5 h-5" />, desc: language === 'vi' ? 'Không giới hạn' : 'No limit' },
  ];

  const sizeOptions: { value: CompanySize; label: string; desc: string }[] = [
    { value: 'startup', label: 'Startup', desc: language === 'vi' ? '1-50 người' : '1-50 people' },
    { value: 'small', label: language === 'vi' ? 'Nhỏ' : 'Small', desc: language === 'vi' ? '50-200 người' : '50-200 people' },
    { value: 'medium', label: language === 'vi' ? 'Vừa' : 'Medium', desc: language === 'vi' ? '200-1000 người' : '200-1000 people' },
    { value: 'large', label: language === 'vi' ? 'Lớn' : 'Large', desc: language === 'vi' ? '1000-5000 người' : '1000-5000 people' },
    { value: 'enterprise', label: language === 'vi' ? 'Tập đoàn' : 'Enterprise', desc: '5000+' },
    { value: 'any', label: language === 'vi' ? 'Tất cả' : 'All', desc: language === 'vi' ? 'Không giới hạn' : 'No limit' },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-2 flex items-center justify-center gap-3">
          <Target className="w-8 h-8 text-purple-400" />
          {t.preferences.title}
        </h2>
        <p className="text-gray-300">
          {t.preferences.subtitle}
        </p>
      </div>

      {/* Location Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-6 mb-6 border border-purple-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t.preferences.location}</h3>
            <p className="text-sm text-gray-400">{t.preferences.locationDesc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Auto-detect location */}
          <button
            onClick={detectLocation}
            disabled={isDetecting}
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-purple-500/50 hover:border-purple-500 hover:bg-purple-500/10 transition-all"
          >
            {isDetecting ? (
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
            ) : (
              <Navigation className="w-5 h-5 text-purple-400" />
            )}
            <div className="text-left">
              <p className="text-white font-medium">
                {isDetecting ? t.preferences.detectingLocation : t.preferences.autoDetect}
              </p>
              {detectedLocation && (
                <p className="text-sm text-green-400 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  {t.preferences.detected}: {detectedLocation.city}
                </p>
              )}
            </div>
          </button>

          {/* City selector */}
          <div className="relative">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-white/20 hover:border-purple-500 bg-white/5 transition-all"
            >
              <span className="text-white font-medium">{selectedCity}</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showCityDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto glass-effect rounded-xl border border-white/20 z-50"
              >
                <div className="p-2">
                  <p className="text-xs text-gray-400 px-3 py-2 flex items-center gap-1">
                    <Flag className="w-3 h-3" /> {language === 'vi' ? 'Việt Nam' : 'Vietnam'}
                  </p>
                  {cities.filter(c => c.isVietnam).map(city => (
                    <button
                      key={city.city}
                      onClick={() => {
                        setSelectedCity(city.city);
                        setShowCityDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                        selectedCity === city.city 
                          ? 'bg-purple-500 text-white' 
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {city.city}
                    </button>
                  ))}
                  <p className="text-xs text-gray-400 px-3 py-2 mt-2 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {language === 'vi' ? 'Quốc tế' : 'International'}
                  </p>
                  {cities.filter(c => !c.isVietnam).map(city => (
                    <button
                      key={city.city}
                      onClick={() => {
                        setSelectedCity(city.city);
                        setShowCityDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                        selectedCity === city.city 
                          ? 'bg-purple-500 text-white' 
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {city.city}, {city.country}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Willing to relocate */}
        <label className="flex items-center gap-3 mt-4 cursor-pointer group">
          <input
            type="checkbox"
            checked={willingToRelocate}
            onChange={(e) => setWillingToRelocate(e.target.checked)}
            className="w-5 h-5 rounded border-2 border-white/30 bg-transparent checked:bg-purple-500 checked:border-purple-500 transition-all"
          />
          <span className="text-gray-300 group-hover:text-white transition-colors">
            {t.preferences.willingToRelocate}
          </span>
        </label>
      </motion.div>

      {/* Work Preference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-effect rounded-2xl p-6 mb-6 border border-blue-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t.preferences.workType}</h3>
            <p className="text-sm text-gray-400">{t.preferences.workTypeDesc}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {workOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setWorkPreference(option.value)}
              className={`p-4 rounded-xl border-2 transition-all ${
                workPreference === option.value
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-white/20 hover:border-blue-500/50'
              }`}
            >
              <div className={`mb-2 ${workPreference === option.value ? 'text-blue-400' : 'text-gray-400'}`}>
                {option.icon}
              </div>
              <p className="text-white font-medium text-sm">{option.label}</p>
              <p className="text-xs text-gray-400">{option.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Company Size */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-effect rounded-2xl p-6 mb-6 border border-pink-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t.preferences.companySize}</h3>
            <p className="text-sm text-gray-400">{t.preferences.companySizeDesc}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {sizeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setCompanySize(option.value)}
              className={`p-3 rounded-xl border-2 transition-all ${
                companySize === option.value
                  ? 'border-pink-500 bg-pink-500/20'
                  : 'border-white/20 hover:border-pink-500/50'
              }`}
            >
              <p className="text-white font-medium text-sm">{option.label}</p>
              <p className="text-xs text-gray-400">{option.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Salary Estimation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-effect rounded-2xl p-6 mb-8 border border-green-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t.preferences.salaryEstimate}</h3>
            <p className="text-sm text-gray-400">{t.preferences.basedOn} {selectedField} - {selectedLevel}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-green-400 mb-2">
            {formatSalary(estimatedSalary)}
          </p>
          <p className="text-sm text-gray-400">
            * {t.preferences.salaryNote}
          </p>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-6 py-3 glass-effect border-2 border-white/20 text-white rounded-xl font-medium hover:border-purple-400 transition-all flex items-center gap-2"
        >
          <ChevronDown className="w-4 h-4 rotate-90" />
          {t.common.back}
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl glow-effect flex items-center justify-center gap-2"
        >
          {t.preferences.findNow}
          <Navigation className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
