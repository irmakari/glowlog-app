import React, { useState, useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { HistoryCalendar } from '../../components/HistoryCalendar';
import { DayStatsGrid } from '../../components/DayStatsGrid/DayStatsGrid';
import { MonthlyStats } from '../../components/MonthlyStats';
import { useHistoryMonth } from '../../hooks/useHistoryMonth';
import { getLocalDateString } from '../../../routines/utils/routineDate.utils';
import { styles } from './HistoryScreen.styles';
import { Colors } from '../../../../constants/colors';

export const HistoryScreen: React.FC = () => {
  const router = useRouter();
  const todayKey = useMemo(() => getLocalDateString(), []);
  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayKey);

  const {
    history,
    stats,
    loading,
    canGoNext,
    goToPrevMonth,
    goToNextMonth,
  } = useHistoryMonth();

  const handlePressDay = (dateKey: string) => {
    setSelectedDateKey(dateKey);
  };

  const handleOpenDetails = () => {
    router.push(`/day/${selectedDateKey}`);
  };

  return (
    <Screen scrollable padding={12}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.title}>History</Text>
          <Ionicons name="sparkles-outline" size={20} color={Colors.text} style={{ marginLeft: 6 }} />
        </View>
        <Text style={styles.subtitle}>Your month in glow</Text>
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
            onPrevMonth={goToPrevMonth}
            onNextMonth={goToNextMonth}
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
