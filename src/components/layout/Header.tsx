'use client';

import { UnifiedWalletButton } from '@jup-ag/wallet-adapter';
import { SearchBox } from '@/components/search/SearchBox';

interface HeaderProps {
    onTokenSelect: (address: string) => void;
}

export function Header({ onTokenSelect }: HeaderProps) {
    return (
        <div className="h-14 shrink-0 border-b border-discord-divider bg-discord-secondary/50 backdrop-blur-sm z-50">
            <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between">

                {/* 中间搜索框 - 使用固定宽度并居中 */}
                <div className="w-[480px] mx-auto">
                    <SearchBox
                        onTokenSelect={onTokenSelect}
                        placeholder="搜索代币..."
                    />
                </div>

                {/* 右侧钱包按钮 */}
                <div className="w-[180px] shrink-0 flex justify-end">
                    <UnifiedWalletButton />
                </div>
            </div>
        </div>
    );
}
