import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { PillButton } from '../../../../components/ui/PillButton';
import { Colors } from '../../../../constants/colors';
import { useTranslation } from '../../../../hooks/useTranslation';
import { TreatmentForm } from '../../components/TreatmentForm';
import { treatmentReminderService } from '../../services/treatmentReminderService';
import { treatmentService } from '../../services/treatmentService';
import { CreateTreatmentInput, Treatment } from '../../types/treatment.types';
import { styles } from './TreatmentEditScreen.styles';
import { TreatmentEditScreenProps } from './TreatmentEditScreen.types';

export const TreatmentEditScreen: React.FC<TreatmentEditScreenProps> = ({ id }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(id));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    treatmentService
      .getTreatmentById(id)
      .then(setTreatment)
      .catch((err) => console.error('Failed to load treatment:', err))
      .finally(() => setLoading(false));
  }, [id]);

  /** Re-creates reminders and tells the user when they can't all be delivered */
  const syncReminders = async (reminderWanted: boolean) => {
    if (!reminderWanted) {
      await treatmentReminderService.sync();
      return;
    }

    const { granted, plan } = await treatmentReminderService.requestPermissionAndSync();
    if (!granted) {
      await new Promise<void>((resolve) =>
        Alert.alert(t('profile.notificationsDeniedTitle'), t('treatments.notificationsDeniedDesc'), [
          { text: t('common.cancel'), style: 'cancel', onPress: () => resolve() },
          {
            text: t('profile.openSettings'),
            onPress: () => {
              Linking.openSettings();
              resolve();
            },
          },
        ])
      );
    } else if (plan && plan.dropped > 0) {
      await new Promise<void>((resolve) =>
        Alert.alert(t('treatments.reminders'), t('treatments.reminderBudget', { count: plan.dropped }), [
          { text: t('common.done'), onPress: () => resolve() },
        ])
      );
    }
  };

  const handleSubmit = async (input: CreateTreatmentInput) => {
    try {
      setSubmitting(true);
      if (id) {
        await treatmentService.updateTreatment(id, input);
      } else {
        await treatmentService.createTreatment(input);
      }
      await syncReminders(input.reminderEnabled);
      router.back();
    } catch (err: any) {
      console.error('Failed to save treatment:', err);
      Alert.alert(t('common.error'), err?.message || t('treatments.saveFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleFinished = async () => {
    if (!treatment) return;
    await treatmentService.setArchived(treatment.id, !treatment.archived);
    await treatmentReminderService.sync();
    router.back();
  };

  const handleDelete = () => {
    if (!treatment) return;
    Alert.alert(t('treatments.deleteConfirmTitle'), t('treatments.deleteConfirmDesc'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await treatmentService.deleteTreatment(treatment.id);
          await treatmentReminderService.sync();
          router.back();
        },
      },
    ]);
  };

  return (
    <Screen scrollable padding={16} edges={['bottom', 'left', 'right']} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{id ? t('treatments.editTitle') : t('treatments.addTitle')}</Text>
        <IconButton
          icon={<Ionicons name="close" size={20} color={Colors.text} />}
          onPress={() => router.back()}
          backgroundColor={Colors.white}
          size={36}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.text} />
        </View>
      ) : (
        <>
          <TreatmentForm
            mode={id ? 'edit' : 'create'}
            initialValues={treatment ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            loading={submitting}
          />

          {treatment && (
            <View style={styles.manageSection}>
              <PillButton
                title={treatment.archived ? t('treatments.resume') : t('treatments.finish')}
                onPress={handleToggleFinished}
                variant="outline"
                size="md"
              />
              <PillButton
                title={t('treatments.delete')}
                onPress={handleDelete}
                variant="ghost"
                size="md"
                textStyle={styles.deleteText}
              />
            </View>
          )}
        </>
      )}
    </Screen>
  );
};
