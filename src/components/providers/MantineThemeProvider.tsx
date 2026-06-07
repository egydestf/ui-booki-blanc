"use client";

import { createTheme, MantineProvider, MantineColorsTuple } from '@mantine/core';

// Single point of modification for theme adjustments
export const brandTokens = {
  primaryBlue: '#0A96E6',
  accentPink: '#E9559B',
  brandYellowGold: '#FBAD1A',
  brandYellowMid: '#FDC33E',
  brandYellowLight: '#FECC4E',
  neutralCream: '#F0E3D3',
  neutralSoft: '#F8F1E9',
};

// 10-shade scale calculations compliant with Mantine v8 matching keys
const brandBlue: MantineColorsTuple = [
  '#e6f4fe', '#cce6fd', '#99cdfc', '#66b3fa', '#339afa',
  brandTokens.primaryBlue, '#007ec7', '#0065a0', '#004d7a', '#003454'
];

const brandYellow: MantineColorsTuple = [
  '#fff8e3', '#ffeed2', brandTokens.brandYellowLight, brandTokens.brandYellowMid,
  brandTokens.brandYellowGold, '#e5970c', '#c77f00', '#a66800', '#855100', '#633b00'
];

export const theme = createTheme({
  fontFamily: "var(--font-plus-jakarta), 'ui-sans-serif', system-ui, sans-serif",
  fontFamilyMonospace: "ui-monospace, 'Cascadia Code', monospace",
  headings: {
    fontFamily: "var(--font-plus-jakarta), 'ui-sans-serif', system-ui, sans-serif",
    fontWeight: '700',
  },
  primaryColor: 'brandBlue',
  colors: {
    brandBlue,
    brandYellow,
  },
  other: {
    accentPink: brandTokens.accentPink,
    neutralCream: brandTokens.neutralCream,
    neutralSoft: brandTokens.neutralSoft,
  }
});

export function MantineThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      {children}
    </MantineProvider>
  );
}
