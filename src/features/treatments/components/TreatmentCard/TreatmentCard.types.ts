import { StyleProp, ViewStyle } from 'react-native';

export interface TreatmentCardProps {
  dateKey: string; // YYYY-MM-DD
  /** Past days are read-only until the day screen is put in edit mode */
  editable?: boolean;
  /** Subtitle when treatments are running but none has a dose on this day */
  emptyText?: string;
  style?: StyleProp<ViewStyle>;
}
