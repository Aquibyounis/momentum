import sql from '../db/client';
import { toLocalDateString } from '../utils';

export async function toggleTask(id: number, entryDate: string) {
  const existing = await sql`
    SELECT is_completed FROM task_completions
    WHERE blueprint_task_id = ${id} AND entry_date = ${entryDate}
  `;

  if (existing.length === 0) {
    return null;
  }

  const newState = !existing[0].is_completed;

  const rows = await sql`
    UPDATE task_completions
    SET is_completed = ${newState},
        completed_at = ${newState ? new Date().toISOString() : null}
    WHERE blueprint_task_id = ${id} AND entry_date = ${entryDate}
    RETURNING *
  `;

  if (!rows[0]) return null;
  return { ...rows[0], entry_date: toLocalDateString(rows[0].entry_date) };
}
