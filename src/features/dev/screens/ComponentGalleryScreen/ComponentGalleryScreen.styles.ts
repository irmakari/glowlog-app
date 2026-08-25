import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
    fontSize: 22,
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  badge: {
    backgroundColor: Colors.alert,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.radiusPill,
  },
  badgeText: {
    ...Typography.badge,
    color: Colors.white,
    fontSize: 10,
  },
  rowGap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginVertical: 4,
  },
  gridTwoCol: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalTitle: {
    ...Typography.h2,
    fontSize: 20,
    marginBottom: Spacing.md,
  },
  devNotAvailable: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
});
