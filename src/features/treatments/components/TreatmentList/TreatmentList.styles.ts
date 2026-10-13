import { StyleSheet } from 'react-native';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  sectionLabel: {
    ...Typography.badge,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: Spacing.lg,
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  rowCard: {
    marginVertical: 5,
  },
  rowCardFinished: {
    opacity: 0.75,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    ...Typography.bodyBold,
    fontSize: 15,
  },
  rowSubtitle: {
    ...Typography.caption,
    fontSize: 12,
    marginTop: 1,
  },
  rowMeta: {
    ...Typography.caption,
    fontSize: 11,
    marginTop: 1,
  },
  addButton: {
    marginTop: Spacing.md,
  },
});
