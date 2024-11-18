'use client';

import { useEffect, useState } from 'react';
import { formatNumber, formatPercent, formatUSD } from '@/lib/utils';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface TokenStatsProps {
  tokenAddress: string | null;
}

interface TokenInfo {
  symbol: string;
  name: string;
  price: number;
  logoURI: string;
  priceChange1m: number;
  priceChange5m: number;
  priceChange1h: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  buy24h: number;
  buyVolume24h: number;
  sell24h: number;
  sellVolume24h: number;
  netBuyVolume24h: number;
  top10HolderPercent: number;
  totalHolders: number;
  isToken2022: boolean;
  transferFeeEnable: boolean | null;
  freezeable: boolean | null;
  extensions: {
    website?: string;
    twitter?: string;
    discord?: string;
  } | null;
  numberMarkets: number;
  history30mPrice: number;
  priceChange30mPercent: number;
  v30mUSD: number;
  trade30m: number;
  buy30m: number;
  sell30m: number;
  vBuy30mUSD: number;
  vSell30mUSD: number;
  uniqueWallet30m: number;
  uniqueWallet30mChangePercent: number;
  v30m: number;
  v30mChangePercent: number;
  trade30mChangePercent: number;
  history1hPrice: number;
  v1h: number;
  v1hUSD: number;
  v1hChangePercent: number;
  trade1h: number;
  trade1hChangePercent: number;
  buy1h: number;
  sell1h: number;
  vBuy1hUSD: number;
  vSell1hUSD: number;
  uniqueWallet1h: number;
  uniqueWallet1hChangePercent: number;
  history24hPrice: number;
  v24h: number;
  v24hChangePercent: number;
  trade24h: number;
  trade24hChangePercent: number;
  uniqueWallet24h: number;
  uniqueWallet24hChangePercent: number;
  v24hUSD: number;
  history2hPrice: number;
  priceChange2hPercent: number;
  v2h: number;
  v2hUSD: number;
  v2hChangePercent: number;
  trade2h: number;
  trade2hChangePercent: number;
  buy2h: number;
  sell2h: number;
  vBuy2hUSD: number;
  vSell2hUSD: number;
  uniqueWallet2h: number;
  uniqueWallet2hChangePercent: number;
  history4hPrice: number;
  priceChange4hPercent: number;
  v4h: number;
  v4hUSD: number;
  v4hChangePercent: number;
  trade4h: number;
  trade4hChangePercent: number;
  buy4h: number;
  sell4h: number;
  vBuy4hUSD: number;
  vSell4hUSD: number;
  uniqueWallet4h: number;
  uniqueWallet4hChangePercent: number;
  history8hPrice: number;
  priceChange8hPercent: number;
  v8h: number;
  v8hUSD: number;
  v8hChangePercent: number;
  trade8h: number;
  trade8hChangePercent: number;
  buy8h: number;
  sell8h: number;
  vBuy8hUSD: number;
  vSell8hUSD: number;
  uniqueWallet8h: number;
  uniqueWallet8hChangePercent: number;
}

interface TimeFrameData {
  price: number;
  priceChange: number;
  volume: number;
  volumeUSD: number;
  volumeChange: number;
  trades: number;
  tradesChange: number;
  buys: number;
  sells: number;
  buyVolume: number;
  sellVolume: number;
  uniqueWallets: number;
  walletChange: number;
  highPrice: number;
  lowPrice: number;
}


