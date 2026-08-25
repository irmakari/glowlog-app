import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { GlowCard } from '../ui/GlowCard';
import { PillButton } from '../ui/PillButton';
import { RoutineItem } from './RoutineItem';
import { Colors, ColorVariant } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { TodayRoutineStepState, RoutineType } from '../../features/routines/types/routine.types';

interface RoutineCardProps {
  type: RoutineType;
  steps: TodayRoutineStepState[];
  onToggleStep: (id: string) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  type,
  steps,
  onToggleStep,
}) => {
  const router = useRouter();
  const isMorning = type === 'morning';
  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length;
  const progressRatio = totalCount > 0 ? completedCount / totalCount : 0;

  const cardVariant: ColorVariant = isMorning ? 'pink' : 'softLilac';
  const iconName = isMorning ? 'sunny' : 'moon';
  const title = isMorning ? 'Morning Routine' : 'Evening Routine';

  const handleEditRoutine = () => {
    router.push(`/routine/edit?type=${type}`);
  };

  return (
    <GlowCard variant={cardVariant} padding={16} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <Ionicons name={iconName} size={16} color={Colors.text} />
          </View>
          <View>
            <Text style={Typography.h3}>{title}</Text>
            <Text style={styles.progressSubtext}>
              {totalCount === 0
                ? 'No steps added'
                : `${completedCount} of ${totalCount} completed`}
            </Text>
          </View>
        </View>

        <View style={styles.rightHeaderRow}>
          {totalCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {Math.round(progressRatio * 100)}%
              </Text>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleEditRoutine}
            style={styles.editButton}
          >
            <Ionicons name="pencil" size={14} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressRatio * 100}%` },
            ]}
          />
        </View>
      )}

      {/* Step Rows or Empty State */}
      {totalCount === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {isMorning
              ? 'Your morning ritual is waiting ✨'
              : 'Create a calm little night routine.'}
          </Text>
          <PillButton
            title="Build routine"
            onPress={handleEditRoutine}
            variant="primary"
            size="sm"
          />
        </View>
      ) : (
        <View style={styles.listContainer}>
          {steps.map((step, index) => {
            const productName = step.product
              ? `${step.product.brand ? step.product.brand + ' ' : ''}${step.product.name}`
              : undefined;

            return (
              <RoutineItem
                key={step.id}
                id={step.id}
                title={step.title}
                productName={productName}
                isProductArchived={step.isProductArchived}
                completed={step.completed}
                onToggle={onToggleStep}
                isLast={index === steps.length - 1}
              />
            );
          })}
        </View>
      )}
    </GlowCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm + 2,
  },
  progressSubtext: {
    ...Typography.caption,
    fontSize: 12,
    marginTop: 1,
    color: Colors.textSecondary,
  },
  rightHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.radiusPill,
  },
  badgeText: {
    ...Typography.badge,
    fontSize: 11,
    color: Colors.text,
  },
  editButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.text,
    borderRadius: 2,
  },
  listContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  emptyContainer: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
});
