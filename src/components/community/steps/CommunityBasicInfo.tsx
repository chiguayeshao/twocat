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
    const { toast } = useToast();

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file instanceof File) {
            // 检查文件类型
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                toast({
                    title: "文件类型不支持",
                    description: "请上传 JPG、PNG、GIF 或 WebP 格式的图片",
                    variant: "destructive",
                });
                return;
            }

            // 检查文件大小
            if (file.size > MAX_FILE_SIZE) {
                toast({
                    title: "文件太大",
                    description: "请上传小于 10MB 的图片",
                    variant: "destructive",
                });
                return;
            }

            setUploading(true);
            try {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/upload/room-avatar", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    // 根据状态码显示不同的错误信息
                    if (response.status === 413) {
                        throw new Error("文件大小超过服务器限制");
                    }
                    throw new Error("上传失败");
                }

                const { data, success } = await response.json();

                if (success && data.url) {
                    onChange('avatar', data.url);
                    toast({
                        title: "上传成功",
                        description: "社区头像已成功上传",
                        variant: "default",
                    });
                } else {
                    throw new Error("上传失败");
                }
            } catch (error) {
                console.error('上传失败:', error);
                toast({
                    title: "上传失败",
                    description: (error as Error).message || "头像上传失败，请重试",
                    variant: "destructive",
                });
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
                            accept={ALLOWED_FILE_TYPES.join(',')}
                            onChange={handleAvatarChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            required={!data.avatar}
                        />
                    </div>
                    <div className="text-sm text-gray-400">
                        <p>点击{data.avatar ? '更换' : '上传'}图片</p>
                        <p>建议尺寸 400x400</p>
                        <p className="text-xs">支持 JPG、PNG、GIF、WebP，小于 10MB</p>
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