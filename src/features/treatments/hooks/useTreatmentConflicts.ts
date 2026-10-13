import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { productService } from '../../products/services/productService';
import { getLocalDateString } from '../../routines/utils/routineDate.utils';
import { treatmentService } from '../services/treatmentService';
import { Treatment } from '../types/treatment.types';
import { findTreatmentConflicts, PHOTOSENSITIZING, TreatmentConflict } from '../utils/treatmentConflicts';
import { isTreatmentActiveOn } from '../utils/treatmentSchedule.utils';

/** Treatments running today, checked against the products linked in the user's routines */
export function useTreatmentConflicts() {
  const [conflicts, setConflicts] = useState<TreatmentConflict[]>([]);
  const [sunSensitive, setSunSensitive] = useState<Treatment[]>([]);

  const fetchConflicts = useCallback(async () => {
    try {
      const today = getLocalDateString();
      const [treatments, products] = await Promise.all([
        treatmentService.getTreatments(),
        productService.getRoutineProducts(),
      ]);
      const running = treatments.filter((t) => isTreatmentActiveOn(t, today));
      setConflicts(findTreatmentConflicts(running, products));
      setSunSensitive(running.filter((t) => PHOTOSENSITIZING.includes(t.activeKey)));
    } catch (err) {
      console.error('Failed to check treatment conflicts:', err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchConflicts();
    }, [fetchConflicts])
  );

  return { conflicts, sunSensitive, refreshConflicts: fetchConflicts };
}
