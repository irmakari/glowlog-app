import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlowCard } from '../ui/GlowCard';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';

interface StreakCardProps {
  streakDays: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({ streakDays }) => {
  return (
    <GlowCard variant="sageGreen" padding={12} style={styles.card}>
      <View style={styles.contentRow}>
        <View style={styles.flameCircle}>
          <Ionicons name="flame" size={18} color="#E86339" />
        </View>
        <View style={styles.textColumn}>
          <Text style={Typography.h3}>{streakDays} day routine streak</Text>
          <Text style={styles.subtext}>
            Keep your little ritual going ✨
          </Text>
        </View>
      </View>
    </GlowCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: Spacing.xs,
    flex: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flameCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm + 2,
  },
  textColumn: {
    flex: 1,
  },
  subtext: {
    ...Typography.caption,
    fontSize: 11,
    marginTop: 1,
    color: Colors.textSecondary,
  },
});
