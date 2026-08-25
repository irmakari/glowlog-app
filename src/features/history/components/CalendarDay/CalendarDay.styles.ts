import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 1,
    margin: 3,
    borderRadius: Spacing.radiusSm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    position: 'relative',
  },
  cellOtherMonth: {
    opacity: 0.25,
  },
  cellToday: {
    borderWidth: 2,
    borderColor: Colors.text,
  },
  dayNumber: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: Colors.text,
  },
  dayNumberMuted: {
    color: Colors.textMuted,
  },
  statusDot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  completeIcon: {
    position: 'absolute',
    bottom: 2,
  },
});
