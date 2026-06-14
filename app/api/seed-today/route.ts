import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { seedDay } from '@/lib/seeder';
import { getDayEntry, getDayTasks, getDayPrayers } from '@/lib/queries/day';
import { todayISO } from '@/lib/utils';
import quotes from '@/lib/quotes';

export async function GET() {
  try {
    const today = todayISO();
    await seedDay(today);

    const entry = await getDayEntry(today);
    if (!entry) {
      return NextResponse.json({ error: 'Failed to seed today' }, { status: 500 });
    }

    const tasks = await getDayTasks(today);
    const prayers = await getDayPrayers(today);
    const dayNumber = entry.day_number || 1;
    const quote = quotes[(dayNumber - 1) % quotes.length];

    return NextResponse.json({
      entry,
      tasks,
      prayers,
      dayNumber,
      quote,
    });
  } catch (err) {
    console.error('seed-today error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
