'use client';

import { useEffect, useState } from 'react';
import { formatNumber, formatPercent, formatUSD } from '@/lib/utils';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TokenStatsProps {
  tokenAddress: string;
}

interface TokenInfo {
  // 基础信息
  symbol: string;
  name: string;
  price: number;
  logoURI: string;

  // 价格变化
  priceChange1m: number;
  priceChange5m: number;
  priceChange1h: number;
  priceChange24h: number;

  // 交易数据
  volume24h: number;
  liquidity: number;
  marketCap: number;

  // 买卖压力
  buy24h: number;
  buyVolume24h: number;
  sell24h: number;
  sellVolume24h: number;
  netBuyVolume24h: number;

  // 安全信息
  top10HolderPercent: number;
  totalHolders: number;
  isToken2022: boolean;
  transferFeeEnable: boolean | null;
  freezeable: boolean | null;

  // 社交链接
  extensions: {
    website: string;
    twitter: string;
    discord: string;
  } | null;

  // 市场排名
  numberMarkets: number;

  // 历史数据
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

  // 添加缺失的属性
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

  // 2h data
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

  // 4h data
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

  // 8h data
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
}

// 添加一个缩写地址的辅助函数
function shortenAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function TokenStats({ tokenAddress }: TokenStatsProps) {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState('30m');
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
      await navigator.clipboard.writeText(tokenAddress);
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

  return (
    <div className="flex flex-col h-full">
      {/* 顶部基础信息 */}
      <div className="flex-shrink-0 p-3 border-b border-gray-800">
        <div className="flex items-center space-x-3 mb-2">
          <img
            src={tokenInfo.logoURI}
            alt={tokenInfo.symbol}
            className="w-9 h-9 rounded-full ring-1 ring-gray-700"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold truncate flex items-center gap-2">
              {tokenInfo.symbol}
              <span className="text-xs text-gray-400">
                #{formatNumber(tokenInfo.numberMarkets)}
              </span>
              <button
                onClick={() => handleCopy()}
                className="flex items-center gap-1 px-1.5 py-0.5 text-xs text-gray-400 hover:text-gray-300 bg-gray-800/50 rounded-full"
              >
                {shortenAddress(tokenAddress)}
                <Copy className="w-3 h-3" />
              </button>
            </h2>
            <p className="text-xs text-gray-400 truncate">{tokenInfo.name}</p>
          </div>
          <div className="text-right">
            <div className="text-base font-bold">
              ${formatNumber(tokenInfo.price)}
            </div>
            <div
              className={`text-xs font-medium
              ${
                tokenInfo.priceChange24h >= 0
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {tokenInfo.priceChange24h >= 0 ? '↑' : '↓'}{' '}
              {formatPercent(tokenInfo.priceChange24h)}%
            </div>
          </div>
        </div>

        {/* 市场概览 */}
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-400">市值</span>
            <span className="font-medium">
              ${formatCompactNumber(tokenInfo.marketCap)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">24h成交</span>
            <span className="font-medium">
              ${formatCompactNumber(tokenInfo.volume24h)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">流动性</span>
            <span className="font-medium">
              ${formatCompactNumber(tokenInfo.liquidity)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400">持有人</span>
            <span className="font-medium">
              {formatCompactNumber(tokenInfo.totalHolders)}
            </span>
          </div>
        </div>
      </div>

      {/* 时间维度分析 */}
      <div className="flex-1 overflow-auto">
        <div className="p-2 space-y-2">
          {/* 时间选择器 */}
          <div className="flex gap-1 text-sm border-b border-gray-800 pb-2">
            {['30m', '1h', '2h', '4h', '8h', '24h'].map((time) => (
              <button
                key={time}
                className={`px-2 py-1 rounded ${
                  selectedTime === time
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-gray-400'
                }`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>

          {/* 交易数据 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 border border-gray-800 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">交易概览</div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">成交额</span>
                  <div className="text-right">
                    <div>
                      $
                      {formatCompactNumber(
                        getTimeFrameData(selectedTime, tokenInfo).volumeUSD
                      )}
                    </div>
                    <div
                      className={`text-[10px] ${
                        getTimeFrameData(selectedTime, tokenInfo)
                          .volumeChange >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {formatPercent(
                        getTimeFrameData(selectedTime, tokenInfo).volumeChange
                      )}
                      %
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">交易笔数</span>
                  <div className="text-right">
                    <div>
                      {formatCompactNumber(
                        getTimeFrameData(selectedTime, tokenInfo).trades
                      )}
                    </div>
                    <div
                      className={`text-[10px] ${
                        getTimeFrameData(selectedTime, tokenInfo)
                          .tradesChange >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {formatPercent(
                        getTimeFrameData(selectedTime, tokenInfo).tradesChange
                      )}
                      %
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">活跃钱包</span>
                  <div className="text-right">
                    <div>
                      {formatCompactNumber(
                        getTimeFrameData(selectedTime, tokenInfo).uniqueWallets
                      )}
                    </div>
                    <div
                      className={`text-[10px] ${
                        getTimeFrameData(selectedTime, tokenInfo)
                          .walletChange >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {formatPercent(
                        getTimeFrameData(selectedTime, tokenInfo).walletChange
                      )}
                      %
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2 border border-gray-800 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">买卖压力</div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-400">
                    买入 (
                    {formatCompactNumber(
                      getTimeFrameData(selectedTime, tokenInfo).buys
                    )}
                    笔)
                  </span>
                  <span>
                    $
                    {formatCompactNumber(
                      getTimeFrameData(selectedTime, tokenInfo).buyVolume
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-400">
                    卖出 (
                    {formatCompactNumber(
                      getTimeFrameData(selectedTime, tokenInfo).sells
                    )}
                    笔)
                  </span>
                  <span>
                    $
                    {formatCompactNumber(
                      getTimeFrameData(selectedTime, tokenInfo).sellVolume
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-800">
                  <span className="text-gray-400">净买入</span>
                  <span
                    className={
                      getTimeFrameData(selectedTime, tokenInfo).buyVolume -
                        getTimeFrameData(selectedTime, tokenInfo).sellVolume >=
                      0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }
                  >
                    $
                    {formatCompactNumber(
                      getTimeFrameData(selectedTime, tokenInfo).buyVolume -
                        getTimeFrameData(selectedTime, tokenInfo).sellVolume
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 社交链接 */}
          {tokenInfo.extensions && (
            <div className="text-sm p-2 border border-gray-800 rounded-lg">
              <div className="text-gray-400 mb-2">相关链接</div>
              <div className="flex flex-wrap gap-2">
                {tokenInfo.extensions.website && (
                  <a
                    href={tokenInfo.extensions.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    官网
                  </a>
                )}
                {tokenInfo.extensions.twitter && (
                  <a
                    href={tokenInfo.extensions.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Twitter
                  </a>
                )}
                {tokenInfo.extensions.discord && (
                  <a
                    href={tokenInfo.extensions.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Discord
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
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
      };
  }
}
