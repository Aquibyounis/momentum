import { NextRequest, NextResponse } from 'next/server';
import { bulkUpdateTasks, getAllActiveTasks } from '@/lib/queries/blueprint';
import { BlueprintTask, PhaseGroup } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.tasks || !Array.isArray(body.tasks)) {
      return NextResponse.json({ error: 'tasks array is required' }, { status: 400 });
    }

    await bulkUpdateTasks(body.tasks);

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
    console.error('blueprint/bulk POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
