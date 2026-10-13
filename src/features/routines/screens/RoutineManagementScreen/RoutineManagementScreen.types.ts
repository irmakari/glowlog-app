import { RoutineType } from '../../types/routine.types';

export interface RoutineManagementScreenProps {
  initialType?: RoutineType;
  /** Opens this step's edit form once steps load (e.g. "Link a product" from Today) */
  initialEditStepId?: string;
}
