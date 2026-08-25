import { StyleSheet } from 'react-native';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  header: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
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
  loadingContainer: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
});
