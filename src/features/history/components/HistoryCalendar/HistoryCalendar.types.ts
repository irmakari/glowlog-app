import { MonthlyHistory } from '../../types/history.types';

export interface HistoryCalendarProps {
  history: MonthlyHistory;
  canGoNext: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPressDay: (dateKey: string) => void;
}
