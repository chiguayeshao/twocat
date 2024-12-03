import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';

interface ReplyDialogProps {
    tweet: {
        tweetUrl: string;
        author: {
            name: string;
            handle: string;
        };
        content: string;
    };
}

export function ReplyDialog({ tweet }: ReplyDialogProps) {
    const [aiAssistance, setAiAssistance] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleSwitchChange = (checked: boolean) => {
        setAiAssistance(checked);
    };

    const handleGenerateContent = () => {
        // 模拟 AI 生成内容
        setReplyContent(`AI 生成的回复内容: 感谢 ${tweet.author.name} 的分享！`);
    };

    const handleReply = () => {
        const replyUrl = `${tweet.tweetUrl}/reply?text=${encodeURIComponent(replyContent)}`;
        window.open(replyUrl, '_blank');
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md
                                 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 
                                 text-[#1DA1F2] transition-all duration-200">
                    <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">回复</span>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-[#1e1f22] border-none shadow-xl rounded-xl
                                    backdrop-blur-xl backdrop-saturate-150 max-h-[80vh] overflow-y-auto">
                <DialogHeader className="border-b border-white/10 pb-4">
                    <DialogTitle className="text-lg font-semibold text-white/90">回复推文</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                    {/* 作者信息卡片 */}
                    <div className="bg-[#2b2d31] rounded-lg p-4 space-y-1">
                        <h3 className="text-sm font-medium text-white/90">推文作者</h3>
                        <p className="text-sm text-white/60">
                            {tweet.author.name}
                            <span className="ml-1.5 text-white/40">{tweet.author.handle}</span>
                        </p>
                    </div>

                    {/* 推文内容卡片 */}
                    <div className="bg-[#2b2d31] rounded-lg p-4 space-y-1">
                        <h3 className="text-sm font-medium text-white/90">推文内容</h3>
                        <p className="text-sm text-white/60 whitespace-pre-line leading-relaxed">
                            {tweet.content}
                        </p>
                    </div>

                    {/* AI 辅助开关 */}
                    <div className="flex items-center justify-between p-4 bg-[#2b2d31] rounded-lg">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-[#53b991]" />
                            <span className="text-sm font-medium text-white/90">AI 辅助</span>
                        </div>
                        <Switch
                            checked={aiAssistance}
                            onCheckedChange={handleSwitchChange}
                            className="data-[state=checked]:bg-[#53b991]"
                        />
                    </div>

                    {/* 回复内容输入框 */}
                    <div className="space-y-2">
                        <textarea
                            className="w-full min-h-[120px] p-4 bg-[#2b2d31] border border-white/10 
                                     rounded-lg text-sm text-white/90 placeholder:text-white/40
                                     focus:outline-none focus:ring-2 focus:ring-[#53b991]/50
                                     transition-all duration-200"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="输入您的回复..."
                        />
                    </div>

                    {/* 按钮组 */}
                    <div className="flex justify-end gap-2 pt-2">
                        {aiAssistance && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGenerateContent}
                                className="flex items-center gap-1.5 px-4 py-2 
                                         bg-[#53b991]/10 hover:bg-[#53b991]/20 
                                         text-[#53b991] text-sm font-medium rounded-lg 
                                         transition-all duration-200"
                            >
                                <Sparkles className="h-4 w-4" />
                                生成内容
                            </motion.button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleReply}
                            className="px-4 py-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 
                                 text-[#1DA1F2] text-sm font-medium rounded-lg 
                                 transition-all duration-200"
                        >
                            回复
                        </motion.button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}