import React from 'react';
import { Text, View } from 'react-native';
import { GlowCard } from '../GlowCard';
import { StatCardProps } from './StatCard.types';
import { styles } from './StatCard.styles';

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  variant = 'cream',
}) => {
  return (
    <GlowCard variant={variant} padding={12} style={styles.card}>
      <View style={styles.contentCol}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </GlowCard>
  );
};
