import { TreatmentLog } from '../../types/treatment.types';
import { makeTreatment } from './fixtures';
import {
  addDays,
  daysBetween,
  getDosesForDate,
  isTreatmentDueOn,
  isTreatmentFinished,
  normalizeTimes,
} from '../treatmentSchedule.utils';

describe('treatmentSchedule.utils', () => {
  describe('daysBetween / addDays', () => {
    it('counts calendar days across a month end', () => {
      expect(daysBetween('2026-10-30', '2026-11-02')).toBe(3);
      expect(daysBetween('2026-11-02', '2026-10-30')).toBe(-3);
    });

    it('is not thrown off by a DST change', () => {
      // Europe/US clocks change on the last weekend of October / first of November
      expect(daysBetween('2026-10-24', '2026-11-07')).toBe(14);
      expect(addDays('2026-10-24', 14)).toBe('2026-11-07');
    });
  });

  describe('isTreatmentDueOn', () => {
    it('respects the start and inclusive end date', () => {
      const t = makeTreatment({ startDate: '2026-10-05', endDate: '2026-10-10' });
      expect(isTreatmentDueOn(t, '2026-10-04')).toBe(false);
      expect(isTreatmentDueOn(t, '2026-10-05')).toBe(true);
      expect(isTreatmentDueOn(t, '2026-10-10')).toBe(true);
      expect(isTreatmentDueOn(t, '2026-10-11')).toBe(false);
    });

    it('only matches the chosen days of the week', () => {
      // 2026-10-12 is a Monday (getDay 1), 2026-10-13 a Tuesday
      const t = makeTreatment({ frequency: 'weekdays', weekdays: [1, 3, 5] });
      expect(isTreatmentDueOn(t, '2026-10-12')).toBe(true);
      expect(isTreatmentDueOn(t, '2026-10-13')).toBe(false);
    });

    it('alternates days counting from the start date', () => {
      const t = makeTreatment({ frequency: 'every_other_day', startDate: '2026-10-29' });
      expect(isTreatmentDueOn(t, '2026-10-29')).toBe(true);
      expect(isTreatmentDueOn(t, '2026-10-30')).toBe(false);
      expect(isTreatmentDueOn(t, '2026-10-31')).toBe(true);
      // Keeps the rhythm across a month boundary
      expect(isTreatmentDueOn(t, '2026-11-01')).toBe(false);
      expect(isTreatmentDueOn(t, '2026-11-02')).toBe(true);
    });
  });

  describe('isTreatmentFinished', () => {
    it('is finished when archived or past its end date', () => {
      expect(isTreatmentFinished(makeTreatment({ archived: true }), '2026-10-14')).toBe(true);
      expect(isTreatmentFinished(makeTreatment({ endDate: '2026-10-13' }), '2026-10-14')).toBe(true);
      expect(isTreatmentFinished(makeTreatment({ endDate: '2026-10-14' }), '2026-10-14')).toBe(false);
      expect(isTreatmentFinished(makeTreatment(), '2026-10-14')).toBe(false);
    });
  });

  describe('getDosesForDate', () => {
    it('lists each due slot with its logged status, sorted by time', () => {
      const a = makeTreatment({ id: 'a', name: 'B cream', times: ['21:00'], kind: 'topical' });
      const b = makeTreatment({ id: 'b', name: 'A pill', times: ['20:00', '08:00'] });
      const logs: TreatmentLog[] = [
        { id: 'l1', treatmentId: 'b', date: '2026-10-14', slot: '08:00', status: 'taken', loggedAt: '' },
        { id: 'l2', treatmentId: 'a', date: '2026-10-13', slot: '21:00', status: 'skipped', loggedAt: '' },
      ];

      const doses = getDosesForDate([a, b], logs, '2026-10-14');
      expect(doses.map((d) => [d.treatment.id, d.slot, d.status])).toEqual([
        ['b', '08:00', 'taken'],
        ['b', '20:00', undefined],
        ['a', '21:00', undefined],
      ]);
    });

    it('leaves out archived treatments and days that are not due', () => {
      const archived = makeTreatment({ id: 'x', archived: true });
      const alternate = makeTreatment({ id: 'y', frequency: 'every_other_day', startDate: '2026-10-13' });
      expect(getDosesForDate([archived, alternate], [], '2026-10-14')).toEqual([]);
    });

    it('keeps logged doses of archived treatments as history', () => {
      const archived = makeTreatment({ id: 'x', archived: true, times: ['08:00', '20:00'] });
      const logs: TreatmentLog[] = [
        { id: 'l1', treatmentId: 'x', date: '2026-10-10', slot: '08:00', status: 'taken', loggedAt: '' },
      ];
      expect(getDosesForDate([archived], logs, '2026-10-10').map((d) => [d.slot, d.status])).toEqual([
        ['08:00', 'taken'],
      ]);
    });
  });

  describe('normalizeTimes', () => {
    it('drops invalid and duplicate times and sorts the rest', () => {
      expect(normalizeTimes(['21:00', '8:00', '08:00', '24:00', '08:00'])).toEqual(['08:00', '21:00']);
    });
  });
});
