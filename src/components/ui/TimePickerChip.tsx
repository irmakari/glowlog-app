import React, { useState } from 'react';
import { Platform, StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

export const timeToDate = (time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date;
};

export const dateToTime = (date: Date): string =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

interface TimePickerChipProps {
  /** "HH:MM" */
  value: string;
  onChange: (time: string) => void;
  style?: StyleProp<ViewStyle>;
}

/** Compact time picker: the native compact control on iOS, a chip that opens the dialog on Android */
export const TimePickerChip: React.FC<TimePickerChipProps> = ({ value, onChange, style }) => {
  const { colors } = useTheme();
  const { language } = useTranslation();
  const [androidOpen, setAndroidOpen] = useState(false);

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setAndroidOpen(false);
    if (event.type === 'set' && date) onChange(dateToTime(date));
  };

  if (Platform.OS === 'ios') {
    return (
      <DateTimePicker
        value={timeToDate(value)}
        mode="time"
        display="compact"
        minuteInterval={5}
        locale={language === 'tr' ? 'tr-TR' : 'en-US'}
        themeVariant="light"
        accentColor={colors.text}
        onChange={handleChange}
        style={[styles.iosPicker, style]}
      />
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setAndroidOpen(true)}
        style={[styles.chip, { backgroundColor: colors.white }, style]}
      >
        <Text style={[styles.chipText, { color: colors.text }]}>{value}</Text>
      </TouchableOpacity>
      {androidOpen && (
        <DateTimePicker value={timeToDate(value)} mode="time" is24Hour onChange={handleChange} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  iosPicker: {
    marginRight: -4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  chipText: {
    ...Typography.bodyBold,
    fontSize: 13,
  },
});
