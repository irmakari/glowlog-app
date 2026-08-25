export const Colors = {
  background: '#F6F1E7',
  text: '#151515',
  textSecondary: '#6E6B65',
  textMuted: '#9B978F',

  // Brand Pastels
  pink: '#F4B6D2',
  softBlue: '#BFD5F2',
  butterYellow: '#F0D66C',
  sageGreen: '#B8CB8C',
  softLilac: '#D6C3EF',
  softPeach: '#F2BF9B',
  mutedGray: '#E9E5DD',
  white: '#FFFFFF',
  cardCream: '#EFE8DC',

  // UI state colors
  border: '#E2DDD2',
  borderDark: '#151515',
  darkCard: '#1C1C1E',
  tint: '#151515',
  icon: '#151515',
  tabIconDefault: '#8E8E93',
  tabIconSelected: '#151515',

  // Status colors
  success: '#98C98B',
  warning: '#F5C65D',
  alert: '#E87D7D',
};

export type ColorVariant =
  | 'cream'
  | 'pink'
  | 'softBlue'
  | 'butterYellow'
  | 'sageGreen'
  | 'softLilac'
  | 'softPeach'
  | 'white'
  | 'mutedGray';

export const CARD_COLORS: Record<ColorVariant, string> = {
  cream: Colors.cardCream,
  pink: Colors.pink,
  softBlue: Colors.softBlue,
  butterYellow: Colors.butterYellow,
  sageGreen: Colors.sageGreen,
  softLilac: Colors.softLilac,
  softPeach: Colors.softPeach,
  white: Colors.white,
  mutedGray: Colors.mutedGray,
};
