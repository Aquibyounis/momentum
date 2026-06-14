import sql from './db/client';
import { runMigrations } from './db/migrate';
import { seedBlueprint } from './db/seed';

const PRAYERS = ['Fajr', 'Zuhr', 'Asr', 'Maghrib', 'Isha'] as const;

let migrated = false;

async function ensureMigrated() {
  if (migrated) return;
  try {
    await runMigrations();
    await seedBlueprint();
    migrated = true;
  } catch (err) {
    console.error('Migration/seed error:', err);
    throw err;
  }
}

export async function seedDay(date: string) {
  await ensureMigrated();

  const existing = await sql`
    SELECT id FROM daily_entries WHERE entry_date = ${date}
  `;

  if (existing.length > 0) {
    return null;
  }

  const countResult = await sql`SELECT COUNT(*) as count FROM daily_entries`;
  const dayNumber = parseInt(countResult[0].count as string, 10) + 1;

  await sql`
    INSERT INTO daily_entries (entry_date, day_number)
    VALUES (${date}, ${dayNumber})
  `;

  const activeTasks = await sql`
    SELECT id, time_label, title, phase_name, phase_order, sort_order
    FROM blueprint_tasks
    WHERE is_active = true
    ORDER BY phase_order ASC, sort_order ASC
  `;

  for (const task of activeTasks) {
    await sql`
      INSERT INTO task_completions (entry_date, blueprint_task_id, title_snapshot, time_snapshot, phase_snapshot, is_completed)
      VALUES (${date}, ${task.id}, ${task.title}, ${task.time_label}, ${task.phase_name}, false)
    `;
  }

  for (const prayer of PRAYERS) {
    await sql`
      INSERT INTO prayer_completions (entry_date, prayer_name, is_completed)
      VALUES (${date}, ${prayer}, false)
    `;
  }

  const snapshotJson = JSON.stringify(activeTasks);
  await sql`
    INSERT INTO blueprint_snapshots (snapshot_date, snapshot_json)
    VALUES (${date}, ${snapshotJson}::jsonb)
    ON CONFLICT (snapshot_date) DO NOTHING
  `;

  return { date, dayNumber };
}
