'use client';

import React from 'react';
import { CVTemplate } from '@/app/(features)/support-cv/types/cv.types';
import { CV_TEMPLATES } from '@/app/(features)/support-cv/templates/templateData';

interface TemplateSelectorProps {
  onSelectTemplate: (template: CVTemplate) => void;
}

export default function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your CV Template
        </h2>
        <p className="text-xl text-gray-600">
          Select a professional template that matches your style and industry
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CV_TEMPLATES.map(template => (
          <div
            key={template.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group border-2 border-transparent hover:border-purple-500"
            onClick={() => onSelectTemplate(template.id)}
          >
            {/* Preview Image */}
            <div className={`h-64 bg-gradient-to-br ${template.color} flex items-center justify-center relative overflow-hidden`}>
              <span className="text-8xl group-hover:scale-110 transition-transform duration-300">
                {template.icon}
              </span>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
              
              {/* Recommended Badge */}
              {template.recommended && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <span>⭐</span>
                  <span>RECOMMENDED</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {template.name}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {template.description}
              </p>

              {/* Features */}
              <div className="space-y-2 mb-4">
                {template.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Best For */}
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Best for:</p>
                <div className="flex flex-wrap gap-1">
                  {template.bestFor.slice(0, 2).map((role, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Select Button */}
              <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 group-hover:shadow-lg">
                Select Template →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💡</div>
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              Choosing the Right Template
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>ATS-Friendly</strong> - Best for tech companies and startups that use automated screening</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Professional</strong> - Ideal for corporate jobs, finance, consulting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Creative</strong> - Perfect for design, marketing, media roles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Modern/Minimal</strong> - Great all-rounder for most industries</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
