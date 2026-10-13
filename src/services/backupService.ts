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
  // Added in version 2; missing from older backups
  treatments?: any[];
  treatmentLogs?: any[];
}

export const BACKUP_VERSION = 2;

export const backupService = {
  async exportBackup(): Promise<string> {
    const db = await getDb();

    const products = await db.getAllAsync('SELECT * FROM products');
    const routineSteps = await db.getAllAsync('SELECT * FROM routine_steps');
    const routineLogs = await db.getAllAsync('SELECT * FROM routine_logs');
    const waterLogs = await db.getAllAsync('SELECT * FROM water_logs');
    const productUsageLogs = await db.getAllAsync('SELECT * FROM product_usage_logs');
    const settings = await db.getAllAsync('SELECT * FROM settings');
    const treatments = await db.getAllAsync('SELECT * FROM treatments');
    const treatmentLogs = await db.getAllAsync('SELECT * FROM treatment_logs');

    const backupData: GlowLogBackupData = {
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      products,
      routineSteps,
      routineLogs,
      waterLogs,
      productUsageLogs,
      settings,
      treatments,
      treatmentLogs,
    };

    return JSON.stringify(backupData, null, 2);
  },

  async importBackup(jsonString: string): Promise<boolean> {
    try {
      const backup: GlowLogBackupData = JSON.parse(jsonString);

      if (
        !backup ||
        !Array.isArray(backup.products) ||
        !Array.isArray(backup.routineSteps) ||
        !Array.isArray(backup.settings) ||
        (backup.treatments !== undefined && !Array.isArray(backup.treatments)) ||
        (backup.treatmentLogs !== undefined && !Array.isArray(backup.treatmentLogs))
      ) {
        throw new Error('Invalid backup file structure.');
      }

      const db = await getDb();

      // Clear & restore atomically: any failure rolls back to the current data
      await db.withExclusiveTransactionAsync(async (txn) => {
        // Clear existing tables. Treatments go too: a restore replaces everything, even from a
        // version 1 backup that predates them.
        await txn.execAsync('DELETE FROM treatment_logs;');
        await txn.execAsync('DELETE FROM treatments;');
        await txn.execAsync('DELETE FROM product_usage_logs;');
        await txn.execAsync('DELETE FROM routine_logs;');
        await txn.execAsync('DELETE FROM routine_steps;');
        await txn.execAsync('DELETE FROM products;');
        await txn.execAsync('DELETE FROM water_logs;');
        await txn.execAsync('DELETE FROM settings;');

        // Restore Products
        for (const p of backup.products) {
          await txn.runAsync(
            `INSERT INTO products (id, name, brand, category, opened_at, pao_months, image_uri, notes, actives, archived, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              p.id,
              p.name,
              p.brand || null,
              p.category,
              p.opened_at || null,
              p.pao_months ?? null,
              p.image_uri || null,
              p.notes || null,
              p.actives || null,
              p.archived || 0,
              p.created_at,
              p.updated_at,
            ]
          );
        }

        // Restore Routine Steps
        for (const s of backup.routineSteps) {
          await txn.runAsync(
            `INSERT INTO routine_steps (id, routine_type, title, product_id, sort_order, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              s.id,
              s.routine_type,
              s.title,
              s.product_id || null,
              s.sort_order ?? 0,
              s.created_at,
              s.updated_at || null,
            ]
          );
        }

        // Restore Routine Logs
        for (const rl of backup.routineLogs || []) {
          await txn.runAsync(
            `INSERT INTO routine_logs (id, routine_step_id, date, completed, completed_at)
             VALUES (?, ?, ?, ?, ?)`,
            [rl.id, rl.routine_step_id, rl.date, rl.completed ?? 1, rl.completed_at]
          );
        }

        // Restore Water Logs
        for (const w of backup.waterLogs || []) {
          await txn.runAsync(
            `INSERT INTO water_logs (id, date, glasses) VALUES (?, ?, ?)`,
            [w.id, w.date, w.glasses || 0]
          );
        }

        // Restore Product Usage Logs
        for (const u of backup.productUsageLogs || []) {
          await txn.runAsync(
            `INSERT INTO product_usage_logs (id, product_id, date, used_at, source, source_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [u.id, u.product_id, u.date, u.used_at, u.source || 'routine', u.source_id || null]
          );
        }

        // Restore Treatments
        for (const tr of backup.treatments || []) {
          await txn.runAsync(
            `INSERT INTO treatments (id, name, kind, active_key, dose_note, frequency, weekdays, times, start_date, end_date, reminder_enabled, archived, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              tr.id,
              tr.name,
              tr.kind,
              tr.active_key || 'other',
              tr.dose_note || null,
              tr.frequency || 'daily',
              tr.weekdays || '[]',
              tr.times || '[]',
              tr.start_date,
              tr.end_date || null,
              tr.reminder_enabled || 0,
              tr.archived || 0,
              tr.created_at,
              tr.updated_at,
            ]
          );
        }

        // Restore Treatment Logs
        for (const tl of backup.treatmentLogs || []) {
          await txn.runAsync(
            `INSERT INTO treatment_logs (id, treatment_id, date, slot, status, logged_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [tl.id, tl.treatment_id, tl.date, tl.slot, tl.status, tl.logged_at]
          );
        }

        // Restore Settings
        for (const st of backup.settings || []) {
          await txn.runAsync(
            `INSERT INTO settings (key, value) VALUES (?, ?)`,
            [st.key, st.value]
          );
        }

      });
      return true;
    } catch (e: any) {
      console.error('Failed to import backup:', e);
      throw new Error(e?.message || 'Invalid backup data format.');
    }
  },
};
