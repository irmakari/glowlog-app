import { getLocalDateString } from '../../routines/utils/routineDate.utils';

export interface CalendarGridDay {
  dateKey: string; // YYYY-MM-DD
  dayNumber: number; // 1 - 31
  isCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
}

function dateFromKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function shiftDateKey(dateKey: string, days: number): string {
  const date = dateFromKey(dateKey);
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
}

export function getWeekStartKey(dateKey: string): string {
  const date = dateFromKey(dateKey);
  const daysSinceMonday = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - daysSinceMonday);
  return getLocalDateString(date);
}

export function getWeekDays(dateKey: string): CalendarGridDay[] {
  const mondayKey = getWeekStartKey(dateKey);
  const todayKey = getLocalDateString();
  return Array.from({ length: 7 }, (_, index) => {
    const key = shiftDateKey(mondayKey, index);
    return {
      dateKey: key,
      dayNumber: dateFromKey(key).getDate(),
      isCurrentMonth: true,
      isToday: key === todayKey,
      isFuture: key > todayKey,
    };
  });
}

export function formatWeekRange(dateKey: string): string {
  const monday = dateFromKey(getWeekStartKey(dateKey));
  const sunday = dateFromKey(shiftDateKey(getWeekStartKey(dateKey), 6));
  const start = monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const end = sunday.toLocaleDateString('en-US', {
    month: monday.getMonth() === sunday.getMonth() ? undefined : 'short',
    day: 'numeric',
  });
  return `${start} – ${end}`;
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
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // 0 = Mon

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
