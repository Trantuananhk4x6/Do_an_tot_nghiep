'use client';

import React from 'react';
import { Skill, AIAppliedChange } from '@/app/(features)/support-cv/types/cv.types';
import { Zap, Plus, Trash2, Sparkles } from 'lucide-react';

interface SkillsSectionProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
  aiAppliedChanges?: AIAppliedChange[];
}

export default function SkillsSection({ data, onChange, aiAppliedChanges = [] }: SkillsSectionProps) {
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

  // Helper function to check if a skill was AI-modified
  const isAIModified = (itemId: string): AIAppliedChange | undefined => {
    return aiAppliedChanges.find(change => 
      change.section.toLowerCase() === 'skills' && 
      change.itemId === itemId
    );
  };

  // Check if any skills section was AI-modified
  const hasAnyAIChanges = aiAppliedChanges.some(change => 
    change.section.toLowerCase() === 'skills'
  );

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2 lg:gap-3">
          <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400" />
          Skills
        </h2>
        <button
          onClick={addSkill}
          className="px-3 lg:px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center gap-2 text-sm lg:text-base"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      <div className="space-y-3">
        {hasAnyAIChanges && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-amber-300">AI has enhanced your skills section</span>
          </div>
        )}
        {data.map((skill, index) => (
          <div key={skill.id} className={`glass-effect border rounded-lg p-3 lg:p-4 transition-all ${isAIModified(skill.id) ? 'border-amber-500/50 ring-1 ring-amber-500/30 bg-amber-500/5' : 'border-white/10 hover:border-purple-500/50'}`}>
            {isAIModified(skill.id) && (
              <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-amber-400" />
            )}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Category Select */}
              <select
                value={skill.category}
                onChange={(e) => updateSkill(index, { category: e.target.value })}
                className="w-full sm:w-32 lg:w-36 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                ))}
              </select>

              {/* Skill Name Input */}
              <input
                type="text"
                value={skill.name}
                onChange={(e) => updateSkill(index, { name: e.target.value })}
                placeholder="Skill name"
                className="flex-1 min-w-0 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />

              {/* Level Select */}
              <select
                value={skill.level}
                onChange={(e) => updateSkill(index, { level: e.target.value as any })}
                className="w-full sm:w-28 lg:w-32 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="beginner" className="bg-gray-800">Beginner</option>
                <option value="intermediate" className="bg-gray-800">Intermediate</option>
                <option value="advanced" className="bg-gray-800">Advanced</option>
                <option value="expert" className="bg-gray-800">Expert</option>
              </select>

              {/* Delete Button */}
              <button
                onClick={() => removeSkill(index)}
                className="self-center p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                title="Remove skill"
              >
                <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 glass-effect border-2 border-dashed border-white/20 rounded-xl">
            <Zap className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-300">No skills added yet.</p>
            <p className="text-gray-500 text-sm mt-1">Click "Add Skill" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}
