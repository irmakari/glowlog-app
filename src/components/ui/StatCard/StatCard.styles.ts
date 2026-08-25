import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    marginVertical: 4,
  },
  contentCol: {
    paddingVertical: 2,
  },
  label: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  value: {
    ...Typography.h2,
    fontSize: 22,
    color: Colors.text,
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
