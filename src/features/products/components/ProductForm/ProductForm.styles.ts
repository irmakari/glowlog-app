import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  halfCol: {
    flex: 1,
  },
  textInput: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.radiusSm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textInputError: {
    borderColor: Colors.alert,
  },
  multilineInput: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  customCategoryInputContainer: {
    marginTop: Spacing.xs + 2,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Spacing.radiusPill,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    borderColor: Colors.text,
    borderWidth: 2,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  paoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  paoChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Spacing.radiusPill,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paoChipActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  paoChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  paoChipTextActive: {
    color: Colors.white,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: Spacing.radiusSm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 44,
  },
  datePickerText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.text,
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  photoPreview: {
    width: 54,
    height: 54,
    borderRadius: Spacing.radiusSm,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Spacing.radiusPill,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  photoButtonText: {
    ...Typography.button,
    fontSize: 13,
    color: Colors.text,
    marginLeft: 6,
  },
  removePhotoButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
  },
  removePhotoText: {
    ...Typography.caption,
    color: Colors.alert,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  submitButton: {
    flex: 1,
  },
});
