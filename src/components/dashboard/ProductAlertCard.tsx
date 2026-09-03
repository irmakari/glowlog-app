import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlowCard } from '../ui/GlowCard';
import { PillButton } from '../ui/PillButton';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { useTheme } from '../../context/ThemeContext';

interface ProductAlertCardProps {
  title: string;
  message: string;
  actionText: string;
  onAction?: () => void;
}

export const ProductAlertCard: React.FC<ProductAlertCardProps> = ({
  title,
  message,
  actionText,
  onAction,
}) => {
  const { colors, isDark } = useTheme();
  const buttonBg = isDark ? 'rgba(255, 255, 255, 0.12)' : Colors.white;

  return (
    <GlowCard variant="softPeach" padding={12} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconCircle, { backgroundColor: buttonBg }]}>
            <Ionicons name="cube-outline" size={16} color={colors.text} />
          </View>
          <Text style={[Typography.h3, { color: colors.text }]}>{title}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: buttonBg }]}>
          <Text style={[styles.badgeText, { color: colors.text }]}>Notice</Text>
        </View>
      </View>

      <Text style={[styles.messageText, { color: colors.textSecondary }]}>{message}</Text>

      <PillButton
        title={actionText}
        onPress={onAction || (() => {})}
        variant="primary"
        size="sm"
        style={styles.actionButton}
      />
    </GlowCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  badge: {
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Spacing.radiusPill,
  },
  badgeText: {
    ...Typography.badge,
    fontSize: 10,
    color: Colors.text,
  },
  messageText: {
    ...Typography.body,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.text,
    marginBottom: 8,
  },
  actionButton: {
    alignSelf: 'flex-start',
  },
});
