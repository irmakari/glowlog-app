export interface Product {
  id: string;
  name: string;
  brand?: string;
  category: string;
  openedAt?: string; // YYYY-MM-DD
  paoMonths?: number;
  imageUri?: string;
  notes?: string;
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
}

export interface UpdateProductInput {
  name?: string;
  brand?: string;
  category?: string;
  openedAt?: string;
  paoMonths?: number;
  imageUri?: string;
  notes?: string;
  archived?: boolean;
}
