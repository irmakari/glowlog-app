import { StyleSheet } from 'react-native';
import { Spacing } from '../../../../constants/spacing';
import { Typography } from '../../../../constants/typography';

export const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  headerTextCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...Typography.h1,
    fontSize: 24,
    lineHeight: 28,
  },
  subtitle: {
    ...Typography.subtitle,
    fontSize: 13,
    marginTop: 2,
  },
  todayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    minHeight: 36,
    borderRadius: Spacing.radiusPill,
  },
  todayPillText: {
    ...Typography.bodyBold,
    fontSize: 13,
  },
});
