import { NextRequest, NextResponse } from 'next/server';
import { reorderTasks } from '@/lib/queries/blueprint';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.tasks || !Array.isArray(body.tasks)) {
      return NextResponse.json({ error: 'tasks array is required' }, { status: 400 });
    }

    await reorderTasks(body.tasks);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('blueprint/reorder POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
