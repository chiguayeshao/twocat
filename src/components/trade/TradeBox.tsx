'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { VersionedTransaction } from '@solana/web3.js';
import { UnifiedWalletButton } from '@jup-ag/wallet-adapter';
import { useToast } from '@/hooks/use-toast';
import { JupiterService } from '@/services/jupiter.service';
import { JitoService } from '@/services/jito.service';
import { QuoteResponse } from '@jup-ag/api';
import { useTokenBalance } from '@/hooks/use-token-balance';
import { SystemProgram, PublicKey } from '@solana/web3.js';
import { MessageV0 } from '@solana/web3.js';

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
// let MONKEY_MINT_ADDRESS = 'CBdCxKo9QavR9hfShgpEBG3zekorAeD7W1jfq2o3pump';

// 添加 SOL 固定金额选项
const SOL_AMOUNT_OPTIONS = [0.01, 0.1, 0.5, 1];

// 添加常量
const DEVELOPER_ADDRESS = 'Hv66YTLHXUWNq7KeMboFkonu8YjJUygMstgAeB1htD24'; // 替换为实际的开发者钱包地址
const FEE_PERCENTAGE = 0.01; // 1% 手续费

export default function TradeBox({ tokenAddress }: { tokenAddress: string | null }) {
  const MONKEY_MINT_ADDRESS = tokenAddress;
  const { publicKey, signTransaction, signMessage, connected } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  const [mode, setMode] = useState<TradeMode>('buy');
  const [amount, setAmount] = useState<string>(
    SOL_AMOUNT_OPTIONS[0].toString()
  );
  const [slippage, setSlippage] = useState<number>(150); // 3.0%
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

  const {
    isLoading,
    error,
    solBalance: solBalance,
    tokenBalance: tokenBalance,
    tokenInfo: tokenInfo,
    refresh: refreshBalance,
  } = useTokenBalance({
    tokenMintAddress: MONKEY_MINT_ADDRESS || '',
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
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setSlippage(numValue * 10); // 转换为内部表示（30 = 3.0%）
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

  // 验证签名
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
        className: 'dark:bg-red-900 dark:text-white',
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: '无效金额',
        description: '请输入有效的交易金额',
        variant: 'destructive',
        className: 'dark:bg-red-900 dark:text-white',
      });
      return;
    }

    try {
      setWalletState(WalletState.TRADING);

      const atomicAmount = toAtomicUnits(
        amount,
        mode === 'buy' ? tokenInfo.solDecimals : tokenInfo.monkeyDecimals
      );

      if (atomicAmount <= 0) {
        throw new Error('金额转换失败');
      }

      // 计算手续费金额 (1% of input amount)
      const feeAmount = Math.floor(Number(atomicAmount) * FEE_PERCENTAGE);

      // 使用 Jupiter API 的类型
      const quoteParams = {
        inputMint: mode === 'buy' ? SOL_MINT_ADDRESS : MONKEY_MINT_ADDRESS,
        outputMint: mode === 'buy' ? MONKEY_MINT_ADDRESS : SOL_MINT_ADDRESS,
        amount: Number(atomicAmount), // 将 atomicAmount 转换为数字
        slippageBps: slippage,
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
          : (atomicAmount / Math.pow(10, tokenInfo.monkeyDecimals)).toFixed(
            tokenInfo.monkeyDecimals
          );
      const outputAmount =
        mode === 'buy'
          ? (
            Number(quoteResponse.outAmount) /
            Math.pow(10, tokenInfo.monkeyDecimals)
          ).toFixed(tokenInfo.monkeyDecimals)
          : (
            Number(quoteResponse.outAmount) /
            Math.pow(10, tokenInfo.solDecimals)
          ).toFixed(tokenInfo.solDecimals);

      console.log('交易预览:', {
        输入: `${inputAmount} ${mode === 'buy' ? tokenInfo.solSymbol : tokenInfo.monkeySymbol
          }`,
        输出: `${outputAmount} ${mode === 'buy' ? tokenInfo.monkeySymbol : tokenInfo.solSymbol
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

      // 添加手续费转账指令
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
              {mode === 'buy' ? tokenInfo.solSymbol : tokenInfo.monkeySymbol}
            </span>
            <span>
              输出: {outputAmount}{' '}
              {mode === 'buy' ? tokenInfo.monkeySymbol : tokenInfo.solSymbol}
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
        errorDescription = '您取消了交易签名';
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
    connection,
    amount,
    mode,
    slippage,
    priorityFee,
    toast,
    refreshBalance,
    isAntiMEV,
    tokenInfo.monkeyDecimals,
    tokenInfo.monkeySymbol,
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
        handleSignIn();
      }
    } else {
      setWalletState(WalletState.DISCONNECTED);
      setAuthToken(null);
    }
  }, [publicKey, walletState, handleSignIn]);

  // 处理交易按钮点击
  const handleTradeButtonClick = useCallback(async () => {
    switch (walletState) {
      case WalletState.CONNECTED:
        await handleSignIn();
        break;
      case WalletState.SIGNED:
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
          setWalletState(WalletState.SIGNED);
        }
        break;
    }
  }, [walletState, handleSignIn, executeJupiterTrade, toast]);

  // 渲染交易按钮
  const renderTradeButton = () => {
    if (walletState === WalletState.DISCONNECTED) {
      return <UnifiedWalletButton />;
    }

    const getButtonText = () => {
      switch (walletState) {
        case WalletState.SIGNING:
          return '签名中...';
        case WalletState.CONNECTED:
          return '点击签名';
        case WalletState.TRADING:
          return '交易中...';
        case WalletState.SIGNED:
          return mode === 'buy' ? '买入' : '卖出';
        default:
          return '连接钱包';
      }
    };

    const getButtonStyle = () => {
      if (
        walletState === WalletState.SIGNING ||
        walletState === WalletState.TRADING
      ) {
        return 'bg-gray-600';
      }
      if (walletState === WalletState.CONNECTED) {
        return 'bg-yellow-600';
      }
      return mode === 'buy' ? 'bg-green-600' : 'bg-red-600';
    };

    return (
      <button
        className={cn('w-full py-2 rounded', getButtonStyle())}
        onClick={handleTradeButtonClick}
        disabled={
          walletState === WalletState.SIGNING ||
          walletState === WalletState.TRADING
        }
      >
        {getButtonText()}
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

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 交易模式选择 */}
      <div className="flex gap-2">
        <button
          className={cn(
            'flex-1 py-2.5 rounded-lg font-medium transition-all duration-200',
            mode === 'buy'
              ? 'bg-green-600 text-white shadow-sm'
              : 'bg-discord-button-secondary text-gray-300 hover:bg-discord-button-secondary-hover'
          )}
          onClick={() => handleModeChange('buy')}
        >
          买入
        </button>
        <button
          className={cn(
            'flex-1 py-2.5 rounded-lg font-medium transition-all duration-200',
            mode === 'sell'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-discord-button-secondary text-gray-300 hover:bg-discord-button-secondary-hover'
          )}
          onClick={() => handleModeChange('sell')}
        >
          卖出
        </button>
        <div className="flex items-center gap-2 px-3 bg-discord-secondary rounded-lg">
          <span className="text-sm text-gray-300">自动</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isAutoMode}
              onChange={(e) => setIsAutoMode(e.target.checked)}
            />
            <div
              className={cn(
                'w-8 h-4 rounded-full peer transition-all duration-200',
                'after:content-[""] after:absolute after:top-[2px] after:left-[2px]',
                'after:bg-white after:rounded-full after:h-3 after:w-3',
                'after:transition-all after:duration-200',
                isAutoMode
                  ? 'bg-blue-600 after:translate-x-full'
                  : 'bg-gray-600'
              )}
            ></div>
          </label>
        </div>
      </div>

      {/* 余额显示 */}
      <div className="bg-discord-secondary/50 rounded-lg p-3 space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">可用余额</span>
          <button
            onClick={refreshBalance}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            刷新
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">{tokenInfo.solSymbol}</span>
            <span>
              {solBalance.toFixed(6)} {tokenInfo.solSymbol}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">
              {tokenInfo.monkeySymbol}
            </span>
            <div className="text-right">
              <div>
                {tokenBalance.balance.toFixed(6)} {tokenInfo.monkeySymbol}
              </div>
              <div className="text-xs text-gray-400">
                ≈ ${tokenBalance.usdValue.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 数量输入 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">
            数量 (
            {mode === 'buy' ? tokenInfo.solSymbol : tokenInfo.monkeySymbol})
          </span>
          <span className="text-gray-400">
            最大:{' '}
            {mode === 'buy'
              ? solBalance.toFixed(6)
              : tokenBalance.balance.toFixed(6)}
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className={cn(
              'w-full bg-discord-button-secondary px-4 py-2.5 rounded-lg',
              'text-right pr-16 text-base text-black',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
              'transition-all duration-200',
              'placeholder:text-gray-500'
            )}
            placeholder="0.000000"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {mode === 'buy' ? tokenInfo.solSymbol : tokenInfo.monkeySymbol}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {mode === 'buy'
            ? SOL_AMOUNT_OPTIONS.map((solAmount) => (
              <button
                key={solAmount}
                className={cn(
                  'py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                  'bg-discord-button-secondary hover:bg-discord-button-secondary-hover',
                  'text-gray-300 hover:text-white'
                )}
                onClick={() => handleAmountPercentageClick(solAmount)}
              >
                {solAmount}
              </button>
            ))
            : [25, 50, 75, 100].map((percentage) => (
              <button
                key={percentage}
                className={cn(
                  'py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                  'bg-discord-button-secondary hover:bg-discord-button-secondary-hover',
                  'text-gray-300 hover:text-white'
                )}
                onClick={() =>
                  handleAmountPercentageClick(percentage as AmountPercentage)
                }
              >
                {percentage}%
              </button>
            ))}
        </div>
      </div>

      {/* 设置按钮和面板 */}
      <div className="relative w-full">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={cn(
            'w-full px-4 py-2.5 flex items-center justify-between',
            'bg-discord-secondary rounded-lg transition-all duration-200',
            'hover:bg-discord-secondary-hover',
            isSettingsOpen && 'rounded-b-none'
          )}
        >
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span>滑点: {(slippage / 10).toFixed(1)}%</span>
            <span>优先费: {priorityFee}</span>
            <span>防夹: {isAntiMEV ? '开' : '关'}</span>
          </div>
          <ChevronDown
            size={16}
            className={cn(
              'text-gray-400 transition-transform duration-200',
              isSettingsOpen && 'rotate-180'
            )}
          />
        </button>

        {isSettingsOpen && (
          <div
            className={cn(
              'absolute left-0 right-0 z-10 w-full',
              'bg-discord-secondary rounded-b-lg',
              'border-t border-discord-divider',
              'animate-slideDown'
            )}
          >
            <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
              {/* 滑点设置 */}
              <div className="space-y-2">
                <div className="text-sm text-gray-300">滑点</div>
                <div className="flex gap-2 w-full">
                  <button
                    className={cn(
                      'px-4 py-2 rounded transition-colors duration-200 whitespace-nowrap',
                      !isEditingSlippage
                        ? 'bg-discord-button-primary text-white'
                        : 'bg-discord-button-secondary text-gray-300'
                    )}
                    onClick={() => setIsEditingSlippage(false)}
                  >
                    自动 {(slippage / 10).toFixed(1)}%
                  </button>
                  <input
                    type="text"
                    className={cn(
                      'flex-1 min-w-0 bg-discord-button-secondary px-4 py-2 rounded',
                      'text-black placeholder-gray-500',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
                      'transition-all duration-200'
                    )}
                    placeholder="自定义滑点"
                    value={isEditingSlippage ? (slippage / 10).toFixed(1) : ''}
                    onChange={(e) => handleSlippageChange(e.target.value)}
                    onFocus={() => setIsEditingSlippage(true)}
                  />
                </div>
              </div>

              {/* 优先费设置 */}
              <div className="space-y-2">
                <div className="text-sm text-gray-300">优先费 (SOL)</div>
                <div className="flex gap-2 w-full">
                  <button
                    className={cn(
                      'px-4 py-2 rounded transition-colors duration-200 whitespace-nowrap',
                      !isCustomPriorityFee
                        ? 'bg-discord-button-primary text-white'
                        : 'bg-discord-button-secondary text-gray-300'
                    )}
                    onClick={() => {
                      setIsCustomPriorityFee(false);
                      setPriorityFee('0.012');
                    }}
                  >
                    ×10 0.012
                  </button>
                  <input
                    type="text"
                    className={cn(
                      'flex-1 min-w-0 bg-discord-button-secondary px-4 py-2 rounded',
                      'text-black placeholder-gray-500',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
                      'transition-all duration-200'
                    )}
                    placeholder="自定义优先费"
                    value={isCustomPriorityFee ? priorityFee : ''}
                    onChange={(e) => {
                      setIsCustomPriorityFee(true);
                      handlePriorityFeeChange(e.target.value);
                    }}
                  />
                </div>
              </div>

              {/* 防夹设置 */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-300">
                  防夹模式(Anti-MEV)
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isAntiMEV}
                    onChange={(e) => setIsAntiMEV(e.target.checked)}
                  />
                  <div
                    className={cn(
                      'w-11 h-6 rounded-full peer transition-colors duration-200',
                      'after:content-[""] after:absolute after:top-[2px] after:left-[2px]',
                      'after:bg-white after:rounded-full after:h-5 after:w-5',
                      'after:transition-all after:duration-200',
                      isAntiMEV
                        ? 'bg-green-600 after:translate-x-full'
                        : 'bg-gray-600'
                    )}
                  ></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 交易按钮 */}
      <div className="mt-1">{renderTradeButton()}</div>
    </div>
  );
}
