import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { ProductCard } from '../../components/ProductCard';
import { EmptyShelfState } from '../../components/EmptyShelfState';
import { useProducts } from '../../hooks/useProducts';
import { productService } from '../../services/productService';
import { styles } from './ShelfScreen.styles';
import { Colors } from '../../../../constants/colors';

export const ShelfScreen: React.FC = () => {
  const router = useRouter();
  const { products, loading, refreshProducts } = useProducts();

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
        /* Product List */
        <View style={styles.productList}>
          {products.map((product) => (
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
