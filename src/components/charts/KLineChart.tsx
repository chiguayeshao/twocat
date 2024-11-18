'use client';

import { useState, useEffect } from 'react';
import { BarChart2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';

interface KLineChartProps {
    tokenAddress: string | null;
}

// 添加骨架屏组件
const KLineChartSkeleton = () => (
    <div className="p-4 space-y-4">
        {/* K线图区域骨架屏 */}
        <div className="space-y-2">

            {/* K线图主体骨架屏 */}
            <div className="space-y-2">
                <Skeleton className="h-[220px] w-full bg-gray-500/20 rounded-lg" />
            </div>
        </div>
    </div>
);

export function KLineChart({ tokenAddress }: KLineChartProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);

    useEffect(() => {
        // 当 tokenAddress 改变时重置状态
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
            <div className="h-full flex items-center justify-center p-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="empty-kline"
                        className={cn(
                            "w-full flex flex-col items-center justify-center",
                            "bg-[#2f2f2f] rounded-lg p-8",
                            "space-y-4"
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: "linear"
                        }}
                    >
                        <BarChart2 className="h-16 w-16 text-gray-400" />
                        <div className="space-y-2 text-center">
                            <h3 className="text-xl font-medium text-gray-300">
                                查看K线图
                            </h3>
                            <p className="text-sm text-gray-400 max-w-[240px] mx-auto leading-relaxed">
                                点击交易记录查看代币K线图
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
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