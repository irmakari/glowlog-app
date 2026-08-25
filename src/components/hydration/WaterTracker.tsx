import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  return (
    <GlowCard variant="softBlue" padding={16} style={styles.card}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.caption}>Water today</Text>
        <Text style={styles.headline}>{current} of {goal} glasses</Text>
        <Text style={styles.subtext}>
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
              filled ? styles.cellFilled : styles.cellEmptyPlus,
            ]}
          >
            {filled ? (
              <Ionicons name="water" size={18} color={Colors.white} />
            ) : (
              <Ionicons name="add" size={18} color={Colors.text} />
            )}
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Target Goal Info Card (Pinterest Style) */}
      <View style={styles.targetGoalCard}>
        <View style={styles.targetTextCol}>
          <Text style={styles.targetTitle}>Daily goal: {goal} glasses</Text>
          <View style={styles.targetStatsRow}>
            <View>
              <Text style={styles.statValue}>1.8 l/d</Text>
              <Text style={styles.statLabel}>AVERAGE</Text>
            </View>
            <View>
              <Text style={styles.statValue}>2.0 l/d</Text>
              <Text style={styles.statLabel}>TARGET</Text>
            </View>
          </View>
        </View>

        {/* Decorative Water Droplet */}
        <View style={styles.decorIconBox}>
          <Ionicons name="water" size={32} color="rgba(33, 91, 166, 0.25)" />
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
    marginBottom: Spacing.sm,
  },
  caption: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  headline: {
    ...Typography.h1,
    fontSize: 26,
    lineHeight: 30,
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
    shadowColor: '#4A7BB8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
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
