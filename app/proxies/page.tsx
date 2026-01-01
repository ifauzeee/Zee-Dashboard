'use client';

import { ProxyGroup } from '@/components/proxies/ProxyGroup';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Loader2, Settings2, ChevronDown, EyeOff, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import { useProxies } from '@/components/hooks/useProxies';
import { useClashStore } from '@/store/useClashStore';
import { useState, useEffect, useRef, useMemo } from 'react';
import { clsx } from 'clsx';
import { LatencyDots } from '@/components/proxies/LatencyDots';
import { useProxyProviders } from '@/components/hooks/useProxyProviders';
import { RefreshCcw } from 'lucide-react';
import { ProxyNode } from '@/components/proxies/ProxyNode';

const ProvidersList = () => {
    const { providers, isLoading, updateProvider, updateAllProviders } = useProxyProviders();
    const { proxySettings } = useClashStore();
    const [expandedProviders, setExpandedProviders] = useState<string[]>([]);

    const toggleProvider = (name: string) => {
        setExpandedProviders(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={() => updateAllProviders()}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-xs text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200 dark:border-white/5"
                >
                    <RefreshCcw className="w-3 h-3" />
                    Update All
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {providers.map((provider) => {
                    const isExpanded = expandedProviders.includes(provider.name);

                    return (
                        <div key={provider.name} className="glass-card rounded-xl overflow-hidden border border-gray-200 dark:border-white/5">
                            <div
                                onClick={() => toggleProvider(provider.name)}
                                className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 shrink-0">
                                            <RefreshCcw className={clsx("w-5 h-5", provider.vehicleType === 'HTTP' ? 'animate-pulse' : '')} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                                {provider.name}
                                            </h3>
                                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                <span className="uppercase bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider">{provider.vehicleType}</span>
                                                <span className="text-gray-400">•</span>
                                                <span>{provider.proxies.length} proxies</span>
                                                <span className="text-gray-400">•</span>
                                                <span className="font-mono">Updated: {new Date(provider.updatedAt).toLocaleString()}</span>
                                            </div>
                                            {!isExpanded && <LatencyDots proxies={provider.proxies} />}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                        <button
                                            onClick={() => updateProvider(provider.name)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                            title="Update Provider"
                                        >
                                            <RefreshCcw className="w-4 h-4" />
                                        </button>
                                        <div className="p-2 text-gray-400">
                                            <ChevronDown className={clsx("w-5 h-5 transition-transform duration-200", isExpanded ? "rotate-180" : "")} />
                                        </div>
                                    </div>
                                </div>

                                {provider.subscriptionInfo && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/5 flex gap-6 text-xs">
                                        <div>
                                            <div className="text-gray-500 uppercase tracking-wider text-[10px] font-bold mb-1">Used</div>
                                            <div className="text-gray-900 dark:text-gray-300 font-mono font-bold">
                                                {(provider.subscriptionInfo.Download / 1024 / 1024 / 1024).toFixed(2)} GB
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 uppercase tracking-wider text-[10px] font-bold mb-1">Total</div>
                                            <div className="text-gray-900 dark:text-gray-300 font-mono font-bold">
                                                {(provider.subscriptionInfo.Total / 1024 / 1024 / 1024).toFixed(2)} GB
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-gray-500 uppercase tracking-wider text-[10px] font-bold mb-1">Progress</div>
                                            <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${Math.min(100, ((provider.subscriptionInfo.Download + provider.subscriptionInfo.Upload) / provider.subscriptionInfo.Total) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-black/20"
                                    >
                                        <div
                                            className="p-4 grid gap-3"
                                            style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${proxySettings?.cardMinWidth || 140}px, 1fr))` }}
                                        >
                                            {provider.proxies.map((proxy) => (
                                                <ProxyNode
                                                    key={proxy.name}
                                                    {...proxy}
                                                    isActive={false}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function ProxiesPage() {
    const { proxyGroups, isLoading, checkProxyDelay } = useProxies();
    const { proxySettings, setProxySettings } = useClashStore();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
    const settingsRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);
    const [view, setView] = useState<'proxies' | 'providers'>('proxies');

    useEffect(() => {
        if (proxyGroups.length > 0 && !isInitialized.current) {
            const groupNames = proxyGroups.map(g => g.name);
            setTimeout(() => setExpandedGroups(groupNames), 0);
            isInitialized.current = true;
        }
    }, [proxyGroups]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const processedProxyGroups = useMemo(() => {
        if (!proxyGroups) return [];
        return proxyGroups.map(group => {
            let sortedProxies = [...group.proxies];
            if (proxySettings?.hideUnavailable) {
                sortedProxies = sortedProxies.filter(p => p.delay > 0 && p.delay < 10000);
            }
            if (proxySettings?.sortBy === 'name') {
                sortedProxies.sort((a, b) => a.name.localeCompare(b.name));
            } else if (proxySettings?.sortBy === 'delay') {
                sortedProxies.sort((a, b) => {
                    const delayA = (a.delay && a.delay > 0) ? a.delay : 999999;
                    const delayB = (b.delay && b.delay > 0) ? b.delay : 999999;
                    return delayA - delayB;
                });
            }
            return { ...group, proxies: sortedProxies };
        });
    }, [proxyGroups, proxySettings]);

    const toggleGroup = (name: string) => {
        setExpandedGroups(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        );
    };

    const expandAll = () => setExpandedGroups(proxyGroups.map(g => g.name));
    const collapseAll = () => setExpandedGroups([]);

    return (
        <div className="space-y-6 pb-20 relative">
            <div className="flex justify-between items-end">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white flex gap-4 items-center"
                    >
                        <span
                            className={`cursor-pointer transition-opacity ${view === 'proxies' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                            onClick={() => setView('proxies')}
                        >
                            Proxies
                        </span>
                        <span className="text-gray-600 text-2xl font-light">/</span>
                        <span
                            className={`cursor-pointer transition-opacity ${view === 'providers' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                            onClick={() => setView('providers')}
                        >
                            Providers
                        </span>
                    </motion.h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {view === 'proxies' ? 'Manage your proxy groups and selectors' : 'Manage proxy providers and subscriptions'}
                    </p>
                </div>

                {view === 'proxies' && (
                    <div className="flex gap-2 relative">
                        <button
                            onClick={expandedGroups.length === 0 ? expandAll : collapseAll}
                            className="p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                            title={expandedGroups.length === 0 ? "Expand All" : "Collapse All"}
                        >
                            {expandedGroups.length === 0 ? <ArrowDownToLine className="w-5 h-5" /> : <ArrowUpToLine className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className={`p-2 rounded-lg transition-colors ${isSettingsOpen ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'}`}
                        >
                            <Settings2 className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => {
                                const uniqueProxies = new Set<string>();
                                proxyGroups.forEach(group => {
                                    group.proxies.forEach(proxy => {
                                        uniqueProxies.add(proxy.name);
                                    });
                                });
                                uniqueProxies.forEach(name => checkProxyDelay(name));
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg shadow-blue-600/20 active:scale-95 duration-100"
                        >
                            <Zap className="w-4 h-4" />
                            <span className="hidden sm:inline">Test Latency</span>
                        </button>

                        <AnimatePresence>
                            {isSettingsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    ref={settingsRef}
                                    className="absolute right-0 top-12 w-80 glass-card rounded-xl p-4 z-50 shadow-2xl border border-gray-200 dark:border-white/10 backdrop-blur-xl bg-white dark:bg-black/90"
                                >
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Proxy Settings</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-700 dark:text-gray-300 block">Sort by</label>
                                            <select
                                                value={proxySettings?.sortBy || 'original'}
                                                onChange={(e) => setProxySettings({ sortBy: e.target.value as 'original' | 'name' | 'delay' })}
                                                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                                            >
                                                <option className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white" value="original">Original</option>
                                                <option className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white" value="name">Name</option>
                                                <option className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white" value="delay">Latency</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Group proxies by provider</span>
                                            <button
                                                onClick={() => setProxySettings({ groupByProvider: !proxySettings?.groupByProvider })}
                                                className={`w-10 h-6 rounded-full transition-colors relative ${proxySettings?.groupByProvider ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white/10'}`}
                                            >
                                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${proxySettings?.groupByProvider ? 'translate-x-4' : ''}`} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Hide unavailable proxies</span>
                                            <button
                                                onClick={() => setProxySettings({ hideUnavailable: !proxySettings?.hideUnavailable })}
                                                className={`w-10 h-6 rounded-full transition-colors relative ${proxySettings?.hideUnavailable ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white/10'}`}
                                            >
                                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${proxySettings?.hideUnavailable ? 'translate-x-4' : ''}`} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Auto disconnect on switch</span>
                                            <button
                                                onClick={() => setProxySettings({ autoDisconnect: !proxySettings?.autoDisconnect })}
                                                className={`w-10 h-6 rounded-full transition-colors relative ${proxySettings?.autoDisconnect ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white/10'}`}
                                            >
                                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${proxySettings?.autoDisconnect ? 'translate-x-4' : ''}`} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Show final outbound node</span>
                                            <button
                                                onClick={() => setProxySettings({ showOutbound: !proxySettings?.showOutbound })}
                                                className={`w-10 h-6 rounded-full transition-colors relative ${proxySettings?.showOutbound ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white/10'}`}
                                            >
                                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${proxySettings?.showOutbound ? 'translate-x-4' : ''}`} />
                                            </button>
                                        </div>

                                        <div className="pt-2 border-t border-gray-200 dark:border-white/5">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-700 dark:text-gray-300">Proxy card min width</span>
                                                <span className="text-gray-500">{proxySettings?.cardMinWidth || 140}px</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="100"
                                                max="300"
                                                step="10"
                                                value={proxySettings?.cardMinWidth || 140}
                                                onChange={(e) => setProxySettings({ cardMinWidth: parseInt(e.target.value) })}
                                                className="w-full accent-blue-500 h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>

                                        <button className="w-full py-2 flex items-center justify-center gap-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-sm text-gray-700 dark:text-gray-300 transition-colors">
                                            <EyeOff className="w-4 h-4" />
                                            Manage hidden groups
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {view === 'proxies' ? (
                isLoading && proxyGroups.length === 0 ? (
                    <div className="flex justify-center items-center h-64 text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {processedProxyGroups.map((group) => (
                            <ProxyGroup
                                key={group.name}
                                {...group}
                                now={group.now}
                                isExpanded={expandedGroups.includes(group.name)}
                                onToggle={() => toggleGroup(group.name)}
                            />
                        ))}
                        {proxyGroups.length === 0 && (
                            <div className="text-center text-gray-400 py-10">
                                No proxy groups found. Check your config connection.
                            </div>
                        )}
                    </div>
                )
            ) : (
                <ProvidersList />
            )}
        </div>
    );
}