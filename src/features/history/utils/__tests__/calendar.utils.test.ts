import {
  getCalendarGridDays,
  formatMonthYear,
  formatHistoryDate,
  isFutureDateKey,
  getWeekDays,
  getWeekStartKey,
  shiftDateKey,
  formatWeekRange,
} from '../calendar.utils';

describe('calendar.utils', () => {
  describe('getCalendarGridDays', () => {
    it('should generate calendar grid with multiples of 7 days', () => {
      const grid = getCalendarGridDays(2026, 8); // August 2026
      expect(grid.length % 7).toBe(0);
      expect(grid.length).toBeGreaterThanOrEqual(28);
    });

    it('should correctly mark current month days', () => {
      const grid = getCalendarGridDays(2026, 8);
      const augustDays = grid.filter((d) => d.isCurrentMonth);
      expect(augustDays.length).toBe(31); // August has 31 days
    });

    it('should start the month grid on Monday', () => {
      const grid = getCalendarGridDays(2026, 9);
      expect(grid[0].dateKey).toBe('2026-08-31');
    });
  });

  describe('weekly calendar', () => {
    it('shows Monday through Sunday across a month boundary', () => {
      expect(getWeekStartKey('2026-09-01')).toBe('2026-08-31');
      expect(getWeekDays('2026-09-01').map((day) => day.dateKey)).toEqual([
        '2026-08-31', '2026-09-01', '2026-09-02', '2026-09-03',
        '2026-09-04', '2026-09-05', '2026-09-06',
      ]);
    });

    it('navigates by local calendar weeks', () => {
      expect(shiftDateKey('2026-09-28', 7)).toBe('2026-10-05');
      expect(formatWeekRange('2026-09-28')).toBe('Sep 28 – Oct 4');
    });
  });

  describe('formatMonthYear', () => {
    it('should format month and year correctly', () => {
      expect(formatMonthYear(2026, 8)).toBe('August 2026');
      expect(formatMonthYear(2026, 1)).toBe('January 2026');
      expect(formatMonthYear(2026, 12)).toBe('December 2026');
    });
  });

  describe('formatHistoryDate', () => {
    it('should format dateKey YYYY-MM-DD into readable string', () => {
      expect(formatHistoryDate('2026-08-25')).toBe('Tuesday, August 25');
    });
  });

  describe('isFutureDateKey', () => {
    it('should correctly identify future date keys', () => {
      expect(isFutureDateKey('2099-01-01')).toBe(true);
      expect(isFutureDateKey('2000-01-01')).toBe(false);
    });
  });
});
