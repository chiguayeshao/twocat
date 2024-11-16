import { Connection, VersionedTransaction, PublicKey } from '@solana/web3.js';

interface WalletAdapter {
  publicKey: PublicKey;
  signTransaction: (
    transaction: VersionedTransaction
  ) => Promise<VersionedTransaction>;
  connection: Connection;
}

export class JitoService {
  public static async sendTransaction(
    transaction: string,
    lastValidBlockHeight: number,
    wallet: WalletAdapter
  ): Promise<string> {
    try {
      // 解码交易
      const tx = VersionedTransaction.deserialize(
        Buffer.from(transaction, 'base64')
      );

      // 签名交易
      const signedTx = await wallet.signTransaction(tx);

      // 发送已签名的交易
      const signature = await wallet.connection.sendRawTransaction(
        signedTx.serialize(),
        {
          skipPreflight: true,
          maxRetries: 3,
          preflightCommitment: 'confirmed',
        }
      );

      // 等待交易确认
      await wallet.connection.confirmTransaction({
        signature,
        lastValidBlockHeight,
        blockhash: tx.message.recentBlockhash,
      });

      return signature;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }

  private static getRandomJitoEndpoint(): string {
    const endpoints = {
      mainnet: 'https://jito-mainnet.helius.xyz',
      amsterdam: 'https://amsterdam.mainnet.block-engine.jito.wtf',
      frankfurt: 'https://frankfurt.mainnet.block-engine.jito.wtf',
      ny: 'https://ny.mainnet.block-engine.jito.wtf',
      tokyo: 'https://tokyo.mainnet.block-engine.jito.wtf',
    } as const;
    const keys = Object.keys(endpoints) as (keyof typeof endpoints)[];
    const index = Math.floor(Math.random() * keys.length);
    return endpoints[keys[index]];
  }
}
