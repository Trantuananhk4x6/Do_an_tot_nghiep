'use client';

import React from 'react';
import { Language } from '@/app/(features)/support-cv/types/cv.types';

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
    { value: 'basic', label: 'Basic', icon: '⭐' },
    { value: 'conversational', label: 'Conversational', icon: '⭐⭐' },
    { value: 'professional', label: 'Professional', icon: '⭐⭐⭐' },
    { value: 'native', label: 'Native', icon: '⭐⭐⭐⭐' }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <span>🌍</span>
          Languages
        </h2>
        <button
          onClick={addLanguage}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
        >
          + Add Language
        </button>
      </div>

      <div className="space-y-4">
        {data.map((lang, index) => (
          <div key={lang.id} className="flex items-center gap-4 border border-gray-200 rounded-lg p-4">
            <input
              type="text"
              value={lang.name}
              onChange={(e) => updateLanguage(index, { name: e.target.value })}
              placeholder="Language name (e.g., English, Spanish)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />

            <select
              value={lang.proficiency}
              onChange={(e) => updateLanguage(index, { proficiency: e.target.value as any })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {proficiencyLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.icon} {level.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => removeLanguage(index)}
              className="text-red-500 hover:text-red-700 px-2"
            >
              🗑️
            </button>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
            <div className="text-6xl mb-4">🌍</div>
            <p className="text-gray-500 mb-2">No languages added yet</p>
            <p className="text-sm text-gray-400">Multilingual? Add your language skills!</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-900 mb-2">💡 Proficiency Levels:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li><strong>Basic:</strong> Can understand simple phrases</li>
          <li><strong>Conversational:</strong> Can have everyday conversations</li>
          <li><strong>Professional:</strong> Can work professionally in this language</li>
          <li><strong>Native:</strong> Native or bilingual proficiency</li>
        </ul>
      </div>
    </div>
  );
}
