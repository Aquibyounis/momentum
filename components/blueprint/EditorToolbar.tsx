'use client';

import React from 'react';
import { Save, RotateCcw, Layers, Download, Upload } from 'lucide-react';

interface EditorToolbarProps {
  taskCount: number;
  hasUnsaved: boolean;
  onSaveAll: () => void;
  onDiscard: () => void;
  onExport: () => void;
  onOpenImport: () => void;
}

export default function EditorToolbar({
  taskCount,
  hasUnsaved,
  onSaveAll,
  onDiscard,
  onExport,
  onOpenImport,
}: EditorToolbarProps) {
  return (
    <div className="sticky top-14 lg:top-0 z-30 bg-[#0d0f12]/95 backdrop-blur-md py-4 mb-4 -mx-1 px-1">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-accent-blue" />
            <h1 className="text-lg font-medium text-text-primary">Blueprint Editor</h1>
          </div>
          <span className="text-[11px] text-text-muted bg-surface-2 px-2.5 py-0.5 rounded-full">
            {taskCount} tasks
          </span>
          {hasUnsaved && (
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" title="Unsaved changes" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenImport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-text-muted text-sm hover:text-text-secondary hover:bg-surface-2 transition-colors"
            title="Import JSON"
          >
            <Upload size={14} />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-text-muted text-sm hover:text-text-secondary hover:bg-surface-2 transition-colors"
            title="Export JSON"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={onDiscard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-text-muted text-sm hover:text-text-secondary hover:bg-surface-2 transition-colors"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Discard</span>
          </button>
          <button
            onClick={onSaveAll}
            className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-accent-blue/20 border border-accent-blue/40 text-accent-blue text-sm font-medium hover:bg-accent-blue/30 transition-colors"
          >
            <Save size={14} />
            <span>Save All</span>
            {hasUnsaved && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
