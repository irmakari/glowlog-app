import { Product } from '../../products/types/product.types';

export type RoutineType = 'morning' | 'evening';

export interface RoutineStep {
  id: string;
  routineType: RoutineType;
  title: string;
  productId?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface RoutineStepWithProduct extends RoutineStep {
  product?: Product; // domain product object (or undefined if unlinked / archived)
  isProductArchived?: boolean;
}

export interface RoutineLog {
  id: string;
  routineStepId: string;
  date: string; // YYYY-MM-DD local date
  completed: boolean;
  completedAt: string;
}

export interface CreateRoutineStepInput {
  routineType: RoutineType;
  title: string;
  productId?: string;
  sortOrder?: number;
}

export interface UpdateRoutineStepInput {
  title?: string;
  productId?: string;
  sortOrder?: number;
}

export interface TodayRoutineStepState extends RoutineStepWithProduct {
  completed: boolean;
}
