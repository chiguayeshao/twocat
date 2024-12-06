'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Wallet, History, Info, ArrowRight, Coins, TrendingUp } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useState, useEffect } from 'react';
import { DonationDialog } from './DonationDialog';
import { Room, Treasury, CommunityLevel } from '@/types/room';

interface TreasuryTransaction {
    date: string;
    amount: string;
    type: 'income' | 'expense';
    description: string;
}

interface TreasurySummaryProps {
    treasury: Treasury | null;
    communityLevel: CommunityLevel | null;
    roomId: string;
    onUpdate?: (newTreasury: Treasury, newCommunityLevel: CommunityLevel) => void;
}

interface TransactionHistory {
    type: string;
    amount: number;
    timestamp: number;
    userAddress: string;
}

const COMMUNITY_LEVELS = [
    { level: 1, volumeReq: 0, donationReq: 0 },
    { level: 2, volumeReq: 50, donationReq: 0.5 },
    { level: 3, volumeReq: 200, donationReq: 2 },
    { level: 4, volumeReq: 500, donationReq: 5 },
    { level: 5, volumeReq: 2000, donationReq: 20 },
];

export function TreasurySummary({
    treasury,
    communityLevel,
    roomId,
    onUpdate
}: TreasurySummaryProps) {
    const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
    const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTransactionHistory = async () => {
            try {
                const response = await fetch(`/api/rooms/treasuryhistory?roomId=${roomId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch transaction history');
                }
                const data = await response.json();
                const sortedTransactions = data.data.sort((a: TransactionHistory, b: TransactionHistory) =>
                    b.timestamp - a.timestamp
                );
                setTransactions(sortedTransactions);
            } catch (error) {
                console.error('Error fetching transaction history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (roomId) {
            fetchTransactionHistory();
        }

        const intervalId = setInterval(() => {
            if (roomId) {
                fetchTransactionHistory();
            }
        }, 30000);

        return () => clearInterval(intervalId);
    }, [roomId]);

    // Add handleDonate function
    const handleDonate = (amount: number, newTreasury: Treasury, newCommunityLevel: CommunityLevel) => {
        // 调用父组件的更新函数
        onUpdate?.(newTreasury, newCommunityLevel);
    };

    // 格式化金额为美元字符串
    const formatUSD = (amount: number) => {
        return `$${amount.toLocaleString('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 4
        })}`;
    };

    // 计算等级进度
    const getCurrentLevelProgress = () => {
        if (!communityLevel || !treasury) return 0;
        // 如果捐赠或交易量任一达标，返回100%
        if (communityLevel.currentDonationVolume >= communityLevel.unlockNextLevelDonationVolume ||
            communityLevel.currentVolume >= communityLevel.unlockNextLevelVolume) {
            return 100;
        }
        // 否则使用较高的进度
        const volumeProgress = (communityLevel.currentVolume / communityLevel.unlockNextLevelVolume) * 100;
        const donationProgress = (communityLevel.currentDonationVolume / communityLevel.unlockNextLevelDonationVolume) * 100;
        return Math.max(volumeProgress, donationProgress);
    };

    // 如果没有数据，显示加载状态或默认值
    if (!treasury || !communityLevel) {
        return <div>Loading...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 w-full"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 左侧：金库概览 */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        {/* 标题和图标 */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white/90">社区金库</h3>
                            <Wallet className="w-6 h-6 text-white/60" />
                        </div>

                        {/* 金库余额和数据 */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#53b991] to-[#9ad499]">
                                    {(treasury.treasuryBalance + communityLevel.currentDonationVolume).toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </div>
                                <div className="text-xl font-bold text-white/60">
                                    SOL
                                </div>
                                <span className="text-2xl">🚀</span>
                            </div>
                        </div>

                        {/* 金库说明 */}
                        <motion.div
                            className="mt-4 p-4 bg-[#313338]/50 rounded-xl border border-white/10 hover:border-[#53b991]/50 transition-all relative group overflow-hidden"
                            whileHover={{ scale: 1.01 }}
                        >
                            {/* 渐变背景效果 */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#53b991]/5 via-purple-500/5 to-[#53b991]/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* 标题部分 */}
                            <div className="text-sm font-medium text-white/90 mb-3 relative">
                                <span className="text-lg mr-2">💰</span>
                                社区成员每笔交易手续费的
                                <span className="mx-1 font-bold text-[#53b991]">
                                    {treasury.rebateRate * 100}%
                                </span>
                                自动存入社区金库，用于：
                            </div>

                            {/* 用途列表 */}
                            <div className="grid grid-cols-2 gap-3 relative">
                                <motion.div
                                    className="flex items-center gap-2 p-2 rounded-lg bg-[#2f2f2f]/80 border border-white/5 hover:border-[#53b991]/30 transition-all"
                                    whileHover={{ scale: 1.02, x: 5 }}
                                >
                                    <span className="text-xl">🎁</span>
                                    <span className="text-sm text-white/80 font-medium">Token回购</span>
                                </motion.div>

                                <motion.div
                                    className="flex items-center gap-2 p-2 rounded-lg bg-[#2f2f2f]/80 border border-white/5 hover:border-[#53b991]/30 transition-all"
                                    whileHover={{ scale: 1.02, x: 5 }}
                                >
                                    <span className="text-xl">🤖</span>
                                    <span className="text-sm text-white/80 font-medium">AI agent 权限</span>
                                </motion.div>

                                <motion.div
                                    className="flex items-center gap-2 p-2 rounded-lg bg-[#2f2f2f]/80 border border-white/5 hover:border-[#53b991]/30 transition-all"
                                    whileHover={{ scale: 1.02, x: 5 }}
                                >
                                    <span className="text-xl">🎯</span>
                                    <span className="text-sm text-white/80 font-medium">社区成员激励</span>
                                </motion.div>

                                <motion.div
                                    className="flex items-center gap-2 p-2 rounded-lg bg-[#2f2f2f]/80 border border-white/5 hover:border-[#53b991]/30 transition-all"
                                    whileHover={{ scale: 1.02, x: 5 }}
                                >
                                    <span className="text-xl">🚀</span>
                                    <span className="text-sm text-white/80 font-medium">社区营销活动</span>
                                </motion.div>
                            </div>

                            {/* 装饰性光晕效果 */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#53b991]/5 rounded-full blur-2xl -z-10" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl -z-10" />
                        </motion.div>
                    </div>

                    {/* 社区等级部分 */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-white/90">社区等级</h3>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Info className="w-4 h-4 text-white/60 cursor-pointer" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-black/90 border border-white/10 text-white p-4 rounded-lg w-80">
                                            <div className="text-sm font-bold mb-2">社区等级锁条件</div>
                                            <div className="space-y-2">
                                                {COMMUNITY_LEVELS.map((level, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <div className="text-white/70">Level {level.level}</div>
                                                        <div className="text-xs text-white/50">
                                                            交易量: {level.volumeReq} SOL / 捐赠: {level.donationReq} SOL
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="mt-2 sm:mt-0 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">
                                Level {treasury.communityLevel}
                            </div>
                        </div>

                        {/* 等级进度条 */}
                        <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-4">
                            <div
                                className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                                style={{ width: `${getCurrentLevelProgress()}%` }}
                            />
                        </div>

                        {/* 当前等级信息 */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <div className="text-white/70 text-sm">返佣比例</div>
                                <div className="text-[#53b991] font-bold">{treasury.rebateRate * 100}%</div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="text-white/70 text-sm">当前等级</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[#53b991] font-bold">Level {treasury.communityLevel}</span>
                                    {treasury.communityLevel < 5 && (
                                        <>
                                            <ArrowRight className="w-4 h-4 text-white/40" />
                                            <span className="text-purple-400 font-bold">Level {treasury.communityLevel + 1}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 升级信息 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-lg">
                                <div className="text-white/90 font-medium mb-2">当前交易量</div>
                                <div className="text-2xl font-bold">
                                    <span className="text-[#53b991]">{communityLevel.currentVolume}</span>
                                    <span className="text-white/60"> / {communityLevel.unlockNextLevelVolume} SOL</span>
                                </div>
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg">
                                <div className="text-white/90 font-medium mb-2">当前捐赠</div>
                                <div className="text-2xl font-bold">
                                    <span className="text-[#53b991]">{communityLevel.currentDonationVolume}</span>
                                    <span className="text-white/60"> / {communityLevel.unlockNextLevelDonationVolume} SOL</span>
                                </div>
                                <Button
                                    variant="secondary"
                                    className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400"
                                    onClick={() => setIsDonationDialogOpen(true)}
                                >
                                    <Coins className="w-4 h-4 mr-2" />
                                    捐赠社区
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 右侧：交易历史 */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white/90">最近交易</h3>
                        <History className="w-5 h-5 text-white/60" />
                    </div>
                    <div className="h-[550px] overflow-y-auto">
                        <div className="space-y-3">
                            {isLoading ? (
                                <div className="text-center text-white/60">加载中...</div>
                            ) : transactions.length === 0 ? (
                                <div className="text-center text-white/60">暂无交易记录</div>
                            ) : (
                                transactions.map((tx, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div>
                                            <div className="text-sm text-white/90">
                                                {tx.type === 'donation' ? '社区捐赠' :
                                                    tx.type === 'tradeRebate' ? '交易返佣' :
                                                        tx.type === 'communityAirdrop' ? '社区空投' :
                                                            tx.type === 'tokenBuyback' ? '代币回购' :
                                                                tx.type === 'aiUsage' ? 'AI使用' : '未知类型'}
                                            </div>
                                            <div className="text-xs text-white/60">
                                                {new Date(tx.timestamp).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className={`font-mono font-bold ${tx.amount >= 0 ? 'text-[#53b991]' : 'text-[#de5569]'
                                            }`}>
                                            {formatUSD(tx.amount)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <DonationDialog
                isOpen={isDonationDialogOpen}
                onClose={() => setIsDonationDialogOpen(false)}
                currentDonation={communityLevel.currentDonationVolume}
                onDonate={handleDonate}
                roomId={roomId}
            />
        </motion.div>
    );
}