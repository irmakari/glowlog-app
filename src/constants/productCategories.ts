import { Colors } from './colors';

export interface ProductCategoryOption {
  id: string;
  label: string;
  color: string;
  icon: string;
}

export const PRODUCT_CATEGORIES: ProductCategoryOption[] = [
  { id: 'cleanser', label: 'Cleanser', color: Colors.softBlue, icon: 'sparkles' },
  { id: 'toner', label: 'Toner', color: Colors.softLilac, icon: 'water' },
  { id: 'serum', label: 'Serum', color: Colors.pink, icon: 'flask' },
  { id: 'moisturizer', label: 'Moisturizer', color: Colors.sageGreen, icon: 'leaf' },
  { id: 'sunscreen', label: 'Sunscreen', color: Colors.butterYellow, icon: 'sunny' },
  { id: 'eye_care', label: 'Eye Care', color: Colors.softPeach, icon: 'eye' },
  { id: 'mask', label: 'Mask', color: Colors.softLilac, icon: 'happy' },
  { id: 'makeup', label: 'Makeup', color: Colors.pink, icon: 'color-palette' },
  { id: 'other', label: 'Other', color: Colors.mutedGray, icon: 'cube' },
];

export const PAO_OPTIONS = [
  { label: '3 months', value: 3 },
  { label: '6 months', value: 6 },
  { label: '9 months', value: 9 },
  { label: '12 months', value: 12 },
  { label: '18 months', value: 18 },
  { label: '24 months', value: 24 },
  { label: 'Not sure', value: 0 },
];

export const getCategoryOption = (categoryId: string): ProductCategoryOption => {
  const found = PRODUCT_CATEGORIES.find((c) => c.id === categoryId.toLowerCase());
  return found || { id: 'other', label: categoryId, color: Colors.mutedGray, icon: 'cube' };
};
