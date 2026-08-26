import { getDb } from './database/db';

export interface GlowLogBackupData {
  version: number;
  exportedAt: string;
  products: any[];
  routineSteps: any[];
  routineLogs: any[];
  waterLogs: any[];
  productUsageLogs: any[];
  settings: any[];
}

export const backupService = {
  async exportBackup(): Promise<string> {
    const db = await getDb();

    const products = await db.getAllAsync('SELECT * FROM products');
    const routineSteps = await db.getAllAsync('SELECT * FROM routine_steps');
    const routineLogs = await db.getAllAsync('SELECT * FROM routine_logs');
    const waterLogs = await db.getAllAsync('SELECT * FROM water_logs');
    const productUsageLogs = await db.getAllAsync('SELECT * FROM product_usage_logs');
    const settings = await db.getAllAsync('SELECT * FROM settings');

    const backupData: GlowLogBackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      products,
      routineSteps,
      routineLogs,
      waterLogs,
      productUsageLogs,
      settings,
    };

    return JSON.stringify(backupData, null, 2);
  },

  async importBackup(jsonString: string): Promise<boolean> {
    try {
      const backup: GlowLogBackupData = JSON.parse(jsonString);

      if (!backup.products || !backup.routineSteps || !backup.settings) {
        throw new Error('Invalid backup file structure.');
      }

      const db = await getDb();

      // Begin transaction cleanup & restore
      await db.execAsync('BEGIN TRANSACTION;');

      try {
        // Clear existing tables
        await db.execAsync('DELETE FROM product_usage_logs;');
        await db.execAsync('DELETE FROM routine_logs;');
        await db.execAsync('DELETE FROM routine_steps;');
        await db.execAsync('DELETE FROM products;');
        await db.execAsync('DELETE FROM water_logs;');
        await db.execAsync('DELETE FROM settings;');

        // Restore Products
        for (const p of backup.products) {
          await db.runAsync(
            `INSERT INTO products (id, name, brand, category, opened_at, pao_months, image_uri, notes, archived, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              p.id,
              p.name,
              p.brand || null,
              p.category,
              p.opened_at || null,
              p.pao_months || null,
              p.image_uri || null,
              p.notes || null,
              p.archived || 0,
              p.created_at,
              p.updated_at,
            ]
          );
        }

        // Restore Routine Steps
        for (const s of backup.routineSteps) {
          await db.runAsync(
            `INSERT INTO routine_steps (id, routine_type, title, product_id, sort_order, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              s.id,
              s.routine_type,
              s.title,
              s.product_id || null,
              s.sort_order || 0,
              s.created_at,
              s.updated_at || null,
            ]
          );
        }

        // Restore Routine Logs
        for (const rl of backup.routineLogs || []) {
          await db.runAsync(
            `INSERT INTO routine_logs (id, routine_step_id, date, completed, completed_at)
             VALUES (?, ?, ?, ?, ?)`,
            [rl.id, rl.routine_step_id, rl.date, rl.completed || 1, rl.completed_at]
          );
        }

        // Restore Water Logs
        for (const w of backup.waterLogs || []) {
          await db.runAsync(
            `INSERT INTO water_logs (id, date, glasses) VALUES (?, ?, ?)`,
            [w.id, w.date, w.glasses || 0]
          );
        }

        // Restore Product Usage Logs
        for (const u of backup.productUsageLogs || []) {
          await db.runAsync(
            `INSERT INTO product_usage_logs (id, product_id, date, used_at, source, source_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [u.id, u.product_id, u.date, u.used_at, u.source || 'routine', u.source_id || null]
          );
        }

        // Restore Settings
        for (const st of backup.settings || []) {
          await db.runAsync(
            `INSERT INTO settings (key, value) VALUES (?, ?)`,
            [st.key, st.value]
          );
        }

        await db.execAsync('COMMIT;');
        return true;
      } catch (err) {
        await db.execAsync('ROLLBACK;');
        throw err;
      }
    } catch (e: any) {
      console.error('Failed to import backup:', e);
      throw new Error(e?.message || 'Invalid backup data format.');
    }
  },
};
