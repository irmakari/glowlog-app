import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { historyService } from '../services/historyService';
import { routineService } from '../../routines/services/routineService';
import { waterService } from '../services/waterService';
import { DailySummary } from '../types/history.types';

export function useDailySummary(dateKey: string) {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    if (!dateKey) return;
    try {
      setLoading(true);
      setError(null);
      const data = await historyService.getDailySummary(dateKey);
      setSummary(data);
    } catch (err: any) {
      console.error(`Failed to load daily summary for ${dateKey}:`, err);
      setError('Failed to load daily summary.');
    } finally {
      setLoading(false);
    }
  }, [dateKey]);

  useFocusEffect(
    useCallback(() => {
      fetchSummary();
    }, [fetchSummary])
  );

  const toggleStep = useCallback(
    async (stepId: string, productId?: string) => {
      if (!summary || !dateKey) return;

      const allSteps = [...summary.morningSteps, ...summary.eveningSteps];
      const target = allSteps.find((s) => s.id === stepId);
      if (!target) return;

      const newCompleted = !target.completed;

      // Optimistic UI update
      setSummary((prev) => {
        if (!prev) return prev;
        const updateArr = (arr: typeof prev.morningSteps) =>
          arr.map((s) => (s.id === stepId ? { ...s, completed: newCompleted } : s));

        return {
          ...prev,
          morningSteps: updateArr(prev.morningSteps),
          eveningSteps: updateArr(prev.eveningSteps),
        };
      });

      try {
        await routineService.setRoutineStepCompleted(stepId, productId, dateKey, newCompleted);
        await fetchSummary();
      } catch (err) {
        console.error('Failed to toggle step in summary modal:', err);
        await fetchSummary();
      }
    },
    [summary, dateKey, fetchSummary]
  );

  const incrementWater = useCallback(async () => {
    if (!summary || !dateKey) return;
    try {
      const updated = await waterService.incrementWater(dateKey, summary.hydrationGoal);
      setSummary((prev) => (prev ? { ...prev, hydration: updated } : prev));
    } catch (err) {
      console.error('Failed to increment water in summary:', err);
    }
  }, [summary, dateKey]);

  const decrementWater = useCallback(async () => {
    if (!summary || !dateKey) return;
    try {
      const updated = await waterService.decrementWater(dateKey);
      setSummary((prev) => (prev ? { ...prev, hydration: updated } : prev));
    } catch (err) {
      console.error('Failed to decrement water in summary:', err);
    }
  }, [summary, dateKey]);

  return {
    summary,
    loading,
    error,
    toggleStep,
    incrementWater,
    decrementWater,
    refreshSummary: fetchSummary,
  };
}
