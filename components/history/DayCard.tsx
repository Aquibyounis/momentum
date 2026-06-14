'use client';

import React from 'react';
import Link from 'next/link';
import { DayListItem } from '@/types';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, Moon } from 'lucide-react';

interface DayCardProps {
  day: DayListItem;
}

export default function DayCard({ day }: DayCardProps) {
  const totalActivities = day.tasks_total + 5;
  const completedActivities = day.tasks_completed + day.prayers_completed;
  const percent = totalActivities > 0
    ? Math.round((completedActivities / totalActivities) * 100)
    : 0;

  const percentColor = percent < 40 ? 'text-red-400 bg-red-400/10' :
    percent < 70 ? 'text-amber-400 bg-amber-400/10' : 'text-accent-blue bg-accent-blue/10';

  return (
    <Link href={`/history/${day.entry_date}`}>
      <div className="bg-surface border border-border rounded-xl p-4 hover:border-border-light transition-all duration-200 group cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-text-primary mb-1.5">
              {formatDate(day.entry_date)}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${percentColor}`}>
            {percent}%
          </span>
        </div>

        {/* Progress bars */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={12} className="text-accent-blue flex-shrink-0" />
            <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-blue rounded-full transition-all"
                style={{ width: `${day.tasks_total > 0 ? (day.tasks_completed / day.tasks_total) * 100 : 0}%` }}
              />
            </div>
            <span className="text-[11px] text-text-muted min-w-[48px] text-right">
              {day.tasks_completed}/{day.tasks_total}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Moon size={12} className="text-blue-400 flex-shrink-0" />
            <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full transition-all"
                style={{ width: `${(day.prayers_completed / 5) * 100}%` }}
              />
            </div>
            <span className="text-[11px] text-text-muted min-w-[48px] text-right">
              {day.prayers_completed}/5
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
