import { getDb } from './database/db';
import { AppSettings } from '../types';

export type SkinType = 'Combination' | 'Oily' | 'Dry' | 'Sensitive' | 'Normal';

export interface ExtendedAppSettings extends AppSettings {
  themeMode: 'light' | 'dark' | 'system';
  userName?: string;
  skinType?: SkinType;
}

export const DEFAULT_SETTINGS: ExtendedAppSettings = {
  hydrationGoal: 8,
  onboardingCompleted: false,
  morningReminderEnabled: false,
  morningReminderTime: '08:00',
  eveningReminderEnabled: false,
  eveningReminderTime: '21:00',
  themeMode: 'system',
  userName: '',
  skinType: 'Combination',
};

export const settingsService = {
  async getSettings(): Promise<ExtendedAppSettings> {
    const db = await getDb();
    const rows = await db.getAllAsync<{ key: string; value: string }>(
      'SELECT key, value FROM settings'
    );

    const settingsMap = new Map<string, string>();
    rows.forEach((r) => settingsMap.set(r.key, r.value));

    const hydrationGoalStr = settingsMap.get('hydrationGoal');
    const hydrationGoal = hydrationGoalStr ? parseInt(hydrationGoalStr, 10) : DEFAULT_SETTINGS.hydrationGoal;

    const onboardingCompleted = settingsMap.get('onboardingCompleted') === 'true';
    const morningReminderEnabled = settingsMap.get('morningReminderEnabled') === 'true';
    const morningReminderTime = settingsMap.get('morningReminderTime') || DEFAULT_SETTINGS.morningReminderTime;
    const eveningReminderEnabled = settingsMap.get('eveningReminderEnabled') === 'true';
    const eveningReminderTime = settingsMap.get('eveningReminderTime') || DEFAULT_SETTINGS.eveningReminderTime;
    const themeMode = (settingsMap.get('themeMode') as ExtendedAppSettings['themeMode']) || DEFAULT_SETTINGS.themeMode;
    const userName = settingsMap.get('userName') || DEFAULT_SETTINGS.userName;
    const skinType = (settingsMap.get('skinType') as SkinType) || DEFAULT_SETTINGS.skinType;

    return {
      hydrationGoal: isNaN(hydrationGoal) || hydrationGoal <= 0 ? 8 : hydrationGoal,
      onboardingCompleted,
      morningReminderEnabled,
      morningReminderTime,
      eveningReminderEnabled,
      eveningReminderTime,
      themeMode,
      userName,
      skinType,
    };
  },

  async updateSetting(key: keyof ExtendedAppSettings, value: string | number | boolean): Promise<void> {
    const db = await getDb();
    const valStr = String(value);

    await db.runAsync(
      `INSERT INTO settings (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [key, valStr]
    );
  },

  async updateSettings(partial: Partial<ExtendedAppSettings>): Promise<void> {
    for (const [key, value] of Object.entries(partial)) {
      if (value !== undefined) {
        await this.updateSetting(key as keyof ExtendedAppSettings, value);
      }
    }
  },
};
