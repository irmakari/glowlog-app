import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { ProductUsageList } from '../../components/ProductUsageList';
import { useDailySummary } from '../../hooks/useDailySummary';
import { DailySummaryScreenProps } from './DailySummaryScreen.types';
import { styles } from './DailySummaryScreen.styles';
import { Colors } from '../../../../constants/colors';

export const DailySummaryScreen: React.FC<DailySummaryScreenProps> = ({ date }) => {
  const router = useRouter();
  const { summary, loading } = useDailySummary(date);

  if (loading) {
    return (
      <Screen scrollable padding={16}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.text} />
        </View>
      </Screen>
    );
  }

  if (!summary) {
    return (
      <Screen scrollable padding={16}>
        <View style={styles.headerNav}>
          <IconButton
            icon={<Ionicons name="close" size={20} color={Colors.text} />}
            onPress={() => router.back()}
            backgroundColor={Colors.white}
          />
        </View>
        <Text style={styles.title}>Summary not found</Text>
      </Screen>
    );
  }

  const morningCompleted = summary.morningSteps.filter((s) => s.completed).length;
  const eveningCompleted = summary.eveningSteps.filter((s) => s.completed).length;

  return (
    <Screen scrollable padding={16}>
      {/* Header */}
      <View style={styles.headerNav}>
        <Text style={styles.title}>{summary.formattedDate}</Text>
        <IconButton
          icon={<Ionicons name="close" size={20} color={Colors.text} />}
          onPress={() => router.back()}
          backgroundColor={Colors.white}
          size={36}
        />
      </View>

      {/* Morning Routine Card */}
      <GlowCard variant="pink" padding={14} style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Morning Routine ☀️</Text>
          <Text style={styles.countBadge}>
            {morningCompleted} of {summary.morningSteps.length} completed
          </Text>
        </View>

        {summary.morningSteps.length === 0 ? (
          <Text style={styles.emptySubtext}>No morning steps configured for this day.</Text>
        ) : (
          summary.morningSteps.map((step, index) => (
            <View
              key={step.id}
              style={[
                styles.stepRow,
                index === summary.morningSteps.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Ionicons
                name={step.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={18}
                color={step.completed ? Colors.text : Colors.textMuted}
                style={styles.stepIcon}
              />
              <View style={styles.stepTextCol}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                {step.productName ? (
                  <Text style={styles.productSubtext}>{step.productName}</Text>
                ) : null}
              </View>
            </View>
          ))
        )}
      </GlowCard>

      {/* Evening Routine Card */}
      <GlowCard variant="softLilac" padding={14} style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Evening Routine 🌙</Text>
          <Text style={styles.countBadge}>
            {eveningCompleted} of {summary.eveningSteps.length} completed
          </Text>
        </View>

        {summary.eveningSteps.length === 0 ? (
          <Text style={styles.emptySubtext}>No evening steps configured for this day.</Text>
        ) : (
          summary.eveningSteps.map((step, index) => (
            <View
              key={step.id}
              style={[
                styles.stepRow,
                index === summary.eveningSteps.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Ionicons
                name={step.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={18}
                color={step.completed ? Colors.text : Colors.textMuted}
                style={styles.stepIcon}
              />
              <View style={styles.stepTextCol}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                {step.productName ? (
                  <Text style={styles.productSubtext}>{step.productName}</Text>
                ) : null}
              </View>
            </View>
          ))
        )}
      </GlowCard>

      {/* Hydration Card */}
      <GlowCard variant="softBlue" padding={14} style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Hydration 💧</Text>
          <Text style={styles.countBadge}>
            {summary.hydration} of {summary.hydrationGoal} glasses
          </Text>
        </View>
      </GlowCard>

      {/* Products Used Card */}
      <ProductUsageList products={summary.productsUsed} />
    </Screen>
  );
};
