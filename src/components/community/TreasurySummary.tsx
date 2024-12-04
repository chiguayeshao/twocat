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
import { useState } from 'react';
import { DonationDialog } from './DonationDialog';

interface TreasuryTransaction {
    date: string;
    amount: string;
    type: 'income' | 'expense';
    description: string;
}

interface TreasurySummaryProps {
    balance: string;
    dailyVolume: string;
    weeklyIncome: string;
    recentTransactions?: TreasuryTransaction[];
    currentLevel: number;
    currentVolume: number;
    currentDonation: number;
}

const defaultTransactions: TreasuryTransaction[] = [
    {
        date: "2024-03-20 14:30",
        amount: "+$1,337",
        type: 'income',
        description: "交易手续费收入"
    },
    {
        date: "2024-03-20 12:15",
        amount: "-$420",
        type: 'expense',
        description: "社区空投活动"
    },
    {
        date: "2024-03-20 10:45",
        amount: "+$890",
        type: 'income',
        description: "交易手续费收入"
    },
    {
        date: "2024-03-19 23:20",
        amount: "+$655",
        type: 'income',
        description: "交易手续费收入"
    },
    {
        date: "2024-03-19 20:10",
        amount: "-$300",
        type: 'expense',
        description: "社区营销支出"
    },
    {
        date: "2024-03-19 18:45",
        amount: "+$720",
        type: 'income',
        description: "交易手续费收入"
    },
    {
        date: "2024-03-19 15:30",
        amount: "-$250",
        type: 'expense',
        description: "流动性支持"
    },
    {
        date: "2024-03-19 12:20",
        amount: "+$445",
        type: 'income',
        description: "交易手续费收入"
    },
    {
        date: "2024-03-19 10:15",
        amount: "+$980",
        type: 'income',
        description: "交易手续费收入"
    },
    {
        date: "2024-03-18 22:40",
        amount: "-$500",
        type: 'expense',
        description: "社区建设支出"
    }
];

