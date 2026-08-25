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
  goal: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  current,
  goal = 8,
  onIncrement,
  onDecrement,
}) => {
  const buttonScale = useSharedValue(1);

  const handleAdd = () => {
    if (current < goal) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      buttonScale.value = withSpring(0.94, {}, () => {
        buttonScale.value = withSpring(1);
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

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const indicators = Array.from({ length: goal }, (_, i) => i < current);

  return (
    <GlowCard variant="softBlue" padding={12} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="water" size={16} color={Colors.text} />
          </View>
          <View>
            <Text style={Typography.h3}>Hydration</Text>
            <Text style={styles.goalText}>{current} of {goal} glasses</Text>
          </View>
        </View>

        {current > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleRemove}
            style={styles.minusButton}
          >
            <Ionicons name="remove" size={16} color={Colors.text} />
          </TouchableOpacity>
        )}
      </View>

      {/* Single-row 8-droplet grid */}
      <View style={styles.indicatorRow}>
        {indicators.map((filled, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => {
              if (filled) handleRemove();
              else handleAdd();
            }}
            style={[
              styles.droplet,
              filled ? styles.dropletFilled : styles.dropletEmpty,
            ]}
          >
            <Ionicons
              name="water"
              size={13}
              color={filled ? Colors.white : Colors.textMuted}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Compact Action Button */}
      <Animated.View style={buttonAnimatedStyle}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleAdd}
          disabled={current >= goal}
          style={[
            styles.addButton,
            current >= goal && styles.addButtonDisabled,
          ]}
        >
          <Ionicons
            name="add-circle"
            size={16}
            color={current >= goal ? Colors.textMuted : Colors.white}
          />
          <Text
            style={[
              styles.addButtonText,
              current >= goal && styles.addButtonTextDisabled,
            ]}
          >
            {current >= goal ? 'Goal reached ✨' : '+ Add a glass'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </GlowCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: Spacing.xs,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm + 2,
  },
  goalText: {
    ...Typography.caption,
    fontSize: 11,
    marginTop: 1,
    color: Colors.textSecondary,
  },
  minusButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  droplet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropletFilled: {
    backgroundColor: Colors.text,
  },
  dropletEmpty: {
    backgroundColor: Colors.white,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.text,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.radiusPill,
    marginTop: 6,
  },
  addButtonDisabled: {
    backgroundColor: Colors.mutedGray,
  },
  addButtonText: {
    ...Typography.button,
    fontSize: 13,
    color: Colors.white,
    marginLeft: 4,
  },
  addButtonTextDisabled: {
    color: Colors.textMuted,
  },
});
