import React, { useState, useEffect } from 'react';
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
import { settingsService, ExtendedAppSettings, SkinType } from '../../src/services/settingsService';
import { notificationService } from '../../src/services/notificationService';
import { backupService } from '../../src/services/backupService';
import { useTheme, ThemeMode } from '../../src/context/ThemeContext';
import { useTranslation } from '../../src/hooks/useTranslation';

const MORNING_TIMES = ['07:00', '08:00', '08:30', '09:00'];
const EVENING_TIMES = ['20:00', '20:30', '21:00', '22:00'];

const SKIN_TYPES: { id: SkinType; labelEn: string; labelTr: string; icon: string }[] = [
  { id: 'Combination', labelEn: 'Combination (Karma)', labelTr: 'Karma', icon: 'partly-sunny-outline' },
  { id: 'Dry', labelEn: 'Dry (Kuru)', labelTr: 'Kuru', icon: 'water-outline' },
  { id: 'Oily', labelEn: 'Oily (Yağlı)', labelTr: 'Yağlı', icon: 'sparkles-outline' },
  { id: 'Sensitive', labelEn: 'Sensitive (Hassas)', labelTr: 'Hassas', icon: 'leaf-outline' },
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

  const [loading, setLoading] = useState(true);

  // Edit Profile Modal State
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSkinType, setEditSkinType] = useState<SkinType>('Combination');

  // Restore Backup Modal State
  const [restoreModalVisible, setRestoreModalVisible] = useState(false);
  const [backupJsonText, setBackupJsonText] = useState('');

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
      Alert.alert(language === 'tr' ? 'Yedekleme Hatası' : 'Backup Error', e?.message || 'Failed to export backup data.');
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
      userName: trimmed || prev.userName,
      skinType: editSkinType,
    }));
    if (trimmed) {
      await settingsService.updateSetting('userName', trimmed);
    }
    await settingsService.updateSetting('skinType', editSkinType);
    setEditProfileModalVisible(false);
  };

  const handleOpenRestoreBackup = () => {
    setBackupJsonText('');
    setRestoreModalVisible(true);
  };

  const handleExecuteRestore = async () => {
    if (!backupJsonText.trim()) return;
    try {
      await backupService.importBackup(backupJsonText.trim());
      setRestoreModalVisible(false);
      Alert.alert(
        language === 'tr' ? 'Başarılı ✨' : 'Success ✨',
        language === 'tr' ? 'Veri yedeğiniz başarıyla geri yüklendi.' : 'Your data backup has been successfully restored.'
      );
      loadSettings();
    } catch (err: any) {
      Alert.alert(
        language === 'tr' ? 'Yükleme Başarısız' : 'Import Failed',
        err?.message || (language === 'tr' ? 'Geçersiz yedek verisi formatı.' : 'Invalid backup data format.')
      );
    }
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
    <Screen scrollable padding={16}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[Typography.h1, { color: colors.text }]}>{t('profile.title')}</Text>
          <Ionicons name="sparkles" size={20} color="#E59935" style={{ marginLeft: 6 }} />
        </View>
        <Text style={[Typography.subtitle, { color: colors.textSecondary }]}>
          {t('profile.subtitle')}
        </Text>
      </View>

      {/* User Profile Card */}
      <GlowCard variant="pink" padding={Spacing.lg} style={styles.card}>
        <View style={styles.rowBetween}>
          <TouchableOpacity
            style={styles.flex1}
            activeOpacity={0.7}
            onPress={handleOpenEditProfile}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[Typography.h2, { color: colors.text }]}>
                {settings.userName ? settings.userName : t('profile.defaultName')}
              </Text>
              <Ionicons name="heart" size={16} color="#E86339" style={{ marginLeft: 6 }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
              <View
                style={[
                  styles.skinBadgeBtn,
                  { backgroundColor: isDark ? colors.white : Colors.text },
                ]}
              >
                <Ionicons
                  name="sparkles"
                  size={12}
                  color={isDark ? colors.text : Colors.white}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.skinBadgeText,
                    { color: isDark ? colors.text : Colors.white },
                  ]}
                >
                  {getSkinTypeBadgeLabel(settings.skinType)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <IconButton
            icon={<Ionicons name="pencil" size={16} color={colors.text} />}
            onPress={handleOpenEditProfile}
            backgroundColor={colors.white}
            size={36}
          />
        </View>
      </GlowCard>

      {/* Daily Hydration Goal Setting */}
      <GlowCard variant="cream" padding={Spacing.lg} style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={styles.flex1}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[Typography.h3, { color: colors.text }]}>{t('profile.hydrationGoalTitle')}</Text>
              <Ionicons name="water" size={16} color="#5294E2" style={{ marginLeft: 6 }} />
            </View>
            <Text style={[styles.cardSubtext, { color: colors.textSecondary }]}>
              {t('profile.hydrationGoalDesc')}
            </Text>
          </View>
          <View
            style={[
              styles.stepperContainer,
              { backgroundColor: colors.white, borderColor: isDark ? colors.border : 'transparent', borderWidth: isDark ? 1 : 0 },
            ]}
          >
            <IconButton
              icon={<Ionicons name="remove" size={18} color={colors.text} />}
              onPress={() => handleUpdateHydration(-1)}
              backgroundColor={colors.white}
              size={36}
            />
            <Text style={[styles.stepperValue, { color: colors.text }]}>{settings.hydrationGoal}</Text>
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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text style={[Typography.h3, { color: colors.text }]}>{t('profile.remindersTitle')}</Text>
          <Ionicons name="notifications" size={16} color="#7C5CBF" style={{ marginLeft: 6 }} />
        </View>
        <Text style={[styles.cardSubtext, { color: colors.textSecondary }]}>
          {t('profile.remindersDesc')}
        </Text>

        {/* Morning Reminder */}
        <View style={[styles.reminderSection, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
          <View style={styles.rowBetween}>
            <View style={styles.rowIcon}>
              <Ionicons name="sunny-outline" size={20} color="#E59935" style={{ marginRight: 6 }} />
              <Text style={[styles.reminderTitle, { color: colors.text }]}>{t('profile.morningReminder')}</Text>
            </View>
            <Switch
              value={settings.morningReminderEnabled}
              onValueChange={handleToggleMorningReminder}
              trackColor={{ false: colors.border, true: Colors.sageGreen }}
              thumbColor={colors.white}
            />
          </View>
          {settings.morningReminderEnabled && (
            <View style={styles.timeChipsRow}>
              {MORNING_TIMES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.timeChip,
                    {
                      backgroundColor: settings.morningReminderTime === t ? colors.text : colors.white,
                      borderColor: settings.morningReminderTime === t ? colors.text : colors.border,
                    },
                  ]}
                  onPress={() => handleSelectMorningTime(t)}
                >
                  <Text
                    style={[
                      styles.timeChipText,
                      {
                        color: settings.morningReminderTime === t ? (isDark ? colors.background : Colors.white) : colors.text,
                      },
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
              <Text style={[styles.reminderTitle, { color: colors.text }]}>{t('profile.eveningReminder')}</Text>
            </View>
            <Switch
              value={settings.eveningReminderEnabled}
              onValueChange={handleToggleEveningReminder}
              trackColor={{ false: colors.border, true: Colors.sageGreen }}
              thumbColor={colors.white}
            />
          </View>
          {settings.eveningReminderEnabled && (
            <View style={styles.timeChipsRow}>
              {EVENING_TIMES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.timeChip,
                    {
                      backgroundColor: settings.eveningReminderTime === t ? colors.text : colors.white,
                      borderColor: settings.eveningReminderTime === t ? colors.text : colors.border,
                    },
                  ]}
                  onPress={() => handleSelectEveningTime(t)}
                >
                  <Text
                    style={[
                      styles.timeChipText,
                      {
                        color: settings.eveningReminderTime === t ? (isDark ? colors.background : Colors.white) : colors.text,
                      },
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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text style={[Typography.h3, { color: colors.text }]}>{t('profile.appearanceTitle')}</Text>
          <Ionicons name="color-palette" size={16} color="#5294E2" style={{ marginLeft: 6 }} />
        </View>
        <Text style={[styles.cardSubtext, { color: colors.textSecondary }]}>{t('profile.appearanceDesc')}</Text>
        <View style={styles.themeChipsRow}>
          {[
            { id: 'light', label: t('profile.themeLight'), icon: 'sunny-outline' },
            { id: 'dark', label: t('profile.themeDark'), icon: 'moon-outline' },
            { id: 'system', label: t('profile.themeSystem'), icon: 'settings-outline' },
          ].map((modeOpt) => {
            const isSelected = themeMode === modeOpt.id;
            return (
              <TouchableOpacity
                key={modeOpt.id}
                style={[
                  styles.themeChip,
                  {
                    backgroundColor: isSelected ? colors.text : colors.white,
                    borderColor: isSelected ? colors.text : colors.border,
                  },
                ]}
                onPress={() => setThemeMode(modeOpt.id as ThemeMode)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons
                    name={modeOpt.icon as any}
                    size={14}
                    color={isSelected ? (isDark ? colors.background : Colors.white) : colors.text}
                  />
                  <Text
                    style={[
                      styles.themeChipText,
                      {
                        color: isSelected ? (isDark ? colors.background : Colors.white) : colors.text,
                      },
                    ]}
                  >
                    {modeOpt.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </GlowCard>

      {/* Language Selector */}
      <GlowCard variant="cream" padding={Spacing.lg} style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text style={[Typography.h3, { color: colors.text }]}>{t('profile.languageTitle')}</Text>
          <Ionicons name="language" size={16} color="#E59935" style={{ marginLeft: 6 }} />
        </View>
        <Text style={[styles.cardSubtext, { color: colors.textSecondary }]}>{t('profile.languageDesc')}</Text>
        <View style={styles.themeChipsRow}>
          {[
            { id: 'en', label: t('profile.langEnglish') },
            { id: 'tr', label: t('profile.langTurkish') },
          ].map((langOpt) => {
            const isSelected = language === langOpt.id;
            return (
              <TouchableOpacity
                key={langOpt.id}
                style={[
                  styles.themeChip,
                  {
                    backgroundColor: isSelected ? colors.text : colors.white,
                    borderColor: isSelected ? colors.text : colors.border,
                  },
                ]}
                onPress={() => setLanguage(langOpt.id as any)}
              >
                <Text
                  style={[
                    styles.themeChipText,
                    {
                      color: isSelected ? (isDark ? colors.background : Colors.white) : colors.text,
                    },
                  ]}
                >
                  {langOpt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </GlowCard>

      {/* Data Backup & Restore */}
      <GlowCard variant="white" padding={Spacing.lg} style={styles.card}>
        <Text style={[Typography.h3, { color: colors.text }]}>{t('profile.backupTitle')} 💾</Text>
        <Text style={[styles.cardSubtext, { color: colors.textSecondary }]}>
          {t('profile.backupDesc')}
        </Text>
        <View style={styles.backupBtnRow}>
          <PillButton
            title={t('profile.exportData')}
            onPress={handleExportBackup}
            variant="secondary"
            size="md"
            style={styles.flex1}
          />
          <PillButton
            title={t('profile.importData')}
            onPress={handleOpenRestoreBackup}
            variant="outline"
            size="md"
            style={styles.flex1}
          />
        </View>
      </GlowCard>

      {/* Developer Playground if __DEV__ */}
      {__DEV__ && (
        <GlowCard variant="butterYellow" padding={Spacing.lg} style={styles.card}>
          <Text style={[Typography.h3, { color: colors.text }]}>
            {language === 'tr' ? 'Geliştirici Alanı 🛠️' : 'Developer Playground 🛠️'}
          </Text>
          <Text style={[styles.cardSubtext, { color: colors.textSecondary }]}>
            {language === 'tr' ? 'Bileşen galerisini görsel olarak test edin.' : 'Visually inspect all GlowLog components & states.'}
          </Text>
          <PillButton
            title={language === 'tr' ? 'Bileşen Galerisini Aç' : 'Open Component Gallery'}
            onPress={() => router.push('/dev/components' as any)}
            variant="primary"
            size="md"
            style={{ marginTop: Spacing.md }}
          />
        </GlowCard>
      )}

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
                  <Ionicons name="sparkles" size={16} color="#E59935" style={{ marginLeft: 6 }} />
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
    borderRadius: 20,
    padding: 2,
    marginLeft: 8,
  },
  stepperValue: {
    ...Typography.h2,
    fontSize: 16,
    paddingHorizontal: 12,
  },
  reminderSection: {
    marginTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
  },
  rowIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTitle: {
    ...Typography.h3,
    fontSize: 14,
  },
  timeChipsRow: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  timeChipText: {
    ...Typography.body,
    fontSize: 12,
    fontWeight: '600',
  },
  themeChipsRow: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    gap: 8,
  },
  themeChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  themeChipText: {
    ...Typography.body,
    fontSize: 13,
    fontWeight: '600',
  },
  backupBtnRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: 10,
  },
  skinBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  skinBadgeText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '700',
  },
  modalBackdropContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
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

