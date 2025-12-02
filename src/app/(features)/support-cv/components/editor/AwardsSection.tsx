'use client';

import React from 'react';
import { Award } from '@/app/(features)/support-cv/types/cv.types';
import { Medal, Plus, Trash2, Lightbulb, Trophy } from 'lucide-react';

interface AwardsSectionProps {
  data: Award[];
  onChange: (data: Award[]) => void;
}

export default function AwardsSection({ data, onChange }: AwardsSectionProps) {
  const addAward = () => {
    const newAward: Award = {
      id: Date.now().toString(),
      title: '',
      issuer: '',
      date: '',
      description: ''
    };
    onChange([...data, newAward]);
  };

  const updateAward = (index: number, updates: Partial<Award>) => {
    const updated = [...data];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeAward = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Medal className="w-6 h-6 text-purple-400" />
          Awards & Honors
        </h2>
        <button
          onClick={addAward}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg glow-effect flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Award
        </button>
      </div>

      <div className="space-y-6">
        {data.map((award, index) => (
          <div key={award.id} className="glass-effect border border-white/10 rounded-xl p-6 relative hover:border-purple-500/50 transition-all">
            <button
              onClick={() => removeAward(index)}
              className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition-all hover:scale-110"
              title="Remove Award"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              {/* Award Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Award Title *
                </label>
                <input
                  type="text"
                  value={award.title}
                  onChange={(e) => updateAward(index, { title: e.target.value })}
                  placeholder="e.g., Champion at BizTech Hackathon"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Issuer & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Issued By *
                  </label>
                  <input
                    type="text"
                    value={award.issuer}
                    onChange={(e) => updateAward(index, { issuer: e.target.value })}
                    placeholder="e.g., UEH University"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="month"
                    value={award.date}
                    onChange={(e) => updateAward(index, { date: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={award.description || ''}
                  onChange={(e) => updateAward(index, { description: e.target.value })}
                  placeholder="Describe what you accomplished to receive this award..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                />
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Tip: Mention team collaboration, skills developed, or impact achieved
                </p>
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 glass-effect border-2 border-dashed border-white/20 rounded-xl">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500/50 animate-bounce" />
            <p className="text-gray-300 mb-2 font-medium">No awards added yet</p>
            <p className="text-sm text-gray-400">Showcase your achievements and recognitions!</p>
            <button
              onClick={addAward}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg glow-effect flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add Your First Award
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
