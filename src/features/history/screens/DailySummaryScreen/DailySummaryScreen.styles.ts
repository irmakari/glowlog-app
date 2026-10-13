import { StyleSheet } from 'react-native';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    minWidth: 0,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  headerTextWrapper: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...Typography.h1,
    fontSize: 20,
    lineHeight: 24,
    textTransform: 'capitalize',
  },
  headerSubtitle: {
    ...Typography.caption,
    fontSize: 12,
    marginTop: 2,
    flexShrink: 1,
  },
  todayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 6,
    marginTop: 2,
  },
  todayBadgeText: {
    ...Typography.badge,
    fontSize: 10,
    letterSpacing: 0.2,
  },
  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    minHeight: 36,
    borderRadius: Spacing.radiusPill,
  },
  editPillText: {
    ...Typography.bodyBold,
    fontSize: 13,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  overviewTile: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    borderRadius: Spacing.radiusMd,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  overviewIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewValue: {
    ...Typography.h3,
    fontSize: 18,
    marginTop: 6,
  },
  overviewLabel: {
    ...Typography.caption,
    fontSize: 11,
    marginTop: 1,
  },
  noticeCard: {
    marginVertical: Spacing.xs,
  },
  noticeText: {
    ...Typography.bodyBold,
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  card: {
    marginVertical: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    marginBottom: 10,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    ...Typography.h3,
    fontSize: 16,
  },
  sectionCaption: {
    ...Typography.caption,
    fontSize: 12,
    marginTop: 1,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  listContainer: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  emptySubtext: {
    ...Typography.body,
    fontSize: 13,
  },
  waterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  loadingContainer: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
});
