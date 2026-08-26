import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { PillButton } from '../../../../components/ui/PillButton';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { ProductUsageList } from '../../components/ProductUsageList';
import { useDailySummary } from '../../hooks/useDailySummary';
import { getLocalDateString } from '../../../routines/utils/routineDate.utils';
import { DailySummaryScreenProps } from './DailySummaryScreen.types';
import { styles } from './DailySummaryScreen.styles';
import { Colors } from '../../../../constants/colors';

export const DailySummaryScreen: React.FC<DailySummaryScreenProps> = ({ date }) => {
  const router = useRouter();
  const { summary, loading, toggleStep, incrementWater, decrementWater } = useDailySummary(date);

  const todayKey = useMemo(() => getLocalDateString(), []);
  const isToday = date === todayKey;

  // For today, editing is active by default. For past days, editing is toggled via "Edit Day" button.
  const [isEditing, setIsEditing] = useState<boolean>(isToday);

  if (loading && !summary) {
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
    <Screen scrollable padding={14}>
      {/* Top Drag Handle / Grabber Bar */}
      <View style={styles.grabberContainer}>
        <View style={styles.grabberBar} />
      </View>

      {/* Header */}
      <View style={styles.headerNav}>
        <View style={localStyles.headerTextWrapper}>
          <Text style={styles.title}>{summary.formattedDate}</Text>
          {isToday && (
            <View style={localStyles.todayBadge}>
              <Text style={localStyles.todayBadgeText}>Today</Text>
            </View>
          )}
        </View>

        <View style={localStyles.headerActions}>
          {!isToday && (
            <PillButton
              title={isEditing ? 'Done' : 'Edit Day'}
              onPress={() => setIsEditing((prev) => !prev)}
              variant={isEditing ? 'primary' : 'outline'}
              size="sm"
              style={{ marginRight: 6 }}
            />
          )}
          <IconButton
            icon={<Ionicons name="close" size={18} color={Colors.text} />}
            onPress={() => router.back()}
            backgroundColor={Colors.white}
            size={32}
          />
        </View>
      </View>

      {/* Past Day Edit Notice */}
      {!isToday && isEditing && (
        <GlowCard variant="butterYellow" padding={10} style={localStyles.noticeCard}>
          <View style={localStyles.rowCenter}>
            <Ionicons name="create-outline" size={16} color={Colors.text} style={{ marginRight: 6 }} />
            <Text style={localStyles.noticeText}>
              Editing log for {summary.formattedDate}. Tap steps to check/uncheck.
            </Text>
          </View>
        </GlowCard>
      )}

      {/* Morning Routine Card */}
      <GlowCard variant="pink" padding={12} style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.rowIcon}>
            <Text style={styles.sectionTitle}>Morning Routine</Text>
            <Ionicons name="sunny" size={16} color="#E59935" style={{ marginLeft: 6 }} />
          </View>
          <Text style={styles.countBadge}>
            {morningCompleted} of {summary.morningSteps.length} completed
          </Text>
        </View>

        {summary.morningSteps.length === 0 ? (
          <Text style={styles.emptySubtext}>No morning steps configured for this day.</Text>
        ) : (
          summary.morningSteps.map((step, index) => (
            <TouchableOpacity
              key={step.id}
              activeOpacity={isEditing ? 0.7 : 1}
              disabled={!isEditing}
              onPress={() => isEditing && toggleStep(step.id, step.productId)}
              style={[
                styles.stepRow,
                index === summary.morningSteps.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Ionicons
                name={step.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={step.completed ? Colors.text : Colors.textMuted}
                style={styles.stepIcon}
              />
              <View style={styles.stepTextCol}>
                <Text style={[styles.stepTitle, step.completed && styles.completedText]}>
                  {step.title}
                </Text>
                {step.productName ? (
                  <Text style={styles.productSubtext}>{step.productName}</Text>
                ) : null}
              </View>
              {isEditing && (
                <Ionicons
                  name={step.completed ? 'checkbox' : 'square-outline'}
                  size={16}
                  color={Colors.textSecondary}
                />
              )}
            </TouchableOpacity>
          ))
        )}
      </GlowCard>

      {/* Evening Routine Card */}
      <GlowCard variant="softLilac" padding={12} style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.rowIcon}>
            <Text style={styles.sectionTitle}>Evening Routine</Text>
            <Ionicons name="moon" size={16} color="#7C5CBF" style={{ marginLeft: 6 }} />
          </View>
          <Text style={styles.countBadge}>
            {eveningCompleted} of {summary.eveningSteps.length} completed
          </Text>
        </View>

        {summary.eveningSteps.length === 0 ? (
          <Text style={styles.emptySubtext}>No evening steps configured for this day.</Text>
        ) : (
          summary.eveningSteps.map((step, index) => (
            <TouchableOpacity
              key={step.id}
              activeOpacity={isEditing ? 0.7 : 1}
              disabled={!isEditing}
              onPress={() => isEditing && toggleStep(step.id, step.productId)}
              style={[
                styles.stepRow,
                index === summary.eveningSteps.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Ionicons
                name={step.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={step.completed ? Colors.text : Colors.textMuted}
                style={styles.stepIcon}
              />
              <View style={styles.stepTextCol}>
                <Text style={[styles.stepTitle, step.completed && styles.completedText]}>
                  {step.title}
                </Text>
                {step.productName ? (
                  <Text style={styles.productSubtext}>{step.productName}</Text>
                ) : null}
              </View>
              {isEditing && (
                <Ionicons
                  name={step.completed ? 'checkbox' : 'square-outline'}
                  size={16}
                  color={Colors.textSecondary}
                />
              )}
            </TouchableOpacity>
          ))
        )}
      </GlowCard>

      {/* Hydration Card */}
      <GlowCard variant="softBlue" padding={12} style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.rowIcon}>
            <Text style={styles.sectionTitle}>Hydration</Text>
            <Ionicons name="water" size={16} color="#5294E2" style={{ marginLeft: 6 }} />
          </View>

          {isEditing ? (
            <View style={localStyles.waterControls}>
              <IconButton
                icon={<Ionicons name="remove" size={14} color={Colors.text} />}
                onPress={decrementWater}
                backgroundColor={Colors.white}
                size={28}
              />
              <Text style={styles.countBadge}>
                {summary.hydration} / {summary.hydrationGoal}
              </Text>
              <IconButton
                icon={<Ionicons name="add" size={14} color={Colors.text} />}
                onPress={incrementWater}
                backgroundColor={Colors.white}
                size={28}
              />
            </View>
          ) : (
            <Text style={styles.countBadge}>
              {summary.hydration} of {summary.hydrationGoal} glasses
            </Text>
          )}
        </View>
      </GlowCard>

      {/* Products Used Card */}
      <ProductUsageList products={summary.productsUsed} />
    </Screen>
  );
};

const localStyles = {
  headerTextWrapper: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
    gap: 8,
  },
  todayBadge: {
    backgroundColor: Colors.sageGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  todayBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerActions: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  noticeCard: {
    marginBottom: 8,
  },
  rowCenter: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  noticeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
    flex: 1,
  },
  waterControls: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
};
