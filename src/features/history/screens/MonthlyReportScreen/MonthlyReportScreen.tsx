import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { monthlyAnalyticsService, MonthlyAnalyticsData } from '../../services/monthlyAnalyticsService';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

interface MonthlyReportScreenProps {
  year: number;
  month: number;
}

export const MonthlyReportScreen: React.FC<MonthlyReportScreenProps> = ({ year, month }) => {
  const router = useRouter();

  const [data, setData] = useState<MonthlyAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const result = await monthlyAnalyticsService.getMonthlyAnalytics(year, month);
        setData(result);
      } catch (err) {
        console.error('Failed to load monthly analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [year, month]);

  if (loading && !data) {
    return (
      <Screen scrollable padding={16}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={Colors.text} />
        </View>
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen scrollable padding={16}>
        <View style={styles.headerNav}>
          <IconButton
            icon={<Ionicons name="arrow-back" size={20} color={Colors.text} />}
            onPress={() => router.back()}
            backgroundColor={Colors.white}
          />
        </View>
        <Text style={styles.title}>Report not found</Text>
      </Screen>
    );
  }

  const maxHydration = Math.max(8, ...data.dailyHydration.map((d) => d.glasses));

  return (
    <Screen scrollable padding={16}>
      {/* Top Header with Back Button */}
      <View style={styles.headerNav}>
        <IconButton
          icon={<Ionicons name="arrow-back" size={20} color={Colors.text} />}
          onPress={() => router.back()}
          backgroundColor={Colors.white}
          size={38}
          style={{ marginRight: 12 }}
        />
        <View style={styles.flex1}>
          <View style={styles.rowCenter}>
            <Text style={styles.title}>{data.formattedMonth}</Text>
            <Ionicons name="sparkles" size={18} color="#E59935" style={{ marginLeft: 6 }} />
          </View>
          <Text style={styles.subtitle}>Monthly Analytics & Habit Insights</Text>
        </View>
      </View>

      {/* 1. Routine Completion Progress Visual */}
      <GlowCard variant="pink" padding={16} style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.rowCenter}>
            <Ionicons name="sunny" size={18} color="#E59935" style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Routine Consistency</Text>
          </View>
          <Text style={styles.badgeText}>{data.completedDays} / {data.trackedDays} Days Complete</Text>
        </View>

        {/* Morning Progress */}
        <View style={styles.progressSection}>
          <View style={styles.rowBetween}>
            <Text style={styles.progressLabel}>Morning Routine</Text>
            <Text style={styles.progressValue}>{data.morningPercent}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${data.morningPercent}%`, backgroundColor: '#E59935' }]} />
          </View>
        </View>

        {/* Evening Progress */}
        <View style={styles.progressSection}>
          <View style={styles.rowBetween}>
            <Text style={styles.progressLabel}>Evening Routine</Text>
            <Text style={styles.progressValue}>{data.eveningPercent}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${data.eveningPercent}%`, backgroundColor: '#7C5CBF' }]} />
          </View>
        </View>

        {/* Day Distribution Chips */}
        <View style={styles.distributionRow}>
          <View style={styles.distChip}>
            <View style={[styles.distDot, { backgroundColor: Colors.sageGreen }]} />
            <Text style={styles.distText}>{data.completedDays} Full Days</Text>
          </View>
          <View style={styles.distChip}>
            <View style={[styles.distDot, { backgroundColor: Colors.butterYellow }]} />
            <Text style={styles.distText}>{data.partialDays} Partial</Text>
          </View>
          <View style={styles.distChip}>
            <View style={[styles.distDot, { backgroundColor: Colors.border }]} />
            <Text style={styles.distText}>{data.emptyDays} Rest</Text>
          </View>
        </View>
      </GlowCard>

      {/* 2. Hydration Bar Chart Trend */}
      <GlowCard variant="softBlue" padding={16} style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.rowCenter}>
            <Ionicons name="water" size={18} color="#5294E2" style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Daily Hydration Trend</Text>
          </View>
          <Text style={styles.badgeText}>Avg: {data.averageHydration} gl/day</Text>
        </View>
        <Text style={styles.cardDesc}>Glasses of water logged for each day of the month.</Text>

        {/* Bar Chart Container */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartScrollView}>
          <View style={styles.barChartContainer}>
            {data.dailyHydration.map((point) => {
              const heightPercent = maxHydration > 0 ? (point.glasses / maxHydration) * 100 : 0;
              const isGoalMet = point.glasses >= 8;
              return (
                <View key={point.day} style={styles.barCol}>
                  <Text style={styles.barValueText}>{point.glasses > 0 ? point.glasses : ''}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${Math.max(4, heightPercent)}%`,
                          backgroundColor: isGoalMet ? '#5294E2' : '#90C0F5',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barDayText}>{point.day}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </GlowCard>

      {/* 3. Top Skincare Products Leaderboard */}
      <GlowCard variant="softLilac" padding={16} style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.rowCenter}>
            <Ionicons name="trophy" size={18} color="#E59935" style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Most Used Products</Text>
          </View>
          <Text style={styles.badgeText}>This Month</Text>
        </View>
        <Text style={styles.cardDesc}>Your most frequently applied skincare products.</Text>

        {data.topProducts.length === 0 ? (
          <Text style={styles.emptyText}>No product usage logged for this month.</Text>
        ) : (
          <View style={styles.productsList}>
            {data.topProducts.map((prod, index) => (
              <View key={prod.productId} style={styles.productRow}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.productName}>{prod.name}</Text>
                  {prod.brand ? <Text style={styles.productBrand}>{prod.brand}</Text> : null}
                </View>
                <View style={styles.usageCountTag}>
                  <Ionicons name="sparkles" size={12} color={Colors.text} style={{ marginRight: 4 }} />
                  <Text style={styles.usageCountText}>{prod.usageCount}x</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </GlowCard>
    </Screen>
  );
};

const styles = StyleSheet.create({
  loadingBox: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  flex1: {
    flex: 1,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...Typography.h1,
    fontSize: 20,
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  card: {
    marginBottom: Spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    ...Typography.h3,
    fontSize: 16,
  },
  cardDesc: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  progressSection: {
    marginTop: Spacing.sm,
  },
  progressLabel: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: Colors.text,
  },
  progressValue: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  progressBarTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(21, 21, 21, 0.08)',
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: Spacing.md,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(21, 21, 21, 0.06)',
  },
  distChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  distText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  chartScrollView: {
    marginTop: Spacing.xs,
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 110,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 6,
  },
  barCol: {
    alignItems: 'center',
    width: 22,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barValueText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  barTrack: {
    width: 14,
    height: 70,
    backgroundColor: 'rgba(21, 21, 21, 0.06)',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barDayText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  productsList: {
    gap: 8,
    marginTop: 4,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 12,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.softLilac,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  productName: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: Colors.text,
  },
  productBrand: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  usageCountTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F5F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  usageCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyText: {
    ...Typography.body,
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
