'use client';

import React from 'react';
import PrayerCard from './PrayerCard';
import { PrayerCompletion } from '@/types';

interface PrayerGridProps {
  prayers: PrayerCompletion[];
  onToggle: (prayerName: string) => void;
  readOnly?: boolean;
}

const prayerMeta: Record<string, { emoji: string; subtitle: string }> = {
  Fajr: { emoji: '🌅', subtitle: 'Pre-Dawn' },
  Zuhr: { emoji: '☀️', subtitle: 'Midday' },
  Asr: { emoji: '🌤', subtitle: 'Afternoon' },
  Maghrib: { emoji: '🌇', subtitle: 'Sunset' },
  Isha: { emoji: '🌙', subtitle: 'Night' },
};

export default function PrayerGrid({ prayers, onToggle, readOnly }: PrayerGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
      {prayers.map((prayer) => {
        const meta = prayerMeta[prayer.prayer_name] || { emoji: '🕌', subtitle: '' };
        return (
          <PrayerCard
            key={prayer.prayer_name}
            prayer={prayer}
            emoji={meta.emoji}
            subtitle={meta.subtitle}
            onToggle={() => onToggle(prayer.prayer_name)}
            readOnly={readOnly}
          />
        );
      })}
    </div>
  );
}

export function PrayerGridSkeleton() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-surface border border-border rounded-xl p-4 animate-pulse">
          <div className="w-7 h-7 bg-surface-2 rounded mx-auto mb-2" />
          <div className="h-3 w-12 bg-surface-2 rounded mx-auto mb-1" />
          <div className="h-2 w-10 bg-surface-2 rounded mx-auto mb-3" />
          <div className="w-6 h-6 bg-surface-2 rounded-full mx-auto" />
        </div>
      ))}
    </div>
  );
}
