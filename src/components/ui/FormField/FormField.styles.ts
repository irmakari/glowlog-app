import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';
import { Spacing } from '../../../constants/spacing';

export const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.text,
  },
  requiredAsterisk: {
    color: Colors.alert,
    fontSize: 14,
    marginLeft: 3,
  },
  errorText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.alert,
    marginTop: 4,
  },
});
