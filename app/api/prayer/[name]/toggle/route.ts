import { NextRequest, NextResponse } from 'next/server';
import { togglePrayer, isValidPrayer } from '@/lib/queries/prayers';

export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params;
    if (!isValidPrayer(name)) {
      return NextResponse.json(
        { error: 'Invalid prayer name. Must be one of: Fajr, Zuhr, Asr, Maghrib, Isha' },
        { status: 400 }
      );
    }

    const body = await request.json();
    if (!body.entry_date) {
      return NextResponse.json({ error: 'entry_date is required' }, { status: 400 });
    }

    const result = await togglePrayer(name, body.entry_date);
    if (!result) {
      return NextResponse.json({ error: 'Prayer completion not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('prayer toggle error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
