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
import { useToast } from '@/hooks/use-toast';

export interface CommunityData {
    name: string;
    avatar: string | null;
    creatorWallet: string;
    description: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    contractAddress: string;
    ctos: {
        tweetName: string;
        tweetHandle: string;
    }[];
    communityStory?: {
        title: string;
        slogan: string;
        description: string;
        qas: {
            question: string;
            answers: string[];
        }[];
    };
}

interface CreateCommunityDialogProps {
    onSubmit?: (data: CommunityData) => Promise<void>;
}

export function CreateCommunityDialog({ onSubmit }: CreateCommunityDialogProps) {
    const { connected, publicKey } = useWallet();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [data, setData] = useState<CommunityData>({
        name: '',
        avatar: null,
        creatorWallet: '',
        description: '',
        contractAddress: '',
        ctos: [{ tweetName: '', tweetHandle: '' }],
        communityStory: {
            title: '',
            slogan: '',
            description: '',
            qas: [{ question: '', answers: [''] }]
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);

    const handleChange = (field: string, value: any) => {
        setData(prevData => {
            if (field === 'avatar') {
                return {
                    ...prevData,
                    [field]: value,
                    avatarPreview: value
                };
            }

            // 处理 communityStory 相关的字段
            if (field.startsWith('communityStory.')) {
                const storyField = field.split('.')[1]; // 获取实际的字段名
                return {
                    ...prevData,
                    communityStory: {
                        title: prevData.communityStory?.title || '',
                        slogan: prevData.communityStory?.slogan || '',
                        description: prevData.communityStory?.description || '',
                        qas: prevData.communityStory?.qas || [{ question: '', answers: [''] }],
                        ...prevData.communityStory,
                        [storyField]: value
                    }
                };
            }

            // 处理其他字段
            return {
                ...prevData,
                [field]: value
            };
        });
    };

    const handleOpenChange = (open: boolean) => {
        if (!connected && open) {
            toast({
                title: "请先连接钱包",
                description: "创建社区需要先连接钱包",
                variant: "destructive",
            });
            return;
        }
        setOpen(open);
        if (!open) {
            setStep(1);
            setData({
                name: '',
                avatar: null,
                creatorWallet: '',
                description: '',
                contractAddress: '',
                ctos: [{ tweetName: '', tweetHandle: '' }],
                communityStory: {
                    title: '',
                    slogan: '',
                    description: '',
                    qas: [{ question: '', answers: [''] }]
                }
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!connected || !publicKey) {
            toast({
                title: "请先连接钱包",
                description: "创建社区需要先连接钱包",
                variant: "destructive",
            });
            return;
        }

        if (step < 3) {
            setStep(step + 1);
            return;
        }

        setIsSubmitting(true);
        try {
            const ensureValidUrl = (url: string | undefined) => {
                if (!url) return "";
                if (url.startsWith('http://') || url.startsWith('https://')) {
                    return url;
                }
                return `https://${url}`;
            };

            const requestBody = {
                name: data.name,
                description: data.description || "这是一个新的社区",
                avatarUrl: data.avatar,
                creatorWalletAddress: publicKey.toString(),
                isPrivate: false,
                website: ensureValidUrl(data.website) || "",
                twitter: ensureValidUrl(data.twitter) || "",
                telegram: ensureValidUrl(data.telegram) || "",
                discord: ensureValidUrl(data.discord) || "",
                ca: data.contractAddress,
                cto: data.ctos.map(cto => ({
                    ctoname: cto.tweetName,
                    ctotweethandle: cto.tweetHandle,
                    isAi: false
                })).filter(cto => cto.ctotweethandle && cto.ctoname),
                communityStory: {
                    title: data.communityStory?.title || "",
                    slogan: data.communityStory?.slogan || "",
                    description: data.communityStory?.description || "",
                    questionAndAnswer: data.communityStory?.qas.map(qa => ({
                        question: qa.question,
                        answer: qa.answers
                    })) || []
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
                toast({
                    title: "创建成功",
                    description: "社区已成功创建",
                    variant: "default",
                });

                setOpen(false);
                setData({
                    name: '',
                    avatar: null,
                    creatorWallet: '',
                    description: '',
                    contractAddress: '',
                    ctos: [{ tweetName: '', tweetHandle: '' }],
                    communityStory: {
                        title: '',
                        slogan: '',
                        description: '',
                        qas: [{ question: '', answers: [''] }]
                    }
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
            toast({
                title: "创建失败",
                description: (error as Error).message || "创建社区时发生错误",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                连接钱包
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
                            {step === 3 && (
                                <CommunityStory
                                    data={{
                                        title: data.communityStory?.title || '',
                                        slogan: data.communityStory?.slogan || '',
                                        description: data.communityStory?.description || '',
                                        qas: data.communityStory?.qas || []
                                    }}
                                    onChange={handleChange}
                                />
                            )}
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
                                '提交申请&等待审核'
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