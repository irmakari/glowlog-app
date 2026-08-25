import { RoutineType } from '../types';

export interface TodayRoutineItemData {
  id: string;
  routineType: RoutineType;
  title: string;
  productName?: string;
  brand?: string;
  completed: boolean;
}

export interface TodayMockData {
  formattedDate: string;
  userGreetingName?: string;
  morningSteps: TodayRoutineItemData[];
  eveningSteps: TodayRoutineItemData[];
  hydration: {
    current: number;
    goal: number;
  };
  streakDays: number;
  productAlert?: {
    id: string;
    title: string;
    message: string;
    actionText: string;
    productName: string;
  };
}

export const MOCK_TODAY_DATA: TodayMockData = {
  formattedDate: 'Tuesday, August 25',
  userGreetingName: undefined, // "Good morning ✨" without hardcoded user name
  morningSteps: [
    {
      id: 'm-1',
      routineType: 'morning',
      title: 'Cleanser',
      productName: 'CeraVe Foaming Cleanser',
      brand: 'CeraVe',
      completed: true,
    },
    {
      id: 'm-2',
      routineType: 'morning',
      title: 'Vitamin C',
      productName: 'Geek & Gorgeous C-Glow',
      brand: 'Geek & Gorgeous',
      completed: true,
    },
    {
      id: 'm-3',
      routineType: 'morning',
      title: 'Moisturizer',
      productName: 'CeraVe Daily Lotion',
      brand: 'CeraVe',
      completed: false,
    },
    {
      id: 'm-4',
      routineType: 'morning',
      title: 'SPF',
      productName: 'Beauty of Joseon SPF 50+',
      brand: 'Beauty of Joseon',
      completed: false,
    },
  ],
  eveningSteps: [
    {
      id: 'e-1',
      routineType: 'evening',
      title: 'Double Cleanse',
      productName: 'Beauty of Joseon Cleansing Balm',
      brand: 'Beauty of Joseon',
      completed: true,
    },
    {
      id: 'e-2',
      routineType: 'evening',
      title: 'Serum / Treatment',
      productName: 'The Ordinary Niacinamide 10%',
      brand: 'The Ordinary',
      completed: false,
    },
    {
      id: 'e-3',
      routineType: 'evening',
      title: 'Night Cream',
      productName: 'La Roche-Posay Cicaplast B5',
      brand: 'La Roche-Posay',
      completed: false,
    },
  ],
  hydration: {
    current: 5,
    goal: 8,
  },
  streakDays: 6,
  productAlert: {
    id: 'alert-1',
    title: 'Shelf check 🧴',
    message: 'Your mascara has been open for 5 months.',
    actionText: 'View product',
    productName: 'Maybelline Lash Sensational',
  },
};
