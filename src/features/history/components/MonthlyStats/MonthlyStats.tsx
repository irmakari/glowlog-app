import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { MonthlyStatsProps } from './MonthlyStats.types';
import { styles } from './MonthlyStats.styles';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../hooks/useTranslation';

export const MonthlyStatsView: React.FC<MonthlyStatsProps> = ({
  stats,
  onOpenMonthlyReport,
}) => {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const tileBg = isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.6)';
  const days = (count: number) => t(count === 1 ? 'history.dayCountOne' : 'history.dayCountOther', { count });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('history.thisMonthTitle')}</Text>
        {onOpenMonthlyReport && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onOpenMonthlyReport}
            accessibilityRole="button"
            hitSlop={8}
            style={styles.detailBtn}
          >
            <Text style={[styles.detailBtnText, { color: colors.textSecondary }]}>{t('history.viewReport')}</Text>
            <Ionicons name="chevron-forward" size={15} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <GlowCard variant="sageGreen" padding={16} style={styles.card}>
        <View style={styles.progressHeader}>
          <View style={styles.labelRow}>
            <Ionicons name="trending-up" size={16} color={colors.text} />
            <Text style={[styles.metricLabel, { color: colors.text }]}>{t('history.routineConsistency')}</Text>
          </View>
          <Text style={[styles.progressValue, { color: colors.text }]}>{stats.routineConsistencyPercent}%</Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.7)' }]}>
          <View style={[styles.progressFill, { width: `${stats.routineConsistencyPercent}%`, backgroundColor: colors.text }]} />
        </View>
        <Text style={[styles.progressCaption, { color: colors.textSecondary }]}>
          {t('history.daysComplete', { completed: stats.completedDays, total: stats.trackedDays })}
        </Text>

        <View style={styles.metricsRow}>
          <View style={[styles.metric, { backgroundColor: tileBg }]}>
            <View style={styles.metricHeading}>
              <Ionicons name="water" size={13} color="#5294E2" />
              <Text style={[styles.metricName, { color: colors.textSecondary }]} numberOfLines={1}>
                {t('history.averageHydration')}
              </Text>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
              {t('history.glassCount', { count: stats.averageHydration })}
            </Text>
            <Text style={[styles.metricSub, { color: colors.textSecondary }]}>{t('history.perDay')}</Text>
          </View>
          <View style={[styles.metric, { backgroundColor: tileBg }]}>
            <View style={styles.metricHeading}>
              <Ionicons name="flame" size={13} color="#E86339" />
              <Text style={[styles.metricName, { color: colors.textSecondary }]} numberOfLines={1}>
                {t('history.currentStreak')}
              </Text>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
              {days(stats.currentStreak)}
            </Text>
            <Text style={[styles.metricSub, { color: colors.textSecondary }]} numberOfLines={1}>
              {t('history.bestStreak')}: {days(stats.bestStreak)}
            </Text>
          </View>
        </View>
      </GlowCard>

    </View>
  );
};
