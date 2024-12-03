'use client';

import { motion } from 'framer-motion';
import { Copy, Check, Heart, PlusCircle, Twitter } from 'lucide-react';
import { useState } from 'react';
import { TweetComposer } from "@/components/tweet/TweetComposer";

interface Tweet {
    id: string;
    content: string;
    author: string;
    createdAt: string;
    likes: number;
    isLiked?: boolean;
}

export function ChineseTweets() {
    const [tweets, setTweets] = useState<Tweet[]>([
        {
            id: '1',
            content: "🚀 $TWOCAT 正在改变游戏规则！\n\n💎 独特的双猫机制\n🌟 强大的社区文化\n📈 持续增长的价值\n\n加入我们，一起见证传奇的诞生！\n\n官网：https://twocat.fun\n\n#TwoCat #Memecoin #Solana",
            author: "0x1234...5678",
            createdAt: "2024-03-20",
            likes: 42,
        },
        {
            id: '2',
            content: "🐱 Two Cat 不仅仅是一个 meme，更是一个充满活力的社区！\n\n🤝 公平发射\n🌟 社区驱动\n💪 强大共识\n\n起来感受 #TwoCat 的魅力！\n\n$TWOCAT #Solana #Memecoin",
            author: "0x9876...5432",
            createdAt: "2024-03-21",
            likes: 38,
        },
        {
            id: '3',
            content: "📢 重大突破！$TWOCAT 24小时交易量突破100万美元！\n\n💫 社区力量无限\n🌈 梦想触手可及\n🎯 目标直指月球\n\n一起见证奇迹的诞生！\n\n#TwoCat #SolanaNFT #Crypto",
            author: "0xabcd...efgh",
            createdAt: "2024-03-22",
            likes: 56,
        },
        {
            id: '4',
            content: "💎 为什么选择 $TWOCAT？\n\n✅ 完全去中心化\n✅ 社区驱动治理\n✅ 创新双猫机制\n✅ 透明公平分配\n\n加入我们，共创未来！\n\n#TwoCat #SolanaEcosystem #Web3",
            author: "0x7890...1234",
            createdAt: "2024-03-23",
            likes: 45,
        },
        {
            id: '5',
            content: "🎉 突破性消息！\n\n$TWOCAT 即将上线多个主流交易所！\n\n⚡️ 流动性提升\n📈 价值持续攀升\n🌍 全球化扩张\n\n机不可失，时不再来！\n\n#TwoCat #Solana #DeFi",
            author: "0xdef0...5678",
            createdAt: "2024-03-24",
            likes: 67,
        },
        {
            id: '6',
            content: "🔥 $TWOCAT 生态系统更新！\n\n🎮 NFT游戏化应用\n💰 质押奖励机制\n🤝 跨链桥即将上线\n\n革新永不停步！\n\nTG: t.me/twocatofficial\n\n#TwoCat #GameFi #NFT",
            author: "0x3456...7890",
            createdAt: "2024-03-25",
            likes: 51,
        },
        {
            id: '7',
            content: "📊 $TWOCAT 数据追踪：\n\n👥 持有者突破10,000\n📈 市值突破1000万\n🔄 日交易量稳定增长\n\n稳健发展，持续向好！\n\n#TwoCat #SolanaToken #Analysis",
            author: "0x2468...1357",
            createdAt: "2024-03-26",
            likes: 48,
        },
        {
            id: '8',
            content: "🌟 重要合作公告！\n\n$TWOCAT 正式与多个知名项目达成战略合作！\n\n🤝 生态互通\n📈 价值共享\n🚀 共同发展\n\n未来可期！\n\n#TwoCat #Partnership #Blockchain",
            author: "0x1357...2468",
            createdAt: "2024-03-27",
            likes: 73,
        },
        {
            id: '9',
            content: "💡 $TWOCAT 创新亮点：\n\n🔒 智能合约审计完成\n🛡️ 多重安全保障\n💎 通缩代币经济学\n🌐 去中心化治理\n\n安全、透明、创新！\n\n#TwoCat #Security #Innovation",
            author: "0x8642...9753",
            createdAt: "2024-03-28",
            likes: 62,
        }
    ]);

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (content: string, id: string) => {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleAddTweet = (content: string) => {
        const newTweetObj: Tweet = {
            id: (tweets.length + 1).toString(),
            content,
            author: "0xNewUser",
            createdAt: new Date().toISOString().split('T')[0],
            likes: 0,
        };
        setTweets([newTweetObj, ...tweets]);
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
                {/* 头部区域 */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white/90">
                            社区推文库
                        </h1>
                        <p className="text-sm sm:text-base text-white/60 mt-2">
                            在这里找到完美的推文，帮助传播 Two Cat 的故事
                        </p>
                    </div>

                    {/* 使用 TweetComposer 组件 */}
                    <TweetComposer onAddTweet={handleAddTweet} />
                </div>

                {/* 推文网格 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tweets.map((tweet, index) => (
                        <motion.div
                            key={tweet.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 rounded-md border border-white/10 p-4 sm:p-5 group 
                                     hover:bg-white/[0.07] transition-all duration-300
                                     flex flex-col justify-between min-h-[200px]"
                        >
                            {/* 推文内容 */}
                            <div className="whitespace-pre-line text-white/90 text-sm sm:text-base">
                                {tweet.content}
                            </div>

                            {/* 底部信息栏 */}
                            <div className="mt-4">
                                {/* 分割线 */}
                                <div className="h-[1px] bg-white/10 mb-4"></div>

                                {/* 作者信息和操作按钮 */}
                                <div className="flex items-center justify-between">
                                    {/* 作者信息 */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs sm:text-sm text-white/60">{tweet.author}</span>
                                        <span className="text-xs text-white/40">·</span>
                                        <span className="text-xs sm:text-sm text-white/40">{tweet.createdAt}</span>
                                    </div>

                                    {/* 操作按钮组 */}
                                    <div className="flex items-center gap-2">
                                        {/* 复制按钮 */}
                                        <button
                                            onClick={() => handleCopy(tweet.content, tweet.id)}
                                            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md
                                                     bg-white/5 hover:bg-white/10 
                                                     transition-all duration-200"
                                        >
                                            {copiedId === tweet.id ? (
                                                <>
                                                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#53b991]" />
                                                    <span className="hidden sm:inline text-xs sm:text-sm text-[#53b991]">已复制</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/60" />
                                                    <span className="hidden sm:inline text-xs sm:text-sm text-white/60">复制</span>
                                                </>
                                            )}
                                        </button>

                                        {/* 发推按钮 */}
                                        <a
                                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet.content)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md
                                                     bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 
                                                     text-[#1DA1F2] transition-all duration-200"
                                        >
                                            <Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                            <span className="hidden sm:inline text-xs sm:text-sm">发推</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}