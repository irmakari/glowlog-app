import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import en from '../i18n/translations/en.json';
import tr from '../i18n/translations/tr.json';
import { settingsService } from '../services/settingsService';

export type LanguageMode = 'en' | 'tr';

const dictionaries: Record<LanguageMode, any> = {
  en,
  tr,
};

export interface LanguageContextType {
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: async () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageMode>('en');

  // Load language settings on app launch
  useEffect(() => {
    async function loadLanguageSetting() {
      try {
        const stored = await settingsService.getSettings();
        if (stored.language === 'tr' || stored.language === 'en') {
          setLanguageState(stored.language);
        }
      } catch (err) {
        console.error('Failed to load language setting:', err);
      }
    }
    loadLanguageSetting();
  }, []);

  const setLanguage = async (newLang: LanguageMode) => {
    try {
      setLanguageState(newLang);
      await settingsService.updateSetting('language', newLang);
    } catch (err) {
      console.error('Failed to save language setting:', err);
    }
  };

  /**
   * Helper function for dot-notation key lookup and parameter interpolation
   * e.g. t('today.routineCompleted', { completed: 2, total: 4 })
   */
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split('.');
      let currentDict = dictionaries[language] || dictionaries.en;
      let template: any = currentDict;

      for (const k of keys) {
        if (template && typeof template === 'object' && k in template) {
          template = template[k];
        } else {
          // Fallback to English dictionary
          let fallbackDict = dictionaries.en;
          for (const fk of keys) {
            if (fallbackDict && typeof fallbackDict === 'object' && fk in fallbackDict) {
              fallbackDict = fallbackDict[fk];
            } else {
              return key;
            }
          }
          template = fallbackDict;
          break;
        }
      }

      if (typeof template !== 'string') {
        return key;
      }

      let result = template;
      if (params) {
        Object.entries(params).forEach(([pKey, pVal]) => {
          result = result.replace(new RegExp(`{{${pKey}}}`, 'g'), String(pVal));
        });
      }

      return result;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
