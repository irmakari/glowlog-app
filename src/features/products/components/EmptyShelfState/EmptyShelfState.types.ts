import { StyleProp, ViewStyle } from 'react-native';

export interface EmptyShelfStateProps {
  onAddProduct: () => void;
  onSeedDemo?: () => void;
  style?: StyleProp<ViewStyle>;
}
