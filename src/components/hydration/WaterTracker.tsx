import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { GlowCard } from '../ui/GlowCard';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { useTheme } from '../../context/ThemeContext';

interface WaterTrackerProps {
  current: number;
  goal?: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  current,
  goal = 8,
  onIncrement,
  onDecrement,
}) => {
  const { colors, isDark } = useTheme();
  const scaleVal = useSharedValue(1);

  const handleAdd = () => {
    if (current < goal) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      scaleVal.value = withSpring(0.92, {}, () => {
        scaleVal.value = withSpring(1);
      });
      onIncrement();
    }
  };

  const handleRemove = () => {
    if (current > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onDecrement();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleVal.value }],
  }));

  const remaining = Math.max(0, goal - current);
  const isGoalReached = current >= goal;

  const indicators = Array.from({ length: goal }, (_, i) => i < current);

  const buttonBg = isDark ? 'rgba(255, 255, 255, 0.12)' : Colors.white;

  return (
    <GlowCard variant="softBlue" padding={16} style={styles.card}>
      {/* Top Header matching RoutineCard style system */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconCircle, { backgroundColor: buttonBg }]}>
            <Ionicons name="water" size={16} color={colors.text} />
          </View>
          <View style={styles.titleTextCol}>
            <Text style={[Typography.h3, { color: colors.text }]}>Hydration</Text>
            <Text style={[styles.caption, { color: colors.textSecondary }]}>Water today</Text>
          </View>
        </View>

        <Text style={[styles.headline, { color: colors.text }]}>{current} of {goal} glasses</Text>
        <Text style={[styles.subtext, { color: colors.textSecondary }]}>
          {isGoalReached
            ? `Goal reached! You've drunk ${current}/${goal} glasses of water today. You are glowing 💧✨`
            : `You drank ${current}/${goal} glasses of water. Keep going, only ${remaining} ${remaining === 1 ? 'glass' : 'glasses'} left for today.`}
        </Text>
      </View>

      {/* Interactive Water Droplets & Plus Buttons Grid */}
      <Animated.View style={[styles.grid, animatedStyle]}>
        {indicators.map((filled, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => {
              if (filled) handleRemove();
              else handleAdd();
            }}
            style={[
              styles.dropletCell,
              filled ? styles.cellFilled : [styles.cellEmptyPlus, { backgroundColor: buttonBg }],
            ]}
          >
            {filled ? (
              <Ionicons name="water" size={18} color={Colors.white} />
            ) : (
              <Ionicons name="add" size={18} color={colors.text} />
            )}
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Target Goal Info Card */}
      <View
        style={[
          styles.targetGoalCard,
          {
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.55)',
            borderWidth: isDark ? 1 : 0,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
          },
        ]}
      >
        <View style={styles.targetTextCol}>
          <Text style={[styles.targetTitle, { color: colors.text }]}>Daily goal: {goal} glasses</Text>
          <View style={styles.targetStatsRow}>
            <View>
              <Text style={[styles.statValue, { color: colors.text }]}>1.8 l/d</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>AVERAGE</Text>
            </View>
            <View>
              <Text style={[styles.statValue, { color: colors.text }]}>2.0 l/d</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>TARGET</Text>
            </View>
          </View>
        </View>

        {/* Decorative Water Droplet */}
        <View style={styles.decorIconBox}>
          <Ionicons name="water" size={32} color={isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(33, 91, 166, 0.25)'} />
        </View>
      </View>
    </GlowCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
  },
  header: {
    marginBottom: Spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm + 2,
  },
  titleTextCol: {
    flex: 1,
  },
  caption: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  headline: {
    ...Typography.h1,
    fontSize: 24,
    lineHeight: 28,
    marginTop: 2,
    marginBottom: 4,
  },
  subtext: {
    ...Typography.body,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: Spacing.md,
    justifyContent: 'flex-start',
  },
  dropletCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellFilled: {
    backgroundColor: '#6BA4E8',
    ...Platform.select({
      ios: {
        shadowColor: '#4A7BB8',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cellEmptyPlus: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(107, 164, 232, 0.3)',
  },
  targetGoalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 18,
    padding: Spacing.md,
    marginTop: 4,
  },
  targetTextCol: {
    flex: 1,
  },
  targetTitle: {
    ...Typography.bodyBold,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 6,
  },
  targetStatsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  statValue: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: Colors.text,
  },
  statLabel: {
    ...Typography.caption,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  decorIconBox: {
    marginLeft: Spacing.md,
  },
});
