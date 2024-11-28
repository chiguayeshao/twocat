'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Flame as Fire, Users, Coins, Search, Sparkles } from 'lucide-react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

interface Community {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  memberCount: number;
  heat: number;
  assetsValue: number;
  verificationLevel: 'gold' | 'green' | null;
}


export default function Home() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // 可以在这里添加其他 tab 切换相关的逻辑
  };

  // 模拟数据加载
  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCommunities([
        {
          id: '1',
          name: '🐸 Pepe的狂欢派对',
          description: '最疯狂的meme社区，我们都是pepe的信徒！',
          avatarUrl: 'https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1732023482786-twocatlogo.jpg',
          memberCount: 42069,
          heat: 98,
          assetsValue: 420.69,
          verificationLevel: 'gold',
        },
        {
          id: '2',
          name: '🦍 Ape帮',
          description: '无聊猿俱乐部，专注NFT交易和社区建设',
          avatarUrl: 'https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1732023482786-twocatlogo.jpg',
          memberCount: 15789,
          heat: 92,
          assetsValue: 890.42,
          verificationLevel: 'green',
        },
        {
          id: '3',
          name: '🚀 火箭人',
          description: '专注Sol生态早期项目，一起发现下一个100倍币',
          avatarUrl: 'https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1732023482786-twocatlogo.jpg',
          memberCount: 8426,
          heat: 85,
          assetsValue: 235.16,
          verificationLevel: null,
        },
        {
          id: '4',
          name: '🎮 GameFi玩家联盟',
          description: '链游爱好者集中地，分享游戏攻略和收益机会',
          avatarUrl: 'https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1732023482786-twocatlogo.jpg',
          memberCount: 12567,
          heat: 88,
          assetsValue: 156.78,
          verificationLevel: 'gold',
        },
        {
          id: '5',
          name: '🎨 艺术家俱乐部',
          description: 'NFT艺术创作者社区，探讨艺术与区块链的结合',
          avatarUrl: 'https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1732023482786-twocatlogo.jpg',
          memberCount: 6234,
          heat: 82,
          assetsValue: 345.92,
          verificationLevel: 'green',
        },
        {
          id: '6',
          name: '🔥 DeFi研究院',
          description: '深度研究DeFi项目，发现价值投资机会',
          avatarUrl: 'https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1732023482786-twocatlogo.jpg',
          memberCount: 9876,
          heat: 94,
          assetsValue: 678.34,
          verificationLevel: null,
        }
      ]);
      setLoading(false);
    };

    fetchCommunities();
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* 修改背景实现 */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* 第一层：主渐变背景 */}
        <div
          className="absolute inset-0 animate-gradient"
          style={{
            background: 'linear-gradient(45deg, #ff6b2c, #53b991, #ff6b2c, #53b991)',
            backgroundSize: '200% 200%',
            filter: 'blur(80px)',
            opacity: 0.5,
          }}
        />
        {/* 第二层：辅助渐变，增加层次感 */}
        <div
          className="absolute inset-0 animate-gradient-slow"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(83, 185, 145, 0.2), rgba(255, 107, 44, 0.1))',
            backgroundSize: '150% 150%',
            filter: 'blur(60px)',
            opacity: 0.3,
          }}
        />
        {/* 第三层：叠加层，提供深色基调 */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(26, 27, 30, 0.8), rgba(26, 27, 30, 0.7))',
            backdropFilter: 'blur(100px)',
          }}
        />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10">
        {/* 修改导航栏样式 */}
        <nav className="border-b border-[#ffffff10] bg-transparent backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <Image
                  src="https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1732023482786-twocatlogo.jpg"
                  alt="MCGA Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-[#53b991] to-[#9ad499] text-transparent bg-clip-text">
                  MCGA
                </span>
              </div>
              <Button className="bg-gradient-to-r from-[#53b991] to-[#9ad499] hover:opacity-90 transition-opacity">
                <Sparkles className="w-4 h-4 mr-2" />
                开启AI之旅
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero区域 */}
        <div className="relative overflow-hidden py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <motion.h1
                className="text-4xl sm:text-6xl font-bold mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="bg-gradient-to-r from-[#53b991] to-[#9ad499] text-transparent bg-clip-text">
                  AI赋能的社区
                </span>
              </motion.h1>
              <motion.p
                className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                加入我们，一起让社区再次伟大！通过AI的力量，发现更多机会 🚀
              </motion.p>
            </div>
          </div>

          {/* 简化的搜索区域 */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <motion.div
              className="flex items-center gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative flex-1">
                <Input
                  placeholder="探索Meme社区..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#2f2f2f]/30 
                             border-[#53b991]/40
                             focus:border-[#53b991]/40
                             focus:ring-0
                             rounded-full h-12 pl-12 pr-6 text-lg 
                             placeholder:text-gray-500 
                             text-[#53b991]
                             transition-all duration-300"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* 分类标签和社区列表 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <Tabs defaultValue="trending" className="mb-8" onValueChange={handleTabChange}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <TabsList className="bg-[#2f2f2f]/30 p-1 rounded-xl">
                <TabsTrigger
                  value="trending"
                  className="data-[state=active]:bg-[#53b991] data-[state=active]:text-white
                             transition-all duration-300"
                >
                  <Fire className="w-4 h-4 mr-2" />
                  热门社区
                </TabsTrigger>
                <TabsTrigger
                  value="newest"
                  className="data-[state=active]:bg-[#53b991] data-[state=active]:text-white
                             transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  最新社区
                </TabsTrigger>
                <TabsTrigger
                  value="richest"
                  className="data-[state=active]:bg-[#53b991] data-[state=active]:text-white
                             transition-all duration-300"
                >
                  <Coins className="w-4 h-4 mr-2" />
                  富豪榜
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <TabsContent value="trending">
              <motion.div
                className="space-y-4 mt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {loading ? (
                  // 骨架屏内容
                  <AnimatePresence>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.div
                        key={`skeleton-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.1 }}
                      >
                        <div className="bg-[#2f2f2f] rounded-lg p-4">
                          <div className="flex gap-4">
                            <Skeleton className="w-[60px] h-[60px] rounded-full" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-6 w-3/4" />
                              <Skeleton className="h-4 w-full" />
                              <div className="grid grid-cols-3 gap-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-20" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  // 社区列表内容
                  <AnimatePresence>
                    {communities.map((community, index) => (
                      <motion.div
                        key={community.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 100,
                          damping: 15
                        }}
                        whileHover={{
                          y: -5,
                          transition: { duration: 0.2, ease: "easeOut" }
                        }}
                        className="bg-[#2f2f2f]/50 backdrop-blur-sm rounded-2xl p-6 
                                   border border-[#53b991]/10
                                   cursor-pointer gpu-accelerated
                                   hover:bg-[#2f2f2f]/70 
                                   transition-all duration-300
                                   hover-glow"
                      >
                        <div className="flex items-center gap-6">
                          <div className="relative group shrink-0">
                            <Image
                              src={community.avatarUrl}
                              alt={community.name}
                              width={80}
                              height={80}
                              className="rounded-2xl ring-2 ring-[#53b991]/20 group-hover:ring-[#53b991]/40 
                                       transition-all duration-300"
                            />
                            {community.verificationLevel && (
                              <div
                                className={`absolute -top-1 -right-1 rounded-full p-1
                                  ${community.verificationLevel === 'gold'
                                    ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500]'
                                    : 'bg-gradient-to-r from-[#53b991] to-[#9ad499]'
                                  }`}
                              >
                                <Sparkles className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-[#53b991]">
                                {community.name}
                              </h3>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#53b991]/10 text-[#53b991]">
                                AI助手
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                              {community.description}
                            </p>

                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-2 text-gray-300">
                                <Users className="w-4 h-4" />
                                <span>{community.memberCount.toLocaleString()}</span>
                              </div>

                              <div className="flex items-center gap-2 text-[#9ad499]">
                                <Fire className="w-4 h-4" />
                                <span>{community.heat}%</span>
                              </div>

                              <div className="flex items-center gap-2 text-[#acc97e]">
                                <Coins className="w-4 h-4" />
                                <span>{community.assetsValue} SOL</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="newest">
              {/* ... 类似的结构 ... */}
            </TabsContent>

            <TabsContent value="richest">
              {/* ... 类似的结构 ... */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
