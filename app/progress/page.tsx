'use client';

import React, { useState, useEffect } from 'react';
import { DayListItem } from '@/types';
import CompletionChart from '@/components/progress/CompletionChart';
import EmptyState from '@/components/ui/EmptyState';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProgressPage() {
  const [days, setDays] = useState<DayListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/days', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setDays(json.days || []);
        }
      } catch (err) {
        console.error('Failed to fetch progress data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthYearString = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  if (loading) {
    return (
      <div className="py-6 space-y-5 animate-fade-in">
        <div>
          <div className="h-6 w-32 bg-surface-2 animate-pulse rounded mb-1" />
          <div className="h-4 w-56 bg-surface-2 animate-pulse rounded" />
        </div>
        <div className="h-[400px] bg-surface border border-border rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="py-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-medium text-text-primary">Progress</h1>
          <p className="text-sm text-text-muted mt-0.5">Track your transformation journey</p>
        </div>

        <div className="flex items-center gap-4 bg-surface border border-border rounded-lg p-1.5 w-fit">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 hover:bg-surface-2 rounded-md transition-colors text-text-secondary hover:text-text-primary"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-text-primary min-w-[120px] text-center">
            {monthYearString}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 hover:bg-surface-2 rounded-md transition-colors text-text-secondary hover:text-text-primary"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {days.length === 0 ? (
        <EmptyState
          title="No data yet"
          description="Complete your first day to see your progress charts."
          icon={<TrendingUp size={28} className="text-text-muted" />}
        />
      ) : (
        <div className="space-y-5">
          <CompletionChart days={days} targetMonth={currentDate} />
        </div>
      )}
    </div>
  );
}
