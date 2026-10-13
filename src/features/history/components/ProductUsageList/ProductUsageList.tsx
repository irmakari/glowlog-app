import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { getCategoryOption } from '../../../../constants/productCategories';
import { ProductUsageListProps } from './ProductUsageList.types';
import { styles } from './ProductUsageList.styles';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../hooks/useTranslation';

export const ProductUsageList: React.FC<ProductUsageListProps> = ({ products }) => {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  return (
    <GlowCard variant="softPeach" padding={16} style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.7)' }]}>
          <Ionicons name="cube" size={16} color={colors.text} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{t('history.productsUsed')}</Text>
        {products.length > 0 && (
          <Text style={[styles.count, { color: colors.textSecondary }]}>{products.length}</Text>
        )}
      </View>
      {products.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('history.noProductsToday')}</Text>
      ) : (
        <View style={[styles.listContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.55)' }]}>
          {products.map((item, index) => {
            const category = getCategoryOption(item.product?.category ?? 'other');
            return (
              <View
                key={item.id}
                style={[
                  styles.itemRow,
                  index < products.length - 1 && [styles.itemBorder, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(21,21,21,0.06)' }],
                ]}
              >
                <View style={[styles.itemIcon, { backgroundColor: category.color }]}>
                  <Ionicons name={category.icon as any} size={14} color={colors.text} />
                </View>
                <View style={styles.textCol}>
                  {item.product?.brand ? (
                    <Text style={[styles.brandText, { color: colors.textSecondary }]} numberOfLines={1}>{item.product.brand}</Text>
                  ) : null}
                  <Text style={[styles.nameText, { color: colors.text }]} numberOfLines={1}>
                    {item.product?.name || t('history.skincareProduct')}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </GlowCard>
  );
};
