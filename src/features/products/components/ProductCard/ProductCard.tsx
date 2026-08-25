import React from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { getCategoryOption } from '../../../../constants/productCategories';
import { formatOpenedDuration } from '../../utils/productDate.utils';
import { ProductCardProps } from './ProductCard.types';
import { styles } from './ProductCard.styles';
import { Colors } from '../../../../constants/colors';

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  style,
}) => {
  const categoryInfo = getCategoryOption(product.category);
  const openedDurationText = formatOpenedDuration(product.openedAt);

  return (
    <GlowCard
      customColor={categoryInfo.color}
      padding={12}
      onPress={() => onPress(product.id)}
      style={[styles.card, style]}
    >
      <View style={styles.contentRow}>
        {/* Optional Image / Placeholder Icon */}
        <View style={styles.imageContainer}>
          {product.imageUri ? (
            <Image
              source={{ uri: product.imageUri }}
              style={styles.productImage}
              contentFit="cover"
            />
          ) : (
            <Ionicons
              name={categoryInfo.icon as any || 'sparkles'}
              size={26}
              color={Colors.text}
              style={styles.placeholderIcon}
            />
          )}
        </View>

        {/* Text Metadata */}
        <View style={styles.textColumn}>
          <View style={styles.headerRow}>
            {product.brand ? (
              <Text style={styles.brandText}>{product.brand}</Text>
            ) : (
              <View />
            )}
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: Colors.white },
              ]}
            >
              <Text style={styles.categoryBadgeText}>
                {categoryInfo.label}
              </Text>
            </View>
          </View>

          <Text style={styles.nameText} numberOfLines={2}>
            {product.name}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={12} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{openedDurationText}</Text>
            </View>
          </View>
        </View>
      </View>
    </GlowCard>
  );
};
