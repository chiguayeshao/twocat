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
    setPriorityFee: (value: string) => void;
    isAntiMEV: boolean;
    setIsAntiMEV: (value: boolean) => void;
}

const DEFAULT_PRIORITY_FEE = '0.018';
const DEFAULT_SLIPPAGE = 2.5;

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
    setPriorityFee,
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

    // 修改优先费处理函数
    const handlePriorityFeeChange = (value: string) => {
        // 如果输入为空，使用默认值
        if (!value.trim()) {
            setIsCustomPriorityFee(false);
            setPriorityFee(DEFAULT_PRIORITY_FEE);
            return;
        }

        // 只允许输入数字和小数点
        if (/^\d*\.?\d*$/.test(value)) {
            setIsCustomPriorityFee(true);
            setPriorityFee(value);
        }
    };

    // 修改内部的滑点处理函数
    const handleSlippageInputChange = (value: string) => {
        // 如果输入为空，使用默认值
        if (!value.trim()) {
            setIsEditingSlippage(false);
            handleSlippageChange(DEFAULT_SLIPPAGE.toString());
            return;
        }

        // 只允许输入数字和小数点
        if (/^\d*\.?\d*$/.test(value)) {
            setIsEditingSlippage(true);
            handleSlippageChange(value);
        }
    };

    // 处理取消
    const handleCancel = () => {
        // 恢复到初始值
        setIsEditingSlippage(initialValues.isEditingSlippage);
        handleSlippageChange(initialValues.slippage.toString());
        setIsCustomPriorityFee(initialValues.isCustomPriorityFee);
        setPriorityFee(initialValues.priorityFee);
        setIsAntiMEV(true);

        // 关闭弹框
        onOpenChange(false);
    };

    // 修改确认处理函数
    const handleConfirm = () => {
        // 处理滑点
        if (isEditingSlippage) {
            const slippageValue = parseFloat(slippage.toString());
            if (!slippageValue || isNaN(slippageValue)) {
                setIsEditingSlippage(false);
                handleSlippageChange(DEFAULT_SLIPPAGE.toString());
            } else if (slippageValue > 100) {
                handleSlippageChange('100');
            }
        }

        // 如果自定义优先费为空，使用默认值
        if (isCustomPriorityFee) {
            if (!priorityFee.trim()) {
                setIsCustomPriorityFee(false);
                setPriorityFee(DEFAULT_PRIORITY_FEE);
            } else {
                // 如果大于 0.2，则设置为 0.2
                const numValue = parseFloat(priorityFee);
                if (!isNaN(numValue) && numValue > 0.2) {
                    setPriorityFee('0.2');
                }
            }
        }
        // 关闭弹框
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
                    <Zap size={20} className="text-[#acc97e]" />
                    <DialogTitle className="text-lg font-medium text-[#acc97e]">
                        快速设置
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
                                onChange={(e) => setIsAntiMEV(true)}
                            />
                            <div className={cn(
                                'w-12 h-7 rounded-full peer transition-colors duration-200',
                                'after:content-[""] after:absolute after:top-[2px] after:left-[2px]',
                                'after:bg-white after:rounded-full after:h-6 after:w-6',
                                'after:transition-all after:duration-200',
                                isAntiMEV
                                    ? 'bg-[#53b991] after:translate-x-full'
                                    : 'bg-[#2f2f2f]'
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
                                    ? 'bg-gray-800 border-[#53b991]'
                                    : 'hover:border-gray-600'
                            )}
                            onClick={() => {
                                setIsCustomPriorityFee(false);
                                setPriorityFee(DEFAULT_PRIORITY_FEE);
                            }}
                        >
                            <div className="font-medium text-[#acc97e]">×15</div>
                            <div className="text-sm text-gray-400">{DEFAULT_PRIORITY_FEE} SOL</div>
                            <div className="text-xs text-gray-500">≈ 2s</div>
                        </button>

                        <div className="text-sm text-gray-400 mt-2">
                            支持自定义优先费 (最大: 0.2 SOL)
                        </div>

                        <div className="flex gap-3">
                            <input
                                type="text"
                                className={cn(
                                    'flex-1 bg-[#2f2f2f] rounded-lg px-4 py-3',
                                    'text-[#acc97e] placeholder-gray-500',
                                    'border border-gray-700',
                                    'focus:outline-none focus:border-[#53b991]',
                                    'transition-all duration-200',
                                    isCustomPriorityFee && parseFloat(priorityFee) > 0.2 && 'border-[#de5569]'
                                )}
                                placeholder="自定义优先费"
                                value={isCustomPriorityFee ? priorityFee : ''}
                                onChange={(e) => handlePriorityFeeChange(e.target.value)}
                            />
                            <div className="flex items-center px-4 py-3 bg-[#2f2f2f] rounded-lg text-gray-400">
                                SOL
                            </div>
                        </div>

                        {isCustomPriorityFee && parseFloat(priorityFee) > 0.2 && (
                            <div className="text-sm text-[#de5569] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#de5569]"></span>
                                超过最大值 0.2 SOL，确认时将自动调整为 0.2 SOL
                            </div>
                        )}
                    </div>

                    {/* 滑点设置 */}
                    <div className="space-y-2">
                        <div className="text-base text-gray-300">滑点限制</div>
                        <button
                            className={cn(
                                'w-[120px] p-4 rounded-lg border border-gray-700 transition-colors',
                                'flex flex-col items-center justify-center',
                                !isEditingSlippage
                                    ? 'bg-gray-800 border-[#53b991]'
                                    : 'hover:border-gray-600'
                            )}
                            onClick={() => {
                                setIsEditingSlippage(false);
                                handleSlippageChange(DEFAULT_SLIPPAGE.toString());
                            }}
                        >
                            <div className="font-medium text-[#acc97e]">自动</div>
                            <div className="text-sm text-gray-400">{DEFAULT_SLIPPAGE}%</div>
                            <div className="text-xs text-gray-500">推荐设置</div>
                        </button>

                        <div className="text-sm text-gray-400 mt-2">
                            支持自定义滑点 (最大: 100%)
                        </div>

                        <div className="flex gap-3">
                            <input
                                type="text"
                                className={cn(
                                    'flex-1 bg-[#2f2f2f] rounded-lg px-4 py-3',
                                    'text-[#acc97e] placeholder-gray-500',
                                    'border border-gray-700',
                                    'focus:outline-none focus:border-[#53b991]',
                                    'transition-all duration-200',
                                    isEditingSlippage && parseFloat(slippage.toString()) > 100 && 'border-[#de5569]'
                                )}
                                placeholder="自定义滑点"
                                value={isEditingSlippage ? slippage : ''}
                                onChange={(e) => handleSlippageInputChange(e.target.value)}
                            />
                            <div className="flex items-center px-4 py-3 bg-[#2f2f2f] rounded-lg text-gray-400">
                                %
                            </div>
                        </div>

                        {isEditingSlippage && parseFloat(slippage.toString()) > 100 && (
                            <div className="text-sm text-[#de5569] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#de5569]"></span>
                                超过最大值 100%，确认时将自动调整为 100%
                            </div>
                        )}
                    </div>
                </div>

                {/* 底部按钮 */}
                <div className="grid grid-cols-2 gap-3 p-4 mt-auto">
                    <Button
                        variant="secondary"
                        onClick={handleCancel}
                        className="w-full py-6 bg-[#2f2f2f] hover:bg-[#404249] text-gray-300 text-base"
                    >
                        取消
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="w-full py-6 bg-[#53b991] hover:bg-[#4ca883] text-white text-base"
                    >
                        确认
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}