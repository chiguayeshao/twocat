import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';
const ROOM_ID = process.env.ROOM_ID;

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
  throw new Error('Maximum retries reached');
}

export async function GET() {
  try {
    const response = await fetchWithRetry(
      `${BACKEND_API_URL}/rooms/${ROOM_ID}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Room API error:', error);
    return NextResponse.json({ error: '获取房间信息失败' }, { status: 500 });
  }
}
