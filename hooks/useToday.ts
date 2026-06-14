'use client';

import { useState, useEffect, useCallback } from 'react';
import { DayData, TaskCompletion, PrayerCompletion } from '@/types';

export function useToday() {
  const [data, setData] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchToday = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/seed-today', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch today data');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToday();
  }, [fetchToday]);

  const toggleTask = useCallback(
    async (taskId: number, entryDate: string) => {
      if (!data) return false;

      const prevTasks = [...data.tasks];
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tasks: prev.tasks.map((t) =>
            t.blueprint_task_id === taskId
              ? { ...t, is_completed: !t.is_completed, completed_at: !t.is_completed ? new Date().toISOString() : undefined }
              : t
          ),
        };
      });

      try {
        const res = await fetch(`/api/task/${taskId}/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entry_date: entryDate }),
        });
        if (!res.ok) throw new Error('Failed to toggle task');
        return true;
      } catch {
        setData((prev) => (prev ? { ...prev, tasks: prevTasks } : prev));
        return false;
      }
    },
    [data]
  );

  const togglePrayer = useCallback(
    async (prayerName: string, entryDate: string) => {
      if (!data) return false;

      const prevPrayers = [...data.prayers];
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          prayers: prev.prayers.map((p) =>
            p.prayer_name === prayerName
              ? { ...p, is_completed: !p.is_completed, completed_at: !p.is_completed ? new Date().toISOString() : undefined }
              : p
          ),
        };
      });

      try {
        const res = await fetch(`/api/prayer/${prayerName}/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entry_date: entryDate }),
        });
        if (!res.ok) throw new Error('Failed to toggle prayer');
        return true;
      } catch {
        setData((prev) => (prev ? { ...prev, prayers: prevPrayers } : prev));
        return false;
      }
    },
    [data]
  );

  return { data, loading, error, fetchToday, toggleTask, togglePrayer, setData };
}
