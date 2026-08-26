import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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

  async scheduleRoutineReminder(
    type: 'morning' | 'evening',
    timeStr: string, // "HH:MM" format e.g. "08:00"
    enabled: boolean
  ): Promise<void> {
    const notificationId = `glowlog_routine_${type}`;

    // Cancel existing notification for this type first
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (e) {
      // Ignore if not previously scheduled
    }

    if (!enabled) {
      return;
    }

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.warn('Notification permission not granted');
      return;
    }

    const [hourStr, minuteStr] = timeStr.split(':');
    const hour = parseInt(hourStr || '8', 10);
    const minute = parseInt(minuteStr || '0', 10);

    const title = type === 'morning' ? 'Morning Glow Routine ☀️' : 'Evening Care Routine 🌙';
    const body =
      type === 'morning'
        ? "Time for your morning skincare routine! Start your day with a glow ✨"
        : "Unwind and indulge in your evening skincare steps 🧴";

    try {
      await Notifications.scheduleNotificationAsync({
        identifier: notificationId,
        content: {
          title,
          body,
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
  },

  async cancelAllReminders(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (e) {
      console.error('Failed to cancel notifications:', e);
    }
  },
};
