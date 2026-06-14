'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useMode } from '@/hooks/useMode';
import { MessageSquare } from 'lucide-react';

interface DayNotesProps {
  notes?: string;
  entryDate: string;
  readOnly?: boolean;
}

export default function DayNotes({ notes, entryDate, readOnly }: DayNotesProps) {
  const { isAdmin } = useMode();
  const [value, setValue] = useState(notes || '');
  const [saving, setSaving] = useState(false);
  const canEdit = isAdmin && !readOnly;

  useEffect(() => {
    setValue(notes || '');
  }, [notes]);

  const saveNotes = useCallback(async () => {
    if (!canEdit) return;
    try {
      setSaving(true);
      await fetch(`/api/day/${entryDate}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: value }),
      });
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSaving(false);
    }
  }, [value, entryDate, canEdit]);

  useEffect(() => {
    if (!canEdit) return;
    const timer = setTimeout(saveNotes, 2000);
    return () => clearTimeout(timer);
  }, [value, saveNotes, canEdit]);

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={14} className="text-text-muted" />
        <h3 className="text-[11px] tracking-widest uppercase text-text-muted font-medium">
          Day Notes
        </h3>
        {saving && (
          <span className="text-[10px] text-text-muted ml-auto">Saving...</span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!canEdit}
        placeholder={canEdit ? 'Write your thoughts, reflections, or notes for today...' : 'No notes for this day'}
        className="w-full bg-surface-2 border border-border rounded-lg p-3 text-sm text-text-secondary placeholder:text-text-muted/50 resize-none min-h-[80px] focus:outline-none focus:border-border-light disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        rows={3}
      />
    </div>
  );
}
