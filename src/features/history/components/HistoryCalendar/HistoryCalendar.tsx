import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { CalendarDay } from '../CalendarDay';
import { formatWeekRange, getCalendarGridDays, getWeekDays } from '../../utils/calendar.utils';
import { HistoryCalendarProps } from './HistoryCalendar.types';
import { styles } from './HistoryCalendar.styles';
import { Colors } from '../../../../constants/colors';
import { useTheme } from '../../../../context/ThemeContext';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const HistoryCalendar: React.FC<HistoryCalendarProps> = ({
  history,
  selectedDateKey,
  mode = 'monthly',
  onChangeMode,
  additionalDays = {},
  canGoNext,
  onPrevMonth,
  onNextMonth,
  onPressDay,
}) => {
  const { colors, isDark } = useTheme();

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
  const visibleRows = mode === 'weekly'
    ? [getWeekDays(selectedDateKey ?? `${history.year}-${String(history.month).padStart(2, '0')}-01`)]
    : gridRows;

  const arrowBg = isDark ? 'rgba(255, 255, 255, 0.12)' : Colors.white;

  return (
    <GlowCard variant="cream" padding={14} style={styles.card}>
      {/* Month Header Nav */}
      <View style={styles.monthHeader}>
        <Text style={[styles.monthTitle, { color: colors.text }]}>
          {mode === 'weekly' && selectedDateKey ? formatWeekRange(selectedDateKey) : history.formattedMonth}
        </Text>
        <View style={styles.navRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPrevMonth}
            style={[styles.navArrow, { backgroundColor: arrowBg }]}
          >
            <Ionicons name="chevron-back" size={18} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!canGoNext}
            onPress={onNextMonth}
            style={[styles.navArrow, { backgroundColor: arrowBg }, !canGoNext && styles.navArrowDisabled]}
          >
            <Ionicons name="chevron-forward" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {onChangeMode && (
        <View style={[styles.modeRow, { backgroundColor: isDark ? colors.white : Colors.white }]}>
          {(['monthly', 'weekly'] as const).map((option) => {
            const selected = mode === option;
            return (
              <TouchableOpacity
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => onChangeMode(option)}
                style={[styles.modeButton, selected && { backgroundColor: isDark ? Colors.sageGreen : Colors.darkCard }]}
              >
                <Text style={[styles.modeText, { color: selected ? (isDark ? Colors.darkCard : Colors.white) : colors.textSecondary }]}>
                  {option === 'monthly' ? 'Monthly' : 'Weekly'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Weekday Labels */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((day) => (
          <View key={day} style={styles.weekdayCell}>
            <Text style={[styles.weekdayText, { color: colors.textSecondary }]}>{day}</Text>
          </View>
        ))}
      </View>

      {/* 7-Column Day Grid */}
      <View style={styles.gridContainer}>
        {visibleRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {row.map((gridDay) => (
              <CalendarDay
                key={gridDay.dateKey}
                gridDay={gridDay}
                summary={history.days[gridDay.dateKey] ?? additionalDays[gridDay.dateKey]}
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
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Complete</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.butterYellow }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Partial</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: isDark ? '#3B3540' : Colors.white, borderWidth: 1, borderColor: colors.border }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Empty</Text>
        </View>
      </View>
    </GlowCard>
  );
};
