import { NextRequest, NextResponse } from 'next/server';
import { getAllActiveTasks, createTask } from '@/lib/queries/blueprint';
import { BlueprintTask, PhaseGroup } from '@/types';

export async function GET() {
  try {
    const tasks = await getAllActiveTasks();

    const phaseMap = new Map<string, PhaseGroup>();
    for (const task of tasks) {
      const key = task.phase_name || 'Uncategorized';
      if (!phaseMap.has(key)) {
        phaseMap.set(key, {
          phase_name: key,
          phase_order: task.phase_order || 0,
          tasks: [],
        });
      }
      phaseMap.get(key)!.tasks.push(task as unknown as BlueprintTask);
    }

    const phases = Array.from(phaseMap.values()).sort(
      (a, b) => a.phase_order - b.phase_order
    );

    return NextResponse.json({ phases });
  } catch (err) {
    console.error('blueprint GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const newTask = await createTask({
      time_label: body.time_label,
      title: body.title,
      description: body.description,
      phase_name: body.phase_name,
      phase_order: body.phase_order,
      sort_order: body.sort_order,
      color_tag: body.color_tag,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    console.error('blueprint POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
