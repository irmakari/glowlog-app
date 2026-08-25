import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { DailySummaryScreen } from '../../src/features/history/screens/DailySummaryScreen';

export default function DailySummaryRoute() {
  const { date } = useLocalSearchParams<{ date: string }>();
  return <DailySummaryScreen date={date || ''} />;
}
