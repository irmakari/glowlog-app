import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { GlowCard } from './GlowCard';
import { PillButton } from './PillButton';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Colors } from '../../constants/colors';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  emoji = '✨',
  title,
  description,
  actionTitle,
  onAction,
  style,
}) => {
  return (
    <GlowCard variant="cream" padding={Spacing.xl} style={[styles.card, style]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionTitle && onAction && (
        <PillButton
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          size="md"
          style={styles.button}
        />
      )}
    </GlowCard>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    marginVertical: Spacing.md,
  },
  emoji: {
    fontSize: 44,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h3,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: '85%',
  },
  button: {
    marginTop: Spacing.lg,
  },
});
