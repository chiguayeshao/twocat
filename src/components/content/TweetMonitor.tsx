import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Repeat, MessageSquare, ExternalLink } from 'lucide-react';
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
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">推文监控</h1>
                    <div className="flex gap-2">
                        <button
                            className={`px-3 py-1 rounded-md ${sortKey === 'likes' ? 'bg-[#53b991]' : 'bg-discord-secondary'} text-white`}
                            onClick={() => handleSortChange('likes')}
                        >
                            按点赞数排序
                        </button>
                        <button
                            className={`px-3 py-1 rounded-md ${sortKey === 'retweets' ? 'bg-[#53b991]' : 'bg-discord-secondary'} text-white`}
                            onClick={() => handleSortChange('retweets')}
                        >
                            按转发数排序
                        </button>
                        <button
                            className={`px-3 py-1 rounded-md ${sortKey === 'timestamp' ? 'bg-[#53b991]' : 'bg-discord-secondary'} text-white`}
                            onClick={() => handleSortChange('timestamp')}
                        >
                            按发文时间排序
                        </button>
                    </div>
                </div>

                <div className="flex gap-2 mb-4">
                    {['media', 'news', 'crypto', 'research', 'kol', 'defi', 'nft'].map((tag) => (
                        <button
                            key={tag}
                            className={`px-3 py-1 rounded-md ${selectedTags.includes(tag) ? 'bg-[#53b991]' : 'bg-discord-secondary'} text-white`}
                            onClick={() => handleTagFilter(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filteredTweets.map((tweet) => (
                        <motion.div
                            key={tweet.id}
                            className="bg-discord-secondary rounded-lg p-4 flex items-center justify-between"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
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
                </div>
            </div>
        </div>
    );
}