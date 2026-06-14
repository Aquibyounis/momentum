import { NextRequest, NextResponse } from 'next/server';
import { updateTask, softDeleteTask } from '@/lib/queries/blueprint';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const body = await request.json();
    const result = await updateTask(id, body);

    if (!result) {
      return NextResponse.json({ error: 'No fields to update or task not found' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('blueprint/[id] PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    await softDeleteTask(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('blueprint/[id] DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
