import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  grabberContainer: {
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 4,
  },
  grabberBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(21, 21, 21, 0.18)',
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h1,
    fontSize: 20,
    lineHeight: 24,
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
  sectionTitle: {
    ...Typography.h3,
    fontSize: 15,
  },
  countBadge: {
    ...Typography.caption,
    fontSize: 11,
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
    fontSize: 13,
    color: Colors.text,
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
