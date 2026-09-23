import React from 'react';
import { Text } from 'react-native';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { PillButton } from '../../../../components/ui/PillButton';
import { EmptyShelfStateProps } from './EmptyShelfState.types';
import { styles } from './EmptyShelfState.styles';
import { useTheme } from '../../../../context/ThemeContext';

export const EmptyShelfState: React.FC<EmptyShelfStateProps> = ({
  onAddProduct,
  style,
}) => {
  const { colors } = useTheme();
  return (
    <GlowCard variant="cream" padding={20} style={[styles.card, style]}>
      <Text style={styles.emoji}>🧴</Text>
      <Text style={[styles.title, { color: colors.text }]}>Your shelf is looking a little empty</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Add the skincare products you&apos;re currently using to track opened dates and daily usage.
      </Text>
      <PillButton
        title="Add my first product"
        onPress={onAddProduct}
        variant="primary"
        size="md"
        style={styles.button}
      />
    </GlowCard>
  );
};
