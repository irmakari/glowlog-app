import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { historyService } from '../services/historyService';
import { MonthlyHistory, MonthlyStats } from '../types/history.types';
import { getLocalDateString } from '../../routines/utils/routineDate.utils';

export function useHistoryMonth() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1); // 1-indexed

  const [history, setHistory] = useState<MonthlyHistory | null>(null);
  const [stats, setStats] = useState<MonthlyStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [hData, sData] = await Promise.all([
        historyService.getMonthHistory(currentYear, currentMonth),
        historyService.getMonthlyStats(currentYear, currentMonth),
      ]);
      setHistory(hData);
      setStats(sData);
    } catch (err: any) {
      console.error('Failed to load month history:', err);
      setError('We couldn’t load this month’s glow history.');
    } finally {
      setLoading(false);
    }
  }, [currentYear, currentMonth]);

  useFocusEffect(
    useCallback(() => {
      fetchMonthData();
    }, [fetchMonthData])
  );

  const canGoNext = useCallback(() => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    if (currentYear > todayYear) return false;
    if (currentYear === todayYear && currentMonth >= todayMonth) return false;
    return true;
  }, [currentYear, currentMonth]);

  const goToPrevMonth = useCallback(() => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  const goToNextMonth = useCallback(() => {
    if (!canGoNext()) return;
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth, canGoNext]);

  return {
    currentYear,
    currentMonth,
    history,
    stats,
    loading,
    error,
    canGoNext: canGoNext(),
    goToPrevMonth,
    goToNextMonth,
    refreshHistory: fetchMonthData,
  };
}
