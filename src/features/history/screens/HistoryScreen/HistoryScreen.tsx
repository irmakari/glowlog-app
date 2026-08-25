import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../../../components/ui/Screen';
import { HistoryCalendar } from '../../components/HistoryCalendar';
import { MonthlyStats } from '../../components/MonthlyStats';
import { useHistoryMonth } from '../../hooks/useHistoryMonth';
import { styles } from './HistoryScreen.styles';
import { Colors } from '../../../../constants/colors';

export const HistoryScreen: React.FC = () => {
  const router = useRouter();
  const {
    history,
    stats,
    loading,
    canGoNext,
    goToPrevMonth,
    goToNextMonth,
  } = useHistoryMonth();

  const handlePressDay = (dateKey: string) => {
    router.push(`/day/${dateKey}`);
  };

  return (
    <Screen scrollable padding={12}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>History ✨</Text>
        <Text style={styles.subtitle}>Your month in glow</Text>
      </View>

      {/* Loading state */}
      {loading && !history ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.text} />
        </View>
      ) : history && stats ? (
        <View>
          <HistoryCalendar
            history={history}
            canGoNext={canGoNext}
            onPrevMonth={goToPrevMonth}
            onNextMonth={goToNextMonth}
            onPressDay={handlePressDay}
          />
          <MonthlyStats stats={stats} />
        </View>
      ) : null}
    </Screen>
  );
};
