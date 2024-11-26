'use client';

import { UnifiedWalletButton } from '@jup-ag/wallet-adapter';
import { SearchBox } from '@/components/search/SearchBox';

interface HeaderProps {
    onTokenSelect: (address: string) => void;
}

export function Header({ onTokenSelect }: HeaderProps) {
    return (
        <div className="h-14 shrink-0 border-b border-discord-divider bg-discord-secondary/50 backdrop-blur-sm z-50">
            <div className="h-full max-w-screen-2xl mx-auto px-2 sm:px-4 flex items-center">
                {/* 搜索框容器 - 移动端占据更多空间 */}
                <div className="flex-1 sm:flex-none sm:w-[480px] mx-auto">
                    <SearchBox
                        onTokenSelect={onTokenSelect}
                        placeholder="搜索代币..."
                    />
                </div>

                {/* 钱包按钮 - 移动端更紧凑 */}
                <div className="shrink-0 ml-2 sm:ml-0 sm:w-[180px] flex justify-end">
                    <UnifiedWalletButton />
                </div>
            </div>
        </div>
    );
}
