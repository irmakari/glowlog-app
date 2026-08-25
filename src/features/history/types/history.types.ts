import { Product } from '../../products/types/product.types';

export type DayHistoryStatus = 'complete' | 'partial' | 'empty' | 'future';

export interface DayHistorySummary {
  date: string; // YYYY-MM-DD
  status: DayHistoryStatus;
  completedSteps: number;
  totalSteps: number;
  hydration: number;
  hydrationGoal: number;
  productsUsedCount: number;
  isToday: boolean;
}

export interface MonthlyHistory {
  year: number;
  month: number;
  formattedMonth: string;
  days: Record<string, DayHistorySummary>;
}

export interface MonthlyStats {
  routineConsistencyPercent: number;
  averageHydration: number;
  currentStreak: number;
  bestStreak: number;
  completedDays: number;
  trackedDays: number;
}

export interface ProductUsageItem {
  id: string;
  productId: string;
  date: string;
  usedAt: string;
  product?: Product;
}

export interface DailySummaryStepItem {
  id: string;
  title: string;
  completed: boolean;
  productName?: string;
  brand?: string;
  isProductArchived?: boolean;
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  formattedDate: string;
  morningSteps: DailySummaryStepItem[];
  eveningSteps: DailySummaryStepItem[];
  hydration: number;
  hydrationGoal: number;
  productsUsed: ProductUsageItem[];
}
