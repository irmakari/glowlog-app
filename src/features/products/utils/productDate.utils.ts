import { parseDateKey } from '../../routines/utils/routineDate.utils';

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parses either a local date key (YYYY-MM-DD) or a full ISO timestamp.
 * Date keys are parsed as local dates so they never shift a day across timezones.
 */
function parseProductDate(value: string): Date {
  return DATE_KEY_PATTERN.test(value) ? parseDateKey(value) : new Date(value);
}

/**
 * Computes the number of days since a product was opened
 */
export function getDaysSinceOpened(openedAt?: string): number | null {
  if (!openedAt) return null;
  const openDate = parseProductDate(openedAt);
  if (isNaN(openDate.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  openDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today.getTime() - openDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Formats a date (YYYY-MM-DD or ISO timestamp) into editorial readable date (e.g. "August 12, 2026")
 */
export function formatProductDate(dateString?: string, locale = 'en-US'): string {
  if (!dateString) return '';
  const date = parseProductDate(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Whole calendar months a product has been open (e.g. opened Jan 15 → Mar 14 is 1 month).
 */
export function getMonthsSinceOpened(openedAt?: string): number | null {
  if (!openedAt) return null;
  const openDate = parseProductDate(openedAt);
  if (isNaN(openDate.getTime())) return null;

  const today = new Date();
  let months = (today.getFullYear() - openDate.getFullYear()) * 12 + (today.getMonth() - openDate.getMonth());
  if (today.getDate() < openDate.getDate()) months -= 1;
  return Math.max(0, months);
}

/**
 * Returns whether a product has reached its period-after-opening (PAO) limit
 */
export function getPAOStatus(openedAt?: string, paoMonths?: number): {
  isExpired: boolean;
  monthsOpen: number;
} {
  const monthsOpen = getMonthsSinceOpened(openedAt);
  if (monthsOpen === null || !paoMonths) {
    return { isExpired: false, monthsOpen: monthsOpen ?? 0 };
  }
  return { isExpired: monthsOpen >= paoMonths, monthsOpen };
}
