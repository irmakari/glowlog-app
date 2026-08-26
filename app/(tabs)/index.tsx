import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export default function TodayScreen() {
  const router = useRouter();
  const {
    morningSteps,
    eveningSteps,
    hydrationCurrent,
    hydrationGoal,
    userName,
    streakDays,
    glowScoreBreakdown,
    toggleStep,
    incrementWater,
    decrementWater,
  } = useTodayRoutine();

  const { greeting, emoji } = useMemo(() => getTimeBasedGreeting(), []);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const displayGreeting = userName ? `${greeting}, ${userName}` : greeting;

  return (
    <Screen scrollable padding={Spacing.md}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextCol}>
          <Text style={styles.dateCaption}>{formattedDate}</Text>
          <Text style={styles.greetingTitle}>
            {displayGreeting} {emoji}
          </Text>
        </View>
        <IconButton
          icon={<Ionicons name="person-outline" size={18} color={Colors.text} />}
          onPress={() => router.push('/(tabs)/profile')}
          backgroundColor={Colors.white}
          size={36}
        />
      </View>

      {/* Hero Glow Score Card */}
      <GlowScoreCard
        scoreBreakdown={glowScoreBreakdown}
        currentHydration={hydrationCurrent}
        hydrationGoal={hydrationGoal}
        streakDays={streakDays}
      />

      {/* 7-Day Horizontal Streak Strip (Placed above Morning Routine) */}
      <StreakCard streakDays={streakDays} />

      {/* Morning Routine Card */}
      <RoutineCard
        type="morning"
        steps={morningSteps}
        onToggleStep={(id) => toggleStep(id, 'morning')}
      />

      {/* Evening Routine Card */}
      <RoutineCard
        type="evening"
        steps={eveningSteps}
        onToggleStep={(id) => toggleStep(id, 'evening')}
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
        title="Shelf check 🧴"
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
