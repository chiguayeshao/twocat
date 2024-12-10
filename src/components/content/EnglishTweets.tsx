'use client';

import { motion } from 'framer-motion';
import { Copy, Check, Twitter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TweetComposer } from "@/components/tweet/TweetComposer";
import { useToast } from '@/hooks/use-toast';

interface Tweet {
    _id: string;
    creator: string;
    englishTweetContent: string;
    createdAt: string;
}

export function EnglishTweets({ roomId }: { roomId: string }) {
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
            const response = await fetch(`/api/rooms/english-tweets?roomId=${roomId}`);
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
                setError(result.message || 'Failed to fetch tweets');
            }
        } catch (err) {
            setError('Error fetching tweets');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (content: string, id: string) => {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleAddTweet = async (content: string, publicKey: string) => {
        try {
            const response = await fetch(`/api/rooms/english-tweets?roomId=${roomId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    creator: publicKey,
                    englishTweetContent: content,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create tweet");
            }

            const result = await response.json();
            if (result.success && result.data) {
                setTweets([result.data, ...tweets]);
            } else {
                console.error("Failed to create tweet:", result.message);
                toast({
                    title: "Failed to Post",
                    description: result.message || "Failed to create tweet",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error creating tweet:", error);
            toast({
                title: "Failed to Post",
                description: "Error creating tweet",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white/90">
                            Community Tweet Library
                        </h1>
                        <p className="text-sm sm:text-base text-white/60 mt-2">
                            Find the perfect tweets to help spread our story
                        </p>
                    </div>

                    <TweetComposer onAddTweet={handleAddTweet} defaultLanguage="en" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tweets.map((tweet, index) => (
                        <motion.div
                            key={tweet._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 rounded-md border border-white/10 p-4 sm:p-5 group 
                                     hover:bg-white/[0.07] transition-all duration-300
                                     flex flex-col h-[300px]"
                        >
                            <div className="flex-1 overflow-y-auto">
                                <div className="whitespace-pre-line text-white/90 text-sm sm:text-base">
                                    {tweet.englishTweetContent}
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="h-[1px] bg-white/10 mb-4"></div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs sm:text-sm text-white/60">
                                            {tweet.creator.slice(0, 4)}...{tweet.creator.slice(-4)}
                                        </span>
                                        <span className="text-xs text-white/40">·</span>
                                        <span className="text-xs sm:text-sm text-white/40">
                                            {new Date(tweet.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleCopy(tweet.englishTweetContent, tweet._id)}
                                            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md
                                                     bg-white/5 hover:bg-white/10 
                                                     transition-all duration-200"
                                        >
                                            {copiedId === tweet._id ? (
                                                <>
                                                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#53b991]" />
                                                    <span className="hidden sm:inline text-xs sm:text-sm text-[#53b991]">Copied</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/60" />
                                                    <span className="hidden sm:inline text-xs sm:text-sm text-white/60">Copy</span>
                                                </>
                                            )}
                                        </button>

                                        <a
                                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet.englishTweetContent)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md
                                                     bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 
                                                     text-[#1DA1F2] transition-all duration-200"
                                        >
                                            <Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                            <span className="hidden sm:inline text-xs sm:text-sm">Tweet</span>
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