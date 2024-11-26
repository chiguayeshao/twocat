import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://public-api.birdeye.so/v1";
const API_KEY = process.env.BIRDEYE_API_KEY || "";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");
  const address = searchParams.get("address");

  if (!wallet || !address) {
    return NextResponse.json(
      { success: false, error: "Wallet and address are required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/wallet/token_balance?wallet=${wallet}&token_address=${address}`,
      {
        headers: {
          "X-API-KEY": API_KEY,
          "x-chain": "solana",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Birdeye API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
