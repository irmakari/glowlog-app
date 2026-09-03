export const LightColors = {
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
  mutedGray: '#8EC5FC',
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

export const DarkColors: typeof LightColors = {
  background: '#121214',
  text: '#F5F5F7',
  textSecondary: '#A1A1A6',
  textMuted: '#6E6E73',

  // Dark Pastel Variants (Subtle charcoal tinted tones)
  pink: '#281B24',
  softBlue: '#192330',
  butterYellow: '#26221A',
  sageGreen: '#1A251C',
  softLilac: '#231B2C',
  softPeach: '#281C18',
  mutedGray: '#1C2228',
  white: '#1E1E22',
  cardCream: '#1C1C1E',

  // UI state colors
  border: '#2E2E34',
  borderDark: '#3E3E46',
  darkCard: '#1C1C1E',
  tint: '#F5F5F7',
  icon: '#F5F5F7',
  tabIconDefault: '#6E6E73',
  tabIconSelected: '#F5F5F7',

  // Status colors
  success: '#98C98B',
  warning: '#F5C65D',
  alert: '#E87D7D',
};

export const Colors = LightColors;

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

export const DARK_CARD_COLORS: Record<ColorVariant, string> = {
  cream: '#1C1C1E',
  pink: '#281B24',
  softBlue: '#192330',
  butterYellow: '#26221A',
  sageGreen: '#1A251C',
  softLilac: '#231B2C',
  softPeach: '#281C18',
  white: '#1E1E22',
  mutedGray: '#1C2228',
};
