'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { CommunityBasicInfo } from './community/steps/CommunityBasicInfo';
import { CommunityDetailedInfo } from './community/steps/CommunityDetailedInfo';
import { CommunityStory } from './community/steps/CommunityStory';
import { motion, AnimatePresence } from 'framer-motion';

export interface CommunityData {
    name: string;
    avatar: string | null;
    avatarFile: File | null;
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
    const [step, setStep] = useState(1);
    const [data, setData] = useState<CommunityData>({
        name: '',
        avatar: null,
        avatarFile: null,
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
                avatarFile: null,
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

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#53b991] to-[#9ad499] hover:opacity-90 transition-opacity">
                    <Sparkles className="w-4 h-4 mr-2" />
                    创建社区
                </Button>
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

                <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (step < 3) {
                        setStep(step + 1);
                        return;
                    }
                    setIsSubmitting(true);
                    try {
                        await onSubmit?.(data);
                        setOpen(false);
                    } catch (error) {
                        console.error('提交失败:', error);
                    } finally {
                        setIsSubmitting(false);
                    }
                }} className="space-y-6">
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
                            disabled={isSubmitting}
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