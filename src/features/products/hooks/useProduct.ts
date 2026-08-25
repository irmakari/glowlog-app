import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { productService } from '../services/productService';
import { Product } from '../types/product.types';

export function useProduct(id?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (err: any) {
      console.error(`Error fetching product ${id}:`, err);
      setError(err?.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchProduct();
    }, [fetchProduct])
  );

  return {
    product,
    loading,
    error,
    refreshProduct: fetchProduct,
  };
}
