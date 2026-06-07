import type { Metadata } from 'next';
import { Lora } from 'next/font/google';
import { ColorSchemeScript } from '@mantine/core';
import { MantineThemeProvider } from '@/components/providers/MantineThemeProvider';
import './globals.css';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
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
    <html lang="id" className={`${lora.variable} scroll-smooth`} suppressHydrationWarning={true}>
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
