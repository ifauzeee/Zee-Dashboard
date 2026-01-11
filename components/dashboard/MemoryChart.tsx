'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { useSystemStats } from '@/components/hooks/useSystemStats';

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function MemoryChart() {
    const { memory } = useSystemStats();
    const [dataPoints, setDataPoints] = useState<{ value: number }[]>(new Array(30).fill({ value: 0 }));

    useEffect(() => {
        if (memory?.current === undefined) return;
        const timeout = setTimeout(() => {
            setDataPoints(prev => {
                const last = prev[prev.length - 1];
                if (last && last.value === memory.current) return prev;
                return [...prev.slice(1), { value: memory.current }];
            });
        }, 0);
        return () => clearTimeout(timeout);
    }, [memory]);

    const maxMemory = memory.total || 1;
    const currentMemory = memory.current || 0;
    const percent = Math.round((currentMemory / maxMemory) * 100);

    return (
        <div className="glass-card rounded-2xl p-6 w-full h-[300px] flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    Memory Usage
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold font-mono text-yellow-600 dark:text-yellow-500">{percent}%</div>
                </div>
            </h3>

            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-4 font-mono">
                <div>
                    Used: <span className="text-gray-800 dark:text-gray-200">{formatBytes(currentMemory)}</span>
                </div>
                <div>
                    Total: <span className="text-gray-800 dark:text-gray-200">{formatBytes(maxMemory)}</span>
                </div>
            </div>

            <div className="flex-1 w-full relative min-h-0">
                <div className="absolute inset-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dataPoints}>
                            <defs>
                                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white dark:bg-zinc-900/90 border border-gray-200 dark:border-white/10 backdrop-blur-md p-2 rounded-lg shadow-xl text-xs font-mono text-yellow-600 dark:text-yellow-400">
                                                {formatBytes(payload[0].value as number)}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#eab308"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorMemory)"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
