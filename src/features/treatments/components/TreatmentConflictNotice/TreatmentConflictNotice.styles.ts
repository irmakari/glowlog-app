import { StyleSheet } from 'react-native';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: 'rgba(240, 214, 108, 0.55)',
  },
  compactText: {
    ...Typography.caption,
    fontSize: 12,
    flex: 1,
  },
  bold: {
    fontWeight: '700',
  },
  card: {
    marginVertical: Spacing.sm,
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  itemIcon: {
    marginTop: 2,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    ...Typography.bodyBold,
    fontSize: 14,
  },
  itemBody: {
    ...Typography.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 1,
  },
  disclaimer: {
    ...Typography.caption,
    fontSize: 11,
    fontStyle: 'italic',
  },
});
