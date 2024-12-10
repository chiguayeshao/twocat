import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3000";

async function fetchWithRetry(url: string, options: RequestInit, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }
  throw new Error("Maximum retries reached");
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const roomId = searchParams.get("roomId");
    const walletAddress = searchParams.get("walletAddress");

    if (!roomId || !walletAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "房间ID和钱包地址不能为空",
        },
        { status: 400 }
      );
    }

    const response = await fetchWithRetry(
      `${BACKEND_API_URL}/rooms/check-membership/${roomId}/${walletAddress}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Check membership API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "检查成员身份失败",
      },
      { status: 500 }
    );
  }
}
