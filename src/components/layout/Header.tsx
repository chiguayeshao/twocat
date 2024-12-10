'use client';

import { UnifiedWalletButton } from '@jup-ag/wallet-adapter';
import { SearchBox } from '@/components/search/SearchBox';
import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
    onTokenSelect: (address: string) => void;
}

export function Header({ onTokenSelect }: HeaderProps) {
    return (
        <div className="h-14 shrink-0 border-b border-discord-divider bg-discord-secondary/50 backdrop-blur-sm z-50">
            <div className="h-full max-w-screen-2xl mx-auto px-2 sm:px-4 flex justify-end items-center">
                {/* 搜索框容器 - 移动端占据更多空间 */}
                {/* <div className="flex-1 sm:flex-none sm:w-[480px] mx-auto">
                    <SearchBox
                        onTokenSelect={onTokenSelect}
                        placeholder="搜索代币..."
                    />
                </div> */}

                {/* 钱包按钮 - 移动端更紧凑 */}
                <UnifiedWalletButton
                    buttonClassName="bg-gradient-to-r from-[#53b991] to-[#9ad499] hover:opacity-90 transition-opacity rounded-lg"
                    overrideContent={
                        <Button
                            className="bg-transparent hover:bg-transparent flex items-center"
                            type="button"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            连接钱包
                        </Button>
                    }
                />
            </div>
        </div>
    );
}
