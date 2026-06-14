'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useMode } from '@/hooks/useMode';
import { Delete } from 'lucide-react';

export default function PinPad() {
  const { unlock } = useMode();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const maxDigits = 4;

  const handleConfirm = useCallback(
    (currentPin: string) => {
      if (currentPin.length !== maxDigits) return;
      const success = unlock(currentPin);
      if (!success) {
        setError(true);
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 1000);
      }
    },
    [unlock]
  );

  useEffect(() => {
    if (pin.length === maxDigits) {
      handleConfirm(pin);
    }
  }, [pin, handleConfirm]);

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length < maxDigits && !shaking) {
        setPin((prev) => prev + digit);
        setError(false);
      }
    },
    [pin.length, shaking]
  );

  const handleDelete = useCallback(() => {
    if (!shaking) {
      setPin((prev) => prev.slice(0, -1));
      setError(false);
    }
  }, [shaking]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (shaking) return;
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleDelete, shaking]);

  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'del'],
  ];

  return (
    <div className="space-y-6">
      {/* PIN dots */}
      <div className={`flex justify-center gap-4 ${shaking ? 'animate-shake' : ''}`}>
        {Array.from({ length: maxDigits }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-200 ${
              i < pin.length
                ? error
                  ? 'bg-red-500 scale-110 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                  : 'bg-accent-blue scale-110 shadow-[0_0_8px_rgba(56,189,248,0.6)]'
                : 'border-2 border-surface-3 bg-surface'
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-red-400 text-xs animate-fade-in">Incorrect PIN</p>
      )}

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-4 max-w-[260px] mx-auto mt-4">
        {buttons.flat().map((btn, index) => {
          if (btn === '') {
            return <div key={`empty-${index}`} />;
          }
          if (btn === 'del') {
            return (
              <button
                key={btn}
                onClick={handleDelete}
                className="w-16 h-16 mx-auto rounded-full bg-surface-2 hover:bg-surface-3 transition-all duration-150 flex items-center justify-center text-text-muted active:scale-95 border border-transparent"
              >
                <Delete size={20} />
              </button>
            );
          }
          return (
            <button
              key={btn}
              onClick={() => handleDigit(btn)}
              className="w-16 h-16 mx-auto rounded-full bg-surface-2 hover:bg-surface-3 hover:border-border-light transition-all duration-150 text-text-primary text-xl font-medium active:scale-95 border border-surface-3 flex items-center justify-center"
            >
              {btn}
            </button>
          );
        })}
      </div>
    </div>
  );
}
