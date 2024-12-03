'use client';

import { motion } from 'framer-motion';
import { Copy, Check, MessageCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { AddTweetDialog } from './AddTweetDialog';

interface Tweet {
    id: string;
    tweetUrl: string;
    author: {
        name: string;
        handle: string;
    };
    content: string;
    createdAt: string;
}

export function BoostAddresses() {
    const [tweets, setTweets] = useState<Tweet[]>([
        {
            id: '1',
            tweetUrl: 'https://twitter.com/user1/status/123456789',
            author: {
                name: 'Web3 Enthusiast',
                handle: '@web3eth',
            },
            content: "Just discovered $TWOCAT - a revolutionary meme token on #Solana! The dual-cat mechanism is genius. Community is amazing! 🚀",
            createdAt: '2024-03-20',
        },
        {
            id: '2',
            tweetUrl: 'https://twitter.com/user2/status/987654321',
            author: {
                name: 'Crypto Cat',
                handle: '@cryptocat',
            },
            content: "Two Cat is not just a meme, it's a movement! Join the revolution and let's make history together. #TwoCat #CryptoRevolution",
            createdAt: '2024-03-21',
        },
        {
            id: '3',
            tweetUrl: 'https://twitter.com/user3/status/192837465',
            author: {
                name: 'Blockchain Guru',
                handle: '@blockchainguru',
            },
            content: "The $TWOCAT community is one of the most vibrant and supportive I've ever seen. Proud to be a part of this journey! 🚀",
            createdAt: '2024-03-22',
        },
        {
            id: '4',
            tweetUrl: 'https://twitter.com/user4/status/564738291',
            author: {
                name: 'DeFi Master',
                handle: '@defimaster',
            },
            content: "Exploring the potential of $TWOCAT in the DeFi space. The possibilities are endless! #DeFi #TwoCat",
            createdAt: '2024-03-23',
        },
        {
            id: '5',
            tweetUrl: 'https://twitter.com/user5/status/102938475',
            author: {
                name: 'NFT Collector',
                handle: '@nftcollector',
            },
            content: "Two Cat NFTs are the next big thing! Can't wait to see what the community creates. #NFT #TwoCat",
            createdAt: '2024-03-24',
        },
        // ... 更多推文数据
    ]);

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleAddTweet = (newTweet: { tweetUrl: string; authorName: string; authorHandle: string; content: string; }) => {
        const newTweetData: Tweet = {
            id: (tweets.length + 1).toString(),
            tweetUrl: newTweet.tweetUrl,
            author: {
                name: newTweet.authorName,
                handle: newTweet.authorHandle,
            },
            content: newTweet.content,
            createdAt: new Date().toISOString().split('T')[0],
        };

        setTweets([newTweetData, ...tweets]);
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
                            key={tweet.id}
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
                                            {tweet.author.name}
                                        </div>
                                        <div className="text-xs sm:text-sm text-white/60">
                                            {tweet.author.handle}
                                        </div>
                                    </div>
                                </div>

                                {/* 推文内容 - 调整字体大小和行高 */}
                                <p className="text-sm sm:text-base text-white/80 mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
                                    {tweet.content}
                                </p>

                                {/* 操作按钮组 - 移动端优化 */}
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* 复制链接按钮 */}
                                    <button
                                        onClick={() => handleCopy(tweet.tweetUrl, tweet.id)}
                                        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md
                                                 bg-white/5 hover:bg-white/10 
                                                 transition-all duration-200"
                                    >
                                        {copiedId === tweet.id ? (
                                            <>
                                                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#53b991]" />
                                                <span className="text-xs sm:text-sm text-[#53b991]">已复制</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/60" />
                                                <span className="text-xs sm:text-sm text-white/60">复制链接</span>
                                            </>
                                        )}
                                    </button>

                                    {/* 回复按钮 */}
                                    <a
                                        href={`${tweet.tweetUrl}/reply`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md
                                                 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 
                                                 text-[#1DA1F2] transition-all duration-200"
                                    >
                                        <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        <span className="text-xs sm:text-sm">回复</span>
                                    </a>

                                    {/* 访问按钮 */}
                                    <a
                                        href={tweet.tweetUrl}
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