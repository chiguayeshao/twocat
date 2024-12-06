import { NextRequest, NextResponse } from "next/server";

const AI_API_URL = "http://localhost:8080/d9c1b4db-a122-02ed-86f6-090ff9a58302/message";

const BASE_PROMPTS = {
  zh: [
    "作为ai16z社区的一员，分享一下你对AI投资决策的看法。你可以谈谈最近社区讨论的一个AI项目，或者分享一个有趣的投资观点。记住用轻松自然的语气。",
    "假设你正在参加ai16z的线下meetup，讨论Eliza框架的最新进展。用日常对话的方式分享你的见解和体验，可以谈谈你是如何使用Eliza框架的。",
    "作为$ai16z代币持有者，聊聊你参与DAO治理的经历。可以分享一个你最近投票的提案，或者谈谈你对社区未来发展的想法。语气要自然随意。",
    "分享一个你在ai16z社区学到的有趣经历。可以是参与项目评估的过程，或是与其他社区成员协作开发AI工具的故事。用轻松的方式讲述。",
    "假设你刚刚用AI完成了一笔成功的投资，分享一下这个过程中的趣事和感受。可以聊聊AI给出的分析是如何帮助你做决策的。保持对话格自然。",
    "作为ai16z的早期社区成员，回忆一下你是如何认识Shaw的，以及为什么会被这个项目吸引。分享一个你印象深刻的时刻或故事。",
    "假设你正在向一个朋友介绍ai16z的投资理念。用通俗易懂的方式解释AI代理人是如何做出投资决策的，以及为什么这种方式可能比传统VC更有优势。",
    "分享一个你使用ai16z平台投资失败的经历。讲讲你从中学到了什么，以及AI分析工具如何帮助你在之后避免类似的错误。保持诚实和自然。",
    "想象你正在参与ai16z的一个新项目评估。描述一下AI代理是如何分析这个项目的，以及你作为社区成员如何参与决策过程。",
    "聊聊你对ai16z代币经济模型的看法。作为代币持有者，分享一下你对治理机制的体验，以及你认为可以改进的地方。用轻松的语气表达。",
    "描述一下你最近参与的一个ai16z社区活动。可以是线上讨论、代码贡献，或者是参与新框架的测试。分享你的收获和感受。",
    "假设你刚刚用Eliza框架开发了一个有趣的AI应用。分享一下开发过程中的趣事，以及社区是如何帮助你克服困难的。",
    "作为ai16z社区成员，聊聊你对AI和加密货币结合的看法。可以分享一个具体的案例，说明为什么这种结合会带来创新。"
  ],
  en: [
    "As a member of ai16z community, share your thoughts on AI-driven investment decisions. You could talk about a recent AI project discussed in the community or share an interesting investment insight. Keep it casual and authentic.",
    "Imagine you're at an ai16z meetup discussing the latest developments in the Eliza framework. Share your insights and experiences in a conversational way, perhaps how you've been using the framework.",
    "As a $ai16z token holder, tell us about your experience with DAO governance. Share a recent proposal you voted on or your thoughts on the community's future.",
    "Share an interesting experience you've had in the ai16z community. It could be about participating in project evaluations or collaborating with other members on AI tools.",
    "Imagine you've just completed a successful investment using AI. Share the interesting moments and your feelings about the process.",
    "As an early member of ai16z, recall how you first met Shaw and what attracted you to this project.",
    "Imagine explaining ai16z's investment philosophy to a friend.",
    "Share a story about an investment that didn't work out on the ai16z platform.",
    "Picture yourself participating in a new project evaluation at ai16z.",
    "Share your thoughts on ai16z's token economics.",
    "Describe a recent ai16z community event you participated in.",
    "Imagine you've just developed an interesting AI application using the Eliza framework.",
    "As an ai16z community member, share your views on the intersection of AI and crypto."
  ]
};

const PROMPTS = {
  zh: BASE_PROMPTS.zh.map(prompt => 
    `${prompt} 请在回答中自然地联系到ai16z相关的一个具体场景或经历，并在结尾加上 #ai16z`
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

    const randomRoomId = Math.random().toString(36).substring(2, 10);

    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: randomPrompt,
        roomId: randomRoomId
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