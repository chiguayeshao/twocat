'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { sign, Transaction, VersionedTransaction } from '@solana/web3.js';
import { UnifiedWalletButton } from '@jup-ag/wallet-adapter';
import { useToast } from '@/hooks/use-toast';
import { JupiterService } from '@/services/jupiter.service';
import { JitoService } from '@/services/jito.service';
import { QuoteResponse } from '@jup-ag/api';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';

type TradeMode = 'buy' | 'sell';
type AmountPercentage = 25 | 50 | 75 | 100;

interface TokenBalance {
  symbol: string;
  balance: number;
  usdValue: number;
}

interface TradeBoxProps {
  // 可以添加props如token地址等
}
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
const MONKEY_MINT_ADDRESS = 'CBdCxKo9QavR9hfShgpEBG3zekorAeD7W1jfq2o3pump';

// 添加 SOL 固定金额选项
const SOL_AMOUNT_OPTIONS = [0.01, 0.1, 0.5, 1];

// 添加常量
const SOL_DECIMALS = 9;
const MONKEY_DECIMALS = 6; // 假设 MONKEY token 是 6 位小数，请根据实际情况调整

// 添加工具函数
const toAtomicUnits = (amount: string, decimals: number): number => {
  try {
    const floatAmount = parseFloat(amount);
    return Math.floor(floatAmount * Math.pow(10, decimals));
  } catch (error) {
    console.error('Convert to atomic units failed:', error);
    return 0;
  }
};

