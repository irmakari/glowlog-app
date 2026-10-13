import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import { TreatmentConflict } from '../../utils/treatmentConflicts';
import { styles } from './TreatmentConflictNotice.styles';
import { TreatmentConflictNoticeProps } from './TreatmentConflictNotice.types';

type Translate = (key: string, params?: Record<string, string | number>) => string;

const productLabel = (conflict: TreatmentConflict) =>
  conflict.product.brand ? `${conflict.product.brand} ${conflict.product.name}` : conflict.product.name;

export const conflictTitle = (conflict: TreatmentConflict, t: Translate) =>
  t('treatments.conflictPair', { treatment: conflict.treatment.name, product: productLabel(conflict) });

export const conflictMessage = (conflict: TreatmentConflict, t: Translate) =>
  t(`treatments.conflict_${conflict.treatment.activeKey}`, {
    actives: conflict.actives.map((a) => t(`productActives.${a}`)).join(', '),
  });

/**
 * Product / treatment clashes. `compact` is a single tappable line for cards; the full
 * version lists every clash plus sun-sensitivity tips.
 */
export const TreatmentConflictNotice: React.FC<TreatmentConflictNoticeProps> = ({
  conflicts,
  sunSensitive = [],
  compact = false,
  style,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  if (compact) {
    if (conflicts.length === 0) return null;

    const showDetails = () =>
      Alert.alert(
        t('treatments.headsUp'),
        [
          ...conflicts.map((c) => `${conflictTitle(c, t)}\n${conflictMessage(c, t)}`),
          t('treatments.conflictDisclaimer'),
        ].join('\n\n')
      );

    const first = conflictTitle(conflicts[0], t);
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={showDetails}
        accessibilityRole="button"
        style={[styles.compactRow, style]}
      >
        <Ionicons name="warning" size={14} color={colors.text} />
        <Text style={[styles.compactText, { color: colors.text }]} numberOfLines={1}>
          <Text style={styles.bold}>{t('treatments.headsUp')}: </Text>
          {conflicts.length > 1 ? `${first} +${conflicts.length - 1}` : first}
        </Text>
        <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
      </TouchableOpacity>
    );
  }

  if (conflicts.length === 0 && sunSensitive.length === 0) return null;

  return (
    <GlowCard variant="butterYellow" padding={14} style={[styles.card, style]}>
      {conflicts.map((conflict) => (
        <View key={`${conflict.treatment.id}|${conflict.product.id}`} style={styles.item}>
          <Ionicons name="warning" size={15} color={colors.text} style={styles.itemIcon} />
          <View style={styles.itemText}>
            <Text style={[styles.itemTitle, { color: colors.text }]}>{conflictTitle(conflict, t)}</Text>
            <Text style={[styles.itemBody, { color: colors.text }]}>{conflictMessage(conflict, t)}</Text>
          </View>
        </View>
      ))}
      {sunSensitive.map((treatment) => (
        <View key={`sun|${treatment.id}`} style={styles.item}>
          <Ionicons name="sunny" size={15} color={colors.text} style={styles.itemIcon} />
          <Text style={[styles.itemBody, styles.itemText, { color: colors.text }]}>
            {t('treatments.sunTip', { name: treatment.name })}
          </Text>
        </View>
      ))}
      <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>{t('treatments.conflictDisclaimer')}</Text>
    </GlowCard>
  );
};
