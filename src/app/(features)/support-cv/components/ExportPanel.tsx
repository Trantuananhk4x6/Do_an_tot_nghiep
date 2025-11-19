'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CVData, CVTemplate, ExportFormat } from '@/app/(features)/support-cv/types/cv.types';
import { exportCV, downloadBlob } from '@/app/(features)/support-cv/services/cvExporter';
import CVTemplateRenderer from './CVTemplateRenderer';

interface ExportPanelProps {
  cvData: CVData;
  template: CVTemplate;
  onBackToPreview: () => void;
}

export default function ExportPanel({ cvData, template, onBackToPreview }: ExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const cvPreviewRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let blob: Blob;
      
      if (selectedFormat === 'pdf' && cvPreviewRef.current) {
        // Use HTML-to-PDF for beautiful export matching preview design
        blob = await exportCV(cvData, template, 'pdf', cvPreviewRef.current);
      } else {
        // Fallback to manual render for DOCX or if element not available
        blob = await exportCV(cvData, template, selectedFormat);
      }
      
      const filename = `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.${selectedFormat}`;
      downloadBlob(blob, filename);
      
      // Success message
      alert(`✅ CV exported successfully as ${selectedFormat.toUpperCase()}!`);
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Failed to export CV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Export Your CV
        </h2>

        {/* Format Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Choose Export Format
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedFormat('pdf')}
              className={`p-6 border-2 rounded-xl transition-all ${
                selectedFormat === 'pdf'
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-300 hover:border-purple-300'
              }`}
            >
              <div className="text-5xl mb-3">📄</div>
              <h4 className="font-bold text-gray-900 mb-2">PDF Format</h4>
              <p className="text-sm text-gray-600">
                Universal format, works everywhere. Recommended for most cases.
              </p>
            </button>

            <button
              onClick={() => setSelectedFormat('docx')}
              className={`p-6 border-2 rounded-xl transition-all ${
                selectedFormat === 'docx'
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-300 hover:border-purple-300'
              }`}
            >
              <div className="text-5xl mb-3">📝</div>
              <h4 className="font-bold text-gray-900 mb-2">Word Format</h4>
              <p className="text-sm text-gray-600">
                Editable format for Microsoft Word. Easy to customize later.
              </p>
            </button>
          </div>
        </div>

        {/* Template Info */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">
            Selected Template: {template.toUpperCase()}
          </h3>
          <p className="text-blue-800 text-sm">
            {template === 'ats-friendly' && '🤖 Optimized for Applicant Tracking Systems'}
            {template === 'minimal' && '📄 Clean and professional design'}
            {template === 'modern' && '🎨 Contemporary with color accents'}
            {template === 'creative' && '✨ Bold and unique layout'}
            {template === 'professional' && '💼 Traditional corporate style'}
          </p>
        </div>

        {/* Export Button */}
        <div className="flex gap-4">
          <button
            onClick={onBackToPreview}
            className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
            disabled={isExporting}
          >
            ← Back to Preview
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? '⏳ Exporting...' : `💾 Export as ${selectedFormat.toUpperCase()}`}
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            Export Tips
          </h3>
          <ul className="space-y-2 text-amber-800 text-sm">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span><strong>PDF</strong> - Best for submitting to job portals and email applications</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span><strong>DOCX</strong> - Use if you need to make quick edits in Microsoft Word</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span><strong>ATS-Friendly</strong> - Recommended for tech companies using automated screening</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Keep your filename professional: FirstName_LastName_CV.pdf</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Hidden CV Preview for HTML-to-PDF Export */}
      <div 
        ref={cvPreviewRef}
        className="fixed -left-[9999px] top-0 w-[210mm] bg-white"
        style={{ minHeight: '297mm' }}
      >
        <CVTemplateRenderer
          cvData={cvData}
          template={template}
          sectionOrder={[
            { id: 'summary', label: 'Summary', visible: !!cvData.personalInfo.summary },
            { id: 'experience', label: 'Experience', visible: cvData.experiences.length > 0 },
            { id: 'education', label: 'Education', visible: cvData.education.length > 0 },
            { id: 'skills', label: 'Skills', visible: cvData.skills.length > 0 },
            { id: 'projects', label: 'Projects', visible: cvData.projects.length > 0 },
            { id: 'awards', label: 'Awards & Honors', visible: (cvData.awards && cvData.awards.length > 0) || false },
            { id: 'certifications', label: 'Certifications', visible: cvData.certifications.length > 0 },
            { id: 'languages', label: 'Languages', visible: cvData.languages.length > 0 }
          ]}
        />
      </div>
    </div>
  );
}
