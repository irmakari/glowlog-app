import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlowCard } from '../GlowCard';
import { StatCardProps } from './StatCard.types';
import { styles } from './StatCard.styles';
import { Colors } from '../../../constants/colors';
import { useTheme } from '../../../context/ThemeContext';

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  variant = 'cream',
  icon,
}) => {
  const { colors } = useTheme();

  return (
    <GlowCard variant={variant} padding={12} style={styles.card}>
      <View style={styles.contentCol}>
        <View style={styles.headerRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]} numberOfLines={1}>{label}</Text>
          {icon ? <Ionicons name={icon as any} size={15} color={colors.text} style={styles.icon} /> : null}
        </View>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
      </View>
    </GlowCard>
  );
};
