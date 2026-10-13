import React, { useEffect, useRef } from 'react';
import { ActionSheetIOS, Alert, Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { GlowCard } from '../ui/GlowCard';
import { PillButton } from '../ui/PillButton';
import { RoutineItem } from './RoutineItem';
import { Colors, ColorVariant } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { TodayRoutineStepState, RoutineType } from '../../features/routines/types/routine.types';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

interface RoutineCardProps {
  type: RoutineType;
  steps: TodayRoutineStepState[];
  onToggleStep: (id: string) => void;
  onCompleteAll?: () => void;
}

const ACCENTS: Record<RoutineType, { variant: ColorVariant; ink: string }> = {
  morning: { variant: 'pink', ink: '#B4507F' },
  evening: { variant: 'softLilac', ink: '#7C5CBF' },
};

const COMPLETE_GREEN = '#4F7A2E';

const RING_SIZE = 36;
const RING_STROKE = 4;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const ProgressRing: React.FC<{ ratio: number; color: string; trackColor: string }> = ({
  ratio,
  color,
  trackColor,
}) => (
  <Svg width={RING_SIZE} height={RING_SIZE}>
    <Circle
      cx={RING_SIZE / 2}
      cy={RING_SIZE / 2}
      r={RING_RADIUS}
      stroke={trackColor}
      strokeWidth={RING_STROKE}
      fill="none"
    />
    {ratio > 0 && (
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        stroke={color}
        strokeWidth={RING_STROKE}
        strokeLinecap="round"
        strokeDasharray={`${RING_CIRCUMFERENCE * ratio} ${RING_CIRCUMFERENCE}`}
        fill="none"
        transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
      />
    )}
  </Svg>
);

export const RoutineCard: React.FC<RoutineCardProps> = ({
  type,
  steps,
  onToggleStep,
  onCompleteAll,
}) => {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const isMorning = type === 'morning';
  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length;
  const progressRatio = totalCount > 0 ? completedCount / totalCount : 0;

  const accent = ACCENTS[type];
  // Frosted white layers sit on the pastel card instead of a second solid color
  const frost = isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(255, 255, 255, 0.62)';
  const iconName = isMorning ? 'sunny' : 'moon';
  const title = isMorning ? t('today.routineCardMorningTitle') : t('today.routineCardEveningTitle');
  const isComplete = totalCount > 0 && completedCount === totalCount;
  const canCompleteAll = totalCount > 0 && !isComplete && !!onCompleteAll;

  // Celebrate only when the user finishes the routine, not when a finished routine loads
  const ringScale = useSharedValue(1);
  const previous = useRef({ isComplete, totalCount });
  useEffect(() => {
    const prev = previous.current;
    previous.current = { isComplete, totalCount };
    if (isComplete && !prev.isComplete && prev.totalCount === totalCount) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      ringScale.value = withSequence(withSpring(1.18, { damping: 8 }), withSpring(1));
    }
  }, [isComplete, totalCount, ringScale]);

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  const handleEditRoutine = () => {
    router.push(`/routine/edit?type=${type}`);
  };

  const handleLinkProduct = (stepId: string) => {
    router.push(`/routine/edit?type=${type}&stepId=${encodeURIComponent(stepId)}`);
  };

  const handleOpenMenu = () => {
    const actions = [
      ...(canCompleteAll ? [{ label: t('today.markAll'), run: () => onCompleteAll?.() }] : []),
      { label: t('today.editRoutine'), run: handleEditRoutine },
    ];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title,
          options: [...actions.map((a) => a.label), t('common.cancel')],
          cancelButtonIndex: actions.length,
        },
        (index) => actions[index]?.run()
      );
      return;
    }

    Alert.alert(title, undefined, [
      ...actions.map((a) => ({ text: a.label, onPress: a.run })),
      { text: t('common.cancel'), style: 'cancel' as const },
    ]);
  };

  return (
    <GlowCard variant={accent.variant} padding={16} style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: frost }]}>
          <Ionicons name={iconName} size={20} color={isDark ? colors.text : accent.ink} />
        </View>

        <View style={styles.titleCol}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{title}</Text>
          <Text style={[styles.progressSubtext, { color: colors.textSecondary }]} numberOfLines={1}>
            {totalCount === 0
              ? t('today.noSteps')
              : t('history.stepsCompleted', { completed: completedCount, total: totalCount })}
          </Text>
        </View>

        {totalCount > 0 && (
          <Animated.View style={[styles.ringWrapper, ringAnimatedStyle]}>
            <ProgressRing
              ratio={progressRatio}
              color={isComplete ? COMPLETE_GREEN : colors.text}
              trackColor={frost}
            />
            {isComplete && (
              <Ionicons name="checkmark" size={18} color={COMPLETE_GREEN} style={styles.ringCheck} />
            )}
          </Animated.View>
        )}

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={handleOpenMenu}
          accessibilityRole="button"
          accessibilityLabel={`${title}: ${t('today.editRoutine')}`}
          hitSlop={8}
          style={styles.menuButton}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {totalCount === 0 ? (
        <View style={[styles.panel, styles.emptyContainer, { backgroundColor: frost }]}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {isMorning
              ? t('today.morningEmpty')
              : t('today.eveningEmpty')}
          </Text>
          <PillButton
            title={t('today.buildRoutine')}
            onPress={handleEditRoutine}
            variant="primary"
            size="sm"
          />
        </View>
      ) : (
        <View style={[styles.panel, styles.listContainer, { backgroundColor: frost }]}>
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
                onLinkProduct={handleLinkProduct}
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
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...Typography.h3,
    fontSize: 17,
  },
  progressSubtext: {
    ...Typography.caption,
    fontSize: 13,
    marginTop: 1,
    color: Colors.textSecondary,
  },
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCheck: {
    position: 'absolute',
  },
  menuButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -6,
  },
  panel: {
    marginTop: 14,
    borderRadius: 18,
  },
  listContainer: {
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  emptyContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
});
