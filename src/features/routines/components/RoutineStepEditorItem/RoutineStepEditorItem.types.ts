import { RoutineStepWithProduct } from '../../types/routine.types';

export interface RoutineStepEditorItemProps {
  step: RoutineStepWithProduct;
  index: number;
  totalSteps: number;
  onEdit: (step: RoutineStepWithProduct) => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}
