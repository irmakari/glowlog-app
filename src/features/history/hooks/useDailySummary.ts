import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { historyService } from '../services/historyService';
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

  return {
    summary,
    loading,
    error,
    refreshSummary: fetchSummary,
  };
}
