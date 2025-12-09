'use client';

import React from 'react';
import { Education, AIAppliedChange } from '@/app/(features)/support-cv/types/cv.types';
import { GraduationCap, Plus, Trash2, Sparkles } from 'lucide-react';

interface EducationSectionProps {
  data: Education[];
  onChange: (data: Education[]) => void;
  aiAppliedChanges?: AIAppliedChange[];
}

export default function EducationSection({ data, onChange, aiAppliedChanges = [] }: EducationSectionProps) {
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      institution: undefined
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

  // Helper function to check if a field was AI-modified (check by itemId or index)
  const isAIModified = (itemId: string, fieldName: string, index?: number): AIAppliedChange | undefined => {
    return aiAppliedChanges.find(change => 
      change.section.toLowerCase() === 'education' && 
      (change.itemId === itemId || change.itemId === String(index)) && 
      change.field.toLowerCase() === fieldName.toLowerCase()
    );
  };

  // Check if any education item was AI-modified (check by itemId or index)
  const isItemAIModified = (itemId: string, index?: number): boolean => {
    return aiAppliedChanges.some(change => 
      change.section.toLowerCase() === 'education' && 
      (change.itemId === itemId || change.itemId === String(index))
    );
  };

  // Generate input class with AI highlight - more prominent styling
  const getInputClass = (itemId: string, fieldName: string, index?: number) => {
    const aiChange = isAIModified(itemId, fieldName, index);
    const baseClass = "px-4 py-2 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all";
    
    if (aiChange) {
      return `${baseClass} bg-amber-500/20 border-2 border-amber-400/70 ring-2 ring-amber-400/30`;
    }
    return `${baseClass} bg-white/5 border border-white/10`;
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
          <div 
            key={edu.id} 
            className={`glass-effect border rounded-xl p-6 relative transition-all ${
              isItemAIModified(edu.id, index) 
                ? 'border-amber-400/50 bg-gradient-to-br from-amber-500/5 to-orange-500/5 shadow-lg shadow-amber-500/10' 
                : 'border-white/10 hover:border-purple-500/50'
            }`}
          >
            {/* AI Enhanced Badge */}
            {isItemAIModified(edu.id, index) && (
              <div className="absolute -top-3 left-4 px-2 py-1 bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-200 text-xs rounded-full font-semibold flex items-center gap-1 border border-amber-400/50">
                <Sparkles className="w-3 h-3" />
                AI Enhanced
              </div>
            )}
            <button
              onClick={() => removeEducation(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  {isAIModified(edu.id, 'school', index) && (
                    <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-amber-400 z-10" />
                  )}
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(index, { school: e.target.value })}
                    placeholder="University Name"
                    className={getInputClass(edu.id, 'school', index)}
                  />
                </div>
                <div className="relative">
                  {isAIModified(edu.id, 'degree', index) && (
                    <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-amber-400 z-10" />
                  )}
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, { degree: e.target.value })}
                    placeholder="Bachelor's / Master's / PhD"
                    className={getInputClass(edu.id, 'degree', index)}
                  />
                </div>
              </div>

              <div className="relative">
                {isAIModified(edu.id, 'field', index) && (
                  <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-amber-400 z-10" />
                )}
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEducation(index, { field: e.target.value })}
                  placeholder="Field of Study"
                  className={`w-full ${getInputClass(edu.id, 'field', index)}`}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  {isAIModified(edu.id, 'startDate', index) && (
                    <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-amber-400 z-10" />
                  )}
                  <input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(index, { startDate: e.target.value })}
                    className={getInputClass(edu.id, 'startDate', index)}
                  />
                </div>
                <div className="relative">
                  {isAIModified(edu.id, 'endDate', index) && (
                    <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-amber-400 z-10" />
                  )}
                  <input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(index, { endDate: e.target.value })}
                    className={getInputClass(edu.id, 'endDate', index)}
                  />
                </div>
                <div className="relative">
                  {isAIModified(edu.id, 'gpa', index) && (
                    <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-amber-400 z-10" />
                  )}
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(index, { gpa: e.target.value })}
                    placeholder="GPA (optional)"
                    className={getInputClass(edu.id, 'gpa', index)}
                  />
                </div>
              </div>

              {/* Achievements / Description */}
              <div className="relative mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Achievements / Relevant Coursework
                </label>
                {isAIModified(edu.id, 'achievements', index) && (
                  <Sparkles className="absolute top-0 right-0 w-4 h-4 text-amber-400 z-10" />
                )}
                <textarea
                  value={(edu.achievements || []).join('\n')}
                  onChange={(e) => updateEducation(index, { achievements: e.target.value.split('\n').filter(a => a.trim()) })}
                  placeholder="• Relevant coursework: Machine Learning, Data Structures...\n• Dean's List, Academic honors...\n• Thesis/Research projects..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 resize-none ${isAIModified(edu.id, 'achievements', index) ? 'bg-amber-500/20 border-2 border-amber-400/70' : 'bg-white/5 border border-white/10'}`}
                />
                <p className="text-xs text-gray-400 mt-1">Enter each achievement on a new line</p>
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
