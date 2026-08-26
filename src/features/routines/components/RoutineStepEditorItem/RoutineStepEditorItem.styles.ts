import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Spacing.radiusMd,
    marginVertical: 4,
    ...Platform.select({
      ios: {
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  reorderCol: {
    marginRight: Spacing.sm,
  },
  arrowButton: {
    padding: 2,
  },
  arrowButtonDisabled: {
    opacity: 0.25,
  },
  textCol: {
    flex: 1,
  },
  titleText: {
    ...Typography.bodyBold,
    fontSize: 15,
    color: Colors.text,
  },
  productSubtext: {
    ...Typography.caption,
    fontSize: 12,
    marginTop: 1,
    color: Colors.textSecondary,
  },
  archivedText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.alert,
    fontStyle: 'italic',
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    padding: 6,
  },
});
