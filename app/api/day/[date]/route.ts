import { NextRequest, NextResponse } from 'next/server';
import { getDayEntry, getDayTasks, getDayPrayers, updateDayNotes } from '@/lib/queries/day';
import quotes from '@/lib/quotes';

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const { date } = params;
    const entry = await getDayEntry(date);

    if (!entry) {
      return NextResponse.json({ error: 'Day not found' }, { status: 404 });
    }

    const tasks = await getDayTasks(date);
    const prayers = await getDayPrayers(date);
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
    console.error('day/[date] GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const { date } = params;
    const body = await request.json();

    if (typeof body.notes !== 'string') {
      return NextResponse.json({ error: 'notes must be a string' }, { status: 400 });
    }

    await updateDayNotes(date, body.notes);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('day/[date] PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
