import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Repeat, MessageSquare, ExternalLink, TrendingUp, Clock, ThumbsUp } from 'lucide-react';
import { ReplyDialog } from './ReplyDialog';

interface Tweet {
    id: string;
    username: string;
    userId: string;
    tags: string[];
    content: string;
    timestamp: string;
    likes: number;
    retweets: number;
}

const mockTweets: Tweet[] = [
    {
        id: '1',
        username: 'KOL1',
        userId: '@kol1',
        tags: ['media', 'news', 'crypto'],
        content: 'Exploring the latest trends in crypto...',
        timestamp: '2023-10-01T12:00:00Z',
        likes: 120,
        retweets: 45,
    },
    {
        id: '2',
        username: 'KOL2',
        userId: '@kol2',
        tags: ['media', 'crypto', 'research'],
        content: 'Deep dive into blockchain technology...',
        timestamp: '2023-10-02T14:30:00Z',
        likes: 150,
        retweets: 60,
    },
    {
        id: '3',
        username: 'KOL3',
        userId: '@kol3',
        tags: ['kol'],
        content: 'Join our community for exclusive insights...',
        timestamp: '2023-10-03T09:00:00Z',
        likes: 200,
        retweets: 80,
    },
    {
        id: '4',
        username: 'KOL4',
        userId: '@kol4',
        tags: ['crypto', 'kol'],
        content: 'Crypto market analysis and predictions...',
        timestamp: '2023-10-04T16:45:00Z',
        likes: 180,
        retweets: 70,
    },
    {
        id: '5',
        username: 'KOL5',
        userId: '@kol5',
        tags: ['kol'],
        content: 'Exciting updates coming soon...',
        timestamp: '2023-10-05T11:15:00Z',
        likes: 90,
        retweets: 30,
    },
    {
        id: '6',
        username: 'KOL6',
        userId: '@kol6',
        tags: ['kol', 'defi'],
        content: 'DeFi projects to watch in 2023...',
        timestamp: '2023-10-06T13:20:00Z',
        likes: 220,
        retweets: 95,
    },
    {
        id: '7',
        username: 'KOL7',
        userId: '@kol7',
        tags: ['kol', 'nft'],
        content: 'NFTs are revolutionizing the art world...',
        timestamp: '2023-10-07T10:10:00Z',
        likes: 300,
        retweets: 120,
    },
];

const tagColors: { [key: string]: { bg: string; text: string; border: string } } = {
    media: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-500',
        border: 'border border-blue-500/20'
    },
    news: {
        bg: 'bg-green-500/10',
        text: 'text-green-500',
        border: 'border border-green-500/20'
    },
    crypto: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-500',
        border: 'border border-purple-500/20'
    },
    research: {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-500',
        border: 'border border-yellow-500/20'
    },
    kol: {
        bg: 'bg-red-500/10',
        text: 'text-red-500',
        border: 'border border-red-500/20'
    },
    defi: {
        bg: 'bg-teal-500/10',
        text: 'text-teal-500',
        border: 'border border-teal-500/20'
    },
    nft: {
        bg: 'bg-pink-500/10',
        text: 'text-pink-500',
        border: 'border border-pink-500/20'
    },
};

