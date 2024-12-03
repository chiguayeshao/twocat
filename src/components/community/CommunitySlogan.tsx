'use client';

import { motion } from 'framer-motion';

interface CommunitySloganProps {
    slogan: string;
}

export function CommunitySlogan({ slogan }: CommunitySloganProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-between p-5 sm:p-6 lg:p-8 bg-white/5 rounded-2xl border border-white/10"
        >
            {/* 主标语 */}
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-white/90 leading-tight mb-6"
            >
                {slogan}
            </motion.h1>

            {/* 社区理念描述 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-3 sm:gap-4"
            >
                {[
                    {
                        icon: "🌈",
                        text: "社区驱动，人人都是创作者"
                    },
                    {
                        icon: "💎",
                        text: "持有即是身份，价值共同创造"
                    },
                    {
                        icon: "🎮",
                        text: "玩梗创造快乐，社交铸就未来"
                    },
                    {
                        icon: "🤝",
                        text: "共建共赢生态，财富共同分享"
                    }
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                        className="flex items-center gap-3 group"
                    >
                        <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform">
                            {item.icon}
                        </span>
                        <span className="text-sm sm:text-base text-white/80 group-hover:text-[#53b991] transition-colors">
                            {item.text}
                        </span>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}