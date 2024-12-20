'use client';

import { useEffect, useState } from 'react';
import { formatNumber, formatPercent, formatUSD } from '@/lib/utils';
import { Copy, Info, Check, BarChart3, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  creatorPercentage: number;
  top10HolderPercent: number;
  totalHolders: number;
  isToken2022: boolean;
  transferFeeEnable: boolean | null;
  freezeable: boolean | null;
  nonTransferable: boolean | null;
  extensions: {
    website?: string;
    twitter?: string;
    telegram?: string;
    description?: string;
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
  buyHistory24h: number;
  sellHistory24h: number;
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

// 添加一个函数来计算安全得分
const calculateSecurityScore = (tokenInfo: TokenInfo) => {
  let score = 0;
  // 黑名单检查
  if (tokenInfo.freezeable === null) score++;
  // 转账费检查
  if (tokenInfo.transferFeeEnable === null) score++;
  // 貔貅盘检查
  if (tokenInfo.nonTransferable === null) score++;
  return score;
};

// 添加骨架屏组件
const TokenStatsSkeleton = () => (
  <div className="p-4 space-y-4">
    {/* 代币基本信息骨架屏 */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full bg-gray-500/20" />
        <div>
          <Skeleton className="h-5 w-20 bg-gray-500/20 mb-1" />
          <Skeleton className="h-4 w-32 bg-gray-500/20" />
        </div>
      </div>
      <div className="text-right">
        <Skeleton className="h-6 w-32 bg-gray-500/20 mb-1" />
        <Skeleton className="h-4 w-20 bg-gray-500/20" />
      </div>
    </div>

    {/* 时间选择器和安全信息骨架屏 */}
    <div className="flex items-center justify-between bg-[#2f2f2f] rounded-lg p-2">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-8 w-16 bg-gray-500/20" />
        ))}
      </div>
      <div className="flex gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <Skeleton className="h-4 w-16 bg-gray-500/20 mb-1" />
            <Skeleton className="h-4 w-12 bg-gray-500/20" />
          </div>
        ))}
      </div>
    </div>

    {/* 市值等信息骨架屏 */}
    <div className="bg-[#2f2f2f] rounded-lg p-2">
      <div className="flex items-center divide-x divide-gray-700">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 px-3 first:pl-0 last:pr-0">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-12 bg-gray-500/20" />
              <Skeleton className="h-4 w-20 bg-gray-500/20" />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 买入卖出钱包数量骨架屏 */}
    <div className="bg-[#2f2f2f] rounded-lg p-2">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-12 bg-gray-500/20" />
        <Skeleton className="h-4 w-20 bg-gray-500/20" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-12 bg-gray-500/20" />
        <Skeleton className="h-4 w-20 bg-gray-500/20" />
      </div>
    </div>
  </div>
);

