'use client';

import { motion } from 'framer-motion';
import { Copy, Check, MessageCircle, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AddTweetDialog } from './AddTweetDialog';
import { ReplyDialog } from './ReplyDialog';
import { useToast } from '@/hooks/use-toast';

interface Tweet {
    _id: string;
    tweetLink: string;
    tweetName: string;
    tweetHandle: string;
    tweetContent: string;
    creator: string;
    createdAt: string;
}

export function BoostAddresses({ roomId }: { roomId: string }) {
    const { toast } = useToast();
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetchTweets();
    }, []);

    const fetchTweets = async () => {
        try {
            const response = await fetch(`/api/rooms/push-tweets?roomId=${roomId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch tweets');
            }
            const result = await response.json();
            if (result.success && result.data) {
                const sortedTweets = result.data.sort((a: Tweet, b: Tweet) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                setTweets(sortedTweets);
            } else {
                setError(result.message || '获取推文失败');
            }
        } catch (err) {
            setError('获取推文时发生错误');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleAddTweet = async (newTweet: { tweetUrl: string; authorName: string; authorHandle: string; content: string; }) => {
        try {
            const response = await fetch(`/api/rooms/push-tweets?roomId=${roomId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    creator: "0x1234...56718", // 这里需要传入实际的钱包地址
                    tweetLink: newTweet.tweetUrl,
                    tweetName: newTweet.authorName,
                    tweetHandle: newTweet.authorHandle,
                    tweetContent: newTweet.content,
                }),
            });

            const result = await response.json();
            if (result.success) {
                setTweets([result.data, ...tweets]);
                toast({
                    title: "添加成功",
                    description: "推文已成功添加到列表中",
                });
            } else {
                throw new Error(result.message || '添加失败');
            }
        } catch (err) {
            toast({
                title: "添加失败",
                description: "添加推文时发生错误",
                variant: "destructive",
            });
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-4 sm:pt-8">
                {/* 头部区域 - 调整移动端间距和布局 */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-6 sm:mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1"
                    >
                        <h1 className="text-xl sm:text-2xl font-bold text-white/90 mb-1 sm:mb-2">社区冲推地址</h1>
                        <p className="text-sm sm:text-base text-white/60">
                            这些是社区成员提供的优质推文，让我们一起互动起来！
                        </p>
                    </motion.div>

                    {/* 添加推文按钮 - 移动端全宽显示 */}
                    <div className="w-full sm:w-auto">
                        <AddTweetDialog onAddTweet={handleAddTweet} />
                    </div>
                </div>

                {/* 推文列表 - 调整网格布局和间距 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    {tweets.map((tweet, index) => (
                        <motion.div
                            key={tweet._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-discord-secondary rounded-lg border border-white/10 overflow-hidden
                                     hover:border-[#53b991]/30 transition-all duration-300"
                        >
                            {/* 推文内容区域 - 调整内边距 */}
                            <div className="p-3 sm:p-4">
                                {/* 作者信息 */}
                                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                    <div>
                                        <div className="font-medium text-white/90 text-sm sm:text-base">
                                            {tweet.tweetName}
                                        </div>
                                        <div className="text-xs sm:text-sm text-white/60">
                                            {tweet.tweetHandle}
                                        </div>
                                    </div>
                                </div>

                                {/* 推文内容 - 调整字体大小和行高 */}
                                <p className="text-sm sm:text-base text-white/80 mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
                                    {tweet.tweetContent}
                                </p>

                                {/* 操作按钮组 - 移动端优化 */}
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* 复制链接按钮 */}
                                    <button
                                        onClick={() => handleCopy(tweet.tweetLink, tweet._id)}
                                        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md
                                                 bg-white/5 hover:bg-white/10 
                                                 transition-all duration-200"
                                    >
                                        {copiedId === tweet._id ? (
                                            <>
                                                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#53b991]" />
                                                <span className="text-xs sm:text-sm text-[#53b991]">已���制</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/60" />
                                                <span className="text-xs sm:text-sm text-white/60">复制链接</span>
                                            </>
                                        )}
                                    </button>

                                    {/* 回复按钮 */}
                                    <ReplyDialog
                                        tweet={{
                                            tweetUrl: tweet.tweetLink,
                                            author: {
                                                name: tweet.tweetName,
                                                handle: tweet.tweetHandle
                                            },
                                            content: tweet.tweetContent
                                        }}
                                    />

                                    {/* 访问按钮 */}
                                    <a
                                        href={tweet.tweetLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md
                                                 bg-white/5 hover:bg-white/10 
                                                 text-white/60 hover:text-white/90 transition-all duration-200"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        <span className="text-xs sm:text-sm">访问</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}