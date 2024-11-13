'use client';

import { Sidebar } from "./Sidebar";
import { UnifiedWalletButton } from '@jup-ag/wallet-adapter';

export function BaseLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-discord-primary text-white">
            {/* 左侧边栏 */}
            <Sidebar />

            {/* 主内容区 */}
            <div className="flex-1 flex flex-col">
                {/* 顶部工具栏 */}
                <div className="h-12 border-b border-discord-divider flex items-center justify-between px-4">
                    <h2 className="text-white font-medium">监控 Solana 钱包地址的活动和变化，实时追踪钱包状态和交易记录。</h2>
                    <UnifiedWalletButton />
                </div>

                {/* 内容区域 - 使用网格布局 */}
                <main className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden">
                    {/* 左侧大区域 */}
                    <div className="col-span-8 grid grid-rows-[2fr,1fr] gap-4">

                        {/* 上半部分 - 消息通知区域 */}
                        <div className="bg-discord-secondary rounded-lg p-4 border border-discord-divider">
                            <h3 className="text-lg font-medium mb-2">消息通知</h3>
                            <div className="h-[calc(100%-2rem)]">
                                {/* 消息通知内容 */}
                            </div>
                        </div>

                        {/* 下半部分 */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* k线图区域 */}
                            <div className="bg-discord-secondary rounded-lg p-4 border border-discord-divider">
                                <h3 className="text-lg font-medium mb-2">k线</h3>
                                <div className="h-[calc(100%-2rem)] overflow-y-auto">
                                    {/* k线图 */}
                                </div>
                            </div>

                            {/* token信息区域 */}
                            <div className="bg-discord-secondary rounded-lg p-4 border border-discord-divider">
                                <h3 className="text-lg font-medium mb-2">token info</h3>
                                <div className="h-[calc(100%-2rem)] overflow-y-auto">
                                    {/* token信息内容 */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 右侧区域 */}
                    <div className="col-span-4 grid grid-rows-2 gap-4">
                        {/* address info */}
                        <div className="bg-discord-secondary rounded-lg p-4 border border-discord-divider">
                            <h3 className="text-lg font-medium mb-2">address info</h3>
                            <div className="h-[calc(100%-2rem)] overflow-y-auto">
                                {/* 地址信息内容 */}
                            </div>
                        </div>

                        {/* 交易区域 */}
                        <div className="bg-discord-secondary rounded-lg p-4 border border-discord-divider">
                            <h3 className="text-lg font-medium mb-2">交易</h3>
                            <div className="h-[calc(100%-2rem)] overflow-y-auto">
                                {/* 交易区域内容 */}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 