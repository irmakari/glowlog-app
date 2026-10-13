import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { PillButton } from '../../../../components/ui/PillButton';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useTreatments } from '../../hooks/useTreatments';
import { Treatment } from '../../types/treatment.types';
import { ensureTreatmentDisclaimer } from '../../utils/treatmentDisclaimer';
import { formatTreatmentDates, formatTreatmentSchedule, localeFor } from '../../utils/treatmentDisplay.utils';
import { isTreatmentFinished } from '../../utils/treatmentSchedule.utils';
import { styles } from './TreatmentListScreen.styles';

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

export const TreatmentListScreen: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { treatments, loading } = useTreatments();

  const active = treatments.filter((tr) => !isTreatmentFinished(tr));
  const finished = treatments.filter((tr) => isTreatmentFinished(tr));

  const handleAdd = async () => {
    if (await ensureTreatmentDisclaimer(t)) router.push('/treatments/edit');
  };

  const openTreatment = (id: string) => router.push(`/treatments/edit?id=${encodeURIComponent(id)}`);

  return (
    <Screen scrollable padding={16} edges={['bottom', 'left', 'right']} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>{t('treatments.title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('treatments.subtitle')}</Text>
        </View>
        <IconButton
          icon={<Ionicons name="close" size={20} color={colors.text} />}
          onPress={() => router.back()}
          backgroundColor={colors.white}
          size={36}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.text} />
        </View>
      ) : treatments.length === 0 ? (
        <EmptyState
          emoji="💊"
          title={t('treatments.emptyTitle')}
          description={t('treatments.emptyDesc')}
          actionTitle={t('treatments.add')}
          onAction={handleAdd}
        />
      ) : (
        <>
          {active.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                {t('treatments.activeSection')}
              </Text>
              {active.map((tr) => (
                <TreatmentRow key={tr.id} treatment={tr} finished={false} onPress={() => openTreatment(tr.id)} />
              ))}
            </>
          )}

          <PillButton
            title={t('treatments.add')}
            onPress={handleAdd}
            variant="primary"
            size="md"
            icon={<Ionicons name="add" size={18} color={colors.background} />}
            style={styles.addButton}
          />

          {finished.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                {t('treatments.finishedSection')}
              </Text>
              {finished.map((tr) => (
                <TreatmentRow key={tr.id} treatment={tr} finished onPress={() => openTreatment(tr.id)} />
              ))}
            </>
          )}
        </>
      )}
    </Screen>
  );
};
