import sql from './client';

export async function runMigrations() {
  await sql`
    CREATE TABLE IF NOT EXISTS blueprint_tasks (
      id              SERIAL PRIMARY KEY,
      time_label      VARCHAR(15),
      title           TEXT NOT NULL,
      description     TEXT,
      phase_name      VARCHAR(100),
      phase_order     INTEGER DEFAULT 0,
      sort_order      INTEGER DEFAULT 0,
      color_tag       VARCHAR(20),
      is_active       BOOLEAN DEFAULT true,
      created_at      TIMESTAMPTZ DEFAULT now(),
      updated_at      TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS daily_entries (
      id              SERIAL PRIMARY KEY,
      entry_date      DATE NOT NULL UNIQUE,
      day_number      INTEGER,
      notes           TEXT,
      created_at      TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS task_completions (
      id                  SERIAL PRIMARY KEY,
      entry_date          DATE NOT NULL,
      blueprint_task_id   INTEGER REFERENCES blueprint_tasks(id) ON DELETE CASCADE,
      title_snapshot      TEXT,
      time_snapshot       VARCHAR(15),
      phase_snapshot      VARCHAR(100),
      is_completed        BOOLEAN DEFAULT false,
      completed_at        TIMESTAMPTZ,
      UNIQUE(entry_date, blueprint_task_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS prayer_completions (
      id              SERIAL PRIMARY KEY,
      entry_date      DATE NOT NULL,
      prayer_name     VARCHAR(20) NOT NULL,
      is_completed    BOOLEAN DEFAULT false,
      completed_at    TIMESTAMPTZ,
      UNIQUE(entry_date, prayer_name)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS blueprint_snapshots (
      id              SERIAL PRIMARY KEY,
      snapshot_date   DATE NOT NULL UNIQUE,
      snapshot_json   JSONB NOT NULL,
      created_at      TIMESTAMPTZ DEFAULT now()
    )
  `;
}
