import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { RoutineItem } from '../../../../components/routine/RoutineItem';
import { ProductUsageList } from '../../components/ProductUsageList';
import { TreatmentCard } from '../../../treatments/components/TreatmentCard';
import { useDailySummary } from '../../hooks/useDailySummary';
import { getLocalDateString, parseDateKey } from '../../../routines/utils/routineDate.utils';
import { calculateDayGlowScore } from '../../../../utils/glowScore';
import { DailySummaryStepItem } from '../../types/history.types';
import { ColorVariant } from '../../../../constants/colors';
import { DailySummaryScreenProps } from './DailySummaryScreen.types';
import { styles } from './DailySummaryScreen.styles';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../hooks/useTranslation';

interface RoutineSectionProps {
  title: string;
  icon: 'sunny' | 'moon';
  variant: ColorVariant;
  steps: DailySummaryStepItem[];
  emptyText: string;
  editable: boolean;
  onToggle: (stepId: string, productId?: string) => void;
}

const RoutineSection: React.FC<RoutineSectionProps> = ({
  title,
  icon,
  variant,
  steps,
  emptyText,
  editable,
  onToggle,
}) => {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const completed = steps.filter((s) => s.completed).length;
  const ratio = steps.length > 0 ? completed / steps.length : 0;

  return (
    <GlowCard variant={variant} padding={16} style={styles.card}>
      <View style={styles.sectionHeader}>
        <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.7)' }]}>
          <Ionicons name={icon} size={17} color={colors.text} />
        </View>
        <View style={styles.flex1}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.sectionCaption, { color: colors.textSecondary }]}>
            {t('history.stepsCompleted', { completed, total: steps.length })}
          </Text>
        </View>
      </View>

      {steps.length === 0 ? (
        <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>{emptyText}</Text>
      ) : (
        <>
          <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.65)' }]}>
            <View style={[styles.progressFill, { width: `${ratio * 100}%`, backgroundColor: colors.text }]} />
          </View>
          <View style={[styles.listContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.55)' }]}>
            {steps.map((step, index) => (
              <RoutineItem
                key={step.id}
                id={step.id}
                title={step.title}
                productName={step.productName}
                isProductArchived={step.isProductArchived}
                completed={step.completed}
                onToggle={(id) => onToggle(id, step.productId)}
                isLast={index === steps.length - 1}
                disabled={!editable}
              />
            ))}
          </View>
        </>
      )}
    </GlowCard>
  );
};

