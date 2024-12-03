import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Copy, Download, X, Check } from 'lucide-react';

interface Meme {
    id: string;
    imageUrl: string;
}

const mockMemes: Meme[] = [
    { id: '1', imageUrl: 'https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1732023482786-twocatlogo.jpg' },
    { id: '2', imageUrl: 'https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1732023482786-twocatlogo.jpg' },
    { id: '3', imageUrl: 'https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1732023482786-twocatlogo.jpg' },
    { id: '4', imageUrl: 'https://twocat-room-avatars.s3.ap-southeast-1.amazonaws.com/room-avatars/1732023482786-twocatlogo.jpg' },
];

export function MemeGallery() {
    const [memes] = useState<Meme[]>(mockMemes);
    const [selectedMeme, setSelectedMeme] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopyLink = async (meme: Meme) => {
        try {
            await navigator.clipboard.writeText(meme.imageUrl);
            setCopiedId(meme.id);
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

    return (
        <div className="min-h-screen bg-discord-primary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16">
                <h1 className="text-2xl font-bold mb-6">社区 Meme 图库</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {memes.map((meme) => (
                        <motion.div
                            key={meme.id}
                            className="bg-discord-secondary rounded-lg overflow-hidden shadow-lg group relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <img
                                src={meme.imageUrl}
                                alt="meme"
                                className="w-full aspect-square object-cover"
                            />
                            {/* 悬浮时显示的操作按钮 */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
                                          transition-opacity duration-200 flex items-center justify-center gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 bg-discord-primary/80 rounded-lg hover:bg-discord-primary 
                                             transition-colors duration-200"
                                    onClick={() => setSelectedMeme(meme.imageUrl)}
                                >
                                    <Maximize2 className="h-5 w-5 text-[#53b991]" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 bg-discord-primary/80 rounded-lg hover:bg-discord-primary 
                                             transition-colors duration-200"
                                    onClick={() => handleCopyLink(meme)}
                                >
                                    <AnimatePresence mode="wait">
                                        {copiedId === meme.id ? (
                                            <motion.div
                                                key="check"
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <Check className="h-5 w-5 text-[#53b991]" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="copy"
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <Copy className="h-5 w-5 text-[#53b991]" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 bg-discord-primary/80 rounded-lg hover:bg-discord-primary 
                                             transition-colors duration-200"
                                    onClick={() => handleDownload(meme.imageUrl)}
                                >
                                    <Download className="h-5 w-5 text-[#53b991]" />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 图片预览模态框 */}
            <AnimatePresence>
                {selectedMeme && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
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
                                className="absolute top-4 right-4 p-2 bg-discord-primary/80 rounded-lg 
                                         hover:bg-discord-primary transition-colors duration-200"
                                onClick={() => setSelectedMeme(null)}
                            >
                                <X className="h-5 w-5 text-[#53b991]" />
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
        </div>
    );
}