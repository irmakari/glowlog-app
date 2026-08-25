import React, { useState } from 'react';
import { View, Text, Modal, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { GlowCard } from '../../../../components/ui/GlowCard';
import { PillButton } from '../../../../components/ui/PillButton';
import { SectionHeader } from '../../../../components/ui/SectionHeader';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { FormField } from '../../../../components/ui/FormField';
import { StatCard } from '../../../../components/ui/StatCard';
import { GlowScoreCard } from '../../../../components/dashboard/GlowScoreCard';
import { GlowRing } from '../../../../components/dashboard/GlowRing';
import { RoutineCard } from '../../../../components/routine/RoutineCard';
import { RoutineItem } from '../../../../components/routine/RoutineItem';
import { WaterTracker } from '../../../../components/hydration/WaterTracker';
import { StreakCard } from '../../../../components/dashboard/StreakCard';
import { ProductAlertCard } from '../../../../components/dashboard/ProductAlertCard';

import { ProductCard } from '../../../products/components/ProductCard';
import { ProductForm } from '../../../products/components/ProductForm';
import { EmptyShelfState } from '../../../products/components/EmptyShelfState';

import { ProductSelector } from '../../../routines/components/ProductSelector';
import { RoutineStepForm } from '../../../routines/components/RoutineStepForm';
import { RoutineStepEditorItem } from '../../../routines/components/RoutineStepEditorItem';

import { CalendarDay } from '../../../history/components/CalendarDay';
import { HistoryCalendar } from '../../../history/components/HistoryCalendar';
import { MonthlyStats } from '../../../history/components/MonthlyStats';
import { ProductUsageList } from '../../../history/components/ProductUsageList';

import { DbInspector } from '../../components/DbInspector';
import { GallerySection } from '../../components/GallerySection';
import { MOCK_PRODUCT_LIST, MOCK_PRODUCTS } from '../../mocks/products.mock';
import { MOCK_MORNING_STEPS, MOCK_EVENING_STEPS, MOCK_EDITOR_STEPS } from '../../mocks/routines.mock';
import { MOCK_MONTHLY_HISTORY, MOCK_MONTHLY_STATS } from '../../mocks/history.mock';
import { MOCK_DAILY_SUMMARY } from '../../mocks/dailySummary.mock';

import { styles } from './ComponentGalleryScreen.styles';
import { Colors } from '../../../../constants/colors';
import { calculateGlowScore } from '../../../../utils/glowScore';

export const ComponentGalleryScreen: React.FC = () => {
  const router = useRouter();

  // Local interactive gallery state (does NOT touch SQLite)
  const [waterGlasses, setWaterGlasses] = useState<number>(4);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(MOCK_PRODUCTS.productA.id);
  const [routineModalVisible, setRoutineModalVisible] = useState<boolean>(false);
  const [productFormModalVisible, setProductFormModalVisible] = useState<boolean>(false);

  if (!__DEV__) {
    return (
      <Screen scrollable padding={16}>
        <View style={styles.devNotAvailable}>
          <Text style={styles.title}>Development Only 🔒</Text>
          <Text style={styles.subtitle}>
            The Component Gallery is only accessible during local development.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable padding={12}>
      {/* Gallery Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Component Gallery 🎨</Text>
          <Text style={styles.subtitle}>DEV ONLY • Pure In-Memory Mock & Live DB Inspector</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>__DEV__</Text>
        </View>
        <IconButton
          icon={<Ionicons name="close" size={20} color={Colors.text} />}
          onPress={() => router.back()}
          backgroundColor={Colors.white}
          size={36}
        />
      </View>

      {/* 1. FOUNDATIONS */}
      <GallerySection title="1. Foundations & Base UI" description="GlowCards, PillButtons, IconButtons, and SectionHeaders">
        <Text style={styles.subtitle}>GlowCard Pastel Variants:</Text>
        <View style={styles.rowGap}>
          <GlowCard variant="pink" padding={10}><Text>Pink Card</Text></GlowCard>
          <GlowCard variant="softBlue" padding={10}><Text>Soft Blue Card</Text></GlowCard>
          <GlowCard variant="sageGreen" padding={10}><Text>Sage Green Card</Text></GlowCard>
          <GlowCard variant="butterYellow" padding={10}><Text>Butter Yellow Card</Text></GlowCard>
          <GlowCard variant="softLilac" padding={10}><Text>Soft Lilac Card</Text></GlowCard>
          <GlowCard variant="softPeach" padding={10}><Text>Soft Peach Card</Text></GlowCard>
        </View>

        <Text style={styles.subtitle}>PillButton Variants & States:</Text>
        <View style={styles.rowGap}>
          <PillButton title="Primary Button" onPress={() => {}} variant="primary" size="md" />
          <PillButton title="Secondary Button" onPress={() => {}} variant="secondary" size="md" />
          <PillButton title="Pastel Button" onPress={() => {}} variant="secondary" pastelColor="sageGreen" size="md" />
          <PillButton title="Ghost Button" onPress={() => {}} variant="ghost" size="md" />
          <PillButton title="Loading..." onPress={() => {}} variant="primary" size="md" loading />
          <PillButton title="Disabled" onPress={() => {}} variant="primary" size="md" disabled />
        </View>

        <Text style={styles.subtitle}>SectionHeader & IconButton:</Text>
        <SectionHeader title="Category Header" subtitle="Subtext" rightElement={<PillButton title="Action" onPress={() => {}} size="sm" />} />
        <View style={styles.rowGap}>
          <IconButton icon={<Ionicons name="add" size={20} color={Colors.text} />} onPress={() => {}} backgroundColor={Colors.pink} />
          <IconButton icon={<Ionicons name="sparkles" size={20} color={Colors.text} />} onPress={() => {}} backgroundColor={Colors.softBlue} />
        </View>
      </GallerySection>

      {/* 2. TODAY DASHBOARD */}
      <GallerySection title="2. Today Dashboard Components" description="GlowScoreCard, GlowRing, StreakCard, ProductAlertCard">
        <Text style={styles.subtitle}>GlowScoreCard (Score: 7.6):</Text>
        <GlowScoreCard
          scoreBreakdown={calculateGlowScore({
            completedStepsCount: 5,
            totalStepsCount: 7,
            currentHydration: 6,
            hydrationGoal: 8,
            streakDays: 6,
          })}
          currentHydration={6}
          hydrationGoal={8}
          streakDays={6}
        />

        <Text style={styles.subtitle}>GlowRing Progress Visualization (0%, 3.4, 7.6, 10.0):</Text>
        <View style={styles.rowGap}>
          <GlowRing scoreBreakdown={calculateGlowScore({ completedStepsCount: 0, totalStepsCount: 7, currentHydration: 0, hydrationGoal: 8, streakDays: 0 })} size={70} />
          <GlowRing scoreBreakdown={calculateGlowScore({ completedStepsCount: 2, totalStepsCount: 7, currentHydration: 3, hydrationGoal: 8, streakDays: 1 })} size={70} />
          <GlowRing scoreBreakdown={calculateGlowScore({ completedStepsCount: 5, totalStepsCount: 7, currentHydration: 6, hydrationGoal: 8, streakDays: 6 })} size={70} />
          <GlowRing scoreBreakdown={calculateGlowScore({ completedStepsCount: 7, totalStepsCount: 7, currentHydration: 8, hydrationGoal: 8, streakDays: 10 })} size={70} />
        </View>

        <Text style={styles.subtitle}>StreakCard (Singular & Plural):</Text>
        <StreakCard streakDays={1} />
        <StreakCard streakDays={6} />
        <StreakCard streakDays={21} />

        <Text style={styles.subtitle}>ProductAlertCard:</Text>
        <ProductAlertCard
          title="Shelf check 🧴"
          message="Check opened product dates on your Shelf periodically."
          actionText="View Shelf"
          onAction={() => {}}
        />
      </GallerySection>

      {/* 3. HYDRATION */}
      <GallerySection title="3. Hydration Tracker" description="Interactive WaterTracker preview using in-memory state">
        <WaterTracker
          current={waterGlasses}
          goal={8}
          onIncrement={() => setWaterGlasses((c) => Math.min(8, c + 1))}
          onDecrement={() => setWaterGlasses((c) => Math.max(0, c - 1))}
        />
      </GallerySection>

      {/* 4. ROUTINES */}
      <GallerySection title="4. Routines & Routine Items" description="RoutineCard, RoutineItem, RoutineStepEditorItem">
        <Text style={styles.subtitle}>RoutineCard (Morning Partial):</Text>
        <RoutineCard type="morning" steps={MOCK_MORNING_STEPS} onToggleStep={() => {}} />

        <Text style={styles.subtitle}>RoutineCard (Evening Complete):</Text>
        <RoutineCard type="evening" steps={MOCK_EVENING_STEPS} onToggleStep={() => {}} />

        <Text style={styles.subtitle}>RoutineCard (Empty Routine):</Text>
        <RoutineCard type="morning" steps={[]} onToggleStep={() => {}} />

        <Text style={styles.subtitle}>Individual RoutineItem States:</Text>
        <View style={{ backgroundColor: Colors.white, borderRadius: 10, padding: 8 }}>
          <RoutineItem id="1" title="Cleanser (Unchecked)" completed={false} onToggle={() => {}} />
          <RoutineItem id="2" title="Serum (Checked)" completed={true} productName="The Ordinary Niacinamide" onToggle={() => {}} />
          <RoutineItem id="3" title="Treatment (Archived Product)" completed={false} isProductArchived onToggle={() => {}} isLast />
        </View>

        <Text style={styles.subtitle}>RoutineStepEditorItem (Reorder & Edit controls):</Text>
        {MOCK_EDITOR_STEPS.map((step, idx) => (
          <RoutineStepEditorItem
            key={step.id}
            step={step}
            index={idx}
            totalSteps={MOCK_EDITOR_STEPS.length}
            onEdit={() => {}}
            onDelete={() => {}}
            onMoveUp={() => {}}
            onMoveDown={() => {}}
          />
        ))}
      </GallerySection>

      {/* 5. PRODUCTS & SHELF */}
      <GallerySection title="5. Products & Shelf Cards" description="ProductCard with photo, no photo, long names, expired PAO, archived status">
        <View style={styles.gridTwoCol}>
          {MOCK_PRODUCT_LIST.map((product) => (
            <ProductCard key={product.id} product={product} onPress={() => Alert.alert(product.name)} />
          ))}
        </View>

        <Text style={styles.subtitle}>Empty Shelf State:</Text>
        <EmptyShelfState onAddProduct={() => setProductFormModalVisible(true)} />
      </GallerySection>

      {/* 6. FORMS & INPUTS */}
      <GallerySection title="6. Forms & Inputs" description="FormField, ProductSelector, RoutineStepForm">
        <Text style={styles.subtitle}>FormField States (Normal & Error):</Text>
        <FormField label="Product Name" required>
          <GlowCard variant="cream" padding={8}><Text>Normal Input</Text></GlowCard>
        </FormField>

        <FormField label="Brand Name" required error="Brand is required">
          <GlowCard variant="cream" padding={8}><Text>Error State Input</Text></GlowCard>
        </FormField>

        <Text style={styles.subtitle}>ProductSelector (Mock Products Override):</Text>
        <ProductSelector
          selectedProductId={selectedProductId}
          onSelectProduct={setSelectedProductId}
          productsOverride={MOCK_PRODUCT_LIST}
        />
      </GallerySection>

      {/* 7. HISTORY & CALENDAR */}
      <GallerySection title="7. History & Calendar" description="HistoryCalendar, CalendarDay states, MonthlyStats">
        <Text style={styles.subtitle}>HistoryCalendar (August 2026 Mock Month):</Text>
        <HistoryCalendar
          history={MOCK_MONTHLY_HISTORY}
          canGoNext={false}
          onPrevMonth={() => {}}
          onNextMonth={() => {}}
          onPressDay={(d) => Alert.alert('Selected date', d)}
        />

        <Text style={styles.subtitle}>Individual CalendarDay Visual States:</Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <CalendarDay gridDay={{ dateKey: '2026-08-01', dayNumber: 1, isCurrentMonth: true, isToday: false, isFuture: false }} summary={{ date: '2026-08-01', status: 'complete', completedSteps: 7, totalSteps: 7, hydration: 8, hydrationGoal: 8, productsUsedCount: 4, isToday: false }} onPressDay={() => {}} />
          <CalendarDay gridDay={{ dateKey: '2026-08-04', dayNumber: 4, isCurrentMonth: true, isToday: false, isFuture: false }} summary={{ date: '2026-08-04', status: 'partial', completedSteps: 3, totalSteps: 7, hydration: 5, hydrationGoal: 8, productsUsedCount: 2, isToday: false }} onPressDay={() => {}} />
          <CalendarDay gridDay={{ dateKey: '2026-08-05', dayNumber: 5, isCurrentMonth: true, isToday: false, isFuture: false }} summary={{ date: '2026-08-05', status: 'empty', completedSteps: 0, totalSteps: 7, hydration: 0, hydrationGoal: 8, productsUsedCount: 0, isToday: false }} onPressDay={() => {}} />
          <CalendarDay gridDay={{ dateKey: '2026-08-26', dayNumber: 26, isCurrentMonth: true, isToday: true, isFuture: false }} summary={{ date: '2026-08-26', status: 'partial', completedSteps: 4, totalSteps: 7, hydration: 6, hydrationGoal: 8, productsUsedCount: 3, isToday: true }} onPressDay={() => {}} />
          <CalendarDay gridDay={{ dateKey: '2026-08-28', dayNumber: 28, isCurrentMonth: true, isToday: false, isFuture: true }} summary={{ date: '2026-08-28', status: 'future', completedSteps: 0, totalSteps: 7, hydration: 0, hydrationGoal: 8, productsUsedCount: 0, isToday: false }} onPressDay={() => {}} />
        </View>

        <Text style={styles.subtitle}>MonthlyStats Cards Grid:</Text>
        <MonthlyStats stats={MOCK_MONTHLY_STATS} />

        <Text style={styles.subtitle}>StatCard Variants (0% vs 100%):</Text>
        <View style={styles.gridTwoCol}>
          <StatCard label="Empty Consistency" value="0%" subtitle="0 of 20 days" variant="pink" />
          <StatCard label="Perfect Streak" value="100%" subtitle="30 of 30 days" variant="sageGreen" />
        </View>
      </GallerySection>

      {/* 8. DAILY SUMMARY & PRODUCTS USED */}
      <GallerySection title="8. Daily Summary & Product Usage List" description="DailySummary preview and ProductUsageList">
        <ProductUsageList products={MOCK_DAILY_SUMMARY.productsUsed} />
        <ProductUsageList products={[]} />
      </GallerySection>

      {/* 9. EMPTY & LOADING STATES */}
      <GallerySection title="9. Empty & Loading States" description="EmptyState component variations & loaders">
        <EmptyState
          title="Your glow story starts today ✨"
          description="Complete your skincare routines to build your calendar history."
          actionTitle="Build Morning Routine"
          onAction={() => {}}
        />

        <Text style={styles.subtitle}>Loading Indicators:</Text>
        <View style={styles.rowGap}>
          <ActivityIndicator size="small" color={Colors.text} />
          <ActivityIndicator size="large" color={Colors.text} />
        </View>
      </GallerySection>

      {/* 10. INTERACTIVE MODAL PREVIEWS */}
      <GallerySection title="10. Modal & Form Previews" description="Test real forms in dev modals without mutating SQLite">
        <PillButton
          title="Open Add Product Form Modal"
          onPress={() => setProductFormModalVisible(true)}
          variant="primary"
          size="md"
        />

        <PillButton
          title="Open Add Routine Step Form Modal"
          onPress={() => setRoutineModalVisible(true)}
          variant="secondary"
          size="md"
        />
      </GallerySection>

      {/* 11. LIVE SQLITE DATABASE INSPECTOR */}
      <GallerySection title="11. Live SQLite Database Inspector 🗄️" description="Inspect real SQLite rows (glowlog.db) directly inside the app!">
        <DbInspector />
      </GallerySection>

      {/* Product Form Modal Preview */}
      <Modal
        visible={productFormModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setProductFormModalVisible(false)}
      >
        <Screen scrollable padding={16}>
          <Text style={styles.modalTitle}>Mock Product Form Preview</Text>
          <ProductForm
            mode="edit"
            initialValues={MOCK_PRODUCTS.productB}
            onSubmit={async () => setProductFormModalVisible(false)}
            onCancel={() => setProductFormModalVisible(false)}
          />
        </Screen>
      </Modal>

      {/* Routine Step Form Modal Preview */}
      <Modal
        visible={routineModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setRoutineModalVisible(false)}
      >
        <Screen scrollable padding={16}>
          <Text style={styles.modalTitle}>Mock Routine Step Form Preview</Text>
          <RoutineStepForm
            onSubmit={async () => setRoutineModalVisible(false)}
            onCancel={() => setRoutineModalVisible(false)}
          />
        </Screen>
      </Modal>
    </Screen>
  );
};
