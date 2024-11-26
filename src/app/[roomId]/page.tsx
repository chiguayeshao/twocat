'use client';

import { BaseLayout } from '@/components/layout/BaseLayout';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Room {
  _id: string;
  roomName: string;
  description: string;
  isPrivate: boolean;
  creatorWallet: string;
  memberCount: number;
  members: string[];
  monitoredWallets: {
    _id: string;
    address: string;
    description: string;
  }[];
  channels: string[];
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <BaseLayout roomId={roomId}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {loading ? '加载中...' : room?.roomName || '未知房间'}
          </h1>
          <p className="text-muted-foreground">
            {loading ? '加载中...' : room?.description || '暂无描述'}
          </p>
        </div>
      </div>
    </BaseLayout>
  );
}
