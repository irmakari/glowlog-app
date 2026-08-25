import { useState, useCallback, useMemo } from 'react';
import { useFocusEffect } from 'expo-router';
import { routineService } from '../services/routineService';
import { waterService } from '../../history/services/waterService';
import { TodayRoutineStepState } from '../types/routine.types';
import { getLocalDateString, calculateStreakFromLogs } from '../utils/routineDate.utils';
import { calculateGlowScore } from '../../../utils/glowScore';
import { GlowScoreBreakdown } from '../../../types';

export function useTodayRoutine() {
  const [morningSteps, setMorningSteps] = useState<TodayRoutineStepState[]>([]);
  const [eveningSteps, setEveningSteps] = useState<TodayRoutineStepState[]>([]);
  const [hydrationCurrent, setHydrationCurrent] = useState<number>(0);
  const [hydrationGoal] = useState<number>(8);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const todayDateStr = useMemo(() => getLocalDateString(), []);

  const fetchTodayData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch morning & evening routine steps, completion logs, water intake, & streak from SQLite
      const [mSteps, eSteps, todayLogs, waterGlasses, completedDates] = await Promise.all([
        routineService.getRoutineStepsWithProducts('morning'),
        routineService.getRoutineStepsWithProducts('evening'),
        routineService.getRoutineLogsForDate(todayDateStr),
        waterService.getWaterForDate(todayDateStr),
        routineService.getAllCompletedDates(),
      ]);

      const completedStepIds = new Set(todayLogs.map((l) => l.routineStepId));

      const morningState: TodayRoutineStepState[] = mSteps.map((step) => ({
        ...step,
        completed: completedStepIds.has(step.id),
      }));

      const eveningState: TodayRoutineStepState[] = eSteps.map((step) => ({
        ...step,
        completed: completedStepIds.has(step.id),
      }));

      setMorningSteps(morningState);
      setEveningSteps(eveningState);
      setHydrationCurrent(waterGlasses);

      // 2. Calculate streak from real database logs
      const streak = calculateStreakFromLogs(completedDates, todayDateStr);
      setStreakDays(streak);
    } catch (err: any) {
      console.error('Error fetching today routine data:', err);
      setError(err?.message || 'Failed to load today routine');
    } finally {
      setLoading(false);
    }
  }, [todayDateStr]);

  useFocusEffect(
    useCallback(() => {
      fetchTodayData();
    }, [fetchTodayData])
  );

  // Compute Glow Score dynamically from actual SQLite state
  const glowScoreBreakdown: GlowScoreBreakdown = useMemo(() => {
    const allSteps = [...morningSteps, ...eveningSteps];
    const completedCount = allSteps.filter((s) => s.completed).length;

    return calculateGlowScore({
      completedStepsCount: completedCount,
      totalStepsCount: allSteps.length,
      currentHydration: hydrationCurrent,
      hydrationGoal,
      streakDays,
    });
  }, [morningSteps, eveningSteps, hydrationCurrent, hydrationGoal, streakDays]);

  const toggleStep = useCallback(
    async (stepId: string, routineType: 'morning' | 'evening') => {
      const isMorning = routineType === 'morning';
      const steps = isMorning ? morningSteps : eveningSteps;
      const targetStep = steps.find((s) => s.id === stepId);

      if (!targetStep) return;

      const newCompleted = !targetStep.completed;

      // Optimistic UI update
      const updateFn = (prev: TodayRoutineStepState[]) =>
        prev.map((s) => (s.id === stepId ? { ...s, completed: newCompleted } : s));

      if (isMorning) {
        setMorningSteps(updateFn);
      } else {
        setEveningSteps(updateFn);
      }

      try {
        await routineService.setRoutineStepCompleted(
          stepId,
          targetStep.productId,
          todayDateStr,
          newCompleted
        );
      } catch (err) {
        console.error('Failed to toggle routine step:', err);
        // Rollback state on error
        const rollbackFn = (prev: TodayRoutineStepState[]) =>
          prev.map((s) => (s.id === stepId ? { ...s, completed: !newCompleted } : s));
        if (isMorning) setMorningSteps(rollbackFn);
        else setEveningSteps(rollbackFn);
      }
    },
    [morningSteps, eveningSteps, todayDateStr]
  );

  const incrementWater = useCallback(async () => {
    try {
      const updated = await waterService.incrementWater(todayDateStr, hydrationGoal);
      setHydrationCurrent(updated);
    } catch (err) {
      console.error('Failed to increment water:', err);
    }
  }, [todayDateStr, hydrationGoal]);

  const decrementWater = useCallback(async () => {
    try {
      const updated = await waterService.decrementWater(todayDateStr);
      setHydrationCurrent(updated);
    } catch (err) {
      console.error('Failed to decrement water:', err);
    }
  }, [todayDateStr]);

  return {
    morningSteps,
    eveningSteps,
    hydrationCurrent,
    hydrationGoal,
    streakDays,
    glowScoreBreakdown,
    loading,
    error,
    toggleStep,
    incrementWater,
    decrementWater,
    refreshToday: fetchTodayData,
  };
}
