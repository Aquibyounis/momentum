'use client';

import React, { useState, useEffect } from 'react';
import { DayListItem } from '@/types';
import DayCard from '@/components/history/DayCard';
import EmptyState from '@/components/ui/EmptyState';
import { Calendar, Search } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function HistoryPage() {
  const [days, setDays] = useState<DayListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchDays() {
      try {
        const res = await fetch('/api/days', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setDays(json.days || []);
        }
      } catch (err) {
        console.error('Failed to fetch days:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDays();
  }, []);

  if (loading) {
    return (
      <div className="py-6 space-y-4 animate-fade-in">
        <div className="mb-6">
          <div className="h-6 w-32 bg-surface-2 animate-pulse rounded mb-1" />
          <div className="h-4 w-48 bg-surface-2 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-4 animate-pulse">
              <div className="h-5 w-16 bg-surface-2 rounded mb-2" />
              <div className="h-4 w-40 bg-surface-2 rounded mb-3" />
              <div className="h-2 bg-surface-2 rounded mb-2" />
              <div className="h-2 bg-surface-2 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filteredDays = days.filter((day) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    const dateStr = formatDate(day.entry_date).toLowerCase();
    const notesStr = (day.notes || '').toLowerCase();
    return dateStr.includes(s) || notesStr.includes(s) || `day ${day.day_number}`.includes(s);
  });

  return (
    <div className="py-6 animate-fade-in">
      <div className="mb-6 space-y-4">
        <div>
          <h1 className="text-xl font-medium text-text-primary">History</h1>
          <p className="text-sm text-text-muted mt-0.5">Your past days</p>
        </div>
        
        {days.length > 0 && (
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by date or notes..."
              className="w-full bg-surface-2 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-accent-blue/40 transition-colors"
            />
          </div>
        )}
      </div>

      {days.length === 0 ? (
        <EmptyState
          title="No history yet"
          description="Your completed days will appear here. Check back tomorrow!"
          icon={<Calendar size={28} className="text-text-muted" />}
        />
      ) : filteredDays.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted text-sm">No days match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredDays.map((day) => (
            <DayCard key={day.entry_date} day={day} />
          ))}
        </div>
      )}
    </div>
  );
}
