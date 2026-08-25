import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ViewStyle,
  StatusBar,
  StyleProp,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  padding?: number;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  backgroundColor = Colors.background,
  padding = Spacing.lg,
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      {scrollable ? (
        <ScrollView
          style={[styles.container, style]}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: padding },
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.container, { paddingHorizontal: padding }, style]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110, // Ensure bottom content is never covered by floating tab bar
  },
});
