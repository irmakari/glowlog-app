import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CategoryFilterChipsProps } from './CategoryFilterChips.types';
import { styles } from './CategoryFilterChips.styles';
import { useTheme } from '../../../../context/ThemeContext';
import { Colors } from '../../../../constants/colors';

export const CategoryFilterChips: React.FC<CategoryFilterChipsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { colors, isDark } = useTheme();

  const handlePress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectCategory(id);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;

        return (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.8}
            onPress={() => handlePress(cat.id)}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? colors.text : colors.white,
                borderColor: isActive ? colors.text : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isActive
                    ? (isDark ? colors.background : Colors.white)
                    : colors.text,
                },
              ]}
            >
              {cat.label}
            </Text>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: isActive
                    ? (isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)')
                    : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(21, 21, 21, 0.06)'),
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: isActive
                      ? (isDark ? colors.background : Colors.white)
                      : colors.textSecondary,
                  },
                ]}
              >
                {cat.count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
