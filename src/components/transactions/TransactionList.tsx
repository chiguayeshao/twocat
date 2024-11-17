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
import { ChevronLeft, ChevronRight, Filter, SortAsc, Loader2, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { fetchWalletTransactions, Transaction } from '@/api/twocat-core/wallet';
import { Skeleton } from "@/components/ui/skeleton";

export function TransactionList() {
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

    // 添加 fetchTransactions 函数
    const fetchTransactions = useCallback(async (page: number) => {
        if (loading || page < 1) return;

        setLoading(true);
        setIsNewPage(true);
        try {
            const result = await fetchWalletTransactions({
                roomId: '67331cdeb2a6f4d517951bdb',
                page,
                limit: pagination.limit
            });
            setTransactions(result.transactions);
            setPagination(prev => ({
                ...prev,
                ...result.pagination,
                page
            }));
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
            setTimeout(() => {
                setIsNewPage(false);
            }, 100);
        }
    }, [loading, pagination.limit]);

    const pollTransactions = useCallback(async () => {
        if (pagination.page !== 1) return;

        try {
            const result = await fetchWalletTransactions({
                roomId: '67331cdeb2a6f4d517951bdb',
                page: 1,
                limit: pagination.limit
            });

            setIsNewPage(false);
            setTransactions(prev => {
                const newTransactions = result.transactions;
                const newUniqueTransactions = newTransactions.filter(
                    (newTx: Transaction) => !prev.some((existingTx: Transaction) => existingTx._id === newTx._id)
                );

                if (newUniqueTransactions.length === 0) return prev;

                return [...newUniqueTransactions, ...prev].slice(0, pagination.limit);
            });
        } catch (error) {
            console.error('Failed to poll transactions:', error);
        }
    }, [pagination.page, pagination.limit]);

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
        <div className="flex gap-2 p-2 rounded-lg bg-[#2f2f2f] mb-1.5">
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
            <div className="shrink-0 flex items-center gap-4 bg-discord-secondary/50 backdrop-blur-sm z-10 py-2 px-1">
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
            </div>

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
                                    opacity: { duration: 0.2 }
                                }}
                                layout
                                className="flex gap-2 p-2 rounded-lg transition-all duration-200 ease-out
                                          bg-[#2f2f2f] hover:bg-[#353535]
                                          mb-1.5 last:mb-0 relative"
                            >
                                {/* 三点按钮 */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1 right-1 h-7 w-7 hover:bg-discord-primary/30"
                                >
                                    <MoreVertical className="h-4 w-4 text-gray-400" />
                                </Button>

                                {/* 头像 */}
                                <div className="shrink-0">
                                    <Image
                                        src="https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1731764573897-default-avatar.png"
                                        alt="Avatar"
                                        width={28}
                                        height={28}
                                        className="rounded-full ring-1 ring-discord-primary/30"
                                        unoptimized
                                    />
                                </div>

                                {/* 内容区 */}
                                <div className="flex-1 min-w-0 pr-8">
                                    {/* 头部信息 */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-medium text-white/90 hover:text-white transition-colors">
                                            {tx.walletAddress.slice(0, 4)}...{tx.walletAddress.slice(-4)}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(tx.timestamp * 1000).toLocaleString()}
                                        </span>
                                    </div>

                                    {/* 交易信息和表情反应在同一行 */}
                                    <div className="flex items-center justify-between mt-0.5">
                                        <p className="text-sm text-gray-300">
                                            {tx.type === 'buy' ? '买入' : '卖出'} {tx.tokenAmount.toFixed(2)} {tx.symbol}
                                            {' '}({tx.solAmount.toFixed(4)} SOL)
                                        </p>

                                        <div className="flex gap-1 text-xs shrink-0 ml-2">
                                            <button className="hover:bg-discord-primary/50 px-1.5 py-0.5 rounded text-gray-400 hover:text-white transition-colors">
                                                👍 <span className="ml-0.5">0</span>
                                            </button>
                                            <button className="hover:bg-discord-primary/50 px-1.5 py-0.5 rounded text-gray-400 hover:text-white transition-colors">
                                                🚀 <span className="ml-0.5">0</span>
                                            </button>
                                            <button className="hover:bg-discord-primary/50 px-1.5 py-0.5 rounded text-gray-400 hover:text-white transition-colors">
                                                💰 <span className="ml-0.5">0</span>
                                            </button>
                                        </div>
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

                    {Array.from({ length: 5 })
                        .map((_, i) => {
                            const pageNum = pagination.page - 2 + i;
                            if (pageNum < 1 || pageNum > pagination.totalPages) return null;
                            return (
                                <Button
                                    key={pageNum}
                                    variant={pagination.page === pageNum ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => fetchTransactions(pageNum)}
                                    disabled={loading}
                                    className={pagination.page === pageNum ? '' : 'hover:bg-discord-primary/30'}
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