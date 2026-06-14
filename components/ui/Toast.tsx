'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { ToastMessage } from '@/types';

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[80] flex flex-col gap-2 md:bottom-6 md:left-auto md:right-6 md:translate-x-0">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDone={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDone }: { toast: ToastMessage; onDone: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDone, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  const isSuccess = toast.type === 'success';

  return (
    <div
      className={`px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm min-w-[260px] text-sm font-medium transition-all duration-300 ${
        exiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0 animate-slide-up'
      } ${
        isSuccess
          ? 'bg-accent-blue-bg/90 border-accent-blue-border text-accent-blue'
          : 'bg-red-950/90 border-red-800 text-red-400'
      }`}
    >
      {toast.message}
    </div>
  );
}
