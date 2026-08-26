import { calculateStreaks } from '../streak.utils';
import { getLocalDateString } from '../../../routines/utils/routineDate.utils';

function getOffsetDateString(baseDateStr: string, offsetDays: number): string {
  const date = new Date(baseDateStr);
  date.setDate(date.getDate() - offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

describe('streak.utils', () => {
  it('should return 0 streak for empty completed dates', () => {
    const streaks = calculateStreaks([]);
    expect(streaks.currentStreak).toBe(0);
    expect(streaks.bestStreak).toBe(0);
  });

  it('should return 1 for streak containing only today', () => {
    const today = getLocalDateString();
    const streaks = calculateStreaks([today]);
    expect(streaks.currentStreak).toBe(1);
    expect(streaks.bestStreak).toBe(1);
  });

  it('should calculate consecutive streak correctly', () => {
    const today = getLocalDateString();
    const yesterday = getOffsetDateString(today, 1);
    const dayBeforeYesterday = getOffsetDateString(today, 2);

    const streaks = calculateStreaks([today, yesterday, dayBeforeYesterday]);
    expect(streaks.currentStreak).toBe(3);
    expect(streaks.bestStreak).toBe(3);
  });

  it('should preserve best streak when current streak is broken', () => {
    const today = getLocalDateString();
    // 5-day streak 10 days ago
    const pastStreak = Array.from({ length: 5 }, (_, i) => getOffsetDateString(today, 10 + i));
    // 2-day current streak
    const currentStreak = [today, getOffsetDateString(today, 1)];

    const allDates = [...pastStreak, ...currentStreak];
    const streaks = calculateStreaks(allDates);

    expect(streaks.currentStreak).toBe(2);
    expect(streaks.bestStreak).toBe(5);
  });
});
