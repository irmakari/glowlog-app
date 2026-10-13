import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDailySummary } from '../../hooks/useDailySummary';
import { getLocalDateString, parseDateKey } from '../../../routines/utils/routineDate.utils';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { calculateDayGlowScore } from '../../../../utils/glowScore';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../hooks/useTranslation';

interface DayStatsGridProps {
  dateKey: string;
  onOpenDetails: () => void;
}

export const DayStatsGrid: React.FC<DayStatsGridProps> = ({ dateKey, onOpenDetails }) => {
  const { colors, isDark } = useTheme();
  const { language, t } = useTranslation();
  const { summary, loading } = useDailySummary(dateKey);
  const isToday = dateKey === getLocalDateString();

  const stats = useMemo(() => {
    if (!summary) return null;

    const allSteps = [...summary.morningSteps, ...summary.eveningSteps];
    const completedCount = allSteps.filter((step) => step.completed).length;
    const totalCount = allSteps.length;
    const routinePercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const glowScore = calculateDayGlowScore(completedCount, totalCount, summary.hydration, summary.hydrationGoal);

    return {
      completedCount,
      totalCount,
      routinePercent,
      glowScore,
      hydration: summary.hydration,
      hydrationGoal: summary.hydrationGoal,
      productsCount: summary.productsUsed?.length ?? 0,
    };
  }, [summary]);

  if (loading && !summary) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="small" color={colors.text} />
      </View>
    );
  }

  if (!stats) return null;

  const dateTitle = isToday
    ? t('history.thisDayToday')
    : parseDateKey(dateKey).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });

  const tileBg = isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.6)';
  const secondaryStats = [
    { icon: 'water' as const, label: t('history.hydration'), value: `${stats.hydration}/${stats.hydrationGoal}`, tint: colors.softBlue },
    { icon: 'sparkles' as const, label: t('history.glowScore'), value: stats.glowScore.toFixed(1), tint: colors.butterYellow },
    { icon: 'cube' as const, label: t('history.products'), value: String(stats.productsCount), tint: colors.softLilac },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]} numberOfLines={1}>{dateTitle}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onOpenDetails}
          accessibilityRole="button"
          hitSlop={8}
          style={styles.detailBtn}
        >
          <Text style={[styles.detailBtnText, { color: colors.textSecondary }]}>{t('common.viewDetails')}</Text>
          <Ionicons name="chevron-forward" size={15} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <GlowCard variant="pink" padding={Spacing.lg} style={styles.card} onPress={onOpenDetails}>
        <View style={styles.heroTop}>
          <View style={styles.heroLabelRow}>
            <Ionicons name="checkmark-done" size={16} color={colors.text} />
            <Text style={[styles.metricLabel, { color: colors.text }]}>{t('history.routine')}</Text>
          </View>
          <Text style={[styles.progressCaption, { color: colors.textSecondary }]} numberOfLines={1}>
            {t('history.stepsCompleted', { completed: stats.completedCount, total: stats.totalCount })}
          </Text>
        </View>
        <Text style={[styles.progressValue, { color: colors.text }]}>{stats.routinePercent}%</Text>
        <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.7)' }]}>
          <View style={[styles.progressFill, { width: `${stats.routinePercent}%`, backgroundColor: colors.text }]} />
        </View>

        <View style={styles.metricsRow}>
          {secondaryStats.map((item) => (
            <View key={item.label} style={[styles.metric, { backgroundColor: tileBg }]}>
              <View style={[styles.metricIcon, { backgroundColor: item.tint }]}>
                <Ionicons name={item.icon} size={14} color={colors.text} />
              </View>
              <Text style={[styles.metricValue, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
                {item.value}
              </Text>
              <Text style={[styles.metricName, { color: colors.textSecondary }]} numberOfLines={1} adjustsFontSizeToFit>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </GlowCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  loadingBox: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    ...Typography.h3,
    fontSize: 18,
    flexShrink: 1,
    textTransform: 'capitalize',
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 36,
  },
  detailBtnText: {
    ...Typography.caption,
    fontSize: 12,
  },
  card: {
    marginTop: Spacing.xs,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  heroLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricLabel: {
    ...Typography.bodyBold,
    fontSize: 14,
  },
  progressValue: {
    ...Typography.h1,
    fontSize: 40,
    lineHeight: 46,
    marginTop: Spacing.sm,
  },
  progressCaption: {
    ...Typography.caption,
    fontSize: 12,
    flexShrink: 1,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  metricsRow: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  metric: {
    flex: 1,
    minWidth: 0,
    borderRadius: Spacing.radiusSm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  metricIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    ...Typography.h3,
    fontSize: 17,
    marginTop: 6,
  },
  metricName: {
    ...Typography.caption,
    fontSize: 11,
    marginTop: 1,
  },
});
