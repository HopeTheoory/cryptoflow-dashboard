import type { Metadata } from 'next';
import './globals.css';

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#080c0f] text-[#f0f4f8]">
        {children}
      </body>
    </html>
  );
}
