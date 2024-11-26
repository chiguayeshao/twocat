'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import TradeBox from '@/components/trade/TradeBox';
import { TransactionList } from '@/components/transactions/TransactionList';
import { KLineChart } from '@/components/charts/KLineChart';
import { TokenStats } from '@/components/token/TokenStats';
import { WalletInfo } from '@/components/wallet/WalletInfo';

interface BaseLayoutProps {
  children: React.ReactNode;
  roomId: string;
}

export function BaseLayout({ children, roomId }: BaseLayoutProps) {
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string | null>(null);
  const [selectedWalletAddress, setSelectedWalletAddress] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTransactionClick = (walletAddress: string, tokenAddress: string) => {
    setSelectedWalletAddress(walletAddress);
    setSelectedTokenAddress(tokenAddress);
  };

  const handleWalletTokenClick = (tokenAddress: string) => {
    setSelectedTokenAddress(tokenAddress);
  };

  return (
    <div className="flex h-screen bg-discord-primary text-white overflow-hidden">
      {/* 移动端侧边栏遮罩 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-200 ease-in-out lg:relative lg:transform-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <Sidebar
          roomId={roomId}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 顶部导航 */}
        <div className="flex items-center lg:hidden bg-discord-secondary/50 px-4 h-14">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-discord-hover rounded-md transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <Header onTokenSelect={setSelectedTokenAddress} />

        {/* 主要内容区域 */}
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* 左侧区域 */}
            <div className="lg:col-span-8 space-y-4">
              {/* 交易列表 */}
              <div className="bg-discord-secondary rounded-lg border border-discord-divider">
                <div className="h-[calc(66vh-theme(spacing.14)-theme(spacing.4))] lg:h-[calc(66vh-theme(spacing.4))] overflow-y-auto">
                  <TransactionList
                    onTransactionClick={handleTransactionClick}
                    roomId={roomId}
                  />
                </div>
              </div>

              {/* K线图和代币信息 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* K线图 */}
                <div className="bg-discord-secondary rounded-lg border border-discord-divider">
                  <div className="h-[250px] sm:h-[300px] overflow-y-auto">
                    <KLineChart tokenAddress={selectedTokenAddress} />
                  </div>
                </div>

                {/* 代币信息 */}
                <div className="bg-discord-secondary rounded-lg border border-discord-divider">
                  <div className="h-[250px] sm:h-[300px] overflow-y-auto">
                    <TokenStats tokenAddress={selectedTokenAddress} />
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧区域 */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* 钱包信息 */}
              <div className="bg-discord-secondary rounded-lg border border-discord-divider">
                <div className="h-[300px] sm:h-[350px] lg:h-[400px] overflow-y-auto">
                  <WalletInfo
                    walletAddress={selectedWalletAddress}
                    onTokenSelect={handleWalletTokenClick}
                  />
                </div>
              </div>

              {/* 交易框 */}
              <div className="bg-discord-secondary rounded-lg border border-discord-divider">
                <div className="h-[300px] sm:h-[350px] lg:h-[400px] overflow-y-auto">
                  <TradeBox tokenAddress={selectedTokenAddress} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
