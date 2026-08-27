import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  isFocused?: boolean;
}

export const GlowScoreCard: React.FC<GlowScoreCardProps> = ({
  scoreBreakdown,
  currentHydration,
  hydrationGoal,
  streakDays,
  isFocused = true,
}) => {
  return (
    <View style={styles.heroContainer}>
      <View style={styles.titleRow}>
        <Text style={styles.heroTitle}>Today's Glow</Text>
        <Ionicons name="sparkles" size={16} color="#E59935" style={{ marginLeft: 4 }} />
      </View>

      <View style={styles.ringWrapper}>
        <GlowRing scoreBreakdown={scoreBreakdown} size={210} isFocused={isFocused} />
      </View>

      {/* Floating Pill Action Badges */}
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

        <View style={[styles.pill, { backgroundColor: Colors.butterYellow, flexDirection: 'row', alignItems: 'center' }]}>
          <Ionicons name="flame" size={13} color="#E56A35" style={{ marginRight: 4 }} />
          <Text style={styles.pillText}>
            {streakDays}d Streak
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  heroTitle: {
    ...Typography.h3,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textSecondary,
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
    ...Platform.select({
      ios: {
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
