import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Cache the open promise so concurrent first callers share a single connection.
export const getDb = (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('glowlog.db').catch((err) => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
};

// Local YYYY-MM-DD (kept here to avoid a services -> features import)
const toLocalDateKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/**
 * First local date the user had GlowLog. Days before it are not counted as missed in stats.
 * Falls back to the earliest log for installs that predate the firstLaunchDate setting.
 */
export const getTrackingStartKey = async (): Promise<string> => {
  const db = await getDb();
  const row = await db.getFirstAsync<{ start: string | null }>(
    `SELECT MIN(d) as start FROM (
       SELECT value as d FROM settings WHERE key = 'firstLaunchDate'
       UNION ALL SELECT MIN(date) FROM routine_logs
       UNION ALL SELECT MIN(date) FROM water_logs WHERE glasses > 0
     ) WHERE d IS NOT NULL`
  );
  return row?.start ?? toLocalDateKey(new Date());
};

export const initDatabase = async (): Promise<void> => {
  const db = await getDb();

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      brand TEXT,
      category TEXT NOT NULL,
      opened_at TEXT,
      pao_months INTEGER,
      image_uri TEXT,
      notes TEXT,
      archived INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS routine_steps (
      id TEXT PRIMARY KEY NOT NULL,
      routine_type TEXT NOT NULL,
      title TEXT NOT NULL,
      product_id TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS routine_logs (
      id TEXT PRIMARY KEY NOT NULL,
      routine_step_id TEXT NOT NULL,
      date TEXT NOT NULL,
      completed INTEGER DEFAULT 1,
      completed_at TEXT NOT NULL,
      FOREIGN KEY (routine_step_id) REFERENCES routine_steps(id) ON DELETE CASCADE,
      UNIQUE(routine_step_id, date)
    );

    CREATE TABLE IF NOT EXISTS water_logs (
      id TEXT PRIMARY KEY NOT NULL,
      date TEXT UNIQUE NOT NULL,
      glasses INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS product_usage_logs (
      id TEXT PRIMARY KEY NOT NULL,
      product_id TEXT NOT NULL,
      date TEXT NOT NULL,
      used_at TEXT NOT NULL,
      source TEXT DEFAULT 'routine',
      source_id TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS treatments (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      kind TEXT NOT NULL,
      active_key TEXT NOT NULL DEFAULT 'other',
      dose_note TEXT,
      frequency TEXT NOT NULL DEFAULT 'daily',
      weekdays TEXT NOT NULL DEFAULT '[]',
      times TEXT NOT NULL DEFAULT '[]',
      start_date TEXT NOT NULL,
      end_date TEXT,
      reminder_enabled INTEGER DEFAULT 0,
      archived INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS treatment_logs (
      id TEXT PRIMARY KEY NOT NULL,
      treatment_id TEXT NOT NULL,
      date TEXT NOT NULL,
      slot TEXT NOT NULL,
      status TEXT NOT NULL,
      logged_at TEXT NOT NULL,
      FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE,
      UNIQUE(treatment_id, date, slot)
    );

    CREATE INDEX IF NOT EXISTS idx_routine_logs_date ON routine_logs(date);
    CREATE INDEX IF NOT EXISTS idx_treatment_logs_date ON treatment_logs(date);
    CREATE INDEX IF NOT EXISTS idx_water_logs_date ON water_logs(date);
    CREATE INDEX IF NOT EXISTS idx_product_usage_logs_date ON product_usage_logs(date);
  `);

  // Safe columns migration for existing databases
  try {
    await db.execAsync(`ALTER TABLE product_usage_logs ADD COLUMN source TEXT DEFAULT 'routine';`);
  } catch {
    // Column already exists
  }
  try {
    await db.execAsync(`ALTER TABLE product_usage_logs ADD COLUMN source_id TEXT;`);
  } catch {
    // Column already exists
  }
  try {
    await db.execAsync(`ALTER TABLE routine_steps ADD COLUMN updated_at TEXT;`);
  } catch {
    // Column already exists
  }
  try {
    // JSON array of ProductActive ids, used for treatment conflict warnings
    await db.execAsync(`ALTER TABLE products ADD COLUMN actives TEXT;`);
  } catch {
    // Column already exists
  }

  // Seed default settings (INSERT OR IGNORE keeps values the user already has)
  await db.runAsync(
    `INSERT OR IGNORE INTO settings (key, value) VALUES
     ('hydrationGoal', '8'),
     ('onboardingCompleted', 'false'),
     ('morningReminderEnabled', 'false'),
     ('eveningReminderEnabled', 'false')`
  );
  await db.runAsync(
    `INSERT OR IGNORE INTO settings (key, value) VALUES ('firstLaunchDate', ?)`,
    [toLocalDateKey(new Date())]
  );

  // Seed default routine steps only once, so a user who deletes every step doesn't get them back
  const seededRow = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM settings WHERE key = 'defaultRoutineSeeded'`
  );
  if (seededRow?.value === 'true') return;

  const existingSteps = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM routine_steps'
  );

  if ((existingSteps?.count ?? 0) === 0) {
    const now = new Date().toISOString();
    const titles = DEFAULT_ROUTINE_TITLES.tr;

    await db.runAsync(
      `INSERT INTO routine_steps (id, routine_type, title, sort_order, created_at, updated_at) VALUES
       ('step-m-1', 'morning', ?, 0, ?, ?),
       ('step-m-2', 'morning', ?, 1, ?, ?),
       ('step-m-3', 'morning', ?, 2, ?, ?),
       ('step-m-4', 'morning', ?, 3, ?, ?),
       ('step-e-1', 'evening', ?, 0, ?, ?),
       ('step-e-2', 'evening', ?, 1, ?, ?),
       ('step-e-3', 'evening', ?, 2, ?, ?)`,
      DEFAULT_ROUTINE_STEP_IDS.flatMap((id) => [titles[id], now, now])
    );
  }

  await db.runAsync(
    `INSERT INTO settings (key, value) VALUES ('defaultRoutineSeeded', 'true')
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  );
};

export const DEFAULT_ROUTINE_STEP_IDS = [
  'step-m-1', 'step-m-2', 'step-m-3', 'step-m-4',
  'step-e-1', 'step-e-2', 'step-e-3',
] as const;

type DefaultRoutineStepId = (typeof DEFAULT_ROUTINE_STEP_IDS)[number];

export const DEFAULT_ROUTINE_TITLES: Record<'en' | 'tr', Record<DefaultRoutineStepId, string>> = {
  en: {
    'step-m-1': 'Cleanser',
    'step-m-2': 'Vitamin C',
    'step-m-3': 'Moisturizer',
    'step-m-4': 'SPF',
    'step-e-1': 'Double Cleanse',
    'step-e-2': 'Serum / Treatment',
    'step-e-3': 'Night Cream',
  },
  tr: {
    'step-m-1': 'Temizleyici',
    'step-m-2': 'C Vitamini',
    'step-m-3': 'Nemlendirici',
    'step-m-4': 'Güneş Kremi',
    'step-e-1': 'Çift Aşamalı Temizlik',
    'step-e-2': 'Serum / Bakım',
    'step-e-3': 'Gece Kremi',
  },
};

/**
 * Renames untouched default routine steps into the given language.
 * Steps the user already renamed are left alone.
 */
export const localizeDefaultRoutineSteps = async (language: 'en' | 'tr'): Promise<void> => {
  const db = await getDb();
  const now = new Date().toISOString();
  for (const id of DEFAULT_ROUTINE_STEP_IDS) {
    await db.runAsync(
      `UPDATE routine_steps SET title = ?, updated_at = ? WHERE id = ? AND title IN (?, ?)`,
      [DEFAULT_ROUTINE_TITLES[language][id], now, id, DEFAULT_ROUTINE_TITLES.en[id], DEFAULT_ROUTINE_TITLES.tr[id]]
    );
  }
};
