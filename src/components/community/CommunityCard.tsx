'use client';

import { motion } from 'framer-motion';
import { useSpring, animated, to } from '@react-spring/web';
import { Twitter, Globe, Coins, MessageCircle, Send } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface CommunityCardProps {
    name: string;
    avatar: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    tokenAddress?: string;
    dominantColor: [number, number, number];
    imageError: boolean;
}

export function CommunityCard({
    name,
    avatar,
    website,
    twitter,
    telegram,
    discord,
    tokenAddress,
    dominantColor,
    imageError
}: CommunityCardProps) {
    // 进一步减小倾斜效果的幅度
    const [springs, api] = useSpring(() => ({
        from: { xys: [0, 0, 1] as [number, number, number] },
        xys: [0, 0, 1] as [number, number, number],
        config: { mass: 5, tension: 350, friction: 40 }
    }));

    const calc = (x: number, y: number): [number, number, number] => [
        -(y - window.innerHeight / 2) / 80,  // 从40改为80，进一步减小Y轴倾斜
        (x - window.innerWidth / 2) / 80,    // 从40改为80，进一步减小X轴倾斜
        1.02                                 // 从1.05改为1.02，进一步减小缩放效果
    ];

    const trans = (x: number, y: number, s: number): string =>
        `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (tokenAddress) {
            navigator.clipboard.writeText(tokenAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <animated.div
            onMouseMove={({ clientX: x, clientY: y }) => {
                // 只在大屏幕上启用倾斜效果
                if (window.innerWidth > 1024) {
                    api.start({ xys: calc(x, y) });
                }
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
            className="relative p-5 sm:p-6 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl"
        >
            {/* 名称放在顶部 */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl sm:text-2xl font-bold text-white/90 tracking-wide mb-4 sm:mb-6"
            >
                {name}
            </motion.h2>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 lg:gap-8">
                {/* 左侧头像 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white/10 flex-shrink-0"
                >
                    <Image
                        src={avatar}
                        alt={name}
                        width={96}
                        height={96}
                        className="object-cover"
                        unoptimized
                    />
                </motion.div>

                {/* 右侧信息区域 */}
                <div className="flex-1 space-y-3 w-full text-center sm:text-left">
                    {website && (
                        <motion.a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-sm group justify-center sm:justify-start"
                        >
                            <Globe className="w-4 h-4 text-white/60" />
                            <span className="text-white/60 font-medium tracking-wide group-hover:text-[#53b991] transition-colors">
                                {website}
                            </span>
                        </motion.a>
                    )}

                    {twitter && (
                        <motion.a
                            href={twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-sm group justify-center sm:justify-start"
                        >
                            <Twitter className="w-4 h-4 text-white/60" />
                            <span className="text-white/60 font-medium tracking-wide group-hover:text-[#53b991] transition-colors">
                                {twitter}
                            </span>
                        </motion.a>
                    )}

                    {telegram && (
                        <motion.a
                            href={telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-sm group justify-center sm:justify-start"
                        >
                            <Send className="w-4 h-4 text-white/60" />
                            <span className="text-white/60 font-medium tracking-wide group-hover:text-[#53b991] transition-colors">
                                {telegram}
                            </span>
                        </motion.a>
                    )}

                    {discord && (
                        <motion.a
                            href={discord}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-sm group justify-center sm:justify-start"
                        >
                            <MessageCircle className="w-4 h-4 text-white/60" />
                            <span className="text-white/60 font-medium tracking-wide group-hover:text-[#53b991] transition-colors">
                                {discord}
                            </span>
                        </motion.a>
                    )}

                    {tokenAddress && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-sm relative justify-center sm:justify-start flex-wrap"
                        >
                            <Coins className="w-4 h-4 text-white/60 flex-shrink-0" />
                            <span className="text-white/60 flex-shrink-0">CA:</span>
                            <span
                                onClick={handleCopy}
                                className="font-mono text-white/60 cursor-pointer hover:text-[#53b991] transition-colors truncate max-w-[200px] sm:max-w-none"
                            >
                                {tokenAddress}
                            </span>
                            {copied && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 sm:right-0 top-full mt-1 text-xs text-[#53b991] bg-black/20 px-2 py-1 rounded whitespace-nowrap"
                                >
                                    已复制
                                </motion.span>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* 装饰元素 */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        </animated.div>
    );
}