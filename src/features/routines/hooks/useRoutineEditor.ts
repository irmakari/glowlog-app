import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { routineService } from '../services/routineService';
import {
  RoutineType,
  RoutineStepWithProduct,
  CreateRoutineStepInput,
  UpdateRoutineStepInput,
} from '../types/routine.types';

export function useRoutineEditor(activeType: RoutineType) {
  const [steps, setSteps] = useState<RoutineStepWithProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSteps = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await routineService.getRoutineStepsWithProducts(activeType);
      setSteps(data);
    } catch (err: any) {
      console.error(`Error fetching ${activeType} steps:`, err);
      setError(err?.message || 'Failed to load routine steps');
    } finally {
      setLoading(false);
    }
  }, [activeType]);

  useFocusEffect(
    useCallback(() => {
      fetchSteps();
    }, [fetchSteps])
  );

  const addStep = useCallback(
    async (title: string, productId?: string) => {
      try {
        const input: CreateRoutineStepInput = {
          routineType: activeType,
          title,
          productId,
        };
        await routineService.createRoutineStep(input);
        await fetchSteps();
      } catch (err: any) {
        console.error('Failed to add step:', err);
        throw err;
      }
    },
    [activeType, fetchSteps]
  );

  const updateStep = useCallback(
    async (id: string, input: UpdateRoutineStepInput) => {
      try {
        await routineService.updateRoutineStep(id, input);
        await fetchSteps();
      } catch (err: any) {
        console.error(`Failed to update step ${id}:`, err);
        throw err;
      }
    },
    [fetchSteps]
  );

  const deleteStep = useCallback(
    async (id: string) => {
      try {
        await routineService.deleteRoutineStep(id);
        await fetchSteps();
      } catch (err: any) {
        console.error(`Failed to delete step ${id}:`, err);
        throw err;
      }
    },
    [fetchSteps]
  );

  const moveStepUp = useCallback(
    async (index: number) => {
      if (index <= 0) return;
      const newSteps = [...steps];
      const temp = newSteps[index];
      newSteps[index] = newSteps[index - 1];
      newSteps[index - 1] = temp;

      setSteps(newSteps);
      try {
        const orderedIds = newSteps.map((s) => s.id);
        await routineService.reorderRoutineSteps(activeType, orderedIds);
      } catch (err) {
        console.error('Failed to reorder steps:', err);
        await fetchSteps();
      }
    },
    [activeType, steps, fetchSteps]
  );

  const moveStepDown = useCallback(
    async (index: number) => {
      if (index >= steps.length - 1) return;
      const newSteps = [...steps];
      const temp = newSteps[index];
      newSteps[index] = newSteps[index + 1];
      newSteps[index + 1] = temp;

      setSteps(newSteps);
      try {
        const orderedIds = newSteps.map((s) => s.id);
        await routineService.reorderRoutineSteps(activeType, orderedIds);
      } catch (err) {
        console.error('Failed to reorder steps:', err);
        await fetchSteps();
      }
    },
    [activeType, steps, fetchSteps]
  );

  return {
    steps,
    loading,
    error,
    addStep,
    updateStep,
    deleteStep,
    moveStepUp,
    moveStepDown,
    refreshSteps: fetchSteps,
  };
}
