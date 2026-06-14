'use client';

import React from 'react';
import { CheckCircle2, Moon, Flame } from 'lucide-react';
import { TaskCompletion, PrayerCompletion } from '@/types';

interface StatCardsProps {
  tasks: TaskCompletion[];
  prayers: PrayerCompletion[];
  streak: number;
}

export default function StatCards({ tasks, prayers, streak }: StatCardsProps) {
  const tasksDone = tasks.filter((t) => t.is_completed).length;
  const tasksTotal = tasks.length;
  const prayersDone = prayers.filter((p) => p.is_completed).length;

  const cards = [
    {
      label: 'Tasks Done',
      value: `${tasksDone}/${tasksTotal}`,
      icon: <CheckCircle2 size={18} />,
      color: 'text-accent-blue',
      bg: 'bg-accent-blue/10',
    },
    {
      label: 'Prayers Done',
      value: `${prayersDone}/5`,
      icon: <Moon size={18} />,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Day Streak',
      value: `${streak}`,
      icon: <Flame size={18} />,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-surface border border-border rounded-xl p-3 md:p-4"
        >
          <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center ${card.color} mb-2`}>
            {card.icon}
          </div>
          <p className="text-2xl font-medium text-text-primary">{card.value}</p>
          <p className="text-[11px] text-text-muted mt-0.5">{card.label}</p>
        </div>
      ))}
    </div>
  );
}

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-surface border border-border rounded-xl p-3 md:p-4">
          <div className="w-8 h-8 rounded-lg bg-surface-2 animate-pulse mb-2" />
          <div className="h-8 w-12 bg-surface-2 animate-pulse rounded mb-1" />
          <div className="h-3 w-16 bg-surface-2 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}
