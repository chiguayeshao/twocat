'use client';

import { motion } from 'framer-motion';
import { Twitter, BookOpen, Send } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    const socialLinks = [
        {
            name: 'Twitter',
            icon: <Twitter className="w-5 h-5" />,
            href: 'https://twitter.com/MCGA',
            hoverColor: 'hover:bg-[#53b991]/80'
        },
        {
            name: 'Telegram',
            icon: <Send className="w-5 h-5" />,
            href: 'https://t.me/MCGA',
            hoverColor: 'hover:bg-[#53b991]/80'
        },
        {
            name: 'Gitbook',
            icon: <BookOpen className="w-5 h-5" />,
            href: 'https://docs.mcga.com',
            hoverColor: 'hover:bg-[#53b991]/80'
        }
    ];

    return (
        <footer className="mt-auto border-t border-[#ffffff10] bg-[#1a1b1e]/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Logo & Copyright */}
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-[#53b991] to-[#9ad499] text-transparent bg-clip-text">
                            MCGA
                        </span>
                        <span className="text-sm text-white/60">
                            © 2024 All rights reserved
                        </span>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {socialLinks.map((link) => (
                            <motion.div
                                key={link.name}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative"
                                >
                                    <div className={`p-2 rounded-lg ${link.hoverColor} 
                                                   transition-all duration-200 text-gray-400 shadow-lg
                                                   hover:shadow-[#53b991]/20 hover:shadow-lg`}
                                    >
                                        {link.icon}
                                    </div>
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 
                                                   px-2 py-1 bg-[#2f2f2f] rounded text-xs text-white/80 
                                                   opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                                   whitespace-nowrap">
                                        {link.name}
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}