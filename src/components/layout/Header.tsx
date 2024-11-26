'use client';

import { UnifiedWalletButton } from '@jup-ag/wallet-adapter';
import { Skeleton } from "@/components/ui/skeleton";
import { Info, Bell, Search, Menu } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Room {
    _id: string;
    roomName: string;
    description: string;
    isPrivate: boolean;
    creatorWallet: string;
    memberCount: number;
    members: string[];
    monitoredWallets: {
        _id: string;
        address: string;
        description: string;
    }[];
    channels: string[];
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;
}
interface HeaderProps {
    room: Room | null;
    loading: boolean;
    onMenuClick: () => void;
    isSidebarOpen: boolean;
}

export function Header({ room, loading, onMenuClick, isSidebarOpen }: HeaderProps) {
    return (
        <div className="h-14 shrink-0 border-b border-discord-divider bg-discord-secondary/50 backdrop-blur-sm 
                      flex items-center justify-between px-4 gap-4">
            {/* 菜单按钮 */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-1 hover:bg-discord-hover rounded-md"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* 左侧房间信息 */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {loading ? (
                    <Skeleton className="h-5 w-96 bg-gray-500/20" />
                ) : (
                    <>
                        <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-[#acc97e]" />
                            <h2 className="text-white font-medium truncate">
                                {room?.description || '监控 Solana 钱包地址的活动和变化，实时追踪钱包状态和交易记录。'}
                            </h2>
                        </div>
                    </>
                )}
            </div>

            {/* 右侧工具栏 */}
            <div className="flex items-center gap-3">
                {/* 搜索框 */}
                {/* <div className="relative w-64">
                    <Input
                        className="bg-discord-primary/50 border-none focus-visible:ring-1 
                                 focus-visible:ring-gray-500 text-sm pl-9"
                        placeholder="搜索..."
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div> */}

                {/* 通知按钮 */}
                {/* <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-discord-primary/30"
                >
                    <Bell className="h-4 w-4 text-gray-400" />
                </Button> */}

                {/* 钱包按钮 */}
                <div className="ml-2">
                    <UnifiedWalletButton />
                </div>
            </div>
        </div>
    );
} 