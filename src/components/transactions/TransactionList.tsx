'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

// 模拟数据生成函数
const generateMockData = (page: number, limit: number) => {
    const total = 156;
    const totalPages = Math.ceil(total / limit);

    const transactions = Array(limit).fill(0).map((_, index) => ({
        _id: `tx-${page}-${index}`,
        walletAddress: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
        type: Math.random() > 0.5 ? 'buy' : 'sell' as const,
        solAmount: Number((Math.random() * 10).toFixed(4)),
        tokenAmount: Number((Math.random() * 100000).toFixed(2)),
        tokenAddress: 'TokenAddress123...',
        signature: 'Signature123...',
        timestamp: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400),
        symbol: ['SOL', 'BONK', 'JUP', 'PYTH'][Math.floor(Math.random() * 4)],
        tokenName: 'Mock Token',
    }));

    return {
        transactions,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasMore: page < totalPages,
        }
    };
};

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
}

// 生成随机交易数据
const generateRandomTransaction = (): Transaction => {
    const symbols = ['SOL', 'BONK', 'JUP', 'PYTH'];
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    return {
        _id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        walletAddress: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
        type,
        solAmount: Number((Math.random() * 10).toFixed(4)),
        tokenAmount: Number((Math.random() * 100000).toFixed(2)),
        tokenAddress: 'TokenAddress123...',
        signature: 'Signature123...',
        timestamp: Math.floor(Date.now() / 1000),
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        tokenName: 'Mock Token',
    };
};

// 模拟轮询生成新数据
const simulatePollData = () => {
    // 30% 的概率生成新交易
    if (Math.random() < 0.3) {
        return [generateRandomTransaction()];
    }
    return [];
};

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
    const lastUpdateTime = useRef<number>(Date.now());
    const prevTransactionsRef = useRef<Transaction[]>([]);
    const [isNewPage, setIsNewPage] = useState(false);

    // 添加 fetchTransactions 函数
    const fetchTransactions = useCallback(async (page: number) => {
        if (loading || page < 1 || page > pagination.totalPages) return;

        setLoading(true);
        setIsNewPage(true);
        try {
            const result = generateMockData(page, pagination.limit);
            setTransactions(result.transactions as Transaction[]); // 添加类型断言
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
    }, [loading, pagination.totalPages, pagination.limit]);

    // 初始加载
    useEffect(() => {
        fetchTransactions(1);
    }, [fetchTransactions]);

    // 轮询逻辑保持不变
    const pollTransactions = useCallback(async () => {
        if (pagination.page !== 1) return;

        const now = Date.now();
        if (now - lastUpdateTime.current < 300) return;

        const newTransactions = simulatePollData();

        if (newTransactions.length > 0) {
            setIsNewPage(false);
            setTransactions(prev => {
                const newUniqueTransactions = newTransactions.filter(
                    newTx => !prev.some(existingTx => existingTx._id === newTx._id)
                );

                if (newUniqueTransactions.length === 0) return prev;

                const updatedTransactions = [...newUniqueTransactions, ...prev];
                prevTransactionsRef.current = updatedTransactions;
                return updatedTransactions.slice(0, pagination.limit);
            });
            lastUpdateTime.current = now;
        }
    }, [pagination.page, pagination.limit]);

    useEffect(() => {
        const intervalId = setInterval(pollTransactions, 500);
        return () => clearInterval(intervalId);
    }, [pollTransactions]);

    return (
        <div className="h-full flex flex-col">
            {/* 工具栏 */}
            <div className="shrink-0 flex items-center gap-4 bg-discord-secondary/50 backdrop-blur-sm z-10 py-2 px-1">
                <Input
                    placeholder="搜索交易..."
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
                className="flex-1 min-h-0 overflow-auto custom-scrollbar p-4 space-y-4"
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
                                ease: [0.2, 0.65, 0.3, 0.9], // 自定义缓动函数，让动画更有弹性
                                opacity: { duration: 0.2 },
                                layout: {
                                    type: "spring",
                                    bounce: 0.15,
                                    duration: 0.4
                                }
                            }}
                            layout // 启用布局动画
                            className="flex gap-4 group hover:bg-discord-primary/30 p-2 rounded-lg transition-colors"
                            style={{
                                height: 'auto',
                                transform: 'translate3d(0, 0, 0)',
                                transformOrigin: isNewPage ? 'bottom' : 'top'
                            }}
                        >
                            {/* 头像 */}
                            <div className="shrink-0">
                                <Image
                                    src="https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1731764573897-default-avatar.png"
                                    alt="Avatar"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                    unoptimized
                                />
                            </div>

                            {/* 消息内容 */}
                            <div className="flex-1 min-w-0">
                                {/* 头部信息 */}
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-white">
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