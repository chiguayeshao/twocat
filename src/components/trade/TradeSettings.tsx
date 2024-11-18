import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Zap } from 'lucide-react';

interface TradeSettingsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    slippage: number;
    isEditingSlippage: boolean;
    setIsEditingSlippage: (value: boolean) => void;
    handleSlippageChange: (value: string) => void;
    priorityFee: string;
    isCustomPriorityFee: boolean;
    setIsCustomPriorityFee: (value: boolean) => void;
    handlePriorityFeeChange: (value: string) => void;
    isAntiMEV: boolean;
    setIsAntiMEV: (value: boolean) => void;
}

export function TradeSettings({
    open,
    onOpenChange,
    slippage,
    isEditingSlippage,
    setIsEditingSlippage,
    handleSlippageChange,
    priorityFee,
    isCustomPriorityFee,
    setIsCustomPriorityFee,
    handlePriorityFeeChange,
    isAntiMEV,
    setIsAntiMEV,
}: TradeSettingsProps) {
    // 保存打开弹框时的初始值
    const [initialValues, setInitialValues] = useState({
        slippage,
        isEditingSlippage,
        priorityFee,
        isCustomPriorityFee,
        isAntiMEV,
    });

    // 当弹框打开时，保存当前的设置值
    useEffect(() => {
        if (open) {
            setInitialValues({
                slippage,
                isEditingSlippage,
                priorityFee,
                isCustomPriorityFee,
                isAntiMEV,
            });
        }
    }, [open]);

    // 处理取消
    const handleCancel = () => {
        // 恢复到初始值
        setIsEditingSlippage(initialValues.isEditingSlippage);
        handleSlippageChange((initialValues.slippage / 10).toString());
        setIsCustomPriorityFee(initialValues.isCustomPriorityFee);
        handlePriorityFeeChange(initialValues.priorityFee);
        setIsAntiMEV(initialValues.isAntiMEV);

        // 关闭弹框
        onOpenChange(false);
    };

    // 处理确认
    const handleConfirm = () => {
        // 直接关闭弹框，因为所有改动都是实时的
        onOpenChange(false);
    };

    // 处理弹框关闭事件
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            handleCancel(); // 点击外部关闭时，调用取消处理函数
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-[#1E1F22] border-none text-gray-100 max-w-md p-0">
                {/* 标题栏 */}
                <div className="flex items-center gap-2 p-4 pb-2">
                    <Zap size={20} className="text-yellow-500" />
                    <DialogTitle className="text-lg font-medium text-gray-100">
                        快速热门设置
                    </DialogTitle>
                </div>

                <div className="p-4 space-y-8">
                    {/* 防夹设置 */}
                    <div className="flex items-center justify-between">
                        <span className="text-base text-gray-300">
                            防夹模式(Anti-MEV)
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isAntiMEV}
                                onChange={(e) => setIsAntiMEV(e.target.checked)}
                            />
                            <div className={cn(
                                'w-12 h-7 rounded-full peer transition-colors duration-200',
                                'after:content-[""] after:absolute after:top-[2px] after:left-[2px]',
                                'after:bg-white after:rounded-full after:h-6 after:w-6',
                                'after:transition-all after:duration-200',
                                isAntiMEV
                                    ? 'bg-green-500 after:translate-x-full'
                                    : 'bg-gray-600'
                            )}></div>
                        </label>
                    </div>

                    {/* 优先费设置 */}
                    <div className="space-y-2">
                        <div className="text-base text-gray-300">优先费</div>
                        <button
                            className={cn(
                                'w-[120px] p-4 rounded-lg border border-gray-700 transition-colors',
                                'flex flex-col items-center justify-center',
                                !isCustomPriorityFee
                                    ? 'bg-gray-800 border-blue-500'
                                    : 'hover:border-gray-600'
                            )}
                            onClick={() => {
                                setIsCustomPriorityFee(false);
                                handlePriorityFeeChange('0.018');
                            }}
                        >
                            <div className="font-medium">×15</div>
                            <div className="text-sm text-gray-400">0.018 SOL</div>
                            <div className="text-xs text-gray-500">≈ 2s</div>
                        </button>
                        <div className="text-sm text-gray-400 mt-2">
                            支持自定义优先费 (最大: 0.2 SOL)
                        </div>
                        <input
                            type="text"
                            className={cn(
                                'w-full bg-gray-900 rounded-lg px-4 py-3',
                                'text-white placeholder-gray-500 border border-gray-700',
                                'focus:outline-none focus:border-blue-500',
                            )}
                            placeholder="自定义优先费"
                            value={isCustomPriorityFee ? priorityFee : ''}
                            onChange={(e) => {
                                setIsCustomPriorityFee(true);
                                handlePriorityFeeChange(e.target.value);
                            }}
                        />
                    </div>

                    {/* 滑点设置 */}
                    <div className="space-y-2">
                        <div className="text-base text-gray-300">滑点限制</div>
                        <div className="flex gap-3">
                            <button
                                className={cn(
                                    'px-6 py-3 rounded-lg transition-colors',
                                    'border border-gray-700',
                                    !isEditingSlippage
                                        ? 'bg-gray-800 border-blue-500'
                                        : 'hover:border-gray-600'
                                )}
                                onClick={() => setIsEditingSlippage(false)}
                            >
                                自动 {(slippage / 10).toFixed(1)}%
                            </button>
                            <input
                                type="text"
                                className={cn(
                                    'flex-1 bg-gray-900 rounded-lg px-4',
                                    'text-white placeholder-gray-500',
                                    'border border-gray-700',
                                    'focus:outline-none focus:border-blue-500'
                                )}
                                placeholder="自定义滑点"
                                value={isEditingSlippage ? (slippage / 10).toFixed(1) : ''}
                                onChange={(e) => handleSlippageChange(e.target.value)}
                                onFocus={() => setIsEditingSlippage(true)}
                            />
                            <div className="flex items-center px-4 text-gray-400">%</div>
                        </div>
                    </div>
                </div>

                {/* 底部按钮 */}
                <div className="grid grid-cols-2 gap-3 p-4 mt-auto">
                    <Button
                        variant="secondary"
                        onClick={handleCancel}
                        className="w-full py-6 bg-[#313338] hover:bg-[#404249] text-white text-base"
                    >
                        取消
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="w-full py-6 bg-white hover:bg-gray-100 text-black text-base"
                    >
                        确认
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}