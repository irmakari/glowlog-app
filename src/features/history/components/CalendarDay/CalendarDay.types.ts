import { DayHistorySummary } from '../../types/history.types';
import { CalendarGridDay } from '../../utils/calendar.utils';

export interface CalendarDayProps {
  gridDay: CalendarGridDay;
  summary?: DayHistorySummary;
  onPressDay: (dateKey: string) => void;
}
