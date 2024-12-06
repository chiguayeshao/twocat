'use client';

import { motion } from 'framer-motion';

interface StatsCardProps {
    title: string;
    value: string;
    icon: string;
    change: string;
}

export function StatsCard({ title, value, icon, change }: StatsCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 transition-colors hover:bg-white/10"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/60 text-sm font-medium">{title}</h3>
                <div className="text-2xl">{icon}</div>
            </div>

            <div className="space-y-2">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
                    {value}
                </div>
                <div className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {change}
                </div>
            </div>
        </motion.div>
    );
}