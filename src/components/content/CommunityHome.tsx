'use client';

import { motion } from 'framer-motion';
import { useSpring, animated, to } from '@react-spring/web';
import { Twitter, Globe, Coins, MessageCircle, Send } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import ColorThief from 'colorthief';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { StatsCard } from '@/components/community/StatsCard';
import { TreasurySummary } from '@/components/community/TreasurySummary';
import { MemberCard } from '@/components/community/MemberCard';

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

    // 修复卡片倾斜效果的类型
    const [springs, api] = useSpring(() => ({
        from: { xys: [0, 0, 1] as [number, number, number] },
        xys: [0, 0, 1] as [number, number, number],
        config: { mass: 5, tension: 350, friction: 40 }
    }));

    const calc = (x: number, y: number): [number, number, number] => [
        -(y - window.innerHeight / 2) / 20,
        (x - window.innerWidth / 2) / 20,
        1.1
    ];

    const trans = (x: number, y: number, s: number): string =>
        `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

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

    // 添加复制状态
    const [copied, setCopied] = useState(false);

    // 添加复制处理函数
    const handleCopy = () => {
        if (roomInfo.tokenAddress) {
            navigator.clipboard.writeText(roomInfo.tokenAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 pt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start w-full">
                    {/* 社区名片 - 左侧 */}
                    <div className="w-full max-w-2xl">
                        <animated.div
                            onMouseMove={({ clientX: x, clientY: y }) => {
                                api.start({ xys: calc(x, y) });
                            }}
                            onMouseLeave={() => api.start({ xys: [0, 0, 1] })}
                            style={{
                                transform: to(springs.xys, trans),
                                background: !imageError
                                    ? `linear-gradient(135deg, 
                                        rgba(${dominantColor[0]},${dominantColor[1]},${dominantColor[2]},0.15) 0%,
                                        rgba(${dominantColor[0]},${dominantColor[1]},${dominantColor[2]},0.05) 100%)`
                                    : 'linear-gradient(135deg, rgba(83,185,145,0.15) 0%, rgba(83,185,145,0.05) 100%)',
                            }}
                            className="relative p-8 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl h-[280px]"
                        >
                            {/* 名称放在顶部 */}
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-2xl font-bold text-white/90 tracking-wide mb-6"
                                style={{
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                }}
                            >
                                {roomInfo.name}
                            </motion.h2>

                            <div className="flex items-start gap-8 h-full">
                                {/* 左侧头像 */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 flex-shrink-0"
                                >
                                    <Image
                                        src={roomInfo.avatar}
                                        alt={roomInfo.name}
                                        width={96}
                                        height={96}
                                        className="object-cover"
                                        unoptimized
                                    />
                                </motion.div>

                                {/* 右侧信息区域 */}
                                <div className="flex-1 space-y-4">
                                    {/* 网站链接 */}
                                    <motion.a
                                        href={roomInfo.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 text-sm group"
                                    >
                                        <Globe className="w-4 h-4 text-white/60" />
                                        <span className="text-white/60 font-medium tracking-wide group-hover:text-white/80 transition-colors">
                                            {roomInfo.website}
                                        </span>
                                    </motion.a>

                                    {/* Twitter链接 */}
                                    <motion.a
                                        href={roomInfo.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 text-sm group"
                                    >
                                        <Twitter className="w-4 h-4 text-white/60" />
                                        <span className="text-white/60 font-medium tracking-wide group-hover:text-white/80 transition-colors">
                                            {roomInfo.twitter}
                                        </span>
                                    </motion.a>

                                    {/* Telegram链接 */}
                                    <motion.a
                                        href={roomInfo.telegram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 text-sm group"
                                    >
                                        <Send className="w-4 h-4 text-white/60" />
                                        <span className="text-white/60 font-medium tracking-wide group-hover:text-white/80 transition-colors">
                                            {roomInfo.telegram}
                                        </span>
                                    </motion.a>

                                    {/* Discord链接 */}
                                    <motion.a
                                        href={roomInfo.discord}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 text-sm group"
                                    >
                                        <MessageCircle className="w-4 h-4 text-white/60" />
                                        <span className="text-white/60 font-medium tracking-wide group-hover:text-white/80 transition-colors">
                                            {roomInfo.discord}
                                        </span>
                                    </motion.a>

                                    {/* Token地址 */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 text-sm relative"
                                    >
                                        <Coins className="w-4 h-4 text-white/60" />
                                        <span className="text-white/60">CA:</span>
                                        <span
                                            onClick={handleCopy}
                                            className="font-mono text-white/60 cursor-pointer hover:text-white/80 transition-colors"
                                        >
                                            {roomInfo.tokenAddress}
                                        </span>
                                        {copied && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute -right-16 text-xs text-green-400 bg-black/20 px-2 py-1 rounded"
                                            >
                                                已复制
                                            </motion.span>
                                        )}
                                    </motion.div>
                                </div>
                            </div>

                            {/* 装饰元素 */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                        </animated.div>
                    </div>

                    {/* 社区标语 - 右侧 */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-right"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white/90 leading-tight whitespace-nowrap text-left">
                            {roomInfo.slogan}
                        </h1>
                    </motion.div>
                </div>

                {/* 社区金库概览 */}
                <TreasurySummary
                    balance="$42,069"
                    dailyVolume="$69,420"
                    weeklyIncome="$4,200"
                />

                {/* 社区数据统计 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
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

                {/* 社区成员展示 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-16 mb-16"
                >
                    <h2 className="text-3xl font-bold text-white/90 mb-8 flex items-center gap-2">
                        <span>活跃成员</span>
                        <span className="text-2xl">👥</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <MemberCard
                            avatar="/member1.jpg"
                            name="Meme Lord"
                            role="创始人"
                            contribution="420 个 meme"
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// 信息项组件
function InfoItem({ icon, label, value, copyable = false }: {
    icon: React.ReactNode;
    label: string;
    value?: string;
    copyable?: boolean;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (value) {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!value) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-sm"
        >
            <span className="text-white/60">{icon}</span>
            <span className="text-white/40">{label}:</span>
            <span
                className={cn(
                    "text-white/80 font-medium tracking-wide",
                    "bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/70",
                    copyable && "cursor-pointer hover:opacity-80 transition-opacity"
                )}
                onClick={copyable ? handleCopy : undefined}
                style={{
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
            >
                {value}
            </span>
            {copyable && copied && (
                <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-green-400"
                >
                    已复制
                </motion.span>
            )}
        </motion.div>
    );
}

// TokenomicsItem 组件
interface TokenomicsItemProps {
    label: string;
    percentage: number;
    description: string;
}

function TokenomicsItem({ label, percentage, description }: TokenomicsItemProps) {
    return (
        <motion.div
            whileHover={{ x: 5 }}
            className="bg-white/5 p-4 rounded-lg border border-white/10"
        >
            <div className="flex justify-between items-center mb-2">
                <span className="text-white/80 font-medium">{label}</span>
                <span className="text-white/90 font-bold">{percentage}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <p className="text-white/60 text-sm">{description}</p>
        </motion.div>
    );
}

// RoadmapItem 组件
interface RoadmapItemProps {
    phase: string;
    title: string;
    items: string[];
    completed?: boolean;
}

function RoadmapItem({ phase, title, items, completed }: RoadmapItemProps) {
    return (
        <motion.div
            whileHover={{ x: 10 }}
            className="relative pl-8 pb-12 ml-[50%]"
        >
            {/* 时间线节点 */}
            <div className={cn(
                "absolute left-0 w-4 h-4 rounded-full transform -translate-x-1/2",
                completed ? "bg-green-400" : "bg-white/20"
            )} />

            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="text-white/60 text-sm mb-2">{phase}</div>
                <h3 className="text-xl font-bold text-white/90 mb-4">{title}</h3>
                <ul className="space-y-2">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-2 text-white/80"
                        >
                            {completed ? "✅" : "⭕"} {item}
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}