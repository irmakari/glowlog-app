import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '../../../../components/ui/StatCard';
import { useDailySummary } from '../../hooks/useDailySummary';
import { getLocalDateString } from '../../../routines/utils/routineDate.utils';
import { calculateGlowScore } from '../../../../utils/glowScore';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';
import { useTheme } from '../../../../context/ThemeContext';

interface DayStatsGridProps {
  dateKey: string;
  onOpenDetails: () => void;
}

export const DayStatsGrid: React.FC<DayStatsGridProps> = ({ dateKey, onOpenDetails }) => {
  const { colors } = useTheme();
  const { summary, loading } = useDailySummary(dateKey);

  const todayKey = useMemo(() => getLocalDateString(), []);
  const isToday = dateKey === todayKey;

  const stats = useMemo(() => {
    if (!summary) return null;

    const allSteps = [...summary.morningSteps, ...summary.eveningSteps];
    const completedCount = allSteps.filter((s) => s.completed).length;
    const totalCount = allSteps.length;
    const routinePercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const glowBreakdown = calculateGlowScore({
      completedStepsCount: completedCount,
      totalStepsCount: totalCount,
      currentHydration: summary.hydration,
      hydrationGoal: summary.hydrationGoal,
      streakDays: 1, // Default preview weight for day
    });

    return {
      completedCount,
      totalCount,
      routinePercent,
      glowScore: glowBreakdown.score,
      hydration: summary.hydration,
      hydrationGoal: summary.hydrationGoal,
      productsCount: summary.productsUsed ? summary.productsUsed.length : 0,
    };
  }, [summary]);

  if (loading && !summary) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="small" color={colors.text} />
      </View>
    );
  }

  if (!summary || !stats) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.headerRow}>
        <View style={styles.rowCenter}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {isToday ? 'This Day (Today)' : summary.formattedDate}
          </Text>
          {isToday && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>Today</Text>
            </View>
          )}
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={onOpenDetails} style={styles.detailBtn}>
          <Text style={[styles.detailBtnText, { color: colors.textSecondary }]}>View Details</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* 2x2 Day Stats Grid */}
      <View style={styles.grid}>
        <StatCard
          label="Routine"
          value={`${stats.routinePercent}%`}
          subtitle={`${stats.completedCount} of ${stats.totalCount} completed`}
          variant="pink"
          icon="sunny-outline"
        />

        <StatCard
          label="Hydration"
          value={`${stats.hydration} gl`}
          subtitle={`${stats.hydration} of ${stats.hydrationGoal} glasses`}
          variant="softBlue"
          icon="water-outline"
        />

        <StatCard
          label="Glow Score"
          value={stats.glowScore.toFixed(1)}
          subtitle="Daily Glow score"
          variant="butterYellow"
          icon="sparkles-outline"
        />

        <StatCard
          label="Products"
          value={stats.productsCount}
          subtitle={stats.productsCount === 1 ? '1 product logged' : `${stats.productsCount} products logged`}
          variant="softLilac"
          icon="cube-outline"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  loadingBox: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.text,
  },
  todayBadge: {
    backgroundColor: Colors.sageGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  todayBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.text,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailBtnText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginRight: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
  },
});
