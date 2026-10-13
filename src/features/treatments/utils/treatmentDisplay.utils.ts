import { formatProductDate } from '../../products/utils/productDate.utils';
import { Treatment } from '../types/treatment.types';

type Translate = (key: string, params?: Record<string, string | number>) => string;

/** Monday-first, as both supported locales expect */
export const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

/** Short localized weekday name for a Date.getDay() value */
export function weekdayShortName(day: number, locale: string): string {
  // 11 Oct 2026 is a Sunday
  return new Date(2026, 9, 11 + day).toLocaleDateString(locale, { weekday: 'short' });
}

export const localeFor = (language: string) => (language === 'tr' ? 'tr-TR' : 'en-US');

/** e.g. "Every day · 08:00, 20:00" or "Mon, Wed · 09:00" */
export function formatTreatmentSchedule(treatment: Treatment, t: Translate, locale: string): string {
  const times = treatment.times.join(', ');
  switch (treatment.frequency) {
    case 'every_other_day':
      return t('treatments.scheduleEveryOtherDay', { times });
    case 'weekdays': {
      const days = WEEKDAY_ORDER.filter((d) => treatment.weekdays.includes(d))
        .map((d) => weekdayShortName(d, locale))
        .join(', ');
      return t('treatments.scheduleWeekdays', { days, times });
    }
    default:
      return t('treatments.scheduleDaily', { times });
  }
}

/** e.g. "Since 1 October 2026" or "1 October 2026 – 1 April 2027" */
export function formatTreatmentDates(treatment: Treatment, t: Translate, locale: string): string {
  const start = formatProductDate(treatment.startDate, locale);
  return treatment.endDate
    ? t('treatments.dateRange', { start, end: formatProductDate(treatment.endDate, locale) })
    : t('treatments.since', { date: start });
}
