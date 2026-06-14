import sql from '../db/client';
import { toLocalDateString } from '../utils';

export async function getDayEntry(date: string) {
  const rows = await sql`
    SELECT * FROM daily_entries WHERE entry_date = ${date}
  `;
  if (!rows[0]) return null;
  return { ...rows[0], entry_date: toLocalDateString(rows[0].entry_date) };
}

export async function getDayTasks(date: string) {
  const rows = await sql`
    SELECT tc.*, bt.color_tag, bt.description as blueprint_description
    FROM task_completions tc
    LEFT JOIN blueprint_tasks bt ON tc.blueprint_task_id = bt.id
    WHERE tc.entry_date = ${date}
    ORDER BY bt.phase_order ASC, bt.sort_order ASC
  `;
  return rows.map(r => ({ ...r, entry_date: toLocalDateString(r.entry_date) }));
}

export async function getDayPrayers(date: string) {
  const rows = await sql`
    SELECT * FROM prayer_completions
    WHERE entry_date = ${date}
    ORDER BY
      CASE prayer_name
        WHEN 'Fajr' THEN 1
        WHEN 'Zuhr' THEN 2
        WHEN 'Asr' THEN 3
        WHEN 'Maghrib' THEN 4
        WHEN 'Isha' THEN 5
      END
  `;
  return rows.map(r => ({ ...r, entry_date: toLocalDateString(r.entry_date) }));
}

export async function updateDayNotes(date: string, notes: string) {
  await sql`
    UPDATE daily_entries SET notes = ${notes} WHERE entry_date = ${date}
  `;
}

export async function getAllDays() {
  const rows = await sql`
    SELECT
      de.entry_date,
      de.day_number,
      de.notes,
      (SELECT COUNT(*) FROM task_completions tc WHERE tc.entry_date = de.entry_date) as tasks_total,
      (SELECT COUNT(*) FROM task_completions tc WHERE tc.entry_date = de.entry_date AND tc.is_completed = true) as tasks_completed,
      (SELECT COUNT(*) FROM prayer_completions pc WHERE pc.entry_date = de.entry_date AND pc.is_completed = true) as prayers_completed
    FROM daily_entries de
    ORDER BY de.entry_date DESC
  `;
  return rows.map(r => ({
    ...r,
    entry_date: toLocalDateString(r.entry_date),
    tasks_total: parseInt(r.tasks_total as string, 10),
    tasks_completed: parseInt(r.tasks_completed as string, 10),
    prayers_completed: parseInt(r.prayers_completed as string, 10)
  }));
}
