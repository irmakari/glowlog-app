import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { FormField } from '../../../../components/ui/FormField';
import { PillButton } from '../../../../components/ui/PillButton';
import { ProductSelector } from '../ProductSelector';
import { RoutineStepFormProps } from './RoutineStepForm.types';
import { styles } from './RoutineStepForm.styles';
import { Colors } from '../../../../constants/colors';

export const RoutineStepForm: React.FC<RoutineStepFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [productId, setProductId] = useState<string | undefined>(
    initialValues?.productId
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Step name is required');
      return;
    }
    setError(undefined);

    try {
      setSubmitting(true);
      await onSubmit(title.trim(), productId);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to save step');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <FormField label="Step Name" required error={error}>
        <TextInput
          style={[styles.textInput, error ? styles.textInputError : null]}
          placeholder="e.g. Cleanser, Vitamin C, SPF..."
          placeholderTextColor={Colors.textMuted}
          value={title}
          onChangeText={(val) => {
            setTitle(val);
            if (val.trim()) setError(undefined);
          }}
        />
      </FormField>

      <FormField label="Linked Product (Optional)">
        <ProductSelector
          selectedProductId={productId}
          onSelectProduct={setProductId}
        />
      </FormField>

      <View style={styles.buttonRow}>
        <PillButton
          title="Cancel"
          onPress={onCancel}
          variant="ghost"
          size="md"
        />
        <PillButton
          title={initialValues ? 'Update Step' : 'Add Step'}
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
