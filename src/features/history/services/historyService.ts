import { getDb } from '../../../services/database/db';
import { waterService } from './waterService';
import {
  MonthlyHistory,
  MonthlyStats,
  DailySummary,
  DayHistorySummary,
  DayHistoryStatus,
  ProductUsageItem,
  DailySummaryStepItem,
} from '../types/history.types';
import { formatMonthYear, formatHistoryDate, isFutureDateKey } from '../utils/calendar.utils';
import { calculateStreaks } from '../utils/streak.utils';
import { getLocalDateString } from '../../routines/utils/routineDate.utils';

export const historyService = {
  /**
   * Batch query history data for a given month (year, month 1-indexed)
   */
  async getMonthHistory(year: number, month: number): Promise<MonthlyHistory> {
    const db = await getDb();
    const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;

    // 1. Get total configured routine steps
    const totalStepsRow = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM routine_steps`
    );
    const totalConfiguredSteps = totalStepsRow?.count ?? 0;

    // 2. Batch fetch routine completion logs for month
    const routineLogs = await db.getAllAsync<{ date: string; step_id: string }>(
      `SELECT date, routine_step_id as step_id FROM routine_logs WHERE date LIKE ? AND completed = 1`,
      [`${monthPrefix}-%`]
    );

    // 3. Batch fetch water logs for month
    const waterLogs = await waterService.getWaterLogsForMonth(year, month);

    // 4. Batch fetch product usage counts for month
    const usageRows = await db.getAllAsync<{ date: string; usage_count: number }>(
      `SELECT date, COUNT(*) as usage_count FROM product_usage_logs WHERE date LIKE ? GROUP BY date`,
      [`${monthPrefix}-%`]
    );
    const usageMap: Record<string, number> = {};
    usageRows.forEach((r) => {
      usageMap[r.date] = r.usage_count;
    });

    // Group completed step counts by date
    const routineCompletedMap: Record<string, number> = {};
    routineLogs.forEach((r) => {
      routineCompletedMap[r.date] = (routineCompletedMap[r.date] || 0) + 1;
    });

    const daysInMonth = new Date(year, month, 0).getDate();
    const days: Record<string, DayHistorySummary> = {};
    const todayKey = getLocalDateString();

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dateKey = `${monthPrefix}-${String(dayNum).padStart(2, '0')}`;
      const completedSteps = routineCompletedMap[dateKey] || 0;
      const hydration = waterLogs[dateKey] || 0;
      const productsUsedCount = usageMap[dateKey] || 0;

      let status: DayHistoryStatus = 'empty';
      if (isFutureDateKey(dateKey)) {
        status = 'future';
      } else if (totalConfiguredSteps > 0 && completedSteps >= totalConfiguredSteps) {
        status = 'complete';
      } else if (completedSteps > 0) {
        status = 'partial';
      } else {
        status = 'empty';
      }

      days[dateKey] = {
        date: dateKey,
        status,
        completedSteps,
        totalSteps: totalConfiguredSteps,
        hydration,
        hydrationGoal: 8,
        productsUsedCount,
        isToday: dateKey === todayKey,
      };
    }

    return {
      year,
      month,
      formattedMonth: formatMonthYear(year, month),
      days,
    };
  },

  /**
   * Get monthly statistics for month
   */
  async getMonthlyStats(year: number, month: number): Promise<MonthlyStats> {
    const history = await this.getMonthHistory(year, month);
    const db = await getDb();

    // Fetch all unique completed dates from database history to compute real streaks
    const allCompletedRows = await db.getAllAsync<{ date: string }>(
      `SELECT DISTINCT date FROM routine_logs WHERE completed = 1 ORDER BY date ASC`
    );
    const completedDates = allCompletedRows.map((r) => r.date);
    const streaks = calculateStreaks(completedDates);

    const dayEntries = Object.values(history.days).filter((d) => !isFutureDateKey(d.date));
    const trackedDays = dayEntries.length;
    const completedDays = dayEntries.filter((d) => d.status === 'complete').length;

    const totalHydration = dayEntries.reduce((sum, d) => sum + d.hydration, 0);
    const averageHydration = trackedDays > 0 ? Math.round((totalHydration / trackedDays) * 10) / 10 : 0;
    const routineConsistencyPercent = trackedDays > 0 ? Math.round((completedDays / trackedDays) * 100) : 0;

    return {
      routineConsistencyPercent,
      averageHydration,
      currentStreak: streaks.currentStreak,
      bestStreak: streaks.bestStreak,
      completedDays,
      trackedDays,
    };
  },

  /**
   * Fetch full daily summary details for a single calendar date (YYYY-MM-DD)
   */
  async getDailySummary(dateKey: string): Promise<DailySummary> {
    const db = await getDb();

    // 1. Routine steps with products and completion state for dateKey
    const stepsWithProducts = await db.getAllAsync<{
      id: string;
      routine_type: string;
      title: string;
      product_id: string | null;
      prod_name: string | null;
      prod_brand: string | null;
      prod_archived: number | null;
      completed: number | null;
    }>(
      `
      SELECT 
        rs.id, rs.routine_type, rs.title, rs.product_id,
        p.name as prod_name, p.brand as prod_brand, p.archived as prod_archived,
        rl.completed
      FROM routine_steps rs
      LEFT JOIN products p ON rs.product_id = p.id
      LEFT JOIN routine_logs rl ON rs.id = rl.routine_step_id AND rl.date = ?
      ORDER BY rs.sort_order ASC
      `,
      [dateKey]
    );

    const morningSteps: DailySummaryStepItem[] = [];
    const eveningSteps: DailySummaryStepItem[] = [];

    stepsWithProducts.forEach((r) => {
      const item: DailySummaryStepItem = {
        id: r.id,
        title: r.title,
        completed: Boolean(r.completed),
        productName: r.prod_name ? `${r.prod_brand ? r.prod_brand + ' ' : ''}${r.prod_name}` : undefined,
        isProductArchived: Boolean(r.prod_archived),
      };

      if (r.routine_type === 'morning') {
        morningSteps.push(item);
      } else {
        eveningSteps.push(item);
      }
    });

    // 2. Hydration for dateKey
    const hydration = await waterService.getWaterForDate(dateKey);

    // 3. Products used on dateKey
    const usageRows = await db.getAllAsync<{
      id: string;
      product_id: string;
      date: string;
      used_at: string;
      prod_name: string;
      prod_brand: string | null;
      prod_category: string;
      prod_image_uri: string | null;
    }>(
      `
      SELECT 
        pul.id, pul.product_id, pul.date, pul.used_at,
        p.name as prod_name, p.brand as prod_brand, p.category as prod_category, p.image_uri as prod_image_uri
      FROM product_usage_logs pul
      JOIN products p ON pul.product_id = p.id
      WHERE pul.date = ?
      ORDER BY pul.used_at ASC
      `,
      [dateKey]
    );

    const productsUsed: ProductUsageItem[] = usageRows.map((r) => ({
      id: r.id,
      productId: r.product_id,
      date: r.date,
      usedAt: r.used_at,
      product: {
        id: r.product_id,
        name: r.prod_name,
        brand: r.prod_brand ?? undefined,
        category: r.prod_category,
        imageUri: r.prod_image_uri ?? undefined,
        archived: false,
        createdAt: r.used_at,
        updatedAt: r.used_at,
      },
    }));

    return {
      date: dateKey,
      formattedDate: formatHistoryDate(dateKey),
      morningSteps,
      eveningSteps,
      hydration,
      hydrationGoal: 8,
      productsUsed,
    };
  },
};
