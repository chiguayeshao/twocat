'use client';

import { motion } from 'framer-motion';
import { useSpring, animated, to } from '@react-spring/web';
import { Twitter, Globe, Coins, MessageCircle, Send, Users, Check } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from '@/hooks/use-toast';
import { JoinCommunityDialog } from './JoinCommunityDialog';

interface CommunityCardProps {
    roomId: string;
    name: string;
    avatar: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    ca?: string;
    imageError: boolean;
}

export function CommunityCard({
    roomId,
    name,
    avatar,
    website,
    twitter,
    telegram,
    discord,
    ca,
    imageError
}: CommunityCardProps) {
    const { connected, publicKey } = useWallet();
    const { toast } = useToast();
    const [isJoining, setIsJoining] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [copied, setCopied] = useState(false);

    // 检查成员身份
    useEffect(() => {
        const checkMembership = async () => {
            if (!connected || !publicKey) {
                setIsChecking(false);
                return;
            }

            try {
                const response = await fetch(
                    `/api/twocat-core/rooms/check-membership?roomId=${roomId}&walletAddress=${publicKey.toString()}`
                );
                const data = await response.json();
                setIsMember(data.data?.isMember || false);
            } catch (error) {
                console.error('Check membership error:', error);
            } finally {
                setIsChecking(false);
            }
        };

        checkMembership();
    }, [connected, publicKey, roomId]);

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

    const handleCopy = () => {
        if (ca) {
            navigator.clipboard.writeText(ca);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleJoinClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!connected) {
            toast({
                title: "请先连接钱包",
                description: "加入社区需要先连接钱包",
                variant: "destructive",
            });
            return;
        }
        setIsDialogOpen(true);
    };

    const handleJoinConfirm = async () => {
        if (!connected || !publicKey) return;

        setIsJoining(true);
        try {
            const response = await fetch('/api/twocat-core/rooms/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    roomId,
                    walletAddress: publicKey.toString(),
                }),
            });

            const data = await response.json();

            if (data.code === "ALREADY_MEMBER") {
                toast({
                    title: "已是社区成员",
                    description: data.message,
                    variant: "default",
                });
                setIsDialogOpen(false);
                return;
            }

            if (!data.success) {
                throw new Error(data.message || '加入失败');
            }

            toast({
                title: "加入成功",
                description: "欢迎加入社区！",
                variant: "success",
            });
            setIsDialogOpen(false);

        } catch (error) {
            console.error('Join community error:', error);
            toast({
                title: "加入失败",
                description: error instanceof Error ? error.message : "请稍后重试",
                variant: "destructive",
            });
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <>
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
                    background: 'linear-gradient(135deg, rgba(83,185,145,0.15) 0%, rgba(83,185,145,0.05) 100%)',
                    height: 'calc(100% + 1px)'
                }}
                className="relative p-5 sm:p-6 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl"
            >
                {/* 加入社区按钮 - 右上角 */}
                <motion.button
                    onClick={handleJoinClick}
                    disabled={isJoining || isChecking || isMember}
                    className="absolute top-4 right-4 z-10"
                    whileHover={{ scale: isMember ? 1 : 1.02 }}
                    whileTap={{ scale: isMember ? 1 : 0.98 }}
                >
                    <div className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-lg
                        ${isMember
                            ? 'bg-[#53b991]/10 cursor-default'
                            : 'bg-gradient-to-r from-[#53b991]/10 to-[#53b991]/20'
                        }
                        border border-[#53b991]/20 
                        ${!isMember && 'hover:border-[#53b991]/30'}
                        transition-all duration-300
                        ${(!connected || isChecking) ? 'opacity-50 cursor-not-allowed' : ''}
                    `}>
                        {isChecking ? (
                            <div className="w-4 h-4 border-2 border-[#53b991] border-t-transparent rounded-full animate-spin" />
                        ) : isJoining ? (
                            <div className="w-4 h-4 border-2 border-[#53b991] border-t-transparent rounded-full animate-spin" />
                        ) : isMember ? (
                            <Check className="w-4 h-4 text-[#53b991]" />
                        ) : (
                            <Users className="w-4 h-4 text-[#53b991]" />
                        )}
                        <span className="text-sm font-medium text-[#53b991]">
                            {isChecking ? '检查中...' :
                                isJoining ? '加入中...' :
                                    isMember ? '已加入' : '加入社区'}
                        </span>
                    </div>
                </motion.button>

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

                        {ca && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-sm relative justify-center sm:justify-start"
                            >
                                <span className="text-white/60 flex-shrink-0">CA:</span>
                                <span
                                    onClick={handleCopy}
                                    className="font-mono text-white/60 cursor-pointer hover:text-[#53b991] transition-colors truncate max-w-[200px] sm:max-w-none"
                                >
                                    {ca}
                                </span>
                                {copied && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-xs text-[#53b991] bg-black/20 px-2 py-1 rounded whitespace-nowrap ml-2"
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

            {!isMember && (
                <JoinCommunityDialog
                    isOpen={isDialogOpen}
                    onClose={() => !isJoining && setIsDialogOpen(false)}
                    onConfirm={handleJoinConfirm}
                    isJoining={isJoining}
                    communityName={name}
                />
            )}
        </>
    );
}