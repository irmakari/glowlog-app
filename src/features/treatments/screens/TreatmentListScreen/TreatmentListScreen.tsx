import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import { TreatmentList } from '../../components/TreatmentList';
import { styles } from './TreatmentListScreen.styles';

export const TreatmentListScreen: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Screen scrollable padding={16} edges={['bottom', 'left', 'right']} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>{t('treatments.title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('treatments.subtitle')}</Text>
        </View>
        <IconButton
          icon={<Ionicons name="close" size={20} color={colors.text} />}
          onPress={() => router.back()}
          backgroundColor={colors.white}
          size={36}
        />
      </View>

      <TreatmentList />
    </Screen>
  );
};
