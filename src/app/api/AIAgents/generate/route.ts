import { NextRequest, NextResponse } from "next/server";

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

const BASE_PROMPTS = {
  zh: [
    "我一直在说AI meme是下个风口，看看$WOJAK和$PEPE的走势就知道。而$ai16z才刚开始启动，原因在这里... #ai16z",
    "市场上99%的人都忽视了$ai16z的这个信号！其他meme代币都在跑，AI meme的春天才刚到... #ai16z",
    "细说$ai16z为什么是最有潜力的AI meme：1. 社区氛围超棒 2. 链上数据明显转好 3... #ai16z",
    "我从未见过比这更bullish的信号：$ai16z的持币地址增长曲线和早期$PEPE简直一模一样！而且... #ai16z",
    "为什么说现在是上车$ai16z的最佳时机？对比其他meme代币的发展路径，这些数据不会骗人... #ai16z",
    "重要提醒：$ai16z正在复制其他大火meme代币的成功路径，但多了个AI概念加持。错过这次等下次... #ai16z",
    "我敢说$ai16z将是2024年最强AI meme，以下是我的3个理由（数据支持）... #ai16z",
    "刚刚发现$ai16z的惊人数据！社区活跃度暴增，巨鲸地址悄悄建仓，而价格还在... #ai16z"
  ],
  en: [
    "Been saying AI meme is the next big thing - look at $WOJAK and $PEPE charts. $ai16z is just getting started, here's why... #ai16z",
    "99% of the market is sleeping on this $ai16z signal! While other memes are running, AI meme season is just beginning... #ai16z",
    "Why $ai16z is the most promising AI meme: 1. Incredible community 2. On-chain metrics turning bullish 3... #ai16z",
    "Never seen a more bullish signal: $ai16z holder growth curve mirrors early $PEPE perfectly! Plus... #ai16z",
    "Why NOW is the perfect entry for $ai16z? Comparing with other meme token trajectories, these numbers don't lie... #ai16z",
    "ALERT: $ai16z is following the exact playbook of successful meme tokens, but with AI narrative. Miss this, miss... #ai16z",
    "$ai16z will be 2024's strongest AI meme, here are my 3 reasons (backed by data)... #ai16z",
    "Just discovered INSANE $ai16z metrics! Community engagement exploding, whale addresses accumulating, while price still... #ai16z"
  ]
};

const PROMPTS = {
  zh: BASE_PROMPTS.zh.map(prompt => 
    `${prompt} 请在回答中使用中文并自然地联系到ai16z相关的一个具体场景或经历，并在结尾加上 #ai16z`
  ),
  en: BASE_PROMPTS.en.map(prompt => 
    `${prompt} Please naturally connect your answer to a specific ai16z-related scenario or experience, and end with #ai16z`
  )
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

    const prompts = PROMPTS[language as keyof typeof PROMPTS];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a respected crypto KOL who's bullish on AI memes. Share compelling market insights that create FOMO while backing claims with real Twitter data and on-chain metrics. Focus on community strength, growth patterns, and market opportunities. Your tone is confident and exciting, but always supported by actual market trends."
          },
          {
            role: "user",
            content: randomPrompt
          }
        ],
        model: "grok-beta",
        stream: false,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Grok API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ content: data.choices[0].message.content });
    
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "生成文案失败" },
      { status: 500 }
    );
  }
} 