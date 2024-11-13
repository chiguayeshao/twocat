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
                    <h2 className="text-white font-medium">概览</h2>
                    <UnifiedWalletButton />
                </div>

                {/* 内容区域 */}
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
} 