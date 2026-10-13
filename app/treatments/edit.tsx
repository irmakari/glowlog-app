import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { TreatmentEditScreen } from '../../src/features/treatments/screens/TreatmentEditScreen';

export default function EditTreatmentRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <TreatmentEditScreen id={id || undefined} />;
}
