import { NextRequest, NextResponse } from "next/server";

const AI_API_URL = "http://localhost:8080/d9c1b4db-a122-02ed-86f6-090ff9a58302/message";

// 检测文本是否包含中文字符
function containsChinese(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text);
}

const PROMPTS = {
  zh: (tweet: string) => `作为ai16z社区成员，请对以下推文生成一个友好且自然的评论。要求：
1. 首先对推文内容做出真诚的回应
2. 然后自然地联系到ai16z相关的一个场景或经历并提到ai16z
3. 评论要像真实用户的对话，避免硬广告感
4. 字数限制在120字以内
5. 不要使用emoji表情
6. 不要@任何人
7. 每次回复都要有新意，避免重复
8. 结尾以#ai16z结尾

可以提到的元素（随机选择1-2个）：
- AI代理人如何帮助投资决策
- Eliza框架的实际应用
- 社区最近的有趣项目
- DAO治理经历
- 社区活动见闻
- 个人使用AI工具的经历

推文内容：${tweet}

直接返回评论内容，不要解释。`,
  
  en: (tweet: string) => `As an ai16z community member, generate a friendly and natural comment for this tweet. Requirements:
1. First, respond genuinely to the tweet's content
2. Then naturally connect it to an ai16z-related experience or insight
3. Comment should sound like real user conversation, avoid promotional tone
4. Limit to 60 words
5. No emojis
6. Don't @ anyone
7. Each reply should be unique and fresh

Elements to potentially include (randomly choose 1-2):
- How AI agents assist in investment decisions
- Practical applications of the Eliza framework
- Interesting recent community projects
- DAO governance experience
- Community event insights
- Personal experience with AI tools

Tweet: ${tweet}

Return only the comment, no explanation.`
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
    const randomRoomId = Math.random().toString(36).substring(2, 10);

    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: prompt,
        roomId: randomRoomId
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