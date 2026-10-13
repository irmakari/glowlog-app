import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from '../../../hooks/useTranslation';
import { ensureTreatmentDisclaimer } from '../utils/treatmentDisclaimer';

/** Opens the new-treatment form, showing the one-time disclaimer first */
export function useAddTreatment() {
  const router = useRouter();
  const { t } = useTranslation();

  return useCallback(async () => {
    if (await ensureTreatmentDisclaimer(t)) router.push('/treatments/edit');
  }, [router, t]);
}
