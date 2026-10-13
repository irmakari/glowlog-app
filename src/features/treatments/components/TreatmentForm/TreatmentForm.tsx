import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FormField } from '../../../../components/ui/FormField';
import { PillButton } from '../../../../components/ui/PillButton';
import { TimePickerChip } from '../../../../components/ui/TimePickerChip';
import { Colors } from '../../../../constants/colors';
import { useTranslation } from '../../../../hooks/useTranslation';
import { formatProductDate } from '../../../products/utils/productDate.utils';
import { getLocalDateString, parseDateKey } from '../../../routines/utils/routineDate.utils';
import {
  CreateTreatmentInput,
  TreatmentActive,
  TreatmentFrequency,
  TreatmentKind,
} from '../../types/treatment.types';
import { localeFor, WEEKDAY_ORDER, weekdayShortName } from '../../utils/treatmentDisplay.utils';
import { normalizeTimes } from '../../utils/treatmentSchedule.utils';
import { styles } from './TreatmentForm.styles';
import { TreatmentFormProps } from './TreatmentForm.types';

const KINDS: TreatmentKind[] = ['oral', 'topical'];
const ACTIVES: TreatmentActive[] = ['isotretinoin', 'tretinoin', 'adapalene', 'antibiotic', 'spironolactone', 'other'];
const FREQUENCIES: TreatmentFrequency[] = ['daily', 'every_other_day', 'weekdays'];

// Offered in this order when the user adds another dose time
const SUGGESTED_TIMES = ['09:00', '21:00', '13:00', '17:00', '07:00', '23:00'];

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: object;
}

