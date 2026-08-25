import { ReactNode } from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}
