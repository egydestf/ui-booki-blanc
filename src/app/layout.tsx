import type { Metadata } from 'next';
import { ColorSchemeScript } from '@mantine/core';
import { MantineThemeProvider } from '@/components/providers/MantineThemeProvider';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Rumah Literasi Tambaksogra',
  description: 'Sistem terpadu Rumah Literasi Tambaksogra & Booki AI Recommendation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} scroll-smooth`} data-scroll-behavior="smooth" suppressHydrationWarning={true}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineThemeProvider>
          {children}
        </MantineThemeProvider>
      </body>
    </html>
  );
}
