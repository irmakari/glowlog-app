import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Easing, Keyboard, KeyboardEvent, Platform, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { PillButton } from '../../../../components/ui/PillButton';
import { RoutineStepEditorItem } from '../RoutineStepEditorItem';
import { RoutineStepForm } from '../RoutineStepForm';
import { useRoutineEditor } from '../../hooks/useRoutineEditor';
import { RoutineType, RoutineStepWithProduct } from '../../types/routine.types';
import { RoutineEditorProps } from './RoutineEditor.types';
import { styles } from './RoutineEditor.styles';
import { Colors } from '../../../../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../context/ThemeContext';

export const RoutineEditor: React.FC<RoutineEditorProps> = ({
  initialType = 'morning',
}) => {
  const [activeType, setActiveType] = useState<RoutineType>(initialType);
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [keyboardOffset] = useState(() => new Animated.Value(0));
  const sheetMaxHeight = keyboardOffset.interpolate({
    inputRange: [0, height],
    outputRange: [height * 0.85, 0],
    extrapolate: 'clamp',
  });
  const { steps, addStep, updateStep, deleteStep, moveStepUp, moveStepDown } =
    useRoutineEditor(activeType);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingStep, setEditingStep] = useState<RoutineStepWithProduct | undefined>(
    undefined
  );

  useEffect(() => {
    if (!modalVisible) {
      keyboardOffset.setValue(0);
      return;
    }

    const moveSheet = (event: KeyboardEvent) => {
      const keyboardHeight = event.endCoordinates.screenY >= height
        ? 0
        : event.endCoordinates.height;
      Animated.timing(keyboardOffset, {
        toValue: keyboardHeight,
        duration: event.duration ?? 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    };

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillChangeFrame' : 'keyboardDidShow';
    const showSubscription = Keyboard.addListener(showEvent, moveSheet);
    const hideSubscription = Platform.OS === 'ios'
      ? undefined
      : Keyboard.addListener('keyboardDidHide', () => {
          Animated.timing(keyboardOffset, { toValue: 0, duration: 200, useNativeDriver: false }).start();
        });

    return () => {
      showSubscription.remove();
      hideSubscription?.remove();
    };
  }, [height, keyboardOffset, modalVisible]);

  const handleSwitchType = (type: RoutineType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveType(type);
  };

  const handleOpenAddModal = () => {
    setEditingStep(undefined);
    setModalVisible(true);
  };

  const handleOpenEditModal = (step: RoutineStepWithProduct) => {
    setEditingStep(step);
    setModalVisible(true);
  };

  const handleFormSubmit = async (title: string, productId?: string) => {
    if (editingStep) {
      await updateStep(editingStep.id, { title, productId });
    } else {
      await addStep(title, productId);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Segmented Control */}
      <View style={styles.segmentRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleSwitchType('morning')}
          style={[
            styles.segmentTab,
            activeType === 'morning' && styles.segmentTabActive,
          ]}
        >
          <Ionicons
            name="sunny"
            size={16}
            color={activeType === 'morning' ? Colors.white : Colors.text}
          />
          <Text
            style={[
              styles.segmentText,
              activeType === 'morning' && styles.segmentTextActive,
            ]}
          >
            Morning
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleSwitchType('evening')}
          style={[
            styles.segmentTab,
            activeType === 'evening' && styles.segmentTabActive,
          ]}
        >
          <Ionicons
            name="moon"
            size={16}
            color={activeType === 'evening' ? Colors.white : Colors.text}
          />
          <Text
            style={[
              styles.segmentText,
              activeType === 'evening' && styles.segmentTextActive,
            ]}
          >
            Evening
          </Text>
        </TouchableOpacity>
      </View>

      {/* Routine Title */}
      <View style={styles.headerRow}>
        <Text style={styles.titleText}>
          {activeType === 'morning' ? 'Morning Routine ✨' : 'Evening Routine 🌙'}
        </Text>
      </View>

      {/* Steps List */}
      {steps.length === 0 ? (
        <GlowCard variant="cream" padding={16} style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {activeType === 'morning'
              ? 'Your morning ritual is waiting ✨'
              : 'Create a calm little night routine.'}
          </Text>
          <PillButton
            title="+ Add first step"
            onPress={handleOpenAddModal}
            variant="primary"
            size="sm"
          />
        </GlowCard>
      ) : (
        <View>
          {steps.map((step, index) => (
            <RoutineStepEditorItem
              key={step.id}
              step={step}
              index={index}
              totalSteps={steps.length}
              onEdit={handleOpenEditModal}
              onDelete={deleteStep}
              onMoveUp={moveStepUp}
              onMoveDown={moveStepDown}
            />
          ))}

          <PillButton
            title="+ Add routine step"
            onPress={handleOpenAddModal}
            variant="secondary"
            pastelColor={activeType === 'morning' ? 'pink' : 'softLilac'}
            size="md"
            style={styles.addStepButton}
          />
        </View>
      )}

      {/* Add / Edit Step Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        presentationStyle="overFullScreen"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)} />
          <Animated.ScrollView
            bounces={false}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            style={[styles.modalSheet, { backgroundColor: colors.background, bottom: keyboardOffset, maxHeight: sheetMaxHeight }]}
            contentContainerStyle={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingStep ? 'Edit Routine Step' : 'Add Routine Step'}
            </Text>
            <RoutineStepForm
              initialValues={editingStep}
              onSubmit={handleFormSubmit}
              onCancel={() => setModalVisible(false)}
            />
          </Animated.ScrollView>
        </View>
      </Modal>
    </View>
  );
};
