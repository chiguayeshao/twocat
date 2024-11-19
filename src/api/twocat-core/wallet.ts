const API_BASE_URL = "http://localhost:3000";

export interface WalletTransactionsParams {
  roomId: string;
  page: number;
  limit: number;
}

export interface Transaction {
  _id: string;
  walletAddress: string;
  type: "buy" | "sell";
  solAmount: number;
  tokenAmount: number;
  tokenAddress: string;
  signature: string;
  timestamp: number;
  symbol: string;
  tokenName: string;
  createdAt?: string;
  updatedAt?: string;
  walletDescription?: string;
}

interface TransactionResponse {
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export async function fetchWalletTransactions({
  roomId,
  page,
  limit,
}: WalletTransactionsParams): Promise<TransactionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/wallets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem("token")}`, // 假设token存储在localStorage中
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXRfYWRkcmVzcyI6IjVIWjM0ZEx1a2syR2lDY3ZVSDZQakRmTDk2OXJIb3cyNVBvRmpBdGcxMW9FIiwicm9sZSI6Im93bmVyIiwibm9uY2UiOiIzMGMxODBkM2EzOTBjMmQ5YTA1YzE5ODBkMDA1MmFjNF8xNzMxODYxNjAwNDgwIiwiaWF0IjoxNzMxODYxNjQxLCJqdGkiOiJiYWI2MWQwYjA4NGVlMmY3YWQzNzhmZThlNWYzZjE4MiIsImV4cCI6MTczMTk0ODA0MX0.ia7zZxWzoq-6aRRSrh1W1ykbuWPg6OrKzvAWdA9SM_c`,
      },
      body: JSON.stringify({
        roomId,
        page,
        limit,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("获取钱包交易记录失败:", error);
    throw error;
  }
}
