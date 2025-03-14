import { StyleSheet, TextStyle } from 'react-native';

import type { TypographyProps } from './index';

export const baseStyles: Record<TypographyProps['variant'], TextStyle> = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16 },
  caption: { fontSize: 12, color: 'gray' },
};

export const styles = StyleSheet.create({
  light: {
    color: '#000',
  },
  dark: {
    color: '#fff',
  },
});
