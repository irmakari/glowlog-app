import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { ProductForm } from '../../components/ProductForm';
import { productService } from '../../services/productService';
import { CreateProductInput } from '../../types/product.types';
import { styles } from './AddProductScreen.styles';
import { Colors } from '../../../../constants/colors';

export const AddProductScreen: React.FC = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (input: CreateProductInput) => {
    try {
      setSubmitting(true);
      await productService.createProduct(input);
      router.back();
    } catch (err: any) {
      console.error('Failed to create product:', err);
      Alert.alert('Error', err?.message || 'Failed to save product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen scrollable padding={16} edges={['bottom', 'left', 'right']} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Add New Product</Text>
        <IconButton
          icon={<Ionicons name="close" size={20} color={Colors.text} />}
          onPress={() => router.back()}
          backgroundColor={Colors.white}
          size={36}
        />
      </View>

      <ProductForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        loading={submitting}
      />
    </Screen>
  );
};