export function TreasurySummary({
    balance = "$42,069",
    dailyVolume = "$69,420",
    weeklyIncome = "$4,200",
    recentTransactions = defaultTransactions,
    currentLevel = 1,
    currentVolume = 30,
    currentDonation = 0.2
}: TreasurySummaryProps) {
    const levels = [
        { level: 1, cashback: 20, volumeReq: 0, donationReq: 0, aiUsage: 10 },
        { level: 2, cashback: 30, volumeReq: 50, donationReq: 0.5, aiUsage: 50 },
        { level: 3, cashback: 40, volumeReq: 200, donationReq: 2, aiUsage: 200 },
        { level: 4, cashback: 50, volumeReq: 500, donationReq: 5, aiUsage: 500 },
        { level: 5, cashback: 60, volumeReq: 2000, donationReq: 20, aiUsage: 1000 },
    ];

    const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);

    const handleDonate = (amount: number) => {
        // 处理捐赠逻辑
        console.log(`Donating ${amount} SOL`);
        setIsDonationDialogOpen(false);
    };

    const getCurrentLevelProgress = () => {
        if (currentLevel >= 5) return 100;
        const nextLevel = levels[currentLevel];
        const volumeProgress = (currentVolume / nextLevel.volumeReq) * 100;
        const donationProgress = (currentDonation / nextLevel.donationReq) * 100;
        return Math.min(Math.max(volumeProgress, donationProgress), 100);
    };

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
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                                {balance}
                            </div>
                            <div className="flex space-x-8">
                                <div>
                                    <div className="text-white/60 text-sm">日交易量</div>
                                    <div className="text-[#53b991] font-bold">{dailyVolume}</div>
                                </div>
                                <div>
                                    <div className="text-white/60 text-sm">本周收入</div>
                                    <div className="text-[#53b991] font-bold">{weeklyIncome}</div>
                                </div>
                            </div>
                        </div>

                        {/* 金库说明 */}
                        <div className="mt-4 p-4 bg-white/10 rounded-lg">
                            <div className="text-sm text-white/90 mb-2">
                                💰 每笔交易 4.20% 手续费自动存入金库，用于：
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
                                <div className="flex items-center gap-2">
                                    <span>🎁</span>
                                    <span>社区活动奖励</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>📢</span>
                                    <span>市场营销推广</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🏗️</span>
                                    <span>社区建设维护</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>💧</span>
                                    <span>流动性支持</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 新增：等级系统 */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-white/90">社区等级</h3>
                                <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Info className="w-4 h-4 text-white/60 cursor-pointer" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-black/90 border border-white/10 text-white p-4 rounded-lg w-80">
                                            <div className="text-sm font-bold mb-2">社区等级解锁条件</div>
                                            <div className="space-y-2">
                                                {levels.map((level, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <div className="text-white/70">Level {level.level}</div>
                                                        <div className="text-xs text-white/50">
                                                            交易量: {level.volumeReq} SOL, 捐赠: {level.donationReq} SOL
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">
                                Level {currentLevel}
                            </div>
                        </div>

                        {/* 等级进度条 */}
                        <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-4">
                            <div
                                className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                                style={{ width: `${getCurrentLevelProgress()}%` }}
                            />
                        </div>

                        {/* 当前等级信息和收益 */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <div className="text-white/70 text-sm">
                                    返佣比例
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[#53b991] font-bold">{levels[currentLevel - 1].cashback}%</span>
                                    <ArrowRight className="w-4 h-4 text-white/40" />
                                    <span className="text-purple-400 font-bold">{levels[currentLevel].cashback}%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="text-white/70 text-sm">
                                    AI 功能使用次数
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[#53b991] font-bold">{levels[currentLevel - 1].aiUsage}次/天</span>
                                    <ArrowRight className="w-4 h-4 text-white/40" />
                                    <span className="text-purple-400 font-bold">{levels[currentLevel].aiUsage}次/天</span>
                                </div>
                            </div>
                        </div>

                        {/* 升级信息 */}
                        {currentLevel < 5 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white/70">升级到 Level {currentLevel + 1} 条件</span>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Info className="w-4 h-4 text-white/60" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>满足任一条件即可升级：</p>
                                                    <p>1. 达到交易量要求</p>
                                                    <p>2. 完成社区捐赠</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                {/* 升级方式选项 */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-lg">
                                        <div className="text-white/90 font-medium mb-2">通过交易量升级</div>
                                        <div className="text-2xl font-bold">
                                            <span className="text-[#53b991]">{currentVolume}</span> / <span className="text-white/60">{levels[currentLevel].volumeReq} SOL</span>
                                        </div>
                                        <div className="text-white/60 text-sm">
                                            继续交易即可升级
                                        </div>
                                    </div>

                                    <div className="bg-white/5 p-4 rounded-lg">
                                        <div className="text-white/90 font-medium mb-2">通过捐赠升级</div>
                                        <div className="text-2xl font-bold">
                                            <span className="text-[#53b991]">{currentDonation}</span> / <span className="text-white/60">{levels[currentLevel].donationReq} SOL</span>
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
                        )}

                        {currentLevel === 5 && (
                            <div className="text-center text-white/70 py-2">
                                🎉 恭喜！您已达到最高等级
                            </div>
                        )}
                    </div>
                </div>

                {/* 右侧：最近交易记录 */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white/90">最近交易</h3>
                        <History className="w-5 h-5 text-white/60" />
                    </div>
                    <div className="h-[550px] overflow-y-auto">
                        <div className="space-y-3">
                            {recentTransactions.map((tx, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <div>
                                        <div className="text-sm text-white/90">{tx.description}</div>
                                        <div className="text-xs text-white/60">{tx.date}</div>
                                    </div>
                                    <div className={`font-mono font-bold ${tx.type === 'income'
                                        ? 'text-[#53b991]'  // 收入显示绿色
                                        : 'text-[#de5569]'  // 支出显示红色
                                        }`}>
                                        {tx.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <DonationDialog
                isOpen={isDonationDialogOpen}
                onClose={() => setIsDonationDialogOpen(false)}
                currentDonation={currentDonation}
                onDonate={handleDonate}
            />
        </motion.div>
    );
}