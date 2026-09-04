import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { PROJECT_CONFIG } from '@/config/project';
import { LanguageProvider } from '@/lib/i18n/language-context';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${PROJECT_CONFIG.productName} — ${PROJECT_CONFIG.tagline}`,
  description: `Simple business planning support for first-time rural and semi-urban entrepreneurs, created for ${PROJECT_CONFIG.eventName}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
