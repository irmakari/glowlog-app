import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
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
import { Spacing } from '../../../../constants/spacing';
import { Typography } from '../../../../constants/typography';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../hooks/useTranslation';

export const ShelfScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { t, language } = useTranslation();
  const { products, loading, refreshProducts } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
      { id: 'all', label: language === 'tr' ? 'Tüm Ürünler' : 'All Products', count: products.length },
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
  }, [products, language]);

  // Filter products based on selected category & search query
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <Screen scrollable padding={12}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextCol}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.title, { color: colors.text }]}>
              {language === 'tr' ? 'Rafım' : 'My Shelf'}
            </Text>
            <Ionicons name="sparkles" size={18} color="#E59935" style={{ marginLeft: 6 }} />
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {language === 'tr' ? 'Bakım rutininizdeki tüm ürünler.' : 'Everything currently in your routine.'}
          </Text>
        </View>
        <IconButton
          icon={<Ionicons name="add" size={22} color={colors.text} />}
          onPress={handleAddProduct}
          backgroundColor={colors.white}
          size={38}
        />
      </View>

      {/* Search Bar */}
      {products.length > 0 && (
        <View
          style={[
            localStyles.searchContainer,
            {
              backgroundColor: colors.white,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={[localStyles.searchInput, { color: colors.text }]}
            placeholder={language === 'tr' ? 'Ürün veya marka ara...' : 'Search products or brands...'}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery ? (
            <IconButton
              icon={<Ionicons name="close-circle" size={18} color={colors.textSecondary} />}
              onPress={() => setSearchQuery('')}
              size={24}
              backgroundColor="transparent"
            />
          ) : null}
        </View>
      )}

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

const localStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    fontSize: 14,
    color: Colors.text,
    padding: 0,
  },
});

