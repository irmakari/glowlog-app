import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Spacing.radiusLg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    marginBottom: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(21, 21, 21, 0.06)',
    paddingBottom: Spacing.xs,
  },
  title: {
    ...Typography.h2,
    fontSize: 18,
    color: Colors.text,
  },
  description: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  content: {
    gap: Spacing.md,
  },
});
