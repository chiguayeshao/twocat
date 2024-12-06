import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Sparkles, Languages, Plus, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from "@/components/ui/button";

interface TweetComposerProps {
    onAddTweet: (content: string, publicKey: string) => void;
    defaultLanguage?: 'zh' | 'en';
}

export function TweetComposer({ onAddTweet, defaultLanguage = 'zh' }: TweetComposerProps) {
    const { connected, publicKey } = useWallet();
    const { toast } = useToast();
    const [newTweet, setNewTweet] = useState<string>('');
    const [useAI, setUseAI] = useState<boolean>(false);
    const [language, setLanguage] = useState<'zh' | 'en'>(defaultLanguage);
    const [open, setOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setLanguage(defaultLanguage);
    }, [defaultLanguage]);

    const handleAddTweet = () => {
        if (!connected || !publicKey) {
            toast({
                title: language === 'zh' ? "请先连接钱包" : "Please connect wallet",
                description: language === 'zh' ? "发布推文需要先连接钱包" : "Wallet connection required to post",
                variant: "destructive",
            });
            return;
        }

        if (newTweet.trim()) {
            onAddTweet(newTweet, publicKey?.toString() || '');
            setNewTweet('');
            setOpen(false);
            toast({
                title: language === 'zh' ? "发布成功" : "发布成功",
                description: language === 'zh' ? "你的推文已成功发布" : "你的推文已成功发布",
                variant: "success",
            });
        }
    };

    const generateTweet = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch(`/api/AIAgents/generate?language=${language}`, {
                method: 'POST',
            });
            
            if (!response.ok) {
                throw new Error('生成失败');
            }
            
            const data = await response.json();
            setNewTweet(data.content);
        } catch (error) {
            toast({
                title: language === 'zh' ? "生成失败" : "Generation failed",
                description: language === 'zh' ? "请稍后重试" : "Please try again later", 
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg
                             bg-gradient-to-r from-[#53b991]/10 to-[#53b991]/20
                             border border-[#53b991]/20 hover:border-[#53b991]/30
                             transition-all duration-300"
                >
                    <Plus className="h-4 w-4 text-[#53b991]" />
                    <span className="text-sm font-medium text-[#53b991]">添加推文</span>
                </motion.button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] bg-[#1a1b1e] border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white/90">创建新推文</DialogTitle>
                </DialogHeader>

                <div className="mt-6 space-y-6">
                    {/* 设置选项 */}
                    <div className="grid grid-cols-1 gap-6 bg-white/5 p-4 rounded-lg">
                        {/* 语言选择 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Languages className="h-5 w-5 text-[#53b991]" />
                                <span className="text-sm font-medium text-white/80">语言选择</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    disabled
                                    className={`px-3 py-1.5 rounded-md text-sm transition-all cursor-not-allowed
                                            ${language === 'zh'
                                            ? 'bg-[#53b991] text-white'
                                            : 'bg-white/5 text-white/40'}`}
                                >
                                    中文
                                </button>
                                <button
                                    disabled
                                    className={`px-3 py-1.5 rounded-md text-sm transition-all cursor-not-allowed
                                            ${language === 'en'
                                            ? 'bg-[#53b991] text-white'
                                            : 'bg-white/5 text-white/40'}`}
                                >
                                    English
                                </button>
                            </div>
                        </div>

                        {/* AI 辅助选项 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-[#53b991]" />
                                <span className="text-sm font-medium text-white/80">AI 辅助创作</span>
                            </div>
                            <Switch
                                checked={useAI}
                                onCheckedChange={setUseAI}
                                className="data-[state=checked]:bg-[#53b991]"
                            />
                        </div>
                    </div>

                    {/* 推文编辑区 */}
                    <div className="space-y-4">
                        <textarea
                            value={newTweet}
                            onChange={(e) => setNewTweet(e.target.value)}
                            placeholder="输入你的推文内容..."
                            className="w-full p-4 rounded-lg bg-white/5 border border-white/10 
                                     text-white/90 placeholder-white/40
                                     focus:outline-none focus:ring-2 focus:ring-[#53b991]/50
                                     transition-all duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                            rows={6}
                            disabled={isGenerating}
                        />
                        
                        {/* 按钮组 */}
                        <div className="flex gap-3">
                            {/* AI 生成按钮 */}
                            {useAI && (
                                <motion.button
                                    whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                                    whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                                    onClick={generateTweet}
                                    disabled={isGenerating}
                                    className="flex-1 py-2.5 rounded-lg flex items-center justify-center
                                             bg-[#53b991]/20 hover:bg-[#53b991]/30 
                                             text-[#53b991] border border-[#53b991]/30
                                             font-medium transition-all duration-300
                                             disabled:opacity-50 disabled:cursor-not-allowed
                                             disabled:hover:bg-[#53b991]/20"
                                >
                                    <Wand2 className="h-4 w-4 mr-2" />
                                    {isGenerating ? "生成中..." : "AI 生成"}
                                </motion.button>
                            )}

                            {/* 发布按钮 */}
                            <motion.button
                                whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                                whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                                onClick={handleAddTweet}
                                disabled={isGenerating}
                                className="flex-1 py-2.5 rounded-lg
                                         bg-gradient-to-r from-[#53b991] to-[#53b991]/90
                                         text-white font-medium
                                         transition-all duration-300
                                         hover:from-[#53b991]/90 hover:to-[#53b991]/80
                                         disabled:opacity-50 disabled:cursor-not-allowed
                                         disabled:hover:from-[#53b991] disabled:hover:to-[#53b991]/90"
                            >
                                发布推文
                            </motion.button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}