'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

const languageOptions: { code: Language; label: string; flag: string }[] = [
  { code: 'vi', label: 'Tiếng Việt', flag: 'VN' },
  { code: 'en', label: 'English', flag: 'US' },
  { code: 'ja', label: '日本語', flag: 'JP' },
  { code: 'zh', label: '中文', flag: 'CN' },
  { code: 'ko', label: '한국어', flag: 'KR' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languageOptions.find(l => l.code === language) || languageOptions[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Label */}
      <div className="flex items-center gap-2 mb-2">
        <Globe className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Output Language</span>
      </div>

      {/* Dropdown Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-purple-400">{currentLanguage.flag}</span>
          <span className="text-white">{currentLanguage.label}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl bg-[#1a1a2e] border border-white/10 shadow-xl z-50 overflow-hidden"
          >
            {languageOptions.map((lang) => (
              <motion.button
                key={lang.code}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 transition-all ${
                  language === lang.code ? 'bg-purple-500/10' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-purple-400 w-6">{lang.flag}</span>
                  <span className={language === lang.code ? 'text-white' : 'text-gray-300'}>
                    {lang.label}
                  </span>
                </div>
                {language === lang.code && (
                  <Check className="w-4 h-4 text-purple-400" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
