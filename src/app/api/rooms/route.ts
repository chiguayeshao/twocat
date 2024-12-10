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

    console.log("Request body:", body);

    const requestBody = {
      name: body.name,
      description: body.description,
      avatarUrl: body.avatarUrl,
      creatorWalletAddress: body.creatorWalletAddress,
      isPrivate: body.isPrivate ?? false,
      website: body.website,
      twitter: body.twitter,
      telegram: body.telegram,
      discord: body.discord,
      ca: body.ca,
      cto: body.cto,
      communityStory: {
        title: body.communityStory.title,
        slogan: body.communityStory.slogan,
        description: body.communityStory.description,
        questionAndAnswer: body.communityStory.questionAndAnswer,
      },
    };

    console.log("Sending to backend:", requestBody);

    const response = await fetchWithRetry(`${BACKEND_API_URL}/rooms/pending`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error details:", errorData);
      throw new Error(
        `Backend API responded with status: ${
          response.status
        }, details: ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Create room error:", error);
    return NextResponse.json(
      { error: "创建房间失败", details: (error as Error).message },
      { status: 500 }
    );
  }
}
