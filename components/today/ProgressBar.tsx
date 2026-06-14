'use client';

import React from 'react';

interface ProgressBarProps {
  tasksCompleted: number;
  tasksTotal: number;
  prayersCompleted: number;
}

export default function ProgressBar({ tasksCompleted, tasksTotal, prayersCompleted }: ProgressBarProps) {
  const total = tasksTotal + 5;
  const done = tasksCompleted + prayersCompleted;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-secondary font-medium">Daily Progress</span>
        <span className="text-sm font-medium text-accent-blue">{percent}%</span>
      </div>
      <div className="h-2.5 bg-surface-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-blue to-emerald-400 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-[11px] text-text-muted mt-1.5">
        {done} of {total} activities completed
      </p>
    </div>
  );
}

export function ProgressBarSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex justify-between mb-2">
        <div className="h-4 w-24 bg-surface-2 animate-pulse rounded" />
        <div className="h-4 w-8 bg-surface-2 animate-pulse rounded" />
      </div>
      <div className="h-2.5 bg-surface-2 rounded-full animate-pulse" />
    </div>
  );
}
