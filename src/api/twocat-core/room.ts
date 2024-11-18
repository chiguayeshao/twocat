const API_BASE_URL = "http://localhost:3000";

export interface MonitoredWallet {
  _id: string;
  address: string;
  description: string;
}

export interface Room {
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
}

interface RoomResponse {
  success: boolean;
  data: Room;
  message: string;
}

export async function fetchRoomInfo(roomId: string): Promise<Room> {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem("token")}`, // 假设token存储在localStorage中
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXRfYWRkcmVzcyI6IjVIWjM0ZEx1a2syR2lDY3ZVSDZQakRmTDk2OXJIb3cyNVBvRmpBdGcxMW9FIiwicm9sZSI6Im93bmVyIiwibm9uY2UiOiIzMGMxODBkM2EzOTBjMmQ5YTA1YzE5ODBkMDA1MmFjNF8xNzMxODYxNjAwNDgwIiwiaWF0IjoxNzMxODYxNjQxLCJqdGkiOiJiYWI2MWQwYjA4NGVlMmY3YWQzNzhmZThlNWYzZjE4MiIsImV4cCI6MTczMTk0ODA0MX0.ia7zZxWzoq-6aRRSrh1W1ykbuWPg6OrKzvAWdA9SM_c`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = (await response.json()) as RoomResponse;
    return result.data;
  } catch (error) {
    console.error("获取房间信息失败:", error);
    throw error;
  }
}
