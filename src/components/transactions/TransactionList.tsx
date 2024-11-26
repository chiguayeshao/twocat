'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  SortAsc,
  Loader2,
  MoreVertical,
  ExternalLink,
  Info,
} from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TransactionListProps {
  onTransactionClick: (walletAddress: string, tokenAddress: string) => void;
  roomId: string;
}
interface Transaction {
  _id: string;
  walletAddress: string;
  type: 'buy' | 'sell';
  solAmount: number;
  tokenAmount: number;
  tokenAddress: string;
  signature: string;
  timestamp: number;
  symbol: string;
  tokenName: string;
  createdAt?: string;
  updatedAt?: string;
  walletDescription?: string;
}

interface TransactionResponse {
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export function TransactionList({
  onTransactionClick,
  roomId,
}: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 30,
    totalPages: 1,
    hasMore: false,
  });
  const [loading, setLoading] = useState(false);
  const [isNewPage, setIsNewPage] = useState(false);

  const fetchTransactions = useCallback(
    async (page: number) => {
      if (loading || page < 1) return;

      setLoading(true);
      setIsNewPage(true);
      try {
        const response = await fetch('/api/twocat-core/transactions/wallets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomId,
            page,
            limit: pagination.limit,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        setTransactions(data.transactions);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
        setTimeout(() => setIsNewPage(false), 300);
      }
    },
    [loading, pagination.limit]
  );

  const pollTransactions = useCallback(async () => {
    try {
      const response = await fetch('/api/twocat-core/transactions/wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          page: 1,
          limit: pagination.limit,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to poll transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to poll transactions:', error);
    }
  }, [pagination.limit]);

  useEffect(() => {
    // 初始加载，只在组件挂载时执行一次
    fetchTransactions(1);
  }, []); // 空依赖数组，确保只在组件挂载时执行一次

  // 单独处理轮询逻辑
  useEffect(() => {
    // 只在第一页时设置轮询
    let intervalId: NodeJS.Timeout | null = null;
    if (pagination.page === 1) {
      intervalId = setInterval(pollTransactions, 5000);
    }

    // 清理函数
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [pagination.page, pollTransactions]); // 只监听页码变化来控制轮询

  const TransactionSkeleton = () => (
    <div
      className="flex gap-2 p-2 rounded-lg bg-[#2f2f2f] mb-1.5 h-12
                       transform transition-all duration-200 ease-out"
    >
      <Skeleton className="h-7 w-7 rounded-full bg-gray-500/20" />

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Skeleton className="h-3.5 w-24 bg-gray-500/20" />
          <Skeleton className="h-3.5 w-32 bg-gray-500/20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-3/4 bg-gray-500/20" />
          <div className="flex gap-1 ml-2">
            <Skeleton className="h-5 w-12 bg-gray-500/20" />
            <Skeleton className="h-5 w-12 bg-gray-500/20" />
            <Skeleton className="h-5 w-12 bg-gray-500/20" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* 工具栏 */}
      {/* <div className="shrink-0 flex items-center gap-4 bg-discord-secondary/50 backdrop-blur-sm z-10 py-2 px-1">
                <Input
                    placeholder="索交易..."
                    className="max-w-xs bg-discord-primary/50"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-discord-primary/50">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>买入交易</DropdownMenuItem>
                        <DropdownMenuItem>卖出交易</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-discord-primary/50">
                            <SortAsc className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>时间升序</DropdownMenuItem>
                        <DropdownMenuItem>时间降序</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div> */}

      {/* 消息列表容器 */}
      <div className="flex-1 min-h-0 overflow-auto custom-scrollbar p-4">
        {loading ? (
          // 显示8个骨架加载项
          Array.from({ length: 8 }).map((_, index) => (
            <TransactionSkeleton key={index} />
          ))
        ) : (
          <AnimatePresence initial={false} mode="sync">
            {transactions.map((tx, index) => (
              <motion.div
                key={tx._id}
                initial={{ y: isNewPage ? 40 : -40, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  ease: [0.2, 0.65, 0.3, 0.9],
                  opacity: { duration: 0.2 },
                }}
                layout
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2, ease: 'easeOut' },
                }}
                onClick={() => {
                  console.log('walletAddress:', tx.walletAddress);
                  console.log('tokenAddress:', tx.tokenAddress);
                  onTransactionClick(tx.walletAddress, tx.tokenAddress);
                }}
                className="flex items-start sm:items-center gap-2 py-2 sm:py-1.5 px-2 rounded-lg transition-all duration-200 ease-out
                                          bg-[#2f2f2f] hover:bg-[#353535] hover:shadow-lg
                                          mb-1 last:mb-0 relative min-h-[4.5rem] sm:h-12 cursor-pointer
                                          transform hover:-translate-y-0.5"
              >
                {/* 三点按钮 */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6 hover:bg-discord-primary/30 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <MoreVertical className="h-3.5 w-3.5 text-gray-400" />
                </Button>

                {/* 头像 */}
                <div className="shrink-0 mt-1 sm:mt-0">
                  <Image
                    src={process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL || ''}
                    alt="Avatar"
                    width={20}
                    height={20}
                    className="rounded-full ring-1 ring-discord-primary/30"
                    unoptimized
                  />
                </div>

                {/* 内容区 */}
                <div className="flex-1 min-w-0 pr-7">
                  {/* 移动端视图 */}
                  <div className="block sm:hidden space-y-1">
                    {/* 第一行：钱包地址和描述 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <button className="font-medium text-[#53b991] hover:underline transition-colors z-10 text-xs shrink-0">
                          {tx.walletAddress.slice(0, 4)}...{tx.walletAddress.slice(-4)}
                        </button>
                        {tx.walletDescription && (
                          <span className="text-gray-400 text-xs truncate max-w-[120px]">
                            ({tx.walletDescription})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 shrink-0">
                        {new Intl.DateTimeFormat('zh-CN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }).format(new Date(tx.timestamp * 1000))}
                      </div>
                    </div>

                    {/* 第二行：代币信息 */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`${tx.type === 'buy' ? 'text-[#9ad499]' : 'text-[#de5569]'} shrink-0`}>
                        {tx.type === 'buy' ? '买入' : '卖出'}
                      </span>
                      <span className="text-gray-300 shrink-0">
                        {tx.tokenAmount.toLocaleString('en-US', {
                          maximumFractionDigits: 1,
                          minimumFractionDigits: 0
                        })}
                      </span>
                      <span className="text-[#acc97e] shrink-0">{tx.symbol}</span>
                    </div>

                    {/* 第三行：SOL金额和链接 */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        {tx.type === 'buy' ? '消耗' : '获得'}:
                        <span className="text-[#acc97e] ml-1">
                          {Number(tx.solAmount).toFixed(2)} SOL
                        </span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://solscan.io/tx/${tx.signature}`, '_blank');
                        }}
                        className="text-gray-400 hover:text-gray-300 transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* 桌面端视图 - 保持不变 */}
                  <div className="hidden sm:flex items-center gap-2 text-xs">
                    <button className="font-medium text-[#53b991] hover:underline transition-colors z-10">
                      {tx.walletAddress.slice(0, 4)}...{tx.walletAddress.slice(-4)}
                    </button>

                    {tx.walletDescription && (
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-gray-400 max-w-[150px] truncate cursor-help">
                              ({tx.walletDescription})
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm">{tx.walletDescription}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    <span className={tx.type === 'buy' ? 'text-[#9ad499]' : 'text-[#de5569]'}>
                      {tx.type === 'buy' ? '买入' : '卖出'}
                    </span>

                    <span className="text-gray-300">
                      {tx.tokenAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>

                    <span className="text-[#acc97e]">{tx.symbol}</span>

                    <span className="text-gray-400">
                      {tx.type === 'buy' ? '消耗: ' : '获得: '}
                      <span className="text-[#acc97e]">{tx.solAmount.toFixed(4)} SOL</span>
                    </span>

                    <span className="text-gray-400 flex items-center gap-1">
                      {new Date(tx.timestamp * 1000).toLocaleString()}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://solscan.io/tx/${tx.signature}`, '_blank');
                        }}
                        className="hover:text-gray-300 transition-colors z-10"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* 分页 */}
      <div className="shrink-0 flex items-center justify-center gap-2 bg-discord-secondary/50 backdrop-blur-sm py-2 px-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fetchTransactions(pagination.page - 1)}
          disabled={pagination.page === 1 || loading}
          className="hover:bg-discord-primary/30"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {pagination.page > 3 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchTransactions(1)}
                className="hover:bg-discord-primary/30"
              >
                1
              </Button>
              <span className="text-gray-400">...</span>
            </>
          )}

          {Array.from({ length: 5 }).map((_, i) => {
            const pageNum = pagination.page - 2 + i;
            if (pageNum < 1 || pageNum > pagination.totalPages) return null;
            return (
              <Button
                key={pageNum}
                variant={pagination.page === pageNum ? 'default' : 'ghost'}
                size="sm"
                onClick={() => fetchTransactions(pageNum)}
                disabled={loading}
                className={
                  pagination.page === pageNum
                    ? ''
                    : 'hover:bg-discord-primary/30'
                }
              >
                {pageNum}
              </Button>
            );
          })}

          {pagination.page < pagination.totalPages - 2 && (
            <>
              <span className="text-gray-400">...</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchTransactions(pagination.totalPages)}
                className="hover:bg-discord-primary/30"
              >
                {pagination.totalPages}
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => fetchTransactions(pagination.page + 1)}
          disabled={!pagination.hasMore || loading}
          className="hover:bg-discord-primary/30"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
