import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface UploadMemeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
}

export function UploadMemeModal({ isOpen, onClose, onUpload }: UploadMemeModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFile) {
            onUpload(selectedFile);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-[#2f3136] border border-[#1a1b1e] rounded-lg max-w-md w-full relative overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* 模态框顶部装饰条 */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#53b991] via-[#3e8d6d] to-[#53b991] 
                                      animate-gradient-x"></div>

                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">提交 Meme 图片</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-[#40444b] rounded-lg transition-colors duration-200"
                                >
                                    <X className="h-5 w-5 text-[#53b991]" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* 拖放区域 */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                                              transition-colors duration-200 group
                                              ${previewUrl ? 'border-[#53b991]' : 'border-gray-600 hover:border-[#53b991]'}`}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/*"
                                        className="hidden"
                                    />

                                    {previewUrl ? (
                                        <div className="relative">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="max-h-48 mx-auto rounded-lg"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
                                                          transition-opacity duration-200 flex items-center justify-center">
                                                <p className="text-white text-sm">点击更换图片</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">
                                            <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                                            <p className="text-sm">点击或拖拽图片到此处上传</p>
                                            <p className="text-xs mt-2">支持 JPG、PNG 格式</p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={!selectedFile}
                                    className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2
                                              transition-all duration-200 ${selectedFile
                                            ? 'bg-[#53b991] hover:bg-[#53b991]/90 text-white'
                                            : 'bg-[#40444b] text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Upload className="h-5 w-5" />
                                    提交图片
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}