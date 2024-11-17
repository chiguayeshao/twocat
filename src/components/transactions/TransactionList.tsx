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
import { ChevronLeft, ChevronRight, Filter, SortAsc, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { fetchWalletTransactions, Transaction } from '@/api/twocat-core/wallet';

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
        // 初始加载
        fetchTransactions(1);

        // 设置轮询
        const intervalId = setInterval(pollTransactions, 5000);

        // 清理函数
        return () => clearInterval(intervalId);
    }, []); // 依赖数组置空，确保只在组件挂载时设置一次轮询

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
            <div
                className="flex-1 min-h-0 overflow-auto custom-scrollbar p-4"
                style={{
                    willChange: 'transform',
                    transform: 'translateZ(0)'
                }}
            >
                <AnimatePresence initial={false} mode="sync">
                    {transactions.map((tx, index) => (
                        <motion.div
                            key={tx._id}
                            initial={{
                                y: isNewPage ? 40 : -40,
                                opacity: 0,
                                scale: 0.98
                            }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                scale: 1
                            }}
                            transition={{
                                duration: 0.3,
                                ease: [0.2, 0.65, 0.3, 0.9],
                                opacity: { duration: 0.2 },
                                layout: {
                                    type: "spring",
                                    bounce: 0.15,
                                    duration: 0.4
                                }
                            }}
                            layout
                            className="flex gap-4 p-3 rounded-lg transition-all duration-200 ease-out
                                      bg-[#2f2f2f] hover:bg-[#353535]
                                      mb-3 last:mb-0"
                            style={{
                                height: 'auto',
                                transform: 'translate3d(0, 0, 0)',
                                transformOrigin: isNewPage ? 'bottom' : 'top'
                            }}
                        >
                            {/* 头像部分 */}
                            <div className="shrink-0">
                                <Image
                                    src="https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1731764573897-default-avatar.png"
                                    alt="Avatar"
                                    width={40}
                                    height={40}
                                    className="rounded-full ring-2 ring-discord-primary/30"
                                    unoptimized
                                />
                            </div>

                            {/* 消息内容 */}
                            <div className="flex-1 min-w-0">
                                {/* 头部信息 */}
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-white/90 hover:text-white transition-colors">
                                        {tx.walletAddress.slice(0, 4)}...{tx.walletAddress.slice(-4)}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(tx.timestamp * 1000).toLocaleString()}
                                    </span>
                                </div>

                                {/* 交易描述 */}
                                <p className="text-gray-300 mt-1">
                                    {tx.type === 'buy' ? '买入' : '卖出'} {tx.tokenAmount.toFixed(2)} {tx.symbol}
                                    {' '}({tx.solAmount.toFixed(4)} SOL)
                                </p>

                                {/* 表情反应 */}
                                <div className="flex gap-2 mt-2 text-sm">
                                    <button className="hover:bg-discord-primary/50 px-2 py-1 rounded text-gray-400 hover:text-white transition-colors">
                                        👍 <span className="ml-1">0</span>
                                    </button>
                                    <button className="hover:bg-discord-primary/50 px-2 py-1 rounded text-gray-400 hover:text-white transition-colors">
                                        🚀 <span className="ml-1">0</span>
                                    </button>
                                    <button className="hover:bg-discord-primary/50 px-2 py-1 rounded text-gray-400 hover:text-white transition-colors">
                                        💰 <span className="ml-1">0</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* 分页 */}
            <div className="shrink-0 flex items-center justify-between bg-discord-secondary/50 backdrop-blur-sm py-2 px-1">
                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => (
                        <Button
                            key={i}
                            variant={pagination.page === i + 1 ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => fetchTransactions(i + 1)}
                            className={pagination.page === i + 1 ? '' : 'hover:bg-discord-primary/30'}
                        >
                            {i + 1}
                        </Button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                        第 {pagination.page} 页，共 {pagination.totalPages} 页
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => fetchTransactions(pagination.page - 1)}
                        disabled={pagination.page === 1 || loading}
                        className="hover:bg-discord-primary/30"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
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
        </div>
    );
}