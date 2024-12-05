'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface CommunityDetailedInfoProps {
    data: {
        website?: string;
        twitter?: string;
        telegram?: string;
        discord?: string;
        contractAddress: string;
        ctos: {
            tweetName: string;
            tweetHandle: string;
            twitter: string;
        }[];
    };
    onChange: (field: string, value: any) => void;
}

export function CommunityDetailedInfo({ data, onChange }: CommunityDetailedInfoProps) {
    const addCTO = () => {
        if (data.ctos.length >= 5) return;
        onChange('ctos', [...data.ctos, { tweetName: '', tweetHandle: '', twitter: '' }]);
    };

    const removeCTO = (index: number) => {
        onChange('ctos', data.ctos.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            {/* 社交链接 - 两列布局 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 网站 */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">网站</label>
                    <Input
                        value={data.website}
                        onChange={(e) => onChange('website', e.target.value)}
                        placeholder="输入网站 URL"
                        className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                    />
                </div>

                {/* Twitter */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Twitter</label>
                    <Input
                        value={data.twitter}
                        onChange={(e) => onChange('twitter', e.target.value)}
                        placeholder="输入 Twitter URL"
                        className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                    />
                </div>

                {/* Telegram */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Telegram</label>
                    <Input
                        value={data.telegram}
                        onChange={(e) => onChange('telegram', e.target.value)}
                        placeholder="输入 Telegram URL"
                        className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                    />
                </div>

                {/* Discord */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Discord</label>
                    <Input
                        value={data.discord}
                        onChange={(e) => onChange('discord', e.target.value)}
                        placeholder="输入 Discord URL"
                        className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                    />
                </div>
            </div>

            {/* 合约地址 - 单独一行 */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                    合约地址
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                    value={data.contractAddress}
                    onChange={(e) => onChange('contractAddress', e.target.value)}
                    placeholder="输入合约地址"
                    className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                    required
                />
            </div>

            {/* CTO 信息 */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="space-x-2">
                        <label className="text-sm font-medium text-gray-300">CTO 信息</label>
                        <span className="text-xs text-gray-400">(最多添加 5 个)</span>
                    </div>
                    <Button
                        type="button"
                        onClick={addCTO}
                        disabled={data.ctos.length >= 5}
                        className="bg-gradient-to-r from-[#53b991] to-[#9ad499] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        添加 CTO
                    </Button>
                </div>

                {/* CTO 列表区域 */}
                <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
                    {data.ctos.map((cto, index) => (
                        <div key={index} className="relative bg-[#2f2f2f]/50 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">
                                            推特用户名
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Input
                                            value={cto.tweetHandle}
                                            onChange={(e) => {
                                                const newCTOs = [...data.ctos];
                                                newCTOs[index].tweetHandle = e.target.value;
                                                onChange('ctos', newCTOs);
                                            }}
                                            placeholder="输入推特用户名"
                                            className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">
                                            推特 URL
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <Input
                                            value={cto.twitter}
                                            onChange={(e) => {
                                                const newCTOs = [...data.ctos];
                                                newCTOs[index].twitter = e.target.value;
                                                onChange('ctos', newCTOs);
                                            }}
                                            placeholder="输入推特 URL"
                                            className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                                            required
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => removeCTO(index)}
                                    className="bg-gradient-to-r from-[#53b991] to-[#9ad499] hover:opacity-90 transition-opacity h-10 px-3 self-end"
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}