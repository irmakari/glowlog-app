import { getLocalDateString, parseDateKey } from '../../routines/utils/routineDate.utils';
import { Treatment } from '../types/treatment.types';
import { addDays, isTreatmentDueOn } from './treatmentSchedule.utils';

export const TREATMENT_REMINDER_PREFIX = 'glowlog_treatment_';

/** iOS keeps at most 64 pending notifications: leave room for the two routine reminders */
export const TREATMENT_REMINDER_BUDGET = 60;

/** How far ahead one-off reminders are scheduled; the app tops them up whenever it opens */
export const REMINDER_WINDOW_DAYS = 14;

export type PlannedTrigger =
  | { type: 'daily'; hour: number; minute: number }
  /** weekday: 1-7 with 1 = Sunday (expo-notifications' numbering) */
  | { type: 'weekly'; weekday: number; hour: number; minute: number }
  | { type: 'date'; date: Date };

export interface PlannedReminder {
  identifier: string;
  treatmentId: string;
  slot: string;
  trigger: PlannedTrigger;
}

export interface ReminderPlan {
  reminders: PlannedReminder[];
  /** Reminders left out because the budget ran out */
  dropped: number;
}

const splitTime = (slot: string) => {
  const [hour, minute] = slot.split(':').map(Number);
  return { hour, minute };
};

const reminderId = (treatment: Treatment, slot: string, suffix: string) =>
  `${TREATMENT_REMINDER_PREFIX}${treatment.id}_${slot.replace(':', '')}_${suffix}`;

/**
 * Works out which notifications should be pending for the treatments right now.
 *
 * Daily and weekday treatments use repeating triggers, so they keep firing even if the app
 * isn't opened for a while. Every-other-day treatments, and treatments that start later or
 * end inside the window, get one-off reminders for the next REMINDER_WINDOW_DAYS days instead,
 * since a repeating trigger can't skip days or stop on a date.
 */
export function planTreatmentReminders(
  treatments: Treatment[],
  now: Date = new Date(),
  budget: number = TREATMENT_REMINDER_BUDGET
): ReminderPlan {
  const todayKey = getLocalDateString(now);
  const windowEnd = addDays(todayKey, REMINDER_WINDOW_DAYS - 1);
  const repeating: PlannedReminder[] = [];
  const oneOff: PlannedReminder[] = [];

  for (const treatment of treatments) {
    if (treatment.archived || !treatment.reminderEnabled || treatment.times.length === 0) continue;
    if (treatment.endDate && treatment.endDate < todayKey) continue;

    const canRepeat =
      treatment.frequency !== 'every_other_day' &&
      treatment.startDate <= todayKey &&
      (!treatment.endDate || treatment.endDate > windowEnd);

    if (canRepeat) {
      for (const slot of treatment.times) {
        const { hour, minute } = splitTime(slot);
        if (treatment.frequency === 'daily') {
          repeating.push({
            identifier: reminderId(treatment, slot, 'daily'),
            treatmentId: treatment.id,
            slot,
            trigger: { type: 'daily', hour, minute },
          });
        } else {
          for (const day of treatment.weekdays) {
            repeating.push({
              identifier: reminderId(treatment, slot, `w${day}`),
              treatmentId: treatment.id,
              slot,
              trigger: { type: 'weekly', weekday: day + 1, hour, minute },
            });
          }
        }
      }
      continue;
    }

    for (let offset = 0; offset < REMINDER_WINDOW_DAYS; offset++) {
      const dateKey = addDays(todayKey, offset);
      if (!isTreatmentDueOn(treatment, dateKey)) continue;

      for (const slot of treatment.times) {
        const { hour, minute } = splitTime(slot);
        const date = parseDateKey(dateKey);
        date.setHours(hour, minute, 0, 0);
        if (date <= now) continue;

        oneOff.push({
          identifier: reminderId(treatment, slot, dateKey.replace(/-/g, '')),
          treatmentId: treatment.id,
          slot,
          trigger: { type: 'date', date },
        });
      }
    }
  }

  // Repeating reminders cover the most days per slot, so they win when the budget is tight;
  // after that, the soonest one-off reminders matter most.
  oneOff.sort((a, b) => (a.trigger as { date: Date }).date.getTime() - (b.trigger as { date: Date }).date.getTime());
  const all = [...repeating, ...oneOff];

  return {
    reminders: all.slice(0, Math.max(0, budget)),
    dropped: Math.max(0, all.length - budget),
  };
}
