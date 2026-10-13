import { Alert } from 'react-native';
import { settingsService } from '../../../services/settingsService';

type Translate = (key: string) => string;

/**
 * Shows the "not medical advice" note the first time the user adds a treatment.
 * Resolves true once it has been accepted (now or before), false if dismissed.
 */
export async function ensureTreatmentDisclaimer(t: Translate): Promise<boolean> {
  const settings = await settingsService.getSettings();
  if (settings.treatmentDisclaimerAccepted) return true;

  return new Promise((resolve) => {
    Alert.alert(
      t('treatments.disclaimerTitle'),
      t('treatments.disclaimerBody'),
      [
        { text: t('common.cancel'), style: 'cancel', onPress: () => resolve(false) },
        {
          text: t('treatments.disclaimerAccept'),
          onPress: async () => {
            await settingsService.updateSetting('treatmentDisclaimerAccepted', true);
            resolve(true);
          },
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    );
  });
}
