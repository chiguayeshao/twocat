export interface JupiterQuoteParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageBps: number;
  userPublicKey: string;
  platformFeeBps?: number;
  onlyDirectRoutes?: boolean;
}

export interface JupiterRouteSwapInfo {
  ammKey: string;
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: number;
  outAmount: number;
  feeAmount: number;
}

export interface JupiterQuoteResponse {
  amount: string;
  otherAmount?: string;
  swapMode: string;
  priceImpactPct: number;
  platformFee?: {
    amount: string;
    feeBps: number;
  };
  // 添加其他必要的字段...
}

export interface JupiterSwapParams {
  quoteResponse: JupiterQuoteResponse;
  userPublicKey: string;
  priorityFeeInSol: number;
  asLegacyTransaction: boolean;
  validateRecentBlockhash: boolean;
}

export interface JupiterSwapResponse {
  swapTransaction: string;
  lastValidBlockHeight: number;
}
