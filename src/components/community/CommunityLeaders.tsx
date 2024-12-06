'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Sparkles } from "lucide-react";

interface Leader {
    name: string;
    twitterName: string;
    twitterId: string;
    isAi: boolean;
}

interface CommunityLeadersProps {
    leaders: Leader[];
}

export function CommunityLeaders({ leaders }: CommunityLeadersProps) {
    const [includeAI, setIncludeAI] = useState(true);

    const filteredLeaders = includeAI
        ? leaders
        : leaders.filter(leader => !leader.isAi);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ height: 'calc(100% + 1px)' }}
            className="relative flex flex-col p-5 sm:p-6 bg-[#2B2D31]/60 backdrop-blur-xl rounded-2xl border border-white/10"
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center justify-between gap-2 sm:gap-3 mb-4"
            >
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white/90 tracking-wide">
                    CTO Team
                </h2>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#53b991]" />
                        <span className="text-sm font-medium text-white/90">AI Leader</span>
                    </div>
                    <Switch
                        checked={includeAI}
                        onCheckedChange={leaders.some(leader => leader.isAi) ? setIncludeAI : undefined}
                        className={`data-[state=checked]:bg-[#53b991] ${!leaders.some(leader => leader.isAi) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!leaders.some(leader => leader.isAi)}
                    />
                </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {filteredLeaders.map((leader, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                        className={`flex items-center gap-3 p-3 rounded-xl border border-white/5 ${leader.isAi
                            ? 'bg-[#53b991]/20 border-[#53b991]/30'
                            : 'bg-[#313338]/80'
                            }`}
                    >
                        <img
                            src="https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1732023482786-twocatlogo.jpg"
                            alt={leader.name}
                            className="w-12 h-12 rounded-full border-2 border-transparent"
                        />
                        <div className="flex flex-col min-w-0">
                            <span className="text-base font-semibold text-white/90 truncate">
                                {leader.name}
                            </span>
                            <a
                                href={leader.twitterId}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-white/50 truncate hover:text-[#53b991] cursor-pointer transition-colors"
                            >
                                {leader.twitterName}
                            </a>
                        </div>
                    </motion.div>
                ))}

                {[...Array(Math.max(6 - filteredLeaders.length, 0))].map((_, index) => (
                    <div
                        key={`placeholder-${index}`}
                        className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-[#313338]/20"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/5"></div>
                        <div className="flex flex-col gap-2">
                            <div className="w-20 h-4 rounded bg-white/5"></div>
                            <div className="w-16 h-3 rounded bg-white/5"></div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}