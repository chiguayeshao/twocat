'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import TradeBox from '@/components/trade/TradeBox';
import { TransactionList } from '@/components/transactions/TransactionList';
import { KLineChart } from '@/components/charts/KLineChart';
import { fetchRoomInfo, Room } from '@/api/twocat-core/room';
import { TokenStats } from '@/components/token/TokenStats';

export function BaseLayout({ children }: { children: React.ReactNode }) {
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<
    string | null
  >(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoomInfo = async () => {
      try {
        const roomData = await fetchRoomInfo('6738a22ba1a70d5fd0d14f29');
        setRoom(roomData);
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
    setSelectedTokenAddress(tokenAddress);
  };

  return (
    <div className="flex h-screen bg-discord-primary text-white overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header room={room} loading={loading} />

        <main className="flex-1 grid grid-cols-12 gap-4 p-4 min-h-0 overflow-auto">
          <div className="col-span-8 grid grid-rows-[2fr,1fr] gap-4 min-h-0">
            <div className="bg-discord-secondary rounded-lg flex flex-col border border-discord-divider min-h-0 overflow-hidden">
              <div className="flex-1 min-h-0 overflow-auto">
                <TransactionList onTransactionClick={handleTransactionClick} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 min-h-0">
              <div className="bg-discord-secondary rounded-lg overflow-hidden border border-discord-divider">
                <KLineChart tokenAddress={selectedTokenAddress} />
              </div>

              <div className="bg-discord-secondary rounded-lg border border-discord-divider flex flex-col overflow-hidden">
                <div className="flex-1 min-h-0 overflow-auto">
                  <TokenStats
                    tokenAddress={
                      'CBdCxKo9QavR9hfShgpEBG3zekorAeD7W1jfq2o3pump'
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-4 grid grid-rows-2 gap-4 min-h-0">
            <div className="bg-discord-secondary rounded-lg p-4 border border-discord-divider overflow-hidden">
              <h3 className="text-lg font-medium mb-2">address info</h3>
              <div className="h-[calc(100%-2rem)] overflow-auto">
                {/* 地址信息内容 */}
              </div>
            </div>

            <div className="bg-discord-secondary rounded-lg p-4 border border-discord-divider overflow-hidden">
              <h3 className="text-lg font-medium mb-2">交易</h3>
              <div className="h-[calc(100%-2rem)] overflow-auto">
                <TradeBox
                  tokenAddress={'CBdCxKo9QavR9hfShgpEBG3zekorAeD7W1jfq2o3pump'}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
