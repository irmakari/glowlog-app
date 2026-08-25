import { Product } from '../../../products/types/product.types';

export interface ProductSelectorProps {
  selectedProductId?: string;
  onSelectProduct: (productId?: string) => void;
  productsOverride?: Product[];
}
