'use client';

import { ProxyGroup } from '@/components/proxies/ProxyGroup';
import { motion } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';
import { useProxies } from '@/components/hooks/useProxies';

export default function ProxiesPage() {
    const { proxyGroups, isLoading } = useProxies();

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-white"
                    >
                        Proxies
                    </motion.h1>
                    <p className="text-gray-400 mt-1">Manage your proxy groups and selectors</p>
                </div>

                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg shadow-blue-600/20">
                        <Zap className="w-4 h-4" />
                        <span>Test Latency</span>
                    </button>
                </div>
            </div>

            {isLoading && proxyGroups.length === 0 ? (
                <div className="flex justify-center items-center h-64 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : (
                <div className="space-y-6">
                    {proxyGroups.map((group) => (
                        <ProxyGroup key={group.name} {...group} now={group.now} />
                    ))}
                    {proxyGroups.length === 0 && (
                        <div className="text-center text-gray-400 py-10">
                            No proxy groups found. Check your config connection.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
