'use client';

import { useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTraffic } from '@/components/hooks/useTraffic';
import { useTheme } from '@/components/providers/ThemeProvider';

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export function TrafficChart() {
    const containerRef = useRef(null);
    const { current, history } = useTraffic();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    useGSAP(() => {
        gsap.from(containerRef.current, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
        });
    }, { scope: containerRef });

    const gridColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)';
    const axisColor = isDark ? '#52525b' : '#94a3b8';

    return (
        <div
            ref={containerRef}
            className="glass-card p-6 rounded-2xl h-[400px] w-full flex flex-col"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        Traffic Overview
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    </h3>
                    <div className="flex gap-4 mt-2">
                        <div className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400 block text-xs">Download</span>
                            <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">
                                {formatBytes(current.down)}
                            </span>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400 block text-xs">Upload</span>
                            <span className="text-purple-600 dark:text-purple-400 font-mono font-bold">
                                {formatBytes(current.up)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 text-sm bg-gray-100 dark:bg-black/20 p-1.5 rounded-lg border border-gray-200 dark:border-white/5">
                    <div className="flex items-center gap-2 px-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">DL</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 border-l border-gray-300 dark:border-white/10">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">UL</span>
                    </div>
                </div>
            </div>

            <div className="w-full flex-1 min-h-0 relative">
                <div className="absolute inset-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history.length > 0 ? history : [{ name: '', up: 0, down: 0 }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke={axisColor}
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                            />
                            <YAxis
                                stroke={axisColor}
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value > 1024 ? (value / 1024).toFixed(0) + 'K' : value}`}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white dark:bg-zinc-900/90 border border-gray-200 dark:border-white/10 backdrop-blur-md p-3 rounded-xl shadow-xl">
                                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">{label}</p>
                                                <p className="text-blue-600 dark:text-blue-400 text-sm font-mono">
                                                    ↓ {formatBytes(payload[0].value as number)}
                                                </p>
                                                <p className="text-purple-600 dark:text-purple-400 text-sm font-mono">
                                                    ↑ {formatBytes(payload[1].value as number)}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="down"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorDown)"
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#60a5fa' }}
                                animationDuration={300}
                            />
                            <Area
                                type="monotone"
                                dataKey="up"
                                stroke="#a855f7"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorUp)"
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#c084fc' }}
                                animationDuration={300}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
