import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, ColorVariant, CARD_COLORS, DARK_CARD_COLORS } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { useTheme } from '../../context/ThemeContext';

interface GlowCardProps {
  children: React.ReactNode;
  variant?: ColorVariant;
  customColor?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padding?: number;
  borderRadius?: number;
  bordered?: boolean;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  variant = 'cream',
  customColor,
  style,
  onPress,
  padding = Spacing.lg,
  borderRadius = Spacing.radiusLg,
  bordered = false,
}) => {
  const { isDark, colors } = useTheme();
  const palette = isDark ? DARK_CARD_COLORS : CARD_COLORS;
  const bg = customColor || palette[variant] || (isDark ? colors.cardCream : Colors.cardCream);

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: bg,
    padding,
    borderRadius,
    borderWidth: bordered ? 1.5 : (isDark ? 1 : 0),
    borderColor: bordered ? (isDark ? colors.borderDark : Colors.borderDark) : (isDark ? colors.border : 'transparent'),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handlePress}
        style={[styles.card, cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, cardStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    marginVertical: Spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
