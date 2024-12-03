'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Wallet, History } from 'lucide-react';

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
    recentTransactions = defaultTransactions
}: TreasurySummaryProps) {
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
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white/90">社区金库</h3>
                            <Wallet className="w-6 h-6 text-white/60" />
                        </div>
                        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            {balance}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-white/60 text-sm">日交易量</div>
                                <div className="text-white/90 font-bold">{dailyVolume}</div>
                            </div>
                            <div>
                                <div className="text-white/60 text-sm">本周收入</div>
                                <div className="text-white/90 font-bold">{weeklyIncome}</div>
                            </div>
                        </div>
                    </div>

                    {/* 金库说明 */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-bold text-white/90 mb-4">金库说明 💡</h3>
                        <p className="text-white/70 leading-relaxed">
                            社区金库资金来源于社区成员在进行 meme coin 交易时产生的手续费。
                            每笔交易的 4.20% 手续费将自动存入社区金库，用于：
                        </p>
                        <ul className="mt-4 space-y-2">
                            {[
                                "社区活动奖励和空投 🎁",
                                "市场营销和推广 📢",
                                "社区建设和维护 🏗️",
                                "流动性支持 💧"
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-2 text-white/70">
                                    <ArrowUpRight className="w-4 h-4 text-purple-400" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 右侧：最近交易记录 */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white/90">最近交易</h3>
                        <History className="w-5 h-5 text-white/60" />
                    </div>
                    <div className="h-[400px] overflow-y-auto">
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
        </motion.div>
    );
}