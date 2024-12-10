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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased 
                       bg-[#1a1b1e] text-white h-full`}>
        <div className="flex flex-col min-h-screen h-full">
          <WalletContextProvider>
            <main className="flex-1 flex flex-col">
              {children}
            </main>
           
          </WalletContextProvider>
        </div>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
