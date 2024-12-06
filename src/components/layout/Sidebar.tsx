'use client';

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import {
    HomeIcon,
    WalletIcon,
    LayoutDashboardIcon,
    SettingsIcon,
    InfoIcon,
    UsersIcon,
    ExternalLinkIcon,
    ListIcon,
    Copy,
    ExternalLink,
    Check,
    X,
    Zap,
    MessageSquare,
    Rocket,
    ImageIcon,
    Eye,
    BotIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import { ContentType } from '@/types/content';
import { Room, Treasury, CommunityLevel } from '@/types/room';

// 定义视图类型
type View = {
    id: string;
    name: string;
    href: string;
};

// 定义频道类型
type Channel = {
    id: string;
    name: string;
    href: string;
    views: View[];
};

// 频道及其视图数据
const channels = [
    {
        id: ContentType.COMMUNITY_HOME,
        name: '社区首页',
        href: '/home',
        icon: <HomeIcon className="h-4 w-4" />,
        isSpecial: false,
    },
    {
        id: ContentType.QUICK_TRADE,
        name: '快速交易',
        href: '/quick-trade',
        icon: <Zap className="h-4 w-4" />,
        isSpecial: true,
    },
    {
        id: ContentType.CHINESE_TWEETS,
        name: '中文推文',
        href: '/cn-tweets',
        icon: <MessageSquare className="h-4 w-4" />,
    },
    {
        id: ContentType.ENGLISH_TWEETS,
        name: '英文推文',
        href: '/en-tweets',
        icon: <MessageSquare className="h-4 w-4" />,
    },
    {
        id: 'boost-addresses',
        name: '冲推地址',
        href: '/boost-addresses',
        icon: <Rocket className="h-4 w-4" />,
    },
    {
        id: 'meme-gallery',
        name: '社区图库',
        href: '/meme-gallery',
        icon: <ImageIcon className="h-4 w-4" />,
    },
    {
        id: 'tweet-monitor',
        name: '推文监控',
        href: '/tweet-monitor',
        icon: <Eye className="h-4 w-4" />,
    },
    {
        id: 'ai-agents',
        name: 'AI 代理',
        href: '/ai-agents',
        icon: <BotIcon className="h-4 w-4" />,
    },
];

interface MonitoredWallet {
    _id: string;
    address: string;
    description: string;
}

interface SidebarProps {
    roomId: string;
    activeContent: ContentType;
    onContentChange: (content: ContentType) => void;
    onClose?: () => void;
    room: Room | null;
    treasury: Treasury | null;
    communityLevel: CommunityLevel | null;
    loading: boolean;
}

export function Sidebar({
    roomId,
    activeContent = ContentType.COMMUNITY_HOME,
    onContentChange,
    onClose,
    room,
    treasury,
    communityLevel,
    loading
}: SidebarProps) {
    const pathname = usePathname();
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        // 在组件挂载时读取存储的 activeContent
        const storedActiveContent = localStorage.getItem('activeContent');
        if (storedActiveContent) {
            onContentChange(storedActiveContent as ContentType);
            localStorage.removeItem('activeContent'); // 清除存储的值
        }
    }, [onContentChange]);

    // 处理钱包地址显示
    const formatWalletAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    // 判断是否是根路径或 general 路径
    const isGeneralActive = pathname === '/' || pathname === '/general';

    const handleCopyLink = () => {
        const roomLink = `https://www.twocat.fun/${room?._id}`;
        navigator.clipboard.writeText(roomLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // 修改链接生成函数
    const getChannelLink = (href: string) => {
        // 快速交易直接使用 roomId 路径
        if (href === '/quick-trade') {
            return `/${roomId}`;
        }
        // 其他页面需要带上完整路径
        return `/${roomId}${href}`;
    };

    return (
        <div className="w-full h-screen bg-discord-secondary flex flex-col">
            {/* 移动端关闭按钮 */}
            <div className="lg:hidden p-4 flex justify-end border-b border-discord-divider">
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-discord-hover rounded-md transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* 顶部区域 */}
            <div className="p-3 border-b border-discord-divider">
                <div className="bg-discord-primary rounded-md p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="rounded-full overflow-hidden">
                            <Image
                                src="/images/twocatlogo.jpg"
                                alt="Two Cat Logo"
                                width={28}
                                height={28}
                                className="object-cover"
                            />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[15px]">Two Cat</span>
                            <div className="px-1.5 py-0.5 bg-[#53b991]/10 rounded-md border border-[#53b991]/20">
                                <span className="text-xs font-medium text-[#53b991]">BETA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                    {/* 频道标题和监控按钮 */}
                    <div className="flex items-center justify-between px-2 py-1">
                        {loading ? (
                            <Skeleton className="h-4 w-24 bg-gray-500/20" />
                        ) : (
                            <span className="text-xs font-semibold text-muted-foreground uppercase">
                                {room?.roomName}
                            </span>
                        )}
                        <Dialog>
                            <DialogTrigger>
                                <ExternalLinkIcon className="h-4 w-4 text-muted-foreground hover:text-white cursor-pointer" />
                            </DialogTrigger>
                            <DialogContent className="bg-discord-secondary border-discord-divider">
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-medium text-white">分享房间</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 p-3 bg-[#2f2f2f] rounded-lg">
                                        <span className="flex-1 text-sm text-[#acc97e] truncate">
                                            {`https://www.twocat.fun/${room?._id}`}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-discord-primary/30"
                                            onClick={handleCopyLink}
                                        >
                                            {isCopied ? (
                                                <Check className="h-4 w-4 text-green-400" />
                                            ) : (
                                                <Copy className="h-4 w-4 text-gray-400" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* 频道头像和基本信息 */}
                    <div className="mt-3 px-2">
                        <div className="flex items-start gap-3">
                            {/* 频道头像 */}
                            <div className="flex-shrink-0">
                                {loading ? (
                                    <Skeleton className="w-16 h-16 rounded-xl bg-gray-500/20" />
                                ) : (
                                    <div className="w-16 h-16 rounded-xl bg-discord-hover overflow-hidden">
                                        {room?.avatarUrl ? (
                                            <img
                                                src={room.avatarUrl}
                                                alt="Channel Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-discord-hover text-white text-xl font-bold">
                                                {room?.roomName.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* 频道信息 */}
                            <div className="flex-1 space-y-1.5">
                                {loading ? (
                                    <>
                                        <Skeleton className="h-4 w-24 bg-gray-500/20" />
                                        <Skeleton className="h-4 w-32 bg-gray-500/20" />
                                        <Skeleton className="h-4 w-28 bg-gray-500/20" />
                                    </>
                                ) : (
                                    <>
                                        {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <UsersIcon className="h-4 w-4" />
                                            <span>{room?.memberCount || 0} 位成员</span>
                                        </div> */}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <ListIcon className="h-4 w-4" />
                                            <Dialog>
                                                <DialogTrigger>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
                                                        <span>监控地址列表</span>
                                                    </div>
                                                </DialogTrigger>
                                                <DialogContent className="bg-discord-secondary border-discord-divider">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-lg font-medium text-white">监控地址列表</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                                        {room?.monitoredWallets.length === 0 ? (
                                                            <div className="flex items-center justify-center h-24 text-gray-400">
                                                                暂无监控地址
                                                            </div>
                                                        ) : (
                                                            room?.monitoredWallets.map((wallet, index) => (
                                                                <motion.div
                                                                    key={wallet._id}
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{
                                                                        duration: 0.2,
                                                                        delay: index * 0.05,
                                                                        ease: "easeOut"
                                                                    }}
                                                                    className="flex flex-col p-2 rounded-lg bg-[#2f2f2f] hover:bg-[#353535] 
                                                                             transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
                                                                >
                                                                    {/* 钱包地址行 */}
                                                                    <div className="flex items-center gap-2">
                                                                        {/* 头像 */}
                                                                        <div className="shrink-0">
                                                                            <div className="w-7 h-7 rounded-full bg-discord-primary/30 
                                                                                  flex items-center justify-center">
                                                                                <WalletIcon className="h-4 w-4 text-gray-400" />
                                                                            </div>
                                                                        </div>

                                                                        {/* 地址信息 */}
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-center justify-between">
                                                                                <button
                                                                                    onClick={() => window.open(`https://solscan.io/account/${wallet.address}`, '_blank')}
                                                                                    className="text-sm font-medium text-[#53b991] hover:underline"
                                                                                >
                                                                                    {formatWalletAddress(wallet.address)}
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => window.open(`https://solscan.io/account/${wallet.address}`, '_blank')}
                                                                                    className="text-gray-400 hover:text-white"
                                                                                >
                                                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* 描述信息 */}
                                                                    {wallet.description && (
                                                                        <div className="mt-1 ml-9 text-xs text-gray-400">
                                                                            {wallet.description}
                                                                        </div>
                                                                    )}
                                                                </motion.div>
                                                            ))
                                                        )}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <InfoIcon className="h-4 w-4" />
                                            <span>{room?.isPrivate ? '私密社区' : '公开社区'}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        {/* 创建者信息 */}
                        {loading ? (
                            <div className="mt-3 pt-2 border-t border-discord-divider">
                                <Skeleton className="h-4 w-36 bg-gray-500/20" />
                            </div>
                        ) : (
                            <div className="mt-3 text-sm text-muted-foreground border-t border-discord-divider pt-2">
                                创建者: {formatWalletAddress(room?.creatorWallet || '')}
                            </div>
                        )}
                    </div>

                    {/* 导航菜单 */}
                    <nav className="mt-4 space-y-1">
                        {/* 快交易按钮 */}
                        <div className="px-2 mb-4">
                            <button
                                onClick={() => onContentChange(ContentType.QUICK_TRADE)}
                                className={cn(
                                    "flex items-center gap-2.5 px-3 py-2 rounded-md group relative overflow-hidden w-full",
                                    "transition-all duration-200",
                                    activeContent === ContentType.QUICK_TRADE
                                        ? "bg-gradient-to-r from-[#53b991] to-[#9ad499] text-white shadow-md"
                                        : "text-[#53b991] hover:bg-[#53b991]/10 hover:shadow-sm",
                                    "border border-[#53b991]/20"
                                )}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Zap className="h-4 w-4" />
                                    <span className="text-sm font-medium">快速交易</span>
                                </div>
                                {activeContent === ContentType.QUICK_TRADE && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 bg-gradient-to-r from-[#53b991]/10 to-[#9ad499]/10"
                                    />
                                )}
                            </button>
                        </div>

                        {/* 分割线 */}
                        <div className="h-px bg-discord-divider mx-2 my-2" />

                        {/* 其他导航项 */}
                        {channels.filter(channel => !channel.isSpecial).map((channel) => (
                            <div key={channel.id} className="px-2">
                                <button
                                    onClick={() => {
                                        console.log('Clicked channel:', channel.id);
                                        onContentChange(channel.id as ContentType);
                                    }}
                                    className={cn(
                                        "flex items-center w-full px-3 py-2.5 rounded-md relative overflow-hidden",
                                        "transition-all duration-200",
                                        activeContent === channel.id
                                            ? "bg-[#2f2f2f] text-white font-medium"
                                            : "text-muted-foreground hover:bg-[#2f2f2f]/50 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        {channel.icon}
                                        <span className="text-[14px]">{channel.name}</span>
                                    </div>
                                    {activeContent === channel.id && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="absolute inset-0 border-l-[3px] border-[#53b991]"
                                        />
                                    )}
                                </button>
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {/* 设置区域 */}
            <div className="mt-auto p-2 border-t border-discord-divider">
                <Link
                    href="/"
                    className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded hover:bg-discord-hover group w-full",
                        "text-muted-foreground hover:text-white transition-colors",
                        pathname === '/settings' && "bg-discord-hover text-white"
                    )}
                >
                    <SettingsIcon className="h-4 w-4" />
                    <span className="text-sm">设置</span>
                </Link>
            </div>
        </div>
    );
} 