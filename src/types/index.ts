export type RoutineType = 'morning' | 'evening';

export interface Product {
  id: string;
  name: string;
  brand?: string;
  category: string;
  openedAt?: string; // YYYY-MM-DD
  paoMonths?: number;
  imageUri?: string;
  notes?: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineStep {
  id: string;
  routineType: RoutineType;
  title: string;
  productId?: string;
  sortOrder: number;
  createdAt: string;
}

export interface RoutineLog {
  id: string;
  routineStepId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt: string;
}

export interface WaterLog {
  id: string;
  date: string; // YYYY-MM-DD
  glasses: number;
}

export interface ProductUsageLog {
  id: string;
  productId: string;
  date: string; // YYYY-MM-DD
  usedAt: string;
}

export interface AppSettings {
  hydrationGoal: number;
  onboardingCompleted: boolean;
  morningReminderEnabled: boolean;
  morningReminderTime?: string;
  eveningReminderEnabled: boolean;
  eveningReminderTime?: string;
}

export interface GlowScoreBreakdown {
  score: number; // 0.0 to 10.0
  routineScore: number; // 0.0 to 7.0
  hydrationScore: number; // 0.0 to 2.0
  streakScore: number; // 0.0 to 1.0
  routinePercent: number; // 0 - 100
  hydrationPercent: number; // 0 - 100
  completedStepsCount: number;
  totalStepsCount: number;
}