export function TokenStats({ tokenAddress }: TokenStatsProps) {
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [selectedTime, setSelectedTime] = useState<'30m' | '1h' | '2h'>('30m');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  // 将所有 useEffect 放在其他 hooks 之后，条件判断之前
  useEffect(() => {
    async function fetchData() {
      if (!tokenAddress) return;

      setLoading(true);
      try {
        const [overviewRes, securityRes] = await Promise.all([
          fetch(`/api/twocat-core/token-overview?address=${tokenAddress}`),
          fetch(`/api/twocat-core/token-security?address=${tokenAddress}`),
        ]);

        if (!overviewRes.ok || !securityRes.ok) {
          throw new Error(`HTTP error! status: ${overviewRes.status} ${securityRes.status}`);
        }

        const overviewData = await overviewRes.json();
        const securityData = await securityRes.json();

        setTokenInfo({
          symbol: overviewData.data.symbol,
          name: overviewData.data.name,
          price: overviewData.data.price,
          logoURI: overviewData.data.logoURI,

          priceChange1m: overviewData.data.priceChange30mPercent / 2,
          priceChange5m: overviewData.data.priceChange30mPercent,
          priceChange1h: overviewData.data.priceChange1hPercent,
          priceChange24h: overviewData.data.priceChange24hPercent,

          volume24h: overviewData.data.v24hUSD,
          liquidity: overviewData.data.liquidity,
          marketCap: overviewData.data.mc,

          buy24h: overviewData.data.buy24h,
          buyVolume24h: overviewData.data.vBuy24hUSD,
          sell24h: overviewData.data.sell24h,
          sellVolume24h: overviewData.data.vSell24hUSD,
          netBuyVolume24h: overviewData.data.vBuy24hUSD - overviewData.data.vSell24hUSD,

          creatorPercentage: securityData.data.creatorPercentage * 100,
          top10HolderPercent: securityData.data.top10HolderPercent * 100,
          totalHolders: overviewData.data.holder,
          isToken2022: securityData.data.isToken2022,
          transferFeeEnable: securityData.data.transferFeeEnable,
          freezeable: securityData.data.freezeable,
          nonTransferable: securityData.data.nonTransferable,

          extensions: overviewData.data.extensions,
          numberMarkets: overviewData.data.numberMarkets,

          history30mPrice: overviewData.data.history30mPrice,
          priceChange30mPercent: overviewData.data.priceChange30mPercent,
          v30mUSD: overviewData.data.v30mUSD,
          trade30m: overviewData.data.trade30m,
          buy30m: overviewData.data.buy30m,
          sell30m: overviewData.data.sell30m,
          vBuy30mUSD: overviewData.data.vBuy30mUSD,
          vSell30mUSD: overviewData.data.vSell30mUSD,
          uniqueWallet30m: overviewData.data.uniqueWallet30m,
          uniqueWallet30mChangePercent:
            overviewData.data.uniqueWallet30mChangePercent,

          v30m: overviewData.data.v30m,
          v30mChangePercent: overviewData.data.v30mChangePercent,
          trade30mChangePercent: overviewData.data.trade30mChangePercent,
          history1hPrice: overviewData.data.history1hPrice,
          v1h: overviewData.data.v1h,
          v1hUSD: overviewData.data.v1hUSD,
          v1hChangePercent: overviewData.data.v1hChangePercent,
          trade1h: overviewData.data.trade1h,
          trade1hChangePercent: overviewData.data.trade1hChangePercent,
          buy1h: overviewData.data.buy1h,
          sell1h: overviewData.data.sell1h,
          vBuy1hUSD: overviewData.data.vBuy1hUSD,
          vSell1hUSD: overviewData.data.vSell1hUSD,
          uniqueWallet1h: overviewData.data.uniqueWallet1h,
          uniqueWallet1hChangePercent:
            overviewData.data.uniqueWallet1hChangePercent,
          history24hPrice: overviewData.data.history24hPrice,
          v24h: overviewData.data.v24h,
          v24hChangePercent: overviewData.data.v24hChangePercent,
          trade24h: overviewData.data.trade24h,
          trade24hChangePercent: overviewData.data.trade24hChangePercent,
          uniqueWallet24h: overviewData.data.uniqueWallet24h,
          uniqueWallet24hChangePercent:
            overviewData.data.uniqueWallet24hChangePercent,
          v24hUSD: overviewData.data.v24hUSD,

          buyHistory24h: overviewData.data.buy24h,
          sellHistory24h: overviewData.data.sell24h,

          history2hPrice: overviewData.data.history2hPrice,
          priceChange2hPercent: overviewData.data.priceChange2hPercent,
          v2h: overviewData.data.v2h,
          v2hUSD: overviewData.data.v2hUSD,
          v2hChangePercent: overviewData.data.v2hChangePercent,
          trade2h: overviewData.data.trade2h,
          trade2hChangePercent: overviewData.data.trade2hChangePercent,
          buy2h: overviewData.data.buy2h,
          sell2h: overviewData.data.sell2h,
          vBuy2hUSD: overviewData.data.vBuy2hUSD,
          vSell2hUSD: overviewData.data.vSell2hUSD,
          uniqueWallet2h: overviewData.data.uniqueWallet2h,
          uniqueWallet2hChangePercent:
            overviewData.data.uniqueWallet2hChangePercent,

          history4hPrice: overviewData.data.history4hPrice,
          priceChange4hPercent: overviewData.data.priceChange4hPercent,
          v4h: overviewData.data.v4h,
          v4hUSD: overviewData.data.v4hUSD,
          v4hChangePercent: overviewData.data.v4hChangePercent,
          trade4h: overviewData.data.trade4h,
          trade4hChangePercent: overviewData.data.trade4hChangePercent,
          buy4h: overviewData.data.buy4h,
          sell4h: overviewData.data.sell4h,
          vBuy4hUSD: overviewData.data.vBuy4hUSD,
          vSell4hUSD: overviewData.data.vSell4hUSD,
          uniqueWallet4h: overviewData.data.uniqueWallet4h,
          uniqueWallet4hChangePercent:
            overviewData.data.uniqueWallet4hChangePercent,

          history8hPrice: overviewData.data.history8hPrice,
          priceChange8hPercent: overviewData.data.priceChange8hPercent,
          v8h: overviewData.data.v8h,
          v8hUSD: overviewData.data.v8hUSD,
          v8hChangePercent: overviewData.data.v8hChangePercent,
          trade8h: overviewData.data.trade8h,
          trade8hChangePercent: overviewData.data.trade8hChangePercent,
          buy8h: overviewData.data.buy8h,
          sell8h: overviewData.data.sell8h,
          vBuy8hUSD: overviewData.data.vBuy8hUSD,
          vSell8hUSD: overviewData.data.vSell8hUSD,
          uniqueWallet8h: overviewData.data.uniqueWallet8h,
          uniqueWallet8hChangePercent:
            overviewData.data.uniqueWallet8hChangePercent,
        });
      } catch (error) {
        console.error('Failed to fetch token info:', error instanceof Error ? error.message : '未知错误');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tokenAddress]);

  // 条件渲染放在 hooks 之后
  if (!tokenAddress) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 使用代币分析相关的图标组合 */}
          <div className="relative">
            <BarChart3 className="h-16 w-16 text-[#53b991]" />
            <div className="absolute -bottom-2 -right-2 bg-[#2f2f2f] rounded-full p-1.5">
              <Activity className="h-6 w-6 text-[#acc97e]" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-gray-300">
              选择交易记录查看代币分析
            </h3>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return <TokenStatsSkeleton />;
  }

  if (!tokenInfo) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tokenAddress || '');
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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
  ];

  return (
    <div className="p-2 sm:p-2 space-y-2">
      {/* 顶部信息栏：调整移动端布局和间距 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#2f2f2f] rounded-lg p-2 gap-2 sm:gap-0">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-full bg-discord-primary/30 flex-shrink-0">
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
          <div className="min-w-0 flex-1 sm:flex-none">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-medium text-[#acc97e] truncate">{tokenInfo.symbol}</span>
              <div className="flex items-center gap-1 text-[10px]">
                {tokenInfo.extensions && (
                  <>
                    {tokenInfo.extensions.website && (
                      <a href={tokenInfo.extensions.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#53b991]">
                        官网
                      </a>
                    )}
                    {tokenInfo.extensions.twitter && (
                      <>
                        <span className="text-gray-600">·</span>
                        <a href={tokenInfo.extensions.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-[#53b991]">
                          Twitter
                        </a>
                      </>
                    )}
                    {tokenInfo.extensions.telegram && (
                      <>
                        <span className="text-gray-600">·</span>
                        <a href={tokenInfo.extensions.telegram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-[#53b991]">
                          TG
                        </a>
                      </>
                    )}
                  </>
                )}
                {tokenInfo.extensions?.description && (
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-400 hover:text-[#acc97e]" />
                      </TooltipTrigger>
                      <TooltipContent
                        className="bg-[#2f2f2f] border-gray-700 p-2"
                        sideOffset={5}
                      >
                        <p className="text-xs text-gray-200 max-w-[240px] whitespace-pre-wrap break-words leading-5">
                          {tokenInfo.extensions.description}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-400 truncate">{tokenInfo.name}</div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <div className="text-right flex-1 sm:flex-none">
            <div className="text-base sm:text-lg font-medium text-[#acc97e]">
              ${(tokenInfo.price || 0).toFixed(12)}
            </div>
            <div className="text-xs text-gray-400">
              24h成交额 ${formatCompactNumber(tokenInfo.v24hUSD || 0)}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-discord-primary/30 flex-shrink-0"
            onClick={handleCopy}
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>

      {/* 关键指标网格 - 移动端改为垂直堆叠 */}
      <div className="bg-[#2f2f2f] rounded-lg p-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:divide-x divide-gray-700 gap-2 sm:gap-0">
          {/* 市值 */}
          <div className="flex-1 sm:px-3 first:pl-0 last:pr-0">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">市值</span>
              <span className="text-sm text-[#acc97e]">${formatCompactNumber(tokenInfo.marketCap)}</span>
            </div>
          </div>
          {/* 流动性 */}
          <div className="flex-1 sm:px-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">流动性</span>
              <span className="text-sm text-[#acc97e]">${formatCompactNumber(tokenInfo.liquidity)}</span>
            </div>
          </div>
          {/* 持有人数 */}
          <div className="flex-1 sm:px-3 first:pl-0 last:pr-0">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">持有人数</span>
              <span className="text-sm text-[#acc97e]">{formatCompactNumber(tokenInfo.totalHolders)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 时间选择器和安全信息行 - 移动端改为垂直布局 */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center justify-between bg-[#2f2f2f] rounded-lg p-2">
        {/* 时间选择器 */}
        <div className="flex gap-1 overflow-x-auto pb-2 sm:pb-0">
          {timeOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedTime === option.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTime(option.value as '30m' | '1h' | '2h')}
              className={`flex-shrink-0 ${selectedTime === option.value
                ? 'bg-discord-primary text-white'
                : 'text-gray-400 hover:bg-discord-primary/30'
                }`}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* 安全信息 */}
        <div className="grid grid-cols-3 sm:flex gap-4 text-center">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400">创建者持仓</span>
            <span className="text-xs text-[#acc97e]">
              {formatPercent(tokenInfo.creatorPercentage)} %
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400">Top10持仓</span>
            <span className="text-xs text-[#acc97e]">
              {formatPercent(tokenInfo.top10HolderPercent)} %
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400">安全检查</span>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-1">
                    {/* 得分显示 */}
                    <span className={`text-xs ${calculateSecurityScore(tokenInfo) === 3 ? 'text-[#9ad499]' : 'text-[#de5569]'}`}>
                      {calculateSecurityScore(tokenInfo)}/3
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-[#2f2f2f] border-gray-700 p-2">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`${tokenInfo.freezeable === null ? 'text-[#9ad499]' : 'text-[#de5569]'}`}>
                        {tokenInfo.freezeable === null ? '✓' : '✗'}
                      </span>
                      <span>黑名单</span>
                      <span className="text-gray-400">
                        {tokenInfo.freezeable === null ? '（安全）' : '（风险）'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`${tokenInfo.transferFeeEnable === null ? 'text-[#9ad499]' : 'text-[#de5569]'}`}>
                        {tokenInfo.transferFeeEnable === null ? '✓' : '✗'}
                      </span>
                      <span>转账费</span>
                      <span className="text-gray-400">
                        {tokenInfo.transferFeeEnable === null ? '（安全）' : '（风险）'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`${tokenInfo.nonTransferable === null ? 'text-[#9ad499]' : 'text-[#de5569]'}`}>
                        {tokenInfo.nonTransferable === null ? '✓' : '✗'}
                      </span>
                      <span>貔貅设置</span>
                      <span className="text-gray-400">
                        {tokenInfo.nonTransferable === null ? '（安全）' : '（风险）'}
                      </span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* 交易数据网格 - 移动端改为单列布局 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="bg-[#2f2f2f] rounded-lg p-2">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400">交易量</span>
            <span className="text-[#acc97e]">${formatCompactNumber(getTimeFrameData(selectedTime, tokenInfo).volumeUSD)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">交易笔数</span>
            <span className="text-[#acc97e]">{formatCompactNumber(getTimeFrameData(selectedTime, tokenInfo).trades)}</span>
          </div>
        </div>
        <div className="bg-[#2f2f2f] rounded-lg p-2">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-[#acc97e]">买入额</span>
            <span className="text-[#acc97e]">${formatCompactNumber(getTimeFrameData(selectedTime, tokenInfo).buyVolume)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#de5569]">卖出额</span>
            <span className="text-[#de5569]">${formatCompactNumber(getTimeFrameData(selectedTime, tokenInfo).sellVolume)}</span>
          </div>
        </div>
        <div className="bg-[#2f2f2f] rounded-lg p-2">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-[#acc97e]">买入钱包数量</span>
            <span className="text-[#acc97e]">{formatCompactNumber(getTimeFrameData(selectedTime, tokenInfo).buys)}</span>
          </div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-[#de5569]">卖出钱包数量</span>
            <span className="text-[#de5569]">{formatCompactNumber(getTimeFrameData(selectedTime, tokenInfo).sells)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
// 修改格式化函数
function formatCompactNumber(num: number | undefined | null): string {
  // 添加空值检查
  if (num === undefined || num === null) {
    return '0';
  }

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

