'use client';

import React from 'react';
import { Project, AIAppliedChange } from '@/app/(features)/support-cv/types/cv.types';
import { Rocket, Plus, Trash2, Lightbulb, Sparkles } from 'lucide-react';

interface ProjectsSectionProps {
  data: Project[];
  onChange: (data: Project[]) => void;
  aiAppliedChanges?: AIAppliedChange[];
}

export default function ProjectsSection({ data, onChange, aiAppliedChanges = [] }: ProjectsSectionProps) {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      startDate: '',
      endDate: '',
      achievements: ['']
    };
    onChange([...data, newProject]);
  };

  const updateProject = (index: number, updates: Partial<Project>) => {
    const updated = [...data];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeProject = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const addTechnology = (index: number, tech: string) => {
    if (!tech.trim()) return;
    const updated = [...data];
    updated[index].technologies.push(tech);
    onChange(updated);
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const updated = [...data];
    updated[projectIndex].technologies.splice(techIndex, 1);
    onChange(updated);
  };

  // Helper function to check if a field was AI-modified
  const isAIModified = (itemId: string, fieldName: string): AIAppliedChange | undefined => {
    return aiAppliedChanges.find(change => 
      change.section.toLowerCase() === 'projects' && 
      change.itemId === itemId && 
      change.field.toLowerCase() === fieldName.toLowerCase()
    );
  };

  // Generate input class with AI highlight
  const getInputClass = (itemId: string, fieldName: string, extraClass = '') => {
    const aiChange = isAIModified(itemId, fieldName);
    const baseClass = `w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${extraClass}`;
    
    if (aiChange) {
      return `${baseClass} border-amber-500/70 ring-1 ring-amber-500/50 bg-amber-500/10`;
    }
    return `${baseClass} border-white/10`;
  };

  const addAchievement = (index: number) => {
    const updated = [...data];
    updated[index].achievements = updated[index].achievements || [];
    updated[index].achievements!.push('');
    onChange(updated);
  };

  const updateAchievement = (projectIndex: number, achIndex: number, value: string) => {
    const updated = [...data];
    updated[projectIndex].achievements![achIndex] = value;
    onChange(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Rocket className="w-6 h-6 text-purple-400" />
          Projects
        </h2>
        <button
          onClick={addProject}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg glow-effect flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="space-y-6">
        {data.map((project, index) => (
          <div key={project.id} className="glass-effect border border-white/10 rounded-xl p-6 relative hover:border-purple-500/50 transition-all">
            <button
              onClick={() => removeProject(index)}
              className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition-all hover:scale-110"
              title="Remove Project"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              {/* Project Name & Link */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Name *
                  </label>
                  {isAIModified(project.id, 'name') && (
                    <Sparkles className="absolute top-0 right-0 w-4 h-4 text-amber-400 z-10" />
                  )}
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(index, { name: e.target.value })}
                    placeholder="e.g., Restaurant Management System"
                    className={getInputClass(project.id, 'name')}
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project URL (Optional)
                  </label>
                  {isAIModified(project.id, 'link') && (
                    <Sparkles className="absolute top-0 right-0 w-4 h-4 text-amber-400 z-10" />
                  )}
                  <input
                    type="url"
                    value={project.link || ''}
                    onChange={(e) => updateProject(index, { link: e.target.value })}
                    placeholder="GitHub, Demo, etc."
                    className={getInputClass(project.id, 'link')}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Description *
                </label>
                {isAIModified(project.id, 'description') && (
                  <Sparkles className="absolute top-0 right-0 w-4 h-4 text-amber-400 z-10" />
                )}
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(index, { description: e.target.value })}
                  placeholder="Describe your project, its purpose, and what you built..."
                  rows={4}
                  className={getInputClass(project.id, 'description', 'resize-none')}
                />
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Include what problem it solves and your role in the project
                </p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  {isAIModified(project.id, 'startDate') && (
                    <Sparkles className="absolute top-0 right-0 w-4 h-4 text-amber-400 z-10" />
                  )}
                  <input
                    type="month"
                    value={project.startDate || ''}
                    onChange={(e) => updateProject(index, { startDate: e.target.value })}
                    className={getInputClass(project.id, 'startDate')}
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date (optional)</label>
                  {isAIModified(project.id, 'endDate') && (
                    <Sparkles className="absolute top-0 right-0 w-4 h-4 text-amber-400 z-10" />
                  )}
                  <input
                    type="month"
                    value={project.endDate || ''}
                    onChange={(e) => updateProject(index, { endDate: e.target.value })}
                    placeholder="Leave empty if ongoing"
                    className={getInputClass(project.id, 'endDate')}
                  />
                </div>
              </div>

              {/* Technologies */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Technologies Used *
                </label>
                {isAIModified(project.id, 'technologies') && (
                  <Sparkles className="absolute top-0 right-0 w-4 h-4 text-amber-400 z-10" />
                )}
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-sm flex items-center gap-2 hover:bg-blue-500/30 transition-all"
                    >
                      {tech}
                      <button
                        onClick={() => removeTechnology(index, techIndex)}
                        className="text-red-400 hover:text-red-300 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type technology and press Enter (e.g., React, Node.js, MySQL)..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTechnology(index, e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Achievements */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Key Achievements & Impact
                  </label>
                  <button
                    onClick={() => addAchievement(index)}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-all"
                  >
                    + Add Achievement
                  </button>
                </div>
                <div className="space-y-2">
                  {project.achievements?.map((ach, achIndex) => (
                    <textarea
                      key={achIndex}
                      value={ach}
                      onChange={(e) => updateAchievement(index, achIndex, e.target.value)}
                      placeholder="• Describe what you achieved (use metrics when possible)..."
                      rows={2}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Example: "Built real-time order system serving 100+ daily users"
                </p>
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 glass-effect border-2 border-dashed border-white/20 rounded-xl">
            <Rocket className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-bounce" />
            <p className="text-gray-300 mb-2 font-medium">No projects added yet</p>
            <p className="text-sm text-gray-400">Showcase your best work to stand out!</p>
            <button
              onClick={addProject}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg glow-effect flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
