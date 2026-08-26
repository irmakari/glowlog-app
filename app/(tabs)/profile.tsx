import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Alert,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/ui/Screen';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { PillButton } from '../../src/components/ui/PillButton';
import { IconButton } from '../../src/components/ui/IconButton';
import { Typography } from '../../src/constants/typography';
import { Spacing } from '../../src/constants/spacing';
import { Colors } from '../../src/constants/colors';
import { settingsService, ExtendedAppSettings } from '../../src/services/settingsService';
import { notificationService } from '../../src/services/notificationService';
import { backupService } from '../../src/services/backupService';
import { useTheme, ThemeMode } from '../../src/context/ThemeContext';

const MORNING_TIMES = ['07:00', '08:00', '08:30', '09:00'];
const EVENING_TIMES = ['20:00', '20:30', '21:00', '22:00'];

export default function ProfileScreen() {
  const router = useRouter();
  const { themeMode, setThemeMode, colors } = useTheme();

  const [settings, setSettings] = useState<ExtendedAppSettings>({
    hydrationGoal: 8,
    onboardingCompleted: false,
    morningReminderEnabled: false,
    morningReminderTime: '08:00',
    eveningReminderEnabled: false,
    eveningReminderTime: '21:00',
    themeMode: 'system',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (e) {
      console.error('Failed to load settings:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHydration = async (delta: number) => {
    const newGoal = Math.max(4, Math.min(20, settings.hydrationGoal + delta));
    setSettings((prev) => ({ ...prev, hydrationGoal: newGoal }));
    await settingsService.updateSetting('hydrationGoal', newGoal);
  };

  const handleToggleMorningReminder = async (value: boolean) => {
    setSettings((prev) => ({ ...prev, morningReminderEnabled: value }));
    await settingsService.updateSetting('morningReminderEnabled', value);
    await notificationService.scheduleRoutineReminder('morning', settings.morningReminderTime || '08:00', value);
  };

  const handleSelectMorningTime = async (time: string) => {
    setSettings((prev) => ({ ...prev, morningReminderTime: time }));
    await settingsService.updateSetting('morningReminderTime', time);
    if (settings.morningReminderEnabled) {
      await notificationService.scheduleRoutineReminder('morning', time, true);
    }
  };

  const handleToggleEveningReminder = async (value: boolean) => {
    setSettings((prev) => ({ ...prev, eveningReminderEnabled: value }));
    await settingsService.updateSetting('eveningReminderEnabled', value);
    await notificationService.scheduleRoutineReminder('evening', settings.eveningReminderTime || '21:00', value);
  };

  const handleSelectEveningTime = async (time: string) => {
    setSettings((prev) => ({ ...prev, eveningReminderTime: time }));
    await settingsService.updateSetting('eveningReminderTime', time);
    if (settings.eveningReminderEnabled) {
      await notificationService.scheduleRoutineReminder('evening', time, true);
    }
  };

  const handleExportBackup = async () => {
    try {
      const json = await backupService.exportBackup();
      await Share.share({
        message: json,
        title: 'GlowLog_Backup.json',
      });
    } catch (e: any) {
      Alert.alert('Backup Error', e?.message || 'Failed to export backup data.');
    }
  };

  const handlePromptImportBackup = () => {
    Alert.prompt(
      'Restore Backup',
      'Paste your GlowLog JSON backup string below. WARNING: This will restore your data and overwrite current logs.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async (jsonText?: string) => {
            if (!jsonText || !jsonText.trim()) return;
            try {
              await backupService.importBackup(jsonText.trim());
              Alert.alert('Success ✨', 'Your data backup has been successfully restored.');
              loadSettings();
            } catch (err: any) {
              Alert.alert('Import Failed', err?.message || 'Invalid backup data format.');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleEditName = () => {
    Alert.prompt(
      'Update Name',
      'Enter your name to personalize your greetings:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (newName?: string) => {
            if (!newName || !newName.trim()) return;
            const trimmed = newName.trim();
            setSettings((prev) => ({ ...prev, userName: trimmed }));
            await settingsService.updateSetting('userName', trimmed);
          },
        },
      ],
      'plain-text',
      settings.userName || ''
    );
  };

  const handleSelectSkinType = () => {
    Alert.alert(
      'Select Skin Type 🧴',
      'Choose your skin type to personalize your profile:',
      [
        { text: 'Combination (Karma)', onPress: () => updateSkinType('Combination') },
        { text: 'Dry (Kuru)', onPress: () => updateSkinType('Dry') },
        { text: 'Oily (Yağlı)', onPress: () => updateSkinType('Oily') },
        { text: 'Sensitive (Hassas)', onPress: () => updateSkinType('Sensitive') },
        { text: 'Normal', onPress: () => updateSkinType('Normal') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const updateSkinType = async (st: any) => {
    setSettings((prev) => ({ ...prev, skinType: st }));
    await settingsService.updateSetting('skinType', st);
  };

  return (
    <Screen scrollable padding={16}>
      <View style={styles.header}>
        <Text style={[Typography.h1, { color: colors.text }]}>Profile & Goals ✨</Text>
        <Text style={[Typography.subtitle, { color: colors.textSecondary }]}>
          Your skincare preferences & app settings
        </Text>
      </View>

      {/* User Profile Card */}
      <GlowCard variant="pink" padding={Spacing.lg} style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={styles.flex1}>
            <Text style={[Typography.h2, { color: colors.text }]}>
              {settings.userName ? settings.userName : 'Skincare Enthusiast'} 🌸
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
              <TouchableOpacity onPress={handleSelectSkinType} style={styles.skinBadgeBtn}>
                <Ionicons name="sparkles" size={12} color={Colors.white} style={{ marginRight: 4 }} />
                <Text style={styles.skinBadgeText}>
                  {settings.skinType || 'Combination'} Skin
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <IconButton
            icon={<Ionicons name="pencil" size={16} color={colors.text} />}
            onPress={handleEditName}
            backgroundColor={colors.white}
            size={36}
          />
        </View>
      </GlowCard>

      {/* Daily Hydration Goal Setting */}
      <GlowCard variant="cream" padding={Spacing.lg} style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={styles.flex1}>
            <Text style={[Typography.h3, { color: colors.text }]}>Daily Hydration Goal 💧</Text>
            <Text style={styles.cardSubtext}>
              Set how many glasses of water you aim to drink daily.
            </Text>
          </View>
          <View style={styles.stepperContainer}>
            <IconButton
              icon={<Ionicons name="remove" size={18} color={colors.text} />}
              onPress={() => handleUpdateHydration(-1)}
              backgroundColor={colors.white}
              size={36}
            />
            <Text style={styles.stepperValue}>{settings.hydrationGoal}</Text>
            <IconButton
              icon={<Ionicons name="add" size={18} color={colors.text} />}
              onPress={() => handleUpdateHydration(1)}
              backgroundColor={colors.white}
              size={36}
            />
          </View>
        </View>
      </GlowCard>

      {/* Routine Notifications */}
      <GlowCard variant="softLilac" padding={Spacing.lg} style={styles.card}>
        <Text style={[Typography.h3, { color: colors.text, marginBottom: 4 }]}>
          Routine Reminders 🔔
        </Text>
        <Text style={styles.cardSubtext}>
          Receive gentle notifications so you never miss a routine step.
        </Text>

        {/* Morning Reminder */}
        <View style={styles.reminderSection}>
          <View style={styles.rowBetween}>
            <View style={styles.rowIcon}>
              <Ionicons name="sunny-outline" size={20} color="#E59935" style={{ marginRight: 6 }} />
              <Text style={styles.reminderTitle}>Morning Reminder</Text>
            </View>
            <Switch
              value={settings.morningReminderEnabled}
              onValueChange={handleToggleMorningReminder}
              trackColor={{ false: Colors.border, true: Colors.sageGreen }}
              thumbColor={Colors.white}
            />
          </View>
          {settings.morningReminderEnabled && (
            <View style={styles.timeChipsRow}>
              {MORNING_TIMES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.timeChip,
                    settings.morningReminderTime === t && styles.timeChipSelected,
                  ]}
                  onPress={() => handleSelectMorningTime(t)}
                >
                  <Text
                    style={[
                      styles.timeChipText,
                      settings.morningReminderTime === t && styles.timeChipTextSelected,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Evening Reminder */}
        <View style={[styles.reminderSection, { borderBottomWidth: 0, paddingBottom: 0 }]}>
          <View style={styles.rowBetween}>
            <View style={styles.rowIcon}>
              <Ionicons name="moon-outline" size={20} color="#7C5CBF" style={{ marginRight: 6 }} />
              <Text style={styles.reminderTitle}>Evening Reminder</Text>
            </View>
            <Switch
              value={settings.eveningReminderEnabled}
              onValueChange={handleToggleEveningReminder}
              trackColor={{ false: Colors.border, true: Colors.sageGreen }}
              thumbColor={Colors.white}
            />
          </View>
          {settings.eveningReminderEnabled && (
            <View style={styles.timeChipsRow}>
              {EVENING_TIMES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.timeChip,
                    settings.eveningReminderTime === t && styles.timeChipSelected,
                  ]}
                  onPress={() => handleSelectEveningTime(t)}
                >
                  <Text
                    style={[
                      styles.timeChipText,
                      settings.eveningReminderTime === t && styles.timeChipTextSelected,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </GlowCard>

      {/* Appearance / Theme Selector */}
      <GlowCard variant="softBlue" padding={Spacing.lg} style={styles.card}>
        <Text style={[Typography.h3, { color: colors.text }]}>Appearance 🌙</Text>
        <Text style={styles.cardSubtext}>Choose your preferred app display theme.</Text>
        <View style={styles.themeChipsRow}>
          {[
            { id: 'light', label: 'Light ☀️' },
            { id: 'dark', label: 'Dark 🌙' },
            { id: 'system', label: 'System ⚙️' },
          ].map((modeOpt) => (
            <TouchableOpacity
              key={modeOpt.id}
              style={[
                styles.themeChip,
                themeMode === modeOpt.id && styles.themeChipSelected,
              ]}
              onPress={() => setThemeMode(modeOpt.id as ThemeMode)}
            >
              <Text
                style={[
                  styles.themeChipText,
                  themeMode === modeOpt.id && styles.themeChipTextSelected,
                ]}
              >
                {modeOpt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </GlowCard>

      {/* Data Backup & Restore */}
      <GlowCard variant="white" padding={Spacing.lg} style={styles.card}>
        <Text style={[Typography.h3, { color: colors.text }]}>Data & Backup 💾</Text>
        <Text style={styles.cardSubtext}>
          Safely export your product inventory & routine history as JSON.
        </Text>
        <View style={styles.backupBtnRow}>
          <PillButton
            title="Export Backup"
            onPress={handleExportBackup}
            variant="secondary"
            size="md"
            style={styles.flex1}
          />
          <PillButton
            title="Restore Data"
            onPress={handlePromptImportBackup}
            variant="outline"
            size="md"
            style={styles.flex1}
          />
        </View>
      </GlowCard>

      {/* Developer Playground if __DEV__ */}
      {__DEV__ && (
        <GlowCard variant="butterYellow" padding={Spacing.lg} style={styles.card}>
          <Text style={Typography.h3}>Developer Playground 🛠️</Text>
          <Text style={styles.cardSubtext}>Visually inspect all GlowLog components & states.</Text>
          <PillButton
            title="Open Component Gallery"
            onPress={() => router.push('/dev/components' as any)}
            variant="primary"
            size="md"
            style={{ marginTop: Spacing.md }}
          />
        </GlowCard>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  card: {
    marginVertical: Spacing.xs,
  },
  cardSubtext: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.xs,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flex1: {
    flex: 1,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 2,
    marginLeft: 8,
  },
  stepperValue: {
    ...Typography.h2,
    fontSize: 16,
    paddingHorizontal: 12,
    color: Colors.text,
  },
  reminderSection: {
    marginTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  rowIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTitle: {
    ...Typography.h3,
    fontSize: 14,
    color: Colors.text,
  },
  timeChipsRow: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
    gap: 8,
  },
  timeChip: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeChipSelected: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  timeChipText: {
    ...Typography.body,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  timeChipTextSelected: {
    color: Colors.white,
  },
  themeChipsRow: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    gap: 8,
  },
  themeChip: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  themeChipSelected: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  themeChipText: {
    ...Typography.body,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  themeChipTextSelected: {
    color: Colors.white,
  },
  backupBtnRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: 10,
  },
  skinBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.text,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  skinBadgeText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
});
