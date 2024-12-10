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
    const body = await request.json();
    const { roomId, walletAddress } = body;

    if (!roomId || !walletAddress) {
      return NextResponse.json(
        {
          success: false,
          code: "INVALID_PARAMS",
          message: "房间ID和钱包地址不能为空",
        },
        { status: 400 }
      );
    }

    const response = await fetchWithRetry(`${BACKEND_API_URL}/rooms/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId,
        walletAddress,
      }),
    });

    const data = await response.json();

    // 处理已经是社区成员的情况
    if (
      response.status === 400 &&
      data.message === "User is already a member of this room"
    ) {
      return NextResponse.json(
        {
          success: false,
          code: "ALREADY_MEMBER",
          message: "您已经是社区成员了",
        },
        { status: 200 }
      ); // 返回 200 因为这不是真正的错误
    }

    // 处理其他 400 错误
    if (response.status === 400) {
      return NextResponse.json(
        {
          success: false,
          code: "BAD_REQUEST",
          message: data.message || "请求参数错误",
        },
        { status: 400 }
      );
    }

    // 处理其他错误状态
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          code: "SERVER_ERROR",
          message: "服务器处理请求失败",
        },
        { status: response.status }
      );
    }

    // 成功加入社区
    return NextResponse.json({
      success: true,
      code: "SUCCESS",
      message: "成功加入社区",
      data: data,
    });
  } catch (error) {
    console.error("Join room API error:", error);
    return NextResponse.json(
      {
        success: false,
        code: "INTERNAL_ERROR",
        message: "加入社区失败，请稍后重试",
      },
      { status: 500 }
    );
  }
}
