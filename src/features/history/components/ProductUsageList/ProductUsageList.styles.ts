import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  card: {
    marginVertical: Spacing.xs,
  },
  title: {
    ...Typography.h3,
    fontSize: 16,
    marginBottom: Spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(21, 21, 21, 0.06)',
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
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
  emptyText: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
