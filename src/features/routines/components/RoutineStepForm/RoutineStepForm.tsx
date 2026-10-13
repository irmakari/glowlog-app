import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { FormField } from '../../../../components/ui/FormField';
import { PillButton } from '../../../../components/ui/PillButton';
import { ProductSelector } from '../ProductSelector';
import { TreatmentConflictHint } from '../../../treatments/components/TreatmentConflictHint';
import { RoutineStepFormProps } from './RoutineStepForm.types';
import { styles } from './RoutineStepForm.styles';
import { Colors } from '../../../../constants/colors';
import { useTranslation } from '../../../../hooks/useTranslation';

export const RoutineStepForm: React.FC<RoutineStepFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialValues?.title || '');
  // `product` is only set for active products, so an archived link starts as "none"
  const [productId, setProductId] = useState<string | undefined>(
    initialValues?.product?.id
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError(t('routineEditor.stepNameRequired'));
      return;
    }
    setError(undefined);

    try {
      setSubmitting(true);
      await onSubmit(title.trim(), productId);
    } catch (err: any) {
      Alert.alert(t('common.error'), err?.message || t('routineEditor.saveStepFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <FormField label={t('routineEditor.stepName')} required error={error}>
        <TextInput
          style={[styles.textInput, error ? styles.textInputError : null]}
          placeholder={t('routineEditor.stepNamePlaceholder')}
          placeholderTextColor={Colors.textMuted}
          value={title}
          onChangeText={(val) => {
            setTitle(val);
            if (val.trim()) setError(undefined);
          }}
        />
      </FormField>

      <FormField label={t('routineEditor.linkedProduct')}>
        <ProductSelector
          selectedProductId={productId}
          onSelectProduct={setProductId}
        />
        <TreatmentConflictHint productId={productId} />
      </FormField>

      <View style={styles.buttonRow}>
        <PillButton
          title={t('common.cancel')}
          onPress={onCancel}
          variant="ghost"
          size="md"
        />
        <PillButton
          title={initialValues ? t('routineEditor.updateStep') : t('routineEditor.addStep')}
          onPress={handleSubmit}
          variant="primary"
          size="md"
          loading={submitting}
          style={styles.buttonFlex}
        />
      </View>
    </View>
  );
};
