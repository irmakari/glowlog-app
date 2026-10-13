import { StyleSheet } from 'react-native';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    ...Typography.h3,
    fontSize: 18,
    flexShrink: 1,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 36,
  },
  detailBtnText: {
    ...Typography.caption,
    fontSize: 12,
  },
  card: {
    marginTop: Spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  metricLabel: {
    ...Typography.bodyBold,
    fontSize: 14,
    flexShrink: 1,
  },
  progressValue: {
    ...Typography.h2,
    fontSize: 24,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressCaption: {
    ...Typography.caption,
    fontSize: 12,
    marginTop: Spacing.sm,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  metric: {
    flex: 1,
    minWidth: 0,
    borderRadius: Spacing.radiusSm,
    padding: Spacing.md,
  },
  metricHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metricName: {
    ...Typography.caption,
    fontSize: 11,
    flexShrink: 1,
  },
  metricValue: {
    ...Typography.h3,
    fontSize: 20,
    marginTop: 6,
  },
  metricSub: {
    ...Typography.caption,
    fontSize: 11,
    marginTop: 1,
  },
});
