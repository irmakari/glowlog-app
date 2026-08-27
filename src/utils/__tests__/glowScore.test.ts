import { calculateGlowScore, getTimeBasedGreeting } from '../glowScore';

describe('glowScore utils', () => {
  describe('calculateGlowScore', () => {
    it('should return minimum score (0.0) when nothing is completed', () => {
      const result = calculateGlowScore({
        completedStepsCount: 0,
        totalStepsCount: 4,
        currentHydration: 0,
        hydrationGoal: 8,
        streakDays: 0,
      });

      expect(result.score).toBe(0.0);
      expect(result.routinePercent).toBe(0);
      expect(result.hydrationPercent).toBe(0);
    });

    it('should return maximum score (10.0) when everything is completed with strong streak', () => {
      const result = calculateGlowScore({
        completedStepsCount: 4,
        totalStepsCount: 4,
        currentHydration: 8,
        hydrationGoal: 8,
        streakDays: 5,
      });

      expect(result.score).toBe(10.0);
      expect(result.routinePercent).toBe(100);
      expect(result.hydrationPercent).toBe(100);
    });

    it('should calculate partial scores accurately', () => {
      const result = calculateGlowScore({
        completedStepsCount: 2,
        totalStepsCount: 4,
        currentHydration: 4,
        hydrationGoal: 8,
        streakDays: 3,
      });

      expect(result.score).toBeGreaterThan(0.0);
      expect(result.score).toBeLessThan(10.0);
    });

    it('should handle zero total steps safely without division by zero', () => {
      const result = calculateGlowScore({
        completedStepsCount: 0,
        totalStepsCount: 0,
        currentHydration: 4,
        hydrationGoal: 8,
        streakDays: 0,
      });

      expect(result.score).toBeGreaterThanOrEqual(0.0);
      expect(Number.isNaN(result.score)).toBe(false);
    });

    it('should cap hydration ratio at 100% when current hydration exceeds goal', () => {
      const result = calculateGlowScore({
        completedStepsCount: 4,
        totalStepsCount: 4,
        currentHydration: 12, // exceeds goal of 8
        hydrationGoal: 8,
        streakDays: 5,
      });

      expect(result.hydrationPercent).toBe(100);
      expect(result.hydrationScore).toBe(2.0);
      expect(result.score).toBe(10.0);
    });
  });

  describe('getTimeBasedGreeting', () => {
    it('should return morning greeting for 8 AM', () => {
      const morningDate = new Date(2026, 7, 26, 8, 0, 0);
      const greeting = getTimeBasedGreeting(morningDate);
      expect(greeting.greeting).toBe('Good morning');
      expect(greeting.iconName).toBe('sunny-outline');
      expect(greeting.iconColor).toBe('#E59935');
    });

    it('should return afternoon greeting for 14 PM', () => {
      const afternoonDate = new Date(2026, 7, 26, 14, 0, 0);
      const greeting = getTimeBasedGreeting(afternoonDate);
      expect(greeting.greeting).toBe('Good afternoon');
      expect(greeting.iconName).toBe('sunny');
      expect(greeting.iconColor).toBe('#E59935');
    });

    it('should return evening greeting for 20 PM', () => {
      const eveningDate = new Date(2026, 7, 26, 20, 0, 0);
      const greeting = getTimeBasedGreeting(eveningDate);
      expect(greeting.greeting).toBe('Good evening');
      expect(greeting.iconName).toBe('moon-outline');
      expect(greeting.iconColor).toBe('#7C5CBF');
    });
  });
});
