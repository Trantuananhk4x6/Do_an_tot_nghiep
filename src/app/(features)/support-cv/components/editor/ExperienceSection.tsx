'use client';

import React from 'react';
import { Experience } from '@/app/(features)/support-cv/types/cv.types';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

interface ExperienceSectionProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export default function ExperienceSection({ data, onChange }: ExperienceSectionProps) {
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: ['']
    };
    onChange([...data, newExp]);
  };

  const updateExperience = (index: number, updates: Partial<Experience>) => {
    const updated = [...data];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const addAchievement = (index: number) => {
    const updated = [...data];
    updated[index].achievements.push('');
    onChange(updated);
  };

  const updateAchievement = (expIndex: number, achIndex: number, value: string) => {
    const updated = [...data];
    updated[expIndex].achievements[achIndex] = value;
    onChange(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-purple-400" />
          Work Experience
        </h2>
        <button
          onClick={addExperience}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      <div className="space-y-8">
        {data.map((exp, index) => (
          <div key={exp.id} className="glass-effect border border-white/10 rounded-xl p-6 relative hover:border-purple-500/50 transition-all">
            <button
              onClick={() => removeExperience(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              {/* Position & Company */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateExperience(index, { position: e.target.value })}
                  placeholder="Job Title"
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, { company: e.target.value })}
                  placeholder="Company Name"
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(index, { startDate: e.target.value })}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(index, { endDate: e.target.value })}
                  disabled={exp.current}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateExperience(index, { current: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="text-sm">Current Role</span>
                </label>
              </div>

              {/* Achievements */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Achievements (Use STAR Method)
                  </label>
                  <button
                    onClick={() => addAchievement(index)}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    + Add Achievement
                  </button>
                </div>
                {exp.achievements.map((ach, achIndex) => (
                  <textarea
                    key={achIndex}
                    value={ach}
                    onChange={(e) => updateAchievement(index, achIndex, e.target.value)}
                    placeholder="• Achieved [Result] by [Action], resulting in [Metric]..."
                    rows={2}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-2 resize-none"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 glass-effect border-2 border-dashed border-white/20 rounded-xl">
            <p className="text-gray-300">No experience added yet. Click "Add Experience" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}
