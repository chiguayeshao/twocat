import { PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useToast } from '@/hooks/use-toast';
import { JupiterService } from '@/services/jupiter.service';

interface TokenBalance {
  symbol: string;
  balance: number;
  usdValue: number;
  decimals: number;
  name?: string;
}

interface TokenInfo {
  solDecimals: number;
  solSymbol: string;
  tokenDecimals: number;
  tokenSymbol: string;
}

interface UseTokenBalanceProps {
  tokenMintAddress: string;
  refreshInterval?: number; // 可选的自动刷新间隔(毫秒)
}

interface TokenOverview {
  name: string;
  symbol: string;
  decimals: number;
  // 可以根据实际 token-overview API 返回的数据添加更多字段
}

export function useTokenBalance({
  tokenMintAddress,
  refreshInterval,
}: UseTokenBalanceProps) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<TokenBalance>({
    symbol: '',
    balance: 0,
    usdValue: 0,
    decimals: 9,
  });
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    solDecimals: 9,
    solSymbol: 'SOL',
    tokenDecimals: 9,
    tokenSymbol: '...',
  });
  const [tokenOverview, setTokenOverview] = useState<TokenOverview | null>(
    null
  );

  // 使用 useMemo 缓存 Metaplex 实例
  const metaplex = useMemo(() => {
    if (!connection) return null;
    return new Metaplex(connection);
  }, [connection]);

  // 添加地址验证
  const isValidAddress = useMemo(() => {
    try {
      if (!tokenMintAddress) return false;
      return PublicKey.isOnCurve(new PublicKey(tokenMintAddress));
    } catch {
      return false;
    }
  }, [tokenMintAddress]);

  // 获取代币概览信息
  const fetchTokenOverview = useCallback(async () => {
    if (!isValidAddress) return;

    try {
      const response = await fetch(
        `/api/twocat-core/token-overview?address=${tokenMintAddress}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch token overview');
      }
      const { data } = await response.json();
      console.log('data', data);
      setTokenOverview(data);

      // 更新 tokenBalance 中的 name 和 symbol
      setTokenBalance((prev) => ({
        ...prev,
        name: data.name,
        symbol: data.symbol,
        decimals: data.decimals,
      }));
    } catch (error) {
      console.error('获取代币概览信息失败:', error);
    }
  }, [tokenMintAddress, isValidAddress]);

  // 监听 tokenMintAddress 变化，获取代币概览
  useEffect(() => {
    if (isValidAddress) {
      fetchTokenOverview();
    }
  }, [tokenMintAddress, isValidAddress, fetchTokenOverview]);

  // 获取余额的主函数
  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connection || !metaplex || !isValidAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      // 只获取 SOL 余额
      const solBalance = await connection.getBalance(publicKey);
      setSolBalance(solBalance / Math.pow(10, 9));

      // 使用 Birdeye API 获取代币余额
      const response = await fetch(
        `/api/birdeye/token-balance?wallet=${publicKey.toString()}&address=${tokenMintAddress}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch token balance');
      }

      const { success, data } = await response.json();

      if (success) {
        // 当 data 为 null 时，表示余额为 0
        if (!data) {
          setTokenBalance((prev) => ({
            ...prev,
            balance: 0,
            usdValue: 0,
          }));
        } else {
          setTokenBalance((prev) => ({
            ...prev,
            balance: data.uiAmount,
            usdValue: data.valueUsd,
            decimals: data.decimals,
          }));

          setTokenInfo((prev) => ({
            ...prev,
            tokenDecimals: data.decimals,
            tokenSymbol: data.symbol,
          }));
        }
      } else {
        throw new Error('Invalid response from Birdeye API');
      }
    } catch (error) {
      const err = error as Error;
      setError(err);
      console.error('获取余额失败:', err);

      setTokenBalance({
        symbol: 'Unknown',
        balance: 0,
        usdValue: 0,
        decimals: 9,
      });

      toast({
        title: '余额信息',
        description: '无法获取代币信息，请稍后重试',
        variant: 'default',
        className: 'dark:bg-yellow-900 dark:text-white',
      });
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connection, metaplex, tokenMintAddress, isValidAddress]);

  // 监听钱包变化
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // 设置自动刷新
  useEffect(() => {
    if (!refreshInterval) return;

    const intervalId = setInterval(fetchBalance, refreshInterval);
    return () => clearInterval(intervalId);
  }, [fetchBalance, refreshInterval]);

  // 返回所需的状态和方法
  return {
    isLoading,
    error,
    solBalance,
    tokenBalance,
    tokenInfo,
    tokenOverview,
    refresh: fetchBalance,
  };
}
