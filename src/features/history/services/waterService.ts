import { getDb } from '../../../services/database/db';

export const waterService = {
  /**
   * Fetch saved water intake for a local date string (YYYY-MM-DD)
   */
  async getWaterForDate(dateStr: string): Promise<number> {
    const db = await getDb();
    const row = await db.getFirstAsync<{ glasses: number }>(
      `SELECT glasses FROM water_logs WHERE date = ?`,
      [dateStr]
    );
    return row?.glasses ?? 0;
  },

  /**
   * Set saved water intake for a local date string
   */
  async setWaterForDate(dateStr: string, glasses: number): Promise<number> {
    const db = await getDb();
    const safeGlasses = Math.max(0, glasses);
    const id = `water-${dateStr}`;

    await db.runAsync(
      `INSERT INTO water_logs (id, date, glasses)
       VALUES (?, ?, ?)
       ON CONFLICT(date) DO UPDATE SET glasses = ?`,
      [id, dateStr, safeGlasses, safeGlasses]
    );

    return safeGlasses;
  },

  /**
   * Increment water intake up to goal
   */
  async incrementWater(dateStr: string, goal: number = 8): Promise<number> {
    const db = await getDb();
    // Increment inside SQL: rapid taps would otherwise read the same value and lose increments
    await db.runAsync(
      `INSERT INTO water_logs (id, date, glasses)
       VALUES (?, ?, MIN(1, ?))
       ON CONFLICT(date) DO UPDATE SET
         glasses = CASE WHEN glasses < ? THEN glasses + 1 ELSE glasses END`,
      [`water-${dateStr}`, dateStr, goal, goal]
    );
    return this.getWaterForDate(dateStr);
  },

  /**
   * Decrement water intake down to 0
   */
  async decrementWater(dateStr: string): Promise<number> {
    const db = await getDb();
    await db.runAsync(
      `UPDATE water_logs SET glasses = MAX(glasses - 1, 0) WHERE date = ?`,
      [dateStr]
    );
    return this.getWaterForDate(dateStr);
  },

  /**
   * Average glasses per logged day within an inclusive date-key range (days with no log are skipped)
   */
  async getAverageGlasses(fromKey: string, toKey: string): Promise<number | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<{ avg: number | null }>(
      `SELECT AVG(glasses) as avg FROM water_logs WHERE date >= ? AND date <= ? AND glasses > 0`,
      [fromKey, toKey]
    );
    return row?.avg ?? null;
  },

  /**
   * Fetch water logs for a specific month (YYYY-MM-%)
   */
  async getWaterLogsForMonth(year: number, month: number): Promise<Record<string, number>> {
    const db = await getDb();
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const rows = await db.getAllAsync<{ date: string; glasses: number }>(
      `SELECT date, glasses FROM water_logs WHERE date LIKE ?`,
      [`${monthStr}-%`]
    );

    const map: Record<string, number> = {};
    rows.forEach((r) => {
      map[r.date] = r.glasses;
    });
    return map;
  },
};
