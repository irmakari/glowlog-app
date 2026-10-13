import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { treatmentService } from '../services/treatmentService';
import { Treatment } from '../types/treatment.types';

/** All treatments, archived ones included, reloaded whenever the screen gains focus */
export function useTreatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTreatments = useCallback(async () => {
    try {
      setTreatments(await treatmentService.getTreatments(true));
    } catch (err) {
      console.error('Error fetching treatments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTreatments();
    }, [fetchTreatments])
  );

  return { treatments, loading, refreshTreatments: fetchTreatments };
}
