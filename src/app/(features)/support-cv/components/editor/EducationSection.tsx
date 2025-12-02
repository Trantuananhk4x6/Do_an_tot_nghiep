'use client';

import React from 'react';
import { Education } from '@/app/(features)/support-cv/types/cv.types';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

interface EducationSectionProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export default function EducationSection({ data, onChange }: EducationSectionProps) {
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    onChange([...data, newEdu]);
  };

  const updateEducation = (index: number, updates: Partial<Education>) => {
    const updated = [...data];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-purple-400" />
          Education
        </h2>
        <button
          onClick={addEducation}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      <div className="space-y-6">
        {data.map((edu, index) => (
          <div key={edu.id} className="glass-effect border border-white/10 rounded-xl p-6 relative hover:border-purple-500/50 transition-all">
            <button
              onClick={() => removeEducation(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => updateEducation(index, { school: e.target.value })}
                  placeholder="University Name"
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, { degree: e.target.value })}
                  placeholder="Bachelor's / Master's / PhD"
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <input
                type="text"
                value={edu.field}
                onChange={(e) => updateEducation(index, { field: e.target.value })}
                placeholder="Field of Study"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />

              <div className="grid grid-cols-3 gap-4">
                <input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(index, { startDate: e.target.value })}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(index, { endDate: e.target.value })}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(index, { gpa: e.target.value })}
                  placeholder="GPA (optional)"
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 glass-effect border-2 border-dashed border-white/20 rounded-xl">
            <p className="text-gray-300">No education added yet. Click "Add Education" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}
