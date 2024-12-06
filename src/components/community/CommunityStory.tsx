'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Sparkles, Zap, PartyPopper, Crown, Star, Trophy } from 'lucide-react';
import React, { useState } from 'react';

interface CommunityStoryProps {
    title: string;
    slogan: string;
    description: string;
    questionAndAnswer: {
        question: string;
        answer: string[];
        _id: string;
    }[];
}

// Meme 风格的装饰性表情
const MEME_EMOJIS = ['🚀', '🌙', '💎', '🦍', '🔥', '✨', '🌈', '🎮', '🎯', '🎪'];
const ANSWER_EMOJIS = ['💫', '🎯', '🎪', '🎭', '🎨', '🎪'];

const QuestionIcons = [
    { icon: Rocket, color: 'from-pink-500 to-violet-500' },
    { icon: Sparkles, color: 'from-yellow-400 to-orange-500' },
    { icon: Zap, color: 'from-cyan-400 to-blue-500' },
    { icon: PartyPopper, color: 'from-green-400 to-emerald-500' },
    { icon: Crown, color: 'from-purple-400 to-indigo-500' },
    { icon: Star, color: 'from-red-400 to-rose-500' },
    { icon: Trophy, color: 'from-[#53b991] to-[#9ad499]' },
];

export function CommunityStory({ title, slogan, description, questionAndAnswer }: CommunityStoryProps) {
    const [hoveredQA, setHoveredQA] = useState<string | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2B2D31]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-6 relative overflow-hidden"
        >
            {/* 霓虹灯效果背景 */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#53b991]/5 via-purple-500/5 to-[#53b991]/5 animate-gradient-x" />

            {/* 标题部分 */}
            <motion.div
                className="space-y-3 mb-8 text-center relative"
                whileHover={{ scale: 1.02 }}
                transition={{
                    type: "spring",
                    stiffness: 300,  // 降低刚度
                    damping: 15,     // 增加阻尼
                    mass: 0.8        // 减小质量
                }}
            >
                <motion.h2
                    className="text-3xl font-bold bg-gradient-to-r from-[#53b991] to-[#9ad499] bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {MEME_EMOJIS[0]} {title} {MEME_EMOJIS[0]}
                </motion.h2>
                <motion.p
                    className="text-xl font-bold italic bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                    "{slogan}"
                </motion.p>
            </motion.div>

            {/* 描述部分 */}
            <motion.div
                className="mb-8 bg-[#313338]/50 rounded-xl p-6 border border-white/10 hover:border-[#53b991]/50 transition-colors relative group"
                whileHover={{ scale: 1.01 }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#53b991]/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <p className="text-white/90 leading-relaxed whitespace-pre-wrap text-lg relative">
                    {description}
                </p>
            </motion.div>

            {/* Q&A 部分 */}
            <div className="space-y-6">
                {questionAndAnswer.map((qa, index) => (
                    <motion.div
                        key={qa._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onHoverStart={() => setHoveredQA(qa._id)}
                        onHoverEnd={() => setHoveredQA(null)}
                        className="relative"
                    >
                        <motion.div
                            className="bg-[#313338]/50 rounded-xl p-5 border border-white/10 hover:border-[#53b991]/50 transition-all relative overflow-hidden"
                            whileHover={{ scale: 1.02 }}
                        >
                            {/* 问题部分 */}
                            <div className="flex items-start gap-4 mb-4">
                                <motion.div
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${QuestionIcons[index % QuestionIcons.length].color} p-0.5`}
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="w-full h-full bg-[#2B2D31] rounded-[10px] flex items-center justify-center">
                                        {React.createElement(QuestionIcons[index % QuestionIcons.length].icon, {
                                            className: "w-6 h-6 text-[#53b991]"
                                        })}
                                    </div>
                                </motion.div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white/90 tracking-wide">
                                        {qa.question}
                                    </h3>
                                </div>
                            </div>

                            {/* 答案列表 */}
                            <div className="space-y-3 pl-16">
                                <AnimatePresence>
                                    {qa.answer.map((answer, answerIndex) => (
                                        <motion.div
                                            key={answerIndex}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            whileHover={{ scale: 1.01, x: 5 }}
                                            transition={{ delay: index * 0.1 + answerIndex * 0.05 }}
                                            className="bg-[#2f2f2f]/80 backdrop-blur-sm rounded-lg p-4 border border-white/5 hover:border-[#53b991]/30 transition-all relative group"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#53b991]/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                                            <p className="text-white/90 text-base relative">
                                                {ANSWER_EMOJIS[answerIndex % ANSWER_EMOJIS.length]} {answer}
                                            </p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* 悬浮时的装饰效果 */}
                        <AnimatePresence>
                            {hoveredQA === qa._id && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 -z-10 blur-2xl"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#53b991]/20 to-purple-500/20 rounded-xl" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* 装饰性背景元素 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#53b991]/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl -z-10" />
        </motion.div>
    );
}