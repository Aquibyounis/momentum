'use client';

import React, { useState, useEffect } from 'react';
import { useToday } from '@/hooks/useToday';
import { useMode } from '@/hooks/useMode';
import { useToast } from '@/components/ui/Toast';
import { DayListItem } from '@/types';
import { calcStreak, formatDate } from '@/lib/utils';
import StatCards, { StatCardsSkeleton } from '@/components/today/StatCards';
import ProgressBar, { ProgressBarSkeleton } from '@/components/today/ProgressBar';
import PrayerGrid, { PrayerGridSkeleton } from '@/components/today/PrayerGrid';
import TaskList, { TaskListSkeleton } from '@/components/today/TaskList';
import DayNotes from '@/components/today/DayNotes';

export default function TodayPage() {
  const { data, loading, toggleTask, togglePrayer } = useToday();
  const { isAdmin } = useMode();
  const { showToast } = useToast();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    async function fetchStreak() {
      try {
        const res = await fetch('/api/days', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setStreak(calcStreak(json.days || []));
        }
      } catch {
        // ignore
      }
    }
    fetchStreak();
  }, [data]);

  const handleToggleTask = async (taskId: number) => {
    if (!data) return;
    const success = await toggleTask(taskId, data.entry.entry_date);
    if (success) {
      showToast('Task marked complete ✓', 'success');
    } else {
      showToast('Failed to update — please retry', 'error');
    }
  };

  const handleTogglePrayer = async (prayerName: string) => {
    if (!data) return;
    const success = await togglePrayer(prayerName, data.entry.entry_date);
    if (success) {
      showToast('Prayer updated ✓', 'success');
    } else {
      showToast('Failed to update — please retry', 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-6 space-y-5 animate-fade-in">
        {/* Quote skeleton */}
        <div className="bg-surface border border-border rounded-xl p-4 animate-pulse">
          <div className="h-4 bg-surface-2 rounded w-3/4 mb-2" />
          <div className="h-4 bg-surface-2 rounded w-1/2" />
        </div>
        <StatCardsSkeleton />
        <ProgressBarSkeleton />
        <div className="h-6 w-32 bg-surface-2 animate-pulse rounded" />
        <PrayerGridSkeleton />
        <div className="h-6 w-32 bg-surface-2 animate-pulse rounded" />
        <TaskListSkeleton />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-12 text-center">
        <p className="text-text-muted">Unable to load today&apos;s data. Please try refreshing.</p>
      </div>
    );
  }

  const tasksCompleted = data.tasks.filter((t) => t.is_completed).length;
  const prayersCompleted = data.prayers.filter((p) => p.is_completed).length;

  return (
    <div className="py-6 space-y-5 animate-fade-in">
      {/* Quote */}
      <div className="bg-gradient-to-r from-surface via-surface-2 to-surface border border-border rounded-xl p-4 md:p-5">
        <p className="text-sm text-text-secondary italic leading-relaxed">
          &ldquo;{data.quote}&rdquo;
        </p>
        <p className="text-[11px] text-text-muted mt-2">{formatDate(data.entry.entry_date)}</p>
      </div>

      {/* Stats */}
      <StatCards tasks={data.tasks} prayers={data.prayers} streak={streak} />

      {/* Progress */}
      <ProgressBar
        tasksCompleted={tasksCompleted}
        tasksTotal={data.tasks.length}
        prayersCompleted={prayersCompleted}
      />

      {/* Prayers */}
      <div>
        <h2 className="text-[11px] tracking-widest uppercase text-text-muted font-medium mb-3">
          Prayer Tracker
        </h2>
        <PrayerGrid
          prayers={data.prayers}
          onToggle={handleTogglePrayer}
        />
      </div>

      {/* Tasks */}
      <div>
        <h2 className="text-[11px] tracking-widest uppercase text-text-muted font-medium mb-3">
          Blueprint Tasks
        </h2>
        <TaskList
          tasks={data.tasks}
          onToggle={handleToggleTask}
        />
      </div>

      {/* Notes */}
      <DayNotes
        notes={data.entry.notes}
        entryDate={data.entry.entry_date}
      />
    </div>
  );
}
