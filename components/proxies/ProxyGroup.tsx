'use client';

import { useState, useEffect } from 'react';
import { ProxyNode } from './ProxyNode';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap } from 'lucide-react';
import { useClashStore } from '@/store/useClashStore';
import { LatencyDots } from './LatencyDots';

interface ProxyGroupProps {
    name: string;
    type: string;
    now: string;
    proxies: Array<{ name: string; type: string; delay: number }>;
    isExpanded: boolean;
    onToggle: () => void;
}

export function ProxyGroup({ name, type, now, proxies, isExpanded, onToggle }: ProxyGroupProps) {
    const { host, port, secret, proxySettings } = useClashStore();
    const [current, setCurrent] = useState(now);

    useEffect(() => {
        setCurrent(now);
    }, [now]);

    const handleProxySelect = async (proxyName: string) => {
        setCurrent(proxyName);

        try {
            const target = `http://${host}:${port}/proxies/${encodeURIComponent(name)}`;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(target)}`;

            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
            if (secret) headers['Authorization'] = `Bearer ${secret}`;

            await fetch(proxyUrl, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({ name: proxyName })
            });
        } catch (err) {
            console.error('Failed to switch proxy:', err);
        }
    };

    const currentProxy = proxies.find(p => p.name === current);

    const getDelayColor = (ms: number) => {
        if (!ms) return 'text-gray-500';
        if (ms < 100) return 'text-green-400';
        if (ms < 300) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 overflow-hidden"
        >
            <div className="flex justify-between items-center mb-6 cursor-pointer" onClick={onToggle}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-500">
                            <span>{type}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1.5 font-mono">
                                <span className="text-blue-400 font-mono">{current}</span>
                                {currentProxy && currentProxy.delay > 0 && (
                                    <span className={getDelayColor(currentProxy.delay)}>
                                        ({currentProxy.delay}ms)
                                    </span>
                                )}
                            </div>
                            <span>•</span>
                            <span>{proxies.length} nodes</span>
                        </div>
                        {!isExpanded && <LatencyDots proxies={proxies} />}
                    </div>
                </div>

                <button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(var(--card-min-width,140px),1fr))]"
                        style={{
                            '--card-min-width': `${proxySettings?.cardMinWidth || 140}px`
                        } as React.CSSProperties}
                    >
                        {proxies.map((proxy) => (
                            <ProxyNode
                                key={proxy.name}
                                {...proxy}
                                isActive={current === proxy.name}
                                onClick={() => type === 'Selector' ? handleProxySelect(proxy.name) : undefined}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
