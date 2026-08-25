import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { Typography } from '../../../../constants/typography';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xxl * 2,
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Spacing.radiusPill,
    borderWidth: 1.5,
    borderColor: 'transparent',
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
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  datePickerText: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.text,
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  photoPreview: {
    width: 72,
    height: 72,
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
    paddingVertical: 10,
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
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  removePhotoText: {
    ...Typography.caption,
    color: Colors.alert,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  submitButton: {
    flex: 1,
  },
});
