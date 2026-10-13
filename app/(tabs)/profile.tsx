import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Alert,
  TouchableOpacity,
  Share,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Linking,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Screen } from '../../src/components/ui/Screen';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { PillButton } from '../../src/components/ui/PillButton';
import { IconButton } from '../../src/components/ui/IconButton';
import { Typography } from '../../src/constants/typography';
import { Spacing } from '../../src/constants/spacing';
import { Colors } from '../../src/constants/colors';
import { settingsService, ExtendedAppSettings, SkinType } from '../../src/services/settingsService';
import { notificationService } from '../../src/services/notificationService';
import { backupService } from '../../src/services/backupService';
import { useTheme, ThemeMode, DARK_MODE_ENABLED } from '../../src/context/ThemeContext';
import { useTranslation } from '../../src/hooks/useTranslation';
import { LanguageMode } from '../../src/context/LanguageContext';

const timeToDate = (time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date;
};

const dateToTime = (date: Date): string =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

const ReminderTimePicker: React.FC<{ value: string; onChange: (time: string) => void }> = ({ value, onChange }) => {
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
        style={styles.timePicker}
      />
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setAndroidOpen(true)}
        style={[styles.timeChip, { backgroundColor: colors.white }]}
      >
        <Text style={[styles.timeChipText, { color: colors.text }]}>{value}</Text>
      </TouchableOpacity>
      {androidOpen && (
        <DateTimePicker value={timeToDate(value)} mode="time" is24Hour onChange={handleChange} />
      )}
    </>
  );
};

