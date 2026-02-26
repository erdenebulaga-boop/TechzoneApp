import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography: Record<string, TextStyle> = {
  displayLarge:   { fontSize: 32, lineHeight: 40, fontWeight: '700', fontFamily },
  displayMedium:  { fontSize: 28, lineHeight: 36, fontWeight: '700', fontFamily },
  headlineLarge:  { fontSize: 24, lineHeight: 32, fontWeight: '600', fontFamily },
  headlineMedium: { fontSize: 20, lineHeight: 28, fontWeight: '600', fontFamily },
  titleLarge:     { fontSize: 18, lineHeight: 24, fontWeight: '600', fontFamily },
  titleMedium:    { fontSize: 16, lineHeight: 22, fontWeight: '500', fontFamily },
  bodyLarge:      { fontSize: 16, lineHeight: 24, fontWeight: '400', fontFamily },
  bodyMedium:     { fontSize: 14, lineHeight: 20, fontWeight: '400', fontFamily },
  bodySmall:      { fontSize: 12, lineHeight: 16, fontWeight: '400', fontFamily },
  labelLarge:     { fontSize: 14, lineHeight: 20, fontWeight: '500', fontFamily },
  labelMedium:    { fontSize: 12, lineHeight: 16, fontWeight: '500', fontFamily },
  labelSmall:     { fontSize: 11, lineHeight: 16, fontWeight: '500', fontFamily },
  caption:        { fontSize: 10, lineHeight: 14, fontWeight: '400', fontFamily },
};
