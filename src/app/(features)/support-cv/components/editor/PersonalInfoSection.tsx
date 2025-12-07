'use client';

import React from 'react';
import { 
  Camera, 
  User, 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Globe, 
  FileText,
  X,
  Lightbulb,
  Github,
  Sparkles
} from 'lucide-react';
import { PersonalInfo, AIAppliedChange } from '@/app/(features)/support-cv/types/cv.types';

interface PersonalInfoSectionProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  aiAppliedChanges?: AIAppliedChange[];
}

export default function PersonalInfoSection({ data, onChange, aiAppliedChanges = [] }: PersonalInfoSectionProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  // Helper function to check if a field was AI-modified
  const isAIModified = (fieldName: string): AIAppliedChange | undefined => {
    return aiAppliedChanges.find(change => 
      (change.section.toLowerCase() === 'personalinfo' || change.section.toLowerCase() === 'summary') && 
      change.field.toLowerCase() === fieldName.toLowerCase()
    );
  };

  // Get input class with AI highlight
  const getInputClass = (fieldName: string) => {
    const aiChange = isAIModified(fieldName);
    const baseClass = "relative z-10 w-full px-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:bg-white/10 outline-none transition-all";
    
    if (aiChange) {
      return `${baseClass} border-amber-500/70 ring-1 ring-amber-500/50 bg-amber-500/10`;
    }
    return `${baseClass} border-white/20`;
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
            <Camera className="w-5 h-5" />
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
                  <X className="w-4 h-4" />
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
                <div className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all inline-flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl hover:scale-105">
                  <Camera className="w-4 h-4" />
                  {data.profileImage ? 'Change Photo' : 'Upload Photo'}
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
          <User className="w-4 h-4" /> Full Name <span className="text-red-400 ml-1">*</span>
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
          <Briefcase className="w-4 h-4" /> Job Title <span className="text-red-400 ml-1">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Senior Full Stack Developer"
          className="relative z-10 w-full px-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:bg-white/10 outline-none transition-all"
        />
      </div>

      {/* Email & Phone - 2 Columns */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative glass-effect border border-purple-500/30 rounded-xl p-6 group hover:border-purple-500/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <label className="relative z-10 block text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email <span className="text-red-400 ml-1">*</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="e.g., john@example.com"
            className="relative z-10 w-full px-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:bg-white/10 outline-none transition-all"
          />
        </div>
        <div className="relative glass-effect border border-purple-500/30 rounded-xl p-6 group hover:border-purple-500/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <label className="relative z-10 block text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4" /> Phone <span className="text-red-400 ml-1">*</span>
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="e.g., +1 (555) 123-4567"
            className="relative z-10 w-full px-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:bg-white/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* Location */}
      <div className="relative glass-effect border border-purple-500/30 rounded-xl p-6 group hover:border-purple-500/50 transition-all">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <label className="relative z-10 block text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Location <span className="text-xs text-gray-400 font-normal">(City, Country)</span>
        </label>
        <input
          type="text"
          value={data.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="e.g., San Francisco, CA"
          className="relative z-10 w-full px-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:bg-white/10 outline-none transition-all"
        />
      </div>

      {/* LinkedIn & GitHub */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative glass-effect border border-purple-500/30 rounded-xl p-6 group hover:border-purple-500/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <label className="relative z-10 block text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
            <Linkedin className="w-4 h-4" /> LinkedIn <span className="text-xs text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="url"
            value={data.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="e.g., linkedin.com/in/johndoe"
            className="relative z-10 w-full px-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:bg-white/10 outline-none transition-all"
          />
        </div>
        <div className="relative glass-effect border border-purple-500/30 rounded-xl p-6 group hover:border-purple-500/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <label className="relative z-10 block text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
            <Github className="w-4 h-4" /> GitHub <span className="text-xs text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="url"
            value={data.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            placeholder="e.g., github.com/johndoe"
            className="relative z-10 w-full px-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:bg-white/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* Website */}
      <div className="relative glass-effect border border-purple-500/30 rounded-xl p-6 group hover:border-purple-500/50 transition-all">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <label className="relative z-10 block text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" /> Website <span className="text-xs text-gray-400 font-normal">(Optional)</span>
        </label>
        <input
          type="url"
          value={data.website}
          onChange={(e) => handleChange('website', e.target.value)}
          placeholder="e.g., johndoe.com"
          className="relative z-10 w-full px-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:bg-white/10 outline-none transition-all"
        />
      </div>

      {/* Summary */}
      <div className="relative glass-effect border border-purple-500/30 rounded-xl p-6 group hover:border-purple-500/50 transition-all">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isAIModified('summary') && (
          <Sparkles className="absolute top-4 right-4 w-5 h-5 text-amber-400 z-20 animate-pulse" />
        )}
        <label className="relative z-10 block text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Professional Summary
          {isAIModified('summary') && (
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded-full ml-2">
              AI Enhanced
            </span>
          )}
        </label>
        <textarea
          value={data.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="Write a compelling 2-3 sentence summary highlighting your key qualifications and career goals..."
          rows={5}
          className={`${getInputClass('summary')} resize-none`}
        />
        <p className="relative z-10 text-xs text-gray-400 mt-2 flex items-center gap-1">
          <Lightbulb className="w-3 h-3" /> Tip: Focus on what makes you unique and your career achievements
        </p>
      </div>
    </div>
  );
}
