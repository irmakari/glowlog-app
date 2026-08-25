import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ProductDetailScreen } from '../../src/features/products/screens/ProductDetailScreen';

export default function ProductDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProductDetailScreen id={id || ''} />;
}
