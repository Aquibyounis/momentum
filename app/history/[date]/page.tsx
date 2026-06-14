'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DayData } from '@/types';
import DayReadOnly from '@/components/history/DayReadOnly';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function HistoryDatePage() {
  const params = useParams();
  const date = params.date as string;
  const [data, setData] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDay() {
      try {
        const res = await fetch(`/api/day/${date}`);
        if (!res.ok) {
          setError('Day not found');
          return;
        }
        const json = await res.json();
        setData(json);
      } catch {
        setError('Failed to load day data');
      } finally {
        setLoading(false);
      }
    }
    if (date) fetchDay();
  }, [date]);

  if (loading) {
    return (
      <div className="py-6 space-y-4 animate-fade-in">
        <div className="h-10 w-48 bg-surface-2 animate-pulse rounded" />
        <div className="h-16 bg-surface-2 animate-pulse rounded-xl" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-surface-2 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-12 text-center">
        <p className="text-text-muted">{error || 'Day not found'}</p>
        <Link href="/history" className="text-accent-blue text-sm mt-3 inline-block hover:underline">
          ← Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 animate-fade-in">
      <Link
        href="/history"
        className="flex items-center gap-2 text-text-muted hover:text-text-secondary text-sm mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to History
      </Link>
      <DayReadOnly data={data} />
    </div>
  );
}
