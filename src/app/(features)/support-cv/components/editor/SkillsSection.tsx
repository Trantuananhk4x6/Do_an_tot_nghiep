'use client';

import React from 'react';
import { Skill } from '@/app/(features)/support-cv/types/cv.types';

interface SkillsSectionProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

export default function SkillsSection({ data, onChange }: SkillsSectionProps) {
  const categories = ['Programming', 'Frameworks', 'Tools', 'Databases', 'Soft Skills', 'Other'];

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      category: 'Programming',
      name: '',
      level: 'intermediate'
    };
    onChange([...data, newSkill]);
  };

  const updateSkill = (index: number, updates: Partial<Skill>) => {
    const updated = [...data];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <span>⚡</span>
          Skills
        </h2>
        <button
          onClick={addSkill}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
        >
          + Add Skill
        </button>
      </div>

      <div className="space-y-4">
        {data.map((skill, index) => (
          <div key={skill.id} className="flex items-center gap-4 border border-gray-200 rounded-lg p-4">
            <select
              value={skill.category}
              onChange={(e) => updateSkill(index, { category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="text"
              value={skill.name}
              onChange={(e) => updateSkill(index, { name: e.target.value })}
              placeholder="Skill name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />

            <select
              value={skill.level}
              onChange={(e) => updateSkill(index, { level: e.target.value as any })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>

            <button
              onClick={() => removeSkill(index)}
              className="text-red-500 hover:text-red-700"
            >
              🗑️
            </button>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-500">No skills added yet. Click "Add Skill" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}
