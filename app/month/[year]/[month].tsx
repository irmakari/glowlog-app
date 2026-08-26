import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { MonthlyReportScreen } from '../../../src/features/history/screens/MonthlyReportScreen/MonthlyReportScreen';

export default function MonthlyReportRoute() {
  const { year, month } = useLocalSearchParams<{ year?: string; month?: string }>();

  const yearNum = year ? parseInt(year, 10) : new Date().getFullYear();
  const monthNum = month ? parseInt(month, 10) : new Date().getMonth() + 1;

  return <MonthlyReportScreen year={yearNum} month={monthNum} />;
}
