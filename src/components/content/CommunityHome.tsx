'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ColorThief from 'colorthief';
import { CommunityCard } from '@/components/community/CommunityCard';
import { TreasurySummary } from '@/components/community/TreasurySummary';
import { StatsCard } from '@/components/community/StatsCard';

interface RoomInfo {
    name: string;
    slogan: string;
    avatar: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    tokenAddress?: string;
}

export function CommunityHome({ roomId }: { roomId: string }) {
    const [roomInfo, setRoomInfo] = useState<RoomInfo>({
        name: "Two Cat",
        slogan: "We're All Gonna Make It! 🚀",
        avatar: "https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1732023482786-twocatlogo.jpg",
        website: "https://example.com",
        twitter: "https://twitter.com/example",
        telegram: "https://t.me/example",
        discord: "https://discord.gg/example",
        tokenAddress: "GxdTh6udNstGmLLk9ztBb6bkrms7oLbrJp5yzUaVpump"
    });

    const [dominantColor, setDominantColor] = useState<[number, number, number]>([83, 185, 145]);
    const [imageError, setImageError] = useState(false);

    // 获取图片主色调
    useEffect(() => {
        const colorThief = new ColorThief();
        const img = document.createElement('img') as HTMLImageElement;
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            try {
                const color = colorThief.getColor(img);
                if (color) {
                    setDominantColor(color);
                    setImageError(false);
                }
            } catch (error: unknown) {
                console.error('获取主题色失败:', error instanceof Error ? error.message : error);
                setImageError(true);
            }
        };

        img.onerror = (event: Event | string) => {
            console.error('图片加载失败:', event);
            setImageError(true);
        };

        img.src = roomInfo.avatar;

        // 清理函数
        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [roomInfo.avatar]);

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16">
                {/* 顶部卡片区域 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start w-full">
                    {/* 社区名片 */}
                    <CommunityCard
                        name={roomInfo.name}
                        avatar={roomInfo.avatar}
                        website={roomInfo.website}
                        twitter={roomInfo.twitter}
                        telegram={roomInfo.telegram}
                        discord={roomInfo.discord}
                        tokenAddress={roomInfo.tokenAddress}
                        dominantColor={dominantColor}
                        imageError={imageError}
                    />

                    {/* 社区标语和理念 */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="h-auto lg:h-[280px] flex flex-col justify-between p-6 sm:p-8 bg-white/5 rounded-2xl border border-white/10"
                    >
                        {/* 主标语 */}
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl sm:text-3xl font-bold text-white/90 leading-tight mb-6 lg:mb-0"
                        >
                            {roomInfo.slogan}
                        </motion.h1>

                        {/* 社区理念描述 */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col gap-4"
                        >
                            {[
                                {
                                    icon: "🌈",
                                    text: "社区驱动，人人都是创作者"
                                },
                                {
                                    icon: "💎",
                                    text: "持有即是身份，价值共同创造"
                                },
                                {
                                    icon: "🎮",
                                    text: "玩梗创造快乐，社交铸就未来"
                                },
                                {
                                    icon: "🤝",
                                    text: "共建共赢生态，财富共同分享"
                                }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + index * 0.1 }}
                                    className="flex items-center gap-3 group"
                                >
                                    <span className="text-xl group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </span>
                                    <span className="text-white/80 group-hover:text-white/100 transition-colors">
                                        {item.text}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* 社区金库概览 */}
                <div className="mt-6 sm:mt-12">
                    <TreasurySummary
                        balance="$42,069"
                        dailyVolume="$69,420"
                        weeklyIncome="$4,200"
                    />
                </div>

                {/* 社区数据统计 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <StatsCard
                        title="持有人数"
                        value="42,069"
                        icon="🦍"
                        change="+420%"
                    />
                    <StatsCard
                        title="市值"
                        value="$1.69M"
                        icon="💎"
                        change="+69%"
                    />
                    <StatsCard
                        title="交易量"
                        value="$420K"
                        icon="📊"
                        change="+42%"
                    />
                    <StatsCard
                        title="流动性"
                        value="$690K"
                        icon="💧"
                        change="+169%"
                    />
                </motion.div>
            </div>
        </div>
    );
}