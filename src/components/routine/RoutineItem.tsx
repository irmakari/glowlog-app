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

export interface RoutineItemProps {
  id: string;
  title: string;
  productName?: string;
  isProductArchived?: boolean;
  completed: boolean;
  onToggle: (id: string) => void;
  isLast?: boolean;
}

export const RoutineItem: React.FC<RoutineItemProps> = ({
  id,
  title,
  productName,
  isProductArchived = false,
  completed,
  onToggle,
  isLast = false,
}) => {
  const { colors, isDark } = useTheme();
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
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : Colors.white,
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : Colors.textSecondary,
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
          <Text style={styles.archivedText}>Product archived</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(21, 21, 21, 0.06)',
  },
  checkboxWrapper: {
    marginRight: Spacing.sm + 2,
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
    fontSize: 14,
    color: Colors.text,
    lineHeight: 18,
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
  archivedText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.alert,
    fontStyle: 'italic',
    marginTop: 1,
  },
});
