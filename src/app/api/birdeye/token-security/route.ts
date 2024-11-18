import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "缺少代币地址参数" }, { status: 400 });
    }

    const response = await fetch(
      `${BACKEND_API_URL}/tokens/security?address=${address}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Token security API error:", error);
    return NextResponse.json(
      { error: "获取代币安全信息失败" },
      { status: 500 }
    );
  }
}
