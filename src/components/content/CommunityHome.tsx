'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ColorThief from 'colorthief';
import { CommunityCard } from '@/components/community/CommunityCard';
import { CommunitySlogan } from '@/components/community/CommunitySlogan';
import { TreasurySummary } from '@/components/community/TreasurySummary';
import { StatsCard } from '@/components/community/StatsCard';
import { CommunityStory } from '@/components/community/CommunityStory';

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
                    <CommunitySlogan slogan={roomInfo.slogan} />
                </div>

                {/* 社区故事 */}
                <div className="mt-6 sm:mt-12">
                    <CommunityStory
                        title="Two Cat 的梗图故事"
                        description="源于一个表情包，成就一个充满欢乐的社区"
                        stories={[
                            {
                                emoji: "😺",
                                title: "两只猫的诞生",
                                content: "一切开始于一个爆火的猫咪表情包，两只可爱的猫咪让每个人都会心一笑。我们想，为什么不让这份快乐持续下去呢？"
                            },
                            {
                                emoji: "🎭",
                                title: "玩梗大师",
                                content: "在这里，人人都是玩梗大师。我们用表情包交流，用梗图表达，让社交变得更有趣、更轻松。"
                            },
                            {
                                emoji: "🌈",
                                title: "快乐社区",
                                content: "Two Cat 不仅是一个代币，更是一个分享快乐的社区。在这里，我们用欢笑连接彼此，用创意传递价值。"
                            },
                            {
                                emoji: "🎮",
                                title: "玩出未来",
                                content: "谁说金融就要很严肃？我们用游戏化的方式重新定义社区互动，让每个人都能快乐参与。"
                            }
                        ]}
                    />
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