export default function TradeBox() {
  const { publicKey, signTransaction, signMessage, connected } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  const [mode, setMode] = useState<TradeMode>('buy');
  const [amount, setAmount] = useState<string>(
    SOL_AMOUNT_OPTIONS[0].toString()
  );
  const [slippage, setSlippage] = useState<number>(30); // 3.0%
  const [isAutoMode, setIsAutoMode] = useState<boolean>(false);
  const [isEditingSlippage, setIsEditingSlippage] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<TokenBalance>({
    symbol: 'MONKEY',
    balance: 0,
    usdValue: 0,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [priorityFee, setPriorityFee] = useState<string>('0.012');
  const [isCustomPriorityFee, setIsCustomPriorityFee] = useState(false);
  const [isAntiMEV, setIsAntiMEV] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [walletState, setWalletState] = useState<WalletState>(
    WalletState.DISCONNECTED
  );

  // 将 fetchBalance 提取为独立函数
  const fetchBalance = async () => {
    if (!publicKey) return;
    try {
      // TODO: 实现实际的余额获取逻辑
      setTokenBalance({
        symbol: 'MONKEY',
        balance: 1000,
        usdValue: 1000 * 0.5, // 假设价格是 $0.5
      });
    } catch (error) {
      console.error('获取余额失败:', error);
    }
  };

  // 修改原有的 useEffect
  useEffect(() => {
    fetchBalance();
  }, [publicKey]);

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
    data?: any;
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
        mode === 'buy' ? SOL_DECIMALS : MONKEY_DECIMALS
      );

      if (atomicAmount <= 0) {
        throw new Error('金额转换失败');
      }

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
      const quoteResponse = (await JupiterService.getQuote(
        quoteParams
      )) as QuoteResponse;

      if (!quoteResponse) {
        throw new Error('无法获取交易报价');
      }

      // 验证报价响应
      if (!quoteResponse.outAmount) {
        throw new Error('无效的报价响应');
      }

      // 显示交易预览
      const inputAmount =
        mode === 'buy'
          ? (atomicAmount / Math.pow(10, SOL_DECIMALS)).toFixed(SOL_DECIMALS)
          : (atomicAmount / Math.pow(10, MONKEY_DECIMALS)).toFixed(
              MONKEY_DECIMALS
            );
      const outputAmount =
        mode === 'buy'
          ? (
              Number(quoteResponse.outAmount) / Math.pow(10, MONKEY_DECIMALS)
            ).toFixed(MONKEY_DECIMALS)
          : (
              Number(quoteResponse.outAmount) / Math.pow(10, SOL_DECIMALS)
            ).toFixed(SOL_DECIMALS);

      console.log('交易预览:', {
        输入: `${inputAmount} ${mode === 'buy' ? 'SOL' : 'MONKEY'}`,
        输出: `${outputAmount} ${mode === 'buy' ? 'MONKEY' : 'SOL'}`,
        滑点: `${slippage / 10}%`,
        优先费: `${priorityFee} SOL`,
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

      const { swapTransaction, lastValidBlockHeight } =
        await JupiterService.getSwapTransaction(swapParams);

      if (!swapTransaction) {
        throw new Error('交易构建失败');
      }

      // 验证交易
      try {
        const decodedTransaction = VersionedTransaction.deserialize(
          Buffer.from(swapTransaction, 'base64')
        );
        console.log('交易详情:', {
          fee: decodedTransaction.signatures.length,
          instructions: decodedTransaction.message.compiledInstructions.length,
          signers: decodedTransaction.signatures.length,
        });
      } catch (error) {
        console.error('交易验证失败:', error);
        throw new Error('交易验证失败，请重试');
      }

      console.log('正在发送交易...');
      // 发送到 Jito RPC
      const signature = await JitoService.sendTransaction(
        swapTransaction,
        lastValidBlockHeight,
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
              输入: {inputAmount} {mode === 'buy' ? 'SOL' : 'MONKEY'}
            </span>
            <span>
              输出: {outputAmount} {mode === 'buy' ? 'MONKEY' : 'SOL'}
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
      await fetchBalance();
    } catch (error) {
      console.error('Trade failed:', error);
      const tradeError = error as TradeError;

      let errorTitle = '交易失败';
      let errorDescription = '请重试';

      // 扩展错误处理
      if (tradeError.message?.includes('Invalid transaction')) {
        errorTitle = '交易验证失败';
        errorDescription = '请检查交易参数是否正确，或稍后重试';
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
    fetchBalance,
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

  return (
    <div className="flex flex-col gap-4">
      {/* 交易模式选择 */}
      <div className="flex gap-2">
        <button
          className={cn(
            'flex-1 py-2 rounded',
            mode === 'buy' ? 'bg-green-600' : 'bg-discord-button-secondary'
          )}
          onClick={() => handleModeChange('buy')}
        >
          买入
        </button>
        <button
          className={cn(
            'flex-1 py-2 rounded',
            mode === 'sell' ? 'bg-red-600' : 'bg-discord-button-secondary'
          )}
          onClick={() => handleModeChange('sell')}
        >
          卖出
        </button>
        <div className="flex items-center gap-2">
          <span>自动</span>
          <input
            type="checkbox"
            checked={isAutoMode}
            onChange={(e) => setIsAutoMode(e.target.checked)}
          />
        </div>
      </div>

      {/* 余额显示 */}
      <div className="flex justify-between text-sm text-gray-300">
        <span>
          可用余额: {tokenBalance.balance.toFixed(6)} {tokenBalance.symbol}
        </span>
        <span>≈ ${tokenBalance.usdValue.toFixed(2)}</span>
      </div>

      {/* 数量输入 */}
      <div>
        <div className="text-sm mb-2">
          数量 ({mode === 'buy' ? 'SOL' : 'MONKEY'})
        </div>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-full bg-discord-button-secondary px-3 py-2 rounded text-right text-black"
            placeholder="0.000000"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {mode === 'buy'
            ? // 买入模式：显示固定 SOL 数量选项
              SOL_AMOUNT_OPTIONS.map((solAmount) => (
                <button
                  key={solAmount}
                  className="bg-discord-button-secondary py-1 rounded hover:bg-discord-button-secondary-hover"
                  onClick={() => handleAmountPercentageClick(solAmount)}
                >
                  {solAmount} SOL
                </button>
              ))
            : // 卖出模式：显示百分比选项
              [25, 50, 75, 100].map((percentage) => (
                <button
                  key={percentage}
                  className="bg-discord-button-secondary py-1 rounded hover:bg-discord-button-secondary-hover"
                  onClick={() =>
                    handleAmountPercentageClick(percentage as AmountPercentage)
                  }
                >
                  {percentage}%
                </button>
              ))}
        </div>
      </div>

      {/* 置面板触发器 */}
      <div className="flex items-center justify-between text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <span>滑点: 自动({(slippage / 10).toFixed(1)}%)</span>
        </div>
        <div className="flex items-center gap-4">
          <span>优先费: {priorityFee}</span>
          <span>防夹: {isAntiMEV ? '开' : '关'}</span>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="hover:text-white"
          >
            {isSettingsOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>
      </div>

      {/* 设置面板 */}
      {isSettingsOpen && (
        <div className="bg-discord-secondary rounded-lg p-4 space-y-4 border border-discord-divider">
          {/* 滑点设置 */}
          <div className="space-y-2">
            <div className="text-sm text-gray-300">滑点</div>
            <div className="flex gap-2">
              <button
                className={cn(
                  'px-4 py-2 rounded',
                  !isEditingSlippage
                    ? 'bg-discord-button-primary'
                    : 'bg-discord-button-secondary'
                )}
                onClick={() => setIsEditingSlippage(false)}
              >
                自动 {(slippage / 10).toFixed(1)}%
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full bg-discord-button-secondary px-4 py-2 rounded text-black"
                  placeholder="自定义滑点"
                  value={isEditingSlippage ? (slippage / 10).toFixed(1) : ''}
                  onChange={(e) => handleSlippageChange(e.target.value)}
                  onFocus={() => setIsEditingSlippage(true)}
                />
              </div>
            </div>
          </div>

          {/* 优先费设置 */}
          <div className="space-y-2">
            <div className="text-sm text-gray-300">优先费 (SOL)</div>
            <div className="flex gap-2">
              <button
                className={cn(
                  'px-4 py-2 rounded',
                  !isCustomPriorityFee
                    ? 'bg-discord-button-primary'
                    : 'bg-discord-button-secondary'
                )}
                onClick={() => {
                  setIsCustomPriorityFee(false);
                  setPriorityFee('0.012');
                }}
              >
                ×10 0.012
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full bg-discord-button-secondary px-4 py-2 rounded text-black"
                  placeholder="自定义优先费"
                  value={isCustomPriorityFee ? priorityFee : ''}
                  onChange={(e) => {
                    setIsCustomPriorityFee(true);
                    handlePriorityFeeChange(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          {/* 防夹设置 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">防夹模式(Anti-MEV)</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isAntiMEV}
                onChange={(e) => setIsAntiMEV(e.target.checked)}
              />
              <div
                className={cn(
                  'w-11 h-6 rounded-full peer',
                  "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
                  'after:bg-white after:rounded-full after:h-5 after:w-5',
                  'after:transition-all',
                  isAntiMEV
                    ? 'bg-green-600 after:translate-x-full'
                    : 'bg-red-600'
                )}
              ></div>
            </label>
          </div>
        </div>
      )}

      {/* 交易按钮 */}
      {renderTradeButton()}
    </div>
  );
}
