import { NextRequest, NextResponse } from 'next/server';
import { toggleTask } from '@/lib/queries/tasks';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const body = await request.json();
    if (!body.entry_date) {
      return NextResponse.json({ error: 'entry_date is required' }, { status: 400 });
    }

    const result = await toggleTask(id, body.entry_date);
    if (!result) {
      return NextResponse.json({ error: 'Task completion not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('task toggle error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
