import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlowRing } from './GlowRing';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { GlowScoreBreakdown } from '../../types';

interface GlowScoreCardProps {
  scoreBreakdown: GlowScoreBreakdown;
  currentHydration: number;
  hydrationGoal: number;
  streakDays: number;
}

export const GlowScoreCard: React.FC<GlowScoreCardProps> = ({
  scoreBreakdown,
  currentHydration,
  hydrationGoal,
  streakDays,
}) => {
  return (
    <View style={styles.heroContainer}>
      <Text style={styles.heroTitle}>Today's Glow ✨</Text>

      <View style={styles.ringWrapper}>
        <GlowRing scoreBreakdown={scoreBreakdown} size={170} />
      </View>

      {/* Floating Pill Action Badges (Reference UI Style) */}
      <View style={styles.pillRow}>
        <View style={[styles.pill, { backgroundColor: Colors.pink }]}>
          <Text style={styles.pillText}>
            Routine {scoreBreakdown.completedStepsCount}/{scoreBreakdown.totalStepsCount}
          </Text>
        </View>

        <View style={[styles.pill, { backgroundColor: Colors.softBlue }]}>
          <Text style={styles.pillText}>
            Water {currentHydration}/{hydrationGoal}
          </Text>
        </View>

        <View style={[styles.pill, { backgroundColor: Colors.butterYellow }]}>
          <Text style={styles.pillText}>
            🔥 {streakDays}d Streak
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  heroTitle: {
    ...Typography.h3,
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 4,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    letterSpacing: 0.2,
  },
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xs,
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Spacing.radiusPill,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
