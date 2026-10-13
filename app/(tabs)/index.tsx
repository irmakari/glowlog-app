import React, { useMemo, useState, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { GlowScoreCard } from '../../src/components/dashboard/GlowScoreCard';
import { StreakCard } from '../../src/components/dashboard/StreakCard';
import { RoutineCard } from '../../src/components/routine/RoutineCard';
import { WaterTracker } from '../../src/components/hydration/WaterTracker';
import { ProductAlertCard } from '../../src/components/dashboard/ProductAlertCard';
import { useTodayRoutine } from '../../src/features/routines/hooks/useTodayRoutine';
import { TreatmentCard } from '../../src/features/treatments/components/TreatmentCard';
import { Typography } from '../../src/constants/typography';
import { Spacing } from '../../src/constants/spacing';
import { Colors } from '../../src/constants/colors';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useTheme } from '../../src/context/ThemeContext';
import { parseDateKey } from '../../src/features/routines/utils/routineDate.utils';

export default function TodayScreen() {
  const router = useRouter();
  const { language, t } = useTranslation();
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
      };
    }, [])
  );

  const {
    todayDateStr,
    morningSteps,
    eveningSteps,
    hydrationCurrent,
    hydrationGoal,
    hydrationWeeklyAverage,
    expiredProductNames,
    userName,
    streakDays,
    completedDates,
    glowScoreBreakdown,
    toggleStep,
    completeAllSteps,
    incrementWater,
    decrementWater,
  } = useTodayRoutine();

  // Re-evaluated on focus and on day change so the greeting matches the current time of day
  const { greetingKey, iconName, iconColor } = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return { greetingKey: 'today.greetingMorning', iconName: 'sunny-outline', iconColor: '#E59935' };
    } else if (hours < 18) {
      return { greetingKey: 'today.greetingAfternoon', iconName: 'sunny', iconColor: '#E59935' };
    }
    return { greetingKey: 'today.greetingEvening', iconName: 'moon-outline', iconColor: '#7C5CBF' };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayDateStr, isFocused]);

  const greeting = t(greetingKey);

  const formattedDate = useMemo(() => {
    return parseDateKey(todayDateStr).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, [language, todayDateStr]);

  const displayGreeting = userName ? `${greeting}, ${userName}` : greeting;

  return (
    <Screen scrollable padding={Spacing.md}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextCol}>
          <Text style={[styles.dateCaption, { color: colors.textSecondary }]}>{formattedDate}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 1 }}>
            <Text style={[styles.greetingTitle, { color: colors.text }]}>{displayGreeting}</Text>
            <Ionicons name={iconName as any} size={22} color={iconColor} style={{ marginLeft: 6 }} />
          </View>
        </View>
      </View>

      {/* Hero Glow Score Card */}
      <GlowScoreCard
        scoreBreakdown={glowScoreBreakdown}
        currentHydration={hydrationCurrent}
        hydrationGoal={hydrationGoal}
        streakDays={streakDays}
        isFocused={isFocused}
      />

      {/* 7-Day Horizontal Streak Strip (Placed above Morning Routine) */}
      <StreakCard streakDays={streakDays} completedDates={completedDates} todayKey={todayDateStr} />

      {/* Morning Routine Card */}
      <RoutineCard
        type="morning"
        steps={morningSteps}
        onToggleStep={(id) => toggleStep(id, 'morning')}
        onCompleteAll={() => completeAllSteps('morning')}
      />

      {/* Evening Routine Card */}
      <RoutineCard
        type="evening"
        steps={eveningSteps}
        onToggleStep={(id) => toggleStep(id, 'evening')}
        onCompleteAll={() => completeAllSteps('evening')}
      />

      {/* Treatment doses: only while a treatment is running */}
      <TreatmentCard dateKey={todayDateStr} />

      {/* Hydration Card */}
      <WaterTracker
        current={hydrationCurrent}
        goal={hydrationGoal}
        weeklyAverage={hydrationWeeklyAverage}
        onIncrement={incrementWater}
        onDecrement={decrementWater}
      />

      {/* Product Notice Card: only when something on the shelf is past its PAO */}
      {expiredProductNames.length > 0 && (
        <ProductAlertCard
          title={t('today.shelfCheck')}
          message={
            expiredProductNames.length === 1
              ? t('today.expiredProductOne', { name: expiredProductNames[0] })
              : t('today.expiredProductMany', { count: expiredProductNames.length })
          }
          actionText={t('today.viewShelf')}
          onAction={() => router.push('/(tabs)/shelf')}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  headerTextCol: {
    flex: 1,
  },
  dateCaption: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  greetingTitle: {
    ...Typography.h1,
    fontSize: 24,
    lineHeight: 28,
    marginTop: 1,
  },
});
