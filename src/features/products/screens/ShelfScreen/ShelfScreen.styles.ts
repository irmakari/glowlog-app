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
    marginBottom: Spacing.sm,
  },
  headerTextCol: {
    flex: 1,
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
  chipsWrapper: {
    marginBottom: Spacing.md,
  },
  productList: {
    paddingBottom: Spacing.xxl * 2,
  },
  categorySection: {
    marginBottom: Spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    ...Typography.h3,
    fontSize: 14,
    color: Colors.text,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  sectionCount: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  loadingContainer: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
