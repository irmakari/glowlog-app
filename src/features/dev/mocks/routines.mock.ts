import { TodayRoutineStepState, RoutineStepWithProduct } from '../../routines/types/routine.types';
import { MOCK_PRODUCTS } from './products.mock';

export const MOCK_MORNING_STEPS: TodayRoutineStepState[] = [
  {
    id: 'm-step-1',
    routineType: 'morning',
    title: 'Gentle Cleanser',
    productId: MOCK_PRODUCTS.productA.id,
    product: MOCK_PRODUCTS.productA,
    sortOrder: 0,
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm-step-2',
    routineType: 'morning',
    title: 'Vitamin C Serum',
    productId: MOCK_PRODUCTS.productE.id,
    product: MOCK_PRODUCTS.productE,
    isProductArchived: true,
    sortOrder: 1,
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm-step-3',
    routineType: 'morning',
    title: 'Moisturizer',
    productId: MOCK_PRODUCTS.productG.id,
    product: MOCK_PRODUCTS.productG,
    sortOrder: 2,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm-step-4',
    routineType: 'morning',
    title: 'SPF Sunscreen',
    productId: MOCK_PRODUCTS.productC.id,
    product: MOCK_PRODUCTS.productC,
    sortOrder: 3,
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_EVENING_STEPS: TodayRoutineStepState[] = [
  {
    id: 'e-step-1',
    routineType: 'evening',
    title: 'Double Cleanse',
    productId: MOCK_PRODUCTS.productA.id,
    product: MOCK_PRODUCTS.productA,
    sortOrder: 0,
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'e-step-2',
    routineType: 'evening',
    title: 'Niacinamide Treatment',
    productId: MOCK_PRODUCTS.productB.id,
    product: MOCK_PRODUCTS.productB,
    sortOrder: 1,
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'e-step-3',
    routineType: 'evening',
    title: 'Night Soothing Balm',
    productId: MOCK_PRODUCTS.productD.id,
    product: MOCK_PRODUCTS.productD,
    sortOrder: 2,
    completed: true,
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_EDITOR_STEPS: RoutineStepWithProduct[] = [
  {
    id: 'ed-1',
    routineType: 'morning',
    title: 'Cleanser',
    product: MOCK_PRODUCTS.productA,
    sortOrder: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ed-2',
    routineType: 'morning',
    title: 'Vitamin C',
    product: MOCK_PRODUCTS.productE,
    isProductArchived: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ed-3',
    routineType: 'morning',
    title: 'Facial Massage (Generic)',
    sortOrder: 2,
    createdAt: new Date().toISOString(),
  },
];
