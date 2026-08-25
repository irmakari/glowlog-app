import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: Spacing.md,
  },
  tabButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Spacing.radiusPill,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabButtonActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  tabText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.text,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.white,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  tableTitle: {
    ...Typography.h3,
    fontSize: 15,
  },
  jsonContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: Spacing.radiusSm,
    padding: 10,
    maxHeight: 280,
  },
  jsonText: {
    fontSize: 11,
    color: '#D4D4D4',
  },
  emptyText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
