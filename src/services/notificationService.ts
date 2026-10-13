import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import en from '../i18n/translations/en.json';
import tr from '../i18n/translations/tr.json';
import { settingsService } from './settingsService';

type ReminderLanguage = 'en' | 'tr';
type RoutineType = 'morning' | 'evening';

const reminderCopy: Record<ReminderLanguage, typeof en.notifications> = {
  en: en.notifications,
  tr: tr.notifications,
};

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const reminderId = (type: RoutineType) => `glowlog_routine_${type}`;

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return false;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
        });
      }

      return true;
    } catch (e) {
      console.warn('Failed to request notification permissions:', e);
      return false;
    }
  },

  /**
   * Schedules (or cancels) the daily reminder for a routine.
   * Returns false when the reminder should be on but notification permission was denied.
   */
  async scheduleRoutineReminder(
    type: RoutineType,
    timeStr: string, // "HH:MM" format e.g. "08:00"
    enabled: boolean,
    language: ReminderLanguage = 'tr'
  ): Promise<boolean> {
    try {
      await Notifications.cancelScheduledNotificationAsync(reminderId(type));
    } catch {
      // Ignore if not previously scheduled
    }

    if (!enabled) {
      return true;
    }

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      return false;
    }

    const [hourStr, minuteStr] = timeStr.split(':');
    const hour = parseInt(hourStr || '8', 10);
    const minute = parseInt(minuteStr || '0', 10);
    const copy = reminderCopy[language] ?? reminderCopy.tr;

    try {
      await Notifications.scheduleNotificationAsync({
        identifier: reminderId(type),
        content: {
          title: type === 'morning' ? copy.morningTitle : copy.eveningTitle,
          body: type === 'morning' ? copy.morningBody : copy.eveningBody,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
    } catch (err) {
      console.error(`Failed to schedule ${type} notification:`, err);
    }
    return true;
  },

  /**
   * Re-creates both reminders from saved settings (after a language change or a backup restore).
   * Never prompts for permission: reminders are only rescheduled if permission was already granted.
   */
  async syncRemindersFromSettings(): Promise<void> {
    try {
      const settings = await settingsService.getSettings();
      const { status } = await Notifications.getPermissionsAsync();
      const canSchedule = status === 'granted';
      const language = settings.language ?? 'tr';

      await this.scheduleRoutineReminder(
        'morning',
        settings.morningReminderTime || '08:00',
        settings.morningReminderEnabled && canSchedule,
        language
      );
      await this.scheduleRoutineReminder(
        'evening',
        settings.eveningReminderTime || '21:00',
        settings.eveningReminderEnabled && canSchedule,
        language
      );
    } catch (e) {
      console.error('Failed to sync reminders:', e);
    }
  },

  async cancelAllReminders(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (e) {
      console.error('Failed to cancel notifications:', e);
    }
  },
};
