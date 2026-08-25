import { DailySummary } from '../../history/types/history.types';
import { MOCK_PRODUCTS } from './products.mock';

export const MOCK_DAILY_SUMMARY: DailySummary = {
  date: '2026-08-22',
  formattedDate: 'Saturday, August 22',
  morningSteps: [
    { id: 'ds-m-1', title: 'Foaming Facial Cleanser', completed: true, productName: 'CeraVe Foaming Cleanser' },
    { id: 'ds-m-2', title: 'Vitamin C Serum', completed: true, productName: 'Geek & Gorgeous C-Glow' },
    { id: 'ds-m-3', title: 'Moisturizer', completed: true, productName: 'CeraVe Daily Lotion' },
    { id: 'ds-m-4', title: 'SPF Sunscreen', completed: true, productName: 'Beauty of Joseon Relief Sun' },
  ],
  eveningSteps: [
    { id: 'ds-e-1', title: 'Double Cleanse', completed: true, productName: 'CeraVe Foaming Cleanser' },
    { id: 'ds-e-2', title: 'Niacinamide Treatment', completed: true, productName: 'The Ordinary Niacinamide' },
    { id: 'ds-e-3', title: 'Night Balm', completed: false, productName: 'La Roche-Posay Cicaplast' },
  ],
  hydration: 6,
  hydrationGoal: 8,
  productsUsed: [
    { id: 'u-1', productId: MOCK_PRODUCTS.productA.id, date: '2026-08-22', usedAt: '2026-08-22T08:00:00Z', product: MOCK_PRODUCTS.productA },
    { id: 'u-2', productId: MOCK_PRODUCTS.productB.id, date: '2026-08-22', usedAt: '2026-08-22T21:00:00Z', product: MOCK_PRODUCTS.productB },
    { id: 'u-3', productId: MOCK_PRODUCTS.productC.id, date: '2026-08-22', usedAt: '2026-08-22T08:15:00Z', product: MOCK_PRODUCTS.productC },
    { id: 'u-4', productId: MOCK_PRODUCTS.productG.id, date: '2026-08-22', usedAt: '2026-08-22T08:10:00Z', product: MOCK_PRODUCTS.productG },
  ],
};

export const MOCK_EMPTY_DAILY_SUMMARY: DailySummary = {
  date: '2026-08-05',
  formattedDate: 'Wednesday, August 5',
  morningSteps: [],
  eveningSteps: [],
  hydration: 0,
  hydrationGoal: 8,
  productsUsed: [],
};
