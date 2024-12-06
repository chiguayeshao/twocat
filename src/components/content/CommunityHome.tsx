'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CommunityCard } from '@/components/community/CommunityCard';
import { CommunityLeaders } from '@/components/community/CommunityLeaders';
import { TreasurySummary } from '@/components/community/TreasurySummary';
import { StatsCard } from '@/components/community/StatsCard';
import { CommunityStory } from '@/components/community/CommunityStory';
import { Room, Treasury, CommunityLevel } from '@/types/room';

interface CommunityHomeProps {
    roomId: string;
    room: Room | null;
    treasury: Treasury | null;
    communityLevel: CommunityLevel | null;
    onTreasuryUpdate: (newTreasury: Treasury, newCommunityLevel: CommunityLevel) => void;
}

// 添加模拟数据
const mockStats = {
    holders: Math.floor(Math.random() * 10000),
    marketValue: (Math.random() * 100).toFixed(2),
    volume: (Math.random() * 1000).toFixed(2),
    liquidity: (Math.random() * 500).toFixed(2)
};

export function CommunityHome({ roomId, room, treasury, communityLevel, onTreasuryUpdate }: CommunityHomeProps) {
    const [imageError, setImageError] = useState(false);

    if (!room) return null;

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start w-full">
                    <CommunityCard
                        name={room.roomName}
                        avatar={room.avatarUrl}
                        website={room.website}
                        twitter={room.twitter}
                        telegram={room.telegram}
                        discord={room.discord}
                        tokenAddress={room.tokenAddress}
                        imageError={imageError}
                    />

                    <CommunityLeaders
                        leaders={room.cto.map(member => ({
                            name: member.ctoname,
                            twitterName: member.ctotweethandle.replace('@', ''),
                            twitterId: member.ctotweethandle,
                            isAi: member.isAi
                        }))}
                    />
                </div>

                <div className="mt-6 sm:mt-12">
                    <CommunityStory
                        title={`${room.roomName} 的故事`}
                        description={room.description}
                        stories={room.stories || [
                            {
                                emoji: "😺",
                                title: "社区的诞生",
                                content: room.description
                            }
                        ]}
                    />
                </div>

                <div className="mt-6 sm:mt-12">
                    <TreasurySummary
                        treasury={treasury}
                        communityLevel={communityLevel}
                        roomId={roomId}
                        onUpdate={onTreasuryUpdate}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <StatsCard
                        title="持有人数"
                        value={mockStats.holders.toLocaleString()}
                        icon="🦍"
                        change="+12.5%"
                    />
                    <StatsCard
                        title="市值"
                        value={`$${mockStats.marketValue}M`}
                        icon="💎"
                        change="+8.3%"
                    />
                    <StatsCard
                        title="交易量"
                        value={`$${mockStats.volume}K`}
                        icon="📊"
                        change="+15.7%"
                    />
                    <StatsCard
                        title="流动性"
                        value={`$${mockStats.liquidity}K`}
                        icon="💧"
                        change="+5.2%"
                    />
                </motion.div>
            </div>
        </div>
    );
}