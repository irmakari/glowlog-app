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
import { useTheme } from '../../context/ThemeContext';

interface RoutineCardProps {
  type: RoutineType;
  steps: TodayRoutineStepState[];
  onToggleStep: (id: string) => void;
  onCompleteAll?: () => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  type,
  steps,
  onToggleStep,
  onCompleteAll,
}) => {
  const router = useRouter();
  const { colors, isDark } = useTheme();
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

  const buttonBg = isDark ? 'rgba(255, 255, 255, 0.12)' : Colors.white;

  return (
    <GlowCard variant={cardVariant} padding={16} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconCircle, { backgroundColor: buttonBg }]}>
            <Ionicons name={iconName} size={16} color={colors.text} />
          </View>
          <View>
            <Text style={[Typography.h3, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.progressSubtext, { color: colors.textSecondary }]}>
              {totalCount === 0
                ? 'No steps added'
                : `${completedCount} of ${totalCount} completed`}
            </Text>
          </View>
        </View>

        <View style={styles.rightHeaderRow}>
          {totalCount > 0 && completedCount < totalCount && onCompleteAll && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onCompleteAll}
              style={[styles.completeAllBtn, { backgroundColor: buttonBg }]}
            >
              <Ionicons name="checkmark-done" size={12} color={colors.text} style={{ marginRight: 3 }} />
              <Text style={[styles.completeAllText, { color: colors.text }]}>Mark all</Text>
            </TouchableOpacity>
          )}

          {totalCount > 0 && (
            <View style={[styles.badge, { backgroundColor: buttonBg }]}>
              <Text style={[styles.badgeText, { color: colors.text }]}>
                {Math.round(progressRatio * 100)}%
              </Text>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleEditRoutine}
            style={[styles.editButton, { backgroundColor: buttonBg }]}
          >
            <Ionicons name="pencil" size={14} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <View
          style={[
            styles.progressBarBackground,
            { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.65)' },
          ]}
        >
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressRatio * 100}%`, backgroundColor: colors.text },
            ]}
          />
        </View>
      )}

      {/* Step Rows or Empty State */}
      {totalCount === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
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
        <View
          style={[
            styles.listContainer,
            {
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.55)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              borderWidth: isDark ? 1 : 0,
            },
          ]}
        >
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
  completeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Spacing.radiusPill,
  },
  completeAllText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
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
