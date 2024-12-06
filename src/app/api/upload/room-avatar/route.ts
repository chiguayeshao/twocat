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
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "文件不能为空" }, { status: 400 });
    }

    // 将文件转发到后端 API
    const backendFormData = new FormData();
    backendFormData.append("file", file);

    const response = await fetchWithRetry(
      `${BACKEND_API_URL}/upload/room-avatar`,
      {
        method: "POST",
        body: backendFormData,
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Upload room avatar error:", error);
    return NextResponse.json({ error: "上传头像失败" }, { status: 500 });
  }
}
