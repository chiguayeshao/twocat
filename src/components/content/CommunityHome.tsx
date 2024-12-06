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
                        ca={room.ca}
                        imageError={imageError}
                    />

                    <CommunityLeaders
                        avatarUrl={room.avatarUrl}
                        leaders={room.cto.map(member => ({
                            ctoname: member.ctoname,
                            ctotweethandle: member.ctotweethandle.replace('@', ''),
                            isAi: member.isAi
                        }))}
                    />
                </div>

                <div className="mt-6 sm:mt-12">
                    <CommunityStory
                        title={room.roomName}
                        slogan={room.communityStory?.slogan || ""}
                        description={room.communityStory?.description || ""}
                        questionAndAnswer={room.communityStory?.questionAndAnswer || [
                            {
                                question: "社区的诞生",
                                answer: [room.description],
                                _id: "default"
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
            </div>
        </div>
    );
}