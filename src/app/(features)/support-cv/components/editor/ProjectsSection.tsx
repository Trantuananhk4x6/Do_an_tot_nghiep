'use client';

import React from 'react';
import { Project } from '@/app/(features)/support-cv/types/cv.types';

interface ProjectsSectionProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

export default function ProjectsSection({ data, onChange }: ProjectsSectionProps) {
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
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <span>🚀</span>
          Projects
        </h2>
        <button
          onClick={addProject}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
        >
          + Add Project
        </button>
      </div>

      <div className="space-y-8">
        {data.map((project, index) => (
          <div key={project.id} className="border border-gray-200 rounded-xl p-6 relative">
            <button
              onClick={() => removeProject(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              🗑️
            </button>

            <div className="space-y-4">
              {/* Project Name & Link */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(index, { name: e.target.value })}
                  placeholder="Project Name"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="url"
                  value={project.link || ''}
                  onChange={(e) => updateProject(index, { link: e.target.value })}
                  placeholder="Project URL (GitHub, Demo, etc.)"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Description */}
              <textarea
                value={project.description}
                onChange={(e) => updateProject(index, { description: e.target.value })}
                placeholder="Brief project description..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
              />

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                  <input
                    type="month"
                    value={project.startDate || ''}
                    onChange={(e) => updateProject(index, { startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">End Date (optional)</label>
                  <input
                    type="month"
                    value={project.endDate || ''}
                    onChange={(e) => updateProject(index, { endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technologies Used
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {tech}
                      <button
                        onClick={() => removeTechnology(index, techIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type technology and press Enter..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTechnology(index, e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Achievements */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Key Achievements
                  </label>
                  <button
                    onClick={() => addAchievement(index)}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    + Add Achievement
                  </button>
                </div>
                {project.achievements?.map((ach, achIndex) => (
                  <textarea
                    key={achIndex}
                    value={ach}
                    onChange={(e) => updateAchievement(index, achIndex, e.target.value)}
                    placeholder="• Describe what you achieved in this project..."
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-2 resize-none"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
            <div className="text-6xl mb-4">🚀</div>
            <p className="text-gray-500 mb-2">No projects added yet</p>
            <p className="text-sm text-gray-400">Showcase your best work to stand out!</p>
          </div>
        )}
      </div>
    </div>
  );
}
