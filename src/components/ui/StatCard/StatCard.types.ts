import { ColorVariant } from '../../../constants/colors';

export interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  variant?: ColorVariant;
  icon?: string;
}
