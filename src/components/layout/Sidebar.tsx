'use client';

import { cn } from "@/lib/utils";
import {
    HomeIcon,
    WalletIcon,
    LayoutDashboardIcon,
    SettingsIcon,
    PlusCircleIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const channels = [
    { icon: HomeIcon, label: "概览", href: "/" },
    { icon: WalletIcon, label: "钱包监控", href: "/wallet" },
    { icon: LayoutDashboardIcon, label: "数据面板", href: "/dashboard" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-60 h-screen bg-discord-secondary flex flex-col">
            {/* 顶部区域 */}
            <div className="p-3 border-b border-discord-divider">
                <div className="bg-discord-primary rounded-md p-2">
                    <h1 className="text-white font-medium">TwoCat Monitor</h1>
                </div>
            </div>

            {/* 频道列表 */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                    <div className="flex items-center justify-between px-2 py-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">频道</span>
                        <button className="text-muted-foreground hover:text-white">
                            <PlusCircleIcon className="h-4 w-4" />
                        </button>
                    </div>

                    <nav className="mt-2 space-y-0.5">
                        {channels.map((channel) => (
                            <Link
                                key={channel.href}
                                href={channel.href}
                                className={cn(
                                    "flex items-center gap-2 px-2 py-1.5 rounded hover:bg-discord-hover group",
                                    "text-muted-foreground hover:text-white transition-colors",
                                    pathname === channel.href && "bg-discord-hover text-white"
                                )}
                            >
                                <channel.icon className="h-4 w-4" />
                                <span className="text-sm">{channel.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* 设置区域 */}
                <div className="mt-4 p-2">
                    <div className="px-2 py-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">设置</span>
                    </div>
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