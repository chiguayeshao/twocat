'use client';

import { motion } from 'framer-motion';
import { Bot, MessageSquare, Sparkles, Brain, Plus, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface AIAgent {
    id: string;
    name: string;
    description: string;
    avatar: string;
    type: 'assistant' | 'analyzer' | 'trader' | 'researcher';
    status: 'active' | 'inactive';
    capabilities: string[];
    usageCount: number;
}

export function AIAgents() {
    const [agents, setAgents] = useState<AIAgent[]>([
        {
            id: '1',
            name: "行情分析师",
            description: "专注于分析市场趋势、技术指标和价格走势，为您提供专业的市场洞察。",
            avatar: "/images/agents/market-analyst.png",
            type: 'analyzer',
            status: 'active',
            capabilities: [
                "技术分析",
                "趋势预测",
                "市场情绪分析",
                "风险评估"
            ],
            usageCount: 1234
        },
        {
            id: '2',
            name: "社区管家",
            description: "负责回答社区常见问题，管理日常事务，确保社区运营顺畅。",
            avatar: "/images/agents/community-butler.png",
            type: 'assistant',
            status: 'active',
            capabilities: [
                "问题解答",
                "社区指南",
                "活动提醒",
                "成员引导"
            ],
            usageCount: 2156
        },
        {
            id: '3',
            name: "交易策略师",
            description: "基于市场数据和技术分析，为用户提供交易建议和策略优化方案。",
            avatar: "/images/agents/trade-strategist.png",
            type: 'trader',
            status: 'active',
            capabilities: [
                "策略制定",
                "风险控制",
                "收益分析",
                "投资建议"
            ],
            usageCount: 986
        },
        {
            id: '4',
            name: "研究专家",
            description: "深入研究区块链技术和加密货币市场，提供专业的研究报告。",
            avatar: "/images/agents/researcher.png",
            type: 'researcher',
            status: 'active',
            capabilities: [
                "项目分析",
                "行业研究",
                "数据统计",
                "趋势报告"
            ],
            usageCount: 756
        }
    ]);

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
                {/* 头部区域 */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white/90">
                            AI 代理中心
                        </h1>
                        <p className="text-sm sm:text-base text-white/60 mt-2">
                            智能助手随时为您服务，提供专业的建议和支持
                        </p>
                    </div>

                    <Button
                        className="bg-gradient-to-r from-[#53b991] to-[#9ad499] text-white"
                        size="sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        创建新代理
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
                            className="bg-white/5 rounded-lg border border-white/10 p-6
                                     hover:bg-white/[0.07] transition-all duration-300
                                     group relative overflow-hidden"
                        >
                            {/* 代理头部 */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#53b991]/20 
                                              flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-[#53b991]" />
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

                            {/* 底部状态栏 */}
                            <div className="mt-6 pt-4 border-t border-white/10
                                          flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>{agent.usageCount} 次对话</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-[#53b991] hover:text-[#53b991]/80"
                                >
                                    开始对话
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}