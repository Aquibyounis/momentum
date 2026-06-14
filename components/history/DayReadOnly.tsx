'use client';

import React from 'react';
import { DayData } from '@/types';
import StatCards from '@/components/today/StatCards';
import ProgressBar from '@/components/today/ProgressBar';
import PrayerGrid from '@/components/today/PrayerGrid';
import TaskList from '@/components/today/TaskList';
import DayNotes from '@/components/today/DayNotes';
import { formatDate } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface DayReadOnlyProps {
  data: DayData;
}

export default function DayReadOnly({ data }: DayReadOnlyProps) {
  const tasksCompleted = data.tasks.filter((t) => t.is_completed).length;

  return (
    <div className="space-y-5">
      {/* Locked banner */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
        <Lock size={14} />
        <span>Viewing Day {data.dayNumber} — {formatDate(data.entry.entry_date)}. This day is locked.</span>
      </div>

      {/* Quote */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <p className="text-sm text-text-secondary italic leading-relaxed">
          &ldquo;{data.quote}&rdquo;
        </p>
      </div>

      <StatCards tasks={data.tasks} prayers={data.prayers} streak={0} />

      <ProgressBar
        tasksCompleted={tasksCompleted}
        tasksTotal={data.tasks.length}
        prayersCompleted={data.prayers.filter((p) => p.is_completed).length}
      />

      <div>
        <h2 className="text-[11px] tracking-widest uppercase text-text-muted font-medium mb-3">
          Prayer Tracker
        </h2>
        <PrayerGrid prayers={data.prayers} onToggle={() => {}} readOnly />
      </div>

      <div>
        <h2 className="text-[11px] tracking-widest uppercase text-text-muted font-medium mb-3">
          Blueprint Tasks
        </h2>
        <TaskList tasks={data.tasks} onToggle={() => {}} readOnly />
      </div>

      <DayNotes notes={data.entry.notes} entryDate={data.entry.entry_date} readOnly />
    </div>
  );
}
