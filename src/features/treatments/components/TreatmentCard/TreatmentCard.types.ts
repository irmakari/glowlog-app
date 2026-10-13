import { StyleProp, ViewStyle } from 'react-native';

export interface TreatmentCardProps {
  dateKey: string; // YYYY-MM-DD
  /** Past days are read-only until the day screen is put in edit mode */
  editable?: boolean;
  /** Subtitle when treatments are running but none has a dose on this day */
  emptyText?: string;
  /** Adds a one-line heads-up when a routine product clashes with a running treatment */
  showConflicts?: boolean;
  style?: StyleProp<ViewStyle>;
}
