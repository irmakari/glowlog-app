import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { initDatabase } from '../src/services/database/db';
import { Colors } from '../src/constants/colors';

// Prevent splash screen auto hide until database and fonts ready
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase();
      } catch (e) {
        console.warn('Failed to initialize SQLite database:', e);
      } finally {
        setDbReady(true);
      }
    }

    prepare();
  }, []);

  const isAppReady = dbReady && fontsLoaded;

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.text} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/add"
          options={{ presentation: 'modal', title: 'Add Product' }}
        />
        <Stack.Screen
          name="product/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="product/edit/[id]"
          options={{ presentation: 'modal', title: 'Edit Product' }}
        />
        <Stack.Screen
          name="routine/edit"
          options={{ presentation: 'modal', title: 'Edit Routine' }}
        />
        <Stack.Screen
          name="routine/index"
          options={{ presentation: 'modal', title: 'Routines' }}
        />
        <Stack.Screen
          name="day/[date]"
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.65, 0.9],
            sheetGrabberVisible: true,
            sheetCornerRadius: 24,
            title: 'Daily Summary',
          }}
        />
        <Stack.Screen
          name="dev/components"
          options={{ presentation: 'modal', title: 'Component Gallery' }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
