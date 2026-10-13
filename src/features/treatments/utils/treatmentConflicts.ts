import { PRODUCT_ACTIVES, ProductActive } from '../../../constants/productActives';
import { Treatment, TreatmentActive } from '../types/treatment.types';

/**
 * Combinations worth a heads-up. Deliberately short and conservative: GlowLog flags,
 * the user's doctor decides. Copy lives in i18n under `treatments.conflict.<active>`.
 */
export const TREATMENT_CONFLICTS: Record<TreatmentActive, ProductActive[]> = {
  isotretinoin: ['retinoid', 'aha', 'bha', 'benzoyl_peroxide'],
  tretinoin: ['retinoid', 'aha', 'bha', 'benzoyl_peroxide'],
  adapalene: ['retinoid', 'aha', 'bha'],
  antibiotic: [],
  spironolactone: [],
  other: [],
};

/** Treatments that make skin more sun-sensitive; shown as a sunscreen tip */
export const PHOTOSENSITIZING: TreatmentActive[] = ['isotretinoin', 'tretinoin', 'adapalene', 'antibiotic'];

export interface ConflictProduct {
  id: string;
  name: string;
  brand?: string;
  actives?: ProductActive[];
}

export interface TreatmentConflict {
  treatment: Treatment;
  product: ConflictProduct;
  actives: ProductActive[];
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// A keyword must start a word, but may be followed by a suffix ("retinollü", "Salicylic-acid")
const KEYWORD_PATTERNS = PRODUCT_ACTIVES.map((active) => ({
  id: active.id,
  patterns: active.keywords.map((k) => new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(k)}`, 'iu')),
}));

/** Actives the user tagged on the product, plus any its name or brand gives away */
export function getProductActives(product: ConflictProduct): ProductActive[] {
  const found = new Set<ProductActive>(product.actives ?? []);
  const text = `${product.brand ?? ''} ${product.name}`;
  for (const { id, patterns } of KEYWORD_PATTERNS) {
    if (patterns.some((p) => p.test(text))) found.add(id);
  }
  return [...found];
}

/**
 * Every (treatment, product) pair that shares a flagged active.
 * Pass only the treatments that are currently running and the products actually in use.
 */
export function findTreatmentConflicts(
  treatments: Treatment[],
  products: ConflictProduct[]
): TreatmentConflict[] {
  const productActives = products.map((product) => ({ product, actives: getProductActives(product) }));

  return treatments.flatMap((treatment) => {
    const flagged = TREATMENT_CONFLICTS[treatment.activeKey] ?? [];
    if (flagged.length === 0) return [];

    return productActives
      .map(({ product, actives }) => ({
        treatment,
        product,
        actives: actives.filter((a) => flagged.includes(a)),
      }))
      .filter((c) => c.actives.length > 0);
  });
}
