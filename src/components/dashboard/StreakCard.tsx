import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlowCard } from '../ui/GlowCard';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { getLocalDateString } from '../../features/routines/utils/routineDate.utils';

interface StreakCardProps {
  streakDays: number;
}

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const StreakCard: React.FC<StreakCardProps> = ({ streakDays }) => {
  const todayKey = useMemo(() => getLocalDateString(), []);
  
  // Calculate current week's 7 days (Mon-Sun)
  const weekDaysInfo = useMemo(() => {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon...
    const distanceToMon = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMon);

    return WEEK_DAYS.map((label, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const dateKey = getLocalDateString(d);
      const isToday = dateKey === todayKey;
      const isPast = dateKey <= todayKey;

      return {
        label,
        dateKey,
        isToday,
        isPast,
      };
    });
  }, [todayKey]);

  return (
    <GlowCard variant="sageGreen" padding={14} style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Ionicons name="flame" size={16} color="#E86339" style={{ marginRight: 4 }} />
          <Text style={styles.titleText}>{streakDays} Day Streak</Text>
        </View>
        <Text style={styles.caption}>This week</Text>
      </View>

      {/* 7-Day Icon Strip */}
      <View style={styles.daysRow}>
        {weekDaysInfo.map((day, idx) => {
          // If user has streak > 0 and day is past, highlight flame icon
          const hasFlame = day.isPast && (streakDays > 0 || day.isToday);

          return (
            <View key={idx} style={styles.dayCol}>
              <View
                style={[
                  styles.iconCircle,
                  hasFlame ? styles.circleActive : styles.circleInactive,
                  day.isToday && styles.circleToday,
                ]}
              >
                <Ionicons
                  name="flame"
                  size={15}
                  color={hasFlame ? '#E86339' : Colors.textMuted}
                />
              </View>
              <Text
                style={[
                  styles.dayLabel,
                  day.isToday && styles.dayLabelToday,
                ]}
              >
                {day.label}
              </Text>
            </View>
          );
        })}
      </View>
    </GlowCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    ...Typography.h3,
    fontSize: 15,
  },
  caption: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dayCol: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  circleActive: {
    backgroundColor: Colors.white,
    shadowColor: '#E86339',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 1,
  },
  circleInactive: {
    backgroundColor: 'transparent',
  },
  circleToday: {
    borderWidth: 1.5,
    borderColor: Colors.text,
  },
  dayLabel: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  dayLabelToday: {
    color: Colors.text,
  },
});
