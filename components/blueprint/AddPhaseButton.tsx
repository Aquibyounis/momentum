'use client';

import React from 'react';
import { FolderPlus } from 'lucide-react';

interface AddPhaseButtonProps {
  onClick: () => void;
}

export default function AddPhaseButton({ onClick }: AddPhaseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border hover:border-accent-blue/40 text-text-muted hover:text-accent-blue text-sm font-medium transition-all duration-200 hover:bg-accent-blue/5"
    >
      <FolderPlus size={16} />
      <span>Add Phase</span>
    </button>
  );
}
