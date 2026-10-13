import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { useTheme } from '../../src/context/ThemeContext';
import { useTranslation } from '../../src/hooks/useTranslation';

const ICONS = {
  index: ['sparkles-outline', 'sparkles'],
  shelf: ['grid-outline', 'grid'],
  history: ['calendar-outline', 'calendar'],
  profile: ['person-outline', 'person'],
} as const;

type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

function GlowTabBar({ state, descriptors, navigation }: TabBarProps) {
  const { isDark, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);
  const position = useSharedValue(state.index);
  const previousIndex = useRef(state.index);
  const activeColor = isDark ? '#B8CB8C' : colors.sageGreen;
  const tabWidth = (barWidth - 12) / state.routes.length;

  useEffect(() => {
    const isEdgeToEdge = Math.abs(state.index - previousIndex.current) === state.routes.length - 1;
    position.value = withSpring(state.index, { damping: isEdgeToEdge ? 31 : 22, stiffness: 230 });
    previousIndex.current = state.index;
  }, [position, state.index, state.routes.length]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value * tabWidth + 4 }],
  }));

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, 12) + 4 }]}>
      <View
        onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
        style={[styles.bar, { backgroundColor: isDark ? colors.cardCream : Colors.darkCard, borderColor: isDark ? colors.border : 'transparent' }]}
      >
        {barWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[styles.indicator, { width: tabWidth - 8, backgroundColor: activeColor }, indicatorStyle]}
          />
        )}
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const options = descriptors[route.key].options;
          const icons = ICONS[route.name as keyof typeof ICONS];
          const label = options.title ?? route.name;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              style={styles.item}
            >
              <Ionicons
                name={icons[focused ? 1 : 0]}
                size={20}
                color={focused ? Colors.darkCard : (isDark ? '#A1A1A6' : '#B9B9BC')}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <GlowTabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: t('tabs.today') }} />
      <Tabs.Screen name="shelf" options={{ title: t('tabs.shelf') }} />
      <Tabs.Screen name="history" options={{ title: t('tabs.history') }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile') }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 22,
    right: 22,
  },
  bar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  item: {
    flex: 1,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  indicator: {
    position: 'absolute',
    top: 5,
    left: 6,
    height: 42,
    borderRadius: 15,
  },
});
