import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xxl * 2,
  },
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Spacing.radiusPill,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  segmentTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Spacing.radiusPill,
  },
  segmentTabActive: {
    backgroundColor: Colors.text,
  },
  segmentText: {
    ...Typography.button,
    fontSize: 14,
    color: Colors.text,
    marginLeft: 6,
  },
  segmentTextActive: {
    color: Colors.white,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  titleText: {
    ...Typography.h2,
    fontSize: 20,
  },
  addStepButton: {
    marginVertical: Spacing.md,
  },
  emptyContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  modalTitle: {
    ...Typography.h2,
    fontSize: 20,
    marginBottom: Spacing.md,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexGrow: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
});
