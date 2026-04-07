import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'CryptoFlow Trading Dashboard',
  description: 'Enterprise-grade cryptocurrency trading dashboard with real-time Binance data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} bg-[#080c0f] text-[#f0f4f8]`}>
        {children}
      </body>
    </html>
  );
}