const Chip: React.FC<ChipProps> = ({ label, selected, onPress, style }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    style={[styles.chip, style, selected && styles.chipActive]}
  >
    <Text style={[styles.chipText, selected && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

interface DateFieldProps {
  value: string;
  onChange: (dateKey: string) => void;
  minimumDate?: string;
}

const DateField: React.FC<DateFieldProps> = ({ value, onChange, minimumDate }) => {
  const { language } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity activeOpacity={0.8} onPress={() => setOpen((prev) => !prev)} style={styles.datePickerButton}>
        <Text style={styles.datePickerText}>{formatProductDate(value, localeFor(language))}</Text>
        <Ionicons name="calendar-outline" size={18} color={Colors.text} />
      </TouchableOpacity>
      {open && (
        <DateTimePicker
          value={parseDateKey(value)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={minimumDate ? parseDateKey(minimumDate) : undefined}
          onChange={(_, date) => {
            if (Platform.OS === 'android') setOpen(false);
            if (date) onChange(getLocalDateString(date));
          }}
          locale={localeFor(language)}
          textColor={Colors.text}
          themeVariant="light"
          accentColor={Colors.text}
        />
      )}
    </>
  );
};

export const TreatmentForm: React.FC<TreatmentFormProps> = ({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { language, t } = useTranslation();
  const locale = localeFor(language);
  const today = getLocalDateString();

  const [name, setName] = useState(initialValues?.name ?? '');
  const [kind, setKind] = useState<TreatmentKind>(initialValues?.kind ?? 'oral');
  const [activeKey, setActiveKey] = useState<TreatmentActive>(initialValues?.activeKey ?? 'other');
  const [doseNote, setDoseNote] = useState(initialValues?.doseNote ?? '');
  const [frequency, setFrequency] = useState<TreatmentFrequency>(initialValues?.frequency ?? 'daily');
  const [weekdays, setWeekdays] = useState<number[]>(initialValues?.weekdays ?? []);
  const [times, setTimes] = useState<string[]>(initialValues?.times.length ? initialValues.times : ['09:00']);
  const [startDate, setStartDate] = useState(initialValues?.startDate ?? today);
  const [hasEndDate, setHasEndDate] = useState(Boolean(initialValues?.endDate));
  const [endDate, setEndDate] = useState(initialValues?.endDate ?? startDate);
  const [reminderEnabled, setReminderEnabled] = useState(initialValues?.reminderEnabled ?? true);

  const [nameError, setNameError] = useState<string>();
  const [weekdaysError, setWeekdaysError] = useState<string>();
  const [endDateError, setEndDateError] = useState<string>();

  const toggleWeekday = (day: number) => {
    setWeekdays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
    setWeekdaysError(undefined);
  };

  const updateTime = (index: number, time: string) =>
    setTimes((prev) => prev.map((value, i) => (i === index ? time : value)));

  const addTime = () =>
    setTimes((prev) => [...prev, SUGGESTED_TIMES.find((s) => !prev.includes(s)) ?? '12:00']);

  const removeTime = (index: number) => setTimes((prev) => prev.filter((_, i) => i !== index));

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    if (endDate < value) setEndDate(value);
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const nextNameError = trimmedName ? undefined : t('treatments.nameRequired');
    const nextWeekdaysError =
      frequency === 'weekdays' && weekdays.length === 0 ? t('treatments.weekdaysRequired') : undefined;
    const nextEndDateError = hasEndDate && endDate < startDate ? t('treatments.endBeforeStart') : undefined;

    setNameError(nextNameError);
    setWeekdaysError(nextWeekdaysError);
    setEndDateError(nextEndDateError);
    if (nextNameError || nextWeekdaysError || nextEndDateError) return;

    const input: CreateTreatmentInput = {
      name: trimmedName,
      kind,
      activeKey,
      doseNote: doseNote.trim() || undefined,
      frequency,
      weekdays: frequency === 'weekdays' ? weekdays : [],
      times: normalizeTimes(times),
      startDate,
      endDate: hasEndDate ? endDate : undefined,
      reminderEnabled,
    };

    await onSubmit(input);
  };

  return (
    <View style={styles.container}>
      <FormField label={t('treatments.name')} required error={nameError}>
        <TextInput
          style={[styles.textInput, nameError ? styles.textInputError : null]}
          placeholder={t('treatments.namePlaceholder')}
          placeholderTextColor={Colors.textMuted}
          value={name}
          onChangeText={(value) => {
            setName(value);
            if (value.trim()) setNameError(undefined);
          }}
        />
      </FormField>

      <FormField label={t('treatments.kind')}>
        <View style={styles.chipWrap}>
          {KINDS.map((k) => (
            <Chip key={k} label={t(`treatments.kind_${k}`)} selected={kind === k} onPress={() => setKind(k)} />
          ))}
        </View>
      </FormField>

      <FormField label={t('treatments.active')}>
        <View style={styles.chipWrap}>
          {ACTIVES.map((a) => (
            <Chip
              key={a}
              label={t(`treatments.active_${a}`)}
              selected={activeKey === a}
              onPress={() => setActiveKey(a)}
            />
          ))}
        </View>
        <Text style={styles.hint}>{t('treatments.activeHint')}</Text>
      </FormField>

      <FormField label={t('treatments.doseNote')}>
        <TextInput
          style={styles.textInput}
          placeholder={t('treatments.doseNotePlaceholder')}
          placeholderTextColor={Colors.textMuted}
          value={doseNote}
          onChangeText={setDoseNote}
        />
      </FormField>

      <FormField label={t('treatments.frequency')} error={weekdaysError}>
        <View style={styles.chipWrap}>
          {FREQUENCIES.map((f) => (
            <Chip
              key={f}
              label={t(`treatments.frequency_${f}`)}
              selected={frequency === f}
              onPress={() => {
                setFrequency(f);
                setWeekdaysError(undefined);
              }}
            />
          ))}
        </View>
        {frequency === 'weekdays' && (
          <View style={[styles.chipWrap, { marginTop: 10 }]}>
            {WEEKDAY_ORDER.map((day) => (
              <Chip
                key={day}
                label={weekdayShortName(day, locale)}
                selected={weekdays.includes(day)}
                onPress={() => toggleWeekday(day)}
                style={styles.dayChip}
              />
            ))}
          </View>
        )}
        {frequency === 'every_other_day' && <Text style={styles.hint}>{t('treatments.everyOtherDayHint')}</Text>}
      </FormField>

      <FormField label={t('treatments.times')}>
        {times.map((time, index) => (
          <View key={index} style={styles.timeRow}>
            <Text style={styles.timeLabel}>#{index + 1}</Text>
            <View style={styles.timeControls}>
              <TimePickerChip value={time} onChange={(value) => updateTime(index, value)} />
              {times.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeTime(index)}
                  accessibilityRole="button"
                  accessibilityLabel={t('treatments.removeTime', { time })}
                  hitSlop={8}
                >
                  <Ionicons name="close-circle" size={22} color={Colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
        {times.length < SUGGESTED_TIMES.length && (
          <TouchableOpacity activeOpacity={0.7} onPress={addTime} style={styles.addTimeButton}>
            <Ionicons name="add" size={16} color={Colors.text} />
            <Text style={styles.addTimeText}>{t('treatments.addTime')}</Text>
          </TouchableOpacity>
        )}
      </FormField>

      <FormField label={t('treatments.startDate')}>
        <DateField value={startDate} onChange={handleStartDateChange} />
      </FormField>

      <FormField label={t('treatments.endDate')} error={endDateError}>
        <View style={[styles.toggleRow, hasEndDate && styles.toggleRowSpaced]}>
          <Text style={styles.toggleTitle}>{t('treatments.hasEndDate')}</Text>
          <Switch
            value={hasEndDate}
            onValueChange={(value) => {
              setHasEndDate(value);
              setEndDateError(undefined);
            }}
            trackColor={{ false: Colors.border, true: Colors.sageGreen }}
            thumbColor={Colors.white}
          />
        </View>
        {hasEndDate && (
          <DateField
            value={endDate}
            minimumDate={startDate}
            onChange={(value) => {
              setEndDate(value);
              setEndDateError(undefined);
            }}
          />
        )}
      </FormField>

      <FormField label={t('treatments.reminders')}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleTextCol}>
            <Text style={styles.toggleTitle}>{t('treatments.remindersDesc')}</Text>
          </View>
          <Switch
            value={reminderEnabled}
            onValueChange={setReminderEnabled}
            trackColor={{ false: Colors.border, true: Colors.sageGreen }}
            thumbColor={Colors.white}
          />
        </View>
      </FormField>

      <View style={styles.buttonRow}>
        {onCancel && <PillButton title={t('common.cancel')} onPress={onCancel} variant="ghost" size="md" />}
        <PillButton
          title={mode === 'create' ? t('treatments.save') : t('treatments.update')}
          onPress={handleSubmit}
          variant="primary"
          size="md"
          loading={loading}
          style={styles.submitButton}
        />
      </View>
    </View>
  );
};