export const DailySummaryScreen: React.FC<DailySummaryScreenProps> = ({ date }) => {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { language, t } = useTranslation();
  const formattedDate = date
    ? parseDateKey(date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : '';
  const { summary, loading, toggleStep, incrementWater, decrementWater } = useDailySummary(date);

  const isToday = date === getLocalDateString();

  // Today is always editable; past days are read-only until "Edit Day" is tapped
  const [isEditingPast, setIsEditingPast] = useState<boolean>(false);
  const isEditing = isToday || isEditingPast;

  const backButton = (
    <IconButton
      icon={<Ionicons name="arrow-back" size={20} color={colors.text} />}
      onPress={() => router.back()}
      variant="ghost"
      size={38}
    />
  );

  if (loading && !summary) {
    return (
      <Screen scrollable padding={16}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.text} />
        </View>
      </Screen>
    );
  }

  if (!summary) {
    return (
      <Screen scrollable padding={16}>
        <View style={styles.headerNav}>{backButton}</View>
        <Text style={[styles.title, { color: colors.text }]}>{t('history.summaryNotFound')}</Text>
      </Screen>
    );
  }

  const allSteps = [...summary.morningSteps, ...summary.eveningSteps];
  const completedCount = allSteps.filter((s) => s.completed).length;
  const routinePercent = allSteps.length > 0 ? Math.round((completedCount / allSteps.length) * 100) : 0;
  const glowScore = calculateDayGlowScore(completedCount, allSteps.length, summary.hydration, summary.hydrationGoal);

  const tileBg = colors.white;
  const overview = [
    { icon: 'sparkles' as const, tint: colors.butterYellow, value: glowScore.toFixed(1), label: t('history.glowScore') },
    { icon: 'checkmark-done' as const, tint: colors.pink, value: `${routinePercent}%`, label: t('history.routine') },
    { icon: 'water' as const, tint: colors.softBlue, value: `${summary.hydration}/${summary.hydrationGoal}`, label: t('history.hydration') },
  ];

  return (
    <Screen scrollable padding={16}>
      {/* Header */}
      <View style={styles.headerNav}>
        {backButton}
        <View style={styles.headerTextWrapper}>
          <View style={styles.rowCenter}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
              {formattedDate}
            </Text>
          </View>
          <View style={styles.rowCenter}>
            {isToday && (
              <View style={[styles.todayBadge, { backgroundColor: colors.sageGreen }]}>
                <Text style={[styles.todayBadgeText, { color: colors.text }]}>{t('common.today')}</Text>
              </View>
            )}
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {t('history.dailyLogSubtitle')}
            </Text>
          </View>
        </View>

        {!isToday && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setIsEditingPast((prev) => !prev)}
            accessibilityRole="button"
            style={[
              styles.editPill,
              isEditingPast
                ? { backgroundColor: colors.text }
                : { backgroundColor: colors.white },
            ]}
          >
            <Ionicons
              name={isEditingPast ? 'checkmark' : 'pencil'}
              size={14}
              color={isEditingPast ? colors.background : colors.text}
            />
            <Text style={[styles.editPillText, { color: isEditingPast ? colors.background : colors.text }]}>
              {isEditingPast ? t('common.done') : t('common.edit')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Day overview */}
      <View style={styles.overviewRow}>
        {overview.map((item) => (
          <View key={item.label} style={[styles.overviewTile, { backgroundColor: tileBg }]}>
            <View style={[styles.overviewIcon, { backgroundColor: item.tint }]}>
              <Ionicons name={item.icon} size={14} color={colors.text} />
            </View>
            <Text style={[styles.overviewValue, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
              {item.value}
            </Text>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]} numberOfLines={1} adjustsFontSizeToFit>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Past Day Edit Notice */}
      {!isToday && isEditingPast && (
        <GlowCard variant="butterYellow" padding={12} style={styles.noticeCard}>
          <View style={styles.rowCenter}>
            <Ionicons name="create-outline" size={16} color={colors.text} style={{ marginRight: 8 }} />
            <Text style={[styles.noticeText, { color: colors.text }]}>
              {t('history.editNotice', { date: formattedDate })}
            </Text>
          </View>
        </GlowCard>
      )}

      <RoutineSection
        title={t('history.morningRoutine')}
        icon="sunny"
        variant="pink"
        steps={summary.morningSteps}
        emptyText={t('history.noMorningSteps')}
        editable={isEditing}
        onToggle={toggleStep}
      />

      <RoutineSection
        title={t('history.eveningRoutine')}
        icon="moon"
        variant="softLilac"
        steps={summary.eveningSteps}
        emptyText={t('history.noEveningSteps')}
        editable={isEditing}
        onToggle={toggleStep}
      />

      <TreatmentCard dateKey={date} editable={isEditing} emptyText={t('treatments.noDosesOnDay')} />

      {/* Hydration Card */}
      <GlowCard variant="softBlue" padding={16} style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.7)' }]}>
            <Ionicons name="water" size={17} color={colors.text} />
          </View>
          <View style={styles.flex1}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('history.hydration')}</Text>
            <Text style={[styles.sectionCaption, { color: colors.textSecondary }]}>
              {t('history.glassesCount', { count: summary.hydration, goal: summary.hydrationGoal })}
            </Text>
          </View>
          {isEditing && (
            <View style={styles.waterControls}>
              <IconButton
                icon={<Ionicons name="remove" size={16} color={colors.text} />}
                onPress={decrementWater}
                backgroundColor={colors.white}
                size={34}
              />
              <IconButton
                icon={<Ionicons name="add" size={16} color={colors.text} />}
                onPress={incrementWater}
                backgroundColor={colors.white}
                size={34}
              />
            </View>
          )}
        </View>
        <View style={styles.dropsRow}>
          {Array.from({ length: summary.hydrationGoal }, (_, i) => (
            <Ionicons
              key={i}
              name={i < summary.hydration ? 'water' : 'water-outline'}
              size={18}
              color={i < summary.hydration ? '#5294E2' : colors.textMuted}
            />
          ))}
        </View>
      </GlowCard>

      {/* Products Used Card */}
      <ProductUsageList products={summary.productsUsed} />
    </Screen>
  );
};
