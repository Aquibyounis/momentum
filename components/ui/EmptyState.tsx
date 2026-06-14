'use client';

import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-4">
        {icon || <Inbox size={28} className="text-text-muted" />}
      </div>
      <h3 className="text-text-primary font-medium mb-1">{title}</h3>
      <p className="text-text-muted text-sm max-w-xs">{description}</p>
    </div>
  );
}