// 添加一个缩写地址的辅助函数
function shortenAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function TokenStats({ tokenAddress }: TokenStatsProps) {
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [selectedTime, setSelectedTime] = useState<'30m' | '1h' | '2h' | '4h' | '8h' | '24h'>('24h');
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const [overviewRes, securityRes] = await Promise.all([
          fetch(`/api/birdeye/token-overview?address=${tokenAddress}`),
          fetch(`/api/birdeye/token-security?address=${tokenAddress}`),
        ]);

        const overview = await overviewRes.json();
        const security = await securityRes.json();

        setTokenInfo({
          symbol: overview.data.symbol,
          name: overview.data.name,
          price: overview.data.price,
          logoURI: overview.data.logoURI,

          priceChange1m: overview.data.priceChange30mPercent / 2,
          priceChange5m: overview.data.priceChange30mPercent,
          priceChange1h: overview.data.priceChange1hPercent,
          priceChange24h: overview.data.priceChange24hPercent,

          volume24h: overview.data.v24hUSD,
          liquidity: overview.data.liquidity,
          marketCap: overview.data.mc,

          buy24h: overview.data.buy24h,
          buyVolume24h: overview.data.vBuy24hUSD,
          sell24h: overview.data.sell24h,
          sellVolume24h: overview.data.vSell24hUSD,
          netBuyVolume24h: overview.data.vBuy24hUSD - overview.data.vSell24hUSD,

          top10HolderPercent: security.data.top10HolderPercent * 100,
          totalHolders: overview.data.holder,
          isToken2022: security.data.isToken2022,
          transferFeeEnable: security.data.transferFeeEnable,
          freezeable: security.data.freezeable,

          extensions: overview.data.extensions,
          numberMarkets: overview.data.numberMarkets,

          history30mPrice: overview.data.history30mPrice,
          priceChange30mPercent: overview.data.priceChange30mPercent,
          v30mUSD: overview.data.v30mUSD,
          trade30m: overview.data.trade30m,
          buy30m: overview.data.buy30m,
          sell30m: overview.data.sell30m,
          vBuy30mUSD: overview.data.vBuy30mUSD,
          vSell30mUSD: overview.data.vSell30mUSD,
          uniqueWallet30m: overview.data.uniqueWallet30m,
          uniqueWallet30mChangePercent:
            overview.data.uniqueWallet30mChangePercent,

          v30m: overview.data.v30m,
          v30mChangePercent: overview.data.v30mChangePercent,
          trade30mChangePercent: overview.data.trade30mChangePercent,
          history1hPrice: overview.data.history1hPrice,
          v1h: overview.data.v1h,
          v1hUSD: overview.data.v1hUSD,
          v1hChangePercent: overview.data.v1hChangePercent,
          trade1h: overview.data.trade1h,
          trade1hChangePercent: overview.data.trade1hChangePercent,
          buy1h: overview.data.buy1h,
          sell1h: overview.data.sell1h,
          vBuy1hUSD: overview.data.vBuy1hUSD,
          vSell1hUSD: overview.data.vSell1hUSD,
          uniqueWallet1h: overview.data.uniqueWallet1h,
          uniqueWallet1hChangePercent:
            overview.data.uniqueWallet1hChangePercent,
          history24hPrice: overview.data.history24hPrice,
          v24h: overview.data.v24h,
          v24hChangePercent: overview.data.v24hChangePercent,
          trade24h: overview.data.trade24h,
          trade24hChangePercent: overview.data.trade24hChangePercent,
          uniqueWallet24h: overview.data.uniqueWallet24h,
          uniqueWallet24hChangePercent:
            overview.data.uniqueWallet24hChangePercent,
          v24hUSD: overview.data.v24hUSD,

          history2hPrice: overview.data.history2hPrice,
          priceChange2hPercent: overview.data.priceChange2hPercent,
          v2h: overview.data.v2h,
          v2hUSD: overview.data.v2hUSD,
          v2hChangePercent: overview.data.v2hChangePercent,
          trade2h: overview.data.trade2h,
          trade2hChangePercent: overview.data.trade2hChangePercent,
          buy2h: overview.data.buy2h,
          sell2h: overview.data.sell2h,
          vBuy2hUSD: overview.data.vBuy2hUSD,
          vSell2hUSD: overview.data.vSell2hUSD,
          uniqueWallet2h: overview.data.uniqueWallet2h,
          uniqueWallet2hChangePercent:
            overview.data.uniqueWallet2hChangePercent,

          history4hPrice: overview.data.history4hPrice,
          priceChange4hPercent: overview.data.priceChange4hPercent,
          v4h: overview.data.v4h,
          v4hUSD: overview.data.v4hUSD,
          v4hChangePercent: overview.data.v4hChangePercent,
          trade4h: overview.data.trade4h,
          trade4hChangePercent: overview.data.trade4hChangePercent,
          buy4h: overview.data.buy4h,
          sell4h: overview.data.sell4h,
          vBuy4hUSD: overview.data.vBuy4hUSD,
          vSell4hUSD: overview.data.vSell4hUSD,
          uniqueWallet4h: overview.data.uniqueWallet4h,
          uniqueWallet4hChangePercent:
            overview.data.uniqueWallet4hChangePercent,

          history8hPrice: overview.data.history8hPrice,
          priceChange8hPercent: overview.data.priceChange8hPercent,
          v8h: overview.data.v8h,
          v8hUSD: overview.data.v8hUSD,
          v8hChangePercent: overview.data.v8hChangePercent,
          trade8h: overview.data.trade8h,
          trade8hChangePercent: overview.data.trade8hChangePercent,
          buy8h: overview.data.buy8h,
          sell8h: overview.data.sell8h,
          vBuy8hUSD: overview.data.vBuy8hUSD,
          vSell8hUSD: overview.data.vSell8hUSD,
          uniqueWallet8h: overview.data.uniqueWallet8h,
          uniqueWallet8hChangePercent:
            overview.data.uniqueWallet8hChangePercent,
        });
      } catch (error) {
        console.error('Failed to fetch token info:', error);
      } finally {
        setLoading(false);
      }
    }

    if (tokenAddress) {
      fetchData();
    }
  }, [tokenAddress]);

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center p-4">
        <div className="animate-pulse">加载中...</div>
      </div>
    );
  }

  if (!tokenInfo) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(tokenAddress || '');
      toast({
        title: '复制成功',
        description: '地址已复制到剪贴板',
        variant: 'success',
        className: 'dark:bg-green-900 dark:text-white',
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: '复制失败',
        description: '请重试',
        variant: 'destructive',
        className: 'dark:bg-red-900 dark:text-white',
        duration: 2000,
      });
    }
  }

  // 获取当前选中时间段的价格变化
  const getCurrentPriceChange = (info: TokenInfo, timeFrame: string): number => {
    switch (timeFrame) {
      case '30m':
        return info.priceChange30mPercent;
      case '1h':
        return info.priceChange1h;
      case '2h':
        return info.priceChange2hPercent;
      case '4h':
        return info.priceChange4hPercent;
      case '8h':
        return info.priceChange8hPercent;
      default:
        return info.priceChange24h;
    }
  };

  const timeOptions = [
    { value: '30m', label: '30分钟' },
    { value: '1h', label: '1小时' },
    { value: '2h', label: '2小时' },
    { value: '4h', label: '4小时' },
    { value: '8h', label: '8小时' },
    { value: '24h', label: '24小时' },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* 代币基本信息 */}
      <div className="flex items-center justify-between">
        {/* 代币图标和名称 */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-discord-primary/30 
                              flex items-center justify-center overflow-hidden">
            {tokenInfo.logoURI ? (
              <Image
                src={tokenInfo.logoURI}
                alt={tokenInfo.symbol}
                width={32}
                height={32}
                className="rounded-full w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <span className="text-sm text-gray-400">
                {tokenInfo.symbol?.[0] || '?'}
              </span>
            )}
          </div>
          <div>
            <div className="font-medium text-[#acc97e]">{tokenInfo.symbol}</div>
            <div className="text-xs text-gray-400">{tokenInfo.name}</div>
          </div>
        </div>

        {/* 价格信息 */}
        <div className="text-right">
          <div className="text-lg font-medium text-[#53b991]">
            ${tokenInfo.price.toFixed(4)}
          </div>
          <div className="text-xs text-gray-400">
            当前价格
          </div>
        </div>
      </div>

      {/* 时间选择器 */}
      <div className="flex gap-2 mb-4">
        {timeOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedTime === option.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTime(option.value as '30m' | '1h' | '2h' | '4h' | '8h' | '24h')}
            className={`${selectedTime === option.value
              ? 'bg-discord-primary text-white'
              : 'text-gray-400 hover:bg-discord-primary/30'
              }`}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* 统计数据卡片 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 交易数据卡片 */}
        <div className="bg-[#2f2f2f] rounded-lg p-4 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400">活跃钱包</span>
            <div className="text-right">
              <div className="text-[#acc97e]">
                {formatCompactNumber(getTimeFrameData(selectedTime, tokenInfo).uniqueWallets)}
              </div>
            </div>
          </div>

          {/* 买卖统计 */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#9ad499]">
                买入 ({formatCompactNumber(getTimeFrameData(selectedTime, tokenInfo).buys)}笔)
              </span>
              <span className="text-[#53b991]">
                ${formatCompactNumber(getTimeFrameData(selectedTime, tokenInfo).buyVolume)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#de5569]">
                卖出 ({formatCompactNumber(getTimeFrameData(selectedTime, tokenInfo).sells)}笔)
              </span>
              <span className="text-[#53b991]">
                ${formatCompactNumber(getTimeFrameData(selectedTime, tokenInfo).sellVolume)}
              </span>
            </div>
          </div>
        </div>

        {/* 价格数据卡片 */}
        <div className="bg-[#2f2f2f] rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">价格变化</span>
            {tokenInfo && (
              <div className={`text-right ${getCurrentPriceChange(tokenInfo, selectedTime) >= 0 ? 'text-[#9ad499]' : 'text-[#de5569]'}`}>
                {getCurrentPriceChange(tokenInfo, selectedTime) >= 0 ? '+' : ''}
                {getCurrentPriceChange(tokenInfo, selectedTime).toFixed(2)}%
              </div>
            )}
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">最高价</span>
              <span className="text-[#53b991]">
                ${getTimeFrameData(selectedTime, tokenInfo).highPrice.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">最低价</span>
              <span className="text-[#53b991]">
                ${getTimeFrameData(selectedTime, tokenInfo).lowPrice.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 社交链接 */}
      {tokenInfo.extensions && (
        <div className="bg-[#2f2f2f] rounded-lg p-4">
          <div className="text-gray-400 mb-2">相关链接</div>
          <div className="flex flex-wrap gap-2">
            {tokenInfo.extensions.website && (
              <a
                href={tokenInfo.extensions.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#53b991] hover:underline"
              >
                官网
              </a>
            )}
            {tokenInfo.extensions.twitter && (
              <a
                href={tokenInfo.extensions.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#53b991] hover:underline"
              >
                Twitter
              </a>
            )}
            {tokenInfo.extensions.discord && (
              <a
                href={tokenInfo.extensions.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#53b991] hover:underline"
              >
                Discord
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 添加一个新的格式化函数用于紧凑数字显示
function formatCompactNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toFixed(1);
}

// 辅助函数：获取指定时间段的数据
function getTimeFrameData(
  timeFrame: string,
  tokenInfo: TokenInfo
): TimeFrameData {
  switch (timeFrame) {
    case '30m':
      return {
        price: tokenInfo.history30mPrice,
        priceChange: tokenInfo.priceChange30mPercent,
        volume: tokenInfo.v30m,
        volumeUSD: tokenInfo.v30mUSD,
        volumeChange: tokenInfo.v30mChangePercent,
        trades: tokenInfo.trade30m,
        tradesChange: tokenInfo.trade30mChangePercent,
        buys: tokenInfo.buy30m,
        sells: tokenInfo.sell30m,
        buyVolume: tokenInfo.vBuy30mUSD,
        sellVolume: tokenInfo.vSell30mUSD,
        uniqueWallets: tokenInfo.uniqueWallet30m,
        walletChange: tokenInfo.uniqueWallet30mChangePercent,
        highPrice: tokenInfo.history30mPrice,
        lowPrice: tokenInfo.history30mPrice,
      };
    case '1h':
      return {
        price: tokenInfo.history1hPrice,
        priceChange: tokenInfo.priceChange1h,
        volume: tokenInfo.v1h,
        volumeUSD: tokenInfo.v1hUSD,
        volumeChange: tokenInfo.v1hChangePercent,
        trades: tokenInfo.trade1h,
        tradesChange: tokenInfo.trade1hChangePercent,
        buys: tokenInfo.buy1h,
        sells: tokenInfo.sell1h,
        buyVolume: tokenInfo.vBuy1hUSD,
        sellVolume: tokenInfo.vSell1hUSD,
        uniqueWallets: tokenInfo.uniqueWallet1h,
        walletChange: tokenInfo.uniqueWallet1hChangePercent,
        highPrice: tokenInfo.history1hPrice,
        lowPrice: tokenInfo.history1hPrice,
      };
    case '2h':
      return {
        price: tokenInfo.history2hPrice,
        priceChange: tokenInfo.priceChange2hPercent,
        volume: tokenInfo.v2h,
        volumeUSD: tokenInfo.v2hUSD,
        volumeChange: tokenInfo.v2hChangePercent,
        trades: tokenInfo.trade2h,
        tradesChange: tokenInfo.trade2hChangePercent,
        buys: tokenInfo.buy2h,
        sells: tokenInfo.sell2h,
        buyVolume: tokenInfo.vBuy2hUSD,
        sellVolume: tokenInfo.vSell2hUSD,
        uniqueWallets: tokenInfo.uniqueWallet2h,
        walletChange: tokenInfo.uniqueWallet2hChangePercent,
        highPrice: tokenInfo.history2hPrice,
        lowPrice: tokenInfo.history2hPrice,
      };
    case '4h':
      return {
        price: tokenInfo.history4hPrice,
        priceChange: tokenInfo.priceChange4hPercent,
        volume: tokenInfo.v4h,
        volumeUSD: tokenInfo.v4hUSD,
        volumeChange: tokenInfo.v4hChangePercent,
        trades: tokenInfo.trade4h,
        tradesChange: tokenInfo.trade4hChangePercent,
        buys: tokenInfo.buy4h,
        sells: tokenInfo.sell4h,
        buyVolume: tokenInfo.vBuy4hUSD,
        sellVolume: tokenInfo.vSell4hUSD,
        uniqueWallets: tokenInfo.uniqueWallet4h,
        walletChange: tokenInfo.uniqueWallet4hChangePercent,
        highPrice: tokenInfo.history4hPrice,
        lowPrice: tokenInfo.history4hPrice,
      };
    case '8h':
      return {
        price: tokenInfo.history8hPrice,
        priceChange: tokenInfo.priceChange8hPercent,
        volume: tokenInfo.v8h,
        volumeUSD: tokenInfo.v8hUSD,
        volumeChange: tokenInfo.v8hChangePercent,
        trades: tokenInfo.trade8h,
        tradesChange: tokenInfo.trade8hChangePercent,
        buys: tokenInfo.buy8h,
        sells: tokenInfo.sell8h,
        buyVolume: tokenInfo.vBuy8hUSD,
        sellVolume: tokenInfo.vSell8hUSD,
        uniqueWallets: tokenInfo.uniqueWallet8h,
        walletChange: tokenInfo.uniqueWallet8hChangePercent,
        highPrice: tokenInfo.history8hPrice,
        lowPrice: tokenInfo.history8hPrice,
      };
    default:
      return {
        price: tokenInfo.history24hPrice,
        priceChange: tokenInfo.priceChange24h,
        volume: tokenInfo.v24h,
        volumeUSD: tokenInfo.v24hUSD,
        volumeChange: tokenInfo.v24hChangePercent,
        trades: tokenInfo.trade24h,
        tradesChange: tokenInfo.trade24hChangePercent,
        buys: tokenInfo.buy24h,
        sells: tokenInfo.sell24h,
        buyVolume: tokenInfo.buyVolume24h,
        sellVolume: tokenInfo.sellVolume24h,
        uniqueWallets: tokenInfo.uniqueWallet24h,
        walletChange: tokenInfo.uniqueWallet24hChangePercent,
        highPrice: tokenInfo.history24hPrice,
        lowPrice: tokenInfo.history24hPrice,
      };
  }
}
