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
 * Calculates current streak days based on completed routine dates.
 * A calendar day counts as completed if at least one routine log was completed on that date.
 */
export function calculateStreakFromLogs(
  completedDates: string[],
  todayDateStr: string = getLocalDateString()
): number {
  if (!completedDates || completedDates.length === 0) return 0;

  const uniqueDates = Array.from(new Set(completedDates)).sort().reverse();
  const today = new Date(todayDateStr);
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let checkDate = new Date(today);

  // Allow today to not be completed yet without resetting yesterday's streak
  const todayFormatted = getLocalDateString(checkDate);
  if (!uniqueDates.includes(todayFormatted)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const formatted = getLocalDateString(checkDate);
    if (uniqueDates.includes(formatted)) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
