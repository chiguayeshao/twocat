'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, Settings } from 'lucide-react';
import { VersionedTransaction } from '@solana/web3.js';
import { UnifiedWalletButton } from '@jup-ag/wallet-adapter';
import { useToast } from '@/hooks/use-toast';
import { JupiterService } from '@/services/jupiter.service';
import { JitoService } from '@/services/jito.service';
import { QuoteResponse } from '@jup-ag/api';
import { useTokenBalance } from '@/hooks/use-token-balance';
import { SystemProgram, PublicKey } from '@solana/web3.js';
import { MessageV0 } from '@solana/web3.js';
import { TradeSettings } from './TradeSettings';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet } from 'lucide-react';
import { BarChart3 } from 'lucide-react';

type TradeMode = 'buy' | 'sell';
type AmountPercentage = 25 | 50 | 75 | 100;

// 添加新的类型定义
interface SignatureResponse {
  message: string;
  token: string;
}

// 添加钱包状态枚举
enum WalletState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTED = 'CONNECTED',
  SIGNING = 'SIGNING',
  SIGNED = 'SIGNED',
  TRADING = 'TRADING',
}

const SOL_MINT_ADDRESS = 'So11111111111111111111111111111111111111112';

// 添加 SOL 固定金额选项
const SOL_AMOUNT_OPTIONS = [0.01, 0.1, 0.5, 1];

// 添加常量
const DEVELOPER_ADDRESS = 'Hv66YTLHXUWNq7KeMboFkonu8YjJUygMstgAeB1htD24'; // 替换为实际的开发者钱包地址
const FEE_PERCENTAGE = 0.01; // 1% 手续费

