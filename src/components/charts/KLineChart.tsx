'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface KLineChartProps {
    tokenAddress: string | null;
}

export function KLineChart({ tokenAddress }: KLineChartProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (tokenAddress) {
            setIsLoading(true);
        }
    }, [tokenAddress]);

    if (!tokenAddress) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400 bg-discord-secondary/50 rounded-lg">
                点击交易记录查看K线图
            </div>
        );
    }

    return (
        <div className="h-full w-full relative bg-discord-secondary/50 rounded-lg overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-discord-secondary/50 backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        <span className="text-sm text-gray-400">加载中...</span>
                    </div>
                </div>
            )}
            <iframe
                key={tokenAddress}
                src={`https://www.gmgn.cc/kline/sol/${tokenAddress}`}
                className="absolute inset-0 w-full h-full border-0 bg-transparent"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
}