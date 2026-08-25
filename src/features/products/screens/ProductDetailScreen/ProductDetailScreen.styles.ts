import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  heroImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: Spacing.radiusLg,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  brandText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  nameText: {
    ...Typography.h1,
    fontSize: 24,
    lineHeight: 28,
    marginBottom: Spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Spacing.radiusPill,
  },
  categoryBadgeText: {
    ...Typography.badge,
    fontSize: 12,
    color: Colors.text,
  },
  detailsCard: {
    marginVertical: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(21, 21, 21, 0.06)',
  },
  detailLabel: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  detailValue: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.text,
  },
  notesCard: {
    marginVertical: Spacing.sm,
  },
  notesTitle: {
    ...Typography.h3,
    fontSize: 15,
    marginBottom: Spacing.xs,
  },
  notesText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.text,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  buttonFlex: {
    flex: 1,
  },
  notFoundContainer: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
});
