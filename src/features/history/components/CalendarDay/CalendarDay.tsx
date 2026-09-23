import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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

  const backgroundColor = isSelected
    ? (isDark ? Colors.sageGreen : Colors.darkCard)
    : (isDark ? '#3B3540' : Colors.white);
  const numberColor = isSelected
    ? (isDark ? Colors.darkCard : Colors.white)
    : ((!isCurrentMonth || isFuture) ? colors.textMuted : colors.text);

  const accessibilityLabel = `${dateKey}, routine ${status}`;

  return (
    <TouchableOpacity
      activeOpacity={isCurrentMonth && !isFuture ? 0.75 : 1}
      onPress={handlePress}
      disabled={!isCurrentMonth || isFuture}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.cell,
        { backgroundColor },
        !isCurrentMonth && styles.cellOtherMonth,
        isToday && !isSelected && [styles.cellToday, { borderColor: colors.text }],
      ]}
    >
      <Text
        style={[
          styles.dayNumber,
          { color: numberColor },
        ]}
      >
        {dayNumber}
      </Text>

      {isCurrentMonth && (status === 'complete' || status === 'partial') && (
        <View style={[styles.statusDot, {
          backgroundColor: isSelected && isDark
            ? Colors.darkCard
            : (status === 'complete' ? Colors.sageGreen : Colors.butterYellow),
        }]} />
      )}
    </TouchableOpacity>
  );
};
