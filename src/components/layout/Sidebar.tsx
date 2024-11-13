'use client';

import { cn } from "@/lib/utils";
import {
    HomeIcon,
    WalletIcon,
    LayoutDashboardIcon,
    SettingsIcon,
    InfoIcon,
    UsersIcon,
    ExternalLinkIcon,
    ListIcon
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

// 频道信息类型
type ChannelInfo = {
    name: string;
    description: string;
    creator: string;
    isPublic: boolean;
    memberCount: number;
    monitoredAddresses: string[];
    avatar: string;
};

// 示例频道数据
const channelInfo: ChannelInfo = {
    name: "TwoCat",
    description: "监控 Solana 钱包地址的活动和变化",
    creator: "TwoCat Team",
    isPublic: true,
    memberCount: 1,
    monitoredAddresses: [
        "AKm4qHf7hHYB8RFaVPDDRHs8GqrRh9Bwp4vhNXKtKhqx",
        // ... 其他地址
    ],
    avatar: "/twocat-logo.png",
};

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
const channel: Channel = {
    id: 'general',
    name: 'general',
    href: '/',
    views: [
        { id: 'view1', name: '视图1', href: '/view1' },
        { id: 'view2', name: '视图2', href: '/view2' },
        { id: 'view3', name: '视图3', href: '/view3' },
    ]
};

export function Sidebar() {
    const pathname = usePathname();

    // 判断是否是根路径或 general 路径
    const isGeneralActive = pathname === '/' || pathname === '/general';

    return (
        <div className="w-60 h-screen bg-discord-secondary flex flex-col">
            {/* 顶部区域 */}
            <div className="p-3 border-b border-discord-divider">
                <div className="bg-discord-primary rounded-md p-2">
                    <h1 className="text-white font-medium">{channelInfo.name}</h1>
                </div>
            </div>

            {/* 频道区域 */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                    {/* 频道标题和监控按钮 */}
                    <div className="flex items-center justify-between px-2 py-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">twocat频道</span>
                        <Dialog>
                            <DialogTrigger>
                                <ExternalLinkIcon className="h-4 w-4 text-muted-foreground hover:text-white cursor-pointer" />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>监控地址列表</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-2">
                                    {channelInfo.monitoredAddresses.map((address, index) => (
                                        <div key={index} className="p-2 bg-discord-hover rounded-md">
                                            <code className="text-sm">{address}</code>
                                        </div>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* 频道头像和基本信息 */}
                    <div className="mt-3 px-2">
                        <div className="flex items-start gap-3">
                            {/* 频道头像 */}
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-xl bg-discord-hover overflow-hidden">
                                    {channelInfo.avatar ? (
                                        <img
                                            src={channelInfo.avatar}
                                            alt="Channel Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-discord-hover text-white text-xl font-bold">
                                            {channelInfo.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 频道信息 */}
                            <div className="flex-1 space-y-1.5">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <UsersIcon className="h-4 w-4" />
                                    <span>{channelInfo.memberCount} 位成员</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <ListIcon className="h-4 w-4" />
                                    <Dialog>
                                        <DialogTrigger>
                                            <span className="hover:text-white cursor-pointer">监控地址列表</span>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>监控地址列表</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-2">
                                                {channelInfo.monitoredAddresses.map((address, index) => (
                                                    <div key={index} className="p-2 bg-discord-hover rounded-md">
                                                        <code className="text-sm">{address}</code>
                                                    </div>
                                                ))}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <InfoIcon className="h-4 w-4" />
                                    <span>{channelInfo.isPublic ? '公开频道' : '私密频道'}</span>
                                </div>
                            </div>
                        </div>
                        {/* 创建者信息 - 单独一行 */}
                        <div className="mt-3 text-sm text-muted-foreground border-t border-discord-divider pt-2">
                            创建者: {channelInfo.creator}
                        </div>
                    </div>

                    {/* 导航菜单 */}
                    <nav className="mt-4">
                        {/* 频道标题 */}
                        <div className="px-2 mb-1">
                            <Link
                                href={channel.href}
                                className={cn(
                                    "flex items-center gap-2 px-2 py-1.5 rounded group relative",
                                    "text-muted-foreground transition-colors",
                                    isGeneralActive ? (
                                        "bg-discord-hover text-white"
                                    ) : (
                                        "hover:bg-discord-hover hover:text-white"
                                    )
                                )}
                            >
                                {/* 添加选中指示器 */}
                                {isGeneralActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-r-full" />
                                )}
                                <span className="text-lg font-medium">#</span>
                                <span className="text-sm">{channel.name}</span>
                            </Link>
                        </div>

                        {/* 视图列表 */}
                        <div className="pl-9 space-y-0.5">
                            {channel.views.map((view) => (
                                <Link
                                    key={view.id}
                                    href={view.href}
                                    className={cn(
                                        "flex items-center gap-2 px-2 py-1 rounded group relative",
                                        "text-muted-foreground transition-colors text-sm",
                                        pathname === view.href ? (
                                            "bg-discord-hover text-white"
                                        ) : (
                                            "hover:bg-discord-hover hover:text-white"
                                        )
                                    )}
                                >
                                    {/* 添加选中指示器 */}
                                    {pathname === view.href && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-r-full" />
                                    )}
                                    {view.name}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>
            </div>

            {/* 设置区域 */}
            <div className="mt-auto p-2 border-t border-discord-divider">
                <Link
                    href="/settings"
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

            {/* 用户信息 */}
            <div className="p-2 bg-discord-primary/50">
                <div className="flex items-center gap-2 p-2">
                    <div className="w-8 h-8 rounded-full bg-discord-hover" />
                    <div className="flex-1">
                        <div className="text-sm font-medium text-white">用户名</div>
                        <div className="text-xs text-muted-foreground">已连接钱包</div>
                    </div>
                </div>
            </div>
        </div>
    );
} 