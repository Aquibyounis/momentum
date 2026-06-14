'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Mode, ModeContextType } from '@/types';

export const ModeContext = createContext<ModeContextType>({
  mode: 'locked',
  isAdmin: false,
  isViewer: false,
  unlock: () => false,
  lock: () => {},
});

const STORAGE_KEY = 'daytrack_mode';

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('locked');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'viewer' || stored === 'admin') {
      setMode(stored);
    }
  }, []);

  const unlock = useCallback((pin: string): boolean => {
    if (pin === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setMode('admin');
      localStorage.setItem(STORAGE_KEY, 'admin');
      return true;
    }
    if (pin === process.env.NEXT_PUBLIC_VIEWER_PASSWORD) {
      setMode('viewer');
      localStorage.setItem(STORAGE_KEY, 'viewer');
      return true;
    }
    return false;
  }, []);

  const lock = useCallback(() => {
    setMode('locked');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ModeContext.Provider
      value={{
        mode,
        isAdmin: mode === 'admin',
        isViewer: mode === 'viewer',
        unlock,
        lock,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}
