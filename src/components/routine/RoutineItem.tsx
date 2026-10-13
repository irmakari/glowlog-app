import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

export interface RoutineItemProps {
  id: string;
  title: string;
  productName?: string;
  isProductArchived?: boolean;
  completed: boolean;
  onToggle: (id: string) => void;
  isLast?: boolean;
  /** Read-only rows (e.g. a past day that isn't in edit mode) */
  disabled?: boolean;
  /** Shows a "Link a product" action under open steps without a product */
  onLinkProduct?: (id: string) => void;
}

export const RoutineItem: React.FC<RoutineItemProps> = ({
  id,
  title,
  productName,
  isProductArchived = false,
  completed,
  onToggle,
  isLast = false,
  disabled = false,
  onLinkProduct,
}) => {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const scaleVal = useSharedValue(1);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scaleVal.value = withSpring(0.92, {}, () => {
      scaleVal.value = withSpring(1);
    });
    onToggle(id);
  };

  const checkboxAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleVal.value }],
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: completed, disabled }}
      style={[
        styles.container,
        !isLast && [styles.borderBottom, { borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(21, 21, 21, 0.06)' }],
      ]}
    >
      <Animated.View style={[styles.checkboxWrapper, checkboxAnimatedStyle]}>
        <View
          style={[
            styles.checkbox,
            completed
              ? { backgroundColor: colors.text }
              : {
                  backgroundColor: 'transparent',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(21, 21, 21, 0.28)',
                  borderWidth: 1.5,
                },
          ]}
        >
          {completed && (
            <Ionicons name="checkmark" size={14} color={isDark ? colors.background : Colors.white} />
          )}
        </View>
      </Animated.View>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
            completed && [styles.titleCompleted, { color: colors.textSecondary }],
          ]}
        >
          {title}
        </Text>
        {productName ? (
          <Text
            style={[
              styles.productSubtitle,
              { color: colors.textSecondary },
              completed && styles.productSubtitleCompleted,
            ]}
          >
            {productName}
          </Text>
        ) : isProductArchived ? (
          <Text style={styles.archivedText}>{t('today.productArchived')}</Text>
        ) : onLinkProduct && !completed && !disabled ? (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => onLinkProduct(id)}
            accessibilityRole="button"
            accessibilityLabel={`${title}: ${t('today.linkProduct')}`}
            hitSlop={{ top: 6, bottom: 6, left: 4, right: 12 }}
            style={styles.linkProduct}
          >
            <Ionicons name="add" size={13} color={colors.textSecondary} />
            <Text style={[styles.linkProductText, { color: colors.textSecondary }]}>
              {t('today.linkProduct')}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(21, 21, 21, 0.06)',
  },
  checkboxWrapper: {
    marginRight: Spacing.sm + 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.text,
  },
  checkboxUnchecked: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.textSecondary,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...Typography.bodyBold,
    fontSize: 15,
    color: Colors.text,
    lineHeight: 20,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
    opacity: 0.75,
  },
  productSubtitle: {
    ...Typography.caption,
    fontSize: 12,
    marginTop: 1,
    color: Colors.textSecondary,
  },
  productSubtitleCompleted: {
    opacity: 0.65,
  },
  linkProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 2,
    marginTop: 2,
    opacity: 0.8,
  },
  linkProductText: {
    ...Typography.caption,
    fontSize: 12,
  },
  archivedText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.alert,
    fontStyle: 'italic',
    marginTop: 1,
  },
});
