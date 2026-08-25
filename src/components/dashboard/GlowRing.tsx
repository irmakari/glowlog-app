import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
  size = 170,
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

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2 - 8;
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

  const routineActive = scoreBreakdown.routinePercent > 0;
  const hydrationActive = scoreBreakdown.hydrationPercent > 0;
  const streakActive = scoreBreakdown.streakScore > 0;
  const perfectGlow = scoreBreakdown.score >= 9.0;

  const innerSize = size - 54;

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
      {/* 1. Morning Routine (Sun) - Top Right */}
      <View style={[styles.badgeCircle, { top: 12, right: 18, backgroundColor: Colors.pink }]}>
        <Ionicons name="sunny" size={10} color={Colors.text} />
      </View>

      {/* 2. Evening Routine (Moon) - Bottom Right */}
      <View style={[styles.badgeCircle, { bottom: 12, right: 18, backgroundColor: Colors.softLilac }]}>
        <Ionicons name="moon" size={10} color={Colors.text} />
      </View>

      {/* 3. Water Hydration (Water Drop) - Bottom Left */}
      <View style={[styles.badgeCircle, { bottom: 12, left: 18, backgroundColor: Colors.softBlue }]}>
        <Ionicons name="water" size={10} color={Colors.text} />
      </View>

      {/* 4. Daily Streak (Flame) - Top Left */}
      <View style={[styles.badgeCircle, { top: 12, left: 18, backgroundColor: Colors.sageGreen }]}>
        <Ionicons name="flame" size={10} color={Colors.text} />
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
  badgeCircle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  innerCircle: {
    position: 'absolute',
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
    fontSize: 40,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -1.5,
    lineHeight: 44,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.2,
    marginTop: -2,
    fontFamily: 'PlusJakartaSans_600SemiBold',
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
