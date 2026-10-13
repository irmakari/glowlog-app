import { CreateTreatmentInput, Treatment } from '../../types/treatment.types';

export interface TreatmentFormProps {
  mode: 'create' | 'edit';
  initialValues?: Treatment;
  onSubmit: (input: CreateTreatmentInput) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}
