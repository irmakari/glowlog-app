import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../components/ui/Screen';
import { IconButton } from '../../../../components/ui/IconButton';
import { RoutineEditor } from '../../components/RoutineEditor';
import { RoutineManagementScreenProps } from './RoutineManagementScreen.types';
import { styles } from './RoutineManagementScreen.styles';
import { Colors } from '../../../../constants/colors';
import { useTranslation } from '../../../../hooks/useTranslation';

export const RoutineManagementScreen: React.FC<RoutineManagementScreenProps> = ({
  initialType = 'morning',
  initialEditStepId,
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Screen scrollable padding={16}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t('routineEditor.editRoutines')}</Text>
        <IconButton
          icon={<Ionicons name="close" size={20} color={Colors.text} />}
          onPress={() => router.back()}
          backgroundColor={Colors.white}
          size={36}
        />
      </View>

      <RoutineEditor initialType={initialType} initialEditStepId={initialEditStepId} />
    </Screen>
  );
};
