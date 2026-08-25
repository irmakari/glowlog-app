import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { GlowScoreBreakdown } from '../../types';

interface GlowRingProps {
  scoreBreakdown: GlowScoreBreakdown;
  size?: number;
}

export const GlowRing: React.FC<GlowRingProps> = ({
  scoreBreakdown,
  size = 150,
}) => {
  const scaleVal = useSharedValue(0.92);
  const opacityVal = useSharedValue(0);

  useEffect(() => {
    scaleVal.value = withSpring(1, { damping: 14, stiffness: 100 });
    opacityVal.value = withTiming(1, { duration: 300 });
  }, [scoreBreakdown.score]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleVal.value }],
    opacity: opacityVal.value,
  }));

  const routineActive = scoreBreakdown.routinePercent > 0;
  const hydrationActive = scoreBreakdown.hydrationPercent > 0;
  const streakActive = scoreBreakdown.streakScore > 0;
  const perfectGlow = scoreBreakdown.score >= 9.0;

  const innerSize = size - 32;

  return (
    <Animated.View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
        animatedStyle,
      ]}
    >
      {/* Pastel Arc 1: Pink (Morning Routine) */}
      <View
        style={[
          styles.segmentArc,
          styles.arcTopRight,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: routineActive ? Colors.pink : 'rgba(244, 182, 210, 0.35)',
          },
        ]}
      />

      {/* Pastel Arc 2: Butter Yellow (Evening Routine) */}
      <View
        style={[
          styles.segmentArc,
          styles.arcBottomRight,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: routineActive ? Colors.butterYellow : 'rgba(240, 214, 108, 0.35)',
          },
        ]}
      />

      {/* Pastel Arc 3: Soft Blue (Hydration) */}
      <View
        style={[
          styles.segmentArc,
          styles.arcBottomLeft,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: hydrationActive ? Colors.softBlue : 'rgba(191, 213, 242, 0.35)',
          },
        ]}
      />

      {/* Pastel Arc 4: Sage Green (Streak) */}
      <View
        style={[
          styles.segmentArc,
          styles.arcTopLeft,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: streakActive ? Colors.sageGreen : 'rgba(184, 203, 140, 0.35)',
          },
        ]}
      />

      {/* Floating Inner Circle */}
      <View
        style={[
          styles.innerCircle,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
          },
        ]}
      >
        <Text style={styles.scoreText}>
          {scoreBreakdown.score.toFixed(1)}
        </Text>
        <Text style={styles.scoreLabel}>today's glow</Text>

        {perfectGlow && (
          <View style={styles.sparkleBadge}>
            <Text style={styles.sparkleText}>✨</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  segmentArc: {
    position: 'absolute',
    borderWidth: 8,
    backgroundColor: 'transparent',
  },
  arcTopRight: {
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  arcBottomRight: {
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '135deg' }],
  },
  arcBottomLeft: {
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '225deg' }],
  },
  arcTopLeft: {
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '315deg' }],
  },
  innerCircle: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  scoreText: {
    fontSize: 38,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -1,
    lineHeight: 42,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.2,
    marginTop: -2,
  },
  sparkleBadge: {
    position: 'absolute',
    top: 6,
    right: 12,
  },
  sparkleText: {
    fontSize: 14,
  },
});
