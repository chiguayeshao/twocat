'use client';

import { UnifiedWalletButton } from '@jup-ag/wallet-adapter';
import { BellIcon } from "lucide-react";

export function Header() {
    return (
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
            {/* 左侧标题 */}
            <div>
                <h2 className="text-lg font-semibold">概览</h2>
            </div>

            {/* 右侧工具栏 */}
            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-accent rounded-md">
                    <BellIcon className="h-5 w-5" />
                </button>
                <UnifiedWalletButton />
            </div>
        </header>
    );
} 