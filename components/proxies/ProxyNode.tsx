'use client';

import { Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ProxyNodeProps {
    name: string;
    type: string;
    delay?: number;
    isActive?: boolean;
    onClick?: () => void;
}

export function ProxyNode({ name, type, delay, isActive, onClick }: ProxyNodeProps) {
    const getDelayColor = (ms?: number) => {
        if (!ms) return 'text-gray-500';
        if (ms < 100) return 'text-green-400';
        if (ms < 300) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={clsx(
                "relative flex flex-col p-4 rounded-xl border transition-all duration-200 w-full text-left group overflow-hidden",
                isActive
                    ? "bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/10"
                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
            )}
        >
            {isActive && (
                <motion.div
                    layoutId="active-glow"
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent pointer-events-none"
                />
            )}

            <div className="flex justify-between items-start w-full relative z-10 mb-2">
                <span className={clsx(
                    "text-xs font-bold px-2 py-0.5 rounded uppercase",
                    isActive ? "bg-blue-500 text-white" : "bg-white/10 text-gray-400"
                )}>
                    {type}
                </span>
                {delay !== undefined && (
                    <div className="flex items-center gap-1 text-xs font-mono">
                        <span className={getDelayColor(delay)}>{delay}ms</span>
                        <Wifi className={clsx("w-3 h-3", getDelayColor(delay))} />
                    </div>
                )}
            </div>

            <div className="relative z-10 w-full">
                <h4 className={clsx(
                    "font-medium truncate text-sm mb-1",
                    isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                )}>
                    {name}
                </h4>
            </div>
        </motion.button>
    );
}
