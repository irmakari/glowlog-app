import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { monthlyAnalyticsService, MonthlyAnalyticsData } from '../../services/monthlyAnalyticsService';
import { getLocalDateString, parseDateKey } from '../../../routines/utils/routineDate.utils';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../hooks/useTranslation';

interface MonthlyReportScreenProps {
  year?: number;
  month?: number;
}

const STATUS_COLORS = {
  complete: '#B8CB8C',
  partial: '#F0D66C',
  empty: '#E2DDD2',
  future: '#E2DDD2',
} as const;

export const MonthlyReportScreen: React.FC<MonthlyReportScreenProps> = ({ year, month }) => {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { language, t } = useTranslation();
  const locale = language === 'tr' ? 'tr-TR' : 'en-US';

  const todayKey = getLocalDateString();
  const [todayYear, todayMonth] = todayKey.split('-').map(Number);
  const [currentYear, setCurrentYear] = useState<number>(year ?? todayYear);
  const [currentMonth, setCurrentMonth] = useState<number>(month ?? todayMonth);

  const [data, setData] = useState<MonthlyAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const canGoNext = currentYear < todayYear || (currentYear === todayYear && currentMonth < todayMonth);

  useEffect(() => {
    let cancelled = false;
    async function loadAnalytics() {
      try {
        setLoading(true);
        const result = await monthlyAnalyticsService.getMonthlyAnalytics(currentYear, currentMonth);
        if (!cancelled) setData(result);
      } catch (err) {
        console.error('Failed to load monthly analytics:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadAnalytics();
    return () => {
      cancelled = true;
    };
  }, [currentYear, currentMonth]);

  const shiftMonth = (delta: number) => {
    const next = new Date(currentYear, currentMonth - 1 + delta, 1);
    setCurrentYear(next.getFullYear());
    setCurrentMonth(next.getMonth() + 1);
  };

  const monthLabel = new Date(currentYear, currentMonth - 1, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const subtleTrack = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.7)';
  const tileBg = colors.white;

  const renderContent = () => {
    if (loading && !data) {
      return (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={colors.text} />
        </View>
      );
    }
    if (!data) {
      return <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('history.reportNotFound')}</Text>;
    }

    const consistency = data.trackedDays > 0 ? Math.round((data.completedDays / data.trackedDays) * 100) : 0;
    const goal = data.dailyHydration[0]?.goal ?? 8;
    const maxHydration = Math.max(goal, ...data.dailyHydration.map((d) => d.glasses));
    const loggedDays = data.dailyBreakdown.filter((d) => d.status !== 'future').reverse();

    const overview = [
      { icon: 'trending-up' as const, tint: colors.sageGreen, value: `${consistency}%`, label: t('history.routineConsistency') },
      { icon: 'water' as const, tint: colors.softBlue, value: String(data.averageHydration), label: t('history.averageWaterLabel') },
      { icon: 'checkmark-done' as const, tint: colors.pink, value: String(data.completedDays), label: t('history.completedLabel') },
    ];

    return (
      <>
        {/* Overview tiles */}
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

        {/* Routine breakdown */}
        <GlowCard variant="pink" padding={16} style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="sparkles" size={16} color={colors.text} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('history.routine')}</Text>
          </View>

          {[
            { label: t('history.morningRoutine'), value: data.morningPercent, icon: 'sunny' as const },
            { label: t('history.eveningRoutine'), value: data.eveningPercent, icon: 'moon' as const },
          ].map((row) => (
            <View key={row.label} style={styles.progressSection}>
              <View style={styles.rowBetween}>
                <View style={styles.rowCenter}>
                  <Ionicons name={row.icon} size={13} color={colors.textSecondary} style={{ marginRight: 5 }} />
                  <Text style={[styles.progressLabel, { color: colors.text }]}>{row.label}</Text>
                </View>
                <Text style={[styles.progressValue, { color: colors.text }]}>{row.value}%</Text>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: subtleTrack }]}>
                <View style={[styles.progressFill, { width: `${row.value}%`, backgroundColor: colors.text }]} />
              </View>
            </View>
          ))}

          <View style={[styles.distributionRow, { borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(21,21,21,0.06)' }]}>
            {[
              { color: STATUS_COLORS.complete, text: t('history.fullDays', { count: data.completedDays }) },
              { color: STATUS_COLORS.partial, text: t('history.partialDays', { count: data.partialDays }) },
              { color: colors.white, text: t('history.restDays', { count: data.emptyDays }) },
            ].map((chip) => (
              <View key={chip.text} style={styles.distChip}>
                <View style={[styles.distDot, { backgroundColor: chip.color }]} />
                <Text style={[styles.distText, { color: colors.textSecondary }]} numberOfLines={1}>{chip.text}</Text>
              </View>
            ))}
          </View>
        </GlowCard>

        {/* Hydration chart: bars flex to the card width, so no horizontal scrolling */}
        <GlowCard variant="softBlue" padding={16} style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.cardHeader}>
              <Ionicons name="water" size={16} color={colors.text} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>{t('history.hydrationTrend')}</Text>
            </View>
            <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
              {t('history.averagePerDay', { count: data.averageHydration })}
            </Text>
          </View>
          <View style={styles.chart}>
            {data.dailyHydration.map((point) => {
              const isFuture = point.dateKey > todayKey;
              const heightPercent = maxHydration > 0 ? (point.glasses / maxHydration) * 100 : 0;
              return (
                <View key={point.day} style={styles.barCol}>
                  <View style={[styles.barTrack, { backgroundColor: isFuture ? 'transparent' : subtleTrack }]}>
                    {point.glasses > 0 && (
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${Math.max(8, heightPercent)}%`,
                            backgroundColor: point.glasses >= point.goal ? '#5294E2' : '#90C0F5',
                          },
                        ]}
                      />
                    )}
                  </View>
                </View>
              );
            })}
          </View>
          {/* Axis labels sit under their own bar, so "10" really marks day 10 */}
          <View style={styles.chartAxis}>
            {data.dailyHydration.map((point) => (
              <View key={point.day} style={styles.axisCell}>
                {[1, 10, 20, data.totalDaysInMonth].includes(point.day) && (
                  <Text style={[styles.axisText, { color: colors.textSecondary }]} numberOfLines={1}>{point.day}</Text>
                )}
              </View>
            ))}
          </View>
        </GlowCard>

        {/* Top products */}
        <GlowCard variant="softLilac" padding={16} style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="trophy" size={16} color={colors.text} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('history.mostUsedProducts')}</Text>
          </View>
          {data.topProducts.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('history.noProductsThisMonth')}</Text>
          ) : (
            <View style={[styles.listContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.55)' }]}>
              {data.topProducts.map((prod, index) => (
                <View
                  key={prod.productId}
                  style={[styles.productRow, index < data.topProducts.length - 1 && styles.rowDivider]}
                >
                  <Text style={[styles.rankText, { color: colors.textSecondary }]}>{index + 1}</Text>
                  <View style={styles.flex1}>
                    {prod.brand ? (
                      <Text style={[styles.productBrand, { color: colors.textSecondary }]} numberOfLines={1}>{prod.brand}</Text>
                    ) : null}
                    <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>{prod.name}</Text>
                  </View>
                  <Text style={[styles.usageCountText, { color: colors.text }]}>{prod.usageCount}×</Text>
                </View>
              ))}
            </View>
          )}
        </GlowCard>

        {/* Day-by-day log, most recent first; future days are never listed */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('history.dailyLogsTitle')}</Text>
          <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>{t('history.dailyLogsDesc')}</Text>
        </View>
        <View style={[styles.dayList, { backgroundColor: colors.white }]}>
          {loggedDays.map((item, index) => {
            const isToday = item.dateKey === todayKey;
            return (
              <TouchableOpacity
                key={item.dateKey}
                activeOpacity={0.7}
                onPress={() => router.push(`/day/${item.dateKey}`)}
                accessibilityRole="button"
                style={[styles.dayRow, index < loggedDays.length - 1 && styles.rowDivider]}
              >
                <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
                <View style={styles.flex1}>
                  <View style={styles.rowCenter}>
                    <Text style={[styles.dayTitle, { color: colors.text }]} numberOfLines={1}>
                      {parseDateKey(item.dateKey).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'long' })}
                    </Text>
                    {isToday && (
                      <View style={[styles.todayBadge, { backgroundColor: colors.sageGreen }]}>
                        <Text style={[styles.todayBadgeText, { color: colors.text }]}>{t('common.today')}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.daySubtext, { color: colors.textSecondary }]} numberOfLines={1}>
                    {t('history.dailyLogSummary', { steps: `${item.completedSteps}/${item.totalSteps}`, water: item.hydration })}
                  </Text>
                </View>
                <View style={[styles.scorePill, { backgroundColor: colors.background }]}>
                  <Ionicons name="sparkles" size={11} color="#E59935" />
                  <Text style={[styles.scorePillText, { color: colors.text }]}>{item.glowScore.toFixed(1)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            );
          })}
        </View>
      </>
    );
  };

  return (
    <Screen scrollable padding={16}>
      {/* Header */}
      <View style={styles.headerNav}>
        <IconButton
          icon={<Ionicons name="arrow-back" size={20} color={colors.text} />}
          onPress={() => router.back()}
          variant="ghost"
          size={38}
        />
        <View style={styles.flex1}>
          <Text style={[styles.title, { color: colors.text }]}>{t('history.monthlyReportTitle')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>{t('history.reportSubtitle')}</Text>
        </View>
      </View>

      {/* Month selector */}
      <View style={[styles.monthSelector, { backgroundColor: colors.white }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => shiftMonth(-1)}
          accessibilityRole="button"
          accessibilityLabel={t('history.previousMonth')}
          style={[styles.monthArrow, { backgroundColor: colors.background }]}
        >
          <Ionicons name="chevron-back" size={18} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.monthTitle, { color: colors.text }]}>{monthLabel}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={!canGoNext}
          onPress={() => shiftMonth(1)}
          accessibilityRole="button"
          accessibilityLabel={t('history.nextMonth')}
          style={[styles.monthArrow, { backgroundColor: colors.background }, !canGoNext && styles.disabled]}
        >
          <Ionicons name="chevron-forward" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      {renderContent()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    minWidth: 0,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  loadingBox: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
    fontSize: 20,
    lineHeight: 24,
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 12,
    marginTop: 2,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Spacing.radiusPill,
    padding: 6,
    marginBottom: Spacing.md,
  },
  monthArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    ...Typography.h3,
    fontSize: 16,
    textTransform: 'capitalize',
  },
  disabled: {
    opacity: 0.3,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  overviewTile: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    borderRadius: Spacing.radiusMd,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  overviewIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewValue: {
    ...Typography.h3,
    fontSize: 18,
    marginTop: 6,
  },
  overviewLabel: {
    ...Typography.caption,
    fontSize: 11,
    marginTop: 1,
  },
  card: {
    marginVertical: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  cardTitle: {
    ...Typography.h3,
    fontSize: 16,
    flexShrink: 1,
  },
  badgeText: {
    ...Typography.caption,
    fontSize: 11,
  },
  progressSection: {
    marginTop: Spacing.md,
  },
  progressLabel: {
    ...Typography.bodyBold,
    fontSize: 13,
  },
  progressValue: {
    ...Typography.bodyBold,
    fontSize: 13,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  distributionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 6,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  distChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  distText: {
    ...Typography.caption,
    fontSize: 11,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 90,
    gap: 2,
    marginTop: Spacing.md,
  },
  barCol: {
    flex: 1,
    height: '100%',
  },
  barTrack: {
    flex: 1,
    borderRadius: 3,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 3,
  },
  chartAxis: {
    flexDirection: 'row',
    gap: 2,
    height: 14,
    marginTop: 6,
  },
  axisCell: {
    flex: 1,
  },
  axisText: {
    ...Typography.caption,
    fontSize: 10,
    position: 'absolute',
    left: -10,
    right: -10,
    textAlign: 'center',
  },
  listContainer: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 2,
    marginTop: Spacing.md,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: 10,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(21, 21, 21, 0.06)',
  },
  rankText: {
    ...Typography.h3,
    fontSize: 15,
    width: 16,
    textAlign: 'center',
  },
  productBrand: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  productName: {
    ...Typography.bodyBold,
    fontSize: 14,
  },
  usageCountText: {
    ...Typography.bodyBold,
    fontSize: 13,
  },
  emptyText: {
    ...Typography.body,
    fontSize: 13,
    marginTop: Spacing.sm,
  },
  sectionHeader: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    ...Typography.h3,
    fontSize: 18,
  },
  sectionDesc: {
    ...Typography.caption,
    fontSize: 12,
    marginTop: 2,
  },
  dayList: {
    borderRadius: Spacing.radiusLg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    paddingVertical: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dayTitle: {
    ...Typography.bodyBold,
    fontSize: 14,
    textTransform: 'capitalize',
    flexShrink: 1,
  },
  todayBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  todayBadgeText: {
    ...Typography.badge,
    fontSize: 9,
    letterSpacing: 0.2,
  },
  daySubtext: {
    ...Typography.caption,
    fontSize: 12,
    marginTop: 1,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  scorePillText: {
    ...Typography.bodyBold,
    fontSize: 12,
  },
});
