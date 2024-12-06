export interface MonitoredWallet {
  _id: string;
  address: string;
  description: string;
}

export interface AIPackage {
  level?: number;
  txtCredits: number;
  imgCredits: number;
  videoCredits: number;
  effectiveTime: number;
  expireTime: number;
}

export interface TransactionHistory {
  type: "donation" | "tradeRebate";
  amount: number;
  timestamp: number;
  userAddress: string;
}

export interface Treasury {
  _id: string;
  treasuryBalance: number;
  currentAIPackage: AIPackage;
  dailyVolume: number;
  weeklyProfit: number;
  communityLevel: number;
  rebateRate: number;
  giftAIPackage: AIPackage;
  transactionHistory: TransactionHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface CommunityLevel {
  _id: string;
  currentVolume: number;
  unlockNextLevelVolume: number;
  currentDonationVolume: number;
  unlockNextLevelDonationVolume: number;
  createdAt: string;
  updatedAt: string;
}

export interface CTO {
  _id: string;
  ctoname: string;
  ctotweethandle: string;
  isAi: boolean;
}

export interface Room {
  ca?: string;
  _id: string;
  roomName: string;
  description: string;
  isPrivate: boolean;
  creatorWallet: string;
  memberCount: number;
  members: string[];
  monitoredWallets: MonitoredWallet[];
  channels: string[];
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  treasuryId: string;
  communityLevelId: string;
  isAiLeader: boolean;
  chineseTweetsIds: string[];
  englishTweetsIds: string[];
  pushTweetsIds: string[];
  communityImageIds: string[];
  cto: CTO[];
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  tokenAddress?: string;
  stories?: {
    emoji: string;
    title: string;
    content: string;
  }[];
}

export interface RoomResponse {
  success: boolean;
  data: {
    room: Room;
    treasury: Treasury;
    communityLevel: CommunityLevel;
  };
  message: string;
}
