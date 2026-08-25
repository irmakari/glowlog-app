import { StyleProp, ViewStyle } from 'react-native';
import { Product } from '../../types/product.types';

export interface ProductCardProps {
  product: Product;
  onPress: (id: string) => void;
  style?: StyleProp<ViewStyle>;
}
