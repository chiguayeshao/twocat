'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coins, Plus, Minus, Heart, Trophy, Users, Rocket } from 'lucide-react';

interface DonationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currentDonation: number;
    onDonate: (amount: number) => void;
}

const PRESET_AMOUNTS = [0.5, 1, 2, 5, 20];

export function DonationDialog({
    isOpen,
    onClose,
    currentDonation,
    onDonate
}: DonationDialogProps) {
    const [amount, setAmount] = useState(0.1);

    const incrementAmount = () => {
        setAmount(prev => Number((prev + 0.1).toFixed(1)));
    };

    const decrementAmount = () => {
        if (amount > 0.1) {
            setAmount(prev => Number((prev - 0.1).toFixed(1)));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-black/90 border border-white/10 text-white max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white/90 flex items-center gap-2">
                        <Heart className="w-6 h-6 text-pink-400" />
                        社区捐赠
                    </DialogTitle>
                    <DialogDescription className="text-white/70">
                        您的捐赠将用于社区建设和发展，帮助社区变得更好
                    </DialogDescription>
                </DialogHeader>

                {/* 捐赠金额选择 */}
                <div className="bg-white/5 p-4 rounded-lg mb-4">
                    <div className="text-sm text-white/70 mb-2">选择捐赠数量（SOL）</div>
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="border-white/20 text-white/70"
                            onClick={decrementAmount}
                        >
                            <Minus className="w-4 h-4" />
                        </Button>
                        <div className="text-2xl font-bold text-[#53b991]">{amount}</div>
                        <Button
                            variant="outline"
                            size="icon"
                            className="border-white/20 text-white/70"
                            onClick={incrementAmount}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* 快速选择金额 */}
                    <div className="flex flex-wrap gap-2">
                        {PRESET_AMOUNTS.map((preset) => (
                            <Button
                                key={preset}
                                variant="outline"
                                className={`border-white/20 px-4 py-2 ${amount === preset
                                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                                        : 'text-white/70 hover:bg-white/10'
                                    }`}
                                onClick={() => setAmount(preset)}
                            >
                                {preset} SOL
                            </Button>
                        ))}
                    </div>
                </div>

                {/* 捐赠说明 */}
                <div className="space-y-4">
                    <div className="text-lg font-semibold text-white/90 mb-2">捐赠可以帮助社区：</div>
                    <div className="grid gap-3">
                        {[
                            {
                                icon: <Trophy className="w-5 h-5 text-yellow-400" />,
                                title: "提升社区等级",
                                description: "通过捐赠快速提升社区等级，解锁更多权益"
                            },
                            {
                                icon: <Users className="w-5 h-5 text-blue-400" />,
                                title: "增强社区活力",
                                description: "支持社区活动和奖励，提升社区参与度"
                            },
                            {
                                icon: <Rocket className="w-5 h-5 text-purple-400" />,
                                title: "加速社区发展",
                                description: "促进社区建设和营销，扩大社区影响力"
                            }
                        ].map((item, index) => (
                            <div key={index} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg">
                                {item.icon}
                                <div>
                                    <div className="font-medium text-white/90">{item.title}</div>
                                    <div className="text-sm text-white/70">{item.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 捐赠按钮 */}
                <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    onClick={() => onDonate(amount)}
                >
                    <Coins className="w-4 h-4 mr-2" />
                    确认捐赠 {amount} SOL
                </Button>
            </DialogContent>
        </Dialog>
    );
}