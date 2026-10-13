import { ProductActive } from '../../../constants/productActives';

export interface Product {
  id: string;
  name: string;
  brand?: string;
  category: string;
  openedAt?: string; // YYYY-MM-DD
  paoMonths?: number;
  imageUri?: string;
  notes?: string;
  /** Actives the user tagged, for treatment conflict warnings */
  actives?: ProductActive[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;

  // Computed/display fields
  usageCount?: number;
  lastUsedAt?: string;
}

export interface CreateProductInput {
  name: string;
  brand?: string;
  category: string;
  openedAt?: string; // YYYY-MM-DD
  paoMonths?: number;
  imageUri?: string;
  notes?: string;
  actives?: ProductActive[];
}

export interface UpdateProductInput {
  name?: string;
  brand?: string;
  category?: string;
  openedAt?: string;
  paoMonths?: number;
  imageUri?: string;
  notes?: string;
  actives?: ProductActive[];
  archived?: boolean;
}
