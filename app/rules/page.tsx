'use client';

import { motion } from 'framer-motion';
import { Loader2, Shield } from 'lucide-react';
import { useRules } from '@/components/hooks/useRules';
import { useState } from 'react';

import { RefreshCcw } from 'lucide-react';
import { useRuleProviders } from '@/components/hooks/useRuleProviders';

const ProvidersList = () => {
    const { providers, isLoading, updateProvider, updateAllProviders } = useRuleProviders();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (providers.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12">
                No rule providers found.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {providers.map((provider) => (
                    <div key={provider.name} className="glass-card p-4 rounded-xl space-y-3 border border-gray-200 dark:border-white/5">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]" title={provider.name}>
                                    {provider.name}
                                </h3>
                                <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                    <span className="uppercase bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded text-[10px] text-gray-600 dark:text-gray-300">{provider.behavior}</span>
                                    <span>{provider.ruleCount} rules</span>
                                </div>
                            </div>
                            <button
                                onClick={() => updateProvider(provider.name)}
                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                title="Update Provider"
                            >
                                <RefreshCcw className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="text-[10px] text-gray-400 dark:text-gray-600 font-mono pt-2 border-t border-gray-200 dark:border-white/5">
                            Updated: {new Date(provider.updatedAt).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function RulesPage() {
    const { rules, isLoading } = useRules();
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'rules' | 'providers'>('rules');

    const filteredRules = rules.filter(rule =>
        rule.payload.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.proxy.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white flex gap-4 items-center"
                    >
                        <span
                            className={`cursor-pointer transition-opacity ${view === 'rules' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                            onClick={() => setView('rules')}
                        >
                            Rules
                        </span>
                        <span className="text-gray-600 text-2xl font-light">/</span>
                        <span
                            className={`cursor-pointer transition-opacity ${view === 'providers' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                            onClick={() => setView('providers')}
                        >
                            Providers
                        </span>
                    </motion.h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Traffic routing rules and providers</p>
                </div>

                {view === 'rules' && (
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search rules..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
                        />
                    </div>
                )}
            </div>

            {view === 'rules' ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Payload</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Proxy</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-500" />
                                        </td>
                                    </tr>
                                ) : filteredRules.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-gray-500">
                                            No rules found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRules.map((rule, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <span className="px-2 py-1 rounded bg-gray-100 dark:bg-white/5 text-xs text-blue-500 dark:text-blue-400 font-mono font-bold uppercase">
                                                    {rule.type}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-700 dark:text-gray-300 font-mono text-sm">
                                                {rule.payload}
                                            </td>
                                            <td className="p-4 text-gray-700 dark:text-gray-300 font-mono text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-3 h-3 text-purple-400" />
                                                    <span className={rule.proxy === 'REJECT' ? 'text-red-400' : 'text-green-400'}>
                                                        {rule.proxy}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!isLoading && (
                        <div className="p-4 border-t border-gray-200 dark:border-white/5 text-xs text-gray-500 text-center">
                            Total {rules.length} rules
                        </div>
                    )}
                </motion.div>
            ) : (
                <ProvidersList />
            )}
        </div>
    );
}
