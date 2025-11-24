'use client';

import React from 'react';
import { PersonalInfo } from '@/app/(features)/support-cv/types/cv.types';

interface PersonalInfoSectionProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export default function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('profileImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    handleChange('profileImage', '');
  };

  return (
    <div className="space-y-6">
      {/* Profile Image Upload */}
      <div className="relative glass-effect border border-purple-500/30 rounded-2xl p-6 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
        <div className="relative z-10">
          <label className="block text-sm font-semibold text-purple-300 mb-4 flex items-center gap-2">
            <span className="text-lg">📸</span>
            Profile Photo <span className="text-xs text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="flex items-center gap-6">
            {data.profileImage ? (
              <div className="relative group">
                <img
                  src={data.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-purple-500 shadow-2xl transition-transform group-hover:scale-105"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-110"
                  title="Remove photo"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                {data.fullName ? data.fullName.charAt(0).toUpperCase() : '?'}
              </div>
            )}
            <div className="flex-1">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all inline-block font-semibold shadow-lg hover:shadow-xl hover:scale-105">
                  📸 {data.profileImage ? 'Change Photo' : 'Upload Photo'}
                </div>
              </label>
              <p className="text-xs text-gray-400 mt-3">
                JPG, PNG or GIF. Max size 5MB. Square image recommended.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Name */}
      <div className="relative glass-effect border border-purple-500/30 rounded-xl p-6 group hover:border-purple-500/50 transition-all">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <label className="relative z-10 block text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
          <span>👤</span> Full Name <span className="text-red-400 ml-1">*</span>
        </label>
        <input
          type="text"
          value={data.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="e.g., John Doe"
          className="relative z-10 w-full px-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:bg-white/10 outline-none transition-all"
        />
      </div>

      {/* Job Title */}
      <div className="relative glass-effect border border-purple-500/30 rounded-xl p-6 group hover:border-purple-500/50 transition-all">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <label className="relative z-10 block text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
          <span>💼</span> Job Title <span className="text-red-400 ml-1">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Senior Full Stack Developer"
          className="relative z-10 w-full px-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:bg-white/10 outline-none transition-all"
        />
      </div>
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Senior Software Engineer"
            className="w-full px-4 py-3 glass-effect border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-3 glass-effect border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-3 glass-effect border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Location
          </label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="San Francisco, CA"
            className="w-full px-4 py-3 glass-effect border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
          />
        </div>

        {/* LinkedIn & GitHub */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              LinkedIn
            </label>
            <input
              type="url"
              value={data.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/johndoe"
              className="w-full px-4 py-3 glass-effect border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              GitHub
            </label>
            <input
              type="url"
              value={data.github || ''}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="github.com/johndoe"
              className="w-full px-4 py-3 glass-effect border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Professional Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Professional Summary
          </label>
          <textarea
            value={data.summary || ''}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Write a compelling 2-3 sentence summary highlighting your key strengths and career goals..."
            rows={5}
            className="w-full px-4 py-3 glass-effect border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all resize-none"
          />
          <p className="text-xs text-gray-400 mt-2">
            💡 Tip: Use action words and quantify your achievements
          </p>
        </div>
      </div>
    </div>
  );
}
