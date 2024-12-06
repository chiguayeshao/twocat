import { NextRequest, NextResponse } from "next/server";

const AI_API_URL = "http://localhost:8080/09f530bb-1fb7-0fde-a801-fc5ab3deac69/message";

// 检测文本是否包含中文字符
function containsChinese(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text);
}

const PROMPTS = {
  zh: (tweet: string) => `作为ai16z社区的一员，请对以下推文生成一个友好、专业且自然的中文评论。跟上次文案不一样，不要带主观回复，限制在100字以内,不要出现名字和@，要有泛用性。

推文内容：${tweet}

只需要直接返回评论内容，不要加任何额外的解释。`,
  
  en: (tweet: string) => `As a member of the ai16z community, please generate a friendly, professional and natural comment for this tweet. The comment should demonstrate understanding of Web3 and AI without being too technical. Keep a casual tone, make it different from previous comments, limit to 50 words, and only comment on this tweet's content without repeating it.

Tweet: ${tweet}

Return only the comment, without any additional explanation.`
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tweet } = body;

    if (!tweet) {
      return NextResponse.json(
        { error: "缺少推文内容" },
        { status: 400 }
      );
    }

    // 自动检测语言
    const language = containsChinese(tweet) ? "zh" : "en";
    const prompt = PROMPTS[language](tweet);

    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: prompt
      })
    });

    if (!response.ok) {
      throw new Error(`AI API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ content: data[0].text });
    
  } catch (error) {
    console.error("AI comment generation error:", error);
    return NextResponse.json(
      { error: "生成评论失败" },
      { status: 500 }
    );
  }
} 