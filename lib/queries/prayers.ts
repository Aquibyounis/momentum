import sql from '../db/client';
import { toLocalDateString } from '../utils';

const VALID_PRAYERS = ['Fajr', 'Zuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export function isValidPrayer(name: string): boolean {
  return VALID_PRAYERS.includes(name as typeof VALID_PRAYERS[number]);
}

export async function togglePrayer(name: string, entryDate: string) {
  if (!isValidPrayer(name)) {
    return null;
  }

  const existing = await sql`
    SELECT is_completed FROM prayer_completions
    WHERE prayer_name = ${name} AND entry_date = ${entryDate}
  `;

  if (existing.length === 0) {
    return null;
  }

  const newState = !existing[0].is_completed;

  const rows = await sql`
    UPDATE prayer_completions
    SET is_completed = ${newState},
        completed_at = ${newState ? new Date().toISOString() : null}
    WHERE prayer_name = ${name} AND entry_date = ${entryDate}
    RETURNING *
  `;

  if (!rows[0]) return null;
  return { ...rows[0], entry_date: toLocalDateString(rows[0].entry_date) };
}
