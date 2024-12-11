'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Flame as Fire, Users, Coins, Search, Sparkles, BotIcon, Heart } from 'lucide-react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { CreateCommunityDialog } from '@/components/CreateCommunityDialog';
import { CommunityData } from '@/components/CreateCommunityDialog';
import { ContentType } from '@/types/content';
import { useWallet } from '@solana/wallet-adapter-react';
import { Footer } from '@/components/layout/Footer';

interface RoomData {
  room: {
    _id: string;
    roomName: string;
    description: string;
    avatarUrl: string;
    memberCount: number;
    creatorWallet: string;
    website: string;
    twitter: string;
    telegram: string;
    discord: string;
    ca: string;
    communityStory: {
      title: string;
      slogan: string;
      description: string;
    };
  };
  treasury: {
    treasuryBalance: number;
    dailyVolume: number;
    weeklyProfit: number;
    communityLevel: number;
  };
  communityLevel: {
    currentVolume: number;
    unlockNextLevelVolume: number;
    currentDonationVolume: number;
    unlockNextLevelDonationVolume: number;
  };
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toFixed(1);
};

export default function Home() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending');
  const [navigating, setNavigating] = useState(false);
  const [joinedRooms, setJoinedRooms] = useState<RoomData[]>([]);
  const { connected, publicKey } = useWallet();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // 可以在这里添加其他 tab 切换相关的逻辑
  };

  const handleCommunityClick = async (communityId: string) => {
    setNavigating(true);
    try {
      localStorage.setItem('activeContent', ContentType.COMMUNITY_HOME);
      window.location.href = `/${communityId}`;
    } catch (error) {
      console.error('Navigation error:', error);
      setNavigating(false);
    }
  };

  const handleCreateCommunity = async (data: CommunityData) => {
    console.log('创建社区:', data);
  };

  // 获取房间列表
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/rooms/list');
        const result = await response.json();

        if (result.success) {
          setRooms(result.data);
        } else {
          console.error('获取房间列表失败:', result.error);
        }
      } catch (error) {
        console.error('获取房间列表错误:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // 获取已加入的社区
  useEffect(() => {
    const fetchJoinedRooms = async () => {
      if (!connected || !publicKey) return;

      try {
        const response = await fetch(
          `/api/twocat-core/rooms/joined?walletAddress=${publicKey.toString()}`
        );
        const result = await response.json();

        if (result.success) {
          setJoinedRooms(result.data);
        } else {
          console.error('获取已加入社区失败:', result.error);
        }
      } catch (error) {
        console.error('获取已加入社区错误:', error);
      }
    };

    if (connected && publicKey) {
      fetchJoinedRooms();
    }
  }, [connected, publicKey]);

  return (
    <div className=" h-full relative flex flex-col">
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
      <div className="relative z-10 flex-1">
        {/* 修改导航栏样式 */}
        <nav className="border-b border-[#ffffff10] bg-transparent backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10">
                  <Image
                    src="/images/mcgalogo.png"
                    alt="MCGA Logo"
                    width={40}
                    height={40}
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#53b991] to-[#9ad499] text-transparent bg-clip-text">
                  MCGA
                </span>
              </div>
              <CreateCommunityDialog onSubmit={handleCreateCommunity} />
            </div>
          </div>
        </nav>

        {/* Hero区域 */}
        <div className="relative overflow-hidden py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <motion.h1
                className="text-4xl sm:text-5xl font-bold mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="bg-gradient-to-r from-[#53b991] to-[#9ad499] text-transparent bg-clip-text">
                  Make Community Great Again！
                </span>
              </motion.h1>
              <motion.p
                className="text-gray-400 text-lg sm:text-3xl mx-auto mb-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                交易即建设，AI 即赋能，MCGA 予力每一个社区，成就无限可能！
              </motion.p>
            </div>
          </div>

          {/* 简化的搜索区域 */}
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
                  value="ai"
                  className="data-[state=active]:bg-[#53b991] data-[state=active]:text-white
                             transition-all duration-300"
                >
                  <BotIcon className="w-4 h-4 mr-2" />
                  AI 社区
                </TabsTrigger>
                <TabsTrigger
                  value="joined"
                  className="data-[state=active]:bg-[#53b991] data-[state=active]:text-white
                             transition-all duration-300"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  已加入
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
                  <AnimatePresence>
                    {rooms.map((roomData, index) => (
                      <motion.div
                        key={roomData.room._id}
                        onClick={() => handleCommunityClick(roomData.room._id)}
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
                        className={`bg-[#2f2f2f]/50 backdrop-blur-sm rounded-2xl p-6 
                                 border border-[#53b991]/10
                                 cursor-pointer gpu-accelerated
                                 hover:bg-[#2f2f2f]/70 
                                 transition-all duration-300
                                 hover-glow
                                 ${navigating ? 'pointer-events-none opacity-50' : ''}`}
                      >
                        <div className="flex items-center gap-6">
                          <div className="relative group shrink-0">
                            {roomData.room.avatarUrl ? (
                              <Image
                                src={roomData.room.avatarUrl}
                                alt={roomData.room.roomName || 'Community Avatar'}
                                width={80}
                                height={80}
                                className="rounded-2xl ring-2 ring-[#53b991]/20 group-hover:ring-[#53b991]/40 
                                             transition-all duration-300"
                              />
                            ) : (
                              <div className="w-[80px] h-[80px] rounded-2xl bg-[#2f2f2f] 
                                          ring-2 ring-[#53b991]/20 group-hover:ring-[#53b991]/40 
                                          transition-all duration-300 flex items-center justify-center">
                                <Users className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-[#53b991]">
                                {roomData.room.roomName}
                              </h3>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#53b991]/10 text-[#53b991]">
                                Lv.{roomData.treasury.communityLevel}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                              {roomData.room.description || "暂无描述"}
                            </p>

                            <div className="flex items-center gap-8 text-sm">
                              <div className="flex items-center gap-2 text-gray-300">
                                <Users className="w-4 h-4" />
                                <span>{roomData.room.memberCount.toLocaleString()} 成员</span>
                              </div>

                              {/* <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 text-[#9ad499]">
                                  <Fire className="w-4 h-4" />
                                  <span>{formatNumber(roomData.communityLevel.currentVolume)}</span>
                                </div>
                                <span className="text-xs text-gray-400">SOL 交易量</span>
                              </div> */}

                              {/* <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 text-[#acc97e]">
                                  <Coins className="w-4 h-4" />
                                  <span>
                                    {formatNumber(
                                      roomData.treasury.treasuryBalance +
                                      roomData.communityLevel.currentDonationVolume
                                    )}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-400">SOL 金库</span>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="ai">
              {/* AI社区内容，使用相同的展示格式 */}
              <motion.div
                className="space-y-4 mt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {/* AI社区列表，格式与热门社区相同 */}
              </motion.div>
            </TabsContent>

            <TabsContent value="joined">
              <motion.div
                className="space-y-4 mt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {!connected ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">请先连接钱包查看已加入的社区</p>
                  </div>
                ) : joinedRooms.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">还没有加入任何社区</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {joinedRooms.map((roomData, index) => (
                      <motion.div
                        key={roomData.room._id}
                        onClick={() => handleCommunityClick(roomData.room._id)}
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
                        className={`bg-[#2f2f2f]/50 backdrop-blur-sm rounded-2xl p-6 
                                 border border-[#53b991]/10
                                 cursor-pointer gpu-accelerated
                                 hover:bg-[#2f2f2f]/70 
                                 transition-all duration-300
                                 hover-glow
                                 ${navigating ? 'pointer-events-none opacity-50' : ''}`}
                      >
                        <div className="flex items-center gap-6">
                          <div className="relative group shrink-0">
                            {roomData.room.avatarUrl ? (
                              <Image
                                src={roomData.room.avatarUrl}
                                alt={roomData.room.roomName || 'Community Avatar'}
                                width={80}
                                height={80}
                                className="rounded-2xl ring-2 ring-[#53b991]/20 group-hover:ring-[#53b991]/40 
                                             transition-all duration-300"
                              />
                            ) : (
                              <div className="w-[80px] h-[80px] rounded-2xl bg-[#2f2f2f] 
                                          ring-2 ring-[#53b991]/20 group-hover:ring-[#53b991]/40 
                                          transition-all duration-300 flex items-center justify-center">
                                <Users className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-[#53b991]">
                                {roomData.room.roomName}
                              </h3>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#53b991]/10 text-[#53b991]">
                                Lv.{roomData.treasury.communityLevel}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                              {roomData.room.description || "暂无描述"}
                            </p>

                            <div className="flex items-center gap-8 text-sm">
                              <div className="flex items-center gap-2 text-gray-300">
                                <Users className="w-4 h-4" />
                                <span>{roomData.room.memberCount.toLocaleString()} 成员</span>
                              </div>

                              {/* <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 text-[#9ad499]">
                                  <Fire className="w-4 h-4" />
                                  <span>{formatNumber(roomData.communityLevel.currentVolume)}</span>
                                </div>
                                <span className="text-xs text-gray-400">SOL 交易量</span>
                              </div> */}

                              {/* <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 text-[#acc97e]">
                                  <Coins className="w-4 h-4" />
                                  <span>
                                    {formatNumber(
                                      roomData.treasury.treasuryBalance +
                                      roomData.communityLevel.currentDonationVolume
                                    )}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-400">SOL 金库</span>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
