'use client';
import { UnifiedWalletProvider } from '@jup-ag/wallet-adapter';
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

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
    return (
        <UnifiedWalletProvider
            wallets={[]}
            config={{
                autoConnect: false,
                env: 'mainnet-beta',
                metadata: {
                    name: 'TwoCat',
                    description: 'Solana Wallet Monitor DApp',
                    url: 'https://twocat.com', // 替换成你的网站
                    iconUrls: ['/favicon.ico'], // 替换成你的图标
                },
                notificationCallback: WalletNotification,
                walletlistExplanation: {
                    href: 'https://station.jup.ag/docs/additional-topics/wallet-list',
                },
                theme: "dark",
                lang: "zh",
            }}
        >
            {children}
        </UnifiedWalletProvider>
    );
} 