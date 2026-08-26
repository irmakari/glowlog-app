import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { CalendarDay } from '../CalendarDay';
import { getCalendarGridDays } from '../../utils/calendar.utils';
import { HistoryCalendarProps } from './HistoryCalendar.types';
import { styles } from './HistoryCalendar.styles';
import { Colors } from '../../../../constants/colors';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const HistoryCalendar: React.FC<HistoryCalendarProps> = ({
  history,
  selectedDateKey,
  canGoNext,
  onPrevMonth,
  onNextMonth,
  onPressDay,
}) => {
  const gridDays = useMemo(() => {
    return getCalendarGridDays(history.year, history.month);
  }, [history.year, history.month]);

  const gridRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < gridDays.length; i += 7) {
      rows.push(gridDays.slice(i, i + 7));
    }
    return rows;
  }, [gridDays]);

  return (
    <GlowCard variant="cream" padding={14} style={styles.card}>
      {/* Month Header Nav */}
      <View style={styles.monthHeader}>
        <Text style={styles.monthTitle}>{history.formattedMonth}</Text>
        <View style={styles.navRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPrevMonth}
            style={styles.navArrow}
          >
            <Ionicons name="chevron-back" size={18} color={Colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!canGoNext}
            onPress={onNextMonth}
            style={[styles.navArrow, !canGoNext && styles.navArrowDisabled]}
          >
            <Ionicons name="chevron-forward" size={18} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Weekday Labels */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((day) => (
          <View key={day} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* 7-Column Day Grid */}
      <View style={styles.gridContainer}>
        {gridRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {row.map((gridDay) => (
              <CalendarDay
                key={gridDay.dateKey}
                gridDay={gridDay}
                summary={history.days[gridDay.dateKey]}
                isSelected={gridDay.dateKey === selectedDateKey}
                onPressDay={onPressDay}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Status Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.sageGreen }]} />
          <Text style={styles.legendText}>Complete</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.butterYellow }]} />
          <Text style={styles.legendText}>Partial</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border }]} />
          <Text style={styles.legendText}>Empty</Text>
        </View>
      </View>
    </GlowCard>
  );
};
