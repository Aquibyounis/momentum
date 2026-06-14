'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Copy, Check, AlertTriangle } from 'lucide-react';

interface JsonImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (json: string) => void;
}

const PLACEHOLDER = `[
  {
    "time_label": "07:30 AM",
    "title": "Wake Up & First Flush",
    "description": "Drink 250ml water slowly",
    "phase_name": "Phase 1 — Morning",
    "phase_order": 1,
    "sort_order": 1,
    "color_tag": "green"
  }
]`;

export default function JsonImportModal({ open, onClose, onImport }: JsonImportModalProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validCount, setValidCount] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const validate = (text: string) => {
    if (!text.trim()) {
      setError(null);
      setValidCount(null);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        setError('JSON must be an array of task objects');
        setValidCount(null);
        return;
      }
      for (let i = 0; i < parsed.length; i++) {
        if (!parsed[i].title) {
          setError(`Task at index ${i} is missing required field "title"`);
          setValidCount(null);
          return;
        }
      }
      setError(null);
      setValidCount(parsed.length);
    } catch (e) {
      setError('Invalid JSON syntax — check for missing commas or brackets');
      setValidCount(null);
    }
  };

  const handleChange = (text: string) => {
    setValue(text);
    validate(text);
  };

  const handleInsert = () => {
    if (error || !value.trim()) return;
    onImport(value);
    setValue('');
    setError(null);
    setValidCount(null);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setValue(text);
      validate(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePaste = () => {
    navigator.clipboard.readText().then((text) => {
      setValue(text);
      validate(text);
    }).catch(() => {
      setError('Unable to read clipboard. Please paste manually.');
    });
  };

  const handleFormat = () => {
    if (!value.trim()) return;
    try {
      const parsed = JSON.parse(value);
      setValue(JSON.stringify(parsed, null, 2));
      validate(JSON.stringify(parsed));
    } catch {
      // already has error set
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
      <div className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl animate-slide-up flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent-blue/10 flex items-center justify-center">
              <Upload size={18} className="text-accent-blue" />
            </div>
            <div>
              <h2 className="text-text-primary font-medium">Import Blueprint</h2>
              <p className="text-text-muted text-xs">Paste or upload JSON to replace the entire blueprint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-surface-2 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col p-5 gap-3">
          {/* Action bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePaste}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-text-secondary text-xs hover:bg-surface-3 transition-colors"
            >
              <Copy size={12} />
              Paste from Clipboard
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-text-secondary text-xs hover:bg-surface-3 transition-colors"
            >
              <Upload size={12} />
              Upload .json File
            </button>
            <button
              onClick={handleFormat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-text-secondary text-xs hover:bg-surface-3 transition-colors"
            >
              Format
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Textarea */}
          <div className="flex-1 relative min-h-0">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={PLACEHOLDER}
              spellCheck={false}
              className="w-full h-full min-h-[280px] bg-[#0d0f12] border border-border rounded-xl p-4 text-sm font-mono text-text-secondary placeholder:text-text-muted/30 resize-none focus:outline-none focus:border-accent-blue/40 transition-colors leading-relaxed"
            />
          </div>

          {/* Validation feedback */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-950/50 border border-red-800/50 text-red-400 text-xs animate-fade-in">
              <AlertTriangle size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {validCount !== null && !error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent-blue-bg/50 border border-accent-blue-border/50 text-accent-blue text-xs animate-fade-in">
              <Check size={14} className="flex-shrink-0" />
              <span>Valid JSON — {validCount} task{validCount !== 1 ? 's' : ''} detected</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex items-center justify-between">
          <p className="text-[11px] text-text-muted">
            This will <span className="text-amber-400 font-medium">replace</span> all current blueprint tasks
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-2 border border-border text-text-secondary text-sm hover:bg-surface-3 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              disabled={!!error || !value.trim() || validCount === null}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                error || !value.trim() || validCount === null
                  ? 'bg-surface-2 border border-border text-text-muted cursor-not-allowed'
                  : 'bg-accent-blue/20 border border-accent-blue/40 text-accent-blue hover:bg-accent-blue/30 active:scale-[0.97]'
              }`}
            >
              Insert {validCount !== null ? `(${validCount} tasks)` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
