import React from 'react';
import { Text } from 'react-native';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { PillButton } from '../../../../components/ui/PillButton';
import { EmptyShelfStateProps } from './EmptyShelfState.types';
import { styles } from './EmptyShelfState.styles';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../hooks/useTranslation';

export const EmptyShelfState: React.FC<EmptyShelfStateProps> = ({
  onAddProduct,
  style,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <GlowCard variant="cream" padding={20} style={[styles.card, style]}>
      <Text style={styles.emoji}>🧴</Text>
      <Text style={[styles.title, { color: colors.text }]}>{t('products.emptyShelfTitle')}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {t('products.emptyShelfDesc')}
      </Text>
      <PillButton
        title={t('products.firstProduct')}
        onPress={onAddProduct}
        variant="primary"
        size="md"
        style={styles.button}
      />
    </GlowCard>
  );
};
