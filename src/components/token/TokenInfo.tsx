'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

interface TokenInfoProps {
    tokenAddress: string | null;
}

interface TokenData {
    name: string;
    symbol: string;
    price: number;
    priceChange24h: number;
    volume24h: number;
    marketCap: number;
    // ... 可以根据需要添加更多字段
}

export function TokenInfo({ tokenAddress }: TokenInfoProps) {
    const [loading, setLoading] = useState(false);
    const [tokenData, setTokenData] = useState<TokenData | null>(null);

    useEffect(() => {
        if (!tokenAddress) return;

        const fetchTokenInfo = async () => {
            setLoading(true);
            try {
                // TODO: 实现获取代币信息的 API 调用
                // const data = await fetchTokenData(tokenAddress);
                // setTokenData(data);

                // 模
            } catch (error) {
                console.error('Failed to fetch token info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTokenInfo();
    }, [tokenAddress]);

    if (!tokenAddress) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                请选择一个代币查看详情
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* 代币基本信息 */}
            <div className="flex items-start justify-between">
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32 bg-gray-500/20" />
                        <Skeleton className="h-4 w-24 bg-gray-500/20" />
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium">{tokenData?.name}</h3>
                            <span className="text-sm text-gray-400">{tokenData?.symbol}</span>
                        </div>
                        <a
                            href={`https://solscan.io/token/${tokenAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mt-1"
                        >
                            在 Solscan 查看
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                )}
            </div>

            {/* 代币详细信息 */}
            <div className="grid grid-cols-2 gap-3">
                {/* 价格信息 */}
                <div className="bg-discord-primary/30 rounded-lg p-3">
                    {loading ? (
                        <Skeleton className="h-16 w-full bg-gray-500/20" />
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-sm">当前价格</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-lg font-medium">
                                    ${tokenData?.price?.toFixed(4)}
                                </span>
                                <span className={`text-xs ${tokenData?.priceChange24h ?? 0 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {(tokenData?.priceChange24h ?? 0) >= 0 ? '+' : ''}{tokenData?.priceChange24h ?? 0}%
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 交易量 */}
                <div className="bg-discord-primary/30 rounded-lg p-3">
                    {loading ? (
                        <Skeleton className="h-16 w-full bg-gray-500/20" />
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400">
                                <BarChart3 className="h-4 w-4" />
                                <span className="text-sm">24h 交易量</span>
                            </div>
                            <div className="text-lg font-medium">
                                ${tokenData?.volume24h.toLocaleString()}
                            </div>
                        </div>
                    )}
                </div>

                {/* 市值 */}
                <div className="bg-discord-primary/30 rounded-lg p-3">
                    {loading ? (
                        <Skeleton className="h-16 w-full bg-gray-500/20" />
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm">市值</span>
                            </div>
                            <div className="text-lg font-medium">
                                ${tokenData?.marketCap.toLocaleString()}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 可以添加更多信息区块 */}
        </div>
    );
}
