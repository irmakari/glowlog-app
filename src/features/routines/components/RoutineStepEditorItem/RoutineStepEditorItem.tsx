import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { RoutineStepEditorItemProps } from './RoutineStepEditorItem.types';
import { styles } from './RoutineStepEditorItem.styles';
import { Colors } from '../../../../constants/colors';
import { useTranslation } from '../../../../hooks/useTranslation';

export const RoutineStepEditorItem: React.FC<RoutineStepEditorItemProps> = ({
  step,
  index,
  totalSteps,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const { t } = useTranslation();
  const handleDeleteConfirm = () => {
    Alert.alert(
      t('routineEditor.removeStep'),
      t('routineEditor.removeStepDesc'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('routineEditor.remove'),
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onDelete(step.id);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Reorder Arrows */}
      <View style={styles.reorderCol}>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={index === 0}
          onPress={() => onMoveUp(index)}
          style={[styles.arrowButton, index === 0 && styles.arrowButtonDisabled]}
        >
          <Ionicons name="chevron-up" size={16} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          disabled={index === totalSteps - 1}
          onPress={() => onMoveDown(index)}
          style={[
            styles.arrowButton,
            index === totalSteps - 1 && styles.arrowButtonDisabled,
          ]}
        >
          <Ionicons name="chevron-down" size={16} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Step Info */}
      <View style={styles.textCol}>
        <Text style={styles.titleText}>
          {index + 1}. {step.title}
        </Text>
        {step.product ? (
          <Text style={styles.productSubtext}>
            {step.product.brand ? `${step.product.brand} • ` : ''}
            {step.product.name}
          </Text>
        ) : step.isProductArchived ? (
          <Text style={styles.archivedText}>{t('today.productArchived')}</Text>
        ) : null}
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onEdit(step)}
          style={styles.actionIcon}
        >
          <Ionicons name="pencil-outline" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleDeleteConfirm}
          style={styles.actionIcon}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.alert} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
