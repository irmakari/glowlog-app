import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { RoutineManagementScreen } from '../../src/features/routines/screens/RoutineManagementScreen';

export default function EditRoutineRoute() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  const initialType = type === 'evening' ? 'evening' : 'morning';
  return <RoutineManagementScreen initialType={initialType} />;
}
