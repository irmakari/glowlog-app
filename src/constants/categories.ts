import { Colors } from './colors';

export interface ProductCategoryInfo {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const PRODUCT_CATEGORIES: ProductCategoryInfo[] = [
  { id: 'cleanser', name: 'Cleanser', color: Colors.softBlue, icon: 'sparkles' },
  { id: 'toner', name: 'Toner', color: Colors.softLilac, icon: 'water' },
  { id: 'serum', name: 'Serum', color: Colors.pink, icon: 'flask' },
  { id: 'moisturizer', name: 'Moisturizer', color: Colors.sageGreen, icon: 'leaf' },
  { id: 'sunscreen', name: 'Sunscreen', color: Colors.butterYellow, icon: 'sunny' },
  { id: 'eye_care', name: 'Eye Care', color: Colors.softPeach, icon: 'eye' },
  { id: 'mask', name: 'Mask', color: Colors.softLilac, icon: 'happy' },
  { id: 'makeup', name: 'Makeup', color: Colors.pink, icon: 'color-palette' },
  { id: 'other', name: 'Other', color: Colors.mutedGray, icon: 'cube' },
];

export const getCategoryInfo = (categoryId: string): ProductCategoryInfo => {
  const found = PRODUCT_CATEGORIES.find((c) => c.id === categoryId.toLowerCase());
  return found || { id: 'other', name: categoryId, color: Colors.mutedGray, icon: 'cube' };
};
