import {
  createJupiterApiClient,
  QuoteResponse,
  SwapResponse,
} from '@jup-ag/api';
import { Transaction, SystemProgram, PublicKey } from '@solana/web3.js';

export class JupiterService {
  private static readonly jupiterApi = createJupiterApiClient();

  public static async getQuote(params: {
    inputMint: string;
    outputMint: string;
    amount: number;
    slippageBps: number;
    asLegacyTransaction: boolean;
    onlyDirectRoutes: boolean;
  }): Promise<QuoteResponse> {
    try {
      const quote = await this.jupiterApi.quoteGet({
        ...params,
        asLegacyTransaction: true,
        onlyDirectRoutes: params.onlyDirectRoutes ?? false,
      });

      if (!quote) {
        throw new Error(`无法获取报价 - 参数: ${JSON.stringify(params)}`);
      }

      return quote;
    } catch (error) {
      console.error('Jupiter API 错误:', error);
      throw new Error(
        `获取报价失败: ${error instanceof Error ? error.message : '未知错误'}`
      );
    }
  }

  public static async getSwapTransaction(params: {
    swapRequest: {
      quoteResponse: QuoteResponse;
      userPublicKey: string;
      prioritizationFeeLamports?: number | { jitoTipLamports: number };
      dynamicComputeUnitLimit?: boolean;
      asLegacyTransaction: boolean;
      dynamicSlippage: { maxBps: number };
    };
  }): Promise<SwapResponse> {
    try {
      const swapResult = await this.jupiterApi.swapPost({
        ...params,
        swapRequest: {
          ...params.swapRequest,
          asLegacyTransaction: true,
        },
      });
      return swapResult;
    } catch (error) {
      console.error('Jupiter swap error:', error);
      throw error;
    }
  }

  public static addFeeInstruction(
    transaction: string,
    fromPubkey: PublicKey,
    feeReceiverAddress: string,
    feeAmount: number
  ): string {
    const txBuf = Buffer.from(transaction, 'base64');
    const tx = Transaction.from(txBuf);

    const feeInstruction = SystemProgram.transfer({
      fromPubkey,
      toPubkey: new PublicKey(feeReceiverAddress),
      lamports: feeAmount,
    });

    tx.add(feeInstruction);
    return Buffer.from(tx.serialize({ verifySignatures: false })).toString(
      'base64'
    );
  }

  static async getTokenPrice(
    tokenMintAddress: string
  ): Promise<{ price: number }> {
    try {
      const response = await fetch(
        `https://price.jup.ag/v4/price?ids=${tokenMintAddress}`
      );
      const data = await response.json();
      return { price: data.data[tokenMintAddress]?.price || 0 };
    } catch (error) {
      console.error('获取代币价格失败:', error);
      return { price: 0 };
    }
  }
}
