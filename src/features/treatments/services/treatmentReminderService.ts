import * as Notifications from 'expo-notifications';
import en from '../../../i18n/translations/en.json';
import tr from '../../../i18n/translations/tr.json';
import { notificationService } from '../../../services/notificationService';
import { settingsService } from '../../../services/settingsService';
import { getLocalDateString } from '../../routines/utils/routineDate.utils';
import { Treatment } from '../types/treatment.types';
import {
  PlannedTrigger,
  planTreatmentReminders,
  ReminderPlan,
  TREATMENT_REMINDER_PREFIX,
} from '../utils/treatmentReminders.utils';
import { treatmentService } from './treatmentService';

const copyByLanguage = { en: en.notifications, tr: tr.notifications };

const fill = (template: string, params: Record<string, string>) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] ?? '');

const toTriggerInput = (trigger: PlannedTrigger): Notifications.SchedulableNotificationTriggerInput => {
  switch (trigger.type) {
    case 'daily':
      return { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: trigger.hour, minute: trigger.minute };
    case 'weekly':
      return {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: trigger.weekday,
        hour: trigger.hour,
        minute: trigger.minute,
      };
    case 'date':
      return { type: Notifications.SchedulableTriggerInputTypes.DATE, date: trigger.date };
  }
};

// Syncs cancel and re-create every treatment reminder, so overlapping runs must not interleave
let queue: Promise<unknown> = Promise.resolve();
let lastSyncDate: string | null = null;

async function runSync(): Promise<ReminderPlan | null> {
  const { status } = await Notifications.getPermissionsAsync();

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const request of scheduled) {
    if (request.identifier.startsWith(TREATMENT_REMINDER_PREFIX)) {
      await Notifications.cancelScheduledNotificationAsync(request.identifier);
    }
  }

  if (status !== 'granted') return null;

  const [treatments, settings] = await Promise.all([
    treatmentService.getTreatments(),
    settingsService.getSettings(),
  ]);
  const copy = copyByLanguage[settings.language ?? 'tr'] ?? copyByLanguage.tr;
  const byId = new Map<string, Treatment>(treatments.map((t) => [t.id, t]));
  const plan = planTreatmentReminders(treatments);

  for (const reminder of plan.reminders) {
    const treatment = byId.get(reminder.treatmentId);
    if (!treatment) continue;

    const params = { name: treatment.name, time: reminder.slot, note: treatment.doseNote ?? '' };
    try {
      await Notifications.scheduleNotificationAsync({
        identifier: reminder.identifier,
        content: {
          title: fill(copy.treatmentTitle, params),
          body: fill(treatment.doseNote ? copy.treatmentBodyWithNote : copy.treatmentBody, params),
          sound: true,
          data: { treatmentId: treatment.id, slot: reminder.slot },
        },
        trigger: toTriggerInput(reminder.trigger),
      });
    } catch (err) {
      console.error(`Failed to schedule treatment reminder ${reminder.identifier}:`, err);
    }
  }

  lastSyncDate = getLocalDateString();
  return plan;
}

export const treatmentReminderService = {
  /**
   * Re-creates all treatment reminders from the database. Never prompts for permission:
   * without it, existing treatment reminders are cleared and null is returned.
   */
  sync(): Promise<ReminderPlan | null> {
    const run = queue.then(runSync, runSync).catch((err) => {
      console.error('Failed to sync treatment reminders:', err);
      return null;
    });
    queue = run;
    return run;
  },

  /**
   * Syncs at most once per calendar day. One-off reminders only reach two weeks ahead,
   * so this keeps them topped up whenever the app is opened.
   */
  syncIfStale(): Promise<ReminderPlan | null> {
    if (lastSyncDate === getLocalDateString()) return Promise.resolve(null);
    return this.sync();
  },

  /**
   * For when the user has just turned a treatment reminder on: asks for permission if needed,
   * then syncs. Returns false when permission was denied.
   */
  async requestPermissionAndSync(): Promise<{ granted: boolean; plan: ReminderPlan | null }> {
    const granted = await notificationService.requestPermissions();
    const plan = await this.sync();
    return { granted, plan };
  },
};
