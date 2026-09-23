import { DayHistorySummary, MonthlyHistory } from '../../types/history.types';

export interface HistoryCalendarProps {
  history: MonthlyHistory;
  selectedDateKey?: string;
  mode?: 'monthly' | 'weekly';
  onChangeMode?: (mode: 'monthly' | 'weekly') => void;
  additionalDays?: Record<string, DayHistorySummary>;
  canGoNext: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPressDay: (dateKey: string) => void;
}
