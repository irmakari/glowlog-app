import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { IconButton } from '../../../../components/ui/IconButton';
import { PillButton } from '../../../../components/ui/PillButton';
import { ProductUsageList } from '../ProductUsageList';
import { useDailySummary } from '../../hooks/useDailySummary';
import { getLocalDateString } from '../../../routines/utils/routineDate.utils';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

interface SelectedDayCardProps {
  dateKey: string;
}

export const SelectedDayCard: React.FC<SelectedDayCardProps> = ({ dateKey }) => {
  const { summary, loading, toggleStep, incrementWater, decrementWater } = useDailySummary(dateKey);

  const todayKey = useMemo(() => getLocalDateString(), []);
  const isToday = dateKey === todayKey;

  const [isEditing, setIsEditing] = useState<boolean>(isToday);

  // When dateKey changes, set default isEditing mode (true for today, false for past)
  React.useEffect(() => {
    setIsEditing(isToday);
  }, [dateKey, isToday]);

  if (loading && !summary) {
    return (
      <GlowCard variant="cream" padding={20} style={styles.card}>
        <ActivityIndicator size="small" color={Colors.text} />
      </GlowCard>
    );
  }

  if (!summary) {
    return null;
  }

  const morningCompleted = summary.morningSteps.filter((s) => s.completed).length;
  const eveningCompleted = summary.eveningSteps.filter((s) => s.completed).length;

  return (
    <View style={styles.container}>
      {/* Date Title Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrapper}>
          <Text style={styles.dateTitle}>{summary.formattedDate}</Text>
          {isToday && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>Today</Text>
            </View>
          )}
        </View>

        {!isToday && (
          <PillButton
            title={isEditing ? 'Done' : 'Edit Day'}
            onPress={() => setIsEditing((prev) => !prev)}
            variant={isEditing ? 'primary' : 'outline'}
            size="sm"
          />
        )}
      </View>

      {/* Editing Notice Banner for Past Days */}
      {!isToday && isEditing && (
        <GlowCard variant="butterYellow" padding={10} style={styles.noticeCard}>
          <View style={styles.rowCenter}>
            <Ionicons name="create-outline" size={16} color={Colors.text} style={{ marginRight: 6 }} />
            <Text style={styles.noticeText}>
              Editing past log for {summary.formattedDate}. Tap steps to check/uncheck.
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
          <Text style={styles.emptySubtext}>No morning steps configured.</Text>
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
          <Text style={styles.emptySubtext}>No evening steps configured.</Text>
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
            <View style={styles.waterControls}>
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

      {/* Products Used */}
      {summary.productsUsed && summary.productsUsed.length > 0 && (
        <ProductUsageList products={summary.productsUsed} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTitle: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.text,
  },
  todayBadge: {
    backgroundColor: Colors.sageGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  todayBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.text,
  },
  noticeCard: {
    marginBottom: 8,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noticeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  card: {
    marginVertical: 6,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  rowIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    ...Typography.h3,
    fontSize: 15,
  },
  countBadge: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(21, 21, 21, 0.06)',
  },
  stepIcon: {
    marginRight: Spacing.sm,
  },
  stepTextCol: {
    flex: 1,
  },
  stepTitle: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: Colors.text,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  productSubtext: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  emptySubtext: {
    ...Typography.body,
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  waterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
