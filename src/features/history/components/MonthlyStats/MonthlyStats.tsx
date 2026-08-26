import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '../../../../components/ui/StatCard';
import { PillButton } from '../../../../components/ui/PillButton';
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
        <PillButton
          title="View Full Monthly Reports ➔"
          onPress={onOpenFullReports}
          variant="outline"
          size="md"
          style={localStyles.reportBtn}
        />
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
  reportBtn: {
    marginTop: Spacing.md,
  },
});
