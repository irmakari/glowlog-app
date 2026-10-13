import { calculateStreakFromLogs, parseDateKey } from '../../routines/utils/routineDate.utils';

/**
 * Calculates current streak and best streak from array of completed date strings (YYYY-MM-DD)
 */
export function calculateStreaks(completedDates: string[]): {
  currentStreak: number;
  bestStreak: number;
} {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const uniqueSorted = Array.from(new Set(completedDates)).sort();
  if (uniqueSorted.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // 1. Calculate Best Streak (longest consecutive sequence)
  let maxStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  for (const dateStr of uniqueSorted) {
    const currentDate = parseDateKey(dateStr);

    if (lastDate === null) {
      tempStreak = 1;
    } else {
      const diffMs = currentDate.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak += 1;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    lastDate = currentDate;
    if (tempStreak > maxStreak) {
      maxStreak = tempStreak;
    }
  }

  // 2. Current streak (going backward from today, or yesterday if today isn't done yet)
  const currentStreak = calculateStreakFromLogs(uniqueSorted);

  return {
    currentStreak,
    bestStreak: Math.max(maxStreak, currentStreak),
  };
}
