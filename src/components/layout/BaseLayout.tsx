'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import TradeBox from '@/components/trade/TradeBox';
import { TransactionList } from '@/components/transactions/TransactionList';
import { KLineChart } from '@/components/charts/KLineChart';
import { TokenStats } from '@/components/token/TokenStats';
import { WalletInfo } from '@/components/wallet/WalletInfo';
import { SearchBox } from '@/components/search/SearchBox';

interface Room {
  _id: string;
  roomName: string;
  description: string;
  isPrivate: boolean;
  creatorWallet: string;
  memberCount: number;
  members: string[];
  monitoredWallets: {
    _id: string;
    address: string;
    description: string;
  }[];
  channels: string[];
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface BaseLayoutProps {
  children: React.ReactNode;
  roomId: string;
}

export function BaseLayout({ children, roomId }: BaseLayoutProps) {
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<
    string | null
  >(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWalletAddress, setSelectedWalletAddress] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadRoomInfo = async () => {
      try {
        const response = await fetch(`/api/twocat-core/rooms?roomId=${roomId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch room info');
        }
        const responseData = await response.json();
        setRoom(responseData.data);
      } catch (error) {
        console.error('Failed to load room info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoomInfo();
  }, []);

  const handleTransactionClick = (
    walletAddress: string,
    tokenAddress: string
  ) => {
    setSelectedWalletAddress(walletAddress);
    setSelectedTokenAddress(tokenAddress);
  };

  const handleWalletTokenClick = (tokenAddress: string) => {
    setSelectedTokenAddress(tokenAddress);
  };

  return (
    <div className="flex h-screen bg-discord-primary text-white overflow-hidden">
      <Sidebar roomId={roomId} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onTokenSelect={setSelectedTokenAddress}
        />

        <main className="flex-1 grid grid-cols-12 gap-4 p-4 min-h-0 overflow-auto">
          <div className="col-span-8 grid grid-rows-[2fr,1fr] gap-4 min-h-0">
            <div className="bg-discord-secondary rounded-lg flex flex-col border border-discord-divider min-h-0 overflow-hidden">
              <div className="flex-1 min-h-0 overflow-auto">
                <TransactionList
                  onTransactionClick={handleTransactionClick}
                  roomId={roomId}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 min-h-0">
              <div className="bg-discord-secondary rounded-lg overflow-hidden border border-discord-divider">
                <KLineChart tokenAddress={selectedTokenAddress} />
              </div>

              <div className="bg-discord-secondary rounded-lg border border-discord-divider flex flex-col overflow-hidden">
                <div className="flex-1 min-h-0 overflow-auto">
                  <TokenStats tokenAddress={selectedTokenAddress} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-4 grid grid-rows-2 gap-4 min-h-0">
            <div className="bg-discord-secondary rounded-lg border border-discord-divider overflow-hidden">
              <div className="h-full overflow-auto">
                <WalletInfo
                  walletAddress={selectedWalletAddress}
                  onTokenSelect={handleWalletTokenClick}
                />
              </div>
            </div>

            <div className="bg-discord-secondary rounded-lg border border-discord-divider overflow-hidden">
              <div className="h-full overflow-auto">
                <TradeBox tokenAddress={selectedTokenAddress} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
