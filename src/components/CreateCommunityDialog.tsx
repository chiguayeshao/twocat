'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { CommunityBasicInfo } from './community/steps/CommunityBasicInfo';
import { CommunityDetailedInfo } from './community/steps/CommunityDetailedInfo';
import { CommunityStory } from './community/steps/CommunityStory';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet, UnifiedWalletButton } from '@jup-ag/wallet-adapter';

export interface CommunityData {
    name: string;
    avatar: string | null;
    creatorWallet: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    contractAddress: string;
    ctos: {
        tweetName: string;
        tweetHandle: string;
    }[];
    title: string;
    slogan: string;
    description: string;
    qas: {
        question: string;
        answers: string[];
    }[];
}

interface CreateCommunityDialogProps {
    onSubmit?: (data: CommunityData) => Promise<void>;
}

export function CreateCommunityDialog({ onSubmit }: CreateCommunityDialogProps) {
    const { connected, publicKey } = useWallet();
    const [step, setStep] = useState(1);
    const [data, setData] = useState<CommunityData>({
        name: '',
        avatar: null,
        creatorWallet: '',
        contractAddress: '',
        ctos: [{ tweetName: '', tweetHandle: '' }],
        qas: [{ question: '', answers: [''] }],
        title: '',
        slogan: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);

    const handleChange = (field: string, value: any) => {
        setData(prevData => ({
            ...prevData,
            [field]: value,
            ...(field === 'avatar' ? { avatarPreview: value } : {})
        }));
    };

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        if (!open) {
            setStep(1);
            setData({
                name: '',
                avatar: null,
                creatorWallet: '',
                contractAddress: '',
                ctos: [{ tweetName: '', tweetHandle: '' }],
                qas: [{ question: '', answers: [''] }],
                title: '',
                slogan: '',
                description: ''
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!connected || !publicKey) {
            console.error('钱包未连接');
            // 这里可以添加错误提示UI
            return;
        }

        if (step < 3) {
            setStep(step + 1);
            return;
        }

        setIsSubmitting(true);
        try {
            // 辅助函数：确保 URL 格式正确
            const ensureValidUrl = (url: string | undefined) => {
                if (!url) return undefined;
                if (url.startsWith('http://') || url.startsWith('https://')) {
                    return url;
                }
                return `https://${url}`;
            };

            // 构建 API 请求体
            const requestBody = {
                name: data.name,
                description: data.description || "这是一个新的社区",
                avatarUrl: data.avatar,
                creatorWalletAddress: publicKey.toString(),
                isPrivate: false,
                website: ensureValidUrl(data.website),
                twitter: ensureValidUrl(data.twitter?.replace('@', 'twitter.com/')),
                telegram: ensureValidUrl(data.telegram?.replace('@', 't.me/')),
                discord: ensureValidUrl(data.discord?.replace('discord.gg/', 'discord.com/invite/')),
                ca: data.contractAddress,
                cto: data.ctos.map(cto => ({
                    ctotweethandle: cto.tweetHandle,
                    ctotwitter: ensureValidUrl(`twitter.com/${cto.tweetHandle.replace('@', '')}`),
                    isAi: false
                })),
                communityStory: {
                    title: data.title,
                    slogan: data.slogan,
                    description: data.description,
                    questionAndAnswer: data.qas.map(qa => ({
                        question: qa.question,
                        answer: qa.answers
                    }))
                }
            };

            console.log("Submitting data:", requestBody);

            const response = await fetch("/api/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.details || result.error || "创建社区失败");
            }

            if (result.success) {
                setOpen(false);
                setData({
                    name: '',
                    avatar: null,
                    creatorWallet: '',
                    contractAddress: '',
                    ctos: [{ tweetName: '', tweetHandle: '' }],
                    qas: [{ question: '', answers: [''] }],
                    title: '',
                    slogan: '',
                    description: ''
                });
                setStep(1);

                if (onSubmit) {
                    await onSubmit(data);
                }
            } else {
                throw new Error(result.message || "创建社区失败");
            }
        } catch (error) {
            console.error('创建社区失败:', error);
            // 这里可以添加错误提示UI
        } finally {
            setIsSubmitting(false);
        }
    };

    // 处理点击创建社区按钮
    const handleCreateClick = () => {
        if (connected && publicKey) {
            setOpen(true);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {connected ? (
                    <Button
                        onClick={handleCreateClick}
                        className="bg-gradient-to-r from-[#53b991] to-[#9ad499] hover:opacity-90 transition-opacity"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        创建社区
                    </Button>
                ) : (
                    <UnifiedWalletButton
                        buttonClassName="bg-gradient-to-r from-[#53b991] to-[#9ad499] hover:opacity-90 transition-opacity rounded-lg"
                        overrideContent={
                            <Button
                                className="bg-transparent hover:bg-transparent flex items-center"
                                type="button"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                链接钱包创建社区
                            </Button>
                        }
                    />
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-[#2f2f2f] border-[#53b991]/20">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#53b991] flex items-center gap-2">
                        <span>创建新社区</span>
                        <span className="text-sm font-normal text-gray-400">
                            步骤 {step}/3
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {step === 1 && <CommunityBasicInfo data={data} onChange={handleChange} />}
                            {step === 2 && <CommunityDetailedInfo data={data} onChange={handleChange} />}
                            {step === 3 && <CommunityStory data={data} onChange={handleChange} />}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between gap-4">
                        {step > 1 && (
                            <Button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                className="bg-gradient-to-r from-[#53b991] to-[#9ad499] hover:opacity-90 transition-opacity"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                上一步
                            </Button>
                        )}
                        <Button
                            type="submit"
                            className="ml-auto bg-gradient-to-r from-[#53b991] to-[#9ad499] hover:opacity-90 transition-opacity"
                            disabled={isSubmitting || !connected}
                        >
                            {isSubmitting ? (
                                '提交中...'
                            ) : step === 3 ? (
                                '完成创建'
                            ) : (
                                <>
                                    下一步
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}