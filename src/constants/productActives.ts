/**
 * Skincare actives GlowLog knows about. Used to warn about combinations with a treatment.
 * `keywords` catch products whose actives were never tagged (whole words in name and brand, case-insensitive).
 */
export const PRODUCT_ACTIVES = [
  { id: 'retinoid', keywords: ['retinol', 'retinal', 'retinoid', 'retinyl', 'granactive'] },
  { id: 'aha', keywords: ['aha', 'glycolic', 'glikolik', 'lactic', 'laktik', 'mandelic', 'mandelik'] },
  { id: 'bha', keywords: ['bha', 'salicylic', 'salisilik'] },
  { id: 'benzoyl_peroxide', keywords: ['benzoyl', 'benzoil'] },
  { id: 'vitamin_c', keywords: ['vitamin c', 'c vitamini', 'ascorbic', 'askorbik'] },
] as const;

export type ProductActive = (typeof PRODUCT_ACTIVES)[number]['id'];

export const isProductActive = (value: unknown): value is ProductActive =>
  PRODUCT_ACTIVES.some((a) => a.id === value);
