import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { ProductUsageListProps } from './ProductUsageList.types';
import { styles } from './ProductUsageList.styles';
import { Colors } from '../../../../constants/colors';

export const ProductUsageList: React.FC<ProductUsageListProps> = ({ products }) => {
  return (
    <GlowCard variant="softPeach" padding={14} style={styles.card}>
      <Text style={styles.title}>Products Used</Text>
      {products.length === 0 ? (
        <Text style={styles.emptyText}>No products logged for this day.</Text>
      ) : (
        products.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.itemRow,
              index === products.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <View style={styles.itemIcon}>
              <Ionicons name="sparkles" size={16} color={Colors.text} />
            </View>
            <View style={styles.textCol}>
              {item.product?.brand ? (
                <Text style={styles.brandText}>{item.product.brand}</Text>
              ) : null}
              <Text style={styles.nameText}>
                {item.product?.name || 'Skincare product'}
              </Text>
            </View>
          </View>
        ))
      )}
    </GlowCard>
  );
};
