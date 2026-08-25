import { getLocalDateString } from '../../routines/utils/routineDate.utils';

export interface CalendarGridDay {
  dateKey: string; // YYYY-MM-DD
  dayNumber: number; // 1 - 31
  isCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
}

/**
 * Returns formatted month and year label (e.g. "August 2026")
 */
export function formatMonthYear(year: number, month: number): string {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Formats a local date key (YYYY-MM-DD) into editorial readable date (e.g. "August 22, 2026")
 */
export function formatHistoryDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  if (!y || !m || !d) return dateKey;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Checks if a dateKey is today
 */
export function isTodayKey(dateKey: string): boolean {
  return dateKey === getLocalDateString();
}

/**
 * Checks if a dateKey is in the future relative to local today
 */
export function isFutureDateKey(dateKey: string): boolean {
  return dateKey > getLocalDateString();
}

/**
 * Generates the full 7-column calendar grid for a given year and month (1-indexed month)
 */
export function getCalendarGridDays(year: number, month: number): CalendarGridDay[] {
  const todayKey = getLocalDateString();
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon...

  const grid: CalendarGridDay[] = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const prevDate = new Date(year, month - 2, dayNum);
    const dateKey = getLocalDateString(prevDate);
    grid.push({
      dateKey,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateKey === todayKey,
      isFuture: isFutureDateKey(dateKey),
    });
  }

  // Current month days
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const curDate = new Date(year, month - 1, dayNum);
    const dateKey = getLocalDateString(curDate);
    grid.push({
      dateKey,
      dayNumber: dayNum,
      isCurrentMonth: true,
      isToday: dateKey === todayKey,
      isFuture: isFutureDateKey(dateKey),
    });
  }

  // Next month leading padding days to fill 7-column rows
  const remaining = (7 - (grid.length % 7)) % 7;
  for (let dayNum = 1; dayNum <= remaining; dayNum++) {
    const nextDate = new Date(year, month, dayNum);
    const dateKey = getLocalDateString(nextDate);
    grid.push({
      dateKey,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateKey === todayKey,
      isFuture: isFutureDateKey(dateKey),
    });
  }

  return grid;
}
