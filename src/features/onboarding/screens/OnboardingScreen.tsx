import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../components/ui/Screen';
import { GlowCard } from '../../../components/ui/GlowCard';
import { PillButton } from '../../../components/ui/PillButton';
import { IconButton } from '../../../components/ui/IconButton';
import { Typography } from '../../../constants/typography';
import { Spacing } from '../../../constants/spacing';
import { Colors } from '../../../constants/colors';
import { settingsService, SkinType } from '../../../services/settingsService';

const SKIN_TYPES: { id: SkinType; label: string; icon: string; desc: string }[] = [
  { id: 'Combination', label: 'Combination', icon: 'partly-sunny-outline', desc: 'Oily T-zone, normal cheeks' },
  { id: 'Dry', label: 'Dry', icon: 'water-outline', desc: 'Tight, flaky, needs hydration' },
  { id: 'Oily', label: 'Oily', icon: 'sparkles-outline', desc: 'Excess shine, enlarged pores' },
  { id: 'Sensitive', label: 'Sensitive', icon: 'leaf-outline', desc: 'Redness, easily irritated' },
  { id: 'Normal', label: 'Normal', icon: 'sunny-outline', desc: 'Balanced, comfortable feel' },
];

export const OnboardingScreen: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [skinType, setSkinType] = useState<SkinType>('Combination');
  const [hydrationGoal, setHydrationGoal] = useState<number>(8);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleNextStep = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      handleCompleteOnboarding();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      setSubmitting(true);
      await settingsService.updateSettings({
        userName: name.trim(),
        skinType,
        hydrationGoal,
        onboardingCompleted: true,
      });
      router.replace('/(tabs)');
    } catch (e) {
      console.error('Failed to save onboarding settings:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen scrollable padding={20}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex1}
      >
        {/* Progress Bar & Header */}
        <View style={styles.topBar}>
          {step > 1 ? (
            <IconButton
              icon={<Ionicons name="arrow-back" size={20} color={Colors.text} />}
              onPress={handlePrevStep}
              backgroundColor={Colors.white}
              size={38}
            />
          ) : (
            <View style={{ width: 38 }} />
          )}
          <View style={styles.stepDotsRow}>
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[
                  styles.stepDot,
                  s === step && styles.stepDotActive,
                  s < step && styles.stepDotCompleted,
                ]}
              />
            ))}
          </View>
          <View style={{ width: 38 }} />
        </View>

        {/* Step 1: Name */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.badgeLabel}>Welcome to GlowLog ✨</Text>
            <Text style={styles.heroTitle}>What should we call you?</Text>
            <Text style={styles.heroSubtitle}>
              Let's personalize your daily skincare routine and morning greetings.
            </Text>

            <GlowCard variant="cream" padding={20} style={styles.inputCard}>
              <Text style={styles.fieldLabel}>Your Name or Nickname</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. İrmak"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
                autoFocus
                returnKeyType="next"
                onSubmitEditing={handleNextStep}
              />
            </GlowCard>
          </View>
        )}

        {/* Step 2: Skin Type */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.badgeLabel}>Step 2 of 3 🧴</Text>
            <Text style={styles.heroTitle}>What is your skin type?</Text>
            <Text style={styles.heroSubtitle}>
              Select the option that best describes how your skin feels most days.
            </Text>

            <View style={styles.skinTypeList}>
              {SKIN_TYPES.map((st) => {
                const isSelected = skinType === st.id;
                return (
                  <TouchableOpacity
                    key={st.id}
                    activeOpacity={0.8}
                    onPress={() => setSkinType(st.id)}
                    style={[
                      styles.skinTypeCard,
                      isSelected && styles.skinTypeCardSelected,
                    ]}
                  >
                    <View style={styles.rowCenter}>
                      <View
                        style={[
                          styles.skinIconBox,
                          isSelected && styles.skinIconBoxSelected,
                        ]}
                      >
                        <Ionicons
                          name={st.icon as any}
                          size={20}
                          color={isSelected ? Colors.white : Colors.text}
                        />
                      </View>
                      <View style={styles.flex1}>
                        <Text style={styles.skinTypeTitle}>{st.label}</Text>
                        <Text style={styles.skinTypeDesc}>{st.desc}</Text>
                      </View>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={22} color={Colors.text} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 3: Water Goal */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.badgeLabel}>Step 3 of 3 💧</Text>
            <Text style={styles.heroTitle}>Daily Hydration Goal</Text>
            <Text style={styles.heroSubtitle}>
              Hydrated skin starts from within! How many glasses of water is your daily target?
            </Text>

            <GlowCard variant="softBlue" padding={24} style={styles.waterCard}>
              <Ionicons name="water" size={48} color="#5294E2" style={{ marginBottom: 12 }} />
              <Text style={styles.waterGoalCount}>{hydrationGoal} Glasses</Text>
              <Text style={styles.waterGoalSubtext}>~ {(hydrationGoal * 0.25).toFixed(1)} Liters daily</Text>

              <View style={styles.stepperRow}>
                <IconButton
                  icon={<Ionicons name="remove" size={22} color={Colors.text} />}
                  onPress={() => setHydrationGoal((g) => Math.max(4, g - 1))}
                  backgroundColor={Colors.white}
                  size={46}
                />
                <View style={{ width: 30 }} />
                <IconButton
                  icon={<Ionicons name="add" size={22} color={Colors.text} />}
                  onPress={() => setHydrationGoal((g) => Math.min(20, g + 1))}
                  backgroundColor={Colors.white}
                  size={46}
                />
              </View>
            </GlowCard>
          </View>
        )}

        {/* Bottom Action Bar */}
        <View style={styles.bottomBar}>
          <PillButton
            title={step === 3 ? 'Start Glowing ✨' : 'Continue ➔'}
            onPress={handleNextStep}
            variant="primary"
            size="lg"
            loading={submitting}
            style={styles.fullWidth}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  stepDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepDot: {
    width: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  stepDotActive: {
    width: 24,
    backgroundColor: Colors.text,
  },
  stepDotCompleted: {
    backgroundColor: Colors.sageGreen,
  },
  stepContainer: {
    flex: 1,
  },
  badgeLabel: {
    ...Typography.caption,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  heroTitle: {
    ...Typography.h1,
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 8,
  },
  heroSubtitle: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  inputCard: {
    marginTop: Spacing.sm,
  },
  fieldLabel: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  textInput: {
    ...Typography.h2,
    fontSize: 20,
    color: Colors.text,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skinTypeList: {
    gap: 10,
  },
  skinTypeCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  skinTypeCardSelected: {
    borderColor: Colors.text,
    backgroundColor: '#F7F5F0',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skinIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.mutedGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  skinIconBoxSelected: {
    backgroundColor: Colors.text,
  },
  skinTypeTitle: {
    ...Typography.h3,
    fontSize: 15,
    color: Colors.text,
  },
  skinTypeDesc: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  waterCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    marginTop: Spacing.sm,
  },
  waterGoalCount: {
    ...Typography.h1,
    fontSize: 32,
    color: Colors.text,
  },
  waterGoalSubtext: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 24,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBar: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  fullWidth: {
    width: '100%',
  },
});
