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
    symbol: "MONKEY",
    balance: 0,
    usdValue: 0,
  });
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    solDecimals: 9,
    solSymbol: "SOL",
    monkeyDecimals: 6,
    monkeySymbol: "MONKEY",
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
    if (!publicKey || !connection || !metaplex) return;
    if (!isValidAddress) {
      setTokenBalance({
        symbol: tokenInfo.monkeySymbol,
        balance: 0,
        usdValue: 0,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 获取 SOL 余额
      const solBalance = await connection.getBalance(publicKey);
      const solAmount = solBalance / Math.pow(10, tokenInfo.solDecimals);
      setSolBalance(solAmount);

      try {
        // 确保 tokenMintAddress 是有效的
        const mintPubkey = new PublicKey(tokenMintAddress);

        // 获取关联代币账户地址
        const associatedTokenAddress = await getAssociatedTokenAddress(
          mintPubkey,
          publicKey
        );

        // 检查账户是否存在
        const tokenAccount = await connection.getAccountInfo(
          associatedTokenAddress
        );

        if (!tokenAccount) {
          setTokenBalance({
            symbol: tokenInfo.monkeySymbol,
            balance: 0,
            usdValue: 0,
          });
          return;
        }

        // 获取代币余额
        const tokenBalance = await connection.getTokenAccountBalance(
          associatedTokenAddress
        );
        const uiAmount = tokenBalance.value.uiAmount || 0;

        // 获取价格数据
        const priceData = await JupiterService.getTokenPrice(tokenMintAddress);
        const usdValue = uiAmount * (priceData?.price || 0);

        // 获取代币元数据
        const metadata = await metaplex.nfts().findByMint({
          mintAddress: new PublicKey(tokenMintAddress),
        });

        setTokenBalance({
          symbol: metadata.symbol || tokenInfo.monkeySymbol,
          balance: uiAmount,
          usdValue: usdValue,
        });

        // 更新代币信息
        setTokenInfo((prev) => ({
          ...prev,
          monkeyDecimals: metadata.mint.decimals,
          monkeySymbol: metadata.symbol || "MONKEY",
        }));
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message.includes("AccountNotFoundError") ||
            error.message.includes("Account does not exist") ||
            error.message.includes("Invalid public key"))
        ) {
          setTokenBalance({
            symbol: tokenInfo.monkeySymbol,
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

      // 根据错误类型显示不同的提示
      if (err.message.includes("Invalid public key")) {
        toast({
          title: "地址无效",
          description: "代币地址格式不正确",
          variant: "destructive",
        });
      } else {
        toast({
          title: "余额信息",
          description: "您还未持有该代币，余额显示为 0",
          variant: "default",
          className: "dark:bg-yellow-900 dark:text-white",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    publicKey,
    connection,
    metaplex,
    tokenMintAddress,
    isValidAddress,
    toast,
    tokenInfo.solDecimals,
    tokenInfo.monkeySymbol,
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
