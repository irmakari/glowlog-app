import { TextStyle } from 'react-native';
import { Colors } from './colors';

export const Fonts = {
  regular: 'PlusJakartaSans_400Regular',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
};

export const Typography = {
  h1: {
    fontFamily: Fonts.extraBold,
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  } as TextStyle,

  h2: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.3,
  } as TextStyle,

  h3: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.2,
  } as TextStyle,

  subtitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  } as TextStyle,

  body: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    fontWeight: '400',
    color: Colors.text,
    lineHeight: 22,
  } as TextStyle,

  bodyBold: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 22,
  } as TextStyle,

  caption: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  } as TextStyle,

  badge: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  } as TextStyle,

  button: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    fontWeight: '700',
  } as TextStyle,
};
