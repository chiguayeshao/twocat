import { PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { JupiterService } from "@/services/jupiter.service";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";

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
    symbol: "",
    balance: 0,
    usdValue: 0,
    decimals: 9,
  });
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    solDecimals: 9,
    solSymbol: "SOL",
    tokenDecimals: 9,
    tokenSymbol: "...",
  });

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

  // 获取余额的主函数
  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connection || !metaplex || !isValidAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      // 获取 SOL 余额
      const solBalance = await connection.getBalance(publicKey);
      setSolBalance(solBalance / Math.pow(10, 9)); // SOL decimals 固定为 9

      // 获取代币元数据
      const mintPubkey = new PublicKey(tokenMintAddress);
      const metadata = await metaplex
        .nfts()
        .findByMint({ mintAddress: mintPubkey });

      // 更新代币信息
      setTokenInfo((prev) => ({
        ...prev,
        tokenDecimals: metadata.mint.decimals,
        tokenSymbol: metadata.symbol || "Unknown",
      }));

      // 先设置代币基本信息
      const tokenMetadata = {
        symbol: metadata.symbol || "Unknown",
        name: metadata.name || "Unknown Token",
        decimals: metadata.mint.decimals,
      };

      // 获取代币价格
      const priceData = await JupiterService.getTokenPrice(tokenMintAddress);

      try {
        const associatedTokenAddress = await getAssociatedTokenAddress(
          mintPubkey,
          publicKey
        );

        const tokenAccount = await connection.getAccountInfo(
          associatedTokenAddress
        );

        if (!tokenAccount) {
          // 账户不存在，但保留代币信息
          setTokenBalance({
            ...tokenMetadata,
            balance: 0,
            usdValue: 0,
          });
          return;
        }

        // 账户存在，获取余额
        const balance = await connection.getTokenAccountBalance(
          associatedTokenAddress
        );
        const uiAmount = balance.value.uiAmount || 0;

        setTokenBalance({
          ...tokenMetadata,
          balance: uiAmount,
          usdValue: uiAmount * (priceData?.price || 0),
        });
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message.includes("AccountNotFoundError") ||
            error.message.includes("Account does not exist"))
        ) {
          // 账户不存在，但保留代币信息
          setTokenBalance({
            ...tokenMetadata,
            balance: 0,
            usdValue: 0,
          });
          return;
        }
        throw error;
      }
    } catch (error) {
      const err = error as Error;
      setError(err);
      console.error("获取余额失败:", err);

      // 重置代币信息为默认值
      setTokenBalance({
        symbol: "Unknown",
        balance: 0,
        usdValue: 0,
        decimals: 9,
      });

      toast({
        title: "余额信息",
        description: "无法获取代币信息，请稍后重试",
        variant: "default",
        className: "dark:bg-yellow-900 dark:text-white",
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
    refresh: fetchBalance,
  };
}
