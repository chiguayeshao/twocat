'use client';

import { motion } from 'framer-motion';
import { Copy, Check, Twitter } from 'lucide-react';
import { useState } from 'react';
import { TweetComposer } from "@/components/tweet/TweetComposer";

interface Tweet {
    id: string;
    content: string;
    author: string;
    createdAt: string;
}

export function EnglishTweets() {
    const [tweets, setTweets] = useState<Tweet[]>([
        {
            id: '1',
            content: "🚀 $TWOCAT is changing the game!\n\n💎 Unique dual-cat mechanism\n🌟 Strong community culture\n📈 Continuous value growth\n\nJoin us and witness the birth of a legend!\n\nWebsite: https://twocat.fun\n\n#TwoCat #Memecoin #Solana",
            author: "0x1234...5678",
            createdAt: "2024-03-20",
        },
        {
            id: '2',
            content: "🐱 Two Cat isn't just a meme, it's a vibrant community!\n\n🤝 Fair launch\n🌟 Community driven\n💪 Strong consensus\n\nCome feel the magic of #TwoCat!\n\n$TWOCAT #Solana #Memecoin",
            author: "0x9876...5432",
            createdAt: "2024-03-21",
        },
        {
            id: '3',
            content: "📢 Major breakthrough! $TWOCAT 24h trading volume exceeds $1M!\n\n💫 Unlimited community power\n🌈 Dreams within reach\n🎯 Aiming for the moon\n\nWitness the birth of a miracle!\n\n#TwoCat #SolanaNFT #Crypto",
            author: "0xabcd...efgh",
            createdAt: "2024-03-22",
        },
        {
            id: '4',
            content: "💎 Why choose $TWOCAT?\n\n✅ Fully decentralized\n✅ Community-driven governance\n✅ Innovative dual-cat mechanism\n✅ Transparent fair distribution\n\nJoin us in creating the future!\n\n#TwoCat #SolanaEcosystem #Web3",
            author: "0x7890...1234",
            createdAt: "2024-03-23",
        },
        {
            id: '5',
            content: "🎉 Breaking News!\n\n$TWOCAT is listing on major exchanges soon!\n\n⚡️ Enhanced liquidity\n📈 Rising value\n🌍 Global expansion\n\nDon't miss this opportunity!\n\n#TwoCat #Solana #DeFi",
            author: "0xdef0...5678",
            createdAt: "2024-03-24",
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
        };
        setTweets([newTweetObj, ...tweets]);
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
                {/* Header section */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white/90">
                            Community Tweet Library
                        </h1>
                        <p className="text-white/60 mt-2">
                            Find the perfect tweets to help spread the Two Cat story
                        </p>
                    </div>

                    {/* Tweet Composer */}
                    <TweetComposer onAddTweet={handleAddTweet} />
                </div>

                {/* Tweet grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tweets.map((tweet, index) => (
                        <motion.div
                            key={tweet.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 rounded-md border border-white/10 p-5 group 
                                     hover:bg-white/[0.07] transition-all duration-300
                                     flex flex-col justify-between min-h-[200px]"
                        >
                            {/* Tweet content */}
                            <div className="whitespace-pre-line text-white/90">
                                {tweet.content}
                            </div>

                            {/* Bottom info bar */}
                            <div className="mt-4">
                                {/* Divider */}
                                <div className="h-[1px] bg-white/10 mb-4"></div>

                                {/* Author info and action buttons */}
                                <div className="flex items-center justify-between">
                                    {/* Author info */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-white/60">{tweet.author}</span>
                                        <span className="text-xs text-white/40">·</span>
                                        <span className="text-sm text-white/40">{tweet.createdAt}</span>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2">
                                        {/* Copy button */}
                                        <button
                                            onClick={() => handleCopy(tweet.content, tweet.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md
                                                     bg-white/5 hover:bg-white/10 
                                                     transition-all duration-200"
                                        >
                                            {copiedId === tweet.id ? (
                                                <>
                                                    <Check className="h-4 w-4 text-[#53b991]" />
                                                    <span className="text-sm text-[#53b991]">Copied</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-4 w-4 text-white/60" />
                                                    <span className="text-sm text-white/60">Copy</span>
                                                </>
                                            )}
                                        </button>

                                        {/* Tweet button */}
                                        <a
                                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet.content)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md
                                                     bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 
                                                     text-[#1DA1F2] transition-all duration-200"
                                        >
                                            <Twitter className="h-4 w-4" />
                                            <span className="text-sm">Tweet</span>
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