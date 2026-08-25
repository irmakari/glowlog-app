import { getLocalDateString } from '../../routines/utils/routineDate.utils';

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
    const [y, m, d] = dateStr.split('-').map(Number);
    const currentDate = new Date(y, m - 1, d);

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

  // 2. Calculate Current Streak (going backward from today or yesterday)
  const todayStr = getLocalDateString();
  const dateSet = new Set(uniqueSorted);

  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);

  // If today is not completed yet, allow streak to continue from yesterday
  const checkStr = getLocalDateString(checkDate);
  if (!dateSet.has(checkStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  let currentStreak = 0;
  while (true) {
    const key = getLocalDateString(checkDate);
    if (dateSet.has(key)) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    currentStreak,
    bestStreak: Math.max(maxStreak, currentStreak),
  };
}
