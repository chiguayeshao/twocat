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
}

interface TokenInfo {
  solDecimals: number;
  solSymbol: string;
  monkeyDecimals: number;
  monkeySymbol: string;
}

interface UseTokenBalanceProps {
  tokenMintAddress: string;
  refreshInterval?: number; // 可选的自动刷新间隔(毫秒)
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
    symbol: 'MONKEY',
    balance: 0,
    usdValue: 0,
  });
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    solDecimals: 9,
    solSymbol: 'SOL',
    monkeyDecimals: 6,
    monkeySymbol: 'MONKEY',
  });

  // 使用 useMemo 缓存 Metaplex 实例
  const metaplex = useMemo(() => {
    if (!connection) return null;
    return new Metaplex(connection);
  }, [connection]);

  // 获取余额的主函数
  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connection || !metaplex) return;

    setIsLoading(true);
    setError(null);

    try {
      // 获取 SOL 余额
      const solBalance = await connection.getBalance(publicKey);
      const solAmount = solBalance / Math.pow(10, tokenInfo.solDecimals);
      setSolBalance(solAmount);

      // 获取代币余额
      const tokenAddress = await metaplex
        .tokens()
        .pdas()
        .associatedTokenAccount({
          mint: new PublicKey(tokenMintAddress),
          owner: publicKey,
        });
      const token = await metaplex.tokens().findTokenByAddress({
        address: tokenAddress,
      });

      // 获取代币元数据
      const metadata = await metaplex.nfts().findByMint({
        mintAddress: new PublicKey(tokenMintAddress),
      });

      const uiAmount =
        token.amount.basisPoints.toNumber() /
        Math.pow(10, tokenInfo.monkeyDecimals);

      // 获取价格数据
      const priceData = await JupiterService.getTokenPrice(tokenMintAddress);
      const usdValue = uiAmount * (priceData?.price || 0);

      setTokenBalance({
        symbol: metadata.symbol || 'MONKEY',
        balance: uiAmount,
        usdValue: usdValue,
      });

      // 更新代币信息
      setTokenInfo((prev) => ({
        ...prev,
        monkeyDecimals: metadata.mint.decimals,
        monkeySymbol: metadata.symbol || 'MONKEY',
      }));
    } catch (error) {
      const err = error as Error;
      setError(err);
      console.error('获取余额失败:', err);
      toast({
        title: '获取余额失败',
        description: '无法获取最新余额信息',
        variant: 'destructive',
        className: 'dark:bg-red-900 dark:text-white',
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    publicKey,
    connection,
    metaplex,
    tokenMintAddress,
    toast,
    tokenInfo.solDecimals,
    tokenInfo.monkeyDecimals,
  ]);

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
    refresh: fetchBalance,
  };
}
