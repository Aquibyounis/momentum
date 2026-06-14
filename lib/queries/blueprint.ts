import sql from '../db/client';

export async function getAllActiveTasks() {
  const rows = await sql`
    SELECT * FROM blueprint_tasks
    WHERE is_active = true
    ORDER BY phase_order ASC, sort_order ASC
  `;
  return rows;
}

export async function getAllTasksIncludingInactive() {
  const rows = await sql`
    SELECT * FROM blueprint_tasks
    ORDER BY phase_order ASC, sort_order ASC
  `;
  return rows;
}

export async function getTaskById(id: number) {
  const rows = await sql`
    SELECT * FROM blueprint_tasks WHERE id = ${id}
  `;
  return rows[0] || null;
}

export async function createTask(data: {
  time_label?: string;
  title: string;
  description?: string;
  phase_name?: string;
  phase_order?: number;
  sort_order?: number;
  color_tag?: string;
}) {
  const rows = await sql`
    INSERT INTO blueprint_tasks (time_label, title, description, phase_name, phase_order, sort_order, color_tag)
    VALUES (
      ${data.time_label || ''},
      ${data.title},
      ${data.description || ''},
      ${data.phase_name || 'Uncategorized'},
      ${data.phase_order || 0},
      ${data.sort_order || 0},
      ${data.color_tag || 'gray'}
    )
    RETURNING *
  `;
  return rows[0];
}

export async function updateTask(
  id: number,
  data: Record<string, unknown>
) {
  const allowedFields = [
    'time_label', 'title', 'description', 'phase_name',
    'phase_order', 'sort_order', 'color_tag', 'is_active'
  ];

  const updates: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates.push(`${field} = $${paramIndex}`);
      values.push(data[field]);
      paramIndex++;
    }
  }

  if (updates.length === 0) return null;

  updates.push(`updated_at = now()`);
  values.push(id);

  const query = `
    UPDATE blueprint_tasks
    SET ${updates.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `;

  const rows = await sql(query, values);
  return rows[0];
}

export async function softDeleteTask(id: number) {
  await sql`
    UPDATE blueprint_tasks
    SET is_active = false, updated_at = now()
    WHERE id = ${id}
  `;
}

export async function reorderTasks(
  tasks: { id: number; sort_order: number; phase_order: number; phase_name: string }[]
) {
  const promises = tasks.map((task) =>
    sql`
      UPDATE blueprint_tasks
      SET sort_order = ${task.sort_order},
          phase_order = ${task.phase_order},
          phase_name = ${task.phase_name},
          updated_at = now()
      WHERE id = ${task.id}
    `
  );
  await Promise.all(promises);
}

export async function bulkUpdateTasks(
  tasks: {
    id: number;
    time_label?: string;
    title?: string;
    description?: string;
    phase_name?: string;
    phase_order?: number;
    sort_order?: number;
    color_tag?: string;
    is_active?: boolean;
  }[]
) {
  const promises = tasks.map((task) =>
    sql`
      UPDATE blueprint_tasks
      SET time_label = ${task.time_label || ''},
          title = ${task.title || ''},
          description = ${task.description || ''},
          phase_name = ${task.phase_name || 'Uncategorized'},
          phase_order = ${task.phase_order || 0},
          sort_order = ${task.sort_order || 0},
          color_tag = ${task.color_tag || 'gray'},
          is_active = ${task.is_active !== false},
          updated_at = now()
      WHERE id = ${task.id}
      RETURNING *
    `
  );
  const results = await Promise.all(promises);
  return results.map((r) => r[0]);
}
