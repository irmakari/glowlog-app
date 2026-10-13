import React, { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../../../../components/ui/Screen';
import { HistoryCalendar } from '../../components/HistoryCalendar';
import { DayStatsGrid } from '../../components/DayStatsGrid/DayStatsGrid';
import { MonthlyStats } from '../../components/MonthlyStats';
import { useHistoryMonth } from '../../hooks/useHistoryMonth';
import { getLocalDateString } from '../../../routines/utils/routineDate.utils';
import { styles } from './HistoryScreen.styles';
import { Colors } from '../../../../constants/colors';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../hooks/useTranslation';

export const HistoryScreen: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const todayKey = getLocalDateString();
  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayKey);

  const {
    history,
    stats,
    loading,
    canGoNext,
    showDate,
  } = useHistoryMonth();

  const handlePressDay = (dateKey: string) => {
    setSelectedDateKey(dateKey);
    showDate(dateKey);
  };

  const handlePrevCalendar = () => {
    if (history) {
      const previousMonth = new Date(history.year, history.month - 2, 1);
      handlePressDay(getLocalDateString(previousMonth));
    }
  };

  const handleNextCalendar = () => {
    if (history && canGoNext) {
      const nextMonth = new Date(history.year, history.month, 1);
      handlePressDay(getLocalDateString(nextMonth));
    }
  };

  const handleOpenDetails = () => {
    router.push(`/day/${selectedDateKey}`);
  };

  const isViewingToday = selectedDateKey === todayKey;

  return (
    <Screen scrollable padding={12}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextCol}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>{t('history.title')}</Text>
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('history.subtitle')}</Text>
        </View>
        {!isViewingToday && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handlePressDay(todayKey)}
            accessibilityRole="button"
            style={[styles.todayPill, { backgroundColor: colors.white }]}
          >
            <Ionicons name="today-outline" size={15} color={colors.text} />
            <Text style={[styles.todayPillText, { color: colors.text }]}>{t('common.today')}</Text>
          </TouchableOpacity>
        )}
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
            canGoNext={canGoNext}
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
          />
        </View>
      ) : null}
    </Screen>
  );
};
