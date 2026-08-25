import React, { useState, useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { ProductCard } from '../../components/ProductCard';
import { EmptyShelfState } from '../../components/EmptyShelfState';
import { CategoryFilterChips } from '../../components/CategoryFilterChips';
import { useProducts } from '../../hooks/useProducts';
import { productService } from '../../services/productService';
import { PRODUCT_CATEGORIES } from '../../../../constants/productCategories';
import { styles } from './ShelfScreen.styles';
import { Colors } from '../../../../constants/colors';

export const ShelfScreen: React.FC = () => {
  const router = useRouter();
  const { products, loading, refreshProducts } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleAddProduct = () => {
    router.push('/product/add');
  };

  const handleProductPress = (id: string) => {
    router.push(`/product/${id}`);
  };

  const handleSeedDemo = async () => {
    await productService.seedDemoProducts();
    await refreshProducts();
  };

  // Build category filter list dynamically based on active products
  const categoryFilterItems = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const cat = p.category.toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const items = [
      { id: 'all', label: 'All Products', count: products.length },
    ];

    PRODUCT_CATEGORIES.forEach((catOpt) => {
      const cnt = counts[catOpt.id] || 0;
      if (cnt > 0) {
        items.push({
          id: catOpt.id,
          label: catOpt.label,
          count: cnt,
        });
      }
    });

    return items;
  }, [products]);

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter((p) => p.category.toLowerCase() === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <Screen scrollable padding={12}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextCol}>
          <Text style={styles.title}>My Shelf 🧴</Text>
          <Text style={styles.subtitle}>
            Everything currently in your routine.
          </Text>
        </View>
        <IconButton
          icon={<Ionicons name="add" size={22} color={Colors.text} />}
          onPress={handleAddProduct}
          backgroundColor={Colors.white}
          size={38}
        />
      </View>

      {/* Category Filter Chips Bar */}
      {products.length > 0 && (
        <View style={styles.chipsWrapper}>
          <CategoryFilterChips
            categories={categoryFilterItems}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </View>
      )}

      {/* Loading state */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.text} />
        </View>
      ) : products.length === 0 ? (
        /* Empty State */
        <EmptyShelfState
          onAddProduct={handleAddProduct}
          onSeedDemo={handleSeedDemo}
        />
      ) : (
        /* Clean Filtered Product Cards List */
        <View style={styles.productList}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={handleProductPress}
            />
          ))}
        </View>
      )}
    </Screen>
  );
};
