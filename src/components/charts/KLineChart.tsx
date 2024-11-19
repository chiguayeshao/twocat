'use client';

import { useState, useEffect } from 'react';
import { LineChart, TrendingUp, BarChart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';

interface KLineChartProps {
    tokenAddress: string | null;
}

// 添加骨架屏组件
const KLineChartSkeleton = () => (
    <div className="p-4 space-y-4">
        <Skeleton className="h-[220px] w-full bg-gray-500/20 rounded-lg" />
    </div>
);

export function KLineChart({ tokenAddress }: KLineChartProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);

    useEffect(() => {
        if (tokenAddress) {
            setIsLoading(true);
            setIframeLoaded(false);
        }
    }, [tokenAddress]);

    const handleIframeLoad = () => {
        setIsLoading(false);
        setIframeLoaded(true);
    };

    if (!tokenAddress) {
        return (
            <div className="h-full flex items-center justify-center">
                <motion.div
                    className="flex flex-col items-center gap-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* 使用 Lucide 图标组合 */}
                    <div className="relative">
                        <BarChart className="h-16 w-16 text-[#53b991]" />
                        <TrendingUp className="h-8 w-8 text-[#acc97e] absolute -bottom-2 -right-2" />
                    </div>

                    <div className="text-center space-y-1">
                        <h3 className="text-lg font-medium text-gray-300">
                            选择交易记录查看K线
                        </h3>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-full w-full relative bg-discord-secondary/50 rounded-lg overflow-hidden">
            <AnimatePresence mode="wait">
                {isLoading && !iframeLoaded ? (
                    <motion.div
                        key="skeleton"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        <KLineChartSkeleton />
                    </motion.div>
                ) : null}
            </AnimatePresence>

            {tokenAddress && (
                <iframe
                    key={tokenAddress}
                    src={`https://www.gmgn.cc/kline/sol/${tokenAddress}`}
                    className={cn(
                        "absolute inset-0 w-full h-full border-0 bg-transparent",
                        !iframeLoaded && "opacity-0"
                    )}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={handleIframeLoad}
                />
            )}
        </div>
    );
}