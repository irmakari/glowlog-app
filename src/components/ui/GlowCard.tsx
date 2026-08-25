import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, ColorVariant, CARD_COLORS } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

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
  const bg = customColor || CARD_COLORS[variant] || Colors.cardCream;

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
    borderWidth: bordered ? 1.5 : 0,
    borderColor: bordered ? Colors.borderDark : 'transparent',
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
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
});
