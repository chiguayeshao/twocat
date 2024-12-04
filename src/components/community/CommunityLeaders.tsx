'use client';

import { motion } from 'framer-motion';

interface Leader {
    name: string;
    twitterName: string;
    twitterId: string;
    avatar?: string;
}

interface CommunityLeadersProps {
    leaders: Leader[];
}

export function CommunityLeaders({ leaders }: CommunityLeadersProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col p-4 sm:p-5 lg:p-6 bg-[#2B2D31]/60 backdrop-blur-xl rounded-2xl border border-white/10 h-auto"
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
            >
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white/90 tracking-wide">
                    CTO Team
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {leaders.map((leader, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                        className="flex items-center gap-3 p-3 bg-[#313338]/80 rounded-xl border border-white/5"
                    >
                        <img
                            src={leader.avatar || "https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1732023482786-twocatlogo.jpg"}
                            alt={leader.name}
                            className="w-12 h-12 rounded-full border-2 border-transparent"
                        />
                        <div className="flex flex-col min-w-0">
                            <span className="text-base font-semibold text-white/90 truncate">
                                {leader.name}
                            </span>
                            <a
                                href={`https://twitter.com/${leader.twitterName}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-white/50 truncate hover:text-[#53b991] hover:underline cursor-pointer transition-colors"
                            >
                                @{leader.twitterName}
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}