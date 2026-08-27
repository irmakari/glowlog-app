import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { ProductForm } from '../../components/ProductForm';
import { useProduct } from '../../hooks/useProduct';
import { productService } from '../../services/productService';
import { CreateProductInput } from '../../types/product.types';
import { EditProductScreenProps } from './EditProductScreen.types';
import { styles } from './EditProductScreen.styles';
import { Colors } from '../../../../constants/colors';

export const EditProductScreen: React.FC<EditProductScreenProps> = ({ id }) => {
  const router = useRouter();
  const { product, loading } = useProduct(id);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (input: CreateProductInput) => {
    if (!id) return;
    try {
      setSubmitting(true);
      await productService.updateProduct(id, input);
      router.back();
    } catch (err: any) {
      console.error('Failed to update product:', err);
      Alert.alert('Error', err?.message || 'Failed to update product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Screen scrollable padding={16} edges={['bottom', 'left', 'right']} contentContainerStyle={styles.scrollContent}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.text} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable padding={16} edges={['bottom', 'left', 'right']} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Edit Product 🧴</Text>
        <IconButton
          icon={<Ionicons name="close" size={20} color={Colors.text} />}
          onPress={() => router.back()}
          backgroundColor={Colors.white}
          size={36}
        />
      </View>

      <ProductForm
        mode="edit"
        initialValues={product || undefined}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        loading={submitting}
      />
    </Screen>
  );
};
