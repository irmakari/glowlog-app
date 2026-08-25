import { CreateProductInput, Product } from '../../types/product.types';

export interface ProductFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<Product>;
  onSubmit: (input: CreateProductInput) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}
