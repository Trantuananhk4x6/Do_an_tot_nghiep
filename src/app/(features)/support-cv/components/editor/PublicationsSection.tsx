'use client';

import React from 'react';
import { Publication } from '@/app/(features)/support-cv/types/cv.types';
import { BookOpen, Plus, Trash2, Link, Calendar, Users } from 'lucide-react';

interface PublicationsSectionProps {
  data: Publication[];
  onChange: (data: Publication[]) => void;
}

export default function PublicationsSection({ data, onChange }: PublicationsSectionProps) {
  const addPublication = () => {
    const newPublication: Publication = {
      id: Date.now().toString(),
      title: '',
      publisher: '',
      date: '',
      authors: [],
      link: '',
      description: ''
    };
    onChange([...data, newPublication]);
  };

  const updatePublication = (index: number, updates: Partial<Publication>) => {
    const updated = [...data];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removePublication = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleAuthorsChange = (index: number, value: string) => {
    const authors = value.split(',').map(a => a.trim()).filter(a => a);
    updatePublication(index, { authors });
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2 lg:gap-3">
          <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400" />
          Publications
        </h2>
        <button
          onClick={addPublication}
          className="px-3 lg:px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center gap-2 text-sm lg:text-base"
        >
          <Plus className="w-4 h-4" />
          Add Publication
        </button>
      </div>

      <div className="space-y-4">
        {data.map((pub, index) => (
          <div key={pub.id} className="glass-effect border border-white/10 rounded-xl p-4 lg:p-5 hover:border-purple-500/50 transition-all">
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Publication Title *
              </label>
              <input
                type="text"
                value={pub.title}
                onChange={(e) => updatePublication(index, { title: e.target.value })}
                placeholder="e.g., Machine Learning in Healthcare: A Comprehensive Review"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Publisher */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Publisher / Journal
                </label>
                <input
                  type="text"
                  value={pub.publisher}
                  onChange={(e) => updatePublication(index, { publisher: e.target.value })}
                  placeholder="e.g., IEEE, Nature, ACM"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Publication Date
                </label>
                <input
                  type="month"
                  value={pub.date}
                  onChange={(e) => updatePublication(index, { date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Authors */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                <Users className="w-4 h-4" />
                Authors (comma separated)
              </label>
              <input
                type="text"
                value={pub.authors?.join(', ') || ''}
                onChange={(e) => handleAuthorsChange(index, e.target.value)}
                placeholder="e.g., John Doe, Jane Smith, You"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Link */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                <Link className="w-4 h-4" />
                Publication Link
              </label>
              <input
                type="url"
                value={pub.link || ''}
                onChange={(e) => updatePublication(index, { link: e.target.value })}
                placeholder="https://doi.org/..."
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Description / Abstract
              </label>
              <textarea
                value={pub.description || ''}
                onChange={(e) => updatePublication(index, { description: e.target.value })}
                placeholder="Brief description of the publication..."
                rows={3}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Delete Button */}
            <div className="flex justify-end">
              <button
                onClick={() => removePublication(index)}
                className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Remove Publication
              </button>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 glass-effect border-2 border-dashed border-white/20 rounded-xl">
            <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-300">No publications added yet.</p>
            <p className="text-gray-500 text-sm mt-1">Click "Add Publication" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}
