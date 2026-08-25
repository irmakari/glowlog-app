import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  headerNav: {
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
  card: {
    marginVertical: Spacing.xs,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h3,
    fontSize: 16,
  },
  countBadge: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(21, 21, 21, 0.06)',
  },
  stepIcon: {
    marginRight: Spacing.sm,
  },
  stepTextCol: {
    flex: 1,
  },
  stepTitle: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.text,
  },
  productSubtext: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptySubtext: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  loadingContainer: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
});
