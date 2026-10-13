import React from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { PillButton } from '../../../../components/ui/PillButton';
import { getCategoryDisplayName, getCategoryOption } from '../../../../constants/productCategories';
import { useProduct } from '../../hooks/useProduct';
import { productService } from '../../services/productService';
import {
  formatProductDate,
  getPAOStatus,
  getDaysSinceOpened,
} from '../../utils/productDate.utils';
import { ProductDetailScreenProps } from './ProductDetailScreen.types';
import { styles } from './ProductDetailScreen.styles';
import { Colors } from '../../../../constants/colors';
import { useTranslation } from '../../../../hooks/useTranslation';

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ id }) => {
  const router = useRouter();
  const { language, t } = useTranslation();
  const locale = language === 'tr' ? 'tr-TR' : 'en-US';
  const { product, loading } = useProduct(id);

  if (loading) {
    return (
      <Screen scrollable padding={16}>
        <View style={styles.notFoundContainer}>
          <ActivityIndicator size="small" color={Colors.text} />
        </View>
      </Screen>
    );
  }

  if (!product) {
    return (
      <Screen scrollable padding={16}>
        <View style={styles.headerNav}>
          <IconButton
            icon={<Ionicons name="arrow-back" size={20} color={Colors.text} />}
            onPress={() => router.back()}
            variant="ghost"
          />
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.nameText}>{t('products.notFound')}</Text>
        </View>
      </Screen>
    );
  }

  const categoryInfo = getCategoryOption(product.category);
  const daysOpened = getDaysSinceOpened(product.openedAt);
  const paoStatus = getPAOStatus(product.openedAt, product.paoMonths);

  const handleUnarchive = async () => {
    try {
      await productService.unarchiveProduct(product.id);
      router.back();
    } catch (err) {
      console.error('Failed to unarchive product:', err);
      Alert.alert(t('common.error'), t('products.updateFailed'));
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('products.deleteConfirm'),
      t('products.deleteDesc'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.deleteProduct(product.id);
              router.back();
            } catch (err) {
              console.error('Failed to delete product:', err);
              Alert.alert(t('common.error'), t('products.deleteFailed'));
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push(`/product/edit/${product.id}`);
  };

  const handleArchive = () => {
    Alert.alert(
      t('products.archiveConfirm'),
      t('products.archiveDesc'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('products.archive'),
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.archiveProduct(product.id);
              router.back();
            } catch (err) {
              console.error('Failed to archive product:', err);
              Alert.alert(t('common.error'), t('products.updateFailed'));
            }
          },
        },
      ]
    );
  };

  return (
    <Screen scrollable padding={16}>
      {/* Top Nav */}
      <View style={styles.headerNav}>
        <IconButton
          icon={<Ionicons name="arrow-back" size={20} color={Colors.text} />}
          onPress={() => router.back()}
          variant="ghost"
          size={38}
        />
        <IconButton
          icon={<Ionicons name="pencil" size={18} color={Colors.text} />}
          onPress={handleEdit}
          backgroundColor={Colors.white}
          size={38}
        />
      </View>

      {/* Hero Image or Category Color Card */}
      <View style={[styles.heroImageContainer, { backgroundColor: categoryInfo.color }]}>
        {product.imageUri ? (
          <Image
            source={{ uri: product.imageUri }}
            style={styles.heroImage}
            contentFit="cover"
          />
        ) : (
          <Ionicons name={categoryInfo.icon as any || 'sparkles'} size={64} color={Colors.text} />
        )}
      </View>

      {/* Header Info */}
      {product.brand ? (
        <Text style={styles.brandText}>{product.brand}</Text>
      ) : null}
      <Text style={styles.nameText}>{product.name}</Text>

      <View style={styles.badgeRow}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color }]}>
          <Text style={styles.categoryBadgeText}>{getCategoryDisplayName(product.category, t)}</Text>
        </View>
      </View>

      {/* Details Card */}
      <GlowCard variant="cream" padding={14} style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('products.openedDate')}</Text>
          <Text style={styles.detailValue}>
            {product.openedAt ? formatProductDate(product.openedAt, locale) : t('products.unopened')}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('products.openFor')}</Text>
          <Text style={styles.detailValue}>
            {daysOpened !== null ? t('products.days', { count: daysOpened }) : t('products.unopened')}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('products.paoDuration')}</Text>
          <Text style={styles.detailValue}>
            {product.paoMonths ? t('products.months', { count: product.paoMonths }) : t('products.notSpecified')}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('products.loggedUses')}</Text>
          <Text style={styles.detailValue}>{product.usageCount || 0}</Text>
        </View>

        <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.detailLabel}>{t('products.lastUsed')}</Text>
          <Text style={styles.detailValue}>
            {product.lastUsedAt ? formatProductDate(product.lastUsedAt, locale) : t('products.notLogged')}
          </Text>
        </View>
      </GlowCard>

      {/* PAO Notice Banner if applicable */}
      {paoStatus.isExpired && (
        <GlowCard variant="softPeach" padding={12}>
          <Text style={{ ...styles.detailValue, color: Colors.alert }}>
            {t('today.notice')}: {t('products.paoNotice', { opened: paoStatus.monthsOpen, recommended: product.paoMonths ?? 0 })}
          </Text>
        </GlowCard>
      )}

      {/* Notes */}
      {product.notes ? (
        <GlowCard variant="white" padding={14} style={styles.notesCard}>
          <Text style={styles.notesTitle}>{t('products.notes')}</Text>
          <Text style={styles.notesText}>{product.notes}</Text>
        </GlowCard>
      ) : null}

      {/* Action Buttons with Dynamic Category Color Theme */}
      {product.archived ? (
        <View style={styles.actionRow}>
          <PillButton
            title={t('products.unarchiveProduct')}
            onPress={handleUnarchive}
            variant="secondary"
            customColor={categoryInfo.color}
            size="md"
            style={styles.buttonFlex}
          />
          <PillButton
            title={t('products.deleteProduct')}
            onPress={handleDelete}
            variant="outline"
            size="md"
            style={styles.buttonFlex}
          />
        </View>
      ) : (
        <View style={styles.actionRow}>
          <PillButton
            title={t('products.editProduct')}
            onPress={handleEdit}
            variant="secondary"
            customColor={categoryInfo.color}
            size="md"
            style={styles.buttonFlex}
          />
          <PillButton
            title={t('products.archiveProduct')}
            onPress={handleArchive}
            variant="outline"
            size="md"
            style={styles.buttonFlex}
          />
        </View>
      )}
    </Screen>
  );
};