const SKIN_TYPES: { id: SkinType; labelEn: string; labelTr: string; icon: string }[] = [
  { id: 'Combination', labelEn: 'Combination', labelTr: 'Karma', icon: 'partly-sunny-outline' },
  { id: 'Dry', labelEn: 'Dry', labelTr: 'Kuru', icon: 'water-outline' },
  { id: 'Oily', labelEn: 'Oily', labelTr: 'Yağlı', icon: 'sparkles-outline' },
  { id: 'Sensitive', labelEn: 'Sensitive', labelTr: 'Hassas', icon: 'leaf-outline' },
  { id: 'Normal', labelEn: 'Normal', labelTr: 'Normal', icon: 'sunny-outline' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { themeMode, setThemeMode, isDark, colors } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  const [settings, setSettings] = useState<ExtendedAppSettings>({
    hydrationGoal: 8,
    onboardingCompleted: false,
    morningReminderEnabled: false,
    morningReminderTime: '08:00',
    eveningReminderEnabled: false,
    eveningReminderTime: '21:00',
    themeMode: 'system',
  });

  // Edit Profile Modal State
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSkinType, setEditSkinType] = useState<SkinType>('Combination');

  // Restore Backup Modal State
  const [restoreModalVisible, setRestoreModalVisible] = useState(false);
  const [backupJsonText, setBackupJsonText] = useState('');

  const loadSettings = useCallback(async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  }, []);

  // Reload on focus: onboarding and backup restore change settings outside this screen
  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [loadSettings])
  );

  const handleUpdateHydration = async (delta: number) => {
    const newGoal = Math.max(4, Math.min(20, settings.hydrationGoal + delta));
    setSettings((prev) => ({ ...prev, hydrationGoal: newGoal }));
    await settingsService.updateSetting('hydrationGoal', newGoal);
  };

  const showNotificationPermissionAlert = () => {
    Alert.alert(
      t('profile.notificationsDeniedTitle'),
      t('profile.notificationsDeniedDesc'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.openSettings'), onPress: () => Linking.openSettings() },
      ]
    );
  };

  const updateReminder = async (
    type: 'morning' | 'evening',
    enabled: boolean,
    time: string
  ) => {
    const enabledKey = type === 'morning' ? 'morningReminderEnabled' : 'eveningReminderEnabled';
    const timeKey = type === 'morning' ? 'morningReminderTime' : 'eveningReminderTime';

    setSettings((prev) => ({ ...prev, [enabledKey]: enabled, [timeKey]: time }));
    const scheduled = await notificationService.scheduleRoutineReminder(type, time, enabled, language);

    if (!scheduled) {
      // Permission denied: don't leave the switch on for a reminder that will never fire
      setSettings((prev) => ({ ...prev, [enabledKey]: false }));
      await settingsService.updateSetting(enabledKey, false);
      showNotificationPermissionAlert();
      return;
    }

    await settingsService.updateSetting(enabledKey, enabled);
    await settingsService.updateSetting(timeKey, time);
  };

  const handleToggleMorningReminder = (value: boolean) =>
    updateReminder('morning', value, settings.morningReminderTime || '08:00');

  const handleSelectMorningTime = (time: string) =>
    updateReminder('morning', settings.morningReminderEnabled, time);

  const handleToggleEveningReminder = (value: boolean) =>
    updateReminder('evening', value, settings.eveningReminderTime || '21:00');

  const handleSelectEveningTime = (time: string) =>
    updateReminder('evening', settings.eveningReminderEnabled, time);

  const handleExportBackup = async () => {
    try {
      const json = await backupService.exportBackup();
      await Share.share({
        message: json,
        title: 'GlowLog_Backup.json',
      });
    } catch (e: any) {
      Alert.alert(t('profile.backupErrorTitle'), e?.message || t('profile.backupErrorDesc'));
    }
  };

  const handleOpenEditProfile = () => {
    setEditName(settings.userName || '');
    setEditSkinType(settings.skinType || 'Combination');
    setEditProfileModalVisible(true);
  };

  const handleSaveProfile = async () => {
    const trimmed = editName.trim();
    setSettings((prev) => ({
      ...prev,
      userName: trimmed,
      skinType: editSkinType,
    }));
    await settingsService.updateSetting('userName', trimmed);
    await settingsService.updateSetting('skinType', editSkinType);
    setEditProfileModalVisible(false);
  };

  const handleOpenRestoreBackup = () => {
    setBackupJsonText('');
    setRestoreModalVisible(true);
  };

  const runRestore = async () => {
    try {
      await backupService.importBackup(backupJsonText.trim());
      setRestoreModalVisible(false);

      // Apply restored preferences app-wide, then re-create reminders from them
      const restored = await settingsService.getSettings();
      setSettings(restored);
      await setLanguage(restored.language ?? 'tr');
      await setThemeMode(restored.themeMode);
      await notificationService.syncRemindersFromSettings();

      Alert.alert(t('profile.restoreSuccessTitle'), t('profile.restoreSuccessDesc'));
    } catch (err: any) {
      Alert.alert(t('profile.restoreFailedTitle'), err?.message || t('profile.restoreFailedDesc'));
    }
  };

  const handleExecuteRestore = () => {
    if (!backupJsonText.trim()) return;
    // Restoring replaces everything on this device, so confirm first
    Alert.alert(
      t('profile.restoreConfirmTitle'),
      t('profile.restoreConfirmDesc'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.restoreConfirmAction'), style: 'destructive', onPress: runRestore },
      ]
    );
  };

  const getSkinTypeBadgeLabel = (st?: SkinType) => {
    const type = st || 'Combination';
    if (language === 'tr') {
      const trMap: Record<string, string> = {
        Combination: 'Karma Cilt',
        Dry: 'Kuru Cilt',
        Oily: 'Yağlı Cilt',
        Sensitive: 'Hassas Cilt',
        Normal: 'Normal Cilt',
      };
      return trMap[type] || `${type} Cilt`;
    }
    return `${type} Skin`;
  };

  return (
    <>
      <Screen scrollable padding={16}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[Typography.h1, styles.pageTitle, { color: colors.text }]}>{t('profile.title')}</Text>
        </View>
        <Text style={[Typography.subtitle, styles.pageSubtitle, { color: colors.textSecondary }]}>
          {t('profile.subtitle')}
        </Text>
      </View>

      {/* User Profile Card */}
      <GlowCard variant="pink" padding={Spacing.lg} style={styles.card} onPress={handleOpenEditProfile}>
        <View style={styles.rowBetween}>
          <View style={[styles.avatar, { backgroundColor: colors.white }]}>
            <Text style={[styles.avatarText, { color: colors.text }]}>
              {(settings.userName || t('profile.defaultName')).trim().charAt(0).toLocaleUpperCase(language === 'tr' ? 'tr-TR' : 'en-US')}
            </Text>
          </View>
          <View style={styles.flex1}>
            <Text style={[Typography.h2, styles.profileName, { color: colors.text }]} numberOfLines={1}>
              {settings.userName ? settings.userName : t('profile.defaultName')}
            </Text>
            <View style={[styles.skinBadgeBtn, { backgroundColor: colors.text }]}>
              <Ionicons name="sparkles" size={11} color={colors.background} style={{ marginRight: 4 }} />
              <Text style={[styles.skinBadgeText, { color: colors.background }]}>
                {getSkinTypeBadgeLabel(settings.skinType)}
              </Text>
            </View>
          </View>
          <View style={[styles.editCircle, { backgroundColor: colors.white }]}>
            <Ionicons name="pencil" size={15} color={colors.text} />
          </View>
        </View>
      </GlowCard>

      {/* Daily Hydration Goal */}
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('profile.goalsSection')}</Text>
      <GlowCard variant="softBlue" padding={Spacing.lg} style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={[styles.rowIconCircle, { backgroundColor: colors.white }]}>
            <Ionicons name="water" size={16} color="#5294E2" />
          </View>
          <View style={styles.flex1}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{t('profile.hydrationGoalTitle')}</Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              {t('profile.hydrationGoalValue', { count: settings.hydrationGoal, liters: (settings.hydrationGoal * 0.25).toFixed(1) })}
            </Text>
          </View>
          <View style={[styles.stepperContainer, { backgroundColor: colors.white }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleUpdateHydration(-1)}
              disabled={settings.hydrationGoal <= 4}
              accessibilityRole="button"
              accessibilityLabel={t('profile.decreaseGoal')}
              style={[styles.stepperBtn, settings.hydrationGoal <= 4 && styles.disabled]}
            >
              <Ionicons name="remove" size={16} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.stepperValue, { color: colors.text }]}>{settings.hydrationGoal}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleUpdateHydration(1)}
              disabled={settings.hydrationGoal >= 20}
              accessibilityRole="button"
              accessibilityLabel={t('profile.increaseGoal')}
              style={[styles.stepperBtn, settings.hydrationGoal >= 20 && styles.disabled]}
            >
              <Ionicons name="add" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </GlowCard>

      {/* Routine Notifications */}
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('profile.remindersTitle')}</Text>
      <GlowCard variant="softLilac" padding={0} style={styles.card}>
        {([
          {
            type: 'morning' as const,
            icon: 'sunny-outline' as const,
            iconColor: '#E59935',
            title: t('profile.morningReminder'),
            enabled: settings.morningReminderEnabled,
            time: settings.morningReminderTime || '08:00',
            onToggle: handleToggleMorningReminder,
            onTime: handleSelectMorningTime,
          },
          {
            type: 'evening' as const,
            icon: 'moon-outline' as const,
            iconColor: '#7C5CBF',
            title: t('profile.eveningReminder'),
            enabled: settings.eveningReminderEnabled,
            time: settings.eveningReminderTime || '21:00',
            onToggle: handleToggleEveningReminder,
            onTime: handleSelectEveningTime,
          },
        ]).map((reminder, index) => (
          <View
            key={reminder.type}
            style={[styles.listRow, index === 0 && [styles.listDivider, { borderBottomColor: 'rgba(21,21,21,0.06)' }]]}
          >
            <View style={[styles.rowIconCircle, { backgroundColor: colors.white }]}>
              <Ionicons name={reminder.icon} size={16} color={reminder.iconColor} />
            </View>
            <View style={styles.flex1}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>{reminder.title}</Text>
              <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                {reminder.enabled ? t('profile.reminderAt', { time: reminder.time }) : t('profile.reminderOff')}
              </Text>
            </View>
            {reminder.enabled && (
              <ReminderTimePicker value={reminder.time} onChange={reminder.onTime} />
            )}
            <Switch
              value={reminder.enabled}
              onValueChange={reminder.onToggle}
              trackColor={{ false: colors.border, true: Colors.sageGreen }}
              thumbColor={Colors.white}
            />
          </View>
        ))}
      </GlowCard>

      {/* Appearance / Theme Selector (hidden while dark mode is locked off) */}
      {DARK_MODE_ENABLED && (
        <GlowCard variant="white" padding={Spacing.lg} style={styles.card}>
          <Text style={[styles.rowTitle, { color: colors.text }]}>{t('profile.appearanceTitle')}</Text>
          <View style={styles.segmentRow}>
            {([
              { id: 'light', label: t('profile.themeLight') },
              { id: 'dark', label: t('profile.themeDark') },
              { id: 'system', label: t('profile.themeSystem') },
            ] as { id: ThemeMode; label: string }[]).map((modeOpt) => {
              const isSelected = themeMode === modeOpt.id;
              return (
                <TouchableOpacity
                  key={modeOpt.id}
                  style={[styles.segment, isSelected && { backgroundColor: colors.text }]}
                  onPress={() => setThemeMode(modeOpt.id)}
                >
                  <Text style={[styles.segmentText, { color: isSelected ? colors.background : colors.text }]}>
                    {modeOpt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </GlowCard>
      )}

      {/* App settings: language + data */}
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('profile.appSection')}</Text>
      <GlowCard variant="white" padding={0} style={styles.card}>
        <View style={[styles.listRow, styles.listDivider, { borderBottomColor: colors.border }]}>
          <View style={[styles.rowIconCircle, { backgroundColor: colors.background }]}>
            <Ionicons name="language" size={16} color="#E59935" />
          </View>
          <Text style={[styles.rowTitle, styles.flex1, { color: colors.text }]}>{t('profile.languageTitle')}</Text>
          <View style={[styles.segmentRow, styles.segmentCompact, { backgroundColor: colors.background }]}>
            {([
              { id: 'tr', label: 'TR' },
              { id: 'en', label: 'EN' },
            ] as { id: LanguageMode; label: string }[]).map((langOpt) => {
              const isSelected = language === langOpt.id;
              return (
                <TouchableOpacity
                  key={langOpt.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={langOpt.id === 'tr' ? 'Türkçe' : 'English'}
                  style={[styles.segment, isSelected && { backgroundColor: colors.text }]}
                  onPress={() => setLanguage(langOpt.id)}
                >
                  <Text style={[styles.segmentText, { color: isSelected ? colors.background : colors.text }]}>
                    {langOpt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleExportBackup}
          accessibilityRole="button"
          style={[styles.listRow, styles.listDivider, { borderBottomColor: colors.border }]}
        >
          <View style={[styles.rowIconCircle, { backgroundColor: colors.background }]}>
            <Ionicons name="share-outline" size={16} color={colors.text} />
          </View>
          <View style={styles.flex1}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{t('profile.exportData')}</Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>{t('profile.exportDesc')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleOpenRestoreBackup}
          accessibilityRole="button"
          style={styles.listRow}
        >
          <View style={[styles.rowIconCircle, { backgroundColor: colors.background }]}>
            <Ionicons name="download-outline" size={16} color={colors.text} />
          </View>
          <View style={styles.flex1}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{t('profile.importData')}</Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>{t('profile.importDesc')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </GlowCard>

      {/* Developer Playground if __DEV__ */}
      {__DEV__ && (
        <GlowCard
          variant="butterYellow"
          padding={0}
          style={styles.card}
          onPress={() => router.push('/dev/components' as any)}
        >
          <View style={styles.listRow}>
            <View style={[styles.rowIconCircle, { backgroundColor: colors.white }]}>
              <Ionicons name="construct-outline" size={16} color={colors.text} />
            </View>
            <Text style={[styles.rowTitle, styles.flex1, { color: colors.text }]}>
              {language === 'tr' ? 'Bileşen Galerisi (geliştirici)' : 'Component Gallery (dev)'}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </View>
        </GlowCard>
      )}

      <Text style={[styles.versionText, { color: colors.textMuted }]}>
        GlowLog {Constants.expoConfig?.version ?? ''}
      </Text>
      </Screen>

    {/* Edit Profile Modal */}
    <Modal
      visible={editProfileModalVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => setEditProfileModalVisible(false)}
    >
      <View style={styles.modalBackdropContainer}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setEditProfileModalVisible(false)}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalKeyboardAvoid}
        >
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                borderColor: isDark ? '#2E2E34' : '#E8E4DC',
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.flex1}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[Typography.h2, { color: colors.text, fontSize: 20 }]}>
                    {language === 'tr' ? 'Profili Düzenle' : 'Edit Profile'}
                  </Text>
                </View>
                <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 3 }]}>
                  {language === 'tr'
                    ? 'İsminizi ve cilt tipi tercihlerinizi güncelleyin'
                    : 'Update your name & skin type'}
                </Text>
              </View>
              <IconButton
                icon={<Ionicons name="close" size={16} color={colors.text} />}
                onPress={() => setEditProfileModalVisible(false)}
                backgroundColor={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}
                size={30}
              />
            </View>

            {/* Name Input */}
            <View style={styles.modalInputGroup}>
              <Text style={[styles.modalInputLabel, { color: colors.textSecondary }]}>
                {language === 'tr' ? 'İSMİNİZ' : 'YOUR NAME'}
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? '#26262B' : '#F7F5F0',
                    color: colors.text,
                    borderColor: isDark ? '#38383E' : '#E2DDD2',
                  },
                ]}
                value={editName}
                onChangeText={setEditName}
                placeholder={language === 'tr' ? 'örn. Irmak' : 'e.g. Irmak'}
                placeholderTextColor={colors.textMuted}
                autoFocus
                returnKeyType="done"
                maxLength={30}
              />
            </View>

            {/* Skin Type Selection */}
            <View style={styles.modalInputGroup}>
              <Text style={[styles.modalInputLabel, { color: colors.textSecondary }]}>
                {language === 'tr' ? 'CİLT TİPİ' : 'SKIN TYPE'}
              </Text>
              <View style={styles.skinChipsWrapper}>
                {SKIN_TYPES.map((st) => {
                  const isSelected = editSkinType === st.id;
                  const label = language === 'tr' ? st.labelTr : st.labelEn;
                  return (
                    <TouchableOpacity
                      key={st.id}
                      style={[
                        styles.skinTypeChip,
                        {
                          backgroundColor: isSelected
                            ? (isDark ? '#FFFFFF' : '#151515')
                            : (isDark ? '#26262B' : '#F7F5F0'),
                          borderColor: isSelected
                            ? (isDark ? '#FFFFFF' : '#151515')
                            : (isDark ? '#38383E' : '#E2DDD2'),
                        },
                      ]}
                      onPress={() => setEditSkinType(st.id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={st.icon as any}
                        size={14}
                        color={
                          isSelected
                            ? (isDark ? '#151515' : '#FFFFFF')
                            : colors.text
                        }
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={[
                          styles.skinTypeChipText,
                          {
                            color: isSelected
                              ? (isDark ? '#151515' : '#FFFFFF')
                              : colors.text,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActionsRow}>
              <PillButton
                title={language === 'tr' ? 'İptal' : 'Cancel'}
                onPress={() => setEditProfileModalVisible(false)}
                variant="outline"
                size="md"
                style={styles.flex1}
              />
              <PillButton
                title={language === 'tr' ? 'Kaydet' : 'Save'}
                onPress={handleSaveProfile}
                variant="primary"
                size="md"
                style={styles.flex1}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>

    {/* Restore Backup Modal */}
    <Modal
      visible={restoreModalVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => setRestoreModalVisible(false)}
    >
      <View style={styles.modalBackdropContainer}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setRestoreModalVisible(false)}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalKeyboardAvoid}
        >
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                borderColor: isDark ? '#2E2E34' : '#E8E4DC',
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.flex1}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[Typography.h2, { color: colors.text, fontSize: 20 }]}>
                    {language === 'tr' ? 'Yedeği Geri Yükle 💾' : 'Restore Backup 💾'}
                  </Text>
                </View>
                <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 3 }]}>
                  {language === 'tr'
                    ? 'Aşağıya GlowLog JSON yedek metninizi yapıştırın.'
                    : 'Paste your GlowLog JSON backup string below.'}
                </Text>
              </View>
              <IconButton
                icon={<Ionicons name="close" size={16} color={colors.text} />}
                onPress={() => setRestoreModalVisible(false)}
                backgroundColor={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}
                size={30}
              />
            </View>

            <TextInput
              style={[
                styles.jsonTextInput,
                {
                  backgroundColor: isDark ? '#26262B' : '#F7F5F0',
                  color: colors.text,
                  borderColor: isDark ? '#38383E' : '#E2DDD2',
                },
              ]}
              value={backupJsonText}
              onChangeText={setBackupJsonText}
              placeholder={language === 'tr' ? 'JSON metnini buraya yapıştırın...' : 'Paste JSON string here...'}
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={5}
            />

            <View style={styles.modalActionsRow}>
              <PillButton
                title={language === 'tr' ? 'İptal' : 'Cancel'}
                onPress={() => setRestoreModalVisible(false)}
                variant="outline"
                size="md"
                style={styles.flex1}
              />
              <PillButton
                title={language === 'tr' ? 'Geri Yükle' : 'Restore'}
                onPress={handleExecuteRestore}
                variant="primary"
                size="md"
                style={styles.flex1}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  </>
);
}

