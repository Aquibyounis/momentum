'use client';

import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface PhaseHeaderProps {
  name: string;
  completed: number;
  total: number;
  isCollapsed: boolean;
  onToggle: () => void;
  colorTag?: string;
}

export default function PhaseHeader({
  name,
  completed,
  total,
  isCollapsed,
  onToggle,
  colorTag,
}: PhaseHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 w-full group py-1"
    >
      <div className="text-text-muted transition-transform duration-200">
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
      </div>
      <h3 className="text-[11px] tracking-widest uppercase text-text-muted font-medium">
        {name}
      </h3>
      <span className="text-[10px] text-text-muted bg-surface-2 px-2 py-0.5 rounded-full">
        {completed}/{total}
      </span>
      <div className="flex-1 h-px bg-border ml-2" />
    </button>
  );
}
