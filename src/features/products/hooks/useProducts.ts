import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { productService } from '../services/productService';
import { Product } from '../types/product.types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getActiveProducts();
      setProducts(data);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [fetchProducts])
  );

  return {
    products,
    loading,
    error,
    refreshProducts: fetchProducts,
  };
}
