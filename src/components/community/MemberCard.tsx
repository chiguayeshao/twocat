'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface MemberCardProps {
    avatar: string;
    name: string;
    role: string;
    contribution: string;
}

export function MemberCard({ avatar, name, role, contribution }: MemberCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/5 rounded-xl p-4 border border-white/10"
        >
            <div className="relative w-20 h-20 mx-auto mb-4">
                <Image
                    src={avatar}
                    alt={name}
                    fill
                    className="rounded-full object-cover"
                />
            </div>
            <div className="text-center">
                <h4 className="text-white/90 font-bold">{name}</h4>
                <div className="text-white/60 text-sm mb-2">{role}</div>
                <div className="text-white/40 text-xs">{contribution}</div>
            </div>
        </motion.div>
    );
}