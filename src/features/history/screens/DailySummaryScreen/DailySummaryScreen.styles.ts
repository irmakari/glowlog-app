import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
    fontSize: 20,
    lineHeight: 24,
  },
  headerSubtitle: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  card: {
    marginVertical: 6,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  rowIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    ...Typography.h3,
    fontSize: 15,
  },
  countBadge: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
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
    fontSize: 13,
    color: Colors.text,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  productSubtext: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  emptySubtext: {
    ...Typography.body,
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  loadingContainer: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
});
