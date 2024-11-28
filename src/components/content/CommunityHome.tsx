'use client';

import { motion } from 'framer-motion';
import { useSpring, animated, to } from '@react-spring/web';
import { Twitter, Globe, Coins } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import ColorThief from 'colorthief';
import Image from 'next/image';

interface RoomInfo {
    name: string;
    slogan: string;
    avatar: string;
    website?: string;
    twitter?: string;
    tokenAddress?: string;
}

export function CommunityHome({ roomId }: { roomId: string }) {
    const [roomInfo, setRoomInfo] = useState<RoomInfo>({
        name: "Two Cat",
        slogan: "We're All Gonna Make It! 🚀",
        avatar: "https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1732023482786-twocatlogo.jpg",
        website: "https://example.com",
        twitter: "https://twitter.com/example",
        tokenAddress: "0x1234...5678"
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

    return (
        <div className="min-h-screen bg-discord-primary overflow-hidden">
            {/* 社区标语 */}
            <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#53b991]/20 to-discord-primary" />
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold text-center text-white z-10 px-4"
                >
                    {roomInfo.slogan}
                </motion.h1>
            </div>

            {/* 社区名片 */}
            <div className="max-w-4xl mx-auto px-4 -mt-20">
                <animated.div
                    onMouseMove={({ clientX: x, clientY: y }) => {
                        api.start({ xys: calc(x, y) });
                    }}
                    onMouseLeave={() => api.start({ xys: [0, 0, 1] })}
                    style={{
                        transform: to(springs.xys, trans),
                        background: !imageError
                            ? `linear-gradient(135deg, 
                                rgba(${dominantColor[0]},${dominantColor[1]},${dominantColor[2]},0.2) 0%,
                                rgba(${dominantColor[0]},${dominantColor[1]},${dominantColor[2]},0.1) 100%)`
                            : 'linear-gradient(135deg, rgba(83,185,145,0.2) 0%, rgba(83,185,145,0.1) 100%)',
                    }}
                    className="relative p-6 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl"
                >
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* 头像 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10"
                        >
                            <Image
                                src={roomInfo.avatar}
                                alt={roomInfo.name}
                                width={128}
                                height={128}
                                className="object-cover"
                                unoptimized
                            />
                        </motion.div>

                        {/* 社区信息 */}
                        <div className="flex-1 text-center md:text-left">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl font-bold text-white mb-4"
                            >
                                {roomInfo.name}
                            </motion.h2>

                            {/* 链接区域 */}
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <SocialLink
                                    icon={<Globe className="w-4 h-4" />}
                                    text="官网"
                                    href={roomInfo.website}
                                />
                                <SocialLink
                                    icon={<Twitter className="w-4 h-4" />}
                                    text="Twitter"
                                    href={roomInfo.twitter}
                                />
                                <SocialLink
                                    icon={<Coins className="w-4 h-4" />}
                                    text="Token"
                                    href={`https://etherscan.io/token/${roomInfo.tokenAddress}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 装饰元素 */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                </animated.div>
            </div>

            {/* 其他内容可以在这里继续添加 */}
        </div>
    );
}

// 社交链接组件
function SocialLink({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 
                 text-white/90 text-sm font-medium transition-all
                 border border-white/10 backdrop-blur-sm"
        >
            {icon}
            <span>{text}</span>
        </motion.a>
    );
}