'use client';

import React from 'react';
import { TaskCompletion } from '@/types';
import { useMode } from '@/hooks/useMode';
import Tooltip from '@/components/ui/Tooltip';
import { Check } from 'lucide-react';

interface TaskRowProps {
  task: TaskCompletion;
  onToggle: () => void;
  readOnly?: boolean;
}

export default function TaskRow({ task, onToggle, readOnly }: TaskRowProps) {
  const { isAdmin } = useMode();
  const canToggle = isAdmin && !readOnly;

  const handleClick = () => {
    if (canToggle) onToggle();
  };

  const row = (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 bg-surface border border-border rounded-[10px] px-4 py-3 transition-all duration-200 ${
        canToggle ? 'cursor-pointer hover:border-border-light active:scale-[0.99]' : 'cursor-default'
      } ${task.is_completed ? 'opacity-[0.65]' : ''}`}
    >
      {/* Checkbox */}
      <div
        className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
          task.is_completed
            ? 'bg-accent-blue'
            : 'border-[1.5px] border-[#334155]'
        }`}
      >
        {task.is_completed && <Check size={12} className="text-white" strokeWidth={3} />}
      </div>

      {/* Time */}
      {task.time_snapshot && (
        <span className="text-[11px] font-mono text-accent-blue min-w-[56px] flex-shrink-0">
          {task.time_snapshot}
        </span>
      )}

      {/* Title & description */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm transition-colors ${
            task.is_completed
              ? 'text-[#475569] line-through'
              : 'text-text-secondary'
          }`}
        >
          {task.title_snapshot}
        </p>
      </div>

      {/* Viewer lock icon */}
      {!isAdmin && !readOnly && (
        <span className="text-text-muted text-xs flex-shrink-0">🔒</span>
      )}
    </div>
  );

  if (!isAdmin && !readOnly) {
    return (
      <Tooltip content="🔒 Admin access required">
        {row}
      </Tooltip>
    );
  }

  return row;
}
