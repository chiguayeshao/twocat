'use client';
import { UnifiedWalletProvider } from '@jup-ag/wallet-adapter';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { IWalletNotification } from '@jup-ag/wallet-adapter/dist/types/contexts/WalletConnectionProvider';

const WalletNotification = {
  onConnect: (props: IWalletNotification) => {
    console.log('Connected', props);
  },
  onConnecting: (props: IWalletNotification) => {
    console.log('Connecting', props);
  },
  onDisconnect: (props: IWalletNotification) => {
    console.log('Disconnected', props);
  },
  onNotInstalled: (props: IWalletNotification) => {
    console.log('Not installed', props);
  },
};

export function WalletContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const endpoint =
    'https://mainnet.helius-rpc.com/?api-key=9194ce2f-0f46-4155-804f-204ad01be750';

  return (
    <ConnectionProvider endpoint={endpoint}>
      <UnifiedWalletProvider
        wallets={[]}
        config={{
          autoConnect: true,
          env: 'mainnet-beta',
          metadata: {
            name: 'TwoCat',
            description: 'Solana Wallet Monitor DApp',
            url: 'https://twocat.com',
            iconUrls: ['/favicon.ico'],
          },
          notificationCallback: WalletNotification,
          walletlistExplanation: {
            href: 'https://station.jup.ag/docs/additional-topics/wallet-list',
          },
          theme: 'dark',
          lang: 'zh',
        }}
      >
        {children}
      </UnifiedWalletProvider>
    </ConnectionProvider>
  );
}
