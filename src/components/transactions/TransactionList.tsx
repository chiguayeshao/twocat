'use client';

import { useState, useEffect } from 'react';
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

export function TransactionList() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [selected, setSelected] = useState<string[]>([]); // 添加选中状态
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasMore: false,
    });
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async (page: number) => {
        setLoading(true);
        // 模拟 API 延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = generateMockData(page, pagination.limit);
        setTransactions(data.transactions);
        setPagination(data.pagination);
        setLoading(false);
    };

    useEffect(() => {
        fetchTransactions(1);
    }, []);

    return (
        <div className="flex flex-col h-full">
            {/* 工具栏 - 调整背景色和内边距 */}
            <div className="flex items-center gap-4 mb-2 sticky top-0 bg-discord-secondary/50 backdrop-blur-sm z-10 py-3 px-1">
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

                <div className="ml-auto text-sm text-gray-400">
                    已选择 {selected.length} 项
                </div>
            </div>

            {/* 表格 - 优化样式 */}
            <div className="flex-1 overflow-auto relative">
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
                    <TableBody className="relative">
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-[400px] border-none">
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((tx) => (
                                <TableRow
                                    key={tx._id}
                                    className="border-none hover:bg-discord-primary/30 transition-colors"
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
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* 分页 - 优化样式 */}
            <div className="flex items-center justify-between mt-2 sticky bottom-0 bg-discord-secondary/50 backdrop-blur-sm py-3 px-1">
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