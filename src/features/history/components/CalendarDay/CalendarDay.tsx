import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CalendarDayProps } from './CalendarDay.types';
import { styles } from './CalendarDay.styles';
import { Colors } from '../../../../constants/colors';
import { useTheme } from '../../../../context/ThemeContext';

export const CalendarDay: React.FC<CalendarDayProps> = ({
  gridDay,
  summary,
  isSelected,
  onPressDay,
}) => {
  const { colors, isDark } = useTheme();
  const { dateKey, dayNumber, isCurrentMonth, isToday, isFuture } = gridDay;
  const status = summary?.status ?? (isFuture ? 'future' : 'empty');

  const handlePress = () => {
    if (!isCurrentMonth || isFuture) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPressDay(dateKey);
  };

  const getBackgroundColor = () => {
    if (!isCurrentMonth) return isDark ? 'rgba(255, 255, 255, 0.04)' : Colors.cardCream;
    if (status === 'complete') return isDark ? '#26422C' : Colors.sageGreen;
    if (status === 'partial') return isDark ? '#4D3E1C' : Colors.butterYellow;
    if (status === 'future') return isDark ? 'rgba(255, 255, 255, 0.08)' : Colors.white;
    return isDark ? 'rgba(255, 255, 255, 0.08)' : Colors.white;
  };

  const accessibilityLabel = `${dateKey}, routine ${status}`;

  return (
    <TouchableOpacity
      activeOpacity={isCurrentMonth && !isFuture ? 0.75 : 1}
      onPress={handlePress}
      disabled={!isCurrentMonth || isFuture}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.cell,
        { backgroundColor: getBackgroundColor() },
        !isCurrentMonth && styles.cellOtherMonth,
        isToday && [styles.cellToday, { borderColor: colors.text }],
        isSelected && { borderWidth: 2.5, borderColor: colors.text },
      ]}
    >
      <Text
        style={[
          styles.dayNumber,
          { color: (!isCurrentMonth || isFuture) ? colors.textMuted : colors.text },
        ]}
      >
        {dayNumber}
      </Text>

      {/* Accessible status indicators */}
      {isCurrentMonth && status === 'complete' && (
        <Ionicons
          name="checkmark"
          size={12}
          color={colors.text}
          style={styles.completeIcon}
        />
      )}
      {isCurrentMonth && status === 'partial' && (
        <View style={[styles.statusDot, { backgroundColor: colors.text }]} />
      )}
    </TouchableOpacity>
  );
};
