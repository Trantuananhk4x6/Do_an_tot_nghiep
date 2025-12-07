'use client';

import React, { useState, useRef, useMemo } from 'react';
import { 
  FileText, 
  FileDown, 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  Loader2,
  FileType,
  Lightbulb,
  Check,
  Sparkles
} from 'lucide-react';
import { CVData, CVTemplate, ExportFormat } from '@/app/(features)/support-cv/types/cv.types';
import { useCVBuilder } from '../contexts/CVBuilderContext';
import { exportCV, downloadBlob } from '@/app/(features)/support-cv/services/cvExporter';
import CVTemplateRenderer from './CVTemplateRenderer';
import { getTemplateInfo } from '../templates/templateData';

interface ExportPanelProps {
  cvData: CVData;
  template: CVTemplate;
  onBackToPreview: () => void;
}

export default function ExportPanel({ cvData, template, onBackToPreview }: ExportPanelProps) {
  const { state } = useCVBuilder();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const cvPreviewRef = useRef<HTMLDivElement>(null);
  
  const templateInfo = getTemplateInfo(template);

  // Use sectionOrder from context, or create default if not available
  const sectionOrder = useMemo(() => {
    if (state.sectionOrder && state.sectionOrder.length > 0) {
      return state.sectionOrder;
    }
    // Fallback - create default order from cvData
    return [
      { id: 'summary', label: 'Summary', visible: !!cvData.personalInfo.summary },
      { id: 'experience', label: 'Experience', visible: cvData.experiences.length > 0 },
      { id: 'education', label: 'Education', visible: cvData.education.length > 0 },
      { id: 'skills', label: 'Skills', visible: cvData.skills.length > 0 },
      { id: 'projects', label: 'Projects', visible: cvData.projects.length > 0 },
      { id: 'awards', label: 'Awards & Honors', visible: (cvData.awards && cvData.awards.length > 0) || false },
      { id: 'certifications', label: 'Certifications', visible: cvData.certifications.length > 0 },
      { id: 'languages', label: 'Languages', visible: cvData.languages.length > 0 },
      { id: 'publications', label: 'Publications', visible: (cvData.publications && cvData.publications.length > 0) || false },
      { id: 'volunteer', label: 'Volunteer', visible: (cvData.volunteer && cvData.volunteer.length > 0) || false },
      { id: 'references', label: 'References', visible: (cvData.references && cvData.references.length > 0) || false }
    ];
  }, [state.sectionOrder, cvData]);

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    
    try {
      let blob: Blob;
      
      if (selectedFormat === 'pdf' && cvPreviewRef.current) {
        // Wait a moment for the hidden CV to fully render
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Use HTML-to-PDF for beautiful export matching preview design
        blob = await exportCV(cvData, template, 'pdf', cvPreviewRef.current, sectionOrder);
      } else {
        // For DOCX, pass sectionOrder to maintain section order and visibility
        blob = await exportCV(cvData, template, selectedFormat, undefined, sectionOrder);
      }
      
      const filename = `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.${selectedFormat}`;
      downloadBlob(blob, filename);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Failed to export CV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="glass-effect border border-purple-500/30 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-8 py-6 border-b border-purple-500/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              <Download className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Export Your CV
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Download your professional CV in your preferred format
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Format Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileType className="w-5 h-5 text-purple-400" />
              Choose Export Format
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedFormat('pdf')}
                className={`relative p-6 border-2 rounded-xl transition-all group ${
                  selectedFormat === 'pdf'
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                    : 'border-white/10 hover:border-purple-500/50 hover:bg-white/5'
                }`}
              >
                {selectedFormat === 'pdf' && (
                  <div className="absolute top-3 right-3">
                    <Check className="w-5 h-5 text-purple-400" />
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-red-400" />
                </div>
                <h4 className="font-bold text-white mb-2">PDF Format</h4>
                <p className="text-sm text-gray-400">
                  Universal format, works everywhere. Recommended for most cases.
                </p>
              </button>

              <button
                onClick={() => setSelectedFormat('docx')}
                className={`relative p-6 border-2 rounded-xl transition-all group ${
                  selectedFormat === 'docx'
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                    : 'border-white/10 hover:border-purple-500/50 hover:bg-white/5'
                }`}
              >
                {selectedFormat === 'docx' && (
                  <div className="absolute top-3 right-3">
                    <Check className="w-5 h-5 text-purple-400" />
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileDown className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="font-bold text-white mb-2">Word Format</h4>
                <p className="text-sm text-gray-400">
                  Editable format for Microsoft Word. Easy to customize later.
                </p>
              </button>
            </div>
          </div>

          {/* Template Info */}
          <div className="mb-8 glass-effect border border-blue-500/30 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-blue-300">
                  Selected Template: {templateInfo?.name || template.toUpperCase()}
                </h3>
                <p className="text-blue-200/80 text-sm">
                  {templateInfo?.description || 'Professional CV template'}
                </p>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex gap-4">
            <button
              onClick={onBackToPreview}
              disabled={isExporting}
              className="flex-1 px-6 py-4 glass-effect border-2 border-white/20 text-gray-300 rounded-xl hover:bg-white/10 hover:border-purple-500/50 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Preview
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
                exportSuccess
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Exporting...
                </>
              ) : exportSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Export as {selectedFormat.toUpperCase()}
                </>
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="mt-8 glass-effect border border-amber-500/30 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-amber-300 mb-3">Export Tips</h3>
                <ul className="space-y-2 text-amber-200/80 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span><strong>PDF</strong> - Best for submitting to job portals and email applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span><strong>DOCX</strong> - Use if you need to make quick edits in Microsoft Word</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span><strong>ATS-Friendly</strong> - Recommended for tech companies using automated screening</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>Keep your filename professional: FirstName_LastName_CV.pdf</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden CV Preview for HTML-to-PDF Export */}
      <div 
        ref={cvPreviewRef}
        className="cv-export-container"
        style={{ 
          position: 'absolute',
          left: '-9999px', 
          top: '0', 
          width: '210mm', 
          minHeight: '297mm',
          background: 'white',
          zIndex: -1
        }}
      >
        <CVTemplateRenderer
          cvData={cvData}
          template={template}
          sectionOrder={sectionOrder}
        />
      </div>
    </div>
  );
}
