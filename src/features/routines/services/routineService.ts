import { getDb } from '../../../services/database/db';
import {
  RoutineType,
  RoutineStep,
  RoutineStepWithProduct,
  RoutineLog,
  CreateRoutineStepInput,
  UpdateRoutineStepInput,
} from '../types/routine.types';

interface RoutineStepRow {
  id: string;
  routine_type: string;
  title: string;
  product_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string | null;

  // Joined product fields
  prod_name?: string | null;
  prod_brand?: string | null;
  prod_category?: string | null;
  prod_opened_at?: string | null;
  prod_pao_months?: number | null;
  prod_image_uri?: string | null;
  prod_notes?: string | null;
  prod_archived?: number | null;
  prod_created_at?: string | null;
  prod_updated_at?: string | null;
}

export const routineService = {
  /**
   * Fetch routine steps with joined product details for a routine type ('morning' | 'evening')
   */
  async getRoutineStepsWithProducts(routineType: RoutineType): Promise<RoutineStepWithProduct[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<RoutineStepRow>(
      `
      SELECT 
        rs.id, rs.routine_type, rs.title, rs.product_id, rs.sort_order, rs.created_at, rs.updated_at,
        p.name as prod_name, p.brand as prod_brand, p.category as prod_category,
        p.opened_at as prod_opened_at, p.pao_months as prod_pao_months, p.image_uri as prod_image_uri,
        p.notes as prod_notes, p.archived as prod_archived, p.created_at as prod_created_at, p.updated_at as prod_updated_at
      FROM routine_steps rs
      LEFT JOIN products p ON rs.product_id = p.id
      WHERE rs.routine_type = ?
      ORDER BY rs.sort_order ASC, rs.created_at ASC
      `,
      [routineType]
    );

    return rows.map((row) => {
      const step: RoutineStepWithProduct = {
        id: row.id,
        routineType: row.routine_type as RoutineType,
        title: row.title,
        productId: row.product_id ?? undefined,
        sortOrder: row.sort_order,
        createdAt: row.created_at,
        updatedAt: row.updated_at ?? undefined,
      };

      if (row.product_id && row.prod_name) {
        step.product = {
          id: row.product_id,
          name: row.prod_name,
          brand: row.prod_brand ?? undefined,
          category: row.prod_category || 'other',
          openedAt: row.prod_opened_at ?? undefined,
          paoMonths: row.prod_pao_months ?? undefined,
          imageUri: row.prod_image_uri ?? undefined,
          notes: row.prod_notes ?? undefined,
          archived: Boolean(row.prod_archived),
          createdAt: row.prod_created_at || row.created_at,
          updatedAt: row.prod_updated_at || row.created_at,
        };
        step.isProductArchived = Boolean(row.prod_archived);
      }

      return step;
    });
  },

  /**
   * Create a new routine step
   */
  async createRoutineStep(input: CreateRoutineStepInput): Promise<RoutineStepWithProduct> {
    const db = await getDb();
    const now = new Date().toISOString();
    const id = `step-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    let sortOrder = input.sortOrder;
    if (sortOrder === undefined) {
      const maxRow = await db.getFirstAsync<{ max_order: number | null }>(
        `SELECT MAX(sort_order) as max_order FROM routine_steps WHERE routine_type = ?`,
        [input.routineType]
      );
      sortOrder = (maxRow?.max_order ?? -1) + 1;
    }

    await db.runAsync(
      `INSERT INTO routine_steps (id, routine_type, title, product_id, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, input.routineType, input.title, input.productId || null, sortOrder, now, now]
    );

    const steps = await this.getRoutineStepsWithProducts(input.routineType);
    const created = steps.find((s) => s.id === id);
    if (!created) throw new Error('Failed to retrieve newly created routine step');
    return created;
  },

  /**
   * Update an existing routine step
   */
  async updateRoutineStep(id: string, input: UpdateRoutineStepInput): Promise<void> {
    const db = await getDb();
    const now = new Date().toISOString();

    const updates: string[] = ['updated_at = ?'];
    const params: any[] = [now];

    if (input.title !== undefined) {
      updates.push('title = ?');
      params.push(input.title);
    }
    if (input.productId !== undefined) {
      updates.push('product_id = ?');
      params.push(input.productId || null);
    }
    if (input.sortOrder !== undefined) {
      updates.push('sort_order = ?');
      params.push(input.sortOrder);
    }

    params.push(id);
    await db.runAsync(
      `UPDATE routine_steps SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
  },

  /**
   * Delete a routine step
   */
  async deleteRoutineStep(id: string): Promise<void> {
    const db = await getDb();
    await db.runAsync(`DELETE FROM routine_steps WHERE id = ?`, [id]);
  },

  /**
   * Reorder routine steps for a given type
   */
  async reorderRoutineSteps(routineType: RoutineType, orderedIds: string[]): Promise<void> {
    const db = await getDb();
    const now = new Date().toISOString();

    for (let index = 0; index < orderedIds.length; index++) {
      const stepId = orderedIds[index];
      await db.runAsync(
        `UPDATE routine_steps SET sort_order = ?, updated_at = ? WHERE id = ? AND routine_type = ?`,
        [index, now, stepId, routineType]
      );
    }
  },

  /**
   * Fetch completion logs for a given local date string (YYYY-MM-DD)
   */
  async getRoutineLogsForDate(dateStr: string): Promise<RoutineLog[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<{
      id: string;
      routine_step_id: string;
      date: string;
      completed: number;
      completed_at: string;
    }>(
      `SELECT * FROM routine_logs WHERE date = ? AND completed = 1`,
      [dateStr]
    );

    return rows.map((r) => ({
      id: r.id,
      routineStepId: r.routine_step_id,
      date: r.date,
      completed: Boolean(r.completed),
      completedAt: r.completed_at,
    }));
  },

  /**
   * Toggle routine step completion for date (YYYY-MM-DD) and update product usage logs idempotently
   */
  async setRoutineStepCompleted(
    routineStepId: string,
    productId: string | undefined,
    dateStr: string,
    completed: boolean
  ): Promise<void> {
    const db = await getDb();
    const now = new Date().toISOString();

    if (completed) {
      // 1. Save routine completion (UPSERT into routine_logs)
      const logId = `log-${routineStepId}-${dateStr}`;
      await db.runAsync(
        `INSERT INTO routine_logs (id, routine_step_id, date, completed, completed_at)
         VALUES (?, ?, ?, 1, ?)
         ON CONFLICT(routine_step_id, date) DO UPDATE SET completed = 1, completed_at = ?`,
        [logId, routineStepId, dateStr, now, now]
      );

      // 2. Log product usage if linked product exists (Idempotent: prevent duplicate usage logs)
      if (productId) {
        const existingUsage = await db.getFirstAsync<{ id: string }>(
          `SELECT id FROM product_usage_logs WHERE product_id = ? AND date = ? AND source = 'routine' AND source_id = ?`,
          [productId, dateStr, routineStepId]
        );

        if (!existingUsage) {
          const usageLogId = `usg-${routineStepId}-${dateStr}`;
          await db.runAsync(
            `INSERT INTO product_usage_logs (id, product_id, date, used_at, source, source_id)
             VALUES (?, ?, ?, ?, 'routine', ?)`,
            [usageLogId, productId, dateStr, now, routineStepId]
          );
        }
      }
    } else {
      // 1. Remove/unmark routine completion
      await db.runAsync(
        `DELETE FROM routine_logs WHERE routine_step_id = ? AND date = ?`,
        [routineStepId, dateStr]
      );

      // 2. Remove automatic product usage log for this routine step
      if (productId) {
        await db.runAsync(
          `DELETE FROM product_usage_logs WHERE product_id = ? AND date = ? AND source = 'routine' AND source_id = ?`,
          [productId, dateStr, routineStepId]
        );
      }
    }
  },

  /**
   * Fetch all unique dates with completed routine logs for streak calculations
   */
  async getAllCompletedDates(): Promise<string[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<{ date: string }>(
      `SELECT DISTINCT date FROM routine_logs WHERE completed = 1 ORDER BY date DESC`
    );
    return rows.map((r) => r.date);
  },
};
