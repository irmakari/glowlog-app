import { findTreatmentConflicts, getProductActives } from '../treatmentConflicts';
import { makeTreatment } from './fixtures';

describe('treatmentConflicts', () => {
  describe('getProductActives', () => {
    it('combines tagged actives with ones found in the name or brand', () => {
      expect(getProductActives({ id: 'p', name: 'Night Serum', actives: ['vitamin_c'] })).toEqual(['vitamin_c']);
      expect(getProductActives({ id: 'p', name: 'Retinol 0.5% in Squalane', brand: 'The Ordinary' })).toEqual([
        'retinoid',
      ]);
      expect(getProductActives({ id: 'p', name: 'AHA 30% + BHA 2% Peeling' }).sort()).toEqual(['aha', 'bha']);
    });

    it('matches Turkish names with suffixes but not keywords inside other words', () => {
      expect(getProductActives({ id: 'p', name: 'Retinollü Gece Kremi' })).toEqual(['retinoid']);
      expect(getProductActives({ id: 'p', name: 'Salisilik Asitli Tonik' })).toEqual(['bha']);
      expect(getProductActives({ id: 'p', name: 'Sahara Sun Cream' })).toEqual([]);
    });
  });

  describe('findTreatmentConflicts', () => {
    it('pairs a treatment with each product that shares a flagged active', () => {
      const iso = makeTreatment({ activeKey: 'isotretinoin' });
      const conflicts = findTreatmentConflicts(
        [iso],
        [
          { id: 'retinol', name: 'Retinol Serum' },
          { id: 'moist', name: 'Barrier Cream' },
          { id: 'peel', name: 'Exfoliant', actives: ['aha', 'vitamin_c'] },
        ]
      );
      expect(conflicts.map((c) => [c.product.id, c.actives])).toEqual([
        ['retinol', ['retinoid']],
        ['peel', ['aha']],
      ]);
    });

    it('does not flag benzoyl peroxide with adapalene, or anything with spironolactone', () => {
      const bpo = { id: 'bpo', name: 'Benzoyl Peroxide 5% Gel' };
      expect(findTreatmentConflicts([makeTreatment({ activeKey: 'adapalene' })], [bpo])).toEqual([]);
      expect(findTreatmentConflicts([makeTreatment({ activeKey: 'spironolactone' })], [bpo])).toEqual([]);
      expect(findTreatmentConflicts([makeTreatment({ activeKey: 'tretinoin' })], [bpo])).toHaveLength(1);
    });
  });
});