export function TweetMonitor() {
    const [tweets, setTweets] = useState<Tweet[]>(mockTweets);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortKey, setSortKey] = useState<'likes' | 'retweets' | 'timestamp'>('timestamp');
    const [loading, setLoading] = useState(false);
    const [isNewTweet, setIsNewTweet] = useState(false);

    // 模拟获取新推文
    const pollTweets = useCallback(async () => {
        try {
            // 模拟新推文数据
            const newTweet: Tweet = {
                id: Date.now().toString(),
                username: `KOL${Math.floor(Math.random() * 10)}`,
                userId: `@kol${Math.floor(Math.random() * 10)}`,
                tags: ['crypto', 'kol'].sort(() => Math.random() - 0.5),
                content: `New tweet content ${Date.now()}...`,
                timestamp: new Date().toISOString(),
                likes: Math.floor(Math.random() * 200),
                retweets: Math.floor(Math.random() * 100),
            };

            setIsNewTweet(true);
            setTweets(prev => [newTweet, ...prev]);
            setTimeout(() => setIsNewTweet(false), 300);
        } catch (error) {
            console.error('Failed to poll tweets:', error);
        }
    }, []);

    // 设置轮询
    useEffect(() => {
        const intervalId = setInterval(pollTweets, 5000);
        return () => clearInterval(intervalId);
    }, [pollTweets]);

    const handleTagFilter = (tag: string) => {
        setSelectedTags((prevTags) =>
            prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
        );
    };

    const handleSortChange = (key: 'likes' | 'retweets' | 'timestamp') => {
        setSortKey(key);
    };

    const filteredTweets = tweets
        .filter((tweet) => selectedTags.every((tag) => tweet.tags.includes(tag)))
        .sort((a, b) => {
            if (sortKey === 'timestamp') {
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            }
            return b[sortKey] - a[sortKey];
        });

    return (
        <div className="min-h-screen bg-discord-primary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1"
                    >
                        <h1 className="text-xl sm:text-2xl font-bold text-white/90 mb-1 sm:mb-2">推文监控</h1>
                        <p className="text-sm sm:text-base text-white/60">
                            实时监控社区成员的推文动态
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex gap-2"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg
                                      ${sortKey === 'likes'
                                    ? 'bg-gradient-to-r from-[#53b991]/20 to-[#53b991]/30 border-[#53b991]/30'
                                    : 'bg-gradient-to-r from-[#53b991]/10 to-[#53b991]/20 border-[#53b991]/20'
                                }
                                      border hover:border-[#53b991]/30
                                      transition-all duration-300`}
                            onClick={() => handleSortChange('likes')}
                        >
                            <ThumbsUp className="h-4 w-4 text-[#53b991]" />
                            <span className="text-sm font-medium text-[#53b991]">按点赞数排序</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg
                                      ${sortKey === 'retweets'
                                    ? 'bg-gradient-to-r from-[#53b991]/20 to-[#53b991]/30 border-[#53b991]/30'
                                    : 'bg-gradient-to-r from-[#53b991]/10 to-[#53b991]/20 border-[#53b991]/20'
                                }
                                      border hover:border-[#53b991]/30
                                      transition-all duration-300`}
                            onClick={() => handleSortChange('retweets')}
                        >
                            <TrendingUp className="h-4 w-4 text-[#53b991]" />
                            <span className="text-sm font-medium text-[#53b991]">按转发数排序</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg
                                      ${sortKey === 'timestamp'
                                    ? 'bg-gradient-to-r from-[#53b991]/20 to-[#53b991]/30 border-[#53b991]/30'
                                    : 'bg-gradient-to-r from-[#53b991]/10 to-[#53b991]/20 border-[#53b991]/20'
                                }
                                      border hover:border-[#53b991]/30
                                      transition-all duration-300`}
                            onClick={() => handleSortChange('timestamp')}
                        >
                            <Clock className="h-4 w-4 text-[#53b991]" />
                            <span className="text-sm font-medium text-[#53b991]">按时间排序</span>
                        </motion.button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-2 mb-4"
                >
                    {['media', 'news', 'crypto', 'research', 'kol', 'defi', 'nft'].map((tag) => (
                        <motion.button
                            key={tag}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md
                                      ${selectedTags.includes(tag)
                                    ? `${tagColors[tag].bg} ${tagColors[tag].text} ${tagColors[tag].border}`
                                    : 'bg-discord-secondary/80 hover:bg-discord-secondary text-gray-300 hover:text-white'
                                }
                                      text-sm font-medium
                                      transition-all duration-200`}
                            onClick={() => handleTagFilter(tag)}
                        >
                            {selectedTags.includes(tag) && (
                                <div
                                    className={`w-1.5 h-1.5 rounded-full ${tagColors[tag].text.replace('text', 'bg')}`}
                                />
                            )}
                            <span>{tag}</span>
                        </motion.button>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <AnimatePresence initial={false} mode="sync">
                        {filteredTweets.map((tweet, index) => (
                            <motion.div
                                key={tweet.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-discord-secondary rounded-lg p-4 flex items-center justify-between
                                         transform hover:-translate-y-0.5 hover:shadow-lg
                                         transition-all duration-200"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{tweet.username}</span>
                                        <span className="text-sm text-muted-foreground">{tweet.userId}</span>
                                        <div className="flex gap-1">
                                            {tweet.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className={`text-xs ${tagColors[tag].bg} ${tagColors[tag].text} ${tagColors[tag].border} 
                                                               px-2 py-0.5 rounded-lg`}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground truncate mt-2">{tweet.content}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-xs text-muted-foreground">{new Date(tweet.timestamp).toLocaleString()}</div>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Heart className="h-4 w-4 text-[#53b991]" />
                                        <span>{tweet.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Repeat className="h-4 w-4 text-[#53b991]" />
                                        <span>{tweet.retweets}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ReplyDialog tweet={{ tweetUrl: `https://twitter.com/${tweet.userId}/status/${tweet.id}`, author: { name: tweet.username, handle: tweet.userId }, content: tweet.content }} />
                                        <button
                                            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md
                                                       bg-red-500/10 hover:bg-red-500/20 
                                                       text-red-500 transition-all duration-200"
                                            onClick={() => window.open(`https://twitter.com/intent/like?tweet_id=${tweet.id}`, '_blank')}
                                        >
                                            <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                            <span className="text-xs sm:text-sm">点赞</span>
                                        </button>
                                        <button
                                            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md
                                                       bg-[#53b991]/10 hover:bg-[#53b991]/20 
                                                       text-[#53b991] transition-all duration-200"
                                            onClick={() => window.open(`https://twitter.com/intent/retweet?tweet_id=${tweet.id}`, '_blank')}
                                        >
                                            <Repeat className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                            <span className="text-xs sm:text-sm">转推</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}