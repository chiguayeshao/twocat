export interface CommunityData {
    name: string;
    avatar: string | null;
    creatorWallet: string;
    description: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    contractAddress: string;
    ctos: {
        tweetName: string;
        tweetHandle: string;
    }[];
    communityStory?: {
        title: string;
        slogan: string;
        description: string;
        qas: {
            question: string;
            answers: string[];
        }[];
    };
}