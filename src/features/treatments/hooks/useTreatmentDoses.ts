import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { treatmentService } from '../services/treatmentService';
import { Treatment, TreatmentDoseStatus, TreatmentLog } from '../types/treatment.types';
import { getDosesForDate, isTreatmentActiveOn } from '../utils/treatmentSchedule.utils';

/** The doses scheduled on one day and their taken/skipped state */
export function useTreatmentDoses(dateKey: string) {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [logs, setLogs] = useState<TreatmentLog[]>([]);
  const [loaded, setLoaded] = useState(false);

  const fetchDoses = useCallback(async () => {
    try {
      const [all, dayLogs] = await Promise.all([
        treatmentService.getTreatments(true),
        treatmentService.getLogsForDate(dateKey),
      ]);
      setTreatments(all);
      setLogs(dayLogs);
    } catch (err) {
      console.error(`Failed to load treatment doses for ${dateKey}:`, err);
    } finally {
      setLoaded(true);
    }
  }, [dateKey]);

  // Also re-runs when dateKey changes, e.g. the home tab rolling over at midnight
  useFocusEffect(
    useCallback(() => {
      fetchDoses();
    }, [fetchDoses])
  );

  const doses = useMemo(() => getDosesForDate(treatments, logs, dateKey), [treatments, logs, dateKey]);

  /** Treatments running on this day, whether or not a dose falls on it */
  const runningTreatments = useMemo(
    () => treatments.filter((t) => !t.archived && isTreatmentActiveOn(t, dateKey)),
    [treatments, dateKey]
  );

  const setDoseStatus = useCallback(
    async (treatmentId: string, slot: string, status: TreatmentDoseStatus | null) => {
      // Optimistic update, then re-read so the list matches the database
      setLogs((prev) => {
        const rest = prev.filter((l) => !(l.treatmentId === treatmentId && l.slot === slot));
        if (status === null) return rest;
        const now = new Date().toISOString();
        return [...rest, { id: `pending-${treatmentId}-${slot}`, treatmentId, date: dateKey, slot, status, loggedAt: now }];
      });

      try {
        await treatmentService.setDoseStatus(treatmentId, dateKey, slot, status);
      } catch (err) {
        console.error('Failed to update dose:', err);
      }
      setLogs(await treatmentService.getLogsForDate(dateKey));
    },
    [dateKey]
  );

  return { doses, runningTreatments, loaded, setDoseStatus, refreshDoses: fetchDoses };
}
