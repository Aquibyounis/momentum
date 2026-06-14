'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface AddTaskButtonProps {
  onClick: () => void;
}

export default function AddTaskButton({ onClick }: AddTaskButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-border hover:border-border-light text-text-muted hover:text-text-secondary text-sm transition-all duration-200 hover:bg-surface-2/50"
    >
      <Plus size={14} />
      <span>Add Task</span>
    </button>
  );
}
