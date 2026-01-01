'use client';

import { useRef } from 'react';
import { ArrowDown, ArrowUp, Activity, Server, Zap, Shield, Globe } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TrafficChart } from '@/components/dashboard/TrafficChart';
import { MemoryChart } from '@/components/dashboard/MemoryChart';
import { ConnectionTable } from '@/components/dashboard/ConnectionTable';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useConnections } from '@/components/hooks/useConnections';
import { useClashConfig } from '@/components/hooks/useClashConfig';
import { useSystemStats } from '@/components/hooks/useSystemStats';

function formatBytes(bytes: number) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function Home() {
    const container = useRef(null);
    const { connections, uploadTotal, downloadTotal } = useConnections();
    const { config, updateConfig, reloadConfig, flushFakeIP, restartCore, updateProviders } = useClashConfig();
    const { memory } = useSystemStats();

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.header-content', {
            y: -30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        })
            .from('.mode-toggle', {
                x: 30,
                opacity: 0,
                duration: 0.8
            }, '-=0.6')
            .from('.stats-card', {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1
            }, '-=0.4')
            .from('.main-grid', {
                y: 30,
                opacity: 0,
                duration: 0.6
            }, '-=0.2');

    }, { scope: container });

    const handleModeChange = (mode: string) => {
        updateConfig({ mode: mode.toLowerCase() as 'global' | 'rule' | 'direct' | 'script' });
    };

    const memoryPercent = memory.total > 0 ? Math.round((memory.current / memory.total) * 100) : 0;

    return (
        <div ref={container} className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="header-content">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-white animate-gradient bg-[length:200%_auto]">
                        System Overview
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        System Operational • v2.4.0-stable
                    </p>
                </div>

                <div className="mode-toggle bg-gray-100 dark:bg-black/20 backdrop-blur-xl p-1.5 rounded-xl border border-gray-200 dark:border-white/5 flex gap-1">
                    {['Global', 'Rule', 'Direct', 'Script'].map((mode) => {
                        const isActive = config?.mode.toLowerCase() === mode.toLowerCase();
                        return (
                            <button
                                key={mode}
                                onClick={() => handleModeChange(mode)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group ${isActive
                                    ? 'text-white scale-105 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500" />
                                )}
                                <span className="relative z-10">{mode}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stats-card">
                    <StatsCard
                        title="Session Download"
                        value={formatBytes(downloadTotal)}
                        icon={ArrowDown}
                        trend="Active"
                        trendUp={true}
                        color="text-blue-500"
                    />
                </div>
                <div className="stats-card">
                    <StatsCard
                        title="Session Upload"
                        value={formatBytes(uploadTotal)}
                        icon={ArrowUp}
                        trend="Active"
                        trendUp={true}
                        color="text-purple-500"
                    />
                </div>
                <div className="stats-card">
                    <StatsCard
                        title="Active Connections"
                        value={connections.length.toString()}
                        icon={Activity}
                        trend="Live"
                        trendUp={connections.length > 0}
                        color="text-emerald-500"
                    />
                </div>
                <div className="stats-card">
                    <StatsCard
                        title="Memory Usage"
                        value={formatBytes(memory.current)}
                        icon={Server}
                        color="text-orange-500"
                        trend={memoryPercent > 0 ? `${memoryPercent}%` : 'N/A'}
                        trendUp={memoryPercent < 80}
                    />
                </div>
            </div>

            <div className="main-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <TrafficChart />
                    <ConnectionTable />
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-2xl flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            Quick Actions
                        </h3>

                        <div className="space-y-3 flex-1">
                            {[
                                { label: 'Flush DNS Cache', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', action: flushFakeIP },
                                { label: 'Update Providers', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', action: updateProviders },
                                { label: 'Reload Config', icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', action: reloadConfig },
                                { label: 'MITM Enabled', icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', action: () => { } },
                                { label: 'Restart Service', icon: Server, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', action: restartCore },
                            ].map((action) => (
                                <button
                                    key={action.label}
                                    onClick={action.action}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 hover:translate-x-1 transition-all border border-gray-200 dark:border-white/5 group relative overflow-hidden"
                                >
                                    <div className={`p-2.5 rounded-lg ${action.bg} ${action.color} ring-1 ring-inset ${action.border}`}>
                                        <action.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                            {action.label}
                                        </span>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">Click to execute</span>
                                    </div>
                                    <div className={`absolute right-0 top-0 bottom-0 w-1 ${action.bg.replace('/10', '/50')} opacity-0 group-hover:opacity-100 transition-opacity`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <MemoryChart />
                </div>
            </div>
        </div>
    );
}