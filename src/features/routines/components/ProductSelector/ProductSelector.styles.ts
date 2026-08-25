import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Spacing.radiusSm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 6,
  },
  optionCardSelected: {
    borderColor: Colors.text,
    backgroundColor: Colors.cardCream,
  },
  textCol: {
    flex: 1,
  },
  brandText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  nameText: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.text,
  },
  emptyContainer: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.caption,
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
