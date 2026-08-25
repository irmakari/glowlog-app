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
    const current = await this.getWaterForDate(dateStr);
    if (current >= goal) return current;
    return await this.setWaterForDate(dateStr, current + 1);
  },

  /**
   * Decrement water intake down to 0
   */
  async decrementWater(dateStr: string): Promise<number> {
    const current = await this.getWaterForDate(dateStr);
    if (current <= 0) return 0;
    return await this.setWaterForDate(dateStr, current - 1);
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
