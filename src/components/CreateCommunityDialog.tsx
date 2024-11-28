'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Upload } from 'lucide-react';
import Image from 'next/image';

interface CreateCommunityDialogProps {
    onSubmit?: (data: {
        name: string;
        description: string;
        avatarFile: File | null;
    }) => Promise<void>;
}

export function CreateCommunityDialog({ onSubmit }: CreateCommunityDialogProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description || !avatarFile) return;

        setIsSubmitting(true);
        try {
            await onSubmit?.({
                name,
                description,
                avatarFile,
            });
            setOpen(false);
            // 重置表单
            setName('');
            setDescription('');
            setAvatarFile(null);
            setAvatarPreview(null);
        } catch (error) {
            console.error('提交失败:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#53b991] to-[#9ad499] hover:opacity-90 transition-opacity">
                    <Sparkles className="w-4 h-4 mr-2" />
                    创建社区
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#2f2f2f] border-[#53b991]/20">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#53b991]">创建新社区</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* 头像上传 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">社区头像</label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-lg bg-[#1f1f1f] border-2 border-dashed border-[#53b991]/30 flex items-center justify-center overflow-hidden">
                                {avatarPreview ? (
                                    <Image
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <Upload className="w-6 h-6 text-gray-400" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <div className="text-sm text-gray-400">
                                <p>点击上传图片</p>
                                <p>建议尺寸 400x400</p>
                            </div>
                        </div>
                    </div>

                    {/* 社区名称 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">社区名称</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="输入社区名称"
                            className="bg-[#1f1f1f] border-[#53b991]/30 focus:border-[#53b991] text-white"
                            required
                        />
                    </div>

                    {/* 社区简介 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">社区简介</label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="描述你的社区..."
                            className="bg-[#1f1f1f] border-[#53b991]/30 focus:border-[#53b991] text-white min-h-[100px]"
                            required
                        />
                    </div>

                    {/* 提交按钮 */}
                    <Button
                        type="submit"
                        disabled={isSubmitting || !name || !description || !avatarFile}
                        className="w-full bg-gradient-to-r from-[#53b991] to-[#9ad499] hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isSubmitting ? '创建中...' : '创建社区'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}