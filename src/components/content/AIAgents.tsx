'use client';

import { motion } from 'framer-motion';
import { Bot, Shield, Users, Sparkles, Brain, Plus, Settings } from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface AIAgent {
    id: string;
    name: string;
    role: 'leader' | 'member';
    personality: string;
    description: string;
    avatar: string;
    type: 'moderator' | 'analyst' | 'engagement' | 'content' | 'support';
    status: 'active' | 'inactive';
    capabilities: string[];
    performance: {
        tasksCompleted: number;
        memberInteractions: number;
        lastActive: string;
    };
}

export function AIAgents() {
    const [agents, setAgents] = useState<AIAgent[]>([
        {
            id: '1',
            name: "社区总管",
            role: 'leader',
            personality: "严谨专业，决策果断",
            description: "负责社区整体运营策略制定和执行监督，协调各AI成员工作。",
            avatar: "/images/agents/community-leader.png",
            type: 'moderator',
            status: 'active',
            capabilities: [
                "制定社区规则",
                "处理紧急事件",
                "绩效评估",
                "战略规划"
            ],
            performance: {
                tasksCompleted: 1234,
                memberInteractions: 5678,
                lastActive: "2024-03-20T10:00:00Z"
            }
        },
        {
            id: '2',
            name: "内容策划",
            role: 'member',
            personality: "创新活泼，善于表达",
            description: "负责社区内容规划、活动策划和社区氛围营造。",
            avatar: "/images/agents/content-planner.png",
            type: 'content',
            status: 'active',
            capabilities: [
                "活动策划",
                "内容创作",
                "社区活跃度提升",
                "用户反馈收集"
            ],
            performance: {
                tasksCompleted: 856,
                memberInteractions: 3421,
                lastActive: "2024-03-20T09:30:00Z"
            }
        },
        {
            id: '3',
            name: "数据分析师",
            role: 'member',
            personality: "理性冷静，数据驱动",
            description: "负责社区数据分析，为决策提供数据支持。",
            avatar: "/images/agents/data-analyst.png",
            type: 'analyst',
            status: 'active',
            capabilities: [
                "数据分析",
                "趋势预测",
                "用户行为分析",
                "报告生成"
            ],
            performance: {
                tasksCompleted: 645,
                memberInteractions: 1234,
                lastActive: "2024-03-20T08:45:00Z"
            }
        },
        {
            id: '4',
            name: "社区维护者",
            role: 'member',
            personality: "耐心细致，以用户为中心",
            description: "负责日常社区秩序维护和用户支持。",
            avatar: "/images/agents/community-support.png",
            type: 'support',
            status: 'active',
            capabilities: [
                "规则执行",
                "纠纷处理",
                "用户帮助",
                "反馈处理"
            ],
            performance: {
                tasksCompleted: 923,
                memberInteractions: 4567,
                lastActive: "2024-03-20T09:15:00Z"
            }
        }
    ]);

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
                {/* 头部区域 */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white/90">
                            AI 管理团队
                        </h1>
                        <p className="text-sm sm:text-base text-white/60 mt-2">
                            由AI驱动的社区管理团队，24/7为社区提供专业服务
                        </p>
                    </div>

                    <Button
                        className="bg-gradient-to-r from-[#53b991] to-[#9ad499] text-white"
                        size="sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        添加AI成员
                    </Button>
                </div>

                {/* AI代理网格 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map((agent, index) => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`
                                bg-white/5 rounded-lg border p-6
                                transition-all duration-300 group relative overflow-hidden
                                ${agent.role === 'leader'
                                    ? 'border-[#53b991]/30 hover:border-[#53b991]/60'
                                    : 'border-white/10 hover:bg-white/[0.07]'}
                            `}
                        >
                            {/* 角色标识 */}
                            {agent.role === 'leader' && (
                                <div className="absolute top-3 right-3 px-2 py-1 rounded-full 
                                              bg-[#53b991]/20 text-[#53b991] text-xs font-medium">
                                    Leader
                                </div>
                            )}

                            {/* 代理头部 */}
                            <div className="flex items-start gap-4">
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center
                                    ${agent.role === 'leader'
                                        ? 'bg-[#53b991]/20'
                                        : 'bg-white/10'}
                                `}>
                                    <Bot className={`
                                        w-6 h-6 
                                        ${agent.role === 'leader'
                                            ? 'text-[#53b991]'
                                            : 'text-white/70'}
                                    `} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white/90 mb-1">
                                        {agent.name}
                                    </h3>
                                    <p className="text-sm text-white/60 line-clamp-2">
                                        {agent.description}
                                    </p>
                                </div>
                            </div>

                            {/* 性格特征 */}
                            <div className="mt-4 px-3 py-2 rounded-md bg-white/5">
                                <p className="text-sm text-white/70">
                                    <span className="text-white/40 mr-2">性格特征:</span>
                                    {agent.personality}
                                </p>
                            </div>

                            {/* 能力标签 */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {agent.capabilities.map((capability, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 rounded-full text-xs
                                                 bg-white/5 text-white/70"
                                    >
                                        {capability}
                                    </span>
                                ))}
                            </div>

                            {/* 性能指标 */}
                            <div className="mt-6 pt-4 border-t border-white/10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-sm text-white/40">完成任务</div>
                                        <div className="text-lg font-semibold text-white/90">
                                            {agent.performance.tasksCompleted}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm text-white/40">成员互动</div>
                                        <div className="text-lg font-semibold text-white/90">
                                            {agent.performance.memberInteractions}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 设置按钮 */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Settings className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}