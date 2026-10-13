import { MonthlyHistory } from '../../types/history.types';

export interface HistoryCalendarProps {
  history: MonthlyHistory;
  selectedDateKey?: string;
  canGoNext: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPressDay: (dateKey: string) => void;
}
