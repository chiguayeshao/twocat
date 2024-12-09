import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { WalletContextProvider } from '@/components/providers/WalletProvider';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/next';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'MCGA - Make Community Great Again',
  description: 'MCGA - Make Community Great Again',
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
        <WalletContextProvider>{children}</WalletContextProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
