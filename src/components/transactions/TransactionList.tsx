'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronLeft, ChevronRight, Filter, SortAsc, Loader2 } from 'lucide-react';

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
    const [selected, setSelected] = useState<string[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 30,
        totalPages: 1,
        hasMore: false,
    });
    const [loading, setLoading] = useState(false);
    const lastUpdateTime = useRef<number>(Date.now());

    // 模拟轮询获取数据
    const pollTransactions = useCallback(async () => {
        // 只在第一页时进行轮询
        if (pagination.page !== 1) return;

        const newTransactions = simulatePollData();

        if (newTransactions.length > 0) {
            setTransactions(prev => {
                const updatedTransactions = [...newTransactions, ...prev];
                return updatedTransactions.slice(0, pagination.limit);
            });
        }
    }, [pagination.page, pagination.limit]);

    // 初始加载数据
    const fetchTransactions = async (page: number) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = generateMockData(page, pagination.limit);
        setTransactions(data.transactions as Transaction[]); // 添加类型断言
        setPagination(data.pagination);
        setLoading(false);
        lastUpdateTime.current = Date.now();
    };

    // 设置轮询
    useEffect(() => {
        const intervalId = setInterval(pollTransactions, 500); // 每0.5秒轮询一次
        return () => clearInterval(intervalId);
    }, [pollTransactions]);

    // 初始加载
    useEffect(() => {
        fetchTransactions(1);
    }, []);

    const TableRowAnimated = motion(TableRow);

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

            {/* 表格容器 */}
            <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
                <Table>
                    <TableHeader className="sticky top-0 bg-discord-secondary/50 backdrop-blur-sm z-10">
                        <TableRow className="border-none hover:bg-transparent">
                            <TableHead className="text-gray-400 font-medium">钱包地址</TableHead>
                            <TableHead className="text-gray-400 font-medium">类型</TableHead>
                            <TableHead className="text-gray-400 font-medium">SOL 数量</TableHead>
                            <TableHead className="text-gray-400 font-medium">代币数量</TableHead>
                            <TableHead className="text-gray-400 font-medium">代币符号</TableHead>
                            <TableHead className="text-gray-400 font-medium">时间</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence initial={false} mode="popLayout">
                            {transactions.map((tx) => (
                                <TableRowAnimated
                                    key={tx._id}
                                    initial={{
                                        opacity: 0,
                                        height: 0,
                                        backgroundColor: "rgba(34, 197, 94, 0.2)"
                                    }}
                                    animate={{
                                        opacity: 1,
                                        height: "auto",
                                        backgroundColor: "rgba(0, 0, 0, 0)"
                                    }}
                                    exit={{
                                        opacity: 0,
                                        height: 0
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeOut"
                                    }}
                                    className="border-none hover:bg-discord-primary/30 transition-colors"
                                    layout
                                >
                                    <TableCell className="font-mono text-sm">
                                        {tx.walletAddress.slice(0, 4)}...{tx.walletAddress.slice(-4)}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`${tx.type === 'buy' ? 'text-green-400' : 'text-red-400'} font-medium`}>
                                            {tx.type === 'buy' ? '买入' : '卖出'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-medium">{tx.solAmount.toFixed(4)}</TableCell>
                                    <TableCell className="text-gray-300">{tx.tokenAmount.toFixed(2)}</TableCell>
                                    <TableCell className="font-medium">{tx.symbol}</TableCell>
                                    <TableCell className="text-gray-400 text-sm">
                                        {new Date(tx.timestamp * 1000).toLocaleString()}
                                    </TableCell>
                                </TableRowAnimated>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
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