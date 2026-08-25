import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { Spacing } from '../../../../constants/spacing';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
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
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  buttonFlex: {
    flex: 1,
  },
});
