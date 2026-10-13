import { Colors, ColorVariant } from './colors';

export interface ProductCategoryOption {
  id: string;
  label: string;
  color: string;
  variant: ColorVariant;
  icon: string;
}

export const PRODUCT_CATEGORIES: ProductCategoryOption[] = [
  { id: 'cleanser', label: 'Cleanser', color: Colors.softBlue, variant: 'softBlue', icon: 'sparkles' },
  { id: 'toner', label: 'Toner', color: Colors.softLilac, variant: 'softLilac', icon: 'water' },
  { id: 'serum', label: 'Serum', color: Colors.pink, variant: 'pink', icon: 'flask' },
  { id: 'moisturizer', label: 'Moisturizer', color: Colors.sageGreen, variant: 'sageGreen', icon: 'leaf' },
  { id: 'sunscreen', label: 'Sunscreen', color: Colors.butterYellow, variant: 'butterYellow', icon: 'sunny' },
  { id: 'eye_care', label: 'Eye Care', color: Colors.softPeach, variant: 'softPeach', icon: 'eye' },
  { id: 'mask', label: 'Mask', color: Colors.softLilac, variant: 'softLilac', icon: 'happy' },
  { id: 'makeup', label: 'Makeup', color: Colors.pink, variant: 'pink', icon: 'color-palette' },
  { id: 'other', label: 'Other', color: Colors.mutedGray, variant: 'mutedGray', icon: 'cube' },
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
  return found || { id: 'other', label: categoryId, color: Colors.mutedGray, variant: 'mutedGray', icon: 'cube' };
};

/**
 * Category id used for filtering: custom categories (typed under "Other") group under 'other'.
 */
export const getCategoryFilterId = (category: string): string => {
  const id = category.toLowerCase();
  return PRODUCT_CATEGORIES.some((c) => c.id === id) ? id : 'other';
};

/**
 * Display name for a stored category: translated for built-in ids, verbatim for custom ones.
 */
export const getCategoryDisplayName = (category: string, t: (key: string) => string): string => {
  const id = category.toLowerCase();
  return PRODUCT_CATEGORIES.some((c) => c.id === id) ? t(`products.${id}`) : category;
};
