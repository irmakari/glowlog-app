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
  productList: {
    paddingBottom: Spacing.xxl * 2,
  },
  loadingContainer: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
