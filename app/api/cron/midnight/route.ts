import { NextRequest, NextResponse } from 'next/server';
import { seedDay } from '@/lib/seeder';
import { todayISO } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const expected = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = todayISO();
    await seedDay(today);

    return NextResponse.json({ seeded: true, date: today });
  } catch (err) {
    console.error('cron/midnight error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
