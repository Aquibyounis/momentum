import { NextResponse } from 'next/server';
import { getAllDays } from '@/lib/queries/day';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const days = await getAllDays();
    return NextResponse.json({ days });
  } catch (err) {
    console.error('days GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
