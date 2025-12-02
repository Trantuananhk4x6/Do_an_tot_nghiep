'use client';

import React from 'react';
import { Language } from '@/app/(features)/support-cv/types/cv.types';
import { Globe, Plus, Trash2, Lightbulb, Star } from 'lucide-react';

interface LanguagesSectionProps {
  data: Language[];
  onChange: (data: Language[]) => void;
}

export default function LanguagesSection({ data, onChange }: LanguagesSectionProps) {
  const addLanguage = () => {
    const newLang: Language = {
      id: Date.now().toString(),
      name: '',
      proficiency: 'conversational'
    };
    onChange([...data, newLang]);
  };

  const updateLanguage = (index: number, updates: Partial<Language>) => {
    const updated = [...data];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeLanguage = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const proficiencyLevels = [
    { value: 'basic', label: 'Basic', stars: 1 },
    { value: 'conversational', label: 'Conversational', stars: 2 },
    { value: 'professional', label: 'Professional', stars: 3 },
    { value: 'native', label: 'Native', stars: 4 }
  ];

  const renderStars = (count: number) => {
    return Array(count).fill(0).map((_, i) => (
      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
    ));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Globe className="w-6 h-6 text-purple-400" />
          Languages
        </h2>
        <button
          onClick={addLanguage}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Language
        </button>
      </div>

      <div className="space-y-4">
        {data.map((lang, index) => (
          <div key={lang.id} className="flex items-center gap-4 glass-effect border border-white/10 rounded-lg p-4 hover:border-purple-500/50 transition-all">
            <input
              type="text"
              value={lang.name}
              onChange={(e) => updateLanguage(index, { name: e.target.value })}
              placeholder="Language name (e.g., English, Spanish)"
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />

            <select
              value={lang.proficiency}
              onChange={(e) => updateLanguage(index, { proficiency: e.target.value as any })}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {proficiencyLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {'★'.repeat(level.stars)} {level.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => removeLanguage(index)}
              className="text-red-500 hover:text-red-700 px-2"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 glass-effect border-2 border-dashed border-white/20 rounded-xl">
            <Globe className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <p className="text-gray-300 mb-2">No languages added yet</p>
            <p className="text-sm text-gray-400">Multilingual? Add your language skills!</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-white/5 border border-white/10 rounded-lg p-4">
        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          Proficiency Levels:
        </h4>
        <ul className="text-sm text-gray-200 space-y-1">
          <li><strong>Basic:</strong> Can understand simple phrases</li>
          <li><strong>Conversational:</strong> Can have everyday conversations</li>
          <li><strong>Professional:</strong> Can work professionally in this language</li>
          <li><strong>Native:</strong> Native or bilingual proficiency</li>
        </ul>
      </div>
    </div>
  );
}
