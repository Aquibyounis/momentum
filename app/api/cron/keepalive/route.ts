import { NextResponse } from 'next/server';
import sql from '@/lib/db/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await sql`SELECT 1`;
    return NextResponse.json({ status: 'awake' });
  } catch (error) {
    console.error('Keep-alive failed:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
