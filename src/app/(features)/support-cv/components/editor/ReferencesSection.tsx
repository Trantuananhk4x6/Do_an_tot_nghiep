'use client';

import React from 'react';
import { Reference } from '@/app/(features)/support-cv/types/cv.types';
import { UserCheck, Plus, Trash2, Mail, Phone, Building2 } from 'lucide-react';

interface ReferencesSectionProps {
  data: Reference[];
  onChange: (data: Reference[]) => void;
}

export default function ReferencesSection({ data, onChange }: ReferencesSectionProps) {
  const addReference = () => {
    const newReference: Reference = {
      id: Date.now().toString(),
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      relationship: ''
    };
    onChange([...data, newReference]);
  };

  const updateReference = (index: number, updates: Partial<Reference>) => {
    const updated = [...data];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeReference = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2 lg:gap-3">
          <UserCheck className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
          References
        </h2>
        <button
          onClick={addReference}
          className="px-3 lg:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-2 text-sm lg:text-base"
        >
          <Plus className="w-4 h-4" />
          Add Reference
        </button>
      </div>

      <div className="space-y-4">
        {data.map((ref, index) => (
          <div key={ref.id} className="glass-effect border border-white/10 rounded-xl p-4 lg:p-5 hover:border-green-500/50 transition-all">
            {/* Name & Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={ref.name}
                  onChange={(e) => updateReference(index, { name: e.target.value })}
                  placeholder="e.g., Dr. John Smith"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Job Title
                </label>
                <input
                  type="text"
                  value={ref.title}
                  onChange={(e) => updateReference(index, { title: e.target.value })}
                  placeholder="e.g., Senior Manager"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Company & Relationship */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={ref.company}
                  onChange={(e) => updateReference(index, { company: e.target.value })}
                  placeholder="e.g., ABC Corporation"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Relationship
                </label>
                <input
                  type="text"
                  value={ref.relationship || ''}
                  onChange={(e) => updateReference(index, { relationship: e.target.value })}
                  placeholder="e.g., Former Manager, Colleague"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={ref.email || ''}
                  onChange={(e) => updateReference(index, { email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={ref.phone || ''}
                  onChange={(e) => updateReference(index, { phone: e.target.value })}
                  placeholder="+84 xxx xxx xxx"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Delete Button */}
            <div className="flex justify-end">
              <button
                onClick={() => removeReference(index)}
                className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Remove Reference
              </button>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 glass-effect border-2 border-dashed border-white/20 rounded-xl">
            <UserCheck className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-300">No references added yet.</p>
            <p className="text-gray-500 text-sm mt-1">Click "Add Reference" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}
