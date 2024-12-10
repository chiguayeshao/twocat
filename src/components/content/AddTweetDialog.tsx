import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@solana/wallet-adapter-react';

interface AddTweetDialogProps {
    onAddTweet: (tweet: {
        tweetUrl: string;
        authorName: string;
        authorHandle: string;
        content: string;
    }) => void;
}

export function AddTweetDialog({ onAddTweet }: AddTweetDialogProps) {
    const [open, setOpen] = useState(false);
    const [newTweet, setNewTweet] = useState({
        tweetUrl: '',
        authorName: '',
        authorHandle: '',
        content: '',
    });

    const { connected, publicKey } = useWallet();
    const { toast } = useToast();

    const handleAddTweet = async () => {
        if (!connected || !publicKey) {
            toast({
                title: "请先连接钱包",
                description: "添加推文需要先连接钱包",
                variant: "destructive",
            });
            return;
        }

        await onAddTweet(newTweet);
        setNewTweet({
            tweetUrl: '',
            authorName: '',
            authorHandle: '',
            content: '',
        });
        setOpen(false);
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

            <DialogContent className="sm:max-w-[600px] bg-discord-secondary border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white/90">添加推文</DialogTitle>
                </DialogHeader>

                <div className="mt-6 space-y-4">
                 
                    <input
                        type="text"
                        value={newTweet.authorName}
                        onChange={(e) => setNewTweet({ ...newTweet, authorName: e.target.value })}
                        placeholder="推文作者"
                        className="w-full p-3 rounded-lg bg-white/5 border border-white/10 
                                 text-white/90 placeholder-white/40
                                 focus:outline-none focus:ring-2 focus:ring-[#53b991]/50
                                 transition-all duration-200"
                    />
                    <input
                        type="text"
                        value={newTweet.authorHandle}
                        onChange={(e) => setNewTweet({ ...newTweet, authorHandle: e.target.value })}
                        placeholder="推文句柄@"
                        className="w-full p-3 rounded-lg bg-white/5 border border-white/10 
                                 text-white/90 placeholder-white/40
                                 focus:outline-none focus:ring-2 focus:ring-[#53b991]/50
                                 transition-all duration-200"
                    />
                    <textarea
                        value={newTweet.content}
                        onChange={(e) => setNewTweet({ ...newTweet, content: e.target.value })}
                        placeholder="推文内容"
                        className="w-full p-3 rounded-lg bg-white/5 border border-white/10 
                                 text-white/90 placeholder-white/40
                                 focus:outline-none focus:ring-2 focus:ring-[#53b991]/50
                                 transition-all duration-200"
                        rows={4}
                    />

<input
                        type="text"
                        value={newTweet.tweetUrl}
                        onChange={(e) => setNewTweet({ ...newTweet, tweetUrl: e.target.value })}
                        placeholder="推文链接"
                        className="w-full p-3 rounded-lg bg-white/5 border border-white/10 
                                 text-white/90 placeholder-white/40
                                 focus:outline-none focus:ring-2 focus:ring-[#53b991]/50
                                 transition-all duration-200"
                    />

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddTweet}
                        className="w-full py-2.5 rounded-lg
                                 bg-gradient-to-r from-[#53b991] to-[#53b991]/90
                                 text-white font-medium
                                 transition-all duration-300
                                 hover:from-[#53b991]/90 hover:to-[#53b991]/80"
                    >
                        添加推文
                    </motion.button>
                </div>
            </DialogContent>
        </Dialog>
    );
}