'use client';
import { UnifiedWalletButton } from '@jup-ag/wallet-adapter';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">TwoCat Wallet Monitor</h1>
      <UnifiedWalletButton />
    </main>
  );
}
