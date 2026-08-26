import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { GlowScoreBreakdown } from '../../types';

interface GlowRingProps {
  scoreBreakdown: GlowScoreBreakdown;
  size?: number;
}

export const GlowRing: React.FC<GlowRingProps> = ({
  scoreBreakdown,
  size = 210,
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

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2 - 10;
  const center = size / 2;

  // Function to calculate SVG arc path string with padding gap
  const getArcPath = (startAngleDeg: number, endAngleDeg: number) => {
    const startRad = ((startAngleDeg - 90) * Math.PI) / 180;
    const endRad = ((endAngleDeg - 90) * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArcFlag = endAngleDeg - startAngleDeg <= 180 ? '0' : '1';

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  // Compute exact coordinates for mini orbiting badge centers
  // Badge 1: Top Right (45°) -> center of Arc 1 (10° - 80°)
  // Badge 2: Bottom Right (135°) -> center of Arc 2 (100° - 170°)
  // Badge 3: Bottom Left (225°) -> center of Arc 3 (190° - 260°)
  // Badge 4: Top Left (315°) -> center of Arc 4 (280° - 350°)
  const badgeSize = 24;
  const badgeHalf = badgeSize / 2;

  const getBadgeStyle = (angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    const x = center + radius * Math.cos(rad);
    const y = center + radius * Math.sin(rad);
    return {
      left: x - badgeHalf,
      top: y - badgeHalf,
      width: badgeSize,
      height: badgeSize,
      borderRadius: badgeHalf,
    };
  };

  const routineActive = scoreBreakdown.routinePercent > 0;
  const hydrationActive = scoreBreakdown.hydrationPercent > 0;
  const streakActive = scoreBreakdown.streakScore > 0;
  const perfectGlow = scoreBreakdown.score >= 9.0;

  const innerSize = size - 64;
  const scoreFontSize = Math.round(size * 0.26);

  return (
    <Animated.View
      style={[
        styles.container,
        { width: size, height: size },
        animatedStyle,
      ]}
    >
      <Svg width={size} height={size}>
        {/* Arc 1: Pink (Morning Routine) - Top Right: 10° to 80° */}
        <Path
          d={getArcPath(10, 80)}
          stroke={Colors.pink}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          opacity={routineActive ? 1 : 0.4}
        />

        {/* Arc 2: Soft Lilac (Evening Routine) - Bottom Right: 100° to 170° */}
        <Path
          d={getArcPath(100, 170)}
          stroke={Colors.softLilac}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          opacity={routineActive ? 1 : 0.4}
        />

        {/* Arc 3: Soft Blue (Hydration) - Bottom Left: 190° to 260° */}
        <Path
          d={getArcPath(190, 260)}
          stroke={Colors.softBlue}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          opacity={hydrationActive ? 1 : 0.4}
        />

        {/* Arc 4: Sage Green (Streak) - Top Left: 280° to 350° */}
        <Path
          d={getArcPath(280, 350)}
          stroke={Colors.sageGreen}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          opacity={streakActive ? 1 : 0.4}
        />
      </Svg>

      {/* Mini Icon Badges Orbiting the Ring */}
      {/* 1. Morning Routine (Sun) - Top Right (45°) */}
      <View style={[styles.badgeCircle, getBadgeStyle(45), { backgroundColor: Colors.pink }]}>
        <Ionicons name="sunny" size={12} color={Colors.text} />
      </View>

      {/* 2. Evening Routine (Moon) - Bottom Right (135°) */}
      <View style={[styles.badgeCircle, getBadgeStyle(135), { backgroundColor: Colors.softLilac }]}>
        <Ionicons name="moon" size={12} color={Colors.text} />
      </View>

      {/* 3. Water Hydration (Water Drop) - Bottom Left (225°) */}
      <View style={[styles.badgeCircle, getBadgeStyle(225), { backgroundColor: Colors.softBlue }]}>
        <Ionicons name="water" size={12} color={Colors.text} />
      </View>

      {/* 4. Daily Streak (Flame) - Top Left (315°) */}
      <View style={[styles.badgeCircle, getBadgeStyle(315), { backgroundColor: Colors.sageGreen }]}>
        <Ionicons name="flame" size={12} color={Colors.text} />
      </View>

      {/* Floating Center Score Circle */}
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
        <Text style={[styles.scoreText, { fontSize: scoreFontSize, lineHeight: scoreFontSize + 4 }]}>
          {scoreBreakdown.score.toFixed(1)}
        </Text>
        <Text style={styles.scoreLabel}>today's glow</Text>

        {perfectGlow && (
          <View style={styles.sparkleBadge}>
            <Ionicons name="sparkles" size={14} color="#E59935" />
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
  badgeCircle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  innerCircle: {
    position: 'absolute',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  scoreText: {
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -1.5,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.2,
    marginTop: -2,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  sparkleBadge: {
    position: 'absolute',
    top: 8,
    right: 14,
  },
  sparkleText: {
    fontSize: 16,
  },
});
