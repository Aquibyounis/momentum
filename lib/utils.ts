import { DayListItem, ColorTag } from '@/types';

export function toLocalDateString(dateVal: Date | string): string {
  const d = new Date(dateVal);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDate(date: string): string {
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function todayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calcStreak(days: DayListItem[]): number {
  if (!days.length) return 0;

  const sorted = [...days].sort(
    (a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
  );

  let streak = 0;
  const today = new Date(todayISO() + 'T00:00:00');

  for (let i = 0; i < sorted.length; i++) {
    const dayDate = new Date(sorted[i].entry_date + 'T00:00:00');
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (dayDate.getTime() !== expectedDate.getTime()) {
      break;
    }

    if (sorted[i].tasks_completed > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function calcCompletionPercent(
  tasksCompleted: number,
  tasksTotal: number,
  prayersCompleted: number
): number {
  const total = tasksTotal + 5;
  if (total === 0) return 0;
  return Math.round(((tasksCompleted + prayersCompleted) / total) * 100);
}

export function colorTagToTailwind(tag?: ColorTag | string): string {
  const map: Record<string, string> = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-500',
  };
  return map[tag || ''] || 'bg-gray-500';
}

export function colorTagToBorder(tag?: ColorTag | string): string {
  const map: Record<string, string> = {
    green: 'border-green-500',
    blue: 'border-blue-500',
    amber: 'border-amber-500',
    red: 'border-red-500',
    purple: 'border-purple-500',
    gray: 'border-gray-500',
  };
  return map[tag || ''] || 'border-gray-500';
}

export function colorTagToText(tag?: ColorTag | string): string {
  const map: Record<string, string> = {
    green: 'text-green-500',
    blue: 'text-blue-500',
    amber: 'text-amber-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
    gray: 'text-gray-500',
  };
  return map[tag || ''] || 'text-gray-500';
}
