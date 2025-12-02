'use client';

import React from 'react';
import { Volunteer } from '@/app/(features)/support-cv/types/cv.types';
import { Heart, Plus, Trash2, Building2, Calendar, MapPin } from 'lucide-react';

interface VolunteerSectionProps {
  data: Volunteer[];
  onChange: (data: Volunteer[]) => void;
}

export default function VolunteerSection({ data, onChange }: VolunteerSectionProps) {
  const addVolunteer = () => {
    const newVolunteer: Volunteer = {
      id: Date.now().toString(),
      organization: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      location: ''
    };
    onChange([...data, newVolunteer]);
  };

  const updateVolunteer = (index: number, updates: Partial<Volunteer>) => {
    const updated = [...data];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeVolunteer = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2 lg:gap-3">
          <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-pink-400" />
          Volunteer Experience
        </h2>
        <button
          onClick={addVolunteer}
          className="px-3 lg:px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all flex items-center gap-2 text-sm lg:text-base"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      <div className="space-y-4">
        {data.map((vol, index) => (
          <div key={vol.id} className="glass-effect border border-white/10 rounded-xl p-4 lg:p-5 hover:border-pink-500/50 transition-all">
            {/* Organization & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  Organization *
                </label>
                <input
                  type="text"
                  value={vol.organization}
                  onChange={(e) => updateVolunteer(index, { organization: e.target.value })}
                  placeholder="e.g., Red Cross, UNICEF"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Role / Position
                </label>
                <input
                  type="text"
                  value={vol.role}
                  onChange={(e) => updateVolunteer(index, { role: e.target.value })}
                  placeholder="e.g., Volunteer Coordinator"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Dates & Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </label>
                <input
                  type="month"
                  value={vol.startDate}
                  onChange={(e) => updateVolunteer(index, { startDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  End Date
                </label>
                <input
                  type="month"
                  value={vol.endDate}
                  onChange={(e) => updateVolunteer(index, { endDate: e.target.value })}
                  placeholder="Present"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  type="text"
                  value={vol.location || ''}
                  onChange={(e) => updateVolunteer(index, { location: e.target.value })}
                  placeholder="e.g., Ho Chi Minh City"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Description
              </label>
              <textarea
                value={vol.description || ''}
                onChange={(e) => updateVolunteer(index, { description: e.target.value })}
                placeholder="Describe your volunteer work, responsibilities, and achievements..."
                rows={4}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Delete Button */}
            <div className="flex justify-end">
              <button
                onClick={() => removeVolunteer(index)}
                className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Remove Experience
              </button>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 glass-effect border-2 border-dashed border-white/20 rounded-xl">
            <Heart className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-300">No volunteer experience added yet.</p>
            <p className="text-gray-500 text-sm mt-1">Click "Add Experience" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}
