'use client';

import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-surface-3 border border-border text-text-secondary text-xs whitespace-nowrap animate-fade-in z-50 shadow-lg">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-surface-3 border-r border-b border-border rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
}
