import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 6,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Spacing.radiusPill,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: 'rgba(21, 21, 21, 0.08)',
  },
  chipActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  chipText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  chipTextActive: {
    color: Colors.white,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  badge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    backgroundColor: 'rgba(21, 21, 21, 0.06)',
  },
  badgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  badgeTextActive: {
    color: Colors.white,
  },
});
