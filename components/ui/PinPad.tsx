'use client';

import React, { useState } from 'react';
import { useMode } from '@/hooks/useMode';
import { Delete, Check } from 'lucide-react';

export default function PinPad() {
  const { unlock } = useMode();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const maxDigits = 4;

  const handleDigit = (digit: string) => {
    if (pin.length < maxDigits) {
      setPin((prev) => prev + digit);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleConfirm = () => {
    if (pin.length !== maxDigits) return;
    const success = unlock(pin);
    if (!success) {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setTimeout(() => {
        setPin('');
        setError(false);
      }, 1000);
    }
  };

  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['del', '0', 'ok'],
  ];

  return (
    <div className="space-y-5">
      {/* PIN dots */}
      <div className={`flex justify-center gap-3 ${shaking ? 'animate-shake' : ''}`}>
        {Array.from({ length: maxDigits }).map((_, i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
              i < pin.length
                ? error
                  ? 'bg-red-500 scale-110'
                  : 'bg-accent-blue scale-110'
                : 'border-2 border-border-light'
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-red-400 text-xs animate-fade-in">Incorrect PIN</p>
      )}

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto">
        {buttons.flat().map((btn) => {
          if (btn === 'del') {
            return (
              <button
                key={btn}
                onClick={handleDelete}
                className="h-14 rounded-xl bg-surface-2 border border-border hover:bg-surface-3 transition-all duration-150 flex items-center justify-center text-text-muted active:scale-95"
              >
                <Delete size={18} />
              </button>
            );
          }
          if (btn === 'ok') {
            return (
              <button
                key={btn}
                onClick={handleConfirm}
                disabled={pin.length !== maxDigits}
                className={`h-14 rounded-xl border transition-all duration-150 flex items-center justify-center active:scale-95 ${
                  pin.length === maxDigits
                    ? 'bg-accent-blue/20 border-accent-blue text-accent-blue hover:bg-accent-blue/30'
                    : 'bg-surface-2 border-border text-text-muted cursor-not-allowed'
                }`}
              >
                <Check size={18} />
              </button>
            );
          }
          return (
            <button
              key={btn}
              onClick={() => handleDigit(btn)}
              className="h-14 rounded-xl bg-surface border border-border hover:bg-surface-2 hover:border-border-light transition-all duration-150 text-text-primary text-lg font-medium active:scale-95"
            >
              {btn}
            </button>
          );
        })}
      </div>
    </div>
  );
}
