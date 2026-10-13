import { StyleProp, ViewStyle } from 'react-native';
import { Treatment } from '../../types/treatment.types';
import { TreatmentConflict } from '../../utils/treatmentConflicts';

export interface TreatmentConflictNoticeProps {
  conflicts: TreatmentConflict[];
  /** Running treatments that make skin sun-sensitive (full notice only) */
  sunSensitive?: Treatment[];
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}
