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
import { useTheme } from '../../../../context/ThemeContext';

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  style,
}) => {
  const { colors, isDark } = useTheme();
  const categoryInfo = getCategoryOption(product.category);
  const openedDurationText = formatOpenedDuration(product.openedAt);

  return (
    <GlowCard
      variant={categoryInfo.variant || 'cream'}
      padding={12}
      onPress={() => onPress(product.id)}
      style={[styles.card, style]}
    >
      <View style={styles.contentRow}>
        {/* Optional Image / Placeholder Icon */}
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.white },
          ]}
        >
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
              color={colors.text}
              style={styles.placeholderIcon}
            />
          )}
        </View>

        {/* Text Metadata */}
        <View style={styles.textColumn}>
          <View style={styles.headerRow}>
            {product.brand ? (
              <Text style={[styles.brandText, { color: colors.textSecondary }]}>{product.brand}</Text>
            ) : (
              <View />
            )}
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.14)' : Colors.white },
              ]}
            >
              <Text style={[styles.categoryBadgeText, { color: isDark ? colors.text : Colors.text }]}>
                {categoryInfo.label}
              </Text>
            </View>
          </View>

          <Text style={[styles.nameText, { color: colors.text }]} numberOfLines={2}>
            {product.name}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>{openedDurationText}</Text>
            </View>
          </View>
        </View>
      </View>
    </GlowCard>
  );
};
