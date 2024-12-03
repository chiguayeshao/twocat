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
import { ContentType } from '@/types/content';
import { CommunityHome } from '../content/CommunityHome';
import { ChineseTweets } from '@/components/content/ChineseTweets';
import { EnglishTweets } from '../content/EnglishTweets';
import { BoostAddresses } from '../content/BoostAddresses';
import { MemeGallery } from '../content/MemeGallery';
import { TweetMonitor } from '../content/TweetMonitor';

interface BaseLayoutProps {
  children: React.ReactNode;
  roomId: string;
}

export function BaseLayout({ children, roomId }: BaseLayoutProps) {
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string | null>(null);
  const [selectedWalletAddress, setSelectedWalletAddress] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeContent, setActiveContent] = useState<ContentType>(ContentType.QUICK_TRADE);

  const handleTransactionClick = (walletAddress: string, tokenAddress: string) => {
    setSelectedWalletAddress(walletAddress);
    setSelectedTokenAddress(tokenAddress);
  };

  const handleWalletTokenClick = (tokenAddress: string) => {
    setSelectedTokenAddress(tokenAddress);
  };

  const renderContent = () => {
    switch (activeContent) {
      case ContentType.QUICK_TRADE:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3 md:gap-4">
            {/* 交易列表 */}
            <div className="lg:col-span-8 space-y-2 sm:space-y-3 md:space-y-4">
              {/* 交易列表 */}
              <div className="bg-discord-secondary rounded-lg border border-discord-divider">
                <div className="
                  h-[calc(50vh-3.5rem)] 
                  sm:h-[calc(55vh-3.5rem)] 
                  md:h-[calc(60vh-3.5rem)] 
                  lg:h-[calc(66vh-1rem)] 
                  overflow-y-auto custom-scrollbar
                ">
                  <TransactionList
                    onTransactionClick={handleTransactionClick}
                    roomId={roomId}
                  />
                </div>
              </div>

              {/* K线图和代币信息 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                {/* K线图 */}
                <div className="bg-discord-secondary rounded-lg border border-discord-divider">
                  <div className="
                    h-[200px] 
                    sm:h-[250px] 
                    md:h-[280px] 
                    lg:h-[300px] 
                    overflow-hidden
                  ">
                    <KLineChart tokenAddress={selectedTokenAddress} />
                  </div>
                </div>

                {/* 代币信息 */}
                <div className="bg-discord-secondary rounded-lg border border-discord-divider">
                  <div className="
                    h-[200px] 
                    sm:h-[250px] 
                    md:h-[280px] 
                    lg:h-[300px] 
                    overflow-y-auto custom-scrollbar
                  ">
                    <TokenStats tokenAddress={selectedTokenAddress} />
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧区域 */}
            <div className="
              lg:col-span-4 
              grid grid-cols-1 
              xs:grid-cols-2 
              sm:grid-cols-2 
              lg:grid-cols-1 
              gap-2 
              sm:gap-3 
              md:gap-4
            ">
              {/* 钱包信息 */}
              <div className="bg-discord-secondary rounded-lg border border-discord-divider">
                <div className="
                  h-[250px] 
                  xs:h-[280px] 
                  sm:h-[300px] 
                  md:h-[350px] 
                  lg:h-[400px] 
                  overflow-y-auto custom-scrollbar
                ">
                  <WalletInfo
                    walletAddress={selectedWalletAddress}
                    onTokenSelect={handleWalletTokenClick}
                  />
                </div>
              </div>

              {/* 交易框 */}
              <div className="bg-discord-secondary rounded-lg border border-discord-divider">
                <div className="
                  h-[250px] 
                  xs:h-[280px] 
                  sm:h-[300px] 
                  md:h-[350px] 
                  lg:h-[400px] 
                  overflow-y-auto custom-scrollbar
                ">
                  <TradeBox tokenAddress={selectedTokenAddress} />
                </div>
              </div>
            </div>
          </div>
        );
      case ContentType.COMMUNITY_HOME:
        console.log('Rendering Community Home');
        return <CommunityHome roomId={roomId} />;
      case ContentType.CHINESE_TWEETS:
        console.log('Rendering Chinese Tweets');
        return <ChineseTweets />;
      case ContentType.ENGLISH_TWEETS:
        console.log('Rendering English Tweets');
        return <EnglishTweets />;
      case ContentType.BOOST_ADDRESSES:
        console.log('Rendering Boost Addresses');
        return <BoostAddresses />;
      case ContentType.MEME_GALLERY:
        console.log('Rendering Meme Gallery');
        return <MemeGallery />;
      case ContentType.TWEET_MONITOR:
        console.log('Rendering Tweet Monitor');
        return <TweetMonitor />;
      default:
        console.log('Unknown content type:', activeContent);
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-discord-primary text-white overflow-hidden">
      {/* 移动端遮罩 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 侧边栏容器 */}
      <div
        className={cn(
          // 基础样式
          "w-[280px] lg:w-60 shrink-0",
          // 移动端样式
          "fixed lg:relative inset-y-0 left-0 z-[999]",
          "transform transition-transform duration-200 ease-in-out",
          // 控制显示/隐藏
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <Sidebar
          roomId={roomId}
          activeContent={activeContent}
          onContentChange={setActiveContent}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 移动端顶部导航栏 */}
        <div className="sticky top-0 z-[997] lg:hidden bg-discord-secondary/95 backdrop-blur-sm px-4 h-14 flex items-center border-b border-discord-divider">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-discord-hover rounded-md transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 font-semibold">Two Cat</span>
        </div>

        <Header onTokenSelect={setSelectedTokenAddress} />

        {/* 主要内容区域 */}
        <main className="flex-1 p-2 sm:p-3 md:p-4 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
