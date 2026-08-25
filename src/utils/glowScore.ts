import { GlowScoreBreakdown } from '../types';

export interface GlowScoreInput {
  completedStepsCount: number;
  totalStepsCount: number;
  currentHydration: number;
  hydrationGoal: number;
  streakDays: number;
}

/**
 * Calculates Today's Glow Score (0.0 - 10.0) based on:
 * - Routine completion (70% weight -> max 7.0 points)
 * - Hydration goal (20% weight -> max 2.0 points)
 * - Daily consistency streak (10% weight -> max 1.0 point)
 * 
 * Note: This score is a fun, playful daily ritual tracker score.
 * It is NOT a medical or health score.
 */
export function calculateGlowScore(input: GlowScoreInput): GlowScoreBreakdown {
  const {
    completedStepsCount,
    totalStepsCount,
    currentHydration,
    hydrationGoal,
    streakDays,
  } = input;

  // 1. Routine score (0 to 7.0)
  const routineRatio = totalStepsCount > 0 ? completedStepsCount / totalStepsCount : 0;
  const routineScore = routineRatio * 7.0;
  const routinePercent = Math.round(routineRatio * 100);

  // 2. Hydration score (0 to 2.0)
  const hydrationRatio = hydrationGoal > 0 ? Math.min(1.0, currentHydration / hydrationGoal) : 0;
  const hydrationScore = hydrationRatio * 2.0;
  const hydrationPercent = Math.round(hydrationRatio * 100);

  // 3. Streak score (0 to 1.0)
  const streakRatio = Math.min(1.0, streakDays / 5);
  const streakScore = streakRatio * 1.0;

  // Total Glow Score
  const rawTotal = routineScore + hydrationScore + streakScore;
  const score = Math.round(rawTotal * 10) / 10;

  return {
    score: Math.min(10.0, Math.max(0.0, score)),
    routineScore: Math.round(routineScore * 10) / 10,
    hydrationScore: Math.round(hydrationScore * 10) / 10,
    streakScore: Math.round(streakScore * 10) / 10,
    routinePercent,
    hydrationPercent,
    completedStepsCount,
    totalStepsCount,
  };
}

/**
 * Helper to generate time-based greeting string
 */
export function getTimeBasedGreeting(date: Date = new Date()): {
  greeting: string;
  emoji: string;
} {
  const hours = date.getHours();

  if (hours < 12) {
    return { greeting: 'Good morning', emoji: '✨' };
  } else if (hours < 17) {
    return { greeting: 'Good afternoon', emoji: '☀️' };
  } else {
    return { greeting: 'Good evening', emoji: '🌙' };
  }
}
