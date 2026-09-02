import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StatCard } from '../../../../components/ui/StatCard';
import { MonthlyStatsProps } from './MonthlyStats.types';
import { styles } from './MonthlyStats.styles';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const MonthlyStatsView: React.FC<MonthlyStatsProps> = ({
  stats,
  onOpenMonthlyReport,
  onOpenFullReports,
}) => {
  return (
    <View style={styles.container}>
      <View style={localStyles.headerRow}>
        <Text style={styles.sectionTitle}>This month</Text>
        {onOpenMonthlyReport && (
          <TouchableOpacity activeOpacity={0.7} onPress={onOpenMonthlyReport} style={localStyles.detailBtn}>
            <Text style={localStyles.detailBtnText}>View Report</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.grid}>
        <StatCard
          label="Routine Consistency"
          value={`${stats.routineConsistencyPercent}%`}
          subtitle={`${stats.completedDays} of ${stats.trackedDays} days complete`}
          variant="pink"
        />

        <StatCard
          label="Average Hydration"
          value={`${stats.averageHydration} gl`}
          subtitle="glasses per day"
          variant="softBlue"
        />

        <StatCard
          label="Current Streak"
          value={`${stats.currentStreak}d`}
          subtitle="days going strong"
          variant="sageGreen"
        />

        <StatCard
          label="Best Streak"
          value={`${stats.bestStreak}d`}
          subtitle="all-time record"
          variant="butterYellow"
        />
      </View>

      {onOpenFullReports && (
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onOpenFullReports();
          }}
          style={localStyles.reportCard}
        >
          <View style={localStyles.iconCircle}>
            <Ionicons name="calendar-outline" size={18} color={Colors.text} />
          </View>
          <View style={localStyles.reportTextContent}>
            <Text style={localStyles.reportTitle}>Full Monthly Reports</Text>
            <Text style={localStyles.reportSubtitle}>Browse all past months & daily breakdowns</Text>
          </View>
          <View style={localStyles.arrowCircle}>
            <Ionicons name="arrow-forward" size={16} color={Colors.text} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginTop: Spacing.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(21, 21, 21, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.cardCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reportTextContent: {
    flex: 1,
  },
  reportTitle: {
    ...Typography.h3,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  reportSubtitle: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(21, 21, 21, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
