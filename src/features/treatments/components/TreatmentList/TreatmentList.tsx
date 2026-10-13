import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { PillButton } from '../../../../components/ui/PillButton';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useAddTreatment } from '../../hooks/useAddTreatment';
import { useTreatmentConflicts } from '../../hooks/useTreatmentConflicts';
import { useTreatments } from '../../hooks/useTreatments';
import { Treatment } from '../../types/treatment.types';
import { formatTreatmentDates, formatTreatmentSchedule, localeFor } from '../../utils/treatmentDisplay.utils';
import { isTreatmentFinished } from '../../utils/treatmentSchedule.utils';
import { TreatmentConflictNotice } from '../TreatmentConflictNotice';
import { styles } from './TreatmentList.styles';
import { TreatmentListProps } from './TreatmentList.types';

const TreatmentRow: React.FC<{ treatment: Treatment; finished: boolean; onPress: () => void }> = ({
  treatment,
  finished,
  onPress,
}) => {
  const { colors } = useTheme();
  const { language, t } = useTranslation();
  const locale = localeFor(language);

  return (
    <GlowCard
      variant={finished ? 'white' : 'softPeach'}
      padding={14}
      style={[styles.rowCard, finished && styles.rowCardFinished]}
      onPress={onPress}
    >
      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: finished ? colors.background : colors.white }]}>
          <Ionicons name={treatment.kind === 'oral' ? 'medical' : 'color-fill'} size={18} color={colors.text} />
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={1}>
            {treatment.name}
          </Text>
          <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {formatTreatmentSchedule(treatment, t, locale)}
          </Text>
          <Text style={[styles.rowMeta, { color: colors.textMuted }]} numberOfLines={1}>
            {formatTreatmentDates(treatment, t, locale)}
          </Text>
        </View>
        {treatment.reminderEnabled && !finished && (
          <Ionicons name="notifications" size={15} color={colors.textSecondary} />
        )}
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
    </GlowCard>
  );
};

/** Active and finished treatments with conflict tips; shared by the treatments modal and the shelf */
export const TreatmentList: React.FC<TreatmentListProps> = ({ showAddButton = true }) => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { treatments, loading } = useTreatments();
  const { conflicts, sunSensitive } = useTreatmentConflicts();
  const handleAdd = useAddTreatment();

  const active = treatments.filter((tr) => !isTreatmentFinished(tr));
  const finished = treatments.filter((tr) => isTreatmentFinished(tr));

  const openTreatment = (id: string) => router.push(`/treatments/edit?id=${encodeURIComponent(id)}`);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.text} />
      </View>
    );
  }

  if (treatments.length === 0) {
    return (
      <EmptyState
        emoji="💊"
        title={t('treatments.emptyTitle')}
        description={t('treatments.emptyDesc')}
        actionTitle={t('treatments.add')}
        onAction={handleAdd}
      />
    );
  }

  return (
    <>
      <TreatmentConflictNotice conflicts={conflicts} sunSensitive={sunSensitive} />

      {active.length > 0 && (
        <>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('treatments.activeSection')}</Text>
          {active.map((tr) => (
            <TreatmentRow key={tr.id} treatment={tr} finished={false} onPress={() => openTreatment(tr.id)} />
          ))}
        </>
      )}

      {showAddButton && (
        <PillButton
          title={t('treatments.add')}
          onPress={handleAdd}
          variant="primary"
          size="md"
          icon={<Ionicons name="add" size={18} color={colors.background} />}
          style={styles.addButton}
        />
      )}

      {finished.length > 0 && (
        <>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('treatments.finishedSection')}</Text>
          {finished.map((tr) => (
            <TreatmentRow key={tr.id} treatment={tr} finished onPress={() => openTreatment(tr.id)} />
          ))}
        </>
      )}
    </>
  );
};
