import { RoutineStepWithProduct } from '../../types/routine.types';

export interface RoutineStepFormProps {
  initialValues?: RoutineStepWithProduct;
  onSubmit: (title: string, productId?: string) => Promise<void>;
  onCancel: () => void;
}
