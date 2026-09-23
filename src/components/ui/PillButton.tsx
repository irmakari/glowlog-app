import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
  StyleProp,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, ColorVariant, CARD_COLORS, DARK_CARD_COLORS } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useTheme } from '../../context/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface PillButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  pastelColor?: ColorVariant;
  customColor?: string;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  hapticStyle?: Haptics.ImpactFeedbackStyle;
}

export const PillButton: React.FC<PillButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  pastelColor = 'pink',
  customColor,
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  hapticStyle = Haptics.ImpactFeedbackStyle.Medium,
}) => {
  const { isDark, colors } = useTheme();

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(hapticStyle);
    onPress();
  };

  const getContainerStyle = (): ViewStyle => {
    let bg = colors.text;
    let border = 'transparent';
    let borderWidth = 0;

    const palette = isDark ? DARK_CARD_COLORS : CARD_COLORS;

    if (variant === 'secondary') {
      bg = customColor || palette[pastelColor] || (isDark ? colors.pink : Colors.pink);
    } else if (variant === 'outline') {
      bg = 'transparent';
      border = colors.text;
      borderWidth = 1.5;
    } else if (variant === 'ghost') {
      bg = 'transparent';
    }

    let verticalPadding = Spacing.md;
    let horizontalPadding = Spacing.xl;

    if (size === 'sm') {
      verticalPadding = Spacing.sm;
      horizontalPadding = Spacing.md;
    } else if (size === 'lg') {
      verticalPadding = Spacing.lg;
      horizontalPadding = Spacing.xxl;
    }

    return {
      backgroundColor: bg,
      paddingVertical: verticalPadding,
      paddingHorizontal: horizontalPadding,
      borderRadius: Spacing.radiusPill,
      borderColor: border,
      borderWidth: borderWidth,
      opacity: disabled ? 0.5 : 1,
    };
  };

  const getTextColor = (): string => {
    if (variant === 'primary') return isDark ? colors.background : Colors.white;
    return colors.text;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[styles.button, getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              Typography.button,
              { color: getTextColor() },
              size === 'sm' && { fontSize: 13 },
              size === 'lg' && { fontSize: 17 },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
});
