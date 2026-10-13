import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { ProductCard } from '../../components/ProductCard';
import { EmptyShelfState } from '../../components/EmptyShelfState';
import { CategoryFilterChips } from '../../components/CategoryFilterChips';
import { useProducts } from '../../hooks/useProducts';
import { PRODUCT_CATEGORIES, getCategoryFilterId } from '../../../../constants/productCategories';
import { styles } from './ShelfScreen.styles';
import { Colors } from '../../../../constants/colors';
import { Spacing } from '../../../../constants/spacing';
import { Typography } from '../../../../constants/typography';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../hooks/useTranslation';

export const ShelfScreen: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { products: activeProducts, archivedProducts, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showArchived, setShowArchived] = useState<boolean>(false);
  // Leave the archive view automatically once its last product is restored or deleted
  const isArchiveView = showArchived && archivedProducts.length > 0;
  const products = isArchiveView ? archivedProducts : activeProducts;

  const handleToggleArchive = () => {
    setShowArchived((prev) => !prev);
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const handleAddProduct = () => {
    router.push('/product/add');
  };

  const handleProductPress = (id: string) => {
    router.push(`/product/${id}`);
  };

  // Build category filter list dynamically based on active products
  const categoryFilterItems = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const cat = getCategoryFilterId(p.category);
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const items = [
      { id: 'all', label: t('shelf.allProducts'), count: products.length },
    ];

    PRODUCT_CATEGORIES.forEach((catOpt) => {
      const cnt = counts[catOpt.id] || 0;
      if (cnt > 0) {
        items.push({
          id: catOpt.id,
          label: t(`products.${catOpt.id}`),
          count: cnt,
        });
      }
    });

    return items;
  }, [products, t]);

  // Filter products based on selected category & search query
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' || getCategoryFilterId(p.category) === selectedCategory;
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
              {isArchiveView ? t('shelf.archiveTitle') : t('shelf.title')}
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isArchiveView ? t('shelf.archiveSubtitle') : t('shelf.subtitle')}
          </Text>
        </View>
        {isArchiveView ? (
          <IconButton
            icon={<Ionicons name="close" size={20} color={colors.text} />}
            onPress={handleToggleArchive}
            backgroundColor={colors.white}
            size={38}
          />
        ) : (
          <IconButton
            icon={<Ionicons name="add" size={22} color={colors.text} />}
            onPress={handleAddProduct}
            backgroundColor={colors.white}
            size={38}
          />
        )}
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
            placeholder={t('shelf.searchPlaceholder')}
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
        />
      ) : (
        /* Clean Filtered Product Cards List */
        <View style={styles.productList}>
          {filteredProducts.length === 0 ? (
            <Text style={[localStyles.noResultsText, { color: colors.textSecondary }]}>
              {t('shelf.noResults')}
            </Text>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={handleProductPress}
              />
            ))
          )}
        </View>
      )}

      {/* Archive entry point */}
      {!loading && !isArchiveView && archivedProducts.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleToggleArchive}
          style={localStyles.archiveLink}
          accessibilityRole="button"
        >
          <Ionicons name="archive-outline" size={16} color={colors.textSecondary} />
          <Text style={[localStyles.archiveLinkText, { color: colors.textSecondary }]}>
            {t('shelf.viewArchived', { count: archivedProducts.length })}
          </Text>
        </TouchableOpacity>
      )}
    </Screen>
  );
};

const localStyles = StyleSheet.create({
  noResultsText: {
    ...Typography.body,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  archiveLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
  },
  archiveLinkText: {
    ...Typography.bodyBold,
    fontSize: 13,
  },
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
