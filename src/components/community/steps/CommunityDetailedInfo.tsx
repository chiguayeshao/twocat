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
        onChange('ctos', [...data.ctos, { tweetName: '', tweetHandle: '', twitter: '' }]);
    };

    const removeCTO = (index: number) => {
        onChange('ctos', data.ctos.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">网站</label>
                <Input
                    value={data.website}
                    onChange={(e) => onChange('website', e.target.value)}
                    placeholder="输入网站 URL"
                    className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Twitter</label>
                <Input
                    value={data.twitter}
                    onChange={(e) => onChange('twitter', e.target.value)}
                    placeholder="输入 Twitter URL"
                    className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Telegram</label>
                <Input
                    value={data.telegram}
                    onChange={(e) => onChange('telegram', e.target.value)}
                    placeholder="输入 Telegram URL"
                    className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Discord</label>
                <Input
                    value={data.discord}
                    onChange={(e) => onChange('discord', e.target.value)}
                    placeholder="输入 Discord URL"
                    className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">合约地址</label>
                <Input
                    value={data.contractAddress}
                    onChange={(e) => onChange('contractAddress', e.target.value)}
                    placeholder="输入合约地址"
                    className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                    required
                />
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium text-gray-300">CTO 信息</label>
                {data.ctos.map((cto, index) => (
                    <div key={index} className="space-y-2">
                        <Input
                            value={cto.tweetName}
                            onChange={(e) => {
                                const newCTOs = [...data.ctos];
                                newCTOs[index].tweetName = e.target.value;
                                onChange('ctos', newCTOs);
                            }}
                            placeholder="CTO 名称"
                            className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                        />
                        <Input
                            value={cto.tweetHandle}
                            onChange={(e) => {
                                const newCTOs = [...data.ctos];
                                newCTOs[index].tweetHandle = e.target.value;
                                onChange('ctos', newCTOs);
                            }}
                            placeholder="CTO 推特用户名"
                            className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                        />
                        <Input
                            value={cto.twitter}
                            onChange={(e) => {
                                const newCTOs = [...data.ctos];
                                newCTOs[index].twitter = e.target.value;
                                onChange('ctos', newCTOs);
                            }}
                            placeholder="CTO 推特 URL"
                            className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCTO(index)}
                            className="text-gray-400 hover:text-white"
                        >
                            <Minus className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCTO}
                    className="w-full border-[#53b991]/30 hover:bg-[#53b991]/10"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    添加 CTO
                </Button>
            </div>
        </div>
    );
}