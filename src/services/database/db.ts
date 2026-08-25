import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('glowlog.db');
  }
  return dbInstance;
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

    CREATE INDEX IF NOT EXISTS idx_routine_logs_date ON routine_logs(date);
    CREATE INDEX IF NOT EXISTS idx_water_logs_date ON water_logs(date);
    CREATE INDEX IF NOT EXISTS idx_product_usage_logs_date ON product_usage_logs(date);
  `);

  // Safe columns migration for existing databases
  try {
    await db.execAsync(`ALTER TABLE product_usage_logs ADD COLUMN source TEXT DEFAULT 'routine';`);
  } catch (e) {
    // Column already exists
  }
  try {
    await db.execAsync(`ALTER TABLE product_usage_logs ADD COLUMN source_id TEXT;`);
  } catch (e) {
    // Column already exists
  }
  try {
    await db.execAsync(`ALTER TABLE routine_steps ADD COLUMN updated_at TEXT;`);
  } catch (e) {
    // Column already exists
  }

  // Check if routine steps exist, if not seed defaults
  const existingSteps = await db.getAllAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM routine_steps'
  );
  
  if (existingSteps[0]?.count === 0) {
    const now = new Date().toISOString();

    // Seed default Morning steps
    await db.runAsync(
      `INSERT INTO routine_steps (id, routine_type, title, sort_order, created_at, updated_at) VALUES 
       ('step-m-1', 'morning', 'Cleanser', 0, ?, ?),
       ('step-m-2', 'morning', 'Vitamin C', 1, ?, ?),
       ('step-m-3', 'morning', 'Moisturizer', 2, ?, ?),
       ('step-m-4', 'morning', 'SPF', 3, ?, ?)`,
      [now, now, now, now, now, now, now, now]
    );

    // Seed default Evening steps
    await db.runAsync(
      `INSERT INTO routine_steps (id, routine_type, title, sort_order, created_at, updated_at) VALUES 
       ('step-e-1', 'evening', 'Double Cleanse', 0, ?, ?),
       ('step-e-2', 'evening', 'Serum / Treatment', 1, ?, ?),
       ('step-e-3', 'evening', 'Night Cream', 2, ?, ?)`,
      [now, now, now, now, now, now]
    );
  }

  // Seed default settings if empty
  const existingSettings = await db.getAllAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM settings'
  );

  if (existingSettings[0]?.count === 0) {
    await db.runAsync(
      `INSERT INTO settings (key, value) VALUES 
       ('hydrationGoal', '8'),
       ('onboardingCompleted', 'false'),
       ('morningReminderEnabled', 'false'),
       ('eveningReminderEnabled', 'false')`
    );
  }
};
