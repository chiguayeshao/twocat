import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // 禁用缓存，确保获取最新数据
    });

    if (!response.ok) {
      console.error("获取社区列表失败:", response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Backend API responded with status: ${
          response.status
        }, details: ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();

    // 确保返回的数据格式与后端一致
    return NextResponse.json({
      success: true,
      data: data.data, // 包含 rooms 数组
      message: data.message || "获取社区列表成功",
    });
  } catch (error) {
    console.error("获取社区列表错误:", error);
    return NextResponse.json(
      {
        success: false,
        error: "获取社区列表失败",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
