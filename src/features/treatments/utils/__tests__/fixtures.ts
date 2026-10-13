import { Treatment } from '../../types/treatment.types';

export const makeTreatment = (overrides: Partial<Treatment> = {}): Treatment => ({
  id: 't1',
  name: 'Isotretinoin',
  kind: 'oral',
  activeKey: 'isotretinoin',
  frequency: 'daily',
  weekdays: [],
  times: ['08:00'],
  startDate: '2026-10-01',
  reminderEnabled: true,
  archived: false,
  createdAt: '2026-10-01T00:00:00.000Z',
  updatedAt: '2026-10-01T00:00:00.000Z',
  ...overrides,
});
