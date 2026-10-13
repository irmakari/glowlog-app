import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, StyleProp, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  backgroundColor?: string;
  // 'ghost' drops the circle background and shadow, leaving only the icon.
  variant?: 'filled' | 'ghost';
  style?: StyleProp<ViewStyle>;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 40,
  backgroundColor,
  variant = 'filled',
  style,
}) => {
  const { colors } = useTheme();
  const isGhost = variant === 'ghost';
  const bg = isGhost ? 'transparent' : backgroundColor || colors.white;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.button,
        !isGhost && styles.shadow,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
        },
        style,
      ]}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});
