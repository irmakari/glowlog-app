import { MonthlyHistory, MonthlyStats, DayHistorySummary } from '../../history/types/history.types';

const mockDays: Record<string, DayHistorySummary> = {
  '2026-08-01': { date: '2026-08-01', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-02': { date: '2026-08-02', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-03': { date: '2026-08-03', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 7, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-04': { date: '2026-08-04', status: 'partial', completedSteps: 4, totalSteps: 7, hydration: 5, hydrationGoal: 8, productsUsedCount: 2, isToday: false },
  '2026-08-05': { date: '2026-08-05', status: 'empty', completedSteps: 0, totalSteps: 7, hydration: 2, hydrationGoal: 8, productsUsedCount: 0, isToday: false },
  '2026-08-06': { date: '2026-08-06', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-07': { date: '2026-08-07', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-08': { date: '2026-08-08', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 6, hydrationGoal: 8, productsUsedCount: 3, isToday: false },
  '2026-08-09': { date: '2026-08-09', status: 'partial', completedSteps: 3, totalSteps: 7, hydration: 4, hydrationGoal: 8, productsUsedCount: 2, isToday: false },
  '2026-08-10': { date: '2026-08-10', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-11': { date: '2026-08-11', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-12': { date: '2026-08-12', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-13': { date: '2026-08-13', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-14': { date: '2026-08-14', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-15': { date: '2026-08-15', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-16': { date: '2026-08-16', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-17': { date: '2026-08-17', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-18': { date: '2026-08-18', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-19': { date: '2026-08-19', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-20': { date: '2026-08-20', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-21': { date: '2026-08-21', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-22': { date: '2026-08-22', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-23': { date: '2026-08-23', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-24': { date: '2026-08-24', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-25': { date: '2026-08-25', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false },
  '2026-08-26': { date: '2026-08-26', status: 'partial', completedSteps: 4, totalSteps: 7, hydration: 6, hydrationGoal: 8, productsUsedCount: 3, isToday: true },
  '2026-08-27': { date: '2026-08-27', status: 'future', completedSteps: 0, totalSteps: 7, hydration: 0, hydrationGoal: 8, productsUsedCount: 0, isToday: false },
  '2026-08-28': { date: '2026-08-28', status: 'future', completedSteps: 0, totalSteps: 7, hydration: 0, hydrationGoal: 8, productsUsedCount: 0, isToday: false },
  '2026-08-29': { date: '2026-08-29', status: 'future', completedSteps: 0, totalSteps: 7, hydration: 0, hydrationGoal: 8, productsUsedCount: 0, isToday: false },
  '2026-08-30': { date: '2026-08-30', status: 'future', completedSteps: 0, totalSteps: 7, hydration: 0, hydrationGoal: 8, productsUsedCount: 0, isToday: false },
  '2026-08-31': { date: '2026-08-31', status: 'future', completedSteps: 0, totalSteps: 7, hydration: 0, hydrationGoal: 8, productsUsedCount: 0, isToday: false },
};

export const MOCK_MONTHLY_HISTORY: MonthlyHistory = {
  year: 2026,
  month: 8,
  formattedMonth: 'August 2026',
  days: mockDays,
};

export const MOCK_MONTHLY_STATS: MonthlyStats = {
  routineConsistencyPercent: 84,
  averageHydration: 6.4,
  currentStreak: 6,
  bestStreak: 16,
  completedDays: 21,
  trackedDays: 25,
};
