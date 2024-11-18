'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Copy, Check, Wallet, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWalletTokens, WalletTokens, TokenHolding } from '@/api/twocat-core/token';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface WalletInfoProps {
    walletAddress: string | null;
}

const TokenSkeleton = () => (
    <div className="flex gap-2 p-2 rounded-lg bg-[#2f2f2f] mb-1.5
                   transform transition-all duration-200 ease-out">
        {/* 代币图标骨架屏 */}
        <Skeleton className="h-8 w-8 rounded-full bg-gray-500/20" />

        {/* 代币信息骨架屏 */}
        <div className="flex-1">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Skeleton className="h-4 w-20 bg-gray-500/20" /> {/* 代币符号 */}
                    <Skeleton className="h-3 w-32 bg-gray-500/20" /> {/* 代币名称 */}
                </div>
                <div className="text-right space-y-1">
                    <Skeleton className="h-4 w-24 bg-gray-500/20" /> {/* 价值 */}
                    <Skeleton className="h-3 w-16 bg-gray-500/20" /> {/* 数量 */}
                </div>
            </div>
        </div>
    </div>
);

export function WalletInfo({ walletAddress }: WalletInfoProps) {
    const [loading, setLoading] = useState(false);
    const [walletTokens, setWalletTokens] = useState<WalletTokens | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (!walletAddress) return;

        const fetchTokens = async () => {
            setLoading(true);
            try {
                const data = await fetchWalletTokens(walletAddress);
                setWalletTokens(data);
            } catch (error) {
                console.error('Failed to fetch wallet tokens:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTokens();
    }, [walletAddress]);

    const handleCopyAddress = () => {
        if (!walletAddress) return;
        navigator.clipboard.writeText(walletAddress);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    if (!walletAddress) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                请选择一个钱包地址
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            {/* 顶部区域：钱包地址和总资产 */}
            <div className="flex items-center justify-between">
                {/* 钱包地址部分 */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-discord-primary/30 
                                  flex items-center justify-center">
                        <Wallet className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-[#53b991]">
                            {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
                        </div>
                    </div>
                </div>

                {/* 总资产显示 */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">总资产</span>
                        {loading ? (
                            <Skeleton className="h-6 w-24" />
                        ) : (
                            <span className="text-lg font-medium text-[#acc97e]">
                                ${(walletTokens?.totalUsd || 0).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-discord-primary/30"
                            onClick={handleCopyAddress}
                        >
                            {isCopied ? (
                                <Check className="h-4 w-4 text-green-400" />
                            ) : (
                                <Copy className="h-4 w-4 text-gray-400" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-discord-primary/30"
                            onClick={() => window.open(`https://solscan.io/account/${walletAddress}`, '_blank')}
                        >
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* 代币列表 */}
            <div className="space-y-1.5 mt-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-400">持仓代币</span>
                    <span className="text-xs text-gray-500">(按持仓价值排序 · 显示前10)</span>
                </div>
                {loading ? (
                    // 显示6个骨架屏
                    Array(6).fill(0).map((_, i) => (
                        <TokenSkeleton key={i} />
                    ))
                ) : (
                    <div className="space-y-1.5">
                        {walletTokens?.items && walletTokens.items.length > 0 ? (
                            // 按价值排序并取前10
                            [...walletTokens.items]
                                .sort((a, b) => (b.valueUsd || 0) - (a.valueUsd || 0))
                                .slice(0, 10)  // 只取前10个
                                .map((token) => (
                                    <motion.div
                                        key={token.address}
                                        className="flex items-center gap-2 p-2 rounded-lg 
                                                 bg-[#2f2f2f] hover:bg-[#353535] 
                                                 cursor-pointer transform hover:-translate-y-0.5 
                                                 transition-all duration-200 ease-out hover:shadow-lg"
                                        whileHover={{
                                            scale: 1.02,
                                            transition: { duration: 0.2, ease: "easeOut" }
                                        }}
                                        onClick={() => window.open(`https://solscan.io/token/${token.address}`, '_blank')}
                                    >
                                        {/* 代币图标 */}
                                        <div className="shrink-0 w-[32px] h-[32px] bg-discord-primary/30 rounded-full flex items-center justify-center overflow-hidden">
                                            {token.logoURI ? (
                                                <Image
                                                    src={token.logoURI}
                                                    alt={token.symbol}
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full w-full h-full object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <span className="text-sm text-gray-400">
                                                    {token.symbol?.[0] || '?'}
                                                </span>
                                            )}
                                        </div>

                                        {/* 代币信息 */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div className="truncate">
                                                    <div className="font-medium truncate text-[#acc97e]">
                                                        {token.symbol}
                                                    </div>
                                                    <div className="text-xs text-gray-400 truncate">
                                                        {token.name}
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0 ml-2">
                                                    <div className="font-medium text-[#53b991]">
                                                        ${(token.valueUsd || 0).toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        })}
                                                    </div>
                                                    <div className="text-xs text-gray-300">
                                                        {(token.uiAmount || 0).toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 6
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                        ) : (
                            <div className="flex items-center justify-center h-20 text-gray-400">
                                暂无代币持仓
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}