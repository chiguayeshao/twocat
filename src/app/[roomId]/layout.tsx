import { Metadata } from 'next';
import { Room, Treasury, CommunityLevel } from '@/types/room';

async function getRoomData(roomId: string | undefined) {
  if (!roomId) return null;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/twocat-core/rooms?roomId=${roomId}`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch room info');
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to load room info:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ roomId: string }> | { roomId: string };
}): Promise<Metadata> {
  // 等待 params 解析完成
  const resolvedParams = await Promise.resolve(params);
  const roomId = resolvedParams.roomId;
  
  const data = await getRoomData(roomId);
  console.log(data);
  const room = data?.room;
  
  const title = room?.roomName || '未知房间';
  const description = room?.description || '暂无描述';
  const imageUrl = room?.avatarUrl || '/default-room-image.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

interface RoomLayoutProps {
  children: React.ReactNode;
  params: { roomId: string };
}

export default async function RoomLayout({
  children,
  params,
}: RoomLayoutProps) {
  return <>{children}</>;
} 