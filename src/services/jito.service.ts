import { Connection, VersionedTransaction, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

interface WalletAdapter {
  publicKey: PublicKey;
  signTransaction: (
    transaction: VersionedTransaction
  ) => Promise<VersionedTransaction>;
  connection: Connection;
}

export class JitoService {
  private static readonly HELIUS_ENDPOINT =
    "https://rpc-proxy.twocatteam.workers.dev/";

  private static readonly JITO_ENDPOINT =
    "https://mainnet.block-engine.jito.wtf";

  private static async makeRequest(url: string, payload: any) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Jito API 错误: ${errorText}`);
        throw new Error(`Jito API 请求失败: ${res.status}`);
      }

      const json = await res.json();
      if (json.error) {
        console.error("Jito API 返回错误:", json.error);
        throw new Error(json.error.message || "未知错误");
      }

      return json;
    } catch (error) {
      console.error("Jito API 请求失败:", error);
      throw error;
    }
  }

  public static async sendTransaction(
    transaction: string,
    lastValidBlockHeight: number,
    wallet: WalletAdapter
  ): Promise<string> {
    try {
      // 使用 Helius 获取最新区块信息
      const heliusConnection = new Connection(this.HELIUS_ENDPOINT, {
        commitment: "confirmed",
        confirmTransactionInitialTimeout: 12000,
      });

      const { blockhash, lastValidBlockHeight: newLastValidBlockHeight } =
        await heliusConnection.getLatestBlockhash("confirmed");

      // 解码并更新交易
      const tx = VersionedTransaction.deserialize(
        Buffer.from(transaction, "base64")
      );
      tx.message.recentBlockhash = blockhash;

      // 签名交易
      const signedTx = await wallet.signTransaction(tx);
      const serializedTx = signedTx.serialize();

      // 使用 Jito API 发送交易
      const encodedTx = bs58.encode(serializedTx);
      const payload = {
        jsonrpc: "2.0",
        id: 1,
        method: "sendTransaction",
        params: [encodedTx],
      };

      const url = `${this.JITO_ENDPOINT}/api/v1/transactions?bundleOnly=true`;
      console.log(`发送交易到 Jito: ${encodedTx.slice(0, 20)}...`);

      const response = await this.makeRequest(url, payload);
      const signature = response.result; // 假设返回的是签名

      // 使用 Helius 确认交易
      const confirmation = await heliusConnection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight: newLastValidBlockHeight,
          abortSignal: AbortSignal.timeout(10000), // 10秒超时
        },
        "confirmed"
      );

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }

      return signature;
    } catch (error) {
      console.error("交易失败:", error);
      throw error;
    }
  }
}