const styles = StyleSheet.create({
  // Matches the Shelf and History tab headers
  pageTitle: {
    fontSize: 24,
    lineHeight: 28,
  },
  pageSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  versionText: {
    ...Typography.caption,
    fontSize: 11,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  header: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  card: {
    marginVertical: Spacing.xs,
  },
  sectionLabel: {
    ...Typography.badge,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: Spacing.md,
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  flex1: {
    flex: 1,
    minWidth: 0,
  },
  disabled: {
    opacity: 0.3,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Typography.h2,
    fontSize: 22,
  },
  profileName: {
    fontSize: 20,
  },
  editCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skinBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 4,
  },
  skinBadgeText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 64,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  listDivider: {
    borderBottomWidth: 1,
  },
  rowIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    ...Typography.bodyBold,
    fontSize: 15,
  },
  rowSubtitle: {
    ...Typography.caption,
    fontSize: 12,
    marginTop: 1,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.radiusPill,
    padding: 3,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    ...Typography.h3,
    fontSize: 16,
    minWidth: 26,
    textAlign: 'center',
  },
  timePicker: {
    marginRight: -4,
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timeChipText: {
    ...Typography.bodyBold,
    fontSize: 13,
  },
  segmentRow: {
    flexDirection: 'row',
    borderRadius: Spacing.radiusPill,
    padding: 3,
    marginTop: Spacing.sm,
  },
  segmentCompact: {
    marginTop: 0,
  },
  segment: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Spacing.radiusPill,
    alignItems: 'center',
  },
  segmentText: {
    ...Typography.bodyBold,
    fontSize: 13,
  },
  modalBackdropContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalKeyboardAvoid: {
    width: '100%',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md + 2,
  },
  modalInputGroup: {
    marginBottom: Spacing.md,
  },
  modalInputLabel: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  textInput: {
    ...Typography.body,
    fontSize: 15,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  jsonTextInput: {
    ...Typography.body,
    fontSize: 13,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: Spacing.md,
  },
  skinChipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skinTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  skinTypeChipText: {
    ...Typography.caption,
    fontSize: 12,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: Spacing.sm,
  },
});
