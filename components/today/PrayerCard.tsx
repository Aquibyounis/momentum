'use client';

import React from 'react';
import { PrayerCompletion } from '@/types';
import { useMode } from '@/hooks/useMode';
import Tooltip from '@/components/ui/Tooltip';
import { Check, Lock } from 'lucide-react';

interface PrayerCardProps {
  prayer: PrayerCompletion;
  emoji: string;
  subtitle: string;
  onToggle: () => void;
  readOnly?: boolean;
}

export default function PrayerCard({ prayer, emoji, subtitle, onToggle, readOnly }: PrayerCardProps) {
  const { isAdmin } = useMode();
  const canToggle = isAdmin && !readOnly;

  const handleClick = () => {
    if (canToggle) {
      onToggle();
    }
  };

  const card = (
    <button
      onClick={handleClick}
      disabled={!canToggle}
      className={`w-full text-center rounded-xl p-4 transition-all duration-200 border ${
        prayer.is_completed
          ? 'bg-accent-blue-bg/60 border-accent-blue-border'
          : 'bg-surface border-border hover:border-border-light'
      } ${canToggle ? 'cursor-pointer active:scale-[0.97]' : 'cursor-default'}`}
    >
      <div className="text-[28px] mb-1.5">{emoji}</div>
      <p className="text-[13px] font-medium text-text-primary">{prayer.prayer_name}</p>
      <p className="text-[11px] text-text-muted mb-3">{subtitle}</p>
      <div
        className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center transition-all duration-200 ${
          prayer.is_completed
            ? 'bg-accent-blue'
            : 'border-[1.5px] border-[#334155]'
        }`}
      >
        {prayer.is_completed && <Check size={14} className="text-white" strokeWidth={3} />}
      </div>
    </button>
  );

  if (!isAdmin && !readOnly) {
    return (
      <Tooltip content="🔒 Admin access required">
        {card}
      </Tooltip>
    );
  }

  return card;
}
