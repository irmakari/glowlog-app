import React from 'react';
import { Text, View } from 'react-native';
import { FormFieldProps } from './FormField.types';
import { styles } from './FormField.styles';

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  children,
  style,
  labelStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        {required && <Text style={styles.requiredAsterisk}>*</Text>}
      </View>
      {children}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};
