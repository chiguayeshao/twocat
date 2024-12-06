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

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json({ error: "房间ID不能为空" }, { status: 400 });
    }

    const body = await request.json();
    const { volume, userAddress } = body;

    if (!volume || !userAddress) {
      return NextResponse.json(
        { error: "交易量和用户地址不能为空" },
        { status: 400 }
      );
    }

    const response = await fetchWithRetry(
      `${BACKEND_API_URL}/rooms/${roomId}/update-volume`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          volume,
          userAddress,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Update volume error:", error);
    return NextResponse.json(
      { error: "更新交易量失败" },
      { status: 500 }
    );
  }
} 