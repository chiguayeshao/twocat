import { NextRequest, NextResponse } from "next/server";

const AI_API_URL = "http://localhost:8080/09f530bb-1fb7-0fde-a801-fc5ab3deac69/message";

const PROMPTS = {
  zh: "我们社区是ai16z,目标是成为web3链上最大的AI社区,用AI来管理基金投资meme币，直接生成一个社区的角度文案，跟上次文案不一样，不要带主观回复，我只想要一个文案",
  en: "Please generate a community-focused English copy for ai16z - we're building the largest AI-powered Web3 community, leveraging AI for meme coin fund management. Provide a fresh, objective perspective that differs from previous content."
};

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") || "zh";

    if (language !== "zh" && language !== "en") {
      return NextResponse.json(
        { error: "不支持的语言类型" },
        { status: 400 }
      );
    }

    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: PROMPTS[language as keyof typeof PROMPTS]
      })
    });

    if (!response.ok) {
      throw new Error(`AI API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ content: data[0].text });
    
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "生成文案失败" },
      { status: 500 }
    );
  }
} 