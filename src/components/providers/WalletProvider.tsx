'use client';
import { UnifiedWalletProvider } from '@jup-ag/wallet-adapter';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import {
  IWalletNotification,
  IUnifiedWalletConfig
} from '@jup-ag/wallet-adapter/dist/types/contexts/WalletConnectionProvider';
import { WalletError } from '@solana/wallet-adapter-base';
import { useEffect, useState } from 'react';

const WALLET_CONNECTED_KEY = 'wallet_connected';

// 定义错误处理函数类型
type WalletErrorHandler = (error: WalletError) => void;

const handleWalletError: WalletErrorHandler = (error) => {
  console.error('Wallet error:', error);
  if (error.name === 'WalletConnectionError') {
    localStorage.removeItem(WALLET_CONNECTED_KEY);
  }
};

const WalletNotification = {
  onConnect: (props: IWalletNotification) => {
    console.log('Connected', props);
    localStorage.setItem(WALLET_CONNECTED_KEY, 'true');
  },
  onConnecting: (props: IWalletNotification) => {
    console.log('Connecting', props);
  },
  onDisconnect: (props: IWalletNotification) => {
    console.log('Disconnected', props);
    localStorage.removeItem(WALLET_CONNECTED_KEY);
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
  const [shouldAutoConnect, setShouldAutoConnect] = useState(false);

  useEffect(() => {
    const wasConnected = localStorage.getItem(WALLET_CONNECTED_KEY) === 'true';
    setShouldAutoConnect(wasConnected);
  }, []);

  const endpoint =
    'https://mainnet.helius-rpc.com/?api-key=9194ce2f-0f46-4155-804f-204ad01be750';

  const config: IUnifiedWalletConfig = {
    autoConnect: shouldAutoConnect,
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
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <UnifiedWalletProvider
        wallets={[]}
        config={config}
      >
        {children}
      </UnifiedWalletProvider>
    </ConnectionProvider>
  );
}
