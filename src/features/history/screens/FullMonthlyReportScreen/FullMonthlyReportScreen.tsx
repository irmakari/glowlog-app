import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { monthlyAnalyticsService, MonthlyAnalyticsData } from '../../services/monthlyAnalyticsService';
import { getLocalDateString } from '../../../routines/utils/routineDate.utils';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const FullMonthlyReportScreen: React.FC = () => {
  const router = useRouter();

  const todayKey = getLocalDateString();
  const [todayYear, todayMonthNum] = todayKey.split('-').map(Number);

  const [currentYear, setCurrentYear] = useState<number>(todayYear);
  const [currentMonth, setCurrentMonth] = useState<number>(todayMonthNum);

  const [data, setData] = useState<MonthlyAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isCurrentOrFutureMonth = currentYear > todayYear || (currentYear === todayYear && currentMonth >= todayMonthNum);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const result = await monthlyAnalyticsService.getMonthlyAnalytics(currentYear, currentMonth);
        setData(result);
      } catch (err) {
        console.error('Failed to load monthly analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (isCurrentOrFutureMonth) return;
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  return (
    <Screen scrollable padding={16}>
      {/* Top Header */}
      <View style={styles.headerNav}>
        <IconButton
          icon={<Ionicons name="arrow-back" size={20} color={Colors.text} />}
          onPress={() => router.back()}
          backgroundColor={Colors.white}
          size={38}
          style={{ marginRight: 12 }}
        />
        <View style={styles.flex1}>
          <Text style={styles.headerTitle}>Full Monthly Reports</Text>
          <Text style={styles.headerSubtitle}>Select month to view daily logs</Text>
        </View>
      </View>

      {/* Month Selector Filter (< August 2026 >) */}
      <View style={styles.monthSelectorBox}>
        <TouchableOpacity activeOpacity={0.7} onPress={handlePrevMonth} style={styles.monthArrow}>
          <Ionicons name="chevron-back" size={18} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.monthTitleWrapper}>
          <Text style={styles.monthPickerTitle}>{data ? data.formattedMonth : 'Loading...'}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={isCurrentOrFutureMonth}
          onPress={handleNextMonth}
          style={[styles.monthArrow, isCurrentOrFutureMonth && styles.monthArrowDisabled]}
        >
          <Ionicons name="chevron-forward" size={18} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Loading state */}
      {loading && !data ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={Colors.text} />
        </View>
      ) : data ? (
        <View style={styles.contentContainer}>
          {/* Quick Summary Chips */}
          <View style={styles.statsSummaryRow}>
            <View style={styles.summaryChip}>
              <Text style={styles.chipVal}>{data.completedDays}d</Text>
              <Text style={styles.chipLbl}>Completed</Text>
            </View>
            <View style={styles.summaryChip}>
              <Text style={styles.chipVal}>{data.averageHydration}gl</Text>
              <Text style={styles.chipLbl}>Avg Water</Text>
            </View>
            <View style={styles.summaryChip}>
              <Text style={styles.chipVal}>{data.topProducts.length}</Text>
              <Text style={styles.chipLbl}>Products</Text>
            </View>
          </View>

          {/* Daily Logs Section Header */}
          <Text style={styles.dailyLogsHeader}>Daily Logs ({data.formattedMonth})</Text>
          <Text style={styles.dailyLogsDesc}>Tap any day to view or edit step details.</Text>

          {/* Day by Day Log List */}
          {data.dailyBreakdown.map((item) => {
            const isToday = item.dateKey === todayKey;

            return (
              <TouchableOpacity
                key={item.dateKey}
                activeOpacity={0.8}
                onPress={() => router.push(`/day/${item.dateKey}`)}
                style={[styles.dailyRowCard, isToday && styles.dailyRowCardToday]}
              >
                <View style={styles.rowBetween}>
                  <View style={styles.rowCenter}>
                    <View
                      style={[
                        styles.statusDotLarge,
                        item.status === 'complete' && { backgroundColor: Colors.sageGreen },
                        item.status === 'partial' && { backgroundColor: Colors.butterYellow },
                        (item.status === 'empty' || item.status === 'future') && { backgroundColor: Colors.border },
                      ]}
                    />
                    <View>
                      <View style={styles.rowCenter}>
                        <Text style={styles.dailyDateTitle}>{item.formattedDate}</Text>
                        {isToday && (
                          <View style={styles.todayBadgeSmall}>
                            <Text style={styles.todayBadgeSmallText}>Today</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.dailySubtext}>
                        {item.completedSteps} / {item.totalSteps} steps • {item.hydration} gl water
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rowCenter}>
                    <View style={styles.scorePill}>
                      <Ionicons name="sparkles" size={11} color="#E59935" style={{ marginRight: 3 }} />
                      <Text style={styles.scorePillText}>{item.glowScore.toFixed(1)}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} style={{ marginLeft: 6 }} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
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
  headerTitle: {
    ...Typography.h1,
    fontSize: 20,
    color: Colors.text,
  },
  headerSubtitle: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  monthSelectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  monthArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthArrowDisabled: {
    opacity: 0.3,
  },
  monthTitleWrapper: {
    alignItems: 'center',
  },
  monthPickerTitle: {
    ...Typography.h2,
    fontSize: 16,
    color: Colors.text,
  },
  loadingBox: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  contentContainer: {
    marginBottom: Spacing.xl,
  },
  statsSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: Spacing.lg,
  },
  summaryChip: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipVal: {
    ...Typography.h2,
    fontSize: 16,
    color: Colors.text,
  },
  chipLbl: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dailyLogsHeader: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.text,
  },
  dailyLogsDesc: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  dailyRowCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dailyRowCardToday: {
    borderColor: Colors.text,
    backgroundColor: '#F7F5F0',
  },
  statusDotLarge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  dailyDateTitle: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.text,
  },
  todayBadgeSmall: {
    backgroundColor: Colors.sageGreen,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  todayBadgeSmallText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.text,
  },
  dailySubtext: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE3B3',
  },
  scorePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },
});
