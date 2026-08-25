import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CalendarDayProps } from './CalendarDay.types';
import { styles } from './CalendarDay.styles';
import { Colors } from '../../../../constants/colors';

export const CalendarDay: React.FC<CalendarDayProps> = ({
  gridDay,
  summary,
  onPressDay,
}) => {
  const { dateKey, dayNumber, isCurrentMonth, isToday, isFuture } = gridDay;
  const status = summary?.status ?? (isFuture ? 'future' : 'empty');

  const handlePress = () => {
    if (!isCurrentMonth || isFuture) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPressDay(dateKey);
  };

  const getBackgroundColor = () => {
    if (!isCurrentMonth) return Colors.cardCream;
    if (status === 'complete') return Colors.sageGreen;
    if (status === 'partial') return Colors.butterYellow;
    if (status === 'future') return Colors.white;
    return Colors.white;
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
        isToday && styles.cellToday,
      ]}
    >
      <Text
        style={[
          styles.dayNumber,
          (!isCurrentMonth || isFuture) && styles.dayNumberMuted,
        ]}
      >
        {dayNumber}
      </Text>

      {/* Accessible status indicators */}
      {isCurrentMonth && status === 'complete' && (
        <Ionicons
          name="checkmark"
          size={12}
          color={Colors.text}
          style={styles.completeIcon}
        />
      )}

      {isCurrentMonth && status === 'partial' && (
        <View style={[styles.statusDot, { backgroundColor: Colors.text }]} />
      )}
    </TouchableOpacity>
  );
};
