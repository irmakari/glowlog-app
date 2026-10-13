import { StyleSheet } from 'react-native';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...Typography.h1,
    fontSize: 22,
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 13,
    marginTop: 2,
  },
});
