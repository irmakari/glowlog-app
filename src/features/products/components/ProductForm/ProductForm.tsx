import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  Switch,
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
import { getLocalDateString, parseDateKey } from '../../../routines/utils/routineDate.utils';
import { styles } from './ProductForm.styles';
import { ProductFormProps } from './ProductForm.types';
import { useTranslation } from '../../../../hooks/useTranslation';

export const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { language, t } = useTranslation();
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
    initialValues?.openedAt ? parseDateKey(initialValues.openedAt) : new Date()
  );
  // Editing a product saved without an opened date keeps it unopened
  const [isOpened, setIsOpened] = useState<boolean>(mode === 'create' || Boolean(initialValues?.openedAt));
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
          t('products.permissionRequired'),
          t('products.photoPermission')
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
    setImageUri('');
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
      setNameError(t('products.nameRequired'));
      valid = false;
    } else {
      setNameError(undefined);
    }

    if (!valid) return;


    const finalCategory =
      category.toLowerCase() === 'other'
        ? customCategory.trim() || 'Other'
        : category;

    const input: CreateProductInput = {
      name: name.trim(),
      brand: brand.trim() || undefined,
      category: finalCategory,
      // Local date key: toISOString() would shift the day in timezones ahead of UTC late at night
      openedAt: isOpened ? getLocalDateString(openedAt) : undefined,
      paoMonths: paoMonths > 0 ? paoMonths : undefined,
      imageUri,
      notes: notes.trim() || undefined,
    };

    await onSubmit(input);
  };

  return (
    <View style={styles.container}>
      {/* Product Name */}
      <FormField label={t('products.name')} required error={nameError}>
        <TextInput
          style={[styles.textInput, nameError ? styles.textInputError : null]}
          placeholder={t('products.namePlaceholder')}
          placeholderTextColor={Colors.textMuted}
          value={name}
          onChangeText={(val) => {
            setName(val);
            if (val.trim()) setNameError(undefined);
          }}
        />
      </FormField>

      {/* Brand */}
      <FormField label={t('products.brand')}>
        <TextInput
          style={styles.textInput}
          placeholder={t('products.brandPlaceholder')}
          placeholderTextColor={Colors.textMuted}
          value={brand}
          onChangeText={setBrand}
        />
      </FormField>

      {/* Category Selection */}
      <FormField label={t('products.category')} required>
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
                  {t(`products.${cat.id}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {category.toLowerCase() === 'other' && (
          <View style={styles.customCategoryInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={t('products.customCategoryPlaceholder')}
              placeholderTextColor={Colors.textMuted}
              value={customCategory}
              onChangeText={setCustomCategory}
            />
          </View>
        )}
      </FormField>

      {/* Opened Date */}
      <FormField label={t('products.openedDate')}>
        <View style={styles.openedToggleRow}>
          <Text style={styles.openedToggleText}>{t('products.alreadyOpened')}</Text>
          <Switch
            value={isOpened}
            onValueChange={(value) => {
              setIsOpened(value);
              if (!value) setShowDatePicker(false);
            }}
            trackColor={{ false: Colors.border, true: Colors.sageGreen }}
            thumbColor={Colors.white}
          />
        </View>

        {isOpened && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowDatePicker((prev) => !prev)}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              {formatProductDate(getLocalDateString(openedAt), language === 'tr' ? 'tr-TR' : 'en-US')}
            </Text>
            <Ionicons name="calendar-outline" size={18} color={Colors.text} />
          </TouchableOpacity>
        )}

        {isOpened && showDatePicker && (
          <DateTimePicker
            value={openedAt}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={handleDateChange}
            locale={language === 'tr' ? 'tr-TR' : 'en-US'}
            textColor={Colors.text}
            themeVariant="light"
            accentColor={Colors.text}
          />
        )}
      </FormField>

      {/* PAO / Period After Opening */}
      <FormField label={t('products.pao')}>
        <View style={styles.paoGrid}>
          {PAO_OPTIONS.map((pao) => {
            const isSelected = paoMonths === pao.value;
            return (
              <TouchableOpacity
                key={pao.value ? t('products.months', { count: pao.value }) : t('products.paoUnsure')}
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
                  {pao.value ? t('products.months', { count: pao.value }) : t('products.paoUnsure')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </FormField>

      {/* Product Photo */}
      <FormField label={t('products.photo')}>
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
              {imageUri ? t('products.changePhoto') : t('products.choosePhoto')}
            </Text>
          </TouchableOpacity>

          {imageUri && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleRemoveImage}
              style={styles.removePhotoButton}
            >
              <Text style={styles.removePhotoText}>{t('routineEditor.remove')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </FormField>

      {/* Notes */}
      <FormField label={t('products.notesOptional')}>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          placeholder={t('products.notesPlaceholder')}
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
            title={t('common.cancel')}
            onPress={onCancel}
            variant="ghost"
            size="md"
          />
        )}
        <PillButton
          title={mode === 'create' ? t('products.saveProduct') : t('products.updateProduct')}
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
