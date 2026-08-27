import { getLocalDateString, calculateStreakFromLogs } from '../routineDate.utils';

describe('routineDate.utils', () => {
  describe('getLocalDateString', () => {
    it('should format date to YYYY-MM-DD string', () => {
      const date = new Date(2026, 4, 9); // May 9, 2026
      expect(getLocalDateString(date)).toBe('2026-05-09');
    });

    it('should pad single digit month and day with leading zeroes', () => {
      const date = new Date(2026, 0, 5); // Jan 5, 2026
      expect(getLocalDateString(date)).toBe('2026-01-05');
    });
  });

  describe('calculateStreakFromLogs', () => {
    it('should return 0 when completedDates is empty', () => {
      expect(calculateStreakFromLogs([], '2026-08-27')).toBe(0);
    });

    it('should calculate streak including today when today is completed', () => {
      const logs = ['2026-08-27', '2026-08-26', '2026-08-25'];
      expect(calculateStreakFromLogs(logs, '2026-08-27')).toBe(3);
    });

    it('should preserve streak from yesterday when today is not yet completed', () => {
      const logs = ['2026-08-26', '2026-08-25'];
      expect(calculateStreakFromLogs(logs, '2026-08-27')).toBe(2);
    });

    it('should reset streak when a day before yesterday was missed', () => {
      const logs = ['2026-08-25', '2026-08-24']; // Aug 26 missed!
      expect(calculateStreakFromLogs(logs, '2026-08-27')).toBe(0);
    });

    it('should deduplicate and sort completed dates correctly', () => {
      const logs = ['2026-08-26', '2026-08-27', '2026-08-26', '2026-08-25'];
      expect(calculateStreakFromLogs(logs, '2026-08-27')).toBe(3);
    });
  });
});
