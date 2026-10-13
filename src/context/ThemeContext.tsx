import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { LightColors, DarkColors } from '../constants/colors';
import { settingsService } from '../services/settingsService';

export type ThemeMode = 'light' | 'dark' | 'system';

export const DARK_MODE_ENABLED = false;

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: typeof LightColors;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  isDark: false,
  colors: LightColors,
  setThemeMode: async () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useDeviceColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    settingsService.getSettings().then((s) => {
      setThemeModeState(s.themeMode || 'system');
    });
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await settingsService.updateSetting('themeMode', mode);
  };

  // Dark mode is locked off for the first release: several screens still use static light
  // colors. Flip DARK_MODE_ENABLED once they are themed; it also re-shows the Appearance card in Profile.
  const isDark = DARK_MODE_ENABLED &&
    (themeMode === 'dark' || (themeMode === 'system' && deviceColorScheme === 'dark'));

  const colors = isDark ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ themeMode, isDark, colors, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