export default function TradeBox({ tokenAddress }: { tokenAddress: string | null }) {
  const isValidAddress = useMemo(() => {
    try {
      if (!tokenAddress) return false;
      return PublicKey.isOnCurve(new PublicKey(tokenAddress));
    } catch {
      return false;
    }
  }, [tokenAddress]);

  const { publicKey, signTransaction, signMessage, connected } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  const [mode, setMode] = useState<TradeMode>('buy');
  const [amount, setAmount] = useState<string>(
    SOL_AMOUNT_OPTIONS[0].toString()
  );
  const [slippage, setSlippage] = useState<number>(2.5); // 2.5%
  const [isAutoMode, setIsAutoMode] = useState<boolean>(false);
  const [isEditingSlippage, setIsEditingSlippage] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [priorityFee, setPriorityFee] = useState<string>('0.012');
  const [isCustomPriorityFee, setIsCustomPriorityFee] = useState(false);
  const [isAntiMEV, setIsAntiMEV] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [walletState, setWalletState] = useState<WalletState>(
    WalletState.DISCONNECTED
  );
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    isLoading: isBalanceLoading,
    error,
    solBalance: solBalance,
    tokenBalance: tokenBalance,
    tokenInfo: tokenInfo,
    refresh: refreshBalance,
  } = useTokenBalance({
    tokenMintAddress: isValidAddress ? tokenAddress! : '',
    refreshInterval: 30000, // 可选: 每30秒自动刷新一次
  });

  const handleAmountChange = (value: string) => {
    // 只允许数字和小数点
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const handleAmountPercentageClick = (value: number | AmountPercentage) => {
    if (mode === 'buy') {
      // 买入模式：直接设置 SOL 数量
      setAmount(value.toString());
    } else {
      // 卖出模式：计算代币百分比
      const calculatedAmount =
        ((value as AmountPercentage) / 100) * tokenBalance.balance;
      setAmount(calculatedAmount.toFixed(6));
    }
  };

  // 修改 mode 时更新默认值
  const handleModeChange = (newMode: TradeMode) => {
    setMode(newMode);
    // 根据模式设置默认值
    if (newMode === 'buy') {
      setAmount(SOL_AMOUNT_OPTIONS[0].toString());
    } else {
      const calculatedAmount = (25 / 100) * tokenBalance.balance;
      setAmount(calculatedAmount.toFixed(6));
    }
  };

  const handleSlippageChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setSlippage(numValue);
    }
  };

  const handlePriorityFeeChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setPriorityFee(value);
    }
  };

  // 获取签名消息
  const fetchSignMessage = async (): Promise<string> => {
    try {
      // TODO: 实现实际的API调用
      return 'Welcome to TwoCat! Click to sign in and accept the TwoCat Terms of Service: https://twocat.com/tos';
    } catch (error) {
      console.error('获取签名消息失败:', error);
      throw error;
    }
  };

  // 验证名
  const verifySignature = async (
    signature: Uint8Array,
    message: string
  ): Promise<SignatureResponse> => {
    try {
      // TODO: 实现实际的API调用
      return {
        message: '验证成功',
        token: 'mock_jwt_token',
      };
    } catch (error) {
      console.error('验证签名失败:', error);
      throw error;
    }
  };

  // 添加错误类型
  interface TradeError extends Error {
    code?: string | number;
    data?: unknown; // 或者
  }

  // 预留交易接口
  const executeJupiterTrade = useCallback(async () => {
    if (!connected || !publicKey || !signTransaction) {
      toast({
        title: '钱包未连接',
        description: '请先连接您的钱包',
        variant: 'destructive',
      });
      return;
    }

    if (!tokenAddress || !isValidAddress) {
      toast({
        title: '无效代币',
        description: '代币地址无效',
        variant: 'destructive',
      });
      return;
    }

    try {
      setWalletState(WalletState.TRADING);

      const atomicAmount = toAtomicUnits(
        amount,
        mode === 'buy' ? tokenInfo.solDecimals : tokenInfo.tokenDecimals
      );

      if (atomicAmount <= 0) {
        throw new Error('金额转换失败');
      }

      // 计算手续费金额 (1% of input amount)
      const feeAmount = Math.floor(Number(atomicAmount) * FEE_PERCENTAGE);

      // 使用 tokenAddress 替代 MONKEY_MINT_ADDRESS
      const quoteParams = {
        inputMint: mode === 'buy' ? SOL_MINT_ADDRESS : tokenAddress,
        outputMint: mode === 'buy' ? tokenAddress : SOL_MINT_ADDRESS,
        amount: Number(atomicAmount),
        slippageBps: Math.floor(slippage * 100), // 转换为基点 (1% = 100 基点)
        asLegacyTransaction: false,
        onlyDirectRoutes: false,
      };

      console.log('正在获取报价...', quoteParams);
      const quoteResponse = (await JupiterService.getQuote({
        ...quoteParams,
        inputMint: quoteParams.inputMint || '',
        outputMint: quoteParams.outputMint || ''
      })) as QuoteResponse;

      if (!quoteResponse) {
        throw new Error('无法获取交易报价');
      }

      // 验证报响应
      if (!quoteResponse.outAmount) {
        throw new Error('无效的报价响应');
      }

      // 显示交易预览
      const inputAmount =
        mode === 'buy'
          ? (atomicAmount / Math.pow(10, tokenInfo.solDecimals)).toFixed(
            tokenInfo.solDecimals
          )
          : (atomicAmount / Math.pow(10, tokenInfo.tokenDecimals)).toFixed(
            tokenInfo.tokenDecimals
          );
      const outputAmount =
        mode === 'buy'
          ? (
            Number(quoteResponse.outAmount) /
            Math.pow(10, tokenInfo.tokenDecimals)
          ).toFixed(tokenInfo.tokenDecimals)
          : (
            Number(quoteResponse.outAmount) /
            Math.pow(10, tokenInfo.solDecimals)
          ).toFixed(tokenInfo.solDecimals);

      console.log('交易预览:', {
        输入: `${inputAmount} ${mode === 'buy' ? tokenInfo.solSymbol : tokenInfo.tokenSymbol
          }`,
        输出: `${outputAmount} ${mode === 'buy' ? tokenInfo.tokenSymbol : tokenInfo.solSymbol
          }`,
        滑点: `${slippage / 10}%`,
        优先费: `${priorityFee} ${tokenInfo.solSymbol}`,
        手续费: `${(feeAmount / 1e9).toFixed(9)} ${tokenInfo.solSymbol}`,
      });

      console.log('正在准备交易...');
      // 使用 Jupiter API 的类型
      const swapParams = {
        swapRequest: {
          quoteResponse: quoteResponse as QuoteResponse,
          userPublicKey: publicKey.toBase58(),
          prioritizationFeeLamports: isAntiMEV
            ? {
              jitoTipLamports: Math.floor(parseFloat(priorityFee) * 1e9),
            }
            : Math.floor(parseFloat(priorityFee) * 1e9),
          dynamicComputeUnitLimit: true,
          asLegacyTransaction: false,
        },
      };

      const swapTransaction = await JupiterService.getSwapTransaction(
        swapParams
      );

      if (!swapTransaction) {
        throw new Error('交易构建失败');
      }

      // 加手续费转账指令
      const modifiedTransaction = JupiterService.addFeeInstruction(
        swapTransaction.swapTransaction,
        publicKey,
        DEVELOPER_ADDRESS,
        feeAmount
      );

      console.log('正在发送交易...');
      const signature = await JitoService.sendTransaction(
        modifiedTransaction,
        swapTransaction.lastValidBlockHeight,
        {
          publicKey,
          signTransaction,
          connection,
        }
      );

      console.log('交易已发送:', signature);

      // 显示成功消息
      toast({
        title: '交易成功',
        description: (
          <div className="flex flex-col gap-1">
            <span>交易已提交到区块链</span>
            <span>
              输入: {inputAmount}{' '}
              {mode === 'buy' ? tokenInfo.solSymbol : tokenInfo.tokenSymbol}
            </span>
            <span>
              输出: {outputAmount}{' '}
              {mode === 'buy' ? tokenInfo.tokenSymbol : tokenInfo.solSymbol}
            </span>
            <a
              href={`https://solscan.io/tx/${signature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              在 Solscan 上查看
            </a>
          </div>
        ),
        variant: 'success',
        className: 'dark:bg-green-900 dark:text-white',
        duration: 10000,
      });

      // 刷新余额
      await refreshBalance();
    } catch (error) {
      console.error('Trade failed:', error);
      const tradeError = error as TradeError;

      let errorTitle = '交易失败';
      let errorDescription = '请重试';

      // 扩展错误处理
      if (tradeError.message?.includes('Invalid transaction')) {
        errorTitle = '交易验证失败';
        errorDescription = '请检查交参数是否正确，或稍后重试';
      } else if (tradeError.message?.includes('insufficient balance')) {
        errorTitle = '余额不足';
        errorDescription = '请检查您的余额是否足够支付交易金额和手续费';
      } else if (tradeError.message?.includes('slippage')) {
        errorTitle = '滑点超出限制';
        errorDescription = '价格波动过大，请调整滑点或稍后重试';
      } else if (tradeError.message?.includes('route not found')) {
        errorTitle = '无可用交易路径';
        errorDescription = '当前无法完成此交易，请稍后重试或调整交易金额';
      } else if (tradeError.message?.includes('timeout')) {
        errorTitle = '交易超时';
        errorDescription = '网络响应超时，请检查您的网络连接后重试';
      } else if (tradeError.message?.includes('rejected')) {
        errorTitle = '交易被拒绝';
        errorDescription = '您取消了签名';
      } else if (tradeError.message?.includes('blockhash')) {
        errorTitle = '区块链网络繁忙';
        errorDescription = '请稍后重试';
      } else if (tradeError.message?.includes('simulation failed')) {
        errorTitle = '交易模拟失败';
        errorDescription = '请检查交易参数或稍后重试';
      }

      toast({
        title: errorTitle,
        description: (
          <div className="flex flex-col gap-1">
            <span>{errorDescription}</span>
            <span className="text-sm opacity-75">
              错误详情: {tradeError.message}
            </span>
          </div>
        ),
        variant: 'destructive',
        className: 'dark:bg-red-900 dark:text-white',
        duration: 5000,
      });
    } finally {
      setWalletState(WalletState.SIGNED);
    }
  }, [
    publicKey,
    connected,
    signTransaction,
    tokenAddress,
    isValidAddress,
    amount,
    mode,
    slippage,
    priorityFee,
    toast,
    refreshBalance,
    isAntiMEV,
    tokenInfo.tokenDecimals,
    tokenInfo.tokenSymbol,
    tokenInfo.solDecimals,
    tokenInfo.solSymbol,
  ]);

  // 处理签名流程
  const handleSignIn = useCallback(async () => {
    if (!publicKey || !signMessage || walletState === WalletState.SIGNING)
      return;

    try {
      setWalletState(WalletState.SIGNING);
      const message = await fetchSignMessage();
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      const { token } = await verifySignature(signature, message);

      setAuthToken(token);
      setWalletState(WalletState.SIGNED);
      toast({
        title: '签名成功',
        description: '您现在可以开始交易了',
        variant: 'success',
        className: 'dark:bg-green-900 dark:text-white',
      });
    } catch (error) {
      console.error('签名过程发生错误:', error);
      // 签名失败时，重置为已连接状态
      setWalletState(WalletState.CONNECTED);
      setAuthToken(null);

      if (error instanceof Error) {
        toast({
          title: error.message.includes('User rejected')
            ? '签取消'
            : '签名失败',
          description: error.message.includes('User rejected')
            ? '用户取消了签名，请重新签名以继续交易'
            : '请重试',
          variant: 'destructive',
          className: 'dark:bg-red-900 dark:text-white',
        });
      }
    }
  }, [publicKey, signMessage, walletState, toast]);

  // 监听钱包连接状态
  useEffect(() => {
    if (publicKey) {
      if (walletState === WalletState.DISCONNECTED) {
        setWalletState(WalletState.CONNECTED);
        // handleSignIn();
      }
    } else {
      setWalletState(WalletState.DISCONNECTED);
      setAuthToken(null);
    }
  }, [publicKey, walletState]);

  // 处理交易按钮点击
  const handleTradeButtonClick = useCallback(async () => {
    if (!connected) return;

    setWalletState(WalletState.TRADING);
    try {
      await executeJupiterTrade();
    } catch (error) {
      console.error('Trade execution failed:', error);
      toast({
        title: '交易失败',
        description: '请重试',
        variant: 'destructive',
        className: 'dark:bg-red-900 dark:text-white',
      });
    } finally {
      setWalletState(WalletState.CONNECTED); // 改为 CONNECTED 状态
    }
  }, [connected, executeJupiterTrade, toast]);

  // 添加交易条件判断
  const canTrade = useMemo(() => {
    if (!connected || !tokenAddress || !amount || isBalanceLoading) return false;

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) return false;

    // 检查余额是否足够
    if (mode === 'buy') {
      return numAmount <= solBalance;
    } else {
      return numAmount <= tokenBalance.balance;
    }
  }, [connected, tokenAddress, amount, mode, solBalance, tokenBalance.balance, isBalanceLoading]);

  // 修改渲染交易按钮的逻辑
  const renderTradeButton = () => {
    if (!connected) {
      return <UnifiedWalletButton />;
    }

    if (isBalanceLoading) {
      return (
        <button
          disabled
          className={cn(
            'w-full px-4 py-3 rounded-lg',
            'bg-[#2f2f2f] text-gray-500',
            'cursor-not-allowed opacity-50',
            'text-sm font-medium'
          )}
        >
          加载中...
        </button>
      );
    }

    const isTrading = walletState === WalletState.TRADING;

    return (
      <button
        onClick={handleTradeButtonClick}
        disabled={!canTrade || isTrading || isBalanceLoading}
        className={cn(
          'w-full px-4 py-3 rounded-lg',
          'text-sm font-medium',
          'transition-all duration-200',
          canTrade && !isTrading && !isBalanceLoading
            ? 'bg-[#53b991] text-white hover:bg-[#53b991]/90'
            : 'bg-[#2f2f2f] text-gray-500 cursor-not-allowed opacity-50'
        )}
      >
        {isTrading ? '交易中...' : mode === 'buy' ? '买入' : '卖出'}
      </button>
    );
  };

  // 修改 toAtomicUnits 的使用
  const toAtomicUnits = (amount: string, decimals: number): number => {
    try {
      const floatAmount = parseFloat(amount);
      return Math.floor(floatAmount * Math.pow(10, decimals));
    } catch (error) {
      console.error('Convert to atomic units failed:', error);
      return 0;
    }
  };

  // 修改数量显示部分
  const getDisplayDecimals = useCallback(() => {
    if (mode === 'buy') {
      return tokenInfo.solDecimals;
    }
    return tokenBalance.decimals || tokenInfo.tokenDecimals;
  }, [mode, tokenInfo.solDecimals, tokenInfo.tokenDecimals, tokenBalance.decimals]);

  const getDisplaySymbol = useCallback(() => {
    if (mode === 'buy') {
      return tokenInfo.solSymbol;
    }
    return tokenBalance.symbol || tokenInfo.tokenSymbol;
  }, [mode, tokenInfo.solSymbol, tokenInfo.tokenSymbol, tokenBalance.symbol]);

  // 添加 useEffect 来处理 tokenAddress 变化
  useEffect(() => {
    if (tokenAddress) {
      setIsLoading(true);
      // 模拟加载时间，实际项目中替换为真实的数据加载
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [tokenAddress]);

  // 添加骨架屏组件
  const TradeBoxSkeleton = () => (
    <div className="p-2 space-y-2">
      {/* 交易模式选择骨架屏 */}
      <div className="flex gap-1">
        <Skeleton className="flex-1 h-10 bg-gray-500/20" />
        <Skeleton className="flex-1 h-10 bg-gray-500/20" />
      </div>

      {/* 余额显示骨架屏 */}
      <div className="bg-[#2f2f2f] rounded-lg p-1.5">
        <div className="flex justify-between items-center mb-0.5">
          <Skeleton className="h-4 w-16 bg-gray-500/20" />
          <Skeleton className="h-4 w-12 bg-gray-500/20" />
        </div>
        <div className="grid grid-cols-2 gap-1">
          <Skeleton className="h-8 bg-gray-500/20" />
          <Skeleton className="h-8 bg-gray-500/20" />
        </div>
      </div>

      {/* 数量输入骨架屏 */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20 bg-gray-500/20" />
          <Skeleton className="h-4 w-24 bg-gray-500/20" />
        </div>
        <Skeleton className="h-10 w-full bg-gray-500/20" />
        <div className="grid grid-cols-4 gap-1">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 bg-gray-500/20" />
          ))}
        </div>
      </div>

      {/* 设置按钮骨架屏 */}
      <Skeleton className="h-10 w-full bg-gray-500/20" />

      {/* 交易按钮骨架屏 */}
      <Skeleton className="h-12 w-full bg-gray-500/20" />
    </div>
  );

  // 未选择代币时的提示界面
  const EmptyState = () => (
    <div className="h-full flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key="empty-state"
          className={cn(
            "w-full flex flex-col items-center justify-center",
            "bg-[#2f2f2f] rounded-lg p-8",
            "space-y-4"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "linear"
          }}
        >
          <BarChart3 className="h-16 w-16 text-gray-400" />

          <div className="space-y-2 text-center">
            <h3 className="text-xl font-medium text-gray-300">
              开始交易
            </h3>
            <p className="text-sm text-gray-400 max-w-[240px] mx-auto leading-relaxed">
              点击交易记录选择代币开始交易
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  // 根据状态返回不同的内容
  if (!tokenAddress) {
    return <EmptyState />;
  }

  if (isLoading) {
    return (
      <div className="h-full p-4">
        <TradeBoxSkeleton />
      </div>
    );
  }

  if (walletState === WalletState.DISCONNECTED) {
    return (
      <div className="h-full flex items-center p-4">
        <motion.div className="w-full">
          <UnifiedWalletButton
            buttonClassName={cn(
              "w-full py-3 rounded-lg font-medium text-sm",
              "bg-[#2f2f2f] hover:bg-[#353535]",
              "text-[#acc97e] hover:text-[#53b991]",
              "transition-all duration-200 ease-out",
              "flex items-center justify-center gap-2",
              "shadow-lg shadow-black/5"
            )}
            overrideContent={
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span>连接钱包开始交易</span>
              </div>
            }
          />
        </motion.div>
      </div>
    );
  }

  // 原有的交易界面渲染
  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-1 space-y-3">
        {/* 交易模式选择 - 更紧凑的样式 */}
        <div className="flex gap-1">
          <motion.button
            className={cn(
              'flex-1 py-2 rounded-lg font-medium',
              'flex items-center justify-center gap-1',
              mode === 'buy'
                ? 'bg-[#53b991] text-white shadow-md'
                : 'bg-discord-button-secondary text-gray-300 hover:bg-discord-button-secondary-hover'
            )}
            onClick={() => handleModeChange('buy')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TrendingUp className="h-3 w-3" />
            买入
          </motion.button>
          <motion.button
            className={cn(
              'flex-1 py-2 rounded-lg font-medium',
              'flex items-center justify-center gap-1',
              mode === 'sell'
                ? 'bg-[#de5569] text-white shadow-md'
                : 'bg-discord-button-secondary text-gray-300 hover:bg-discord-button-secondary-hover'
            )}
            onClick={() => handleModeChange('sell')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TrendingDown className="h-3 w-3" />
            卖出
          </motion.button>
        </div>

        {/* 余额显示 - 更紧凑的卡片样式 */}
        <div className="bg-[#2f2f2f] rounded-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">可用余额</span>
            <motion.button
              onClick={refreshBalance}
              className="text-xs text-[#53b991] hover:text-[#acc97e] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              刷新
            </motion.button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#2a2a2a] rounded p-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">{tokenInfo.solSymbol}</span>
                <span className="text-xs text-[#acc97e]">
                  {solBalance.toFixed(6)} {tokenInfo.solSymbol}
                </span>
              </div>
            </div>
            <div className="bg-[#2a2a2a] rounded p-1.5">
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-300">
                    {tokenBalance.symbol || '加载中...'}
                  </span>
                  <span className="text-xs text-[#acc97e]">
                    {tokenBalance.balance.toFixed(tokenBalance.decimals)}
                  </span>
                </div>
                <div className="text-[10px] text-right text-gray-400">
                  ≈ ${tokenBalance.usdValue.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 数量输入 - 更紧凑的样式 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-300">
              数量 ({getDisplaySymbol()})
            </span>
            <span className="text-gray-400">
              最大: {mode === 'buy'
                ? solBalance.toFixed(getDisplayDecimals())
                : tokenBalance.balance.toFixed(getDisplayDecimals())}
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className={cn(
                'w-full bg-[#2f2f2f] px-3 py-2 rounded-lg',
                'text-left pl-3 pr-14 text-sm text-[#acc97e]',
                'focus:outline-none focus:ring-1 focus:ring-[#53b991]/50',
                'transition-all duration-200',
                'placeholder:text-gray-500'
              )}
              placeholder="0.000000"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {getDisplaySymbol()}
            </span>
          </div>

          {/* 快捷金额按钮 - 更紧凑的网格 */}
          <div className="grid grid-cols-4 gap-1">
            {mode === 'buy'
              ? SOL_AMOUNT_OPTIONS.map((solAmount) => (
                <motion.button
                  key={solAmount}
                  className={cn(
                    'py-1.5 rounded-lg text-xs font-medium',
                    'bg-[#2f2f2f] hover:bg-[#353535]',
                    'text-gray-300 hover:text-[#acc97e]',
                    'transition-all duration-200'
                  )}
                  onClick={() => handleAmountPercentageClick(solAmount)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {solAmount}
                </motion.button>
              ))
              : [25, 50, 75, 100].map((percentage) => (
                <motion.button
                  key={percentage}
                  className={cn(
                    'py-1.5 rounded-lg text-xs font-medium',
                    'bg-[#2f2f2f] hover:bg-[#353535]',
                    'text-gray-300 hover:text-[#acc97e]',
                    'transition-all duration-200'
                  )}
                  onClick={() => handleAmountPercentageClick(percentage as AmountPercentage)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={tokenBalance.balance === 0}
                >
                  {percentage}%
                </motion.button>
              ))}
          </div>
        </div>

        {/* 设置按钮和概览 - 更紧凑的样式 */}
        <motion.div
          className="relative w-full flex items-center justify-between bg-[#2f2f2f] rounded-lg px-4 py-3"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center gap-3 text-xs text-gray-300">
            <span>滑点: <span className="text-[#53b991]">{slippage.toFixed(1)}%</span></span>
            <span>优先费: <span className="text-[#53b991]">{priorityFee}</span></span>
            <span>防夹: <span className="text-[#53b991]">{isAntiMEV ? '开' : '关'}</span></span>
          </div>
          <motion.button
            onClick={() => setShowSettingsDialog(true)}
            className="p-1.5 rounded-full hover:bg-discord-primary/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings size={14} className="text-gray-400" />
          </motion.button>
        </motion.div>

        {/* 交易按钮 - 保持原有大小以确保可用性 */}
        <motion.div
          className="mt-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {renderTradeButton()}
        </motion.div>
      </div>

      {/* 保持原有的设置弹框组件 */}
      <TradeSettings
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        slippage={slippage}
        isEditingSlippage={isEditingSlippage}
        setIsEditingSlippage={setIsEditingSlippage}
        handleSlippageChange={handleSlippageChange}
        priorityFee={priorityFee}
        isCustomPriorityFee={isCustomPriorityFee}
        setIsCustomPriorityFee={setIsCustomPriorityFee}
        setPriorityFee={setPriorityFee}
        isAntiMEV={isAntiMEV}
        setIsAntiMEV={setIsAntiMEV}
      />
    </div>
  );
}
