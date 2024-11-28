'use client';

import { motion } from 'framer-motion';
import { Users, Wallet, Calendar, TrendingUp, MessageSquare, Rocket, Activity, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { formatWalletAddress } from '@/lib/utils';

interface RoomStats {
    memberCount: number;
    monitoredWallets: number;
    activeToday: number;
    totalTransactions: number;
}

interface Activity {
    id: string;
    type: 'transaction' | 'member_joined' | 'wallet_added';
    content: string;
    timestamp: string;
    walletAddress?: string;
    amount?: string;
    tokenSymbol?: string;
}

export function CommunityHome({ roomId }: { roomId: string }) {
    console.log('CommunityHome rendered with roomId:', roomId);
    const [stats, setStats] = useState<RoomStats | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/twocat-core/rooms?roomId=${roomId}`);
                if (!response.ok) throw new Error('Failed to fetch room stats');
                const data = await response.json();

                setStats({
                    memberCount: data.data.memberCount || 0,
                    monitoredWallets: data.data.monitoredWallets?.length || 0,
                    activeToday: 15, // Mock data
                    totalTransactions: 156, // Mock data
                });

                // Mock activities data
                setActivities([
                    {
                        id: '1',
                        type: 'transaction',
                        content: '新交易',
                        timestamp: new Date().toISOString(),
                        walletAddress: '0x1234...5678',
                        amount: '1.5',
                        tokenSymbol: 'SOL'
                    },
                    {
                        id: '2',
                        type: 'member_joined',
                        content: '新成员加入',
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                        walletAddress: '0x8765...4321'
                    },
                    // ... 更多模拟数据
                ]);
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [roomId]);

    return (
        <div className="flex-1 h-full bg-discord-primary overflow-auto">
            <div className="max-w-6xl mx-auto p-4 space-y-6">
                {/* 统计卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-32 bg-[#2f2f2f] rounded-lg" />
                        ))
                    ) : (
                        <>
                            <StatsCard
                                icon={<Users className="w-5 h-5 text-[#53b991]" />}
                                title="成员数量"
                                value={stats?.memberCount || 0}
                            />
                            <StatsCard
                                icon={<Wallet className="w-5 h-5 text-[#53b991]" />}
                                title="监控钱包"
                                value={stats?.monitoredWallets || 0}
                            />
                            <StatsCard
                                icon={<Calendar className="w-5 h-5 text-[#53b991]" />}
                                title="今日活跃"
                                value={stats?.activeToday || 0}
                            />
                            <StatsCard
                                icon={<TrendingUp className="w-5 h-5 text-[#53b991]" />}
                                title="总交易次数"
                                value={stats?.totalTransactions || 0}
                            />
                        </>
                    )}
                </div>

                {/* 活动记录和快速操作 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* 最近活动 */}
                    <div className="lg:col-span-2 bg-[#2f2f2f] rounded-lg p-4">
                        <h2 className="text-lg font-medium mb-4 text-white">最近活动</h2>
                        <div className="space-y-3">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="h-16 bg-discord-primary rounded-lg" />
                                ))
                            ) : (
                                activities.map((activity, index) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-discord-primary p-3 rounded-lg"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Activity className="w-4 h-4 text-[#53b991]" />
                                                <div>
                                                    <div className="text-sm text-white">{activity.content}</div>
                                                    {activity.walletAddress && (
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            {formatWalletAddress(activity.walletAddress)}
                                                            {activity.amount && (
                                                                <span className="ml-2">
                                                                    {activity.amount} {activity.tokenSymbol}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(activity.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* 快速操作 */}
                    <div className="bg-[#2f2f2f] rounded-lg p-4">
                        <h2 className="text-lg font-medium mb-4 text-white">快速操作</h2>
                        <div className="space-y-2">
                            <QuickActionButton
                                icon={<MessageSquare className="w-4 h-4" />}
                                text="发布公告"
                            />
                            <QuickActionButton
                                icon={<Rocket className="w-4 h-4" />}
                                text="添加监控"
                            />
                            <QuickActionButton
                                icon={<ArrowUpRight className="w-4 h-4" />}
                                text="邀请成员"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 统计卡片组件
function StatsCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2f2f2f] p-4 rounded-lg border border-[#53b991]/20"
        >
            <div className="flex items-center gap-3 mb-3">
                {icon}
                <span className="text-gray-400">{title}</span>
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
        </motion.div>
    );
}

// 快速操作按钮组件
function QuickActionButton({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <button className="w-full px-4 py-3 bg-discord-primary rounded-lg text-gray-300 hover:text-white hover:bg-[#353535] transition-colors flex items-center gap-3">
            {icon}
            <span className="text-sm">{text}</span>
        </button>
    );
}