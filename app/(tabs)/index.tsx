import React, { useMemo, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { IconButton } from '../../src/components/ui/IconButton';
import { GlowScoreCard } from '../../src/components/dashboard/GlowScoreCard';
import { StreakCard } from '../../src/components/dashboard/StreakCard';
import { RoutineCard } from '../../src/components/routine/RoutineCard';
import { WaterTracker } from '../../src/components/hydration/WaterTracker';
import { ProductAlertCard } from '../../src/components/dashboard/ProductAlertCard';
import { useTodayRoutine } from '../../src/features/routines/hooks/useTodayRoutine';
import { getTimeBasedGreeting } from '../../src/utils/glowScore';
import { Typography } from '../../src/constants/typography';
import { Spacing } from '../../src/constants/spacing';
import { Colors } from '../../src/constants/colors';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useTheme } from '../../src/context/ThemeContext';

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
    morningSteps,
    eveningSteps,
    hydrationCurrent,
    hydrationGoal,
    userName,
    streakDays,
    glowScoreBreakdown,
    toggleStep,
    completeAllSteps,
    incrementWater,
    decrementWater,
  } = useTodayRoutine();

  const { greetingEn, greetingTr, iconName, iconColor } = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return { greetingEn: 'Good morning', greetingTr: 'Günaydın', iconName: 'sunny-outline', iconColor: '#E59935' };
    } else if (hours < 17) {
      return { greetingEn: 'Good afternoon', greetingTr: 'Tünaydın', iconName: 'sunny', iconColor: '#E59935' };
    } else {
      return { greetingEn: 'Good evening', greetingTr: 'İyi akşamlar', iconName: 'moon-outline', iconColor: '#7C5CBF' };
    }
  }, []);

  const greeting = language === 'tr' ? greetingTr : greetingEn;

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, [language]);

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
        <IconButton
          icon={<Ionicons name="person-outline" size={18} color={colors.text} />}
          onPress={() => router.push('/(tabs)/profile')}
          backgroundColor={colors.white}
          size={36}
        />
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
      <StreakCard streakDays={streakDays} />

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

      {/* Hydration Card */}
      <WaterTracker
        current={hydrationCurrent}
        goal={hydrationGoal}
        onIncrement={incrementWater}
        onDecrement={decrementWater}
      />

      {/* Product Notice Card */}
      <ProductAlertCard
        title="Shelf check"
        message="Check opened product dates on your Shelf periodically."
        actionText="View Shelf"
        onAction={() => router.push('/(tabs)/shelf')}
      />
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
