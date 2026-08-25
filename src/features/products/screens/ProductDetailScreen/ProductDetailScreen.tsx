import React from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { PillButton } from '../../../../components/ui/PillButton';
import { getCategoryOption } from '../../../../constants/productCategories';
import { useProduct } from '../../hooks/useProduct';
import { productService } from '../../services/productService';
import {
  formatOpenedDuration,
  formatProductDate,
  getPAOStatus,
  getDaysSinceOpened,
} from '../../utils/productDate.utils';
import { ProductDetailScreenProps } from './ProductDetailScreen.types';
import { styles } from './ProductDetailScreen.styles';
import { Colors } from '../../../../constants/colors';

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ id }) => {
  const router = useRouter();
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
            backgroundColor={Colors.white}
          />
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.nameText}>Product not found 🧴</Text>
        </View>
      </Screen>
    );
  }

  const categoryInfo = getCategoryOption(product.category);
  const daysOpened = getDaysSinceOpened(product.openedAt);
  const paoStatus = getPAOStatus(product.openedAt, product.paoMonths);

  const handleEdit = () => {
    router.push(`/product/edit/${product.id}`);
  };

  const handleArchive = () => {
    Alert.alert(
      'Archive this product?',
      "You can keep its past activity while removing it from your active shelf.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.archiveProduct(product.id);
              router.back();
            } catch (err) {
              console.error('Failed to archive product:', err);
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
          backgroundColor={Colors.white}
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
          <Text style={styles.categoryBadgeText}>{categoryInfo.label}</Text>
        </View>
      </View>

      {/* Details Card */}
      <GlowCard variant="cream" padding={14} style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Opened Date</Text>
          <Text style={styles.detailValue}>
            {formatProductDate(product.openedAt)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Open For</Text>
          <Text style={styles.detailValue}>
            {daysOpened !== null ? `${daysOpened} days` : 'Unopened'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>PAO Duration</Text>
          <Text style={styles.detailValue}>
            {product.paoMonths ? `${product.paoMonths} months` : 'Not specified'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Logged Uses</Text>
          <Text style={styles.detailValue}>{product.usageCount || 0}</Text>
        </View>

        <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.detailLabel}>Last Used</Text>
          <Text style={styles.detailValue}>
            {product.lastUsedAt ? formatProductDate(product.lastUsedAt) : 'Not logged yet'}
          </Text>
        </View>
      </GlowCard>

      {/* PAO Notice Banner if applicable */}
      {paoStatus.isNotice && (
        <GlowCard variant="softPeach" padding={12}>
          <Text style={{ ...styles.detailValue, color: Colors.alert }}>
            Notice: {paoStatus.message}
          </Text>
        </GlowCard>
      )}

      {/* Notes */}
      {product.notes ? (
        <GlowCard variant="white" padding={14} style={styles.notesCard}>
          <Text style={styles.notesTitle}>Notes</Text>
          <Text style={styles.notesText}>{product.notes}</Text>
        </GlowCard>
      ) : null}

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <PillButton
          title="Edit Product"
          onPress={handleEdit}
          variant="secondary"
          pastelColor="pink"
          size="md"
          style={styles.buttonFlex}
        />
        <PillButton
          title="Archive Product"
          onPress={handleArchive}
          variant="outline"
          size="md"
          style={styles.buttonFlex}
        />
      </View>
    </Screen>
  );
};
