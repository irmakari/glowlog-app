/**
 * Formats a Date object into a local timezone ISO date string (YYYY-MM-DD).
 * Prevents UTC off-by-one timezone bugs!
 */
export function getLocalDateString(dateInput: Date = new Date()): string {
  const year = dateInput.getFullYear();
  const month = String(dateInput.getMonth() + 1).padStart(2, '0');
  const day = String(dateInput.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a local date key (YYYY-MM-DD) into a Date at local midnight.
 * `new Date('YYYY-MM-DD')` parses as UTC and shifts the day in negative UTC offsets.
 */
export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

/**
 * Calculates current streak days based on completed routine dates.
 * A calendar day counts as completed if at least one routine log was completed on that date.
 */
export function calculateStreakFromLogs(
  completedDates: string[],
  todayDateStr: string = getLocalDateString()
): number {
  if (!completedDates || completedDates.length === 0) return 0;

  const dateSet = new Set(completedDates);
  const checkDate = parseDateKey(todayDateStr);

  // Allow today to not be completed yet without resetting yesterday's streak
  if (!dateSet.has(todayDateStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  let streak = 0;
  while (dateSet.has(getLocalDateString(checkDate))) {
    streak += 1;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}
