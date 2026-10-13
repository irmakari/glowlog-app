import { StyleSheet } from 'react-native';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...Typography.h3,
    fontSize: 17,
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 13,
    marginTop: 1,
  },
  menuButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -6,
  },
  panel: {
    marginTop: 14,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rowDivider: {
    borderBottomWidth: 1,
  },
  rowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    minWidth: 0,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm + 4,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    ...Typography.bodyBold,
    fontSize: 15,
    lineHeight: 20,
  },
  rowSubtitle: {
    ...Typography.caption,
    fontSize: 12,
    marginTop: 1,
  },
  skipText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Spacing.radiusPill,
  },
  statusPillText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '600',
  },
});
