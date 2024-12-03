'use client';

import { motion } from 'framer-motion';

interface CommunityStoryProps {
    title: string;
    description: string;
    stories: {
        emoji: string;
        title: string;
        content: string;
    }[];
}

export function CommunityStory({
    title,
    description,
    stories
}: CommunityStoryProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8"
        >
            {/* 标题区域 */}
            <div className="text-center mb-8">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-3xl font-bold text-white/90 mb-3"
                >
                    {title}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-white/60"
                >
                    {description}
                </motion.p>
            </div>

            {/* 故事卡片网格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stories.map((story, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="group p-5 rounded-xl bg-white/5 hover:bg-[#53b991]/10 border border-white/10 hover:border-[#53b991]/30 transition-all duration-300"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                {story.emoji}
                            </span>
                            <h3 className="text-lg font-semibold text-white/90 group-hover:text-[#53b991] transition-colors">
                                {story.title}
                            </h3>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">
                            {story.content}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}