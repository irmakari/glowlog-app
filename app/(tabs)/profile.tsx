import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { PillButton } from '../../src/components/ui/PillButton';
import { Typography } from '../../src/constants/typography';
import { Spacing } from '../../src/constants/spacing';
import { Colors } from '../../src/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Text style={Typography.h1}>Profile & Goals ✨</Text>
        <Text style={Typography.subtitle}>Your skincare preferences & settings</Text>
      </View>

      <GlowCard variant="cream" padding={Spacing.lg} style={styles.card}>
        <Text style={Typography.h3}>Daily Hydration Goal</Text>
        <Text style={styles.cardSubtext}>Default goal: 8 glasses daily</Text>
      </GlowCard>

      <GlowCard variant="softLilac" padding={Spacing.lg} style={styles.card}>
        <Text style={Typography.h3}>GlowLog</Text>
        <Text style={styles.cardSubtext}>Your skincare, remembered.</Text>
      </GlowCard>

      {__DEV__ && (
        <GlowCard variant="butterYellow" padding={Spacing.lg} style={styles.card}>
          <Text style={Typography.h3}>Developer Playground 🛠️</Text>
          <Text style={styles.cardSubtext}>Visually inspect all GlowLog components & states.</Text>
          <PillButton
            title="Open Component Gallery"
            onPress={() => router.push('/dev/components' as any)}
            variant="primary"
            size="md"
            style={{ marginTop: Spacing.md }}
          />
        </GlowCard>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  card: {
    marginVertical: Spacing.xs,
  },
  cardSubtext: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
