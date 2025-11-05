'use client';

import React, { useState } from 'react';
import { CVData } from '@/app/(features)/support-cv/types/cv.types';

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

  const handleToggleChange = (id: string) => {
    setSelectedChanges(prev => ({ ...prev, [id]: !prev[id] }));
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

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="glass-effect border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-2 flex items-center gap-3">
              <span>🤖</span>
              Auto Edit Results
            </h2>
            <p className="text-gray-300">
              Review AI-suggested changes and accept/reject them individually
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-purple-400">
              {changes.length}
            </div>
            <div className="text-sm text-gray-400">Changes Found</div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="glass-effect border border-white/10 rounded-xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="px-4 py-2 glass-effect border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-500/20 transition-all flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Review</span>
          </button>
          
          <div className="h-8 w-px bg-white/20" />
          
          <div className="text-sm text-gray-300">
            <span className="font-bold text-purple-400">{selectedCount}</span>
            <span> of </span>
            <span className="font-bold">{changes.length}</span>
            <span> changes selected</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 text-sm glass-effect border border-blue-500/50 text-blue-300 rounded-lg hover:bg-blue-500/20 transition-all"
          >
            ✓ Select All
          </button>
          
          <button
            onClick={handleDeselectAll}
            className="px-4 py-2 text-sm glass-effect border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/20 transition-all"
          >
            ✗ Deselect All
          </button>

          <div className="h-8 w-px bg-white/20" />

          <button
            onClick={handleApplyChanges}
            disabled={selectedCount === 0}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Apply {selectedCount} Change{selectedCount !== 1 ? 's' : ''}
          </button>
        </div>
      </div>

      {/* Changes List */}
      <div className="space-y-4">
        {changes.map((change, index) => {
          const isSelected = selectedChanges[change.id];
          
          return (
            <div
              key={change.id}
              className={`glass-effect rounded-xl overflow-hidden transition-all ${
                isSelected
                  ? 'border-2 border-purple-500/50 shadow-lg'
                  : 'border border-white/10'
              }`}
            >
              {/* Change Header */}
              <div className={`p-4 flex items-center justify-between ${
                isSelected ? 'bg-purple-500/10' : 'bg-white/5'
              }`}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleChange(change.id)}
                      className="w-5 h-5 rounded border-2 border-purple-500 bg-transparent checked:bg-purple-500 cursor-pointer"
                    />
                    <span className="text-2xl font-bold text-purple-400">
                      #{index + 1}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                        {change.section}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-white font-medium">{change.itemLabel}</span>
                    </div>
                    <div className="text-sm text-gray-400">{change.field}</div>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isSelected
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {isSelected ? '✓ Will Apply' : '✗ Skipped'}
                </div>
              </div>

              {/* Change Content */}
              <div className="p-6">
                {/* Reason */}
                <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 text-lg">💡</span>
                    <div>
                      <div className="text-xs text-blue-300 font-medium mb-1">WHY THIS CHANGE?</div>
                      <div className="text-sm text-gray-300">{change.reason}</div>
                    </div>
                  </div>
                </div>

                {/* Before & After Comparison */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="glass-effect border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-red-400 text-xl">📄</span>
                      <span className="text-sm font-bold text-red-400 uppercase">Before</span>
                    </div>
                    <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap bg-red-500/5 p-3 rounded border border-red-500/20">
                      {typeof change.before === 'object' 
                        ? JSON.stringify(change.before, null, 2) 
                        : (change.before || '(empty)')}
                    </div>
                  </div>

                  {/* After */}
                  <div className="glass-effect border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-green-400 text-xl">✨</span>
                      <span className="text-sm font-bold text-green-400 uppercase">After (AI Enhanced)</span>
                    </div>
                    <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap bg-green-500/5 p-3 rounded border border-green-500/20">
                      {typeof change.after === 'object'
                        ? JSON.stringify(change.after, null, 2)
                        : change.after}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => handleToggleChange(change.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                    }`}
                  >
                    {isSelected ? '✗ Reject This' : '✓ Accept This'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-4 mt-6 glass-effect border border-white/10 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-300">
            💡 <strong>Tip:</strong> You can review each change and accept/reject individually, or apply all at once
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="px-6 py-3 glass-effect border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-500/20 transition-all"
            >
              Cancel
            </button>
            
            <button
              onClick={handleApplyChanges}
              disabled={selectedCount === 0}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-bold hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg glow-effect"
            >
              Apply {selectedCount} Change{selectedCount !== 1 ? 's' : ''} & Continue
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {changes.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="glass-effect border border-blue-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">{changes.filter(c => c.section === 'Experience').length}</div>
            <div className="text-sm text-gray-400">Experience Changes</div>
          </div>
          <div className="glass-effect border border-green-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{changes.filter(c => c.section === 'Skills').length}</div>
            <div className="text-sm text-gray-400">Skills Changes</div>
          </div>
          <div className="glass-effect border border-purple-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{changes.filter(c => c.section === 'Summary').length}</div>
            <div className="text-sm text-gray-400">Summary Changes</div>
          </div>
        </div>
      )}
    </div>
  );
}
