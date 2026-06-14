'use client';

import React from 'react';
import { useMode } from '@/hooks/useMode';

export default function ModeBadge() {
  const { mode } = useMode();

  if (mode === 'locked') return null;

  const isAdmin = mode === 'admin';

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 border border-border">
      <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-blue-400' : 'bg-accent-blue'}`} />
      <span className="text-xs font-medium text-text-secondary">
        {isAdmin ? 'Admin Mode' : 'Viewer Mode'}
      </span>
    </div>
  );
}
