'use client';

import React from 'react';
import { Certification } from '@/app/(features)/support-cv/types/cv.types';
import { Award, Plus, Trash2 } from 'lucide-react';

interface CertificationsSectionProps {
  data: Certification[];
  onChange: (data: Certification[]) => void;
}

export default function CertificationsSection({ data, onChange }: CertificationsSectionProps) {
  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      link: ''
    };
    onChange([...data, newCert]);
  };

  const updateCertification = (index: number, updates: Partial<Certification>) => {
    const updated = [...data];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeCertification = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Award className="w-6 h-6 text-purple-400" />
          Certifications
        </h2>
        <button
          onClick={addCertification}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>

      <div className="space-y-6">
        {data.map((cert, index) => (
          <div key={cert.id} className="glass-effect border border-white/10 rounded-xl p-6 relative hover:border-purple-500/50 transition-all">
            <button
              onClick={() => removeCertification(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              {/* Certification Name */}
                <input
                type="text"
                value={cert.name}
                onChange={(e) => updateCertification(index, { name: e.target.value })}
                placeholder="Certification Name (e.g., AWS Certified Solutions Architect)"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />

              {/* Issuer */}
                <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateCertification(index, { issuer: e.target.value })}
                placeholder="Issuing Organization (e.g., Amazon Web Services)"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Issue Date</label>
                    <input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateCertification(index, { date: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Expiry Date (optional)</label>
                    <input
                    type="month"
                    value={cert.expiryDate || ''}
                    onChange={(e) => updateCertification(index, { expiryDate: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Credential ID & Link */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={cert.credentialId || ''}
                  onChange={(e) => updateCertification(index, { credentialId: e.target.value })}
                  placeholder="Credential ID (optional)"
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <input
                  type="url"
                  value={cert.link || ''}
                  onChange={(e) => updateCertification(index, { link: e.target.value })}
                  placeholder="Verification URL (optional)"
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-12 glass-effect border-2 border-dashed border-white/20 rounded-xl">
            <Award className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <p className="text-gray-300 mb-2">No certifications added yet</p>
            <p className="text-sm text-gray-400">Add professional certifications to boost credibility!</p>
          </div>
        )}
      </div>
    </div>
  );
}
