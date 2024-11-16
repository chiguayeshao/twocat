interface TokenBalanceData {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: number;
  uiAmount: number;
  chainId: string;
  priceUsd: number;
  valueUsd: number;
}

interface TokenBalanceResponse {
  success: boolean;
  data: TokenBalanceData | null;
}

interface NormalizedTokenBalance {
  symbol: string;
  uiAmount: number;
  valueUsd: number;
}

interface TokenOverviewData {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  // ... 其他字段可以根据需要添加
}

interface TokenOverviewResponse {
  success: boolean;
  data: TokenOverviewData;
}

export class BirdeyeService {
  public static async getTokenBalance(
    walletAddress: string,
    tokenAddress: string
  ): Promise<NormalizedTokenBalance> {
    try {
      const response = await fetch(
        `/api/birdeye/token-balance?wallet=${walletAddress}&address=${tokenAddress}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: TokenBalanceResponse = await response.json();

      if (!result.data) {
        return {
          symbol: '',
          uiAmount: 0,
          valueUsd: 0,
        };
      }

      return {
        symbol: result.data.symbol,
        uiAmount: result.data.uiAmount,
        valueUsd: result.data.valueUsd,
      };
    } catch (error) {
      console.error('Birdeye API error:', error);
      throw error;
    }
  }

  public static async getTokenOverview(
    tokenAddress: string
  ): Promise<TokenOverviewData> {
    try {
      const response = await fetch(
        `/api/birdeye/token-overview?address=${tokenAddress}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: TokenOverviewResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Birdeye API error:', error);
      throw error;
    }
  }
}
