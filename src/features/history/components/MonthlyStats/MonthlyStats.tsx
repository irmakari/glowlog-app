import React from 'react';
import { View, Text } from 'react-native';
import { StatCard } from '../../../../components/ui/StatCard';
import { MonthlyStatsProps } from './MonthlyStats.types';
import { styles } from './MonthlyStats.styles';

export const MonthlyStatsView: React.FC<MonthlyStatsProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>This month</Text>
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
          value={`🔥 ${stats.currentStreak}d`}
          subtitle="days going strong"
          variant="sageGreen"
        />

        <StatCard
          label="Best Streak"
          value={`🏆 ${stats.bestStreak}d`}
          subtitle="all-time record"
          variant="butterYellow"
        />
      </View>
    </View>
  );
};
