import { getDb } from '../../../services/database/db';
import { waterService } from './waterService';
import { getLocalDateString } from '../../routines/utils/routineDate.utils';
import { calculateGlowScore } from '../../../utils/glowScore';

export interface DailyHydrationPoint {
  day: number;
  dateKey: string;
  glasses: number;
  goal: number;
}

export interface TopProductItem {
  productId: string;
  name: string;
  brand?: string;
  category?: string;
  usageCount: number;
}

export interface DailyBreakdownItem {
  day: number;
  dateKey: string;
  formattedDate: string; // e.g. "Aug 25, Tue"
  status: 'complete' | 'partial' | 'empty' | 'future';
  completedSteps: number;
  totalSteps: number;
  hydration: number;
  hydrationGoal: number;
  productsCount: number;
  glowScore: number;
}

export interface MonthlyAnalyticsData {
  year: number;
  month: number;
  formattedMonth: string;
  totalDaysInMonth: number;
  trackedDays: number;
  completedDays: number;
  partialDays: number;
  emptyDays: number;
  morningPercent: number;
  eveningPercent: number;
  averageHydration: number;
  dailyHydration: DailyHydrationPoint[];
  topProducts: TopProductItem[];
  dailyBreakdown: DailyBreakdownItem[];
}

export const monthlyAnalyticsService = {
  async getMonthlyAnalytics(year: number, month: number): Promise<MonthlyAnalyticsData> {
    const db = await getDb();
    const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
    const daysInMonth = new Date(year, month, 0).getDate();
    const todayKey = getLocalDateString();

    // 1. Water logs for month
    const waterLogs = await waterService.getWaterLogsForMonth(year, month);
    const dailyHydration: DailyHydrationPoint[] = [];

    let totalWaterSum = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${monthPrefix}-${String(day).padStart(2, '0')}`;
      const glasses = waterLogs[dateKey] || 0;
      totalWaterSum += glasses;
      dailyHydration.push({
        day,
        dateKey,
        glasses,
        goal: 8,
      });
    }

    // 2. Routine completion breakdown for Morning vs Evening
    const routineRows = await db.getAllAsync<{
      date: string;
      routine_type: string;
      step_count: number;
    }>(
      `
      SELECT rl.date, rs.routine_type, COUNT(*) as step_count
      FROM routine_logs rl
      JOIN routine_steps rs ON rl.routine_step_id = rs.id
      WHERE rl.date LIKE ? AND rl.completed = 1
      GROUP BY rl.date, rs.routine_type
      `,
      [`${monthPrefix}-%`]
    );

    const morningStepCountRow = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM routine_steps WHERE routine_type = 'morning'`
    );
    const eveningStepCountRow = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM routine_steps WHERE routine_type = 'evening'`
    );

    const totalMorningStepsConfigured = morningStepCountRow?.count ?? 0;
    const totalEveningStepsConfigured = eveningStepCountRow?.count ?? 0;
    const totalStepsConfigured = totalMorningStepsConfigured + totalEveningStepsConfigured;

    let morningCompletedSum = 0;
    let eveningCompletedSum = 0;
    const dateCompletedMap: Record<string, number> = {};

    routineRows.forEach((r) => {
      dateCompletedMap[r.date] = (dateCompletedMap[r.date] || 0) + r.step_count;
      if (r.routine_type === 'morning') {
        morningCompletedSum += r.step_count;
      } else {
        eveningCompletedSum += r.step_count;
      }
    });

    // 3. Product usage count by date
    const usageRows = await db.getAllAsync<{ date: string; usage_count: number }>(
      `SELECT date, COUNT(*) as usage_count FROM product_usage_logs WHERE date LIKE ? GROUP BY date`,
      [`${monthPrefix}-%`]
    );
    const usageMap: Record<string, number> = {};
    usageRows.forEach((r) => {
      usageMap[r.date] = r.usage_count;
    });

    let completedDays = 0;
    let partialDays = 0;
    let emptyDays = 0;
    let trackedDays = 0;

    const dailyBreakdown: DailyBreakdownItem[] = [];

    const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekdayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${monthPrefix}-${String(day).padStart(2, '0')}`;
      const completedSteps = dateCompletedMap[dateKey] || 0;
      const hydration = waterLogs[dateKey] || 0;
      const productsCount = usageMap[dateKey] || 0;

      const dateObj = new Date(year, month - 1, day);
      const weekdayStr = weekdayShortNames[dateObj.getDay()];
      const formattedDate = `${monthShortNames[month - 1]} ${day}, ${weekdayStr}`;

      const isFuture = dateKey > todayKey;

      let status: 'complete' | 'partial' | 'empty' | 'future' = 'empty';
      if (isFuture) {
        status = 'future';
      } else if (totalStepsConfigured > 0 && completedSteps >= totalStepsConfigured) {
        status = 'complete';
        completedDays++;
        trackedDays++;
      } else if (completedSteps > 0) {
        status = 'partial';
        partialDays++;
        trackedDays++;
      } else {
        status = 'empty';
        emptyDays++;
        trackedDays++;
      }

      const glowBreakdown = calculateGlowScore({
        completedStepsCount: completedSteps,
        totalStepsCount: totalStepsConfigured,
        currentHydration: hydration,
        hydrationGoal: 8,
        streakDays: 1,
      });

      dailyBreakdown.push({
        day,
        dateKey,
        formattedDate,
        status,
        completedSteps,
        totalSteps: totalStepsConfigured,
        hydration,
        hydrationGoal: 8,
        productsCount,
        glowScore: glowBreakdown.score,
      });
    }

    const morningPercent =
      trackedDays > 0 && totalMorningStepsConfigured > 0
        ? Math.min(100, Math.round((morningCompletedSum / (totalMorningStepsConfigured * trackedDays)) * 100))
        : 0;

    const eveningPercent =
      trackedDays > 0 && totalEveningStepsConfigured > 0
        ? Math.min(100, Math.round((eveningCompletedSum / (totalEveningStepsConfigured * trackedDays)) * 100))
        : 0;

    const averageHydration = trackedDays > 0 ? Math.round((totalWaterSum / trackedDays) * 10) / 10 : 0;

    // 4. Top Products Used this month
    const topProductRows = await db.getAllAsync<{
      product_id: string;
      prod_name: string;
      prod_brand: string | null;
      prod_category: string | null;
      usage_count: number;
    }>(
      `
      SELECT pul.product_id, p.name as prod_name, p.brand as prod_brand, p.category as prod_category, COUNT(*) as usage_count
      FROM product_usage_logs pul
      JOIN products p ON pul.product_id = p.id
      WHERE pul.date LIKE ?
      GROUP BY pul.product_id
      ORDER BY usage_count DESC
      LIMIT 5
      `,
      [`${monthPrefix}-%`]
    );

    const topProducts: TopProductItem[] = topProductRows.map((r) => ({
      productId: r.product_id,
      name: r.prod_name,
      brand: r.prod_brand ?? undefined,
      category: r.prod_category ?? 'Skincare',
      usageCount: r.usage_count,
    }));

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const formattedMonth = `${monthNames[month - 1]} ${year}`;

    return {
      year,
      month,
      formattedMonth,
      totalDaysInMonth: daysInMonth,
      trackedDays,
      completedDays,
      partialDays,
      emptyDays,
      morningPercent,
      eveningPercent,
      averageHydration,
      dailyHydration,
      topProducts,
      dailyBreakdown,
    };
  },
};
