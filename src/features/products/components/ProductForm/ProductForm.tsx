import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FormField } from '../../../../components/ui/FormField';
import { PillButton } from '../../../../components/ui/PillButton';
import { Colors } from '../../../../constants/colors';
import {
  PAO_OPTIONS,
  PRODUCT_CATEGORIES,
} from '../../../../constants/productCategories';
import { CreateProductInput } from '../../types/product.types';
import { formatProductDate } from '../../utils/productDate.utils';
import { styles } from './ProductForm.styles';
import { ProductFormProps } from './ProductForm.types';

export const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const initialCatRaw = initialValues?.category?.toLowerCase() || 'cleanser';
  const isKnownCat = PRODUCT_CATEGORIES.some((c) => c.id === initialCatRaw);

  const [name, setName] = useState(initialValues?.name || '');
  const [brand, setBrand] = useState(initialValues?.brand || '');
  const [category, setCategory] = useState<string>(
    isKnownCat ? initialCatRaw : 'other'
  );
  const [customCategory, setCustomCategory] = useState<string>(
    !isKnownCat && initialValues?.category ? initialValues.category : ''
  );
  const [openedAt, setOpenedAt] = useState<Date>(
    initialValues?.openedAt ? new Date(initialValues.openedAt) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paoMonths, setPaoMonths] = useState<number>(initialValues?.paoMonths ?? 6);
  const [imageUri, setImageUri] = useState<string | undefined>(initialValues?.imageUri);
  const [notes, setNotes] = useState(initialValues?.notes || '');

  // Errors
  const [nameError, setNameError] = useState<string | undefined>(undefined);

  const handleCategoryPress = (catId: string) => {
    setCategory(catId);
  };

  const handlePaoPress = (value: number) => {
    setPaoMonths(value);
  };

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'GlowLog needs photo library access so you can add product photos.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Image picker error:', err);
    }
  };

  const handleRemoveImage = () => {
    setImageUri(undefined);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setOpenedAt(selectedDate);
    }
  };

  const handleSubmit = async () => {
    // Validate
    let valid = true;

    if (!name.trim()) {
      setNameError('Product name is required');
      valid = false;
    } else {
      setNameError(undefined);
    }

    if (!valid) return;

    const formattedDate = openedAt.toISOString().split('T')[0];

    const finalCategory =
      category.toLowerCase() === 'other'
        ? customCategory.trim() || 'Other'
        : category;

    const input: CreateProductInput = {
      name: name.trim(),
      brand: brand.trim() || undefined,
      category: finalCategory,
      openedAt: formattedDate,
      paoMonths: paoMonths > 0 ? paoMonths : undefined,
      imageUri,
      notes: notes.trim() || undefined,
    };

    await onSubmit(input);
  };

  return (
    <View style={styles.container}>
      {/* Product Name */}
      <FormField label="Product Name" required error={nameError}>
        <TextInput
          style={[styles.textInput, nameError ? styles.textInputError : null]}
          placeholder="e.g. Niacinamide 10% + Zinc 1%"
          placeholderTextColor={Colors.textMuted}
          value={name}
          onChangeText={(val) => {
            setName(val);
            if (val.trim()) setNameError(undefined);
          }}
        />
      </FormField>

      {/* Brand */}
      <FormField label="Brand">
        <TextInput
          style={styles.textInput}
          placeholder="e.g. The Ordinary"
          placeholderTextColor={Colors.textMuted}
          value={brand}
          onChangeText={setBrand}
        />
      </FormField>

      {/* Category Selection */}
      <FormField label="Category" required>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {PRODUCT_CATEGORIES.map((cat) => {
            const isSelected = category.toLowerCase() === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.7}
                onPress={() => handleCategoryPress(cat.id)}
                style={[
                  styles.categoryChip,
                  { backgroundColor: cat.color },
                  isSelected && styles.categoryChipActive,
                ]}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={14}
                  color={Colors.text}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && { fontWeight: '800' },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {category.toLowerCase() === 'other' && (
          <View style={styles.customCategoryInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Hair Oil, Body Wash..."
              placeholderTextColor={Colors.textMuted}
              value={customCategory}
              onChangeText={setCustomCategory}
            />
          </View>
        )}
      </FormField>

      {/* Opened Date */}
      <FormField label="Opened Date" required>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowDatePicker((prev) => !prev)}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>
            {formatProductDate(openedAt.toISOString().split('T')[0])}
          </Text>
          <Ionicons name="calendar-outline" size={18} color={Colors.text} />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={openedAt}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={handleDateChange}
            textColor={Colors.text}
            themeVariant="light"
            accentColor={Colors.text}
          />
        )}
      </FormField>

      {/* PAO / Period After Opening */}
      <FormField label="Use After Opening (PAO)">
        <View style={styles.paoGrid}>
          {PAO_OPTIONS.map((pao) => {
            const isSelected = paoMonths === pao.value;
            return (
              <TouchableOpacity
                key={pao.label}
                activeOpacity={0.7}
                onPress={() => handlePaoPress(pao.value)}
                style={[
                  styles.paoChip,
                  isSelected && styles.paoChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.paoChipText,
                    isSelected && styles.paoChipTextActive,
                  ]}
                >
                  {pao.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </FormField>

      {/* Product Photo */}
      <FormField label="Product Photo (Optional)">
        <View style={styles.photoContainer}>
          {imageUri ? (
            <View style={styles.photoPreview}>
              <Image
                source={{ uri: imageUri }}
                style={styles.photoImage}
                contentFit="cover"
              />
            </View>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePickImage}
            style={styles.photoButton}
          >
            <Ionicons name="camera-outline" size={16} color={Colors.text} />
            <Text style={styles.photoButtonText}>
              {imageUri ? 'Change Photo' : 'Choose Photo'}
            </Text>
          </TouchableOpacity>

          {imageUri && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleRemoveImage}
              style={styles.removePhotoButton}
            >
              <Text style={styles.removePhotoText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      </FormField>

      {/* Notes */}
      <FormField label="Notes (Optional)">
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          placeholder="Add any notes about this product..."
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={2}
          value={notes}
          onChangeText={setNotes}
        />
      </FormField>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        {onCancel && (
          <PillButton
            title="Cancel"
            onPress={onCancel}
            variant="ghost"
            size="md"
          />
        )}
        <PillButton
          title={mode === 'create' ? 'Save Product' : 'Update Product'}
          onPress={handleSubmit}
          variant="primary"
          size="md"
          loading={loading}
          style={styles.submitButton}
        />
      </View>
    </View>
  );
};
