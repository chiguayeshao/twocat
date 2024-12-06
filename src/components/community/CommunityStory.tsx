'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

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

export function CommunityStory({ title, slogan, description, questionAndAnswer }: CommunityStoryProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2B2D31]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-6"
        >
            {/* 标题和标语部分 */}
            <div className="space-y-2 mb-6 text-center">
                <h2 className="text-2xl font-bold text-white/90 tracking-wide">
                    {title}
                </h2>
                <p className="text-lg text-[#53b991] font-medium italic">
                    {slogan}
                </p>
            </div>

            {/* 描述部分 */}
            <div className="mb-8 bg-[#313338]/50 rounded-xl p-4 border border-white/5">
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                    {description}
                </p>
            </div>

            {/* Q&A 部分 */}
            <div className="space-y-6">
                {questionAndAnswer.map((qa, index) => (
                    <motion.div
                        key={qa._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#313338]/50 rounded-xl p-4 border border-white/5"
                    >
                        {/* 问题 */}
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-[#53b991]/20 flex items-center justify-center flex-shrink-0">
                                <MessageCircle className="w-4 h-4 text-[#53b991]" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white/90 font-semibold mb-1">
                                    {qa.question}
                                </h3>
                            </div>
                        </div>

                        {/* 答案列表 */}
                        <div className="space-y-3 pl-11">
                            {qa.answer.map((answer, answerIndex) => (
                                <motion.div
                                    key={answerIndex}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 + answerIndex * 0.05 }}
                                    className="bg-[#2f2f2f]/50 rounded-lg p-3 border border-white/5"
                                >
                                    <p className="text-white/80 text-sm">
                                        {answer}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}