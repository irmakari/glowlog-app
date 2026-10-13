import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { Colors } from '../../../../constants/colors';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useTreatmentDoses } from '../../hooks/useTreatmentDoses';
import { TreatmentDose, TreatmentDoseStatus } from '../../types/treatment.types';
import { styles } from './TreatmentCard.styles';
import { TreatmentCardProps } from './TreatmentCard.types';

const INK = '#C2683A';

interface DoseRowProps {
  dose: TreatmentDose;
  editable: boolean;
  isLast: boolean;
  onSetStatus: (status: TreatmentDoseStatus | null) => void;
}

const DoseRow: React.FC<DoseRowProps> = ({ dose, editable, isLast, onSetStatus }) => {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const taken = dose.status === 'taken';
  const skipped = dose.status === 'skipped';
  const title = dose.treatment.name;

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSetStatus(taken ? null : 'taken');
  };

  return (
    <View
      style={[
        styles.row,
        !isLast && [styles.rowDivider, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(21,21,21,0.06)' }],
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleToggle}
        disabled={!editable}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: taken, disabled: !editable }}
        accessibilityLabel={`${title}, ${dose.slot}`}
        style={styles.rowMain}
      >
        <View
          style={[
            styles.checkbox,
            taken
              ? { backgroundColor: colors.text }
              : { borderWidth: 1.5, borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(21,21,21,0.28)' },
          ]}
        >
          {taken && <Ionicons name="checkmark" size={14} color={isDark ? colors.background : Colors.white} />}
        </View>
        <View style={styles.rowText}>
          <Text
            style={[styles.rowTitle, { color: colors.text }, (taken || skipped) && { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {dose.treatment.doseNote ? `${dose.slot} · ${dose.treatment.doseNote}` : dose.slot}
          </Text>
        </View>
      </TouchableOpacity>

      {skipped ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSetStatus(null)}
          disabled={!editable}
          accessibilityRole="button"
          accessibilityLabel={`${title}: ${t('treatments.undo')}`}
          style={[styles.statusPill, { backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(21,21,21,0.06)' }]}
        >
          <Text style={[styles.statusPillText, { color: colors.textSecondary }]}>{t('treatments.skipped')}</Text>
          {editable && <Ionicons name="arrow-undo" size={12} color={colors.textSecondary} />}
        </TouchableOpacity>
      ) : (
        !taken &&
        editable && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onSetStatus('skipped')}
            accessibilityRole="button"
            accessibilityLabel={`${title}: ${t('treatments.skip')}`}
            hitSlop={8}
          >
            <Text style={[styles.skipText, { color: colors.textSecondary }]}>{t('treatments.skip')}</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

/**
 * The day's doses with taken / skipped controls. Renders nothing when no treatment is
 * running that day and nothing was logged.
 */
export const TreatmentCard: React.FC<TreatmentCardProps> = ({ dateKey, editable = true, emptyText, style }) => {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const { doses, runningTreatments, loaded, setDoseStatus } = useTreatmentDoses(dateKey);

  if (!loaded || (doses.length === 0 && runningTreatments.length === 0)) return null;

  const frost = isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(255, 255, 255, 0.62)';
  const takenCount = doses.filter((d) => d.status === 'taken').length;

  return (
    <GlowCard variant="softPeach" padding={16} style={[styles.card, style]}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: frost }]}>
          <Ionicons name="medical" size={19} color={isDark ? colors.text : INK} />
        </View>
        <View style={styles.titleCol}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {t('treatments.cardTitle')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {doses.length > 0
              ? t('treatments.dosesTaken', { taken: takenCount, total: doses.length })
              : emptyText ?? t('treatments.noDosesToday')}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => router.push('/treatments')}
          accessibilityRole="button"
          accessibilityLabel={t('treatments.manage')}
          hitSlop={8}
          style={styles.menuButton}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {doses.length > 0 && (
        <View style={[styles.panel, { backgroundColor: frost }]}>
          {doses.map((dose, index) => (
            <DoseRow
              key={`${dose.treatment.id}|${dose.slot}`}
              dose={dose}
              editable={editable}
              isLast={index === doses.length - 1}
              onSetStatus={(status) => setDoseStatus(dose.treatment.id, dose.slot, status)}
            />
          ))}
        </View>
      )}
    </GlowCard>
  );
};
