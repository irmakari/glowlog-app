import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { routineService } from '../services/routineService';
import { waterService } from '../../history/services/waterService';
import { productService } from '../../products/services/productService';
import { getPAOStatus } from '../../products/utils/productDate.utils';
import { settingsService } from '../../../services/settingsService';
import { TodayRoutineStepState } from '../types/routine.types';
import { getLocalDateString, calculateStreakFromLogs } from '../utils/routineDate.utils';
import { shiftDateKey } from '../../history/utils/calendar.utils';
import { calculateGlowScore } from '../../../utils/glowScore';
import { GlowScoreBreakdown } from '../../../types';

export function useTodayRoutine() {
  const router = useRouter();
  const [morningSteps, setMorningSteps] = useState<TodayRoutineStepState[]>([]);
  const [eveningSteps, setEveningSteps] = useState<TodayRoutineStepState[]>([]);
  const [hydrationCurrent, setHydrationCurrent] = useState<number>(0);
  const [hydrationGoal, setHydrationGoal] = useState<number>(8);
  const [hydrationWeeklyAverage, setHydrationWeeklyAverage] = useState<number | null>(null);
  const [expiredProductNames, setExpiredProductNames] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [skinType, setSkinType] = useState<string>('Combination');
  const [streakDays, setStreakDays] = useState<number>(0);
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // "Today" must follow the clock: the tab stays mounted across midnight
  const [todayDateStr, setTodayDateStr] = useState<string>(() => getLocalDateString());
  const todayRef = useRef(todayDateStr);

  const fetchTodayData = useCallback(async () => {
    const today = getLocalDateString();
    todayRef.current = today;
    setTodayDateStr(today);

    try {
      setError(null);

      const [mSteps, eSteps, todayLogs, waterGlasses, completedDates, appSettings, weeklyAverage, products] =
        await Promise.all([
          routineService.getRoutineStepsWithProducts('morning'),
          routineService.getRoutineStepsWithProducts('evening'),
          routineService.getRoutineLogsForDate(today),
          waterService.getWaterForDate(today),
          routineService.getAllCompletedDates(),
          settingsService.getSettings(),
          waterService.getAverageGlasses(shiftDateKey(today, -6), today),
          productService.getActiveProducts(),
        ]);

      if (!appSettings.onboardingCompleted) {
        router.replace('/onboarding');
        return;
      }

      const completedStepIds = new Set(todayLogs.map((l) => l.routineStepId));
      const withCompletion = (step: (typeof mSteps)[number]): TodayRoutineStepState => ({
        ...step,
        completed: completedStepIds.has(step.id),
      });

      setMorningSteps(mSteps.map(withCompletion));
      setEveningSteps(eSteps.map(withCompletion));
      setHydrationCurrent(waterGlasses);
      setHydrationGoal(appSettings.hydrationGoal);
      setHydrationWeeklyAverage(weeklyAverage);
      setExpiredProductNames(
        products
          .filter((p) => getPAOStatus(p.openedAt, p.paoMonths).isExpired)
          .map((p) => p.name)
      );
      setUserName(appSettings.userName || '');
      setSkinType(appSettings.skinType || 'Combination');
      setStreakDays(calculateStreakFromLogs(completedDates, today));
      setCompletedDates(completedDates);
    } catch (err: any) {
      console.error('Error fetching today routine data:', err);
      setError(err?.message || 'Failed to load today routine');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const refreshStreak = useCallback(async () => {
    const dates = await routineService.getAllCompletedDates();
    setCompletedDates(dates);
    setStreakDays(calculateStreakFromLogs(dates, todayRef.current));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTodayData();
    }, [fetchTodayData])
  );

  // Coming back to the app on a new day should show a fresh day, not yesterday's checklist
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && getLocalDateString() !== todayRef.current) {
        fetchTodayData();
      }
    });
    return () => subscription.remove();
  }, [fetchTodayData]);

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
      const setSteps = isMorning ? setMorningSteps : setEveningSteps;

      // Optimistic UI update
      setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, completed: newCompleted } : s)));

      try {
        await routineService.setRoutineStepCompleted(
          stepId,
          targetStep.product?.id,
          todayRef.current,
          newCompleted
        );
        await refreshStreak();
      } catch (err) {
        console.error('Failed to toggle routine step:', err);
        setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, completed: !newCompleted } : s)));
      }
    },
    [morningSteps, eveningSteps, refreshStreak]
  );

  const completeAllSteps = useCallback(
    async (routineType: 'morning' | 'evening') => {
      const isMorning = routineType === 'morning';
      const steps = isMorning ? morningSteps : eveningSteps;
      const uncompletedSteps = steps.filter((s) => !s.completed);

      if (uncompletedSteps.length === 0) return;

      const setSteps = isMorning ? setMorningSteps : setEveningSteps;
      setSteps((prev) => prev.map((s) => ({ ...s, completed: true })));

      try {
        for (const step of uncompletedSteps) {
          await routineService.setRoutineStepCompleted(step.id, step.product?.id, todayRef.current, true);
        }
        await refreshStreak();
      } catch (err) {
        console.error('Failed to complete all steps:', err);
        fetchTodayData(); // Sync on error
      }
    },
    [morningSteps, eveningSteps, fetchTodayData, refreshStreak]
  );

  const refreshWeeklyAverage = useCallback(async () => {
    const today = todayRef.current;
    setHydrationWeeklyAverage(await waterService.getAverageGlasses(shiftDateKey(today, -6), today));
  }, []);

  const incrementWater = useCallback(async () => {
    try {
      const updated = await waterService.incrementWater(todayRef.current, hydrationGoal);
      setHydrationCurrent(updated);
      await refreshWeeklyAverage();
    } catch (err) {
      console.error('Failed to increment water:', err);
    }
  }, [hydrationGoal, refreshWeeklyAverage]);

  const decrementWater = useCallback(async () => {
    try {
      const updated = await waterService.decrementWater(todayRef.current);
      setHydrationCurrent(updated);
      await refreshWeeklyAverage();
    } catch (err) {
      console.error('Failed to decrement water:', err);
    }
  }, [refreshWeeklyAverage]);

  return {
    todayDateStr,
    morningSteps,
    eveningSteps,
    hydrationCurrent,
    hydrationGoal,
    hydrationWeeklyAverage,
    expiredProductNames,
    userName,
    skinType,
    streakDays,
    completedDates,
    glowScoreBreakdown,
    loading,
    error,
    toggleStep,
    completeAllSteps,
    incrementWater,
    decrementWater,
    refreshToday: fetchTodayData,
  };
}
