import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { productService } from '../../../products/services/productService';
import { Product } from '../../../products/types/product.types';
import { ProductSelectorProps } from './ProductSelector.types';
import { styles } from './ProductSelector.styles';
import { Colors } from '../../../../constants/colors';

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedProductId,
  onSelectProduct,
  productsOverride,
}) => {
  const [products, setProducts] = useState<Product[]>(productsOverride || []);

  useEffect(() => {
    if (productsOverride) {
      setProducts(productsOverride);
      return;
    }
    productService.getActiveProducts().then(setProducts).catch(console.error);
  }, [productsOverride]);

  return (
    <View style={styles.container}>
      {/* Option: None */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onSelectProduct(undefined)}
        style={[
          styles.optionCard,
          !selectedProductId && styles.optionCardSelected,
        ]}
      >
        <View style={styles.textCol}>
          <Text style={styles.nameText}>None / Generic Step</Text>
        </View>
        {!selectedProductId && (
          <Ionicons name="checkmark-circle" size={18} color={Colors.text} />
        )}
      </TouchableOpacity>

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products on your Shelf yet.</Text>
        </View>
      ) : (
        products.map((prod) => {
          const isSelected = selectedProductId === prod.id;
          return (
            <TouchableOpacity
              key={prod.id}
              activeOpacity={0.8}
              onPress={() => onSelectProduct(prod.id)}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected,
              ]}
            >
              <View style={styles.textCol}>
                {prod.brand ? (
                  <Text style={styles.brandText}>{prod.brand}</Text>
                ) : null}
                <Text style={styles.nameText}>{prod.name}</Text>
              </View>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={18} color={Colors.text} />
              )}
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};
