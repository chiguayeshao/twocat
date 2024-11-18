const API_BASE_URL = "http://localhost:3000";
export interface TokenHolding {
  address: string;
  decimals: number;
  balance: number;
  uiAmount: number;
  chainId: string;
  name: string;
  symbol: string;
  logoURI: string;
  priceUsd: number;
  valueUsd: number;
}

export interface WalletTokens {
  wallet: string;
  totalUsd: number;
  items: TokenHolding[];
}

export async function fetchWalletTokens(
  address: string
): Promise<WalletTokens> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tokens/wallet?address=${address}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch wallet tokens");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching wallet tokens:", error);
    throw error;
  }
}
