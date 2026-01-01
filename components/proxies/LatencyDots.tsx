'use client';

import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface Proxy {
    name: string;
    delay: number;
}

interface LatencyDotsProps {
    proxies: Proxy[];
    maxDots?: number;
}

export function LatencyDots({ proxies, maxDots = 50 }: LatencyDotsProps) {
    const getDelayColor = (ms: number) => {
        if (!ms || ms === 0) return 'bg-gray-400 dark:bg-gray-600';
        if (ms < 100) return 'bg-emerald-500';
        if (ms < 300) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    const displayProxies = proxies.slice(0, maxDots);
    const hasMore = proxies.length > maxDots;

    return (
        <div className="flex flex-wrap gap-1 mt-2">
            {displayProxies.map((proxy, index) => (
                <motion.div
                    key={`${proxy.name}-${index}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    className={clsx(
                        "w-1.5 h-1.5 rounded-full shadow-sm",
                        getDelayColor(proxy.delay)
                    )}
                    title={`${proxy.name}: ${proxy.delay > 0 ? `${proxy.delay}ms` : 'Timeout'}`}
                />
            ))}
            {hasMore && (
                <span className="text-[8px] text-gray-400 font-mono">+{proxies.length - maxDots}</span>
            )}
        </div>
    );
}
