import { planTreatmentReminders, REMINDER_WINDOW_DAYS } from '../treatmentReminders.utils';
import { makeTreatment } from './fixtures';

// Wednesday 14 Oct 2026, 10:00 local time
const NOW = new Date(2026, 9, 14, 10, 0, 0);

describe('planTreatmentReminders', () => {
  it('uses one repeating daily reminder per dose time for open-ended daily treatments', () => {
    const plan = planTreatmentReminders([makeTreatment({ times: ['08:00', '20:30'] })], NOW);
    expect(plan.reminders.map((r) => r.trigger)).toEqual([
      { type: 'daily', hour: 8, minute: 0 },
      { type: 'daily', hour: 20, minute: 30 },
    ]);
    expect(plan.dropped).toBe(0);
  });

  it('maps chosen weekdays to expo weekday numbers (Sunday = 1)', () => {
    const plan = planTreatmentReminders(
      [makeTreatment({ frequency: 'weekdays', weekdays: [0, 3], times: ['09:00'] })],
      NOW
    );
    expect(plan.reminders.map((r) => r.trigger)).toEqual([
      { type: 'weekly', weekday: 1, hour: 9, minute: 0 },
      { type: 'weekly', weekday: 4, hour: 9, minute: 0 },
    ]);
  });

  it('schedules future one-off reminders on alternate days for every-other-day treatments', () => {
    const plan = planTreatmentReminders(
      [makeTreatment({ frequency: 'every_other_day', startDate: '2026-10-14', times: ['08:00', '21:00'] })],
      NOW
    );
    const fireTimes = plan.reminders.map((r) => (r.trigger as { date: Date }).date);

    // Today's 08:00 has already passed; 21:00 is still ahead
    expect(fireTimes[0]).toEqual(new Date(2026, 9, 14, 21, 0));
    expect(fireTimes[1]).toEqual(new Date(2026, 9, 16, 8, 0));
    // 7 dose days in a 14-day window, minus the one slot already gone
    expect(fireTimes).toHaveLength((REMINDER_WINDOW_DAYS / 2) * 2 - 1);
    expect(new Set(plan.reminders.map((r) => r.identifier)).size).toBe(fireTimes.length);
  });

  it('switches to one-off reminders when the treatment ends inside the window, and stops on the end date', () => {
    const plan = planTreatmentReminders([makeTreatment({ endDate: '2026-10-16' })], NOW);
    expect(plan.reminders.map((r) => (r.trigger as { date: Date }).date)).toEqual([
      new Date(2026, 9, 15, 8, 0),
      new Date(2026, 9, 16, 8, 0),
    ]);
  });

  it('waits for a future start date instead of firing early', () => {
    const plan = planTreatmentReminders([makeTreatment({ startDate: '2026-10-20' })], NOW);
    expect((plan.reminders[0].trigger as { date: Date }).date).toEqual(new Date(2026, 9, 20, 8, 0));
  });

  it('skips archived, finished and reminder-off treatments', () => {
    const plan = planTreatmentReminders(
      [
        makeTreatment({ id: 'a', archived: true }),
        makeTreatment({ id: 'b', endDate: '2026-10-13' }),
        makeTreatment({ id: 'c', reminderEnabled: false }),
      ],
      NOW
    );
    expect(plan.reminders).toEqual([]);
  });

  it('keeps repeating reminders first and reports what did not fit the budget', () => {
    const plan = planTreatmentReminders(
      [
        makeTreatment({ id: 'alt', frequency: 'every_other_day', startDate: '2026-10-15' }),
        makeTreatment({ id: 'daily' }),
      ],
      NOW,
      3
    );
    expect(plan.reminders.map((r) => r.treatmentId)).toEqual(['daily', 'alt', 'alt']);
    expect(plan.dropped).toBe(5);
  });
});
