import { getLocalDateString, parseDateKey } from '../../routines/utils/routineDate.utils';
import { Treatment, TreatmentDose, TreatmentLog } from '../types/treatment.types';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole calendar days from `fromKey` to `toKey` (negative when `toKey` is earlier). DST-safe. */
export function daysBetween(fromKey: string, toKey: string): number {
  const [fy, fm, fd] = fromKey.split('-').map(Number);
  const [ty, tm, td] = toKey.split('-').map(Number);
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / DAY_MS);
}

export function addDays(dateKey: string, days: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
}

/** True when the treatment has started and not yet ended on the given day */
export function isTreatmentActiveOn(treatment: Treatment, dateKey: string): boolean {
  if (dateKey < treatment.startDate) return false;
  if (treatment.endDate && dateKey > treatment.endDate) return false;
  return true;
}

/** True when the treatment has a dose scheduled on the given day */
export function isTreatmentDueOn(treatment: Treatment, dateKey: string): boolean {
  if (!isTreatmentActiveOn(treatment, dateKey)) return false;

  switch (treatment.frequency) {
    case 'daily':
      return true;
    case 'weekdays':
      return treatment.weekdays.includes(parseDateKey(dateKey).getDay());
    case 'every_other_day':
      // Counted from the start date, so the start date itself is always a dose day
      return daysBetween(treatment.startDate, dateKey) % 2 === 0;
    default:
      return false;
  }
}

/** True when the treatment is finished: archived, or past its end date */
export function isTreatmentFinished(treatment: Treatment, todayKey: string = getLocalDateString()): boolean {
  return treatment.archived || (!!treatment.endDate && treatment.endDate < todayKey);
}

/**
 * Every dose scheduled on the given day across the treatments, with its logged status.
 * Archived treatments only contribute doses that were logged, so finished treatments
 * still show up in past days' history without asking for new doses.
 * Sorted by time, then by treatment name.
 */
export function getDosesForDate(
  treatments: Treatment[],
  logs: TreatmentLog[],
  dateKey: string
): TreatmentDose[] {
  const statusByKey = new Map(
    logs.filter((l) => l.date === dateKey).map((l) => [`${l.treatmentId}|${l.slot}`, l.status])
  );

  return treatments
    .filter((t) => isTreatmentDueOn(t, dateKey))
    .flatMap((treatment) =>
      treatment.times.map((slot) => ({
        treatment,
        slot,
        status: statusByKey.get(`${treatment.id}|${slot}`),
      }))
    )
    .filter((dose) => !dose.treatment.archived || dose.status !== undefined)
    .sort((a, b) => a.slot.localeCompare(b.slot) || a.treatment.name.localeCompare(b.treatment.name));
}

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isValidTime(time: string): boolean {
  return TIME_PATTERN.test(time);
}

/** Valid, de-duplicated and sorted dose times */
export function normalizeTimes(times: string[]): string[] {
  return [...new Set(times.filter(isValidTime))].sort();
}
