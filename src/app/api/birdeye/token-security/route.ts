import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://public-api.birdeye.so';
const API_KEY = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || '';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { success: false, error: 'Address is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/defi/token_security?address=${address}`,
      {
        headers: {
          'X-API-KEY': API_KEY,
          'x-chain': 'solana',
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `API error: ${response.status}` },
        { status: response.status }
      );
    }
    console.log(response, 'response');
    console.log(response.status, 'response status');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Birdeye API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
