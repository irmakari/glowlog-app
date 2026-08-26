import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { useDailySummary } from '../../hooks/useDailySummary';
import { getLocalDateString } from '../../../routines/utils/routineDate.utils';
import { calculateGlowScore } from '../../../../utils/glowScore';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

interface DayStatsGridProps {
  dateKey: string;
  onOpenDetails: () => void;
}

export const DayStatsGrid: React.FC<DayStatsGridProps> = ({ dateKey, onOpenDetails }) => {
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
        <ActivityIndicator size="small" color={Colors.text} />
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
          <Text style={styles.sectionTitle}>
            {isToday ? 'This Day (Today)' : summary.formattedDate}
          </Text>
          {isToday && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>Today</Text>
            </View>
          )}
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={onOpenDetails} style={styles.detailBtn}>
          <Text style={styles.detailBtnText}>View Details</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* 2x2 Day Stats Grid (Tapping any card opens details) */}
      <View style={styles.grid}>
        {/* Card 1: Routine Completion */}
        <TouchableOpacity activeOpacity={0.85} onPress={onOpenDetails} style={styles.touchableCard}>
          <GlowCard variant="pink" padding={12} style={styles.statCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardLabel}>ROUTINE</Text>
              <Ionicons name="sunny-outline" size={16} color={Colors.text} />
            </View>
            <Text style={styles.cardValue}>{stats.routinePercent}%</Text>
            <Text style={styles.cardSubtext}>
              {stats.completedCount} of {stats.totalCount} completed
            </Text>
          </GlowCard>
        </TouchableOpacity>

        {/* Card 2: Hydration */}
        <TouchableOpacity activeOpacity={0.85} onPress={onOpenDetails} style={styles.touchableCard}>
          <GlowCard variant="softBlue" padding={12} style={styles.statCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardLabel}>HYDRATION</Text>
              <Ionicons name="water-outline" size={16} color={Colors.text} />
            </View>
            <Text style={styles.cardValue}>{stats.hydration} gl</Text>
            <Text style={styles.cardSubtext}>
              {stats.hydration} of {stats.hydrationGoal} glasses
            </Text>
          </GlowCard>
        </TouchableOpacity>

        {/* Card 3: Glow Score */}
        <TouchableOpacity activeOpacity={0.85} onPress={onOpenDetails} style={styles.touchableCard}>
          <GlowCard variant="butterYellow" padding={12} style={styles.statCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardLabel}>GLOW SCORE</Text>
              <Ionicons name="sparkles-outline" size={16} color={Colors.text} />
            </View>
            <Text style={styles.cardValue}>{stats.glowScore.toFixed(1)}</Text>
            <Text style={styles.cardSubtext}>Daily Glow score</Text>
          </GlowCard>
        </TouchableOpacity>

        {/* Card 4: Products Used */}
        <TouchableOpacity activeOpacity={0.85} onPress={onOpenDetails} style={styles.touchableCard}>
          <GlowCard variant="softLilac" padding={12} style={styles.statCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardLabel}>PRODUCTS</Text>
              <Ionicons name="cube-outline" size={16} color={Colors.text} />
            </View>
            <Text style={styles.cardValue}>{stats.productsCount}</Text>
            <Text style={styles.cardSubtext}>
              {stats.productsCount === 1 ? '1 product logged' : `${stats.productsCount} products logged`}
            </Text>
          </GlowCard>
        </TouchableOpacity>
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
    gap: 10,
  },
  touchableCard: {
    width: '48%',
  },
  statCard: {
    minHeight: 90,
    justifyContent: 'space-between',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLabel: {
    ...Typography.caption,
    fontSize: 10,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  cardValue: {
    ...Typography.h1,
    fontSize: 22,
    color: Colors.text,
    marginVertical: 2,
  },
  cardSubtext: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
