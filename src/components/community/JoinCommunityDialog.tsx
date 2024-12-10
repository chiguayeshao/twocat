'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Check, Shield, Rocket, Sparkles } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface JoinCommunityDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isJoining: boolean;
    communityName: string;
}

export function JoinCommunityDialog({
    isOpen,
    onClose,
    onConfirm,
    isJoining,
    communityName
}: JoinCommunityDialogProps) {
    const benefits = [
        {
            icon: <Shield className="w-5 h-5 text-[#53b991]" />,
            title: "社区权益",
            description: "获得社区专属内容和活动的参与权"
        },
        {
            icon: <Rocket className="w-5 h-5 text-[#53b991]" />,
            title: "优先体验",
            description: "抢先体验社区新功能和特权"
        },
        {
            icon: <Sparkles className="w-5 h-5 text-[#53b991]" />,
            title: "社区奖励",
            description: "参与社区建设，获得代币奖励"
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-[#2B2D31] border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white/90">
                        加入 {communityName}
                    </DialogTitle>
                    <DialogDescription className="text-white/60">
                        加入社区，开启您的 Web3 社交之旅
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* 社区权益 */}
                    <div className="space-y-4">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                            >
                                <div className="p-2 rounded-full bg-white/10">
                                    {benefit.icon}
                                </div>
                                <div>
                                    <h3 className="font-medium text-white/90">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-sm text-white/60">
                                        {benefit.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* 社区条款 */}
                    <div className="text-sm text-white/60 p-3 rounded-lg bg-white/5">
                        <p>加入即表示您同意遵守社区规则：</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>尊重社区成员，维护良好社区氛围</li>
                            <li>遵守社区规章制度和管理规定</li>
                            <li>不得从事任何违法或损害社区利益的行为</li>
                        </ul>
                    </div>

                    {/* 确认按钮 */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onConfirm}
                        disabled={isJoining}
                        className="w-full py-2.5 rounded-lg
                                 bg-gradient-to-r from-[#53b991] to-[#53b991]/90
                                 text-white font-medium
                                 transition-all duration-300
                                 hover:from-[#53b991]/90 hover:to-[#53b991]/80
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 flex items-center justify-center gap-2"
                    >
                        {isJoining ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>加入中...</span>
                            </>
                        ) : (
                            <>
                                <Users className="w-5 h-5" />
                                <span>确认加入</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </DialogContent>
        </Dialog>
    );
}