import React from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { getCategoryDisplayName, getCategoryOption } from '../../../../constants/productCategories';
import { getDaysSinceOpened, getPAOStatus } from '../../utils/productDate.utils';
import { ProductCardProps } from './ProductCard.types';
import { styles } from './ProductCard.styles';
import { Colors } from '../../../../constants/colors';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../hooks/useTranslation';

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  style,
}) => {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const categoryInfo = getCategoryOption(product.category);
  const openedDays = getDaysSinceOpened(product.openedAt);
  const openedDurationText = openedDays === null ? t('products.unopened')
    : openedDays === 0 ? t('products.openedToday')
    : openedDays === 1 ? t('products.openedYesterday')
    : openedDays < 30 ? t('products.openedDaysAgo', { count: openedDays })
    : openedDays < 365 ? t('products.openedMonthsAgo', { count: Math.floor(openedDays / 30) })
    : t('products.openedYearsAgo', { count: Math.floor(openedDays / 365) });
  const isPastPao = getPAOStatus(product.openedAt, product.paoMonths).isExpired;

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
                {getCategoryDisplayName(product.category, t)}
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
            {isPastPao && (
              <View style={styles.metaItem}>
                <Ionicons name="alert-circle-outline" size={12} color={Colors.alert} />
                <Text style={[styles.metaText, { color: Colors.alert }]}>{t('products.pastPao')}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </GlowCard>
  );
};
