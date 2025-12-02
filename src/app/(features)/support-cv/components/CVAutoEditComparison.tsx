'use client';

import React, { useState, useMemo } from 'react';
import { CVData } from '@/app/(features)/support-cv/types/cv.types';
import { 
  Wand2, 
  ArrowLeft, 
  Check, 
  X, 
  Lightbulb, 
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Briefcase,
  GraduationCap,
  Code2,
  FileText,
  Award,
  Target
} from 'lucide-react';

interface ChangeItem {
  id: string;
  section: string;
  field: string;
  itemLabel: string;
  before: string;
  after: string;
  reason: string;
  accepted: boolean;
}

interface CVAutoEditComparisonProps {
  originalCV: CVData;
  editedCV: CVData;
  changes: ChangeItem[];
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onAcceptSelected: (selectedIds: string[]) => void;
  onBack: () => void;
}

// Get icon for section
const getSectionIcon = (section: string) => {
  switch (section.toLowerCase()) {
    case 'experience': return Briefcase;
    case 'education': return GraduationCap;
    case 'skills': return Code2;
    case 'summary': return FileText;
    case 'certifications': return Award;
    case 'projects': return Target;
    default: return FileText;
  }
};

// Get color for section
const getSectionColor = (section: string) => {
  switch (section.toLowerCase()) {
    case 'experience': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' };
    case 'education': return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' };
    case 'skills': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' };
    case 'summary': return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' };
    case 'certifications': return { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' };
    case 'projects': return { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' };
    default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' };
  }
};

export default function CVAutoEditComparison({
  originalCV,
  editedCV,
  changes,
  onAcceptAll,
  onRejectAll,
  onAcceptSelected,
  onBack
}: CVAutoEditComparisonProps) {
  const [selectedChanges, setSelectedChanges] = useState<Record<string, boolean>>(
    changes.reduce((acc, change) => ({ ...acc, [change.id]: true }), {})
  );
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    changes.reduce((acc, change) => ({ ...acc, [change.id]: true }), {})
  );

  // Group changes by section
  const groupedChanges = useMemo(() => {
    const groups: Record<string, ChangeItem[]> = {};
    changes.forEach(change => {
      if (!groups[change.section]) {
        groups[change.section] = [];
      }
      groups[change.section].push(change);
    });
    return groups;
  }, [changes]);

  const handleToggleChange = (id: string) => {
    setSelectedChanges(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAll = () => {
    setSelectedChanges(changes.reduce((acc, change) => ({ ...acc, [change.id]: true }), {}));
  };

  const handleDeselectAll = () => {
    setSelectedChanges(changes.reduce((acc, change) => ({ ...acc, [change.id]: false }), {}));
  };

  const handleApplyChanges = () => {
    const selected = Object.entries(selectedChanges)
      .filter(([_, accepted]) => accepted)
      .map(([id]) => id);
    onAcceptSelected(selected);
  };

  const selectedCount = Object.values(selectedChanges).filter(Boolean).length;
  const sections = Object.keys(groupedChanges);

  // Render diff view
  const renderDiff = (before: string, after: string) => {
    const beforeText = typeof before === 'object' ? JSON.stringify(before, null, 2) : (before || '');
    const afterText = typeof after === 'object' ? JSON.stringify(after, null, 2) : (after || '');
    
    const isEmpty = !beforeText.trim();
    
    return (
      <div className="space-y-3">
        {/* Before */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Minus className="w-4 h-4 text-red-400" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">Original</span>
          </div>
          {isEmpty ? (
            <div className="py-4 px-4 bg-gray-800/40 rounded-lg border border-dashed border-gray-600 text-center">
              <span className="text-sm text-gray-500 italic">Empty - New content will be added</span>
            </div>
          ) : (
            <div className="py-3 px-4 bg-red-950/30 rounded-lg border border-red-900/50 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {beforeText}
            </div>
          )}
        </div>
        
        {/* After */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="w-4 h-4 text-green-400" />
            <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">Enhanced</span>
          </div>
          <div className="py-3 px-4 bg-green-950/30 rounded-lg border border-green-900/50 text-sm text-white leading-relaxed whitespace-pre-wrap font-medium">
            {afterText}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      {/* Header - More compact */}
      <div className="glass-effect border border-white/10 rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-0.5">
                AI Enhancement Review
              </h2>
              <p className="text-sm text-gray-400">
                {changes.length} improvements suggested across {sections.length} section{sections.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {/* Selection Summary */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{selectedCount}/{changes.length}</div>
              <div className="text-xs text-gray-400">Selected</div>
            </div>
            <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                style={{ width: `${(selectedCount / changes.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Bar - Cleaner */}
      <div className="flex items-center justify-between mb-5 gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAll}
            className="px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
          >
            Select All
          </button>
          <span className="text-gray-600">|</span>
          <button
            onClick={handleDeselectAll}
            className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:bg-gray-500/10 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Changes by Section */}
      <div className="space-y-6">
        {sections.map(section => {
          const sectionChanges = groupedChanges[section];
          const SectionIcon = getSectionIcon(section);
          const colors = getSectionColor(section);
          const selectedInSection = sectionChanges.filter(c => selectedChanges[c.id]).length;

          return (
            <div key={section} className="space-y-3">
              {/* Section Header */}
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <SectionIcon className={`w-4 h-4 ${colors.text}`} />
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${colors.text}`}>{section}</h3>
                  <span className="text-xs text-gray-500">
                    {selectedInSection}/{sectionChanges.length} selected
                  </span>
                </div>
              </div>

              {/* Section Changes */}
              <div className="space-y-3 pl-11">
                {sectionChanges.map((change) => {
                  const isSelected = selectedChanges[change.id];
                  const isExpanded = expandedCards[change.id];

                  return (
                    <div
                      key={change.id}
                      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                        isSelected
                          ? 'border-purple-500/40 bg-purple-500/5'
                          : 'border-white/10 bg-white/[0.02]'
                      }`}
                    >
                      {/* Card Header */}
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => handleToggleExpand(change.id)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Checkbox */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleChange(change.id);
                            }}
                            className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-purple-500 border-purple-500'
                                : 'border-gray-600 hover:border-gray-500'
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </button>
                          
                          {/* Title & Field */}
                          <div className="min-w-0">
                            <div className="font-medium text-white text-sm truncate">
                              {change.itemLabel}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {change.field}
                            </div>
                          </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-3">
                          {/* Status Badge */}
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            isSelected
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-500'
                          }`}>
                            {isSelected ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                Apply
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                Skip
                              </>
                            )}
                          </div>
                          
                          {/* Expand/Collapse */}
                          <button className="p-1 text-gray-500 hover:text-gray-300 transition-colors">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Content */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0">
                          {/* Reason */}
                          <div className="mb-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-300 leading-relaxed">{change.reason}</p>
                            </div>
                          </div>

                          {/* Diff View */}
                          {renderDiff(change.before, change.after)}

                          {/* Quick Toggle */}
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => handleToggleChange(change.id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                isSelected
                                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                  : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <X className="w-4 h-4" />
                                  Don't Apply
                                </>
                              ) : (
                                <>
                                  <Check className="w-4 h-4" />
                                  Apply This
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Bar - Fixed & Clean */}
      <div className="sticky bottom-4 mt-8">
        <div className="glass-effect border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            {/* Left - Tip */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Click cards to expand details</span>
            </div>
            
            {/* Right - Actions */}
            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={onBack}
                className="px-5 py-2.5 text-gray-400 hover:text-white border border-gray-700 rounded-xl hover:border-gray-600 transition-all text-sm font-medium"
              >
                Cancel
              </button>
              
              <button
                onClick={handleApplyChanges}
                disabled={selectedCount === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
              >
                Apply {selectedCount} Change{selectedCount !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
