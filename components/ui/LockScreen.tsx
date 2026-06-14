'use client';

import React, { useState, useEffect } from 'react';
import { useMode } from '@/hooks/useMode';
import PinPad from './PinPad';

export default function LockScreen() {
  const { mode } = useMode();
  const [visible, setVisible] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'viewer' | 'admin' | null>(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (mode !== 'locked') {
      setFadeOut(true);
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    } else {
      setVisible(true);
      setFadeOut(false);
      setSelectedRole(null);
    }
  }, [mode]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0d0f12]/95 backdrop-blur-md transition-opacity duration-300 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-sm mx-4 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-blue to-emerald-600 flex items-center justify-center shadow-lg shadow-accent-blue/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Momentum</h1>
          <p className="text-sm text-text-muted mt-1">90-Day Blueprint</p>
        </div>

        {!selectedRole ? (
          <div className="space-y-3">
            <p className="text-center text-text-muted text-sm mb-4">Select your access level</p>
            <button
              onClick={() => setSelectedRole('viewer')}
              className="w-full py-4 px-5 rounded-xl bg-surface border border-border hover:border-border-light hover:bg-surface-2 transition-all duration-200 flex items-center gap-4 group"
            >
              <span className="text-2xl">👁</span>
              <div className="text-left">
                <p className="text-text-primary font-medium">Viewer</p>
                <p className="text-text-muted text-xs">View daily progress & history</p>
              </div>
              <svg className="ml-auto w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedRole('admin')}
              className="w-full py-4 px-5 rounded-xl bg-surface border border-border hover:border-border-light hover:bg-surface-2 transition-all duration-200 flex items-center gap-4 group"
            >
              <span className="text-2xl">🛠</span>
              <div className="text-left">
                <p className="text-text-primary font-medium">Admin</p>
                <p className="text-text-muted text-xs">Full control & blueprint editor</p>
              </div>
              <svg className="ml-auto w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="animate-slide-up">
            <button
              onClick={() => setSelectedRole(null)}
              className="flex items-center gap-2 text-text-muted hover:text-text-secondary text-sm mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div className="text-center mb-4">
              <span className="text-3xl">{selectedRole === 'viewer' ? '👁' : '🛠'}</span>
              <p className="text-text-primary font-medium mt-2">
                Enter {selectedRole === 'viewer' ? 'Viewer' : 'Admin'} PIN
              </p>
            </div>
            <PinPad />
          </div>
        )}
      </div>
    </div>
  );
}
