'use client';

import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UnifiedWalletButton, useWallet } from '@jup-ag/wallet-adapter';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface CommunityBasicInfoProps {
    data: {
        name: string;
        avatar: string | null;
        avatarPreview?: string | null;
        creatorWallet: string;
    };
    onChange: (field: string, value: any) => void;
}

export function CommunityBasicInfo({ data, onChange }: CommunityBasicInfoProps) {
    const [uploading, setUploading] = useState(false);
    const { connected, publicKey } = useWallet();

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file instanceof File) {
            setUploading(true);
            try {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/upload/room-avatar", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("上传失败");
                }

                const { data, success } = await response.json();

                if (success && data.url) {
                    onChange('avatar', data.url);
                } else {
                    throw new Error("上传失败");
                }
            } catch (error) {
                console.error('上传失败:', error);
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">社区头像</label>
                <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-lg bg-[#1f1f1f] border-2 border-dashed border-[#53b991]/30 flex items-center justify-center overflow-hidden">
                        {data.avatar ? (
                            <Image src={data.avatar} alt="Avatar preview" fill className="object-cover" />
                        ) : (
                            <Upload className="w-6 h-6 text-gray-400" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            required={!data.avatar}
                        />
                    </div>
                    <div className="text-sm text-gray-400">
                        <p>点击{data.avatar ? '更换' : '上传'}图片</p>
                        <p>建议尺寸 400x400</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">社区名称</label>
                <Input
                    value={data.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    placeholder="输入社区名称"
                    maxLength={50}
                    className="bg-[#2f2f2f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                    required
                />
                <p className="text-xs text-gray-500">最多 50 个字符</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">创建者钱包地址</label>
                <div className="p-3 bg-[#2f2f2f] rounded-lg border border-[#53b991]/30 text-gray-300">
                    {publicKey?.toString()}
                </div>
            </div>
        </div>
    );
}