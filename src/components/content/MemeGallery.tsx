import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Copy, Download, X, Check, Plus } from 'lucide-react';
import { UploadMemeModal } from '@/components/meme/UploadMemeModal';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from '@/hooks/use-toast';

interface Meme {
    _id: string;
    imageLink: string;
    creator: string;
    roomId: string;
    createdAt: string;
    updatedAt: string;
}

export function MemeGallery({ roomId }: { roomId: string }) {
    const { connected, publicKey } = useWallet();
    const { toast } = useToast();
    const [memes, setMemes] = useState<Meme[]>([]);
    const [selectedMeme, setSelectedMeme] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchMemes = async () => {
            try {
                const response = await fetch(`/api/rooms/community-images?roomId=${roomId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch memes');
                }
                const data = await response.json();
                if (data.success && data.data) {
                    setMemes(data.data);
                }
            } catch (err) {
                setError('Failed to load memes');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMemes();
    }, []);

    const handleCopyLink = async (meme: Meme) => {
        try {
            await navigator.clipboard.writeText(meme.imageLink);
            setCopiedId(meme._id);
            setTimeout(() => {
                setCopiedId(null);
            }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    };

    const handleDownload = async (imageUrl: string) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `meme-${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('下载失败:', err);
        }
    };

    const handleUpload = async (file: File) => {
        if (!connected || !publicKey) {
            toast({
                title: "请先连接钱包",
                description: "上传图片需要先连接钱包",
                variant: "destructive",
            });
            setIsUploadModalOpen(false);
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const uploadResponse = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload image');
            }

            const uploadResult = await uploadResponse.json();

            if (!uploadResult.success) {
                throw new Error(uploadResult.message || 'Failed to upload image');
            }

            const response = await fetch(`/api/rooms/community-images?roomId=${roomId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    creator: publicKey.toString(),
                    imageLink: uploadResult.data.url
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create community image');
            }

            const result = await response.json();

            if (result.success) {
                const updatedResponse = await fetch(`/api/rooms/community-images?roomId=${roomId}`);
                const updatedData = await updatedResponse.json();
                if (updatedData.success && updatedData.data) {
                    setMemes(updatedData.data);
                }

                toast({
                    title: "上传成功",
                    description: "图片已成功添加到社区",
                    variant: "success",
                });
                setIsUploadModalOpen(false);
            }
        } catch (err) {
            console.error('Upload failed:', err);
            toast({
                title: "上传失败",
                description: "请稍后重试",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-discord-primary text-white">
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-[#53b991]">加载中...</div>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-red-500">{error}</div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6">
                        <h1 className="text-xl sm:text-2xl font-bold">社区 Meme 图库</h1>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 rounded-lg
                                     bg-gradient-to-r from-[#53b991]/10 to-[#53b991]/20
                                     border border-[#53b991]/20 hover:border-[#53b991]/30
                                     transition-all duration-300 w-full sm:w-auto"
                            onClick={() => setIsUploadModalOpen(true)}
                        >
                            <Plus className="h-4 w-4 text-[#53b991]" />
                            <span className="text-sm font-medium text-[#53b991]">提交图片</span>
                        </motion.button>
                    </div>
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                        {memes.map((meme) => (
                            <motion.div
                                key={meme._id}
                                className="bg-discord-secondary rounded-lg overflow-hidden shadow-lg group relative"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <img
                                    src={meme.imageLink}
                                    alt="meme"
                                    className="w-full aspect-square object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
                                              sm:transition-opacity sm:duration-200 
                                              touch:opacity-100 flex flex-col justify-between p-3 sm:p-4">
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="flex justify-center gap-3 sm:gap-4">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 bg-discord-primary/80 rounded-lg hover:bg-discord-primary 
                                                         transition-colors duration-200"
                                                onClick={() => setSelectedMeme(meme.imageLink)}
                                            >
                                                <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#53b991]" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 bg-discord-primary/80 rounded-lg hover:bg-discord-primary 
                                                         transition-colors duration-200"
                                                onClick={() => handleCopyLink(meme)}
                                            >
                                                <AnimatePresence mode="wait">
                                                    {copiedId === meme._id ? (
                                                        <motion.div
                                                            key="check"
                                                            initial={{ scale: 0.8, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0.8, opacity: 0 }}
                                                            transition={{ duration: 0.15 }}
                                                        >
                                                            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-[#53b991]" />
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="copy"
                                                            initial={{ scale: 0.8, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0.8, opacity: 0 }}
                                                            transition={{ duration: 0.15 }}
                                                        >
                                                            <Copy className="h-4 w-4 sm:h-5 sm:w-5 text-[#53b991]" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 bg-discord-primary/80 rounded-lg hover:bg-discord-primary 
                                                         transition-colors duration-200"
                                                onClick={() => handleDownload(meme.imageLink)}
                                            >
                                                <Download className="h-4 w-4 sm:h-5 sm:w-5 text-[#53b991]" />
                                            </motion.button>
                                        </div>
                                    </div>
                                    <div className="text-right text-xs sm:text-sm text-[#53b991]">
                                        发布者: {meme.creator.slice(0, 4)}...{meme.creator.slice(-4)}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <AnimatePresence>
                {selectedMeme && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4"
                        onClick={() => setSelectedMeme(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative max-w-4xl w-full max-h-[90vh]"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 
                                         bg-discord-primary/80 rounded-lg 
                                         hover:bg-discord-primary transition-colors duration-200"
                                onClick={() => setSelectedMeme(null)}
                            >
                                <X className="h-4 w-4 sm:h-5 sm:w-5 text-[#53b991]" />
                            </button>
                            <img
                                src={selectedMeme}
                                alt="preview"
                                className="w-full h-full object-contain rounded-lg"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <UploadMemeModal
                isOpen={isUploadModalOpen}
                onClose={() => {
                    if (!isUploading) {
                        setIsUploadModalOpen(false);
                    }
                }}
                onUpload={handleUpload}
                isUploading={isUploading}
            />
        </div>
    );
}