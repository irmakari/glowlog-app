import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { HistoryCalendar } from '../../components/HistoryCalendar';
import { DayStatsGrid } from '../../components/DayStatsGrid/DayStatsGrid';
import { MonthlyStats } from '../../components/MonthlyStats';
import { useHistoryMonth } from '../../hooks/useHistoryMonth';
import { historyService } from '../../services/historyService';
import { getWeekDays, getWeekStartKey, shiftDateKey } from '../../utils/calendar.utils';
import { DayHistorySummary } from '../../types/history.types';
import { getLocalDateString } from '../../../routines/utils/routineDate.utils';
import { styles } from './HistoryScreen.styles';
import { Colors } from '../../../../constants/colors';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../hooks/useTranslation';

export const HistoryScreen: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { language } = useTranslation();
  const todayKey = useMemo(() => getLocalDateString(), []);
  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayKey);
  const [calendarMode, setCalendarMode] = useState<'monthly' | 'weekly'>('monthly');
  const [additionalDays, setAdditionalDays] = useState<Record<string, DayHistorySummary>>({});

  const {
    history,
    stats,
    loading,
    canGoNext,
    showDate,
  } = useHistoryMonth();

  useEffect(() => {
    if (calendarMode !== 'weekly' || !history) return;
    let active = true;
    const neighboringMonths = new Map<string, [number, number]>();
    getWeekDays(selectedDateKey).forEach(({ dateKey }) => {
      const [year, month] = dateKey.split('-').map(Number);
      if (year !== history.year || month !== history.month) {
        neighboringMonths.set(`${year}-${month}`, [year, month]);
      }
    });
    if (neighboringMonths.size === 0) {
      return;
    }
    Promise.all([...neighboringMonths.values()].map(([year, month]) => historyService.getMonthHistory(year, month)))
      .then((months) => {
        if (active) setAdditionalDays(Object.assign({}, ...months.map((month) => month.days)));
      })
      .catch((error) => console.error('Failed to load adjacent week days:', error));
    return () => { active = false; };
  }, [calendarMode, history, selectedDateKey]);

  const handlePressDay = (dateKey: string) => {
    setSelectedDateKey(dateKey);
    showDate(dateKey);
  };

  const handlePrevCalendar = () => {
    if (calendarMode === 'weekly') {
      handlePressDay(shiftDateKey(selectedDateKey, -7));
    } else if (history) {
      const previousMonth = new Date(history.year, history.month - 2, 1);
      handlePressDay(getLocalDateString(previousMonth));
    }
  };

  const handleNextCalendar = () => {
    if (calendarMode === 'weekly') {
      handlePressDay(shiftDateKey(selectedDateKey, 7));
    } else if (history && canGoNext) {
      const nextMonth = new Date(history.year, history.month, 1);
      handlePressDay(getLocalDateString(nextMonth));
    }
  };

  const canGoNextCalendar = calendarMode === 'weekly'
    ? getWeekStartKey(selectedDateKey) < getWeekStartKey(todayKey)
    : canGoNext;

  const handleOpenDetails = () => {
    router.push(`/day/${selectedDateKey}`);
  };

  return (
    <Screen scrollable padding={12}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.title, { color: colors.text }]}>
            {language === 'tr' ? 'Geçmiş' : 'History'}
          </Text>
          <Ionicons name="sparkles-outline" size={20} color="#E59935" style={{ marginLeft: 6 }} />
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {language === 'tr' ? 'Aylık bakım yolculuğunuz' : 'Your month in glow'}
        </Text>
      </View>

      {/* Loading state */}
      {loading && !history ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.text} />
        </View>
      ) : history && stats ? (
        <View>
          {/* 1. History Calendar */}
          <HistoryCalendar
            history={history}
            selectedDateKey={selectedDateKey}
            mode={calendarMode}
            onChangeMode={setCalendarMode}
            additionalDays={additionalDays}
            canGoNext={canGoNextCalendar}
            onPrevMonth={handlePrevCalendar}
            onNextMonth={handleNextCalendar}
            onPressDay={handlePressDay}
          />

          {/* 2. Selected Day Statistics Grid ("This Day") */}
          <DayStatsGrid
            dateKey={selectedDateKey}
            onOpenDetails={handleOpenDetails}
          />

          {/* 3. Monthly Overview ("This Month") */}
          <MonthlyStats
            stats={stats}
            onOpenMonthlyReport={() => router.push(`/month/${history.year}/${history.month}`)}
            onOpenFullReports={() => router.push('/reports')}
          />
        </View>
      ) : null}
    </Screen>
  );
};